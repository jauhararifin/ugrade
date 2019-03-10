import { Problem } from 'ugrade/contest/store'
import { Program } from './Program'

export interface ProblemSpec extends Problem {
  solution: Program
  testcaseGenerator: Program
}
