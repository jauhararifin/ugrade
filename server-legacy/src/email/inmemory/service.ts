import { EmailService } from '../service'

export class InMemoryEmailService implements EmailService {
  async basicSend(to: string, subject: string, body: string): Promise<void> {
    console.info(`Sending Email to: ${to}, subject: ${subject}, body:${body}`)
  }
}
