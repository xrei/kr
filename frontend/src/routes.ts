import {Main, Courses, Course, Products} from './pages'
import {createBrowserHistory} from 'history'

type Routes = {
  [key: string]: {
    path: string
    title: string
    view: React.FC
    childs?: any[]
  }
}

export const Routes: Routes = {
  root: {
    path: '/',
    title: 'Main',
    view: Main,
  },
  courses: {
    path: '/author/courses',
    title: 'Мои курсы',
    view: Courses,
  },
  course: {
    path: '/author/course/:id',
    title: 'Страница курса',
    view: Courses,
  },
  products: {
    path: '/products',
    title: 'Все курсы',
    view: Products,
  },
}

export const appRoutes = Object.values(Routes)
export const history = createBrowserHistory()

export default Routes
