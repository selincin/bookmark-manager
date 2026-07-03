import { ref } from 'vue'
import { useBookmarkStore } from '@/store/bookmarks'

import axios from 'axios'

import type Bookmark from '../models/Bookmark'


const BASE_URL = import.meta.env.VITE_API_URL

const bookmarks = ref<Bookmark[]>([])
const loading = ref(false)

export function useBookmarks() {
    const bookmarkStore = useBookmarkStore()

    const fetchBookmarks = async () => {
        let result
        try {
            result = await axios.get('/bookmarks', {
                baseURL: BASE_URL
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
        console.log('Bookmarks:', bookmarkStore.bookmarks);
    }

    return {
        loadBookmarks
    }
}