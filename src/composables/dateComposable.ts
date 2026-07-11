import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(localeData);
dayjs.extend(advancedFormat);

export function useDateTime() {
    type DateInput = string | Date | number | undefined | null

    const formatRelative = (dateTimeInput?: DateInput): string => {
        if (!dateTimeInput) return ''

        const now = dayjs()
        const dateTime = dayjs(dateTimeInput)

        if (!dateTime.isValid()) {
            console.error('Invalid date:', dateTimeInput)
            return ''
        }

        const diffInMinutes = now.diff(dateTime, 'minute')
        const diffInHours = now.diff(dateTime, 'hour')

        if (diffInMinutes < 60) {
            if (diffInMinutes < 1) return 'now'
            if (diffInMinutes === 1) return '1 minute ago'
            return `${diffInMinutes} minutes ago`
        }

        if (dateTime.isToday()) {
            if (diffInHours === 1) return '1 hour ago'
            return `${diffInHours} hours ago`
        }

        if (dateTime.isYesterday()) return 'yesterday'

        return dateTime.format('DD. MMM')
    }

    const formatDateDDMM = (dateTimeInput?: DateInput): string => {
        if (!dateTimeInput) return ''
        const dateTime = dayjs(dateTimeInput)
        if (!dateTime.isValid()) return ''
        return dateTime.format('DD. MMM')
    }

    return {
        formatRelative,
        formatDateDDMM,
    }
}