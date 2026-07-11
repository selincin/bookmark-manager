<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUtilities } from './composables/utilityComposable';
import { useBookmarks } from './composables/useBookmarksComposable';
import { useDialog } from 'primevue/usedialog';

import SideMenu from './components/side-menu/SideMenu.vue';
import BookmarkDialog from './components/dialogs/BookmarkDialog.vue';

import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';

const utilities = useUtilities();
const useBookmarksComposable = useBookmarks();
const dialog = useDialog();

const searchBookmark = ref('');
const sideMenuOpen = ref(true);
const selectedTags = ref<string[]>([]);

const onTagsChanged = (tags: string[]) => {
  selectedTags.value = tags;
}

const toggleSideMenu = () => {
  sideMenuOpen.value = !sideMenuOpen.value;
}

onMounted(() => {
  useBookmarksComposable.loadBookmarks();
});

const addBookmark = () => {
    dialog.open(BookmarkDialog, {
        data: {
            mode: 'add'
        },
        props: {
            header: 'Add Bookmark',
            modal: true,
            style: {
                width: '30rem'
            },
        },
    });
}

</script>

<template>
  <div class="flex h-screen">
    <SideMenu :isOpen="sideMenuOpen" @close="toggleSideMenu" @tagsChanged="onTagsChanged" />
    <div class="flex flex-col flex-1 min-h-0 bg-primary-50">
      <div class="p-2 shrink-0 flex items-center gap-2">
        <Button v-if="!sideMenuOpen" @click="toggleSideMenu" icon="pi pi-bookmark" />
        <InputGroup class="flex-1">
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="searchBookmark" placeholder="Search" />
        </InputGroup>
        <Button :label="utilities.isMobile.value ? '' : 'Add bookmark'" icon="pi pi-plus" class="shrink-0 whitespace-nowrap" @click="addBookmark()"/>
      </div>
      <!-- content area -->
      <RouterView :searchTerm="searchBookmark" :selectedTags="selectedTags" />
    </div>
    <Toast position="top-right"/>
    <DynamicDialog />
  </div>
</template>

<style scoped lang="scss">
</style>
