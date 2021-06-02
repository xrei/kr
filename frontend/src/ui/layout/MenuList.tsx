import React from 'react'
import {NavLink as Link} from 'react-router-dom'
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Divider,
} from '@material-ui/core'
import {Home as HomeIcn, Book as BookIcn, Bookmarks} from '@material-ui/icons'
import {onClose as ToggleDrawer} from './drawerModel'
import {Routes} from 'src/routes'

const DrawerWidth = 250

export const MenuList: React.FC = () => {
  const classess = styles()
  const {root, courses, products} = Routes

  return (
    <div className={classess.list} onClick={() => ToggleDrawer()}>
      <List>
        <MenuItem route={root}>
          <HomeIcn />
        </MenuItem>
        <Divider></Divider>
        <MenuItem route={courses}>
          <BookIcn />
        </MenuItem>
        <MenuItem route={products}>
          <Bookmarks />
        </MenuItem>
      </List>
    </div>
  )
}

const MenuItem: React.FC<{route: any}> = ({route, children}) => {
  const classess = styles()

  return (
    <ListItem
      button
      component={Link}
      activeClassName={classess.active}
      exact
      to={route.path}
      onClick={() => ToggleDrawer()}
    >
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText>{route.title}</ListItemText>
    </ListItem>
  )
}

const styles = makeStyles((t: Theme) => ({
  list: {
    width: DrawerWidth,
  },
  active: {
    color: t.palette.secondary.main,
  },
}))
