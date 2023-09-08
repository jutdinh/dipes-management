import { v4 as uuidv4 } from 'uuid';
import responseMessages from "../../cpn/enum/response-code"
import Swal from 'sweetalert2';



const vietnameseChars = [
    {
        base: {
            base: "a",
            unicode: ["ă", "â"],
            unicodeWithSound: ["á", "à", "ả", "ã", "ạ", "ắ", "ằ", "ẳ", "ẵ", "ặ", "ấ", "ầ", "ẩ", "ẫ", "ậ"],
        }
    },
    {
        base: {
            base: "d",
            unicode: ["đ"],
            unicodeWithSound: []
        }
    },
    {
        base: {
            base: "e",
            unicode: ["ê"],
            unicodeWithSound: ["é", "è", "ẻ", "ẽ", "ẹ", "ế", "ề", "ể", "ễ", "ệ"]
        }
    },
    {
        base: {
            base: "i",
            unicode: [],
            unicodeWithSound: ["í", "ì", "ỉ", "ĩ", "ị"]
        }
    },
    {
        base: {
            base: "o",
            unicode: ["ô", "ơ"],
            unicodeWithSound: ["ó", "ò", "ỏ", "õ", "ọ", "ố", "ồ", "ổ", "ỗ", "ộ", "ớ", "ờ", "ở", "ỡ", "ợ"]
        }
    },
    {
        base: {
            base: "u",
            unicode: ["ư"],
            unicodeWithSound: ["ú", "ù", "ủ", "ũ", "ụ", "ứ", "ử", "ử", "ữ", "ự"]
        }
    },
    {
        base: {
            base: "y",
            unicode: [],
            unicodeWithSound: ["ý", "ỳ", "ỷ", "ỹ", "ỵ"]
        }
    }
];

const dateGenerator = ( dateString ) => {
    const date = new Date( dateString );
    return `${ formatDateNumber(date.getDate()) }/${ formatDateNumber(date.getMonth() + 1) }/${ date.getFullYear() } lúc ${ formatDateNumber(date.getHours()) }:${ formatDateNumber(date.getMinutes()) }`
}

const formatDateNumber = (int) => {
    if( int < 10 ){
        return `0${int}`
    }else{
        return `${int}`
    }
}

const openTab = (url) => {
    // window.open(url, '_blank').focus();
    window.location = url;
}



function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

const uid = () => {
    let id = uuidv4();
    id = id.replaceAll('-', '');
    return `#${ id }`
}

const removeDuplicate = ( data ) => {

    const uniqueArray = data.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === data.findIndex(obj => {
            return JSON.stringify(obj) === _value;
        });
    });
    return uniqueArray
}

const showApiResponseMessage = (status, reload = true) => {
    const langItem = (localStorage.getItem("lang") || "Vi").toLowerCase(); // fallback to English if no language is set
    const message = responseMessages[status];

    const title = message?.[langItem]?.type || "Unknown error";
    const description = message?.[langItem]?.description || "Unknown error";
    let icon = "error";  
    if (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") {
        icon = "success";
    } else if (message?.[langItem]?.type === "Cảnh báo" || message?.[langItem]?.type === "Warning") {
        icon = "warning";
    }

    if (icon === "success") {
        Swal.fire({
            title,
            text: description,
            icon,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            if (reload) {
                window.location.reload();
            }
        });
    } else if (icon === "error") {
        Swal.fire({
            title,
            text: description,
            icon,
            showConfirmButton: true,
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        });
    }
};

const removeVietnameseTones = (str) => {
    vietnameseChars.forEach(char => {
        const { base, unicode, unicodeWithSound } = char.base;
        const allVariants = [...unicode, ...unicodeWithSound];
        allVariants.forEach(variant => {
            const regex = new RegExp(variant, 'g');
            str = str.replace(regex, base);
        });
    });
    return str;
}

function formatDateTask(input) {
    if (input === null || input === undefined) return null
    const dateParts = input.split('-');
    if (dateParts.length !== 3) return null;
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
}

export default {
    uid, removeDuplicate, titleCase, openTab, dateGenerator,
    showApiResponseMessage, removeVietnameseTones, formatDateTask 
}
