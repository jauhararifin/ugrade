import ApolloClient from 'apollo-boost'
import { AnnouncementService } from './services/announcement'
import { InMemoryAnnouncementService } from './services/announcement/InMemoryAnnouncementService'
import { AuthService } from './services/auth'
import { GraphqlAuthService } from './services/auth/GraphqlAuthService/GraphqlAuthService'
import { InMemoryAuthService } from './services/auth/InMemoryAuthService'
import { ClarificationService } from './services/clarification'
import { InMemoryClarificationService } from './services/clarification/InMemoryClarificationService'
import { ContestService } from './services/contest'
import { GraphqlContestService } from './services/contest/GraphqlContestService'
import { InMemoryContestService } from './services/contest/InMemoryContestService'
import { ProblemService } from './services/problem'
import { InMemoryProblemService } from './services/problem/InMemoryProblemService'
import { ScoreboardService } from './services/scoreboard'
import { GraphqlScoreboardService } from './services/scoreboard/GraphqlScoreboardService'
import { InMemoryScoreboardService } from './services/scoreboard/InMemoryScoreboardService'
import { ServerStatusService } from './services/serverStatus'
import { InMemoryServerStatusService } from './services/serverStatus/InMemoryServerStatusService'
import { SubmissionService } from './services/submission'
import { InMemorySubmissionService } from './services/submission/InMemorySubmissionService'
import { UserService } from './services/user'
import { InMemoryUserService } from './services/user/InMemoryUserService'

export interface Config {
  serverStatusService: ServerStatusService
  authService: AuthService
  userService: UserService
  problemService: ProblemService
  announcementService: AnnouncementService
  clarificationService: ClarificationService
  contestService: ContestService
  submissionService: SubmissionService
  scoreboardService: ScoreboardService
}

function initLocalConfig(): Config {
  const serverStatusService = new InMemoryServerStatusService()
  const authService = new InMemoryAuthService(serverStatusService)
  const userService = new InMemoryUserService(authService)
  const problemService = new InMemoryProblemService(authService)
  const announcementService = new InMemoryAnnouncementService(authService)
  const clarificationService = new InMemoryClarificationService(authService)
  const contestService = new InMemoryContestService(serverStatusService, authService)
  const submissionService = new InMemorySubmissionService(authService, contestService)
  const scoreboardService = new InMemoryScoreboardService(authService, problemService)
  return {
    serverStatusService,
    authService,
    userService,
    problemService,
    announcementService,
    clarificationService,
    contestService,
    submissionService,
    scoreboardService,
  }
}

function initDevConfig(): Config {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_API || 'http://localhost:5000/',
  })
  const serverStatusService = new InMemoryServerStatusService()
  const authService = new GraphqlAuthService(client)
  const userService = new InMemoryUserService(authService)
  const problemService = new InMemoryProblemService(authService)
  const announcementService = new InMemoryAnnouncementService(authService)
  const clarificationService = new InMemoryClarificationService(authService)
  const contestService = new GraphqlContestService(client)
  const submissionService = new InMemorySubmissionService(authService, contestService)
  const scoreboardService = new GraphqlScoreboardService()
  return {
    serverStatusService,
    authService,
    userService,
    problemService,
    announcementService,
    clarificationService,
    contestService,
    submissionService,
    scoreboardService,
  }
}

function initProductionConfig() {
  return initDevConfig()
}

export function initConfig(): Config {
  if (process.env.NODE_ENV === 'production') {
    return initProductionConfig()
  } else if (process.env.NODE === 'local') {
    return initLocalConfig()
  }
  return initDevConfig()
}
