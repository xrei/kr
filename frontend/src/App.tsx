import React, {useState, useEffect} from 'react'
import {Route, useLocation} from 'react-router-dom'
import {StylesProvider} from '@material-ui/styles'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import pink from '@material-ui/core/colors/pink'
import red from '@material-ui/core/colors/red'
import {appRoutes, history} from './routes'
import {MainLayout} from './ui/layout/MainLayout'
import {Router} from 'react-router'

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: indigo,
      secondary: pink,
      error: red,
    },
  })
  // const loc = useLocation()
  // const [routeTitle, changeRouteTitle] = useState('/')
  // useEffect(() => {
  //   changeRouteTitle(appRoutes.find((r) => r.path === loc.pathname)?.title || 'Главная')
  // }, [loc])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <MainLayout title="">
            {appRoutes.map(({path, view}, i) => (
              <Route exact key={i} path={path} component={view} />
            ))}
          </MainLayout>
        </Router>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
