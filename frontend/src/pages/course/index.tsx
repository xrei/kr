import {useStore} from 'effector-react'
import React, {useEffect} from 'react'
import {CircularProgress, Typography, Button} from '@material-ui/core'
import {$course, $isLoading, fetchCourseFx} from './model'
import {makeStyles} from '@material-ui/styles'
import {useParams} from 'react-router'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
    height: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})

export const CoursePage: React.FC = () => {
  const p = useParams<{id: string}>()
  useEffect(() => {
    fetchCourseFx(+p.id)
  }, [])

  const st = useStyles()
  const course = useStore($course)
  const isLoading = useStore($isLoading)

  return (
    <div className={st.root}>
      {isLoading ? (
        <div className={st.loader}>
          <CircularProgress></CircularProgress>
        </div>
      ) : course ? (
        <div className={st.root}>
          <Typography component="h1" variant="h3" gutterBottom>
            {course?.title}
          </Typography>
          <Typography component="h4" variant="h6">
            Описание курса:
          </Typography>
          <Typography component="h4" variant="body1" gutterBottom>
            {course?.description}
          </Typography>
          <Button fullWidth variant="contained" color="primary">
            Купить за {course?.price} $
          </Button>
        </div>
      ) : (
        <div>Не удалось загрузить данные</div>
      )}
    </div>
  )
}
