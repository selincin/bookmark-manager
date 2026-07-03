import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

export function useUtilities() {
    const { width } = useWindowSize()

    const isMobile = computed(() => width.value < 768)
    const isTablet = computed(() => width.value >= 768 && width.value < 1024)
    const isUnder1400 = computed(() => width.value < 1400)

    return {
        isMobile,
        isTablet,
        isUnder1400
    }
}