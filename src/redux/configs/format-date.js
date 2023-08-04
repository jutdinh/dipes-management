import { format, parseISO } from 'date-fns';


// Hàm định dạng ngày giờ
export function formatDate(isoString) {
    const date = parseISO(isoString); // parse ISO string
    return format(date, 'dd-MM-yyyy  HH:mm:ss'); // format date
}
