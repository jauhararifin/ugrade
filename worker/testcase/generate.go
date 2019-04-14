package testcase

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (gen *defaultGenerator) saveConfig(suite Suite) error {
	saveFile, err := os.Create(path.Join(suite.Dir, "config"))
	if err != nil {
		return errors.Wrap(err, "cannot create testcase config file")
	}
	defer saveFile.Close()
	fmt.Fprintf(saveFile, "%d %d %.8f\n", suite.MaxMemory, suite.MaxCPU, suite.Tolerance)
	for _, item := range suite.Items {
		fmt.Fprintln(saveFile, item.Input)
		fmt.Fprintln(saveFile, item.Output)
	}
	return nil
}

func (gen *defaultGenerator) loadConfig(dir string) (*Suite, error) {
	// open configuration file
	configFile, err := os.Open(path.Join(dir, "config"))
	if err != nil {
		return nil, errors.Wrap(err, "cannot read testcase config")
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
	items := make([]Item, 0, 0)
	reader := bufio.NewReader(configFile)
	for {
		input, _, _ := reader.ReadLine()
		output, _, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		items = append(items, Item{
			Input:  string(input),
			Output: string(output),
		})
	}

	return &Suite{
		MaxMemory: memory,
		MaxCPU:    cpu,
		Tolerance: tolerance,
		Items:     items,
		Dir:       dir,
	}, nil
}

func (gen *defaultGenerator) Generate(ctx context.Context, spec worker.JobSpec) (*Suite, error) {
	// determine directory location for storing testcases
	dir, err := gen.hashSpecTestcase(spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot calculate spec hash")
	}
	dir = path.Join(os.TempDir(), "ugrade-testcase-"+dir)

	// checks directory existency. if directory exists, load testcase from that directory
	// create new directory if directory could not be found.
	stat, err := os.Stat(dir)
	if err != nil {
		// create temporary directory for storing testcase
		if os.IsNotExist(err) {
			if err := os.MkdirAll(dir, 744); err != nil {
				return nil, errors.Wrap(err, "cannot create temporary directory for storing testcases")
			}
		} else {
			return nil, errors.Wrap(err, "cannot stat testcases directory")
		}
	} else {
		if !stat.IsDir() {
			return nil, errors.Wrap(err, "testcases directory found but its not a directory")
		}
		return gen.loadConfig(dir)
	}

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

	// initialize items and max usage
	maxUsage := sandbox.Usage{}
	items := make([]Item, 0, 0)

	// generata sample testcase
	logrus.WithField("count", nsamp).Debug("generate sample testcase")
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
	logrus.WithField("count", ntc).Debug("generate real testcase")
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

	result := &Suite{
		MaxMemory: maxUsage.Memory,
		MaxCPU:    maxUsage.CPU,
		Tolerance: spec.Tolerance,
		Items:     items,
		Dir:       dir,
	}
	if err := gen.saveConfig(*result); err != nil {
		return nil, errors.Wrap(err, "cannot save testcase config")
	}

	return result, nil
}
