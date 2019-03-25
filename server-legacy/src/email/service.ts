export interface EmailService {
  basicSend(to: string, subject: string, body: string): Promise<void>
}
