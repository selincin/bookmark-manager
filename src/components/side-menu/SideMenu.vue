<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';

const router = useRouter()

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
    close: []
}>()



onMounted(() => {
});

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
                class: 'border-none!'
            },
            itemLink: {
                class: 'pl-2!'
            }
    }" />
    </div>
</template>

<style scoped lang="scss"></style>
