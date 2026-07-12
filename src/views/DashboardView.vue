<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookmarkStore } from '@/store/bookmarks'
import { useBookmarks } from '@/composables/useBookmarksComposable'
import { useIntersectionObserver } from '@vueuse/core';

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import BookmarkCard from '@/components/bookmark-card/BookmarkCard.vue'

const bookmarkStore = useBookmarkStore();
const bookMarksComposable = useBookmarks()
const { t } = useI18n()

const props = defineProps<{
  searchTerm: string
  selectedTags: string[]
}>();

const sortMenu = ref();
const sortBy = ref('recently_added');
const sentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(sentinel, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    bookMarksComposable.loadMore()
  }
})


const sortOptions = computed(() => [
  {
    items: [
      {
        label: t('BOOKMARK_MANAGER.DASHBOARD.RECENTLY_ADDED'),
        icon: sortBy.value === 'recently_added' ? 'pi pi-check' : '',
        command: () => sortBy.value = 'recently_added'
      },
      {
        label: t('BOOKMARK_MANAGER.DASHBOARD.RECENTLY_VISITED'),
        icon: sortBy.value === 'recently_visited' ? 'pi pi-check' : '',
        command: () => sortBy.value = 'recently_visited'
      },
      {
        label: t('BOOKMARK_MANAGER.DASHBOARD.MOST_VISITED'),
        icon: sortBy.value === 'most_visited' ? 'pi pi-check' : '',
        command: () => sortBy.value = 'most_visited'
      },
    ]
  }
])

const toggleSortMenu = (event: Event) => {
  sortMenu.value.toggle(event)
}

const sortedBookmarks = computed(() => {
  return [...bookmarkStore.bookmarks].sort((a, b) => {
    if (sortBy.value === 'recently_visited') {
      return new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime()
    }
    if (sortBy.value === 'most_visited') {
      return (b.visit_count ?? 0) - (a.visit_count ?? 0)
    }

    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.pinned && b.pinned) {
      return new Date(b.pinned_at!).getTime() - new Date(a.pinned_at!).getTime()
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

const filteredBookmarks = computed(() => {
  let result = sortedBookmarks.value.filter(b => !b.archived)

  if (props.selectedTags.length > 0) {
    result = result.filter(b =>
      props.selectedTags.some(tag => b.tag?.includes(tag))
    )
  }

  if (!props.searchTerm) return result
  const term = props.searchTerm.toLowerCase()
  return result.filter(b =>
    b.title?.toLowerCase().includes(term) ||
    b.description?.toLowerCase().includes(term) ||
    b.tag?.toLowerCase().includes(term)
  )
})
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Sort Header -->
    <div class="flex justify-between px-5 pt-5 shrink-0 items-start">
      <div class="font-semibold dark:text-white text-2xl">{{ t('BOOKMARK_MANAGER.DASHBOARD.HEADING') }}</div>
      <div>
        <Menu 
          ref="sortMenu" 
          :model="sortOptions" 
          popup  
          :pt="{
            submenuLabel: {
                class: 'p-0!'
            }
        }" 
          />
        <Button :label="t('BOOKMARK_MANAGER.DASHBOARD.SORT_BY')" icon="pi pi-sort-alt" @click="toggleSortMenu"   :pt="{
            root: {
                class: 'bg-none!'
            }
        }" />
      </div>
    </div>
    <!-- Cards -->
    <div class="flex flex-wrap p-5 gap-4 overflow-y-auto content-area">
      <BookmarkCard v-for="bookmark in filteredBookmarks" :key="bookmark.id" :bookmark="bookmark" />
      <div v-if="filteredBookmarks.length == 0" class="dark:text-white">{{ t('BOOKMARK_MANAGER.DASHBOARD.NO_RESULTS') }}</div>
      <!-- trigger element -->
      <div ref="sentinel" class="w-full h-1 observer"></div>
      <!-- Loading Indicator -->
      <div v-if="bookmarkStore.loading" class="w-full flex justify-center py-4">
        <i class="pi pi-spin pi-spinner text-2xl text-primary-500"></i>
      </div>
      <div v-if="!bookmarkStore.hasMore && filteredBookmarks.length > 0"
        class="w-full text-center text-gray-400 py-4 text-sm">
        {{ t('BOOKMARK_MANAGER.DASHBOARD.ALL_LOADED') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-area {
  max-height: 58rem;
  overflow: auto;
}
</style>