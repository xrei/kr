import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Router} from 'react-router'
import {appRoutes, history} from './routes'
import './index.css'

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
)
