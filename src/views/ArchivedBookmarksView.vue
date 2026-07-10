<script setup lang="ts">
import { computed } from 'vue'
import { useBookmarkStore } from '@/store/bookmarks'
import BookmarkCard from '@/components/bookmark-card/BookmarkCard.vue'

const bookmarkStore = useBookmarkStore()

const archivedBookmarks = computed(() =>
  bookmarkStore.bookmarks.filter(b => b.archived)
)
</script>

<template>
  <div class="flex flex-wrap p-5 gap-4 overflow-y-auto">
    <BookmarkCard v-for="bookmark in archivedBookmarks" :key="bookmark.id" :bookmark="bookmark"/>
  </div>
</template>