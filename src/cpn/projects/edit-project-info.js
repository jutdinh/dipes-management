
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import XLSX from 'xlsx-js-style'
import Swal from 'sweetalert2';
import responseMessages from "../enum/response-code";
import { Tables } from ".";
import { formatDate } from "../../redux/configs/format-date";
export default () => {
    const { lang, proxy, auth, functions, socket } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}
    // console.log(_users)
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/detail/${project_id}`);
    };
    const { showApiResponseMessage } = functions
    const statusProject = [
        StatusEnum.INITIALIZATION,
        StatusEnum.IMPLEMENT,
        StatusEnum.DEPLOY,
        StatusEnum.COMPLETE,
        StatusEnum.PAUSE

    ]
    const [users, setUsers] = useState([]);
    const [project, setProject] = useState({}); //// Update project
    const [errorMessagesedit, setErrorMessagesedit] = useState({});
    const [projectmember, setProjectMember] = useState([]);
    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [showImplementationPopup, setShowImplementationPopup] = useState(false);
    const [showMonitorPopup, setShowMonitorPopup] = useState(false);
    const [manager, setManager] = useState({})
    const [projectTemp, setProjectTemp] = useState({});
    const [memberProjectTemp, setMemberProjectTemp] = useState([]);
    console.log("Member Temp", memberProjectTemp)
    console.log("Member", projectmember)
    console.log(project)
    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log("data Project",resp)
                if (success) {
                    if (data) {
                        setMemberProjectTemp(data.members)
                        setProject(data);
                        setProjectMember(data.members)
                        setManager(data.manager.username)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])

    useEffect(() => {
        fetch(`${proxy}/auth/all/accounts`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // // console.log(resp)
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
    // console.log(project)

    // useEffect(() => {
    //     if(project.project_type === "database") {
    //     project.proxy_server = proxy;
    // }
    // }, [])



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
    // console.log(selectedUsers)
    const userAdd = [...selectedImple, ...selectedUsers]

    const updateProjectMembers = () => {

        const updatedMembers = [
            ...selectedUsers.map(user => ({
                username: user.username,
                fullname: user.fullname,
                avatar: user.avatar,
                permission: user.permission
            })),
            ...selectedImple.map(imple => ({
                username: imple.username,
                fullname: imple.fullname,
                avatar: imple.avatar,
                permission: imple.permission
            }))
        ];

        // Cập nhật project.members
        project.members = updatedMembers;
    }
    const handleAdminCheck = (user, permission) => {
        const userWithRole = { username: user.username, permission };
        setTempSelectedUsers(prevTempSelectedUsers => {
            if (prevTempSelectedUsers.some(u => u.username === user.username)) {
                return prevTempSelectedUsers.filter(u => u.username !== user.username);
            } else {
                return [...prevTempSelectedUsers, userWithRole];
            }
        });
    };

    const handleImpleCheck = (user, permission) => {
        const userWithRole = { username: user.username, permission };
        setTempSelectedImple(prevTempSelectedImple => {
            if (prevTempSelectedImple.some(u => u.username === user.username)) {
                return prevTempSelectedImple.filter(u => u.username !== user.username);
            } else {
                return [...prevTempSelectedImple, userWithRole];
            }
        });

    };


    const combinedArray = selectedUsers.concat(selectedUsers, selectedImple, selectedMonitor);
    const uniqueArray = Array.from(new Set(combinedArray.map(user => user.username)))
        .map(username => {
            return combinedArray.find(user => user.username === username);
        });
    console.log(uniqueArray)
    console.log(combinedArray)




    //    Function ktra trạng thái user (Thêm, xóa, thay đổi quyền)

    function findDifferences(memberProjectTemp, userAdd) {
        // Tạo bản đồ từ cả hai mảng dựa trên 'username' và coi 'role' và 'permission' như là một
        const mapTemp = new Map(memberProjectTemp.map(item => [item.username, item.permission || item.role]));
        const mapUnique = new Map(userAdd.map(item => [item.username, item.permission || item.role]));

        // Tìm những người dùng bị xóa hoặc thêm vào dựa trên 'username'
        const removedUsers = memberProjectTemp.filter(item => !mapUnique.has(item.username));
        const addedUsers = userAdd.filter(item => !mapTemp.has(item.username));

        // Tìm những người dùng có sự thay đổi về quyền hạn
        const changedPermissions = userAdd.filter(item =>
            mapTemp.has(item.username) && mapTemp.get(item.username) !== (item.permission || item.role)
        );

        let status;
        let changedUsers;
        if (removedUsers.length > 0) {
            status = 'users removed';
            changedUsers = removedUsers;
        } else if (addedUsers.length > 0) {
            status = 'users added';
            changedUsers = addedUsers;
        } else if (changedPermissions.length > 0) {
            status = 'permissions changed';
            changedUsers = changedPermissions;
        } else {
            status = 'no change';
            changedUsers = [];
        }

        return { status, changedUsers };
    }

    // Sử dụng hàm findDifferences để xác định người dùng đã bị xóa, được thêm vào, hoặc có sự thay đổi quyền hạn
    const result = findDifferences(memberProjectTemp, userAdd);

    // Xuất kết quả
      console.log(result.status); // 'users removed', 'users added', 'permissions changed', hoặc 'no change'
    console.log(result.changedUsers); // Danh sách người dùng bị xóa, được thêm vào, hoặc có sự thay đổi quyền hạn




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

    // console.log(manager)
    const dataManager = users.find(user => user.username === manager);

    // console.log(dataManager)
    updateProjectMembers();
    const submitUpdateProject = async (e) => {
        e.preventDefault();

        if (project.project_type === "database") {
            project.proxy_server = proxy;
        }
        const dataManager = users.find(user => user.username === manager);

        const { project_name, project_status } = project;
        const errors = {};
        if (!project_name) {
            errors.project_name = lang["error.project_name"];
        }
        if (!project_status) {
            errors.project_status = lang["error.project_status"];
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesedit(errors);
            return;
        }

        let dataSocket;
        let tagetUser;
        if (result.status === "users added") {
            dataSocket = {
                targets: result.changedUsers,
                actor: {
                    fullname: _users.fullname,
                    username: _users.username,
                    avatar: _users.avatar
                },
                context: 'project/add-member',
                note: {
                    project_name: project.project_name,
                    project_id: project_id
                }
            }
        } else if (result.status === "users removed") {
            dataSocket = {
                targets: result.changedUsers,
                actor: {
                    fullname: _users.fullname,
                    username: _users.username,
                    avatar: _users.avatar
                },
                context: 'project/remove-member',
                note: {
                    project_name: project.project_name,
                    project_id: project_id
                }
            }
        } else if (result.status === "permissions changed") {
            dataSocket = {
                targets: result.changedUsers,
                actor: {
                    fullname: _users.fullname,
                    username: _users.username,
                    avatar: _users.avatar
                },
                context: 'project/change-privilege',
                note: {
                    project_name: project.project_name,
                    project_id: project_id
                }
            }
        }

        //RequestBody
        let requestBody
        requestBody = {
            project: {
                ...project,
                project_status: parseInt(project.project_status),
                manager: {
                    username: dataManager.username,
                    fullname: dataManager.fullname,
                    avatar: dataManager.avatar
                }
            }

        }
        // if (result.status === "permissions changed") {
        //     requestBody = {
        //         projetct_id: project.project_id,
        //         username: result.changedUsers.username,
        //         permission: result?.changedUsers.permission
        //     }
        // } else {
        //     requestBody = {
        //         project: {
        //             ...project,
        //             project_status: parseInt(project.project_status),
        //             manager: {
        //                 username: dataManager.username,
        //                 fullname: dataManager.fullname,
        //                 avatar: dataManager.avatar
        //             }
        //         }

        //     }

        // }
        console.log(requestBody)
        let API_URL
       
            API_URL = "/projects/update"
        
        const response = await fetch(`${proxy}${API_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        });

        const resp = await response.json();
        const { success, content, data, status } = resp;
        // console.log(resp)

        if (success) {
            showApiResponseMessage(status);

        } else {
            showApiResponseMessage(status);
        }

        // call addMember after submitUpdateProject has completed
        // if change members then call the api
        if (!areTwoArraysEqual(userAdd, projectmember)) {
            addMember(e, dataSocket);
        }
    };
    console.log(selectedUsers)
    console.log(selectedImple)
  
    const addMember = (e, dataSocket) => {
        e.preventDefault();
        const requestBody = {
            project_id: project_id,
            usernames: userAdd
        }
        console.log(requestBody)
        fetch(`${proxy}/projects/members`, {
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
                if (success)
             
                    socket.emit("project/notify", dataSocket)
                // if (success) {
                //     showApiResponseMessage(status);
                // }
            })
    };

    useEffect(() => {
        let pm = projectmember.filter(member => member.permission === 'supervisor');
        let pd = projectmember.filter(member => member.permission === 'deployer');

        setSelectedUsers(pm);
        setSelectedImple(pd);

    }, [projectmember]);
    const areTwoArraysEqual = (arr1, arr2) => {
        let valid = true
        if (arr1 && arr2 && arr1.length == arr2.length) {

            for (let i = 0; i < arr1.length; i++) {
                if (arr2.indexOf(arr1[i]) == -1) {
                    valid = false
                }
            }
        } else {
            valid = false
        }
        return valid
    }

    // console.log(users)
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            {/* <h4>{lang["project_detail.title"]}</h4> */}
                            <h4><label>{lang["project_detail.title"]}
                            </label> </h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>

                                        {lang["project.info"]} </label>
                                        <i class="fa fa-chevron-right mr-2 ml-2" aria-hidden="true"></i>
                                        {lang["updateproject"]}
                                    </h5>
                                </div>
                                {/* <div class="ml-auto" onClick={downloadAPI}>
                                    <i class="fa fa-download icon-ui"></i>
                                </div> */}
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">


                                    <div class="form-group col-lg-6">
                                        <label>{lang["projectname"]} <span className='red_star'>*</span></label>
                                        <input type="text" class="form-control" value={project.project_name} onChange={
                                            (e) => { setProject({ ...project, project_name: e.target.value }) }
                                        } placeholder={lang["p.projectname"]} />
                                        {errorMessagesedit.project_name && <span class="error-message">{errorMessagesedit.project_name}</span>}
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label>{lang["projectcode"]} </label>
                                        <input type="text" class="form-control" value={project.project_code} onChange={
                                            (e) => { setProject({ ...project, project_code: e.target.value }) }
                                        } placeholder={lang["p.projectcode"]} />
                                    </div>
                                    <div class="form-group col-lg-6 col-sm-4 ">
                                        <label>{lang["projectstatus"]} <span className='red_star'>*</span></label>
                                        <select className="form-control" value={project.project_status} onChange={(e) => { setProject({ ...project, project_status: e.target.value }) }}>
                                            {statusProject.map((status, index) => {
                                                return (
                                                    <option key={index} value={status.value}>{lang[`${status.label}`]}</option>
                                                );
                                            })}
                                        </select>
                                        {errorMessagesedit.project_status && <span class="error-message">{errorMessagesedit.project_status}</span>}
                                    </div>

                                    <div class="form-group col-lg-6  col-sm-4 ">
                                        <label>{lang["projecttype"]}</label>
                                        <select className="form-control" value={project.project_type} onChange={(e) => { setProject({ ...project, project_type: e.target.value }) }}>
                                            <option value="database">Database</option>
                                            <option value="api">API</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-6  col-sm-4">
                                        <label htmlFor="sel1">{lang["projectrole"]} <span className="red_star">*</span></label>
                                        <select className="form-control" value={manager || project.manager?.username}
                                            onChange={(e) => { setManager(e.target.value) }}>
                                            <option value="">{lang["p.projectrole"]}</option>
                                            {users && users.map((user, index) => {
                                                return (
                                                    <option key={index} value={user.username}>{user.fullname}</option>
                                                );
                                            })}
                                        </select>

                                    </div>
                                    {
                                        project.project_type == "api" ?
                                            <div class="form-group col-lg-6  col-sm-4 ml-auto">
                                                <label>{lang["projectproxyserver"]}</label>
                                                <input type="text" class="form-control" value={project.proxy_server} onChange={
                                                    (e) => { setProject({ ...project, proxy_server: e.target.value }) }
                                                } placeholder="http://example.com || http://127.0.0.1" />
                                            </div>
                                            : null
                                    }

                                    <div class="form-group col-lg-12 ">
                                        <label>{lang["projectdescripton"]} </label>
                                        <textarea rows="6" type="text" class="form-control" value={project.project_description} onChange={
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
                                            <div class="user-popup-title">
                                                <h5>{lang["supervisor"]}</h5>
                                            </div>
                                            <div class="user-popup-content">
                                                {users && users.map(user => {
                                                    // if (user.username !== manager && !selectedImple.some(u => u.username === user.username)) {
                                                    if (user.username !== manager) {
                                                        return (
                                                            <div key={user.username} className="user-item">
                                                                <label className="pointer">
                                                                    <input
                                                                        className="user-checkbox"
                                                                        type="checkbox"
                                                                        checked={tempSelectedUsers.some(u => u.username === user.username)}
                                                                        onChange={() => handleAdminCheck(user, 'supervisor')}
                                                                    />
                                                                    <span className="user-name">
                                                                        <img width={20} className="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />
                                                                        {user.username}-{user.fullname}
                                                                    </span>
                                                                </label>
                                                            </div>

                                                        )
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <div className="user-popup-actions">
                                                <button class="btn btn-success" onClick={handleSaveUsers}>{lang["btn.update"]}</button>
                                                <button class="btn btn-danger" onClick={handleClosePopup}>{lang["btn.close"]}</button>
                                            </div>
                                        </div>
                                    )}
                                    {showImplementationPopup && (
                                        <div class="user-popup2">
                                            <div class="user-popup-title">
                                                <h5>{lang["deployers"]}</h5>
                                            </div>
                                            <div class="user-popup-content">
                                                {users && users.map(user => {
                                                    // if (user.username !== manager && !selectedUsers.some(u => u.username === user.username)) {
                                                    if (user.username !== manager) {
                                                        return (
                                                            <div key={user.username} class="user-item">
                                                                <label class="pointer">
                                                                    <input
                                                                        class="user-checkbox"
                                                                        type="checkbox"
                                                                        checked={tempSelectedImple.some(u => u.username === user.username)}
                                                                        onChange={() => handleImpleCheck(user, 'deployer')}
                                                                    />
                                                                    <span class="user-name">


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
                                <div className="mt-2 d-flex justify-content-end ml-auto">
                                    <button type="button" onClick={submitUpdateProject} class="btn btn-success mr-2">{lang["btn.update"]}</button>
                                    <button type="button" onClick={() => navigate(-1)} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

