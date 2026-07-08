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
    // format dateTime as defined in SVH-317
    const formatRelative = (dateTimeString): String => {
        const now = dayjs();
        const dateTime = dayjs(dateTimeString);
        const diffInMinutes = now.diff(dateTime, 'minute');
        const diffInHours = now.diff(dateTime, 'hour');

        if(!dateTime.isValid()) {
            console.error("Invalid date: " + dateTimeString);
            return "";
        }

        if (diffInMinutes < 60) {
            if (diffInMinutes < 1) {
                return "now";
            }
            if (diffInMinutes === 1) {
                return "1 minute ago";
            }
            return `${diffInMinutes} minutes ago`;
        }

        if (dateTime.isToday()) {
            if (diffInHours === 1) {
                return "1 hour ago";
            }
            return `${diffInHours} hours ago`;
        }

        if (dateTime.isYesterday()) {
            return "yesterday";
        }

        return dateTime.format('L');
    };

    const formatDateDDMMYYYY = (dateTimeString) => {
        const dateTime = dayjs(dateTimeString);
        return dateTime.format('DD. MMM');
    };


    return {
        formatRelative,
        formatDateDDMMYYYY,
    };
}
