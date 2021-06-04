import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Theme,
  Typography,
  Button,
} from '@material-ui/core'
import {Menu as MenuIcon, ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import {makeStyles, createStyles} from '@material-ui/styles'
import {toggle as DrawerToggle} from './drawerModel'
import {HideOnScroll} from './HideOnScroll'
import {history} from 'src/routes'
import {api} from 'src/api'
import clsx from 'clsx'

type Props = {
  title: string
}

export const AppBar: React.FC<Props> = ({title}) => {
  const classes = useStyles()
  const loc = useLocation()
  const [isRoot, changeIsRoot] = useState(false)
  useEffect(() => {
    if (loc.pathname === '/') changeIsRoot(true)
    else changeIsRoot(false)
  }, [loc])

  const goBack = () => {
    history.goBack()
  }

  return (
    <HideOnScroll>
      <MuiAppBar
        className={clsx(classes.grow, classes.appBar)}
        elevation={0}
        color="primary"
        position="fixed"
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuBtn}
            color="inherit"
            aria-label="open side menu"
            onClick={() => DrawerToggle()}
          >
            <MenuIcon></MenuIcon>
          </IconButton>

          {!isRoot && (
            <IconButton edge="start" color="inherit" onClick={() => goBack()}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
          )}

          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <Button color="inherit" onClick={() => api.auth.signin({})}>
            Login
          </Button>
        </Toolbar>
      </MuiAppBar>
    </HideOnScroll>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuBtn: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    title: {
      display: 'block',
      flex: 1,
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${250}px)`,
        marginLeft: '250px',
      },
    },
  })
)
