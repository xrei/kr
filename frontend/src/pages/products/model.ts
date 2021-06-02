import {createStore, createEffect, createEvent} from 'effector'
import {api} from 'src/api'
import type {Course} from 'src/types/Course'

export const $products = createStore<Course[]>([])

export const fetchProductsFx = createEffect<void, Course[]>({
  handler: async () => {
    const data = await api.courses.list()

    return data
  },
})

$products.on(fetchProductsFx.doneData, (state, payload) => payload)
