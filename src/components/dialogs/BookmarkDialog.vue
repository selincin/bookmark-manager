<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBookmarks } from '@/composables/useBookmarksComposable';

import type Bookmark from '@/models/Bookmark';

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const injectedData = inject('dialogRef') as any;
const useBookmarksComposable = useBookmarks();
const { t } = useI18n();

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

const dialogTitle = computed(() => mode.value === 'edit' ? t('BOOKMARK_MANAGER.DIALOG.EDIT_TITLE') : t('BOOKMARK_MANAGER.DIALOG.ADD_TITLE'))
const dialogDescription = computed(() => mode.value === 'edit' ? t('BOOKMARK_MANAGER.DIALOG.EDIT_DESCRIPTION') : t('BOOKMARK_MANAGER.DIALOG.ADD_DESCRIPTION'))

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
     <div class="dialog-header flex justify-between py-3">
        <div>
            <div class="text-xl font-bold">{{ dialogTitle }}</div>
            <div>{{ dialogDescription }}</div>
        </div>
        <Button iconOnly rounded variant="text"  icon="pi pi-times" @click="closeDialog()"/>
     </div>
        <FloatLabel variant="on">
            <InputText id="title" v-model="bookmark.title" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.title ?? ''" class="w-full"
                :invalid="inputTitleInvalid" />
            <label for="title">{{ t('BOOKMARK_MANAGER.DIALOG.TITLE_FIELD') }}</label>
            <small v-if="inputTitleInvalid" class="text-red-500">{{ t('BOOKMARK_MANAGER.DIALOG.VALIDATION.MIN_CHARS') }}</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <Textarea id="description" v-model="bookmark.description" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.description ?? ''" class="w-full"
                :invalid="inputDescriptionInvalid" rows="5" size="large" resize-none/>

            <label for="description">{{ t('BOOKMARK_MANAGER.DIALOG.DESCRIPTION_FIELD') }}</label>
            <small v-if="inputDescriptionInvalid" class="text-red-500">{{ t('BOOKMARK_MANAGER.DIALOG.VALIDATION.MIN_CHARS') }}</small>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="tag" v-model="bookmark.tag" :placeholder="bookmark?.tag ?? ''" @input="changesDetected" autocomplete="off" class="w-full" />
            <label for="tag">{{ t('BOOKMARK_MANAGER.DIALOG.TAG_FIELD') }}</label>
        </FloatLabel>

        <FloatLabel variant="on">
            <InputText id="url" v-model="bookmark.url" @input="changesDetected" autocomplete="off"
                :placeholder="bookmark?.url ?? ''" class="w-full"
                :invalid="inputUrlInvalid" />
            <label for="url">{{ t('BOOKMARK_MANAGER.DIALOG.URL_FIELD') }}</label>
            <small v-if="inputUrlInvalid" class="text-red-500">{{ t('BOOKMARK_MANAGER.DIALOG.VALIDATION.VALID_URL') }}</small>
        </FloatLabel>

        <div class="flex justify-end gap-2 pt-3">
            <Button :label="t('BOOKMARK_MANAGER.DIALOG.CANCEL')" outlined @click="closeDialog()" :disabled="updating" />
            <Button :label="mode === 'edit' ? t('BOOKMARK_MANAGER.DIALOG.SAVE') : t('BOOKMARK_MANAGER.DIALOG.ADD')"
                :disabled="buttonLocked || updating || inputTitleInvalid || inputDescriptionInvalid || inputUrlInvalid"
                :icon="updating ? 'pi pi-spin pi-spinner' : 'pi pi-check'" @click="submit()" />
        </div>
    </div>
</template>