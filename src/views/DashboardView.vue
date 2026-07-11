<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBookmarkStore } from '@/store/bookmarks'

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import BookmarkCard from '@/components/bookmark-card/BookmarkCard.vue'

const bookmarkStore = useBookmarkStore()

const props = defineProps<{
    searchTerm: string
    selectedTags: string[]
}>()

const sortMenu = ref()
const sortBy = ref('recently_added')

const sortOptions = computed(() => [
    {
        items: [
            { 
                label: 'Recently added', 
                icon: sortBy.value === 'recently_added' ? 'pi pi-check' : '',
                command: () => sortBy.value = 'recently_added'
            },
            { 
                label: 'Recently visited',
                icon: sortBy.value === 'recently_visited' ? 'pi pi-check' : '',
                command: () => sortBy.value = 'recently_visited'
            },
            { 
                label: 'Most visited',
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
        // recently_added + pinned zuerst
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
      <div class="font-semibold">All bookmarks</div>
      <div>
        <Menu ref="sortMenu" :model="sortOptions" popup />
        <Button label="Sort by" icon="pi pi-sort-alt" @click="toggleSortMenu" />
      </div>
    </div>
    <!-- Cards -->
    <div class="flex flex-wrap p-5 gap-4 overflow-y-auto">
      <BookmarkCard v-for="bookmark in filteredBookmarks" :key="bookmark.id" :bookmark="bookmark" />
    </div>
  </div>
</template>
