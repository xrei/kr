import React, {useEffect} from 'react'
import {CourseCard} from 'src/ui/CourseCard'
import {makeStyles} from '@material-ui/styles'
import {
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
} from '@material-ui/core'
import {AddCircleOutline as AddCircleIcon} from '@material-ui/icons'
import {useEvent, useStore} from 'effector-react'
import * as model from './model'

const useStyles = makeStyles({
  root: {
    marginTop: '40px',
  },

  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
})

export const Courses: React.FC = () => {
  const st = useStyles()
  const isLoading = useStore(model.$isLoading)

  useEffect(() => {
    model.fetchAuthorCoursesFx()
  }, [])

  return (
    <>
      <Typography variant="h4">Мои курсы</Typography>
      <Grid container spacing={2} className={st.root}>
        {isLoading ? (
          <div className={st.loader}>
            <CircularProgress></CircularProgress>
          </div>
        ) : (
          <CoursesList></CoursesList>
        )}
      </Grid>
      <NewCourseDialog></NewCourseDialog>
    </>
  )
}

const listStyles = makeStyles({
  gridItem: {
    flex: 1,
    maxWidth: '320px',
    minWidth: '260px',
    minHeight: '160px',
  },
  cardItemNew: {
    display: 'flex',
    height: '100%',
    textAlign: 'center',
  },
})

const CoursesList: React.FC = () => {
  const st = listStyles()
  const courses = useStore(model.$authorCourses)

  if (courses.length) {
    return (
      <>
        <Grid item className={st.gridItem}>
          <Card elevation={3} className={st.cardItemNew} onClick={() => model.openDialog()}>
            <CardActionArea>
              <AddCircleIcon></AddCircleIcon>
              <Typography variant="h6">Создать новый курс</Typography>
            </CardActionArea>
          </Card>
        </Grid>
        {courses.map((c) => {
          return (
            <Grid key={c.id} item className={st.gridItem}>
              <CourseCard
                course={c}
                btnTitle="Редактировать"
                linkPath={`/author/course/${c.course_id}`}
              ></CourseCard>
            </Grid>
          )
        })}
      </>
    )
  }

  return (
    <>
      <Typography>Пусто</Typography>
    </>
  )
}

const NewCourseDialog: React.FC = () => {
  const isOpen = useStore(model.$newCourseDialog)
  const title = useStore(model.$title)
  const description = useStore(model.$description)
  const titleChange = useEvent(model.titleChanged)
  const descriptionChange = useEvent(model.descriptionChanged)
  const isDisabled = !useStore(model.$isSubmitEnabled)
  const handleSubmit = () => {
    model.formSubmitted()
  }

  return (
    <Dialog open={isOpen} onClose={() => model.closeDialog()} fullWidth>
      <DialogTitle>Создать новый курс</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            value={title}
            margin="dense"
            fullWidth
            name="title"
            label="Название"
            onChange={titleChange}
          ></TextField>
          <TextField
            value={description}
            margin="dense"
            fullWidth
            name="description"
            label="Описание"
            multiline
            onChange={descriptionChange}
          ></TextField>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => model.closeDialog()}>
          Отмена
        </Button>
        <Button disabled={isDisabled} color="primary" variant="contained" onClick={handleSubmit}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  )
}
