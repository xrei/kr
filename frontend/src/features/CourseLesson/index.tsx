import React, {useEffect} from 'react'
import {useEvent, useStore} from 'effector-react'
import {makeStyles} from '@material-ui/styles'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Theme,
  Typography,
  TextField,
  Button,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import type {CourseLesson as CourseLessonType} from 'src/types/Course'
import * as model from './model'

export const CourseNewLesson: React.FC<{courseId: number}> = (props) => {
  const st = useStyles()
  const titleChange = useEvent(model.titleChanged)
  const contentChange = useEvent(model.contentChanged)
  const isSaveEnabled = useStore(model.$isSaveEnabled)
  const cl = useStore(model.$courseLesson)

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Новый урок</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={st.details}>
          <TextField
            value={cl.title}
            className={st.mb4}
            placeholder="Название урока"
            fullWidth
            onChange={titleChange}
          ></TextField>
          <TextField
            value={cl.content}
            placeholder="Содержание"
            multiline
            rows={3}
            fullWidth
            onChange={contentChange}
          ></TextField>
        </div>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={() => model.cancelEdit()}>Отмена</Button>
        <Button
          color="primary"
          onClick={() => model.submitLesson(props.courseId)}
          disabled={!isSaveEnabled}
        >
          Сохранить
        </Button>
      </AccordionActions>
    </Accordion>
  )
}

export const CourseLesson: React.FC<{lesson: CourseLessonType}> = ({lesson}) => {
  const st = useStyles()

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{lesson.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={st.details}>
          <Typography>{lesson.content}</Typography>
        </div>
      </AccordionDetails>
      <AccordionActions>
        <Button>Редактировать</Button>
      </AccordionActions>
    </Accordion>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  details: {
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
  },
  mb4: {
    marginBottom: '20px',
  },
}))
