<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUtilities } from './composables/utilityComposable';
import { useBookmarks } from './composables/useBookmarksComposable';
import { useBookmarkStore } from './store/bookmarks.ts';

// primevue components
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import BookmarkCard from './components/bookmark-card/BookmarkCard.vue';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';

const utilities = useUtilities()
const useBookmarksComposable = useBookmarks()
const bookmarkStore = useBookmarkStore()

const searchBookmark = ref(null);
const sideMenuOpen = ref(true);

const sortedBookmarks = computed(() => {
  const sorted = [...bookmarkStore.bookmarks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.pinned && b.pinned) {
      return new Date(b.pinned_at!).getTime() - new Date(a.pinned_at!).getTime()
    }
    return 0
  })
  return sorted
})

const toggleSideMenu = () => {
  sideMenuOpen.value = !sideMenuOpen.value;
}

onMounted(() => {
  useBookmarksComposable.loadBookmarks();
});


// TODO
/*
- sort by title without the pinned ones
- page for archived bookmarks
- edit form 
- search bookmarks by title, description, tags
- sidemenu as a component
*/
</script>

<template>
  <div class="flex h-screen">
    <!-- sidemenu-->
    <div v-if="sideMenuOpen" class="w-full md:w-70 shrink-0 border-r border-emerald-800">
      huhu
      <div @click="toggleSideMenu">x</div>
    </div>
    <div class="flex flex-col flex-1">
      <!-- search area -->
      <div class="p-2 shrink-0 border-b border-emerald-800 flex items-center gap-2">
        <Button v-if="!sideMenuOpen" @click="toggleSideMenu" icon="pi pi-bars" aria-label="Save" />
        <InputGroup class="flex-1">
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="searchBookmark" placeholder="Search" />
        </InputGroup>
        <Button :label="utilities.isMobile.value ? '' : 'Add bookmark'" icon="pi pi-plus" class="shrink-0 whitespace-nowrap"/>
      </div>
      <!-- content area-->
      <div class="flex flex-wrap flex-1 bg-lime-50 p-5 gap-4">
        <BookmarkCard v-for="bookmark in sortedBookmarks" :key="bookmark.id" :bookmark="bookmark"/>
      </div>
    </div>
    <Toast position="top-right"/>
    <DynamicDialog />
  </div>
</template>

<style scoped lang="scss">
</style>
