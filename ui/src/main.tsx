import React from 'react'
import ReactDOM from 'react-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { App } from './scenes/App'
import * as serviceWorker from './serviceWorker'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
)

serviceWorker.unregister()
