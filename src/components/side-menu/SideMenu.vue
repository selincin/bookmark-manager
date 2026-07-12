<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router'
import { useUtilities } from '../../composables/utilityComposable';
import { useBookmarkStore } from '../../store/bookmarks';

import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Checkbox from 'primevue/checkbox'

const { isMobile } = useUtilities()
const { t } = useI18n()

const bookmarkStore = useBookmarkStore()
const router = useRouter()
const route = useRoute()

const selectedTags = ref<string[]>([])
const items = computed(() => [
    {
        label: t('BOOKMARK_MANAGER.MENU.HOME'),
        icon: 'pi pi-fw pi-home',
        command: () => {
            router.push({ name: 'home' })
            if (isMobile.value) {
                emit('close')
            }
        }
    },
    {
        label: t('BOOKMARK_MANAGER.MENU.ARCHIVED'),
        icon: 'pi pi-fw pi-box',
        command: () => {
            router.push({ name: 'archived' })
            if (isMobile.value) {
                emit('close')
            }
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
    <div v-if="props.isOpen"
        class="w-full md:w-70 shrink-0 border-r border-emerald-800 dark:border-primary-800 flex flex-col gap-3 bg-white dark:bg-primary-950">
        <div class="flex gap-3 w-full items-center border-b p-3 border-emerald-800">
            <Button @click="emit('close')" icon="pi pi-bookmark" />
            <div class="font-bold text-lg dark:text-white">{{ t('BOOKMARK_MANAGER.TITLE') }}</div>
        </div>
        <Menu :model="items" :pt="{
            root: {
                class: 'border-none! bg-transparent!'
            },
            itemLink: {
                class: 'pl-2!'
            }
        }" />
        <div v-if="route.name !== 'archived'" class="flex flex-col gap-2 p-4">
            <div class="font-bold text-l dark:text-gray-300">{{ t('BOOKMARK_MANAGER.MENU.TAGS') }}</div>
            <div v-for="tag in availableTags" :key="tag" class="flex items-center justify-between gap-2">
                <label :for="tag" class="text-sm cursor-pointer dark:text-gray-300">{{ tag }}</label>
                <Checkbox v-model="selectedTags" :value="tag" :inputId="tag"
                    @change="emit('tagsChanged', selectedTags)" />
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss"></style>
