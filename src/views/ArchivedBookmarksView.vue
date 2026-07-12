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
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex justify-between px-5 pt-5 shrink-0 items-start">
      <div class="font-semibold dark:text-white text-2xl">{{ $t('BOOKMARK_MANAGER.ARCHIVED.HEADING') }}</div>
    </div>
    <!-- Cards -->
    <div class="flex flex-wrap p-5 gap-4 overflow-y-auto content-area">
      <div v-for="bookmark in archivedBookmarks" :key="bookmark.id" class="opacity-60 grayscale w-full md:w-auto">
        <BookmarkCard :bookmark="bookmark" />
      </div>
    </div>
  </div>
</template>
