import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"

import PageModify from './page-modify'
import PageChangeIcon from './page-change-icon';
import DesignBlock from "./design-block";
import UiConifg from "./ui-conifg";

export default () => {
    const { floating } = useSelector( state => state )
    const dispatch = useDispatch()

    const pageSettingTrigger = (e) => {
        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger",
        })
    }

    const renderBox = () => {

        const { type, offset } = floating

        switch( type ){
            case "pageModify":
            case "pageChangeName":
                return <PageModify />           
            
            case "pageChangeIcon":
                return <PageChangeIcon />

            case "designBlock":
                return <DesignBlock />
            
            case "uiConfig":
                return <UiConifg />
            
            default:
                return <></>
        }
    }


    return(
        <div className="floating-boxes" style={{ "display": `${ floating.status ? "block": "none" }` }}>
            
            { renderBox() }
            <div className="floating-bg" onClick={(e) => { pageSettingTrigger(e) }}/>
        </div>
    )
}