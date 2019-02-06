export interface ServerStatusService {
    getClock(): Promise<Date>
}