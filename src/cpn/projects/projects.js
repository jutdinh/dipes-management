import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import responseMessages from "../enum/response-code";
import Swal from 'sweetalert2';
import { Header } from '../common';
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../enum/status';
import $ from 'jquery';
import { formatDate } from '../../redux/configs/format-date';
export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const storedProjects = useSelector(state => state.projects)
    // console.log(storedProjects)
    const dispatch = useDispatch()

    const [errors, setErrors] = useState({});

    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [showImplementationPopup, setShowImplementationPopup] = useState(false);
    const [showMonitorPopup, setShowMonitorPopup] = useState(false);
    const [manager, setManager] = useState("")
    const [selectedProject, setSelectedProject] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const stringifiedUser = localStorage.getItem("user");


    const [regent, setRegent] = useState(false)

    const _users = JSON.parse(stringifiedUser)
    // const showApiResponseMessage = (status) => {
    //     const message = responseMessages[status];

    //     const title = message?.type || "Unknown error";
    //     const description = message?.description || "Unknown error";
    //     const icon = message?.type === "Informations" ? "success" : "error";
    //     Swal.fire({
    //         title,
    //         text: description,
    //         icon,
    //         showConfirmButton: false,
    //         timer: 1500,
    //     }).then(() => {
    //         if (icon === "success") {
    //             window.location.reload();
    //             setShowModal(false);
    //         }
    //     });
    // };  
    // const showApiResponseMessage = (status) => {
    //     const langItem = (localStorage.getItem("lang") || "Vi").toLowerCase(); // fallback to English if no language is set
    //     const message = responseMessages[status];

    //     const title = message?.[langItem]?.type || "Unknown error";
    //     const description = message?.[langItem]?.description || "Unknown error";
    //     const icon = (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") ? "success" : "error";

    //     Swal.fire({
    //         title,
    //         text: description,
    //         icon,
    //         showConfirmButton: false,
    //         timer: 1500,
    //     }).then(() => {
    //         if (icon === "success") {
    //             window.location.reload();
    //         }
    //     });
    // };


    const showNoPrivilegeAlarm = () => {

        Swal.fire({
            title: lang["alarm.alarm"],
            text: lang["alarm.message"],
            icon: "warning",
            showConfirmButton: true,

        })
    }

    const handleOpenAdminPopup = () => {
        setShowAdminPopup(true);
        setShowImplementationPopup(false);
        setShowMonitorPopup(false);
        setTempSelectedUsers([...selectedUsers]);
    };
    const handleOpenImplementationPopup = () => {
        setShowAdminPopup(false);
        setShowImplementationPopup(true);
        setShowMonitorPopup(false);
        setTempSelectedImple([...selectedImple]);

    };
    const handleOpenMonitorPopup = () => {
        setShowAdminPopup(false);
        setShowImplementationPopup(false);
        setShowMonitorPopup(true);
        setTempSelectedMonitor([...selectedMonitor]);
    };
    const handleClosePopup = () => {
        setShowAdminPopup(false);
        setShowImplementationPopup(false);
        setShowMonitorPopup(false);

    };

    const [selectedUsers, setSelectedUsers] = useState([]); // admin
    const [selectedImple, setSelectedImple] = useState([]);
    const [selectedMonitor, setSelectedMonitor] = useState([]);

    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
    const [tempSelectedImple, setTempSelectedImple] = useState([]);
    const [tempSelectedMonitor, setTempSelectedMonitor] = useState([]);

    const handleAdminCheck = (user, role) => {
        const userWithRole = { username: user.username, role };
        setTempSelectedUsers(prevTempSelectedUsers => {
            if (prevTempSelectedUsers.some(u => u.username === user.username)) {
                return prevTempSelectedUsers.filter(u => u.username !== user.username);
            } else {
                return [...prevTempSelectedUsers, userWithRole];
            }
        });
    };

    const handleImpleCheck = (user, role) => {
        const userWithRole = { username: user.username, role };
        setTempSelectedImple(prevTempSelectedUsers => {
            if (prevTempSelectedUsers.some(u => u.username === user.username)) {
                return prevTempSelectedUsers.filter(u => u.username !== user.username);
            } else {
                return [...prevTempSelectedUsers, userWithRole];
            }
        });
    };

    const handleMonitorCheck = (user, role) => {
        const userWithRole = { username: user.username, role };
        setTempSelectedMonitor(prevTempSelectedUsers => {
            if (prevTempSelectedUsers.some(u => u.username === user.username)) {
                return prevTempSelectedUsers.filter(u => u.username !== user.username);
            } else {
                return [...prevTempSelectedUsers, userWithRole];
            }
        });
    };
    const combinedArray = selectedUsers.concat(selectedUsers, selectedImple, selectedMonitor);
    const uniqueArray = Array.from(new Set(combinedArray.map(user => user.username)))
        .map(username => {
            return combinedArray.find(user => user.username === username);
        });

    const handleSaveUsers = () => {
        setSelectedUsers(tempSelectedUsers);
        setTempSelectedUsers([]);
        setShowAdminPopup(false);
    };

    const handleSaveImple = () => {
        setSelectedImple(tempSelectedImple);
        setTempSelectedImple([]);
        setShowImplementationPopup(false);
    };

    const handleSaveMonitor = () => {
        setSelectedMonitor(tempSelectedMonitor);
        setTempSelectedMonitor([]);
        setShowMonitorPopup(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const sortOptions = [
        { id: 0, label: "Mới nhất", value: "latest" },
        { id: 1, label: "Cũ nhất", value: "oldest" },
    ]
    const status = [
        { id: 0, label: lang["initialization"], value: 1, color: "#1ed085" },
        { id: 1, label: lang["implement"], value: 2, color: "#8884d8" },
        { id: 2, label: lang["deploy"], value: 3, color: "#ffc658" },
        { id: 3, label: lang["complete"], value: 4, color: "#ff8042" },
        { id: 4, label: lang["pause"], value: 5, color: "#FF0000" }
    ]

    const statusProject = [
        StatusEnum.INITIALIZATION,
        StatusEnum.IMPLEMENT,
        StatusEnum.DEPLOY,
        StatusEnum.COMPLETE,
        StatusEnum.PAUSE

    ]

    const [showModal, setShowModal] = useState(false);
    const _token = localStorage.getItem("_token");
    // const stringifiedUser = localStorage.getItem("user");
    // const users = JSON.parse(stringifiedUser)
    const [project, setProject] = useState({ project_type: "database" });
    const [projects, setProjects] = useState(storedProjects);
    // const [projects, setProjects] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (projects.length == 0 || projects.length == undefined) {
            fetch(`${proxy}/projects/all/projects`, {
                headers: {
                    Authorization: _token
                }
            })
                .then(res => res.json())
                .then(resp => {
                    const { success, data, status, content } = resp;
                    // console.log(resp)
                    if (success) {
                        if (data !== undefined && data !== null && data.length > 0) {
                            setProjects(data);
                            dispatch({
                                branch: "default",
                                type: "setProjects",
                                payload: {
                                    projects: data
                                }
                            })
                        }
                        setLoaded(true)
                    } else {
                        window.location = "/404-not-found"
                    }

                })
        } else {
            setLoaded(true)
        }

    }, [])

    useEffect(() => {
        if (projects.length > 0 && !regent) {
            fetch(`${proxy}/projects/full/all/projects`, {
                headers: {
                    Authorization: _token
                }
            })
                .then(res => res.json())
                .then(resp => {
                    const { success, data, status, content } = resp;
                    // console.log(resp)
                    if (success) {
                        if (data != undefined && data.length > 0) {
                            setProjects(data);
                            setRegent(true)
                            dispatch({
                                branch: "default",
                                type: "setProjects",
                                payload: {
                                    projects: data
                                }
                            })
                        }
                        setLoaded(true)
                    } else {
                        window.location = "/404-not-found"
                    }

                })
        }
    }, [projects])

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/auth/all/accounts`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {
                    if (data != undefined && data.length > 0) {
                        setUsers(data);
                        // console.log(data)
                    }
                } else {
                    window.location = "/login"
                }
            })
    }, [])
    const validateAddProject = () => {
        let temp = {};

        temp.project_name = project.project_name ? "" : lang["error.input"];
        temp.project_status = project.project_status ? "" : lang["error.input"];
        temp.manager = manager ? "" : lang["error.input"];


        setErrors({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const submit = (e) => {
        e.preventDefault();
        if (validateAddProject()) {
            if (project.project_type === "database") {
                project.proxy_server = proxy;
            }
            const body = {
                project,
                manager: { username: manager },
            };

            const status = body.project.project_status;
            body.project.project_status = parseInt(status)

            fetch(`${proxy}/projects/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${_token}`,
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((resp) => {
                    const { success, content, data, status } = resp;
                    functions.showApiResponseMessage(status);
                    if (success) {


                        const projectId = data.project_id;
                        return fetch(`${proxy}/projects/members`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${_token}`,
                            },
                            body: JSON.stringify({
                                project_id: projectId,
                                usernames: uniqueArray,
                            }),
                        });

                    }
                    // else {
                    //     Swal.fire({
                    //         title: "Thất bại!",
                    //         text: "error.message",
                    //         icon: "error",
                    //         showConfirmButton: false,
                    //         timer: 2000,
                    //     });
                    //     throw new Error(content);
                    // }
                })
                .then(res => res && res.json())
                .then((resp) => {
                    if (resp) {
                        const { success, content, data, status } = resp;



                    }
                })
        }



    };
    const handleDeleteUser = (project) => {

        const requestBody = {
            project: {
                project_id: project.project_id
            }
        };
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.project"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`${proxy}/projects/delete`, {
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                            Authorization: `${_token}`,
                        },
                        body: JSON.stringify(requestBody)
                    })
                        .then(res => res.json())
                        .then((resp) => {
                            const { success, content, data, status } = resp;
                            functions.showApiResponseMessage(status);
                        });
                }
            });
        // console.log(requestBody)
    }
    const detailProject = (project) => {
        setSelectedProject(project);
        // console.log(project)
        window.location.href = `projects/detail/${project.project_id}`;
    };
    // useEffect(() => {
    //     const url = new URL(window.location.href);
    //     // Get the search params from the URL
    //     const searchParams = new URLSearchParams(url.search);
    //     // Access individual parameters
    //     const action = searchParams.get('action');
    //     switch (action) {
    //         case "create":

    //             $('#create-btn').click()
    //             break;
    //         case "export":

    //             $('#create-btn-export').click()
    //             break;
    //         default:
    //             break;
    //     }
    // }, [projects])
    // console.log(projects)
    const sortedProjects = projects?.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
    const [searchName, setSearchName] = useState('');
    const [searchCode, setSearchCode] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState(null);


    const filteredProjects = sortedProjects.filter(project =>
        (project.project_name ? project.project_name.toLowerCase() : "").includes(searchName.toLowerCase()) &&
        (project.project_code ? project.project_code.toLowerCase() : "").includes(searchCode.toLowerCase()) &&
        (searchDate ? new Date(project.create_at).toDateString() === new Date(searchDate).toDateString() : true) &&
        (!searchStatus || project.project_status === searchStatus)
    );



    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);


    const indexOfLastProject = currentPage * rowsPerPage;
    const indexOfFirstProject = indexOfLastProject - rowsPerPage;

    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => {
        if (pageNumber < 1) return;
        if (pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchCode, searchDate, searchStatus]);
    const clearSearch = () => {
        setSearchName('')
        setSearchCode('')
        setSearchDate('')
        setSearchStatus(null)
    }


    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center ">
                            <h4>{lang["projects.title"]}</h4>

                            {
                                ["ad", "uad"].indexOf(auth.role) != -1 ?
                                    <button type="button" id="create-btn" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addProject">
                                        <i class="fa fa-plus"></i>
                                    </button> :
                                    <button type="button" class="btn btn-danger custom-buttonwarn ml-auto" data-toggle="modal" onClick={showNoPrivilegeAlarm}>
                                        <i class="fa fa-info font-weight-bold" ></i>
                                    </button>

                            }

                        </div>
                    </div>
                </div>
                {/* Modal add project */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addProject">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["addproject"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-6">
                                            <label>{lang["projectname"]} <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={project.project_name} onChange={
                                                (e) => { setProject({ ...project, project_name: e.target.value }) }
                                            } placeholder={lang["p.projectname"]} />
                                            {errors.project_name && <p className="text-danger mb-0">{errors.project_name}</p>}
                                        </div>

                                        <div class="form-group col-lg-6">
                                            <label>{lang["projectcode"]} </label>
                                            <input type="text" class="form-control" value={project.project_code} onChange={
                                                (e) => { setProject({ ...project, project_code: e.target.value }) }
                                            } placeholder={lang["p.projectcode"]} />
                                        </div>

                                        <div class="form-group col-lg-6 ">
                                            <label>{lang["projectstatus"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={project.project_status} onChange={(e) => { setProject({ ...project, project_status: e.target.value }) }}>
                                                <option value="">{lang["p.projectstatus"]}</option>
                                                {status.map((status, index) => {
                                                    return (
                                                        <option key={index} value={status.value}>{status.label}</option>
                                                    );
                                                })}
                                            </select>
                                            {errors.project_status && <p className="text-danger mb-0">{errors.project_status}</p>}
                                        </div>

                                        <div class="form-group col-lg-6 ">
                                            <label>{lang["projecttype"]}</label>
                                            <select className="form-control" value={project.project_type} onChange={(e) => { setProject({ ...project, project_type: e.target.value }) }}>
                                                <option value="database">Database</option>
                                                <option value="api">API</option>
                                            </select>
                                        </div>
                                        {
                                            project.project_type == "api" ?
                                                <div class="form-group col-lg-6 ml-auto">
                                                    <label>{lang["projectproxyserver"]}</label>
                                                    <input type="text" class="form-control" value={project.proxy_server} onChange={
                                                        (e) => { setProject({ ...project, proxy_server: e.target.value }) }
                                                    } placeholder="http://example.com || http://127.0.0.1" />
                                                </div>
                                                : null
                                        }
                                        <div className="form-group col-lg-12">
                                            <label htmlFor="sel1">{lang["projectrole"]} <span className="red_star">*</span></label>
                                            <select className="form-control" value={users.username} onChange={(e) => { setManager(e.target.value) }}>
                                                <option value="">{lang["p.projectrole"]}</option>
                                                {users && users.map((user, index) => {
                                                    // if (user.role === "pm") {
                                                    //     return (
                                                    //         <option key={index} value={user.username}>{user.fullname}</option>
                                                    //     );
                                                    // } else {
                                                    //     return null;
                                                    // }
                                                    return (
                                                        <option key={index} value={user.username}>{user.fullname}</option>
                                                    );
                                                })}
                                            </select>
                                            {errors.manager && <p className="text-danger mb-0">{errors.manager}</p>}
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["projectdescripton"]}</label>
                                            <textarea maxlength="500" rows="5" type="text" class="form-control" value={project.project_description} onChange={
                                                (e) => { setProject({ ...project, project_description: e.target.value }) }
                                            } placeholder={lang["p.projectdescripton"]} />
                                        </div>

                                        <div className="form-group col-lg-12">
                                            <label>{lang["projectmember"]}</label>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div class="option">

                                                        <div className="option-header">
                                                            <h5>{lang["supervisor"]}</h5>

                                                            <i class="fa fa-plus-square size-32 icon-add pointer  mb-10 " onClick={handleOpenAdminPopup} aria-hidden="true"></i>
                                                        </div>
                                                        <div class="div-to-scroll">
                                                            {selectedUsers.length > 0 ? (
                                                                selectedUsers.map((user, index) => {
                                                                    if (user.username === manager) {
                                                                        return null;
                                                                    }
                                                                    const userData = users.find(u => u.username === user.username);
                                                                    return (
                                                                        <div key={user.username}>
                                                                            <p>{userData ? userData.fullname : 'User not found'}</p>
                                                                        </div>
                                                                    )
                                                                })

                                                            ) :
                                                                <div className="no-data-message">
                                                                    {lang["not found user"]}
                                                                </div>

                                                            }
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className="col-md-6">
                                                    <div class="option">

                                                        <div className="option-header">
                                                            <h5>{lang["deployers"]}</h5>

                                                            <i class="fa fa-plus-square size-32 icon-add pointer mb-10 " onClick={handleOpenImplementationPopup} aria-hidden="true"></i>
                                                        </div>

                                                        <div class="div-to-scroll">
                                                            {selectedImple.length > 0 ? (
                                                                selectedImple.map((user, index) => {
                                                                    if (user.username === manager) {
                                                                        return null;
                                                                    }
                                                                    const userData = users.find(u => u.username === user.username);
                                                                    return (
                                                                        <div key={user.username}>
                                                                            <p>{userData ? userData.fullname : 'User not found'}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            ) :
                                                                <div className="no-data-message">
                                                                    {lang["not found user"]}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        {showAdminPopup && (
                                            <div class="user-popup4">
                                                <div class="user-popup-content">
                                                    {users && users.map(user => {
                                                        if (user.username !== manager && !selectedImple.some(u => u.username === user.username)) {
                                                            return (
                                                                <div key={user.username} class="user-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            class="user-checkbox"
                                                                            type="checkbox"
                                                                            checked={tempSelectedUsers.some(u => u.username === user.username)}
                                                                            onChange={() => handleAdminCheck(user, 'supervisor')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'supervisor')}>

                                                                            <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}

                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            )
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                                <div className="user-popup-actions">
                                                    <button class="btn btn-success" onClick={handleSaveUsers}>Lưu</button>
                                                    <button class="btn btn-danger" onClick={handleClosePopup}>Đóng</button>
                                                </div>
                                            </div>
                                        )}
                                        {showImplementationPopup && (
                                            <div class="user-popup2">
                                                <div class="user-popup-content">
                                                    {users && users.map(user => {
                                                        if (user.username !== manager && !selectedUsers.some(u => u.username === user.username)) {
                                                            return (
                                                                <div key={user.username} class="user-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            class="user-checkbox"
                                                                            type="checkbox"
                                                                            checked={tempSelectedImple.some(u => u.username === user.username)}
                                                                            onChange={() => handleImpleCheck(user, 'deployer')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'deployer')}>

                                                                            <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}


                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            )
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                                <div className="user-popup-actions">
                                                    <button class="btn btn-success" onClick={handleSaveImple}>{lang["btn.update"]}</button>
                                                    <button class="btn btn-danger" onClick={handleClosePopup}>{lang["btn.close"]}</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submit} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row column1_project ">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head_project">
                                <div class="heading1_project margin_0">
                                    <div class="row">
                                        <div class="col-md-3 mb-1 mt-1">
                                            <select
                                                class="form-control pointer"
                                                value={searchStatus}
                                                onChange={(e) => setSearchStatus(Number(e.target.value))}
                                            >
                                                <option value="">{lang["all.status"]}</option>

                                                {statusProject.map((status, index) => {
                                                    return (
                                                        <option key={index} value={status.value}>{lang[`${status.label}`]}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div class="col-md-3 mb-1 mt-1">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder={lang["search.name"]}
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-md-3 mb-1 mt-1">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder={lang["search.code"]}
                                                value={searchCode}
                                                onChange={(e) => setSearchCode(e.target.value)}
                                            />
                                        </div>
                                        <div class="col-md-2 mb-1 mt-1">
                                            <input
                                                type="date"
                                                class="form-control pointer"
                                                placeholder={lang["search.code"]}
                                                value={searchDate}
                                                onChange={(e) => setSearchDate(e.target.value)}
                                            />
                                        </div>


                                        <div class="col-md-1 mt-2">
                                            <i class="fa fa-refresh pointer size-24" onClick={clearSearch} aria-hidden="true" title={lang["reload"]}></i>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div class="full price_table padding_infor_info">
                                <div class="row ">

                                    <div class="col-lg-12">
                                        <div class="row ">
                                            {
                                                loaded ? (
                                                    <>
                                                        {
                                                            currentProjects && currentProjects.length > 0 ? (
                                                                currentProjects.map((item) => (
                                                                    (item.members.find(member => member.username === _users.username)
                                                                        || item.manager.username === _users.username
                                                                        || ["ad", "uad"].indexOf(auth.role) !== -1)
                                                                    && (
                                                                        <div class="col-lg-3 col-md-6 col-sm-6 mb-1">
                                                                            <div class="card">
                                                                                <div class="card-body">
                                                                                    <div class="row project-name-min-height">
                                                                                        <div class="col-sm-10" >

                                                                                            <h5 class="project-name d-flex align-items-center" >{item.project_name.slice(0, 50)}{item.project_name.length > 50 ? "..." : ""}</h5>
                                                                                        </div>

                                                                                        <div class="col-sm-2 cross-hide pointer scaled-hover">
                                                                                            <img width={20} className="scaled-hover-target" src="/images/icon/cross-color.png" onClick={() => handleDeleteUser(item)}></img>

                                                                                        </div>
                                                                                    </div>
                                                                                    <p class="card-title font-weight-bold">{lang["projectcode"]}: {item.project_code?.slice(0, 24)}{item.project_code?.length > 24 ? "..." : ""}</p>
                                                                                    <p class="card-text">{lang["createby"]}: {item.create_by.fullname}</p>

                                                                                    <p>{lang["time"]}: {
                                                                                        lang["time"] === "Time" ?
                                                                                            formatDate(item.create_at.replace("lúc", "at")) :
                                                                                            formatDate(item.create_at)
                                                                                    }</p>
                                                                                    {/* <p class="card-text">{lang["description"]}: {item.project_description}</p> */}
                                                                                    <p class="font-weight-bold">{lang["projectmanager"]}</p>
                                                                                    <div class="profile_contacts">

                                                                                        <img class="img-responsive circle-image" src={proxy + item.manager.avatar} alt="#" />
                                                                                        {item.manager?.fullname}
                                                                                    </div>
                                                                                    <p class="font-weight-bold">{lang["projectmember"]}</p>

                                                                                    <div class="profile_contacts">
                                                                                        {
                                                                                            item.members && item.members.length > 0 ?
                                                                                                item.members.slice(0, 2).map(member => (
                                                                                                    <img
                                                                                                        class="img-responsive circle-image"
                                                                                                        src={proxy + member.avatar}
                                                                                                        alt={member.username}
                                                                                                    />

                                                                                                )) : <div class="profile_contacts">
                                                                                                    <p>{lang["projectempty"]} </p>
                                                                                                </div>
                                                                                        }
                                                                                    
                                                                                        {/* {
                                                                    item.members.length > 2 &&
                                                                    <div className="img-responsive circle-image extra-images">
                                                                        +{item.members.length - 2}
                                                                    </div>
                                                                } */
                                                                                        }
                                                                                        {
                                                                                            item.members.length > 2 &&
                                                                                            <div class="border-custom">
                                                                                                <div className="img-responsive circle-image-project" style={{ backgroundImage: `url(${proxy + item.members[2].avatar})` }}>
                                                                                                    <span> +{item.members.length - 2}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        }

                                                                                    </div>
                                                                                    <div className="d-flex position-relative">
                                                                                        <div>
                                                                                            <span className="d-block status-label" style={{
                                                                                                backgroundColor: (status.find((s) => s.value === item.project_status) || {}).color
                                                                                            }}>
                                                                                                {(status.find((s) => s.value === item.project_status) || {}).label || 'Trạng thái không xác định'}
                                                                                            </span>

                                                                                        </div>
                                                                                        <span class="skill position-absolute" style={{ right: "0", top: "0" }}>{item.progress}%</span>
                                                                                    </div>
                                                                                    <div class="progress skill-bar mt-3">
                                                                                        <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow={item.progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${item.progress}%` }}>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* <span class="skill" style={{ width: `${item.progress}%` }}><span class="info_valume">{item.progress}%</span></span> */}
                                                                                    <div class="bottom_list">
                                                                                        <div class="right_button">
                                                                                            <button type="button" class="btn btn-primary" onClick={() => detailProject(item)}>
                                                                                                <i class="fa fa-edit"></i> {lang["buttondetail"]}
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                ))
                                                            ) :
                                                                <div class="d-flex justify-content-center align-items-center w-100 responsive-div">
                                                                    {lang["projects.noprojectfound"]}
                                                                </div>
                                                        }
                                                    </>
                                                ) : (
                                                    <div class="d-flex justify-content-center align-items-center w-100 responsive-div" >
                                                        {/* {lang["projects.noprojectfound"]} */}
                                                        <img width={350} className="scaled-hover-target" src="/images/icon/loading.gif" ></img>
                                                    </div>
                                                )
                                            }

                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-1">
                                            <p>
                                                {lang["show"]} {filteredProjects.length > 0 ? indexOfFirstProject + 1 : 0}-{Math.min(indexOfLastProject, filteredProjects.length)} {lang["of"]} {filteredProjects.length} {lang["results"]}
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
            </div >
        </div >
    )
}