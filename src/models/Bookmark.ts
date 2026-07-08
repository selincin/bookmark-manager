export default interface Bookmark {
  id: number
  title: string
  description: string
  url: string
  tag: string
  created_at: string
  archived: boolean
  icon: string
  visit_count: number
  pinned: boolean
  pinned_at: string | null
}