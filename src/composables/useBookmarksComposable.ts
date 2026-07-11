import { ref } from 'vue'
import { useBookmarkStore } from '@/store/bookmarks'

import axios from 'axios'
import type Bookmark from '../models/Bookmark'

const BASE_URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const headers = {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
}

export function useBookmarks() {
    const bookmarkStore = useBookmarkStore()

    const fetchBookmarks = async () => {
        let result
        try {
            result = await axios.get('/rest/v1/bookmarks?select=*', {
                baseURL: BASE_URL,
                headers: headers
            })
        } catch (error) {
            console.log('error: ', error);
            result = null;
        }
        return result
    }

    const loadBookmarks = async () => {
        bookmarkStore.loading = true
        bookmarkStore.bookmarks = []

        const result = await fetchBookmarks()

        if (!result) {
            console.log('Failed to load bookmarks')
            bookmarkStore.loading = false;
            return;
        }

        bookmarkStore.bookmarks = result.data as Bookmark[];
        bookmarkStore.loading = false;
    }

    const createBookmark = async (bookmark: Bookmark) => {
        try {
            const response = await axios.post('/rest/v1/bookmarks', bookmark, {
                baseURL: BASE_URL,
                headers
            })

            if (response.status) {
                bookmarkStore.bookmarks.push(bookmark)
            }
        } catch (error) {
            console.log('Error creating bookmark:', error)
        }
    }

    const archiveBookmark = async (id: number) => {
        const bookmark = bookmarkStore.bookmarks.find((b) => b.id === id)
        if (!bookmark) return

        const newArchivedState = !bookmark.archived

        await axios.patch(`/rest/v1/bookmarks?id=eq.${id}`,
            { archived: newArchivedState },
            { baseURL: BASE_URL, headers }
        )

        bookmark.archived = newArchivedState
    }

    const togglePin = async (id: number) => {
    const bookmark = bookmarkStore.bookmarks.find((b) => b.id === id)
    if (!bookmark) return

    const newPinnedState = !bookmark.pinned
    const pinnedAt = newPinnedState ? new Date().toISOString() : null

    await axios.patch(`/rest/v1/bookmarks?id=eq.${id}`,
        { pinned: newPinnedState, pinned_at: pinnedAt },
        { baseURL: BASE_URL, headers }
    )

    bookmark.pinned = newPinnedState
    bookmark.pinned_at = pinnedAt
}

    const visitBookmark = async (id: number) => {
        const bookmark = bookmarkStore.bookmarks.find(b => b.id === id)
        if (!bookmark) return

        const newCount = (bookmark.visit_count ?? 0) + 1

        await axios.patch(`/rest/v1/bookmarks?id=eq.${id}`,
            { visit_count: newCount },
            { baseURL: BASE_URL, headers }
        )

        bookmark.visit_count = newCount
    }

 const updateBookmark = async (bookmark: Bookmark) => {
    try {
        const updatedAt = new Date().toISOString()
        
        await axios.patch(`/rest/v1/bookmarks?id=eq.${Number(bookmark.id)}`,
            {
                title: bookmark.title,
                description: bookmark.description,
                url: bookmark.url,
                tag: bookmark.tag,
                updated_at: updatedAt
            },
            { baseURL: BASE_URL, headers }
        )

        const bookmarkToUpdate = bookmarkStore.bookmarks.find(b => b.id === bookmark.id)
        if (bookmarkToUpdate) {
            bookmarkToUpdate.title = bookmark.title
            bookmarkToUpdate.description = bookmark.description
            bookmarkToUpdate.url = bookmark.url
            bookmarkToUpdate.tag = bookmark.tag
            bookmarkToUpdate.updated_at = updatedAt
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

    return {
        loadBookmarks,
        createBookmark,
        archiveBookmark,
        togglePin,
        visitBookmark,
        updateBookmark,
    }
}