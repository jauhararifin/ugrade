import { ErrorBoundary } from '@/error'
import React from 'react'
import { ApolloProvider } from 'react-apollo-hooks'
import ReactDOM from 'react-dom'
import { apolloClient } from './client'
import { App } from './scenes/App'
import * as serviceWorker from './serviceWorker'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root')
)

serviceWorker.unregister()
