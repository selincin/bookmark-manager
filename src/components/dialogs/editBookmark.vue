<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { useBookmarks } from '@/composables/useBookmarksComposable';

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import type Bookmark from '@/models/Bookmark';

const injectedData = inject('dialogRef');
const useBookmarksComposable = useBookmarks()

const bookmark = ref<Bookmark | null>(null)
const originalBookmark = ref<Bookmark | null>(null)
const updating = ref<boolean>(false)
const buttonLocked = ref<boolean>(true)

const inputTitleInvalid = ref<boolean>(false)
const inputDescriptionInvalid = ref<boolean>(false)
const inputUrlInvalid = ref<boolean>(false)

onMounted(() => {
    originalBookmark.value = { ...injectedData.value.data.bookmark }
    bookmark.value = { ...injectedData.value.data.bookmark }
})

const changesDetected = () => {
    if (
        bookmark.value?.title === originalBookmark.value?.title &&
        bookmark.value?.description === originalBookmark.value?.description &&
        bookmark.value?.url === originalBookmark.value?.url
    ) {
        buttonLocked.value = true
        return
    }
    buttonLocked.value = false

    inputTitleInvalid.value = (bookmark.value?.title?.length ?? 0) < 3
    inputDescriptionInvalid.value = (bookmark.value?.description?.length ?? 0) < 3

    try {
        new URL(bookmark.value?.url ?? '')
        inputUrlInvalid.value = false
    } catch {
        inputUrlInvalid.value = true
    }
}

const submit = async () => {
    if (!bookmark.value) return
    updating.value = true
    await useBookmarksComposable.updateBookmark(bookmark.value)
    updating.value = false
    injectedData.value.close()
}

const closeDialog = () => {
    injectedData.value.close()
}
</script>

<template>
    <div v-if="bookmark" class="flex flex-col gap-4 pt-4">
        <FloatLabel variant="on">
            <InputText id="title" v-model="bookmark.title" @input="changesDetected" autocomplete="off"
                :placeholder="(bookmark?.title ?? '') === '' ? 'Title' : ''" class="w-full"
                :invalid="inputTitleInvalid" />
            <label for="title">Title</label>
            <small v-if="inputTitleInvalid" class="text-red-500">Min. 3 Zeichen</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="description" v-model="bookmark.description" @input="changesDetected" autocomplete="off"
                :placeholder="(bookmark?.description ?? '') === '' ? 'Description' : ''" class="w-full"
                :invalid="inputDescriptionInvalid" />
            <label for="description">Description</label>
            <small v-if="inputDescriptionInvalid" class="text-red-500">Min. 3 Zeichen</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="url" v-model="bookmark.url" @input="changesDetected" autocomplete="off"
                :placeholder="(bookmark?.url ?? '') === '' ? 'Website URL' : ''" class="w-full"
                :invalid="inputUrlInvalid" />
            <label for="url">Website URL</label>
            <small v-if="inputUrlInvalid" class="text-red-500">Gültige URL eingeben</small>
        </FloatLabel>

        <div class="flex justify-end gap-2 pt-3">
            <Button label="Cancel" outlined @click="closeDialog()" :disabled="updating" />
            <Button label="Save"
                :disabled="buttonLocked || updating || inputTitleInvalid || inputDescriptionInvalid || inputUrlInvalid"
                :icon="updating ? 'pi pi-spin pi-spinner' : 'pi pi-check'" @click="submit" />
        </div>
    </div>
</template>