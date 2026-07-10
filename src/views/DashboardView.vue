<script setup lang="ts">
import { computed } from 'vue'
import { useBookmarkStore } from '@/store/bookmarks'
import BookmarkCard from '@/components/bookmark-card/BookmarkCard.vue'

const bookmarkStore = useBookmarkStore()

const props = defineProps<{
  searchTerm: string
}>()

const sortedBookmarks = computed(() => {
  return [...bookmarkStore.bookmarks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.pinned && b.pinned) {
      return new Date(b.pinned_at!).getTime() - new Date(a.pinned_at!).getTime()
    }
    return 0
  })
})

const filteredBookmarks = computed(() => {
  const activeBookmarks = sortedBookmarks.value.filter(b => !b.archived)

  if (!props.searchTerm) return activeBookmarks

  const term = props.searchTerm.toLowerCase()
  return activeBookmarks.filter(b =>
    b.title?.toLowerCase().includes(term) ||
    b.description?.toLowerCase().includes(term) ||
    b.tag?.toLowerCase().includes(term)
  )
})
</script>

<template>
  <div class="flex flex-wrap p-5 gap-4 overflow-y-auto">
    <BookmarkCard v-for="bookmark in filteredBookmarks" :key="bookmark.id" :bookmark="bookmark"/>
  </div>
</template>