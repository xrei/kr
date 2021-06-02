import React from 'react'
import {useScrollTrigger, Slide} from '@material-ui/core'

export const HideOnScroll: React.FC<{children: React.ReactElement}> = ({children}) => {
  const trigger = useScrollTrigger({target: window ? window : undefined})

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}
