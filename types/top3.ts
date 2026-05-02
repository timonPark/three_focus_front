export interface Top3Response {
  id: number
  todoId: number
  date: string
  order: number
}

export interface SetTop3Request {
  todoIds: number[]
}
