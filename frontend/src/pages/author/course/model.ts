import {createStore, createEffect, sample, guard, createEvent, combine, forward} from 'effector'
import type {Event, Unit} from 'effector'
import {api} from 'src/api'
import {Course, CourseBody} from 'src/types/Course'
import {fetchCourseLessonsFx} from 'src/features/CourseLesson/model'
import {omit, sleep} from 'src/lib'

export const $course = createStore<Course | null>(null)
export const $draftCourse = $course.map(
  (course) =>
    (course && {
      id: course.course_id,
      title: course.title,
      description: course.description,
      price: course.price,
    }) || {id: 0, title: '', description: '', price: 0}
)
export const $isPublished = $course.map((course) => course?.status === 'published')
export const $isDraft = $course.map((course) => course?.status === 'draft')

export const fetchCourseFx = createEffect<number, Course>({
  handler: async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const course = await api.courses.get(id)
    console.log(course)
    return course
  },
})

$course.on(fetchCourseFx.doneData, (_, p) => p)

export const fetchCourseAndLessonsFx = createEffect<number, void>(async (id) => {
  await fetchCourseFx(id)
  await fetchCourseLessonsFx(id)
})

export const $isLoading = fetchCourseAndLessonsFx.pending

export const publishCourseFx = createEffect<number, void>(async (id) => {
  await api.courses.publish(id)
  await fetchCourseFx(id)
})

export const editCourseField = createEvent<CourseBody>()
$draftCourse.on(editCourseField, (course, payload) => ({...course, ...payload}))

export const editCourseFx = createEffect<{courseId: number; edited: CourseBody}, void>(
  async ({courseId, edited}) => {
    await sleep(1000)
    const res = await api.courses.edit(courseId, omit(edited))
    console.log(res)
  }
)

const $canEditCourse = combine(
  editCourseFx.pending,
  $draftCourse.map((course) => Boolean(course)),
  (a, b) => !a && b
)

guard({
  source: sample({
    source: $draftCourse,
    clock: editCourseField,
    fn: (course, edited) => ({courseId: course.id, edited}),
  }),
  filter: $canEditCourse,
  target: editCourseFx,
})

editCourseFx.watch(console.log)
