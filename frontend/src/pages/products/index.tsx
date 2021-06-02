import React, {useEffect} from 'react'
import {useStore} from 'effector-react'
import {
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CircularProgress,
  Button,
} from '@material-ui/core'
import {makeStyles, createStyles} from '@material-ui/core/styles'
import type {Course} from 'src/types/Course'
import {fetchProductsFx, $products} from './model'

export const Products: React.FC = () => {
  useEffect(() => {
    fetchProductsFx()
  }, [])
  const products = useStore($products)

  return (
    <>
      <Grid container spacing={2}>
        {products.map((p) => {
          return <CourseCard course={p}></CourseCard>
        })}
      </Grid>
    </>
  )
}

const CourseCard: React.FC<{course: Course}> = (props) => {
  const classes = useCardStyles()
  const course = props.course

  return (
    <Card className={classes.card} elevation={3}>
      <CardActionArea className={classes.actionArea}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {course.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {course.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="secondary">
          Посмотреть
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
