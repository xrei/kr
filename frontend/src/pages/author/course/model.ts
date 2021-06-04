import {createStore, createEffect} from 'effector'
import {api} from 'src/api'
import {Course} from 'src/types/Course'
import {fetchCourseLessonsFx} from 'src/features/CourseLesson/model'

export const $course = createStore<Course | null>(null)
export const $isPublished = $course.map((course) => course?.status === 'published')
export const $isDraft = $course.map((course) => course?.status === 'draft')

export const fetchCourseFx = createEffect<number, Course>({
  handler: async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const course = await api.courses.get(id)
    return course
  },
})

$course.on(fetchCourseFx.doneData, (_, p) => p)

export const fetchCourseAndLessonsFx = createEffect<number, void>(async (id) => {
  await fetchCourseFx(id)
  await fetchCourseLessonsFx(id)
})

export const $isLoading = fetchCourseAndLessonsFx.pending
