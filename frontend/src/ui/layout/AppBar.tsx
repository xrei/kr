import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {AppBar as MuiAppBar, Toolbar, IconButton, Theme, Typography} from '@material-ui/core'
import {Menu as MenuIcon, ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import {makeStyles, createStyles} from '@material-ui/styles'
import {toggle as DrawerToggle} from './drawerModel'
import {HideOnScroll} from './HideOnScroll'
import {history} from 'src/routes'

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
    <div>
      <HideOnScroll>
        <MuiAppBar className={classes.grow} elevation={0} color="primary">
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
            <div className={classes.grow}></div>
          </Toolbar>
        </MuiAppBar>
      </HideOnScroll>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuBtn: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'block',
    },
  })
)
