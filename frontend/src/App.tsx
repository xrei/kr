import React, {useState, useEffect} from 'react'
import {Route, useLocation} from 'react-router-dom'
import {matchPath} from 'react-router'

import {StylesProvider} from '@material-ui/styles'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import pink from '@material-ui/core/colors/pink'
import red from '@material-ui/core/colors/red'
import {appRoutes, history} from './routes'
import {MainLayout} from './ui/layout/MainLayout'

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: indigo,
      secondary: pink,
      error: red,
    },
  })
  const loc = useLocation()
  const [routeTitle, changeRouteTitle] = useState('/')
  useEffect(() => {
    changeRouteTitle(
      appRoutes.find((r) => matchPath(loc.pathname, {path: r.path})?.isExact)?.title || 'Главная'
    )
  }, [loc])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MainLayout title={routeTitle}>
          {appRoutes.map(({path, view}, i) => (
            <Route exact key={i} path={path} component={view} />
          ))}
        </MainLayout>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
