import { useSelector } from "react-redux"

import { Header, Dropdown } from "../common"
import { useEffect, useState } from "react";
export default () => {
    const { lang } = useSelector(state => state);
    const [ defaultValue, setDefaultValue ] = useState({})

    const langs = [
        { id: 0, label: "Tiếng Việt", value: "Vi" },
        { id: 1, label: "English", value: "En" },
    ]

    useEffect(() => {
        let langItem = localStorage.getItem("lang");
        langItem = langItem ? langItem : "Vi";
        const defaultLang = langs.filter( l => l.value == langItem  )[0]        
        setDefaultValue(defaultLang)
    }, [])

    

    const setLanguage = ( { value } ) => {       
        localStorage.setItem("lang", value);
        window.location.reload()
    }

    return(
        <div className="container">
            <Header title={ lang["settings.title"] } desc={ lang["settings.desc"] }/>
            <div className="d-flex flex-wrap">
                <div className="row w-100">
                    <div className="col-md-4 d-flex flex-nowrap row align-items-center mt-2">
                        <div className="col-md-6">
                            <span>{ lang["settings.languages"] }</span>    
                        </div>
                        <div className="col-md-6">
                            <Dropdown options={ langs } func={ setLanguage } defaultValue={ defaultValue } fitWidth={ true }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}