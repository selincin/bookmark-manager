import { defineStore } from 'pinia'
import type Bookmark from '../models/Bookmark'

export interface BookmarkState {
  bookmarks: Bookmark[]
  loading: boolean
  error: boolean
  hasMore: boolean
  offset: number
}

export const useBookmarkStore = defineStore('bookmarkStore', {
  state: () => ({
    bookmarks: [] as Bookmark[],
    loading: false,
    error: false,
    hasMore: true,
    offset: 0
  } as BookmarkState)
})