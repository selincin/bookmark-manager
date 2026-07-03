<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import type Bookmark from '../../models/Bookmark';

import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import Button from 'primevue/button';

const toast = useToast();
const props = defineProps<{
  bookmark: Bookmark
}>()

const menu = ref();
const items = ref([
    {
        items: [
            { 
                label: 'Visit', 
                icon: 'pi pi-fw pi-external-link',
                command: () => window.open(props.bookmark.url, '_blank')
            },
            { 
                label: 'Copy URL', 
                icon: 'pi pi-fw pi-copy',
                command: () => copyToClipboard(props.bookmark.url)
            },
            { 
                label: 'Pin', 
                icon: 'pi pi-thumbtack',
            },
            { 
                label: 'Edit', 
                icon: 'pi pi-pencil',
            },
            { 
                label: 'Archive', 
                icon: 'pi pi-box',
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
</script>

<template>
    <div class="bookmark-card-container shadow-md">
        <div class="card-top flex justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <div class="shrink-0">
                    <img :src="bookmark.icon" alt="favicon" class="w-8 h-8 rounded-full" />
                </div>
                <div class="flex flex-col">
                    <div class="font-bold text-xl bookmark-title"> {{bookmark.title}} </div>
                    <div class="text-gray-500 max-w-36 min-w-36 truncate"> {{bookmark.url}} </div>
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
        <div class="card-middle overflow-y-auto">
            <div>
                {{bookmark.description}}
            </div>
            <div>badges</div>
        </div>
        <Divider />
        <div class="card-bottom flex justify-end">
            <i class="pi pi-thumbtack text-xs!"></i>
        </div>

    </div>
</template>

<style scoped lang="scss">
.bookmark-card-container {
    border: 1px solid rgb(221, 218, 218);
    width: 20rem;
    height: 20rem;
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
