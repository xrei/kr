import {createRequest} from './req'

const apiUrl = 'http://localhost:3020/api'

const request = createRequest(apiUrl)

export const api = {
  courses: {
    list: () => request({url: '/courses/list'}),
  },
}
