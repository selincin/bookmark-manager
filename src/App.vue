<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUtilities } from './composables/utilityComposable';
import { useBookmarks } from './composables/useBookmarksComposable';
import { useBookmarkStore } from './store/bookmarks.ts';

import SideMenu from './components/side-menu/SideMenu.vue';

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

const searchBookmark = ref('');
const sideMenuOpen = ref(true);

const toggleSideMenu = () => {
  sideMenuOpen.value = !sideMenuOpen.value;
}

onMounted(() => {
  useBookmarksComposable.loadBookmarks();
});

</script>

<template>
  <div class="flex h-screen">
    <SideMenu :isOpen="sideMenuOpen" @close="toggleSideMenu" />
    <div class="flex flex-col flex-1 min-h-0 bg-lime-50">
      <div class="p-2 shrink-0 flex items-center gap-2">
        <Button v-if="!sideMenuOpen" @click="toggleSideMenu" icon="pi pi-bookmark" />
        <InputGroup class="flex-1">
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="searchBookmark" placeholder="Search" />
        </InputGroup>
        <Button :label="utilities.isMobile.value ? '' : 'Add bookmark'" icon="pi pi-plus" class="shrink-0 whitespace-nowrap"/>
      </div>
      <!-- content area -->
      <RouterView :searchTerm="searchBookmark" />
    </div>
    <Toast position="top-right"/>
    <DynamicDialog />
  </div>
</template>

<style scoped lang="scss">
</style>
