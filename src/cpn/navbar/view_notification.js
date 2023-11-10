
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns'
import Swal from 'sweetalert2';
import XLSX from 'xlsx-js-style'
import { formatDate } from '../../redux/configs/format-date';
export default () => {
    const { lang, proxy, auth, functions, socket } = useSelector(state => state);
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser)


    let langItemCheck = localStorage.getItem("lang");
    if (langItemCheck) {
        langItemCheck = langItemCheck.toLowerCase();
    } else {
        langItemCheck = "vi";
    }
    
// console.log(langItemCheck)
    const _token = localStorage.getItem("_token");
    const dispatch = useDispatch()
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const [data, setData] = useState([]);
    // console.log(data)
    useEffect(() => {
        fetch(`${proxy}/notify/notifies`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {
                    const sortedData = data.sort((a, b) => {
                        const dateA = new Date(a.notify_at);
                        const dateB = new Date(b.notify_at);
                      
                        return dateB - dateA;
                      });
                    setData(sortedData)

                }
            })
    }, [])

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
                username: data.targets.map(target => target.username).join(', ')
            }

            // console.log(dataRespon)

            if (data.targets.some(target => target.username === _users.username)) {
                // Cập nhật state nếu người dùng hiện tại có trong danh sách targets
                setData(prevData => [dataRespon, ...prevData]);
            }

        });

        return () => {
            socket.off("/project/notify");
        }
    }, []);


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

                });
        }
        // console.log(notificationToMarkAsRead.url)
        window.location.href = `${notificationToMarkAsRead.url !== undefined ? notificationToMarkAsRead.url : "#" }`
    };


    const formatContent = (imageSrc, content, lang) => {
        const regex = /\[(.*?)\]/g;
        const boldContent = content.replace(regex, "<strong>$1</strong>");
    
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={proxy + imageSrc} alt="Avatar" style={{ width: "40px", borderRadius: "100%", height: "40px", marginRight: "10px" }} />
                <div>
                    <span className="notification-title-view" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: boldContent }} />
                </div>
            </div>
        );
    };


    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    const indexOfLastNotifi = currentPage * rowsPerPage;
    const indexOfFirstNotifi = indexOfLastNotifi - rowsPerPage;
    const currentNotifi = data.slice(indexOfFirstNotifi, indexOfLastNotifi);
    // console.log(currentReport)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["notification"]}</h4>
                            {/* <img className="ml-auto mr-2" width={36} src="/assets/icon/viewmode/data-analytics.png" /> */}
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full ">
                            <div class="full padding_infor_info" style={{ height: "83.8vh" }}>

                                <div className="container-fluid">

                                    <div class="col-md-12">
                                        <div class="table-responsive" style={{ height: "78.6vh" }}>
                                            {
                                                currentNotifi && currentNotifi.length > 0 ? (
                                                    <>
                                                        <table class="table table">
                                                            <thead>
                                                                <tr class="color-tr">
                                                                    <th class="font-weight-bold" style={{ width: "30px" }} scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["notifi content"]}</th>
                                                                    <th class="font-weight-bold" style={{ width: "200px" }} scope="col">{lang["notifi status"]}</th>
                                                                    <th class="font-weight-bold" style={{ width: "180px" }} scope="col">{lang["time"]}</th>

                                                                    {

                                                                        <th class="font-weight-bold align-center" style={{ width: "80px" }}>{lang["log.action"]}</th>
                                                                    }
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentNotifi.map((notifi, index) => (
                                                                    <tr key={index}>
                                                                        <td>{indexOfFirstNotifi + index + 1}</td>
                                                                        <td style={{ maxWidth: "700px" }}>
                                                                            <div class="notification-item-view" style={{
                                                                                width: "100%",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap",
                                                                                border: "none"
                                                                            }}>

                                                                                {formatContent(notifi.image_url, notifi.content[langItemCheck], langItemCheck)}

                                                                            </div>
                                                                        </td>
                                                                        <td style={{ maxWidth: "200px" }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap"
                                                                            }}>
                                                                                {notifi.read ? lang["read"] : lang["unread"]}
                                                                            </div>
                                                                        </td>
                                                                        <td>{formatDate(notifi.notify_at)}</td>

                                                                        <td class="align-center">
                                                                            <a href={notifi.url}>
                                                                                <i class="fa fa-arrow-circle-right size-32" onClick={() => markAsRead(index)} aria-hidden="true" ></i>
                                                                            </a>

                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </>
                                                ) : (
                                                    <div class="d-flex justify-content-center align-items-center w-100 responsive-div">
                                                        {lang["not found notification"]}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>
                                                {lang["show"]} {indexOfFirstNotifi + 1}-{Math.min(indexOfLastNotifi, data.length)} {lang["of"]} {data.length} {lang["results"]}
                                            </p>
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination mb-0">
                                                    {/* Nút đến trang đầu */}
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginate(1)}>
                                                            &#8810;
                                                        </button>
                                                    </li>
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginate(Math.max(1, currentPage - 1))}>
                                                            &laquo;
                                                        </button>
                                                    </li>
                                                    {currentPage > 2 && <li className="page-item"><span className="page-link">...</span></li>}
                                                    {Array(totalPages).fill().map((_, index) => {
                                                        if (
                                                            index + 1 === currentPage ||
                                                            (index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1)
                                                        ) {
                                                            return (
                                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                                                        {index + 1}
                                                                    </button>
                                                                </li>
                                                            );
                                                        }
                                                        return null;  // Đảm bảo trả về null nếu không có gì được hiển thị
                                                    })}
                                                    {currentPage < totalPages - 1 && <li className="page-item"><span className="page-link">...</span></li>}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginate(Math.min(totalPages, currentPage + 1))}>
                                                            &raquo;
                                                        </button>
                                                    </li>
                                                    {/* Nút đến trang cuối */}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginate(totalPages)}>
                                                            &#8811;
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

