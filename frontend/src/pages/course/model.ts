import {api} from 'src/api'
import {createStore, createEffect, createEvent} from 'effector'
import {Course} from 'src/types/Course'

export const $course = createStore<Course | null>(null)

export const fetchCourseFx = createEffect<number, Course>({
  handler: (id: number) => {
    const course = api.courses.get(id)
    return course
  },
})

export const $isLoading = fetchCourseFx.pending

$course.on(fetchCourseFx.doneData, (_, p) => p)
