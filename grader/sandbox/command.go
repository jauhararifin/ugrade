package sandbox

import (
	"github.com/spf13/cobra"
)

var sandboxCmd = &cobra.Command{
	Use:          "sandbox",
	SilenceUsage: true,
}

func init() {
	sandboxCmd.AddCommand(guardCmd)
	sandboxCmd.AddCommand(jailCmd)
}

// BindCommand add command to cobra path in order to sandboxing process. The `cmd` argument should be your root command.
func BindCommand(cmd *cobra.Command) {
	cmd.AddCommand(sandboxCmd)
}
