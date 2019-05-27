package tcgenerator

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (gen *defaultGenerator) saveConfig(suite jobsolver.TCSuite) error {
	saveFile, err := os.Create(path.Join(suite.Dir, "config"))
	if err != nil {
		return xerrors.Errorf("cannot create testcase config file: %w", err)
	}
	defer saveFile.Close()
	fmt.Fprintf(saveFile, "%d %d %.8f\n", suite.MaxMemory, suite.MaxCPU, suite.Tolerance)
	for _, item := range suite.Items {
		fmt.Fprintln(saveFile, item.Input)
		fmt.Fprintln(saveFile, item.Output)
	}
	return nil
}

func (gen *defaultGenerator) loadConfig(dir string) (*jobsolver.TCSuite, error) {
	// open configuration file
	configFile, err := os.Open(path.Join(dir, "config"))
	if err != nil {
		return nil, xerrors.Errorf("cannot read testcase config: %w", err)
	}

	// read memory usage
	var memory uint64
	fmt.Fscan(configFile, &memory)

	// read cpu usage
	var cpu time.Duration
	fmt.Fscan(configFile, &cpu)

	// read tolerance factor
	var tolerance float64
	fmt.Fscan(configFile, &tolerance)

	// read testcase items
	items := make([]jobsolver.TCItem, 0, 0)
	reader := bufio.NewReader(configFile)
	for {
		input, _, _ := reader.ReadLine()
		output, _, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		items = append(items, jobsolver.TCItem{
			Input:  string(input),
			Output: string(output),
		})
	}

	return &jobsolver.TCSuite{
		MaxMemory: memory,
		MaxCPU:    cpu,
		Tolerance: tolerance,
		Items:     items,
		Dir:       dir,
	}, nil
}

func (gen *defaultGenerator) Generate(ctx context.Context, spec ugrade.JobSpec) (*jobsolver.TCSuite, error) {
	// determine directory location for storing testcases
	dir, err := gen.hashSpecTestcase(spec)
	if err != nil {
		return nil, xerrors.Errorf("cannot calculate spec hash: %w", err)
	}
	dir = path.Join(os.TempDir(), "ugrade-testcase-"+dir)

	// checks directory existence. if directory exists, load testcase from that directory
	// create new directory if directory could not be found.
	stat, err := os.Stat(dir)
	if err != nil {
		// create temporary directory for storing testcase
		if os.IsNotExist(err) {
			if err := os.MkdirAll(dir, 744); err != nil {
				return nil, xerrors.Errorf("cannot create temporary directory for storing testcases: %w", err)
			}
		} else {
			return nil, xerrors.Errorf("cannot stat testcases directory: %w", err)
		}
	} else {
		if !stat.IsDir() {
			return nil, xerrors.Errorf("testcases directory found but its not a directory: %w", err)
		}
		res, err := gen.loadConfig(dir)
		if err == nil {
			return res, nil
		}
		logrus.WithField("error", err).Warn("cannot load testcase from directory")

		// if we cannot load testcase from cache, remove cache, and build cache
		os.RemoveAll(dir)
	}

	// compile testcase generator
	logrus.WithField("source", spec.TCGen).Debug("compile testcase generator")
	compiledTCGen, err := gen.compiler.Compile(ctx, spec.TCGen)
	if err != nil {
		return nil, xerrors.Errorf("cannot compile testcase generator: %w", err)
	}
	logrus.WithField("result", compiledTCGen).Debug("testcase generator compiled")

	// remove compilation directory after finish
	// TODO: check for error
	defer os.RemoveAll(compiledTCGen.ExecDir)

	// compile jury solution
	logrus.WithField("source", spec.Solution).Debug("compile jury solution")
	compiledSol, err := gen.compiler.Compile(ctx, spec.Solution)
	if err != nil {
		return nil, xerrors.Errorf("cannot compile jury solution: %w", err)
	}
	logrus.WithField("result", compiledTCGen).Debug("jury solution compiled")

	// remove jury solution binary directory after finish
	// TODO: check for error
	defer os.RemoveAll(compiledSol.ExecDir)

	// get sample testcase count
	logrus.Debug("get testcase sample count")
	nsamp, err := gen.getTCSampleCount(ctx, *compiledTCGen, spec)
	if err != nil {
		return nil, xerrors.Errorf("cannot get testcase sample count: %w", err)
	}
	logrus.WithField("nSample", nsamp).Debug("use testcase sample count")

	// get real testcase count
	logrus.Debug("get real testcase count")
	ntc, err := gen.getTCCount(ctx, *compiledTCGen, spec)
	if err != nil {
		return nil, xerrors.Errorf("cannot get real testcase count: %w", err)
	}
	logrus.WithField("nTC", ntc).Debug("use real testcase count")

	// initialize items and max usage
	maxUsage := ugrade.Usage{}
	items := make([]jobsolver.TCItem, 0, 0)

	// generata sample testcase
	logrus.WithField("count", nsamp).Debug("generate sample testcase")
	for i := 1; i <= nsamp; i++ {
		logrus.WithField("id", i).Trace("generate sample testcase item")
		item, usage, err := gen.generateItem(ctx, dir, *compiledTCGen, *compiledSol, spec, i, true)
		if err != nil {
			return nil, xerrors.Errorf("cannot generate sample testcase item with id: %d : %w", i, err)
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
	logrus.WithField("count", ntc).Debug("generate real testcase")
	for i := 1; i <= ntc; i++ {
		logrus.WithField("id", i).Trace("generate real testcase item")
		item, usage, err := gen.generateItem(ctx, dir, *compiledTCGen, *compiledSol, spec, i, false)
		if err != nil {
			return nil, xerrors.Errorf("cannot generate real testcase item with id: %d: %w", i, err)
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

	result := &jobsolver.TCSuite{
		MaxMemory: maxUsage.Memory,
		MaxCPU:    maxUsage.CPU,
		Tolerance: spec.Tolerance,
		Items:     items,
		Dir:       dir,
	}
	if err := gen.saveConfig(*result); err != nil {
		return nil, xerrors.Errorf("cannot save testcase config: %w", err)
	}

	return result, nil
}
