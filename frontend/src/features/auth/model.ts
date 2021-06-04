import {createEffect, createStore} from 'effector'

type User = {
  full_name: string
  email: string
}

const $user = createStore<User | null>(null)
