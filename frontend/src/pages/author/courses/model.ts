import {createStore, createEffect, createEvent, combine, forward, guard, sample} from 'effector'
import {ChangeEvent, FormEvent} from 'react'
import {api} from 'src/api'
import {Course} from 'src/types/Course'

export const $authorCourses = createStore<Course[]>([])
export const $newCourseDialog = createStore(false)

export const openDialog = createEvent()
export const closeDialog = createEvent()
export const formSubmitted = createEvent()

export const fetchAuthorCoursesFx = createEffect<void, Course[]>({
  handler: () => {
    const data = api.courses.authorCourses(1)
    return data
  },
})

export const $isLoading = fetchAuthorCoursesFx.pending

$authorCourses.on(fetchAuthorCoursesFx.doneData, (_, p) => p)

$newCourseDialog.on(openDialog, () => true).reset([closeDialog])

type CourseDTO = Pick<Course, 'title' | 'description'>
export const createNewCourseFx = createEffect<CourseDTO, void>({
  handler: async (courseData) => {
    const data = await api.courses.create(courseData)
    console.log(data)
  },
})

export const titleChanged = createEvent<ChangeEvent<HTMLInputElement>>()
export const descriptionChanged = createEvent<ChangeEvent<HTMLInputElement>>()

export const $title = createStore<string>('').on(titleChanged, (_, ev) => ev.target.value)

export const $isTitleValid = $title.map((title) => title.length > 5)

export const $description = createStore<string>('').on(
  descriptionChanged,
  (_, ev) => ev.target.value
)
export const $isDescriptionValid = $description.map((description) => description.length > 2)

export const $form = combine([$title, $description], ([title, description]) => ({
  title,
  description,
}))

export const $isSubmitEnabled = combine(
  createNewCourseFx.pending,
  $isTitleValid,
  $isDescriptionValid,
  (pending, titleValid, desciptionValid) => !pending && titleValid && desciptionValid
)

guard({
  clock: formSubmitted,
  filter: $isSubmitEnabled,
  source: $form,
  target: createNewCourseFx,
})
