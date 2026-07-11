<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { useBookmarks } from '@/composables/useBookmarksComposable';

import type Bookmark from '@/models/Bookmark';

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const injectedData = inject('dialogRef') as any;
const useBookmarksComposable = useBookmarks();

const bookmark = ref<Bookmark | null>(null);
const originalBookmark = ref<Bookmark | null>(null);
const updating = ref<boolean>(false);
const buttonLocked = ref<boolean>(true);

const inputTitleInvalid = ref<boolean>(false);
const inputDescriptionInvalid = ref<boolean>(false);
const inputUrlInvalid = ref<boolean>(false);
const mode = ref<'add' | 'edit'>('add');

onMounted(() => {
    mode.value = injectedData.value.data.mode

    if (mode.value === 'edit') {
        originalBookmark.value = { ...injectedData.value.data.bookmark }
        bookmark.value = { ...injectedData.value.data.bookmark }
    } else {
        bookmark.value = {} as Bookmark
        buttonLocked.value = false
    }
})

const changesDetected = () => {
    if (!bookmark.value) return

    if (
        bookmark.value?.title === originalBookmark.value?.title &&
        bookmark.value?.description === originalBookmark.value?.description &&
        bookmark.value?.url === originalBookmark.value?.url &&
        bookmark.value?.tag === originalBookmark.value?.tag
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
    if (mode.value === 'edit') {
        await useBookmarksComposable.updateBookmark(bookmark.value)
    } else {
        await useBookmarksComposable.createBookmark(bookmark.value)
    }

    updating.value = false
    closeDialog()
}

const closeDialog = () => {
    injectedData.value.close();
}
</script>

<template>
    <div v-if="bookmark" class="flex flex-col gap-4 pt-4">
        <FloatLabel variant="on">
            <InputText id="title" v-model="bookmark.title" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.title ?? ''" class="w-full"
                :invalid="inputTitleInvalid" />
            <label for="title">Title</label>
            <small v-if="inputTitleInvalid" class="text-red-500">Min. 3 Zeichen</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="description" v-model="bookmark.description" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.description ?? ''" class="w-full"
                :invalid="inputDescriptionInvalid" />
            <label for="description">Description</label>
            <small v-if="inputDescriptionInvalid" class="text-red-500">Min. 3 Zeichen</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="tag" v-model="bookmark.tag" :placeholder="bookmark?.tag ?? ''" @input="changesDetected" autocomplete="off" class="w-full" />
            <label for="tag">Tag</label>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="url" v-model="bookmark.url" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.url ?? ''" class="w-full"
                :invalid="inputUrlInvalid" />
            <label for="url">Website URL</label>
            <small v-if="inputUrlInvalid" class="text-red-500">Gültige URL eingeben</small>
        </FloatLabel>

        <div class="flex justify-end gap-2 pt-3">
            <Button label="Cancel" outlined @click="closeDialog()" :disabled="updating" />
            <Button :label="mode === 'edit' ? 'Save' : 'Add'"
                :disabled="buttonLocked || updating || inputTitleInvalid || inputDescriptionInvalid || inputUrlInvalid"
                :icon="updating ? 'pi pi-spin pi-spinner' : 'pi pi-check'" @click="submit()" />
        </div>
    </div>
</template>