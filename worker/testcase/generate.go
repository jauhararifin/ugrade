package testcase

import (
	"context"
	"crypto/md5"
	"fmt"
	"io"
	"os"
	"path"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (*defaultGenerator) hashSpecTestcase(spec worker.JobSpec) (string, error) {
	// TODO: just simple hash, fix this.
	hash := md5.New()

	tcgenF, err := os.Open(spec.TCGen.Path)
	if err != nil {
		return "", errors.Wrap(err, "cannot open testcase generator source code")
	}
	defer tcgenF.Close()
	if _, err := io.Copy(hash, tcgenF); err != nil {
		return "", errors.Wrap(err, "cannot copy testcase generator source code to hasher")
	}

	juryF, err := os.Open(spec.Solution.Path)
	if err != nil {
		return "", errors.Wrap(err, "cannot open jury solution source code")
	}
	defer juryF.Close()
	if _, err := io.Copy(hash, juryF); err != nil {
		return "", errors.Wrap(err, "cannot copy jury source code to hasher")
	}

	hashval := hash.Sum(nil)
	return fmt.Sprintf("%x", hashval), nil
}

func (gen *defaultGenerator) Generate(ctx context.Context, spec worker.JobSpec) (*Suite, error) {
	// compile testcase generator
	logrus.WithField("source", spec.TCGen).Debug("compile testcase generator")
	compiledTCGen, err := gen.compiler.Compile(ctx, spec.TCGen)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile testcase generator")
	}
	logrus.WithField("result", compiledTCGen).Debug("testcase generator compiled")

	// compile jury solution
	logrus.WithField("source", spec.Solution).Debug("compile jury solution")
	compiledSol, err := gen.compiler.Compile(ctx, spec.Solution)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile jury solution")
	}
	logrus.WithField("result", compiledTCGen).Debug("jury solution compiled")

	// get sample testcase count
	logrus.Debug("get testcase sample count")
	nsamp, err := gen.getTCSampleCount(ctx, *compiledTCGen, spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get testcase sample count")
	}
	logrus.WithField("nSample", nsamp).Debug("use testcase sample count")

	// get real testcase count
	logrus.Debug("get real testcase count")
	ntc, err := gen.getTCCount(ctx, *compiledTCGen, spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get real testcase count")
	}
	logrus.WithField("nTC", ntc).Debug("use real testcase count")

	// create temporary directory for storing testcase
	dir, err := gen.hashSpecTestcase(spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot calculate spec hash")
	}
	dir = path.Join(os.TempDir(), "ugrade-testcase-"+dir)
	if err := os.MkdirAll(dir, 744); err != nil {
		return nil, errors.Wrap(err, "cannot create temporary directory for storing testcases")
	}

	// initialize items and max usage
	maxUsage := sandbox.Usage{}
	items := make([]Item, 0, 0)

	// generata sample testcase
	for i := 1; i <= nsamp; i++ {
		logrus.WithField("id", i).Trace("generate sample testcase item")
		item, usage, err := gen.generateItem(ctx, dir, *compiledTCGen, *compiledSol, spec, i, true)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot generate sample testcase item with id: %d", i)
		}
		if usage.Memory > maxUsage.Memory {
			maxUsage.Memory = usage.Memory
		}
		if usage.CPU > maxUsage.CPU {
			maxUsage.CPU = usage.CPU
		}
		items = append(items, *item)
		logrus.
			WithField("item", *item).
			WithField("usage", *usage).
			WithField("maxUsage", maxUsage).
			Trace("sample testcase item generated")
	}

	// generate real testcase
	for i := 1; i <= ntc; i++ {
		logrus.WithField("id", i).Trace("generate real testcase item")
		item, usage, err := gen.generateItem(ctx, dir, *compiledTCGen, *compiledSol, spec, i, false)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot generate real testcase item with id: %d", i)
		}
		if usage.Memory > maxUsage.Memory {
			maxUsage.Memory = usage.Memory
		}
		if usage.CPU > maxUsage.CPU {
			maxUsage.CPU = usage.CPU
		}
		items = append(items, *item)
		logrus.
			WithField("item", *item).
			WithField("usage", *usage).
			WithField("maxUsage", maxUsage).
			Trace("real testcase item generated")
	}

	return &Suite{
		MaxMemory: maxUsage.Memory,
		MaxCPU:    maxUsage.CPU,
		Tolerance: spec.Tolerance,
		Items:     items,
		Dir:       dir,
	}, nil
}
