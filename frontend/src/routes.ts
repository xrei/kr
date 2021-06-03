import {Main, Courses, Course, Products, CoursePage} from './pages'
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
    view: Products,
  },
  course: {
    path: '/course/:id',
    title: '',
    view: CoursePage,
  },
  courses: {
    path: '/author/courses',
    title: 'Мои курсы',
    view: Courses,
  },
  courseConstructor: {
    path: '/author/course/:id',
    title: 'Конструктор курса',
    view: Course,
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
