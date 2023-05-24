import { useSelector } from "react-redux";
import { Dropdown } from "../common";
import { useEffect, useState } from "react";

export default () => {
    const { proxy, lang, auth } = useSelector(state => state);

    console.log(auth)
    const [defaultValue, setDefaultValue] = useState({})
    const fullname = localStorage.getItem("fullname");

    const langs = [
        { id: 0, label: "Tiếng Việt", flag: "vietnam.png", value: "Vi" },
        { id: 1, label: "English", flag: "united-kingdom.png", value: "En" },
    ]
    const options = langs;

    useEffect(() => {
        let langItem = localStorage.getItem("lang");
        langItem = langItem ? langItem : "Vi";
        const defaultLang = langs.filter(l => l.value == langItem)[0]
        setDefaultValue(defaultLang)
    }, [])

    const renderLanguage = (name, flag, color = true) => {
        return (
            <div className="d-flex flex-nowrap">
                <img style={{ width: 22 }} src={`/images/flags/${flag}`} />
                <span className={`d-block ml-2 ${!color && "language-custom"}`}>{name}</span>
            </div>
        )
    }

    const signOut = () => {
        window.location = '/signout'
    }

    const clickHandler = (e, opt) => {
        console.log(opt)
        e.preventDefault()
        setLanguage(opt)
    }

    const setLanguage = ({ value }) => {
        console.log(value)
        localStorage.setItem("lang", value);
        window.location.reload()
    }

    const generateUserLastName = () => {
        const { fullname } = auth
        if( fullname ){
            const names = fullname.split(' ');
            const displayFullName = names[names.length - 1];
            return displayFullName
        }else{
            return ""
        }
    }

    return (
        <div class="topbar">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="full d-flex flex-row">
                    <button type="button" id="sidebarCollapse" class="sidebar_toggle"><i class="fa fa-bars"></i></button>
                    <div className="ml-auto dropdown d-flex align-items-center">
                        <div className="d-flex flex-nowrap"
                            id="lang-drop-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            
                            <a href="#" className="d-block text-light "> {renderLanguage(defaultValue.label, defaultValue.flag, false)} </a>
                            <a className="d-block ml-2" href="#"><i class="fa fa-caret-down"></i></a>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="#lang-drop-toggle">
                            {options.map(opt =>
                                <a key={opt.id} href="#" className="dropdown-item cursor-pointer" onClick={(e) => { clickHandler(e, opt) }}>
                                    {renderLanguage(opt.label, opt.flag)}
                                </a>
                            )}
                        </div>
                    </div>
                    <div class="d-flex flex-nowrap">
                        <div class="icon_info">
                            <ul>
                                {/* <li><a href="#"><i class="fa fa-question-circle"></i></a></li>
                                <li><a href="#"><i class="fa fa-bell-o"></i><span class="badge">2</span></a></li> */}
                                <li><a href="#"><i class="fa fa-envelope-o"></i><span class="badge">1</span></a></li> 
                            </ul>
                            <ul class="user_profile_dd ">
                                <li>
                                    <a class="dropdown-toggle" data-toggle="dropdown">
                                        <img class="img-responsive " src={proxy + auth.avatar} alt="#" />
                                        <span class="name_user">{lang["user info"]}, { generateUserLastName() }</span>
                                    </a>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="profile.html">{lang["my profile"]}</a>
                                        <a class="dropdown-item" href="settings.html">{lang["settings"]}</a>
                                        <a class="dropdown-item" href="help.html">{lang["help"]}</a>

                                        <a class="dropdown-item" href="#" onClick={signOut}><span>{lang["signout"]}</span> <i class="fa fa-sign-out"></i></a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}