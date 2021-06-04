import {
  createStore,
  createEffect,
  createEvent,
  combine,
  forward,
  guard,
  restore,
  sample,
} from 'effector'
import {ChangeEvent} from 'react'
import {api} from 'src/api'
import {Course, CourseLesson, CourseLessonRaw} from 'src/types/Course'

// --- lesson creation
type CreateLessonBody = {
  courseId: number
  lesson: CourseLessonRaw
}
export const createLessonFx = createEffect<CreateLessonBody, CourseLesson>({
  handler: async ({courseId, lesson}) => {
    const data = await api.lessons.create(courseId, lesson)
    console.log(data)
    return data
  },
})

export const $courseLesson = createStore<CourseLessonRaw>({title: '', content: ''})
export const titleChanged = createEvent<ChangeEvent<HTMLInputElement>>()
export const contentChanged = createEvent<ChangeEvent<HTMLInputElement>>()
export const cancelEdit = createEvent()
export const submitLesson = createEvent<number>()

$courseLesson.on(titleChanged, (cl, event) => ({...cl, title: event.target.value}))
$courseLesson.on(contentChanged, (cl, event) => ({...cl, content: event.target.value}))
$courseLesson.reset([cancelEdit, createLessonFx.done])

const $isCourseLessonValid = $courseLesson.map(
  (cl) => cl.content.length > 10 && cl.title.length > 5
)

export const $isSaveEnabled = combine(
  $isCourseLessonValid,
  createLessonFx.pending,
  (a, b) => !b && a
)

guard({
  source: sample({
    source: $courseLesson,
    clock: submitLesson,
    fn: (lesson, courseId) => ({lesson, courseId}),
  }),
  filter: $isSaveEnabled,
  target: createLessonFx,
})

// -- fetch all lessons
export const fetchCourseLessonsFx = createEffect<number, CourseLesson[]>({
  handler: async (courseId) => {
    const data: CourseLesson[] = await api.lessons.list(courseId)
    return data
  },
})

export const $courseLessons = createStore<CourseLesson[]>([])
$courseLessons.on(fetchCourseLessonsFx.doneData, (_, p) => p)
$courseLessons.on(createLessonFx.doneData, (xs, cl) => [...xs, cl])
