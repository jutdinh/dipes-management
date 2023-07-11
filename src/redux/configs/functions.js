import { v4 as uuidv4 } from 'uuid';
import responseMessages from "../../cpn/enum/response-code"
import Swal from 'sweetalert2';

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
    const icon = (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") ? "success" : "error";

    Swal.fire({
        title,
        text: description,
        icon,
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        if (icon === "success") {

            if( reload ){
                window.location.reload();
            }
        }
    });
};


export default {
    uid, removeDuplicate, titleCase, openTab, dateGenerator,
    showApiResponseMessage
}
