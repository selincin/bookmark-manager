<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDialog } from 'primevue/usedialog';
import { useBookmarkStore } from '@/store/bookmarks';
import { useBookmarks } from '../../composables/useBookmarksComposable'
import { useDateTime } from '../../composables/dateComposable';

import type Bookmark from '../../models/Bookmark';

import EditBookmark from '../dialogs/editBookmark.vue';

import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import DynamicDialog from 'primevue/dynamicdialog';
import Tag from 'primevue/tag';


const toast = useToast();
const bookmarkStore = useBookmarkStore();
const useBookmarksComposable = useBookmarks()
const dialog = useDialog();
const dateTimeComposable = useDateTime();

const props = defineProps<{
  bookmark: Bookmark
}>()

const menu = ref();

const currentBookmark = computed(() => {
    return bookmarkStore.bookmarks.find((b) => b.id === props.bookmark.id)
})

const getPinLabel = () => {
    return currentBookmark.value?.pinned ? 'Unpin' : 'Pin'
}

const items = computed(() => [
    {
        items: [
            { 
                label: 'Visit', 
                icon: 'pi pi-fw pi-external-link',
                command: () => {
                    useBookmarksComposable.visitBookmark(props.bookmark.id)
                    window.open(props.bookmark.url, '_blank')
                }  
            },
            { 
                label: 'Copy URL', 
                icon: 'pi pi-fw pi-copy',
                command: () => copyToClipboard(props.bookmark.url)
            },
            { 
                label: getPinLabel(), 
                icon: 'pi pi-thumbtack',
                command: () => pinBookmark(props.bookmark.id)   
            },
            { 
                label: 'Edit', 
                icon: 'pi pi-pencil',
                command: () => editBookmark(props.bookmark.id)
            },
            { 
                label: 'Archive', 
                icon: 'pi pi-box',
                command: () => archiveBookmark(props.bookmark.id)
            },
        ]
    }
]);


const toggle = (event) => {
    menu.value.toggle(event);
};

const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Copied to clipboard', detail: url, life: 3000 });
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Error copying to clipboard', detail: err.message, life: 3000 });
        });
};

const archiveBookmark = (id: string) => {
    useBookmarksComposable.archiveBookmark(id)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Bookmark archived', detail: `Bookmark with ID ${id} has been archived.`, life: 3000 });
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Error archiving bookmark', detail: err.message, life: 3000 });
        });
}

const pinBookmark = (id: string) => {
    useBookmarksComposable.togglePin(id);
}

const editBookmark = () => {
    dialog.open(EditBookmark, {
        data: {
            bookmark: props.bookmark,
        },
        props: {
            header: 'Edit Bookmark',
            modal: true,
            style: {
                width: '30rem'
            },
        },
    });
}

const getFavicon = (url: string) => {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=64`
}

const BookmarkTag = () => {
    switch (props.bookmark.tag) {
        case 'Development':
            return 'contrast';
        case 'Design':
            return 'success';
        case 'Productivity':
            return 'warn';
        case 'Learning':
            return 'info';
        default:
            return 'secondary';
    }
}
</script>

<template>
    <div class="bookmark-card-container shadow-md">
        <div class="card-top flex justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <div class="shrink-0">
                    <img :src="getFavicon(bookmark?.url)" alt="favicon" class="w-8 h-8 rounded-full"/>
                </div>
                <div class="flex flex-col">
                    <div class="font-bold text-xl bookmark-title"> {{bookmark?.title}} </div>
                    <div class="text-gray-500 max-w-36 min-w-36 truncate"> {{bookmark?.url}} </div>
                </div>
            </div>
            <Menu ref="menu" :model="items" popup :pt="{
                submenuLabel: {
                    class: 'p-0!'
                }
            }" />
            <Button type="button" severity="secondary" variant="outlined" iconOnly aria-label="Apps"
                icon="pi pi-ellipsis-v" @click="toggle" class="shrink-0" >
            </Button>
        </div>
        <Divider />
        <div class="card-middle overflow-y-auto flex flex-col gap-2">
            {{bookmark?.description}}
            <div>
                <Tag :severity="BookmarkTag()" :value="bookmark?.tag" class="mt-5"/>
            </div>
        </div>
        <Divider />
        <div class="card-bottom flex gap-3 items-baseline justify-between text-gray-500 text-sm">
            <div class="flex gap-3">
                <div class="flex items-center gap-1 text-xs">
                    <i class="pi pi-eye"></i>
                    {{ bookmark.visit_count > 0 ? bookmark.visit_count : '0' }}
                </div>
                <div class="flex items-center gap-1">
                    <i class="pi pi-calendar"></i>
                    {{ dateTimeComposable.formatDateDDMMYYYY(bookmark?.created_at) }}
                </div>
            </div>
            <div class="flex items-center gap-1">
                <i v-if="bookmark?.pinned" class="pi pi-thumbtack text-xs!"></i>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bookmark-card-container {
    border: 1px solid rgb(221, 218, 218);
    width: 20rem;
    height: 18rem;
    border-radius: 1rem;
    padding: 1rem;
    background-color: #ffff;
    display: flex;
    flex-direction: column;
}

.card-top {
    height: 20%;
}

.card-middle {
    height: 70%;
    overflow-y: auto;
}

.card-bottom {
    height: 10%;
}

.bookmark-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
