
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
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
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
    const [manager, setManager] = useState("")



    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log(resp)
                if (success) {
                    if (data) {

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
    console.log(project)
    
    

    
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
  console.log(selectedUsers)
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
    console.log('Before:', project.members);
updateProjectMembers();
console.log('After:', project.members);
    
    const submitUpdateProject = async (e) => {
        e.preventDefault();
        

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
        const response = await fetch(`${proxy}/projects/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify({ project: { ...project, project_status: parseInt(project.project_status) } }),
        });

        const resp = await response.json();
        const { success, content, data, status } = resp;
        console.log(resp)

        // if (success) {
        //     showApiResponseMessage(status);
        // } else {
        //     showApiResponseMessage(status);
        // }

        // call addMember after submitUpdateProject has completed
        // if change members then call the api
        if (!areTwoArraysEqual(uniqueArray, projectmember)) {
            // console.log("UPDATED")
            addMember(e);
        }
    };
    const addMember = (e) => {
        e.preventDefault();

        fetch(`${proxy}/projects/members`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify({
                project_id: project_id,
                usernames: uniqueArray,
            }),
        })
            .then((res) => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
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
                                        <textarea rows="7" type="text" class="form-control" value={project.project_description} onChange={
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
                                                                   <span class="user-name" onClick={() => handleImpleCheck(user, 'deployer')}>


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

