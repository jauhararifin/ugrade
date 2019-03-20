import { createLogger, format, transports } from 'winston'

export const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

export const logger = createLogger({
  format: format.combine(format.timestamp(), format.splat(), format.prettyPrint()),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
})
