import { useSelector } from "react-redux";
import { Dropdown } from "../common";
import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import $ from 'jquery';
import { useLocation  } from 'react-router-dom';

export default () => {
    const { proxy, lang, auth, profiles } = useSelector((state) => state);
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [defaultValue, setDefaultValue] = useState({});
    const fullname = localStorage.getItem("fullname");

    const langs = [
        { id: 0, label: lang["vi"], flag: "vietnam.png", value: "Vi" },
        { id: 1, label: lang["en"], flag: "united-kingdom.png", value: "En" },
    ];

    const options = langs;

    useEffect(() => {
        let langItem = localStorage.getItem("lang");
        langItem = langItem ? langItem : "Vi";
        const defaultLang = langs.filter((l) => l.value === langItem)[0];
        setDefaultValue(defaultLang);
    }, []);


    const location = useLocation();

    useEffect(() => {
        let langItem = localStorage.getItem("lang");
        langItem = langItem ? langItem : "Vi";
        const defaultLang = langs.filter((l) => l.value === langItem)[0];
        setDefaultValue(defaultLang);

        const storedPageState = localStorage.getItem("pageState");
        const initialPageState = storedPageState ? JSON.parse(storedPageState) : false;
        setPageState(initialPageState);

        if (initialPageState) {
            if (!$('#second-style-sheet').length) {
                $('head').append(`
          <link id="second-style-sheet" rel="stylesheet" href="css/color_2.css" />
        `);
            }
        }

        // Listen for route changes
       

    }, []);
    useEffect(() => {
        // Re-fetch the pageState when location changes
        const storedPageState = localStorage.getItem("pageState");
        const initialPageState = storedPageState ? JSON.parse(storedPageState) : false;
        setPageState(initialPageState);
    }, [location]);
    
    const LanguageRender = ({ name, flag }) => {
        return (
            <div className="d-flex flex-nowrap">
                <img style={{ width: 22 }} src={`/images/flags/${flag}`} />
                {!isMobile && <span className="d-block ml-2 ">{name}</span>}
            </div>
        );
    };

    const DropdownLanguageRender = ({ name, flag }) => {
        return (
            <div className="d-flex flex-nowrap">
                <img style={{ width: 22 }} src={`/images/flags/${flag}`} />
                <span className="d-block ml-2 topbar_lang_light mt-1">{name}</span>
            </div>
        );
    };

    const signOut = () => {
        window.location = "/signout";
    };

    const clickHandler = (e, opt) => {
        e.preventDefault();
        setLanguage(opt);
    };

    const setLanguage = ({ value }) => {
        localStorage.setItem("lang", value);
        window.location.reload();
    };

    const generateUserLastName = () => {
        const { fullname } = auth;
        if (fullname) {
            const names = fullname.split(" ");
            const displayFullName = names[names.length - 1];
            return displayFullName;
        } else {
            return "";
        }
    };

    const [pageState, setPageState] = useState(false);

    const changeTheme = () => {
        const newPageState = !pageState;

        if (newPageState) {
            if (!$('#second-style-sheet').length) {
                $('head').append(`
          <link id="second-style-sheet" rel="stylesheet" href="css/color_2.css" />
        `);
            }
        } else {
            $('#second-style-sheet').remove();
        }

        setPageState(newPageState);

        localStorage.setItem("pageState", JSON.stringify(newPageState));
    };

    return (
        <div className="topbar">
            <nav className="bg-cus navbar navbar-expand-lg navbar-light">
                <div className="full d-flex flex-row">
                    <button type="button" id="sidebarCollapse" className="sidebar_toggle">
                        <i className="fa fa-bars"></i>
                    </button>
                    <div className="ml-auto dropdown d-flex align-items-center">
                        <div
                            className="d-flex flex-nowrap"
                            id="lang-drop-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <a href="#" className="d-block text-light">
                                {isMobile ? (
                                    <LanguageRender flag={defaultValue.flag} />
                                ) : (
                                    <DropdownLanguageRender name={defaultValue.label} flag={defaultValue.flag} />
                                )}
                            </a>
                            <a className="d-block ml-2" href="#">
                                <i className="fa fa-caret-down"></i>
                            </a>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="#lang-drop-toggle">
                            {options.map((opt) => (
                                <a key={opt.id} href="#" className="dropdown-item cursor-pointer" onClick={(e) => clickHandler(e, opt)}>
                                    <DropdownLanguageRender name={opt.label} flag={opt.flag} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="d-flex flex-nowrap">
                        <div className="icon_info">
                            <ul>
                                {/* <li><a href="#"><i className="fa fa-question-circle"></i></a></li>
                <li><a href="#"><i className="fa fa-bell-o"></i><span className="badge">2</span></a></li> */}
                                <li><a href="#"><i className="fa fa-envelope-o"></i><span className="badge">1</span></a></li>
                                <li>
                                    <a href="#" onClick={changeTheme}>
                                        <i className={pageState ? "fa fa-moon-o" : "fa fa-sun-o"}></i>
                                    </a>
                                </li>


                            </ul>
                            <ul className="user_profile_dd ">
                                <li>
                                    <a className="dropdown-toggle" data-toggle="dropdown">
                                        <img className="img-responsive circle-image" src={proxy + auth.avatar} alt="#" />
                                        <span className="name_user">{generateUserLastName()}</span>
                                    </a>
                                    <div className="dropdown-menu">

                                        <a className="dropdown-item" href="/profile">
                                           <>{lang["my profile"]}</> 
                                        </a>
                                        {/* <a className="dropdown-item" href="settings.html">
                                            {lang["settings"]}
                                        </a>
                                        <a className="dropdown-item" href="help.html">
                                            {lang["help"]}
                                        </a> */}
                                        <a className="dropdown-item" href="#" onClick={signOut}>
                                            {lang["signout"]}
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};
