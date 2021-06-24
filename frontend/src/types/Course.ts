export type Course = {
  id: number
  title: string
  description: string
  status: string
  price: number
  author_name?: string
  author_email?: string
  uid: string
  course_id: number
}

export type CourseBody = {
  title?: string
  description?: string
  price?: number
}

export type CourseLesson = {
  id: number
  title: string
  content: string
  course_id: number
}

export type CourseLessonRaw = Omit<CourseLesson, 'id' | 'course_id'>
