import { defineStore } from 'pinia'
import type Bookmark from '../models/Bookmark'

export interface BookmarkState {
  bookmarks: Bookmark[]
  loading: boolean
  error: boolean
}

export const useBookmarkStore = defineStore('bookmarkStore', {
  state: () => ({
    bookmarks: [] as Bookmark[],
    loading: false,
    error: false
  } as BookmarkState)
})