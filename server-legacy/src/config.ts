import { AnnouncementService } from './announcement'
import { InMemoryAnnouncementService } from './announcement/inmemory'
import { AuthService } from './auth'
import { InMemoryAuthService } from './auth/inmemory'
import { ClarificationService } from './clarification'
import { InMemoryClarificationService } from './clarification/inmemory/inmemory'
import { ContestService } from './contest'
import { InMemoryContestService } from './contest/inmemory'
import { EmailService } from './email'
import { InMemoryEmailService } from './email/inmemory'
import { LanguageService } from './language'
import { InMemoryLanguageService } from './language/inmemory'
import { InMemoryProblemService } from './problem/inmemory'
import { ProblemService } from './problem/service'
import { ProfileService } from './profile'
import { InMemoryProfileService } from './profile/inmemory'
import { SubmissionService } from './submission'
import { InMemorySubmissionService } from './submission/inmemory'

export interface Config {
  debug: boolean
  emailService: EmailService
  authService: AuthService
  languageService: LanguageService
  profileService: ProfileService
  contestService: ContestService
  announcementService: AnnouncementService
  clarificationService: ClarificationService
  problemService: ProblemService
  submissionService: SubmissionService
}

async function initDevConfig(): Promise<Config> {
  const emailService = new InMemoryEmailService()
  const authService = new InMemoryAuthService(emailService)
  const languageService = new InMemoryLanguageService()
  const profileService = new InMemoryProfileService(authService)
  const contestService = new InMemoryContestService(authService, languageService)
  const announcementService = new InMemoryAnnouncementService(authService)
  const clarificationService = new InMemoryClarificationService(authService)
  const problemService = new InMemoryProblemService(authService, contestService)
  const submissionService = new InMemorySubmissionService(authService, contestService, problemService)
  return {
    debug: true,
    emailService,
    authService,
    languageService,
    profileService,
    contestService,
    announcementService,
    clarificationService,
    problemService,
    submissionService,
  }
}

async function initStagingConfig(): Promise<Config> {
  // TODO: configure staging config
  return initDevConfig()
}

async function initProdConfig(): Promise<Config> {
  // TODO: configure production config
  return initDevConfig()
}

export async function initializeConfig(): Promise<Config> {
  if (process.env.NODE_ENV === 'production') return initProdConfig()
  else if (process.env.NODE_ENV === 'staging') return initStagingConfig()
  return initDevConfig()
}
