import React from 'react'
import {
  Container,
  CssBaseline,
  makeStyles,
  SwipeableDrawer,
  Hidden,
  Drawer,
  Theme,
} from '@material-ui/core'
import {useStore} from 'effector-react'
import {AppBar} from './AppBar'
import {MenuList} from './MenuList'
import {$drawer, onClose, onOpen} from './drawerModel'

type Props = {
  children: NonNullable<React.ReactNode>
  title: string
}

export const MainLayout: React.FC<Props> = ({children, title}) => {
  const c = useStyles()
  return (
    <div className={c.Layout}>
      <CssBaseline />
      <AppBar title={title} />
      <div className={c.drawer}>
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            open={useStore($drawer)}
            onClose={() => onClose()}
            onOpen={() => onOpen()}
            disableBackdropTransition={true}
          >
            <MenuList />
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: c.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <MenuList />
          </Drawer>
        </Hidden>
      </div>
      <main className={c.Content}>
        <Container className={c.ContentWrap} maxWidth="lg">
          {children}
        </Container>
      </main>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  Layout: {
    display: 'flex',
    position: 'relative',
  },
  Content: {
    display: 'flex',
    flexGrow: 1,
    minHeight: '100vh',
  },
  ContentWrap: {
    marginTop: 64,
    padding: 12,
    ['@media (max-width: 600px)']: {
      marginTop: 56,
    },
  },
  drawerPaper: {
    width: '250px',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: '250px',
      flexShrink: 0,
    },
  },
}))
