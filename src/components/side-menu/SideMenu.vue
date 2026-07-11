<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router'

import { useBookmarkStore } from '../../store/bookmarks';

import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import Checkbox from 'primevue/checkbox'


const bookmarkStore = useBookmarkStore()
const router = useRouter()
const route = useRoute()

const selectedTags = ref<string[]>([])
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        command: () => {
            router.push({ name: 'home' })
        }
    },
    {
        label: 'Archived',
        icon: 'pi pi-fw pi-box',
        command: () => {
            router.push({ name: 'archived' })
        }
    }
]);
const props = defineProps<{
    isOpen: boolean
}>()
const emit = defineEmits<{
    close: [],
    tagsChanged: [tags: string[]]
}>()

const availableTags = computed(() => {
    const tags = bookmarkStore.bookmarks
        .flatMap(b => b.tag?.split(',') ?? [])
        .map(t => t.trim())
        .filter(Boolean)
    return [...new Set(tags)]
})

</script>

<template>
    <div v-if="props.isOpen" class="w-full md:w-70 shrink-0 border-r border-emerald-800 flex flex-col gap-3 p-2">
        <div class="flex gap-3 w-full items-center">
            <Button @click="emit('close')" icon="pi pi-bookmark" />
            <div class="font-bold text-lg">Bookmark Manager</div>
        </div>
        <Divider class="mt-0!" />
        <Menu :model="items" :pt="{
            root: {
                class: 'border-none! bg-transparent!'
            },
            itemLink: {
                class: 'pl-2!'
            }
        }" />
        <div v-if="route.name !== 'archived'"  class="flex flex-col gap-2 px-2">
            <Divider class="mt-0!" />
            <div class="font-semibold text-sm">Tags</div>
            <div v-for="tag in availableTags" :key="tag" class="flex items-center justify-between gap-2">
                <label :for="tag" class="text-sm cursor-pointer">{{ tag }}</label>
                <Checkbox v-model="selectedTags" :value="tag" :inputId="tag"
                    @change="emit('tagsChanged', selectedTags)" />
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss"></style>
