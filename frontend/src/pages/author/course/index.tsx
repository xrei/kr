import {useEvent, useStore} from 'effector-react'
import React, {useEffect} from 'react'
import {useParams} from 'react-router'
import {makeStyles} from '@material-ui/styles'
import {
  Grid,
  CircularProgress,
  Button,
  TextField,
  Theme,
  InputAdornment,
  Typography,
} from '@material-ui/core'
import {AttachMoney} from '@material-ui/icons'
import * as model from './model'
import type {Course as CourseType} from 'src/types/Course'
import {CourseNewLesson, CourseLesson} from 'src/features/CourseLesson'
import * as lessonModel from 'src/features/CourseLesson/model'

export const Course: React.FC = () => {
  const params = useParams<{id: string}>()
  useEffect(() => {
    model.fetchCourseAndLessonsFx(+params.id)
  }, [])
  const course = useStore(model.$course)
  const isLoading = useStore(model.$isLoading)

  if (isLoading)
    return (
      <div
        style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <CircularProgress></CircularProgress>
      </div>
    )
  else if (!course) return <div>Ошибка</div>

  return <CourseBlock course={course}></CourseBlock>
}

const CourseBlock: React.FC<{course: CourseType}> = (props) => {
  const st = courseStyles()
  const {course} = props
  const isDraft = useStore(model.$isDraft)
  const isPublished = useStore(model.$isPublished)
  const courseLessons = useStore(lessonModel.$courseLessons)

  return (
    <Grid container spacing={2} className={st.root}>
      <Grid item xs={12} md={7}>
        <Typography variant="h5" gutterBottom>
          Основные настройки:
        </Typography>
        <div className={st.mb4}>
          <TextField
            value={course.title}
            label="Название курса:"
            placeholder="Введите название курса"
            fullWidth
          ></TextField>
        </div>
        <div className={st.mb4}>
          <TextField
            value={course.description}
            label="Описаение курса:"
            placeholder="Введите описание курса"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
          ></TextField>
        </div>
        <div className={st.mb4}>
          <TextField
            value={course.price}
            label="Цена:"
            placeholder="Введите цену"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
          ></TextField>
        </div>

        <div>
          <Typography variant="h5">Уроки курса:</Typography>
          <CourseNewLesson courseId={course.id}></CourseNewLesson>
          {courseLessons.map((cl) => {
            return <CourseLesson key={cl.id} lesson={cl}></CourseLesson>
          })}
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className={st.statusPaper}>
          {isDraft && (
            <Button variant="contained" className={st.publishBtn}>
              Опубликовать
            </Button>
          )}
          {isPublished && (
            <Button variant="contained" color="default">
              Снять с публикации
            </Button>
          )}
        </div>
      </Grid>
    </Grid>
  )
}

const courseStyles = makeStyles((th: Theme) => {
  return {
    root: {
      paddingTop: '20px',
      height: '100%',
    },
    statusPaper: {
      width: 'max-content',
      marginLeft: 'auto',
      [th.breakpoints.down('xs')]: {
        margin: '0 auto',
      },
    },
    publishBtn: {
      background: th.palette.success.light,
      color: th.palette.common.white,
      '&:hover': {
        background: th.palette.success.main,
      },
    },
    mb4: {
      marginBottom: '30px',
    },
  }
})
