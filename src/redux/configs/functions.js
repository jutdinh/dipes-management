import { v4 as uuidv4 } from 'uuid';
import responseMessages from "../../cpn/enum/response-code"
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';

import $ from 'jquery';

import CryptoJS from 'crypto-js';

import Blocks from './blocks/index'


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

const dateGenerator = (dateString) => {
    const date = new Date(dateString);
    return `${formatDateNumber(date.getDate())}/${formatDateNumber(date.getMonth() + 1)}/${date.getFullYear()} lúc ${formatDateNumber(date.getHours())}:${formatDateNumber(date.getMinutes())}`
}

const formatDateNumber = (int) => {
    if (int < 10) {
        return `0${int}`
    } else {
        return `${int}`
    }
}

const openTab = (url) => {
    // window.open(url, '_blank').focus();
    window.location = url;
}



function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

const uid = () => {
    let id = uuidv4();
    id = id.replaceAll('-', '');
    return `#${id}`
}

const removeDuplicate = (data) => {

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
            target: document.getElementById("second-row"),

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
            target: document.getElementById("second-row"),
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

function formatDate(isoString) {
    if (!isoString) return "";

    try {
        const date = parseISO(isoString); // parse ISO string
        return format(date, 'dd-MM-yyyy  HH:mm:ss'); // format date
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";  // or maybe return a default date or another string to indicate the error
    }
}
function toggleFullScreen() {
    // Đây là thẻ div bạn muốn hiển thị ở chế độ toàn màn hình
    const elem = document.querySelector('.table_section');

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}




const getFormatedUUID = () => {
    /** 
     *  @type: functions
     * 
     *  @libr: uuid 
     * 
     *  @desc:
     *  Tạo uuid với format là một chuỗi 32 ký tự liền nhau gồm số và chữ cái viết hoa
     *  (1): Tạo UUID từ thư viện
     *  (2): Biến đổi toàn bộ ký tự thường thành ký tự in hoa
     *  (3): Xoá toàn bộ dấu gạch [__dash__] 
     * 
     */
    let id = uuidv4()               // (1)
    id = id.toUpperCase()           // (2)  
    id = id.replaceAll("-", "")     // (3)
    return id
}



const minimizeFloatingBG = () => {
    $('.floating-boxes').css({
        width: 0,
        height: 0
    })
    $('.floating-bg').hide()
}


const restoreFloatingBG = () => {
    $('.floating-boxes').css({
        width: "100vw",
        height: "100vh"
    })
    $('.floating-bg').show()
}


const getComponentByName = (name) => {

    const Compoennt = Blocks[name]

    if (Compoennt) {
        return Compoennt
    }
    return undefined
}

const fillIDToBlockAndChildren = (block) => {

    const { children } = block;
    block.id = getFormatedUUID()
    if (children) {
        for (let i = 0; i < children.length; i++) {
            children[i] = fillIDToBlockAndChildren({ parent_id: block.id, ...children[i] })
        }
    }
    return block
}

const makePageURL = (page) => {
    const { page_id, params } = page;

    if (params) {
        const names = params.map(p => removeVietnameseTones(p.field_name))

        return `/page/${page_id}/:${names.join('/:')}`

    } else {
        return `/page/${page_id}`
    }

}

function formatDateTaskMDY(input) {
    if (input === null || input === undefined) return null
    const dateParts = input.split('-');
    if (dateParts.length !== 3) return null;
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
}

//Debouncing
const debounce = (func, delay) => {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};



const encryptData = (data) => {
    const algorithm = CryptoJS.algo.AES;
    const key = CryptoJS.enc.Utf8.parse("thisistheinintvethisistheinintve"); // Khóa phải giống backend
    const iv = CryptoJS.enc.Utf8.parse("thisistheinintve"); // IV phải giống backend

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};


const renderData = (field, data) => {
    // //console.log(field)
    if (data) {
        switch (field.DATATYPE) {
            case "DATE":
            case "DATETIME":
                return renderDateTimeByFormat(data[field.fomular_alias], field.FORMAT);
            case "DECIMAL":
            case "DECIMAL UNSIGNED":
                const { DECIMAL_PLACE } = field;
                const decimalNumber = parseFloat(data[field.fomular_alias]);
                return decimalNumber.toFixed(DECIMAL_PLACE)
            case "BOOL":
                return renderBoolData(data[field.fomular_alias], field)
            default:
                return data[field.fomular_alias];
        }
    } else {
        return "Invalid value"
    }
};

const numberOfLength2Format = (number) => {
    if (number < 10) {
        return `0${number}`
    }
    return `${number}`
}

const renderBoolData = (data, field) => {
    const IF_TRUE = field.DEFAULT_TRUE;
    const IF_FALSE = field.DEFAULT_FALSE
    if (data != undefined) {
        if (data) {
            return IF_TRUE ? IF_TRUE : "true"
        }
        return IF_FALSE ? IF_FALSE : "false"
    } else {
        return IF_FALSE ? IF_FALSE : "false"
    }
}

const renderDateTimeByFormat = (dateString, format) => {
    if (format) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const secs = date.getSeconds()

        let result = format;
        result = result.replaceAll("dd", numberOfLength2Format(day));
        result = result.replaceAll("MM", numberOfLength2Format(month));
        result = result.replaceAll("yyyy", year);

        result = result.replaceAll("hh", numberOfLength2Format(hour));
        result = result.replaceAll("mm", numberOfLength2Format(minute));
        result = result.replaceAll("ss", numberOfLength2Format(secs));

        return result;
    }
    return dateString
}

export default {
    uid, removeDuplicate, titleCase, openTab, dateGenerator,
    showApiResponseMessage, removeVietnameseTones,
    formatDateTask, formatDate, toggleFullScreen,

    getFormatedUUID,
    minimizeFloatingBG,
    restoreFloatingBG,
    getComponentByName,
    fillIDToBlockAndChildren,

    makePageURL,

    formatDateTaskMDY, debounce, encryptData, renderData
}
