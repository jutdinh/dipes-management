import { useSelector } from "react-redux";
import { Dropdown } from "../common";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import $ from 'jquery';
import { useLocation } from 'react-router-dom';
import da from "date-fns/esm/locale/da/index.js";

export default () => {
    const { proxy, lang, auth, profiles, socket } = useSelector((state) => state);
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [defaultValue, setDefaultValue] = useState({});
    const fullname = localStorage.getItem("fullname");
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}

    let langItemCheck = localStorage.getItem("lang");
    if (langItemCheck) {
        langItemCheck = langItemCheck.toLowerCase();
    } else {
        langItemCheck = "vi";
    }

    const langs = [
        { id: 0, label: lang["vi"], flag: "vietnam.png", value: "Vi" },
        { id: 1, label: lang["en"], flag: "united-kingdom.png", value: "En" },
    ];
    const [data, setData] = useState([]);
    const options = langs;

    useEffect(() => {
        let langItem = localStorage.getItem("lang");
        langItem = langItem ? langItem : "Vi";
        const defaultLang = langs.filter((l) => l.value === langItem)[0];
        setDefaultValue(defaultLang);
    }, []);
    // console.log(langItemCheck)

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
            $('head').append(`                
                <link id="second-style-sheet" rel="stylesheet" href="/css/color_2.css" />
            `);
            $("#primary-style-sheet").remove()

        } else {
            $('#second-style-sheet').remove();
            $('head').append(`                
                <link id="primary-style-sheet" rel="stylesheet" href="/css/colors.css" />
            `);
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
                <span className="d-block ml-2 topbar_lang_light">{name}</span>
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
            $('head').append(`                
                <link id="second-style-sheet" rel="stylesheet" href="/css/color_2.css" />
            `);
            $("#primary-style-sheet").remove()

        } else {
            $('#second-style-sheet').remove();
            $('head').append(`                
                <link id="primary-style-sheet" rel="stylesheet" href="/css/colors.css" />
            `);
        }

        setPageState(newPageState);

        localStorage.setItem("pageState", JSON.stringify(newPageState));
    };



    useEffect(() => {

        socket.on('project/notify', (data) => {
            // console.log(data)

            const dataRespon =
            {
                image_url: data.actor.avatar,
                url: data.url,
                content: data.content,
                read: false,
                notify_at: new Date().toISOString(),
                username: data?.targets?.map(target => target.username).join(', ')
            }

            // console.log(dataRespon)
            if (data.targets.some(target => target.username === _users.username)) {
                const requestBody = {
                    lang: langItemCheck,
                    notify: data.content
                }
                fetch(`${proxy}/notify/translate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${_token}`,
                    },
                    body: JSON.stringify(requestBody),

                })

                    .then((res) => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        console.log(resp)
                        dataRespon.content = data;
               
                        setData(prevData => [dataRespon, ...prevData]);
                    })
                    .catch((error) => {
                       
                    });
          
               
            }

        });

        return () => {
            socket.off("/project/notify");
        }
    }, []);

    useEffect(() => {
        fetch(`${proxy}/notify/notifies`, {
            headers: {
                Authorization: _token,
                lang: langItemCheck
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(a.notify_at);
                    const dateB = new Date(b.notify_at);

                    return dateB - dateA;
                });
                if (success) {
                    setData(sortedData)
                }
            })
    }, [])

    // console.log(data)
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef();

    const handleBellClick = (event) => {
        // Prevent event from propagating to other elements
        event.stopPropagation();

        // Toggle popup visibility
        setShowPopup(prevShowPopup => !prevShowPopup);
    };

    useEffect(() => {
        // Function to be called when the user clicks outside
        // const handleClickOutside = (event) => {
        //     if (popupRef.current && !popupRef.current.contains(event.target)) {
        //         setShowPopup(prevShowPopup => !prevShowPopup);
        //     }
        // };

        // Add event listener when the popup is shown
        if (showPopup) {
            document.addEventListener('click', handleBellClick);
        }

        // Cleanup the event listener when the component is unmounted or before the component updates
        return () => {
            document.removeEventListener('click', handleBellClick);
        };
    }, [showPopup]); // Depend on showPopup to add/remove the event listener

    // Make sure to stop propagation on the popup's click event as well to prevent handleClickOutside from being triggered
    const handlePopupClick = (event) => {
        event.stopPropagation();
    };

    const countUnreadNotifications = (notifications) => {
        let unreadCount = 0;

        for (const notification of notifications) {
            if (!notification.read) {
                unreadCount++;
            }
        }

        return unreadCount;
    };
    const unreadCount = countUnreadNotifications(data);



    const [currentTimestamp, setCurrentTimestamp] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            // Cập nhật thời gian hiện tại mỗi 60 giây
            setCurrentTimestamp(new Date());
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const getElapsedTime = (notifyAt) => {
        const notifyTimestamp = new Date(notifyAt);
        const elapsedMilliseconds = currentTimestamp - notifyTimestamp;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const elapsedDays = Math.floor(elapsedHours / 24);
        const elapsedMonths = Math.floor(elapsedDays / 30);
        const elapsedYears = Math.floor(elapsedMonths / 12);

        if (elapsedYears > 0) {
            return `${elapsedYears} ${lang["years ago"]}`;
        } else if (elapsedMonths > 0) {
            return `${elapsedMonths} ${lang["months ago"]}`;
        } else if (elapsedDays > 0) {
            return `${elapsedDays} ${lang["days ago"]}`;
        } else if (elapsedHours > 0) {
            return `${elapsedHours} ${lang["hours ago"]}`;
        } else if (elapsedMinutes > 0) {
            return `${elapsedMinutes} ${lang["mins ago"]}`;
        } else if (elapsedMilliseconds > 0) {
            return `${elapsedSeconds} ${lang["secs ago"]}`;
        } else {
            return lang["just now"];
        }
    };
    const markAsRead = (index) => {
        const notificationToMarkAsRead = data[index];
        if (!notificationToMarkAsRead.read) {
            const newNotifications = [...data];
            newNotifications[index].read = true;
            setData(newNotifications);

            // Gửi yêu cầu PUT để đánh dấu thông báo là đã đọc bằng API
            fetch(`${proxy}/notify/seen/state`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${_token}`,
                },
                body: JSON.stringify({ notify_id: notificationToMarkAsRead.notify_id }),
            })
                .then((res) => res.json())
                .then((resp) => {
                    const { success, content, data, status } = resp;
                    // console.log(resp);
                })
                .catch((error) => {
                    // console.error("Lỗi khi gửi yêu cầu PUT:", error);
                });
        }

        window.location.href = `${notificationToMarkAsRead.url !== undefined ? notificationToMarkAsRead.url : "#"}`
    };

    const formatContent = (imageSrc, content, lang) => {
        const regex = /\[(.*?)\]/g;
        const boldContent = content.replace(regex, "<strong>$1</strong>");
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={proxy + imageSrc} alt="Avatar" style={{ width: "40px", marginTop: "10px", borderRadius: "100%", height: "40px", marginRight: "10px" }} />
                <span className="notification-title pointer" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: boldContent }} />
            </div>
        );
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
                                {/* <li><a href="#"><i className="fa fa-question-circle"></i></a></li> */}
                                <li><a href="#"><i className="fa fa-bell-o" onClick={handleBellClick}></i><span className="badge">{unreadCount < 10 ? unreadCount : "9+"}</span></a></li>
                                {/* <li><a href="#"><i className="fa fa-envelope-o"></i><span className="badge">1</span></a></li> */}
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
                    {showPopup && (
                        <div ref={popupRef} class="notification-popup" onClick={handlePopupClick}>
                            <div class="notification-header algin-center">
                                {lang["notification"]}
                                {/* <button class="clear-btn">CLEAR ALL</button> */}
                            </div>
                            <ul class="notification-list mt-1">
                                {data && data.length > 0 ?
                                    data.map((notification, index) => (
                                        <li
                                            key={notification.id}
                                            className={`notification-item pointer ${!notification.read ? "unread" : ""}`}
                                            onClick={() => markAsRead(index)}
                                        >
                                            {/* <span className="notification-title">{langItemCheck === "Vi" ? notification.content.vi : notification.content.en}</span> */}
                                            <p>
                                                {formatContent(notification.image_url, notification.content, langItemCheck)}</p>
                                            <div class=" d-flex">

                                                <span className="notification-time">{getElapsedTime(notification.notify_at)}</span>
                                                {/* <span className="ml-auto notification-more pointer">More</span> */}
                                            </div>
                                        </li>
                                    )) :
                                    <li className={`notification-item align-center`}>
                                        <span className="notification-title">{lang["not notification"]}</span>
                                    </li>
                                }
                            </ul>
                            {data && data.length > 0 ? (
                                <div class={`notification-footer ${data && data.length > 0 ? `` : `opacity-footer`}`}>
                                    <a href="/notifications">{lang["view all notificaton"]}</a>
                                </div>) : null}
                        </div>
                    )}
                </div>
            </nav>

        </div>
    );
};
