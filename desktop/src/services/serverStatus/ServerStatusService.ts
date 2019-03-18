export interface ServerStatusService {
  getClock(): Promise<Date>
  ping(): Promise<void>
}
