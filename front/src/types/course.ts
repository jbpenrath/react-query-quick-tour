export type Course = {
  categories: string[]
  content: string
  date_created: string
  date_updated: string
  excerpt: string
  id: number
  illustration: string
  status: "draft"
  title: string
}

export enum ComponentState {
  IDLE= 'idle',
  LOADING= 'loading',
  ERROR= 'error'
}