require("dotenv").config()

const DEBUG = process.env.DEBUG;

const successLog = (msg, prefix="" ) => {
    if(DEBUG){
        console.log(`${prefix}PASSED:   ${msg}`)
    }
}

const errorLog = (msg, prefix="" ) => {
    if(DEBUG){
        console.log(`${prefix}ERROR!:   ${ msg }`)
    }
}

const warningLog = (msg, prefix="" ) => {
    if( DEBUG ){
        console.log(`${prefix}WARNNING: ${ msg }`)
    }
}

const infoLog = (msg, prefix="" ) => {
    if( DEBUG ){
        console.log(`${prefix}INFOR:    ${ msg }`)
    }
}

const log = (msg, prefix="" ) => {
    if( DEBUG ){
        console.log(`${ prefix }`, msg)
    }
}


module.exports = {
    successLog,
    errorLog,
    warningLog,
    infoLog,
    log
}