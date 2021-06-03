import {createRequest} from './req'

const apiUrl = 'http://localhost:3020/api'

const request = createRequest(apiUrl)

export const api = {
  courses: {
    list: () => request({url: '/courses/list'}),
    get: (id: number) => request({url: `/courses/${id}`}),
    authorCourses: (id: number) => request({url: `/courses/author/${id}`}),
    create: (payload: any) => request({method: 'POST', url: '/courses/', body: payload}),
  },
}
