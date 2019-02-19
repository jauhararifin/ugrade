import React, { Component } from 'react'
import { ScoreboardView } from './ScoreboardView'

export class Scoreboard extends Component {
  render() {
    return (
      <ScoreboardView
        problems={[
          { id: 1, name: 'Some Problem A', shortName: 'A' },
          { id: 2, name: 'Some Problem B', shortName: 'B' },
          { id: 3, name: 'Some Problem C', shortName: 'C' },
          { id: 4, name: 'Some Problem D', shortName: 'D' },
          { id: 5, name: 'Some Problem E', shortName: 'E' },
          { id: 6, name: 'Some Problem F', shortName: 'F' },
          { id: 7, name: 'Some Problem G', shortName: 'G' },
          { id: 8, name: 'Some Problem H', shortName: 'H' },
          { id: 9, name: 'Some Problem I', shortName: 'I' },
          { id: 10, name: 'Some Problem J', shortName: 'J' },
          { id: 11, name: 'Some Problem K', shortName: 'K' },
        ]}
        entries={[
          {
            rank: 1,
            username: 'jauhararifin',
            displayName: 'Jauhar Arifin',
            passed: 5,
            penalty: 123,
            scores: [
              { attempts: 3, penalty: 53, frozen: false, firstPassed: false },
              { attempts: 10, frozen: true, firstPassed: false },
              { attempts: 2, penalty: 53, frozen: false, firstPassed: false },
              { attempts: 0, frozen: false, firstPassed: false },
              { attempts: 0, frozen: true, firstPassed: false },
              { attempts: 10, frozen: true, firstPassed: false },
              { attempts: 2, penalty: 53, frozen: false, firstPassed: true },
              { attempts: 5, penalty: 53, frozen: false, firstPassed: true },
              { attempts: 6, frozen: false, firstPassed: false },
              { attempts: 12, penalty: 53, frozen: false, firstPassed: false },
              { attempts: 32, penalty: 53, frozen: false, firstPassed: true },
            ],
          },
        ]}
      />
    )
  }
}

export default Scoreboard
