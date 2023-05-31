import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const dispatch = useDispatch()
    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [showImplementationPopup, setShowImplementationPopup] = useState(false);
    const [showMonitorPopup, setShowMonitorPopup] = useState(false);
    const [manager, setManager] = useState("")

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
    console.log(combinedArray)


    console.log("admin", selectedUsers)
    console.log("imple", selectedImple)
    console.log("monitor", selectedMonitor)

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
        { id: 0, label: "Khởi tạo", value: "1", color: "#82ca9d" },
        { id: 1, label: "Thực hiện", value: "2", color: "#8884d8" },
        { id: 2, label: "Triển khai", value: "3", color: "#ffc658" },
        { id: 3, label: "Hoàn thành", value: "4", color: "#ff8042" },
        { id: 4, label: "Tạm dừng", value: "5", color: "#FF0000" }
    ]


    const [showModal, setShowModal] = useState(false);
    const _token = localStorage.getItem("_token");
    // const stringifiedUser = localStorage.getItem("user");
    // const users = JSON.parse(stringifiedUser)
    const [project, setProject] = useState({});
    const [projects, setProjects] = useState([]);

    useEffect(() => {


        fetch(`${proxy}/projects/all/projects`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log(resp)
                if (success) {
                    if (data != undefined && data.length > 0) {
                        setProjects(data);
                        dispatch({
                            branch: "default",
                            type: "setProjects",
                            payload: {
                                projects: data
                            }
                        })
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
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
                    window.location = "/404-not-found"
                }
            })
    }, [])

    const submit = (e) => {
        e.preventDefault();

        const body = {
            project,
            manager: { username: manager },
        };

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
                if (success) {
                    // Xử lý fetch thứ hai ở đây nếu có người dùng được chọn
                    if (selectedUsers.length > 0) {
                        const projectId = data.project_id;
                        return fetch(`${proxy}/projects/members`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${_token}`,
                            },
                            body: JSON.stringify({
                                project_id: projectId,
                                usernames: combinedArray,
                            }),
                        });
                    } else {
                        // Không có người dùng nào được chọn, hiển thị thông báo thành công
                        Swal.fire({
                            title: "Thành công!",
                            text: content,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(function () {
                            setShowModal(false);
                        });
                    }
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: "error.message",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    throw new Error(content);
                }
            })
            .then(res => res && res.json())
            .then((resp) => {
                if (resp) {
                    const { success, content, data, status } = resp;
                    if (success) {
                        Swal.fire({
                            title: "Thành công!",
                            text: content,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(function () {
                            setShowModal(false);
                        });
                    } else {
                        throw new Error(content);
                    }
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: "Thất bại!",
                    text: error.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    console.log(selectedUsers)
    const handleDeleteUser = (project) => {

        const requestBody = {
            project: {
                project_id: project.project_id
            }
        };
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa người dùng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'rgb(209, 72, 81)',
        }).then((result) => {
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
                        if (status === "0x52404") {
                            Swal.fire({
                                title: "Cảnh báo!",
                                text: content,
                                icon: "warning",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                            return;
                        }
                        if (success) {
                            Swal.fire({
                                title: "Thành công!",
                                text: content,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: "Thất bại!",
                                text: content,
                                icon: "error",
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(function () {
                                // Không cần reload trang
                            });
                        }
                    });
            }
        });
        // console.log(requestBody)
    }

    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["projects.title"]}</h4>
                            {
                                ["ad"].indexOf(auth.role) != -1 ?
                                    <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addProject">
                                        <i class="fa fa-plus"></i>
                                    </button> : null
                            }
                        </div>
                    </div>
                </div>
                {/* <div class="container py-5">
                    <div class="py-5">
                        <div class="row">
                            <div class="col-lg-6 mb-5">
                                <button class="btn btn-primary" type="button" data-target="#quoteForm" data-toggle="modal">Request a quote</button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal fade" id="quoteForm" tabindex="-1" role="dialog" aria-labelledby="quoteForm" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content p-md-3">
                            <div class="modal-header">
                                <h4 class="modal-title">Request a <span class="text-primary">quote</span></h4>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div class="modal-body">
                                <form action="#">
                                    <div class="row">
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="firstname">First name<span class="text-primary ml-1">*</span></label>
                                            <input type="text" class="form-control" value={project.project_name} onChange={
                                                (e) => { setProject({ ...project, project_name: e.target.value }) }
                                            } placeholder="Nhập tên dự án" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="lastname">Last name<span class="text-primary ml-1">*</span></label>
                                            <input class="form-control" id="lastname" type="text" placeholder="Enter your last name" required="" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label class="font-weight-bold text-small" for="email">Email address<span class="text-primary ml-1">*</span></label>
                                            <input class="form-control" id="email" type="email" placeholder="Enter your email address" required="" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="phone">Phone number <small class="small text-gray">optional</small></label>
                                            <input class="form-control" id="phone" type="tel" placeholder="Enter your phone number" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="projecttype">Project type<span class="text-primary ml-1">*</span></label>
                                            <input class="form-control" id="projecttype" type="text" placeholder="Enter your project type" required="" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="budget">Estimated budget<span class="text-primary ml-1">*</span></label>
                                            <input class="form-control" id="budget" type="text" placeholder="Enter your estimated budget" required="" /><small class="form-text text-muted">Project budget will be on <span class="text-dark">$</span></small>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold text-small" for="timeframe">Time frame<span class="text-primary ml-1">*</span></label>
                                            <input class="form-control" id="timeframe" type="text" placeholder="Maximum time for the project" required="" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label class="font-weight-bold text-small" for="projectdetail">Project details<span class="text-primary ml-1">*</span></label>
                                            <textarea class="form-control" id="projectdetail" rows="5" placeholder="Provide a short brief about your project" required=""></textarea>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <button class="btn btn-primary" type="button">Submit your request</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* Modal add project */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addProject">
                    <div class="modal-dialog modal-dialog-left container">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm mới dự án</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-6">
                                            <label>Tên dự án <span className='red_start'>*</span></label>
                                            <input type="text" class="form-control" value={project.project_name} onChange={
                                                (e) => { setProject({ ...project, project_name: e.target.value }) }
                                            } placeholder="Nhập tên dự án" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Mã dự án <span className='red_start'>*</span></label>
                                            <input type="text" class="form-control" value={project.project_code} onChange={
                                                (e) => { setProject({ ...project, project_code: e.target.value }) }
                                            } placeholder="Nhập mã dự án" />
                                        </div>
                                        <div class="form-group col-lg-6 ">
                                            <label>Trạng thái <span className='red_start'>*</span></label>

                                            <select className="form-control" value={project.project_status} onChange={(e) => { setProject({ ...project, project_status: e.target.value }) }}>
                                                <option value="">Chọn trạng thái</option>
                                                {status.map((status, index) => {

                                                    return (
                                                        <option key={index} value={status.value}>{status.label}</option>
                                                    );

                                                })}
                                            </select>

                                        </div>
                                        <div className="form-group col-lg-6">
                                            <label htmlFor="sel1">Chọn người quản lý dự án <span className="red_star">*</span></label>
                                            <select className="form-control" value={users.username} onChange={(e) => { setManager(e.target.value) }}>
                                                <option value="">Chọn người quản lý</option>
                                                {users && users.map((user, index) => {
                                                    if (user.role === "ad") {
                                                        return (
                                                            <option key={index} value={user.username}>{user.username}-{user.fullname}-{user.role}</option>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </select>
                                        </div>
                                        <div class="form-group ">
                                            <label>Mô tả <span className='red_start'>*</span></label>
                                            <textarea type="text" class="form-control" value={project.project_descripstion} onChange={
                                                (e) => { setProject({ ...project, project_descripstion: e.target.value }) }
                                            } placeholder="Nhập mô tả" />
                                        </div>


                                        <div className="form-group">
                                            <div class="options-container">
                                                <div class="option">
                                                    <h5>Phụ trách dự án</h5>
                                                    {selectedUsers.map(user => (
                                                        <div> <p>{user.username} - Phụ trách</p>
                                                        </div>
                                                    ))}
                                                    <button type="button" class="btn btn-primary add-option" onClick={handleOpenAdminPopup}>+</button>
                                                </div>
                                                <div class="option">

                                                    <h5>Triển Khai</h5>
                                                    {selectedImple.map(imple => (
                                                        <div> <p>{imple.username} - Triển khai</p>
                                                        </div>
                                                    ))}
                                                    <button type="button" class="btn btn-primary add-option" onClick={handleOpenImplementationPopup}>+</button>
                                                </div>
                                                <div class="option">
                                                    <h5>Theo Dõi</h5>
                                                    {selectedMonitor.map(monitor => (
                                                        <div> <p>{monitor.username} - Theo dõi</p>
                                                        </div>
                                                    ))}
                                                    <button type="button" class="btn btn-primary add-option" onClick={handleOpenMonitorPopup}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                        {showAdminPopup && (
                                            <div class="user-popup">
                                                <div class="user-popup-content">
                                                    {users && users.map(user => {
                                                        if (user.username !== manager && !selectedImple.some(u => u.username === user.username) && !selectedMonitor.some(u => u.username === user.username)) {
                                                            return (
                                                                <div key={user.username} class="user-item">

                                                                    <input
                                                                        class="user-checkbox"
                                                                        type="checkbox"
                                                                        checked={tempSelectedUsers.some(u => u.username === user.username)}
                                                                        onChange={() => handleAdminCheck(user, 'pm')}
                                                                    />
                                                                    <span class="user-name" onClick={() => handleAdminCheck(user, 'pm')}>
                                                                        <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}
                                                                    </span>
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
                                                        if (user.username !== manager && !selectedUsers.some(u => u.username === user.username) && !selectedMonitor.some(u => u.username === user.username)) {
                                                            return (
                                                                <div key={user.username} class="user-item">
                                                                    <input
                                                                        class="user-checkbox"
                                                                        type="checkbox"
                                                                        checked={tempSelectedImple.some(u => u.username === user.username)}
                                                                        onChange={() => handleImpleCheck(user, 'pd')}
                                                                    />
                                                                    <span class="user-name" onClick={() => handleAdminCheck(user, 'pd')}>
                                                                        <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                                <div className="user-popup-actions">
                                                    <button class="btn btn-success" onClick={handleSaveImple}>Lưu</button>
                                                    <button class="btn btn-danger" onClick={handleClosePopup}>Đóng</button>
                                                </div>
                                            </div>
                                        )}
                                        {showMonitorPopup && (
                                            <div class="user-popup3">
                                                <div class="user-popup-content">
                                                    {users && users.map(user => {
                                                        if (user.username !== manager && !selectedUsers.some(u => u.username === user.username) && !selectedImple.some(u => u.username === user.username)) {
                                                            return (
                                                                <div key={user.username} class="user-item">
                                                                    <input
                                                                        class="user-checkbox"
                                                                        type="checkbox"
                                                                        checked={tempSelectedMonitor.some(u => u.username === user.username)}
                                                                        onChange={() => handleMonitorCheck(user, 'ps')}
                                                                    />
                                                                    <span class="user-name" onClick={() => handleAdminCheck(user, 'ps')}>
                                                                        <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                                <div className="user-popup-actions">
                                                    <button class="btn btn-success" onClick={handleSaveMonitor}>Lưu</button>
                                                    <button class="btn btn-danger" onClick={handleClosePopup}>Đóng</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submit} class="btn btn-success ">Thêm mới</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">Đóng</button>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            {/* <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h4>{lang["project list"]}</h4>
                                </div>
                            </div> */}
                            <div class="full price_table padding_infor_info">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            {projects.map((item) => (
                                                <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
                                                    <div class="card project-block">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col">
                                                                    <h4 class="project-name d-flex align-items-center">{item.project_name}</h4>
                                                                </div>
                                                                <div class="col-auto cross-hide pointer scaled-hover">
                                                                    <img width={20} className="scaled-hover-target" src="/images/icon/cross-color.png" onClick={() => handleDeleteUser(item)}></img>

                                                                </div>
                                                            </div>
                                                            <p class="card-title">Mã dự án: {item.project_code}</p>
                                                            <p><i class="fa fa-clock-o "></i>: {item.create_at}</p>
                                                            <p class="card-text">{item.project_descripstion}</p>
                                                            <p class="font-weight-bold">Quản lý dự án: {item.create_by.fullname}</p>
                                                            <div class="profile_contacts">
                                                                <img class="img-responsive circle-image" src={proxy + item.create_by.avatar} alt="#" />
                                                            </div>
                                                            <p class="font-weight-bold">Thành viên</p>

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
                                                                            <p>Dự án này chưa có thành viên </p>
                                                                        </div>
                                                                }
                                                                {
                                                                    item.members.length > 2 &&
                                                                    <div className="extra-images">
                                                                        +{item.members.length - 2}
                                                                    </div>
                                                                }
                                                            </div>

                                                            <span
                                                                class="status-label"
                                                                style={{
                                                                    backgroundColor: (status.find((s) => s.value === item.project_status) || {}).color
                                                                }}
                                                            >
                                                                {(status.find((s) => s.value === item.project_status) || {}).label || 'Trạng thái không xác định'}
                                                            </span>


                                                            <span class="skill" style={{ width: '250px' }}><span class="info_valume">85%</span></span>
                                                            <div class="progress skill-bar ">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: 225 }}>
                                                                </div>
                                                            </div>
                                                            <div class="bottom_list">
                                                                <div class="right_button">
                                                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myEditmodal">
                                                                        <i class="fa fa-edit"></i> Xem chi tiết
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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