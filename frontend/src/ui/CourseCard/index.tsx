import React from 'react'
import {Link} from 'react-router-dom'
import {
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Avatar,
} from '@material-ui/core'
import {makeStyles, createStyles} from '@material-ui/core/styles'
import type {Course} from 'src/types/Course'

export const CourseCard: React.FC<{course: Course; btnTitle?: string; linkPath?: string}> = (
  props
) => {
  const classes = useCardStyles()
  const course = props.course
  const to = props.linkPath || `/course/${course.id}`

  return (
    <Card className={classes.card} elevation={3}>
      <CardActionArea className={classes.actionArea} component={Link} to={to}>
        <CardHeader
          title={course.author_name}
          avatar={<Avatar>{course.author_name?.slice(0, 1)}</Avatar>}
          subheader={course.price + ' $'}
        ></CardHeader>

        <CardContent>
          <Typography variant="h5" gutterBottom component="h2">
            {course.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {course.description}
          </Typography>

          <Typography variant="h6" color="primary" component="p" style={{marginTop: '24px'}}>
            {course.price} $
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="secondary" component={Link} to={to}>
          {props.btnTitle || 'Посмотреть'}
        </Button>
      </CardActions>
    </Card>
  )
}

const useCardStyles = makeStyles(() =>
  createStyles({
    card: {
      position: 'relative',
      maxWidth: '400px',
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
      ['@media (max-width: 476px)']: {
        maxWidth: '100%',
      },
    },
    actionArea: {
      flex: 1,
    },
  })
)
