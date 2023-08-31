import { format, parseISO } from 'date-fns';

export function formatDate(isoString) {
    if (!isoString) return "";

    try {
        const date = parseISO(isoString); // parse ISO string
        return format(date, 'dd-MM-yyyy  HH:mm:ss'); // format date
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";  // or maybe return a default date or another string to indicate the error
    }
}
