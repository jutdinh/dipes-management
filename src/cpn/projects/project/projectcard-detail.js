
import { useParams } from "react-router-dom";
import Header from "../../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../../enum/status';
import { saveAs } from 'file-saver';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import responseMessages from "../../enum/response-code";
import { formatDate } from "../../../redux/configs/format-date";


export default () => {
    const { lang, proxy, auth, functions, socket } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}

    const { showApiResponseMessage } = functions
    const [errorMessagesedit, setErrorMessagesedit] = useState({});
    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [showImplementationPopup, setShowImplementationPopup] = useState(false);
    const [showMonitorPopup, setShowMonitorPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [manager, setManager] = useState("")
    const [selectedMemberTask, setSelectedMemberTask] = useState([]);
    const [showFull, setShowFull] = useState(false);
    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects`);
    };
    const [showViewMore, setShowViewMore] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [exporter, setExporter] = useState({})
    const [activate, setActivate] = useState({})

    // // ////console.log(selectedMemberTask)
    // Page 

    const sortOptions = [
        { id: 0, label: "Mới nhất", value: "latest" },
        { id: 1, label: "Cũ nhất", value: "oldest" },
    ]
    // page


    const statusProject = [
        StatusEnum.INITIALIZATION,
        StatusEnum.IMPLEMENT,
        StatusEnum.DEPLOY,
        StatusEnum.COMPLETE,
        StatusEnum.PAUSE

    ]
    const statusTaskView = [
        StatusTask.INITIALIZATION,
        StatusTask.IMPLEMENT,
        StatusTask.COMPLETE,
        StatusTask.PAUSE
    ]

    const RolesMember = [
        Roles.SUPERVISOR,
        Roles.NORMAL

    ]
    // const status = [
    //     { id: 0, label: lang["initialization"], value: 1, color: "#1ed085" },
    //     { id: 1, label: lang["implement"], value: 2, color: "#8884d8" },
    //     { id: 2, label: lang["complete"], value: 3, color: "#ff8042" },
    //     { id: 3, label: lang["pause"], value: 4, color: "#FF0000" }
    // ]
    const statusTask = [
        { id: 0, label: lang["await"], value: 0, color: "#1ed085" },
        { id: 1, label: lang["approved"], value: 1, color: "#181dd4" },


    ]
    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]

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
    // // ////console.log("a", combinedArray)
    // // ////console.log("admin", selectedUsers)
    // // ////console.log("imple", selectedImple)
    // // ////console.log("monitor", selectedMonitor)

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

    const { project_id } = useParams();

    useEffect(() => {

        localStorage.setItem('project_id', project_id);

    }, [project_id]);
    const [projectdetail, setProjectDetail] = useState([]); //// Detail project
    //console.log(projectdetail)
    const parser = new DOMParser();
    const doc = parser.parseFromString(projectdetail.project_description, 'text/html');
    const text = doc.body.textContent || "";


    const [project, setProject] = useState({}); //// Update project
    const [projectmember, setProjectMember] = useState([]);
    const [versions, setProjectVersion] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectmanager, setProjectManager] = useState({});
    // ////console.log(projectdetail)
    const [process, setProcess] = useState({});
    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                if (success) {
                    if (data) {
                        setProjectDetail(data);
                        setProject(data);
                        setProjectVersion(data.versions)
                        setProjectMember(data.members)
                        setProjectManager(data.manager)
                        setProcess(data)
                        setManager(data.manager.username)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])


    const [tables, setTables] = useState({});

    useEffect(() => {

        fetch(`${proxy}/db/tables/v/${versions[0]?.version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {
                        setTables(data);
                        // ////console.log(data)
                    }
                } else {
                    // ////console.log("data")
                    // window.location = "/404-not-found"
                }
            })

    }, [versions]);

    const [apis, setApis] = useState([]);

    useEffect(() => {

        fetch(`${proxy}/apis/v/${versions[0]?.version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                if (success) {
                    if (data) {
                        setApis(data.apis);
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })

    }, [versions]);


    useEffect(() => {
        fetch(`${proxy}/auth/all/accounts`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // // ////console.log(resp)
                if (success) {
                    if (data != undefined && data.length > 0) {
                        setUsers(data);
                        // ////console.log(data)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ task_status: 1 });
    const [taskDetail, setTaskDetail] = useState([]);
    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}/tasks`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {

                        data.sort((a, b) => {
                            if (a.task_priority == b.task_priority) {
                                const aDate = new Date(a.raw_create_at)
                                const bDate = new Date(b.raw_create_at)
                                return aDate > b.Date ? -1 : 1
                            } else {
                                return a.task_priority > b.task_priority ? 1 : -1
                            }
                        })

                        setTasks(data);
                        // ////console.log("data task", data)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])


    //
    const [uis, setUis] = useState([]);
    useEffect(() => {
        fetch(`${proxy}/uis/v/${versions[0]?.version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {
                        setUis(data.uis);

                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [versions])
    // ////console.log(`${versions[0]?.version_id}`)

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

    const addMember = (e) => {
        e.preventDefault();
        const dataSocket = {
            targets: selectedMemberTask,
            actor: { fullname: _users.username },
            context: 'project/add-member',
            note: {
                project_name: project.project_name,
                project_id: project_id
            }
        }
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
                if (success) {
                    showApiResponseMessage(status);
                    socket.emit("project/notify", dataSocket)
                } else {
                    showApiResponseMessage(status);
                }
            })


    };
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

        if (success) {
            showApiResponseMessage(status);
        } else {
            showApiResponseMessage(status);
        }

        // call addMember after submitUpdateProject has completed
        // if change members then call the api
        if (!areTwoArraysEqual(uniqueArray, projectmember)) {
            // ////console.log("UPDATED")
            addMember(e);
        }
    };

    const submitUpdateManager = async (e) => {
        e.preventDefault();
        const requestBody = {
            project_id: project.project_id,
            username: projectmanager.username,
        };

        const checkUser = projectdetail.members.find(member => member.username === requestBody.username);

        if (checkUser) {
            const result = await Swal.fire({
                title: 'Xác nhận thay đổi',
                text: 'Bạn có muốn chuyển người dùng này từ thành viên sang quản lý dự án?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Thay đổi',
                cancelButtonText: 'Hủy',
                confirmButtonColor: 'rgb(209, 72, 81)',
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        const response = await fetch(`${proxy}/projects/project/manager`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        });

        const { success, content, data, status } = await response.json();


        if (success) {
            showApiResponseMessage(status);
        } else {
            showApiResponseMessage(status);
        }
    };


    const submitAddTask = (e) => {
        e.preventDefault();
        task.members = selectedMemberTask.map(user => user.username);


        fetch(`${proxy}/projects/project/${project_id}/task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify({ task }),
        })
            .then(res => res && res.json())
            .then((resp) => {
                if (resp) {
                    const { success, content, data, status } = resp;
                    if (success) {
                        showApiResponseMessage(status);
                    } else {
                        showApiResponseMessage(status);
                    }
                }
            })
    };
    useEffect(() => {
        let pm = projectmember.filter(member => member.permission === 'supervisor');
        let pd = projectmember.filter(member => member.permission === 'deployer');

        setSelectedUsers(pm);
        setSelectedImple(pd);

    }, [projectmember]);

    const [updateTaskinfo, setUpdateTask] = useState({});

    const getIdTask = (taskid) => {
        setUpdateTask(taskid);
    }

    useEffect(() => {
        // ////console.log(updateTaskinfo);
    }, [updateTaskinfo]);



    const updateTask = (e) => {
        e.preventDefault();
        const requestBody = {
            project_id: project.project_id,
            task_id: updateTaskinfo.task_id,
            task_name: updateTaskinfo.task_name,
            task_description: updateTaskinfo.task_description,
            task_priority: updateTaskinfo.task_priority,
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/tasks/task/info`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                if (success) {
                    showApiResponseMessage(status);
                } else {
                    showApiResponseMessage(status);
                }
            })


    };
    // Sort 
    let projectManagerMembers = projectdetail.members ? projectdetail.members.filter(member => member.permission === 'supervisor') : [];
    let projectImpli = projectdetail.members ? projectdetail.members.filter(member => member.permission === 'deployer') : [];

    let sortedMembers = [...projectManagerMembers, ...projectImpli];

    const [isLoading, setIsLoading] = useState(false);

    const detailTask = async (taskid) => {

        setIsLoading(true);


        const taskDetail = tasks.find(task => task.task_id === taskid.task_id);
        if (taskDetail) {
            // Nếu tìm thấy task, cập nhật state taskDetail
            setTaskDetail(taskDetail);
            setIsLoading(false);
        } else {
            // Nếu không tìm thấy task, bạn có thể hiển thị thông báo lỗi hoặc xử lý theo cách khác
            // console.error(`Cannot find task with id ${taskid}`);
        }

    };
    // ////console.log(taskDetail)
    const [deleteTask, setDelelteTask] = useState(false);

    const handleConfirmTask = (taskid) => {
        const newTaskApproveStatus = !taskid.task_approve;
        const requestBody = {
            project_id: project.project_id,
            task_id: taskid.task_id,
            task_approve: newTaskApproveStatus
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/tasks/task/approve`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                if (success) {
                    showApiResponseMessage(status);
                } else {
                    showApiResponseMessage(status);
                }
            });


    }
    const handleDeleteTask = (taskid) => {
        const requestBody = {

            project_id: project.project_id,
            task_id: taskid.task_id

        };
        // ////console.log(requestBody)

        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.task"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/tasks/task`, {
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
                        showApiResponseMessage(status);
                    });
            }
        });
    }
    const handleDeleteUser = (member) => {
        ////console.log(member)
        const requestBody = {
            project_id: project.project_id,
            username: member.username,
            permission: member.permission
        };
        const dataSocket = {
            targets: [{ username: member.username }],
            actor: {
                fullname: _users.fullname,
                username: _users.username,
                avatar: _users.avatar
            },
            context: 'project/remove-member',
            note: {
                project_name: project.project_name,
                project_id: project.project_id

            }
        }
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.member"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/projects/remove/project/member`, {
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
                            socket.emit("project/notify", dataSocket)
                            showApiResponseMessage(status);
                        } else {
                            showApiResponseMessage(status);
                        }
                    });
            }
        });
    }
    const [uniqueUsers, setUniqueUsers] = useState([]);
    useEffect(() => {
        let combined = [...users, ...projectmember];
        const duplicateUsers = users.filter(user =>
            projectmember.some(projectUser => projectUser.username === user.username)
        );
        setUniqueUsers(duplicateUsers);
    }, [users, projectmember]);


    const getStatusLabel = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? status.label : 'N/A';
    };

    const getStatusColor = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? status.color : 'N/A';
    };
    //task

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const indexOfLastMember = currentPage * rowsPerPage;
    const indexOfFirstMember = indexOfLastMember - rowsPerPage;
    const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(sortedMembers.length / rowsPerPage);

    // Page member task
    const [currentPageTask, setCurrentPageTask] = useState(1);
    const rowsPerPageTask = 7;

    const indexOfLastMemberTask = currentPageTask * rowsPerPageTask;
    const indexOfFirstMemberTask = indexOfLastMemberTask - rowsPerPageTask;
    const currentMembersTask = tasks.slice(indexOfFirstMemberTask, indexOfLastMemberTask);

    const paginateTask = (pageNumber) => setCurrentPageTask(pageNumber);
    const totalPagesTask = Math.ceil(tasks.length / rowsPerPageTask);

    // Page detail task
    const [currentViewDetailTask, setCurrentViewDetailTask] = useState(1);
    const rowsPerViewDetailTask = 5;

    const indexOfLastMemberViewDetailTask = currentViewDetailTask * rowsPerViewDetailTask;
    const indexOfFirstMemberViewDetailTask = indexOfLastMemberViewDetailTask - rowsPerViewDetailTask;
    const currentMembersViewDetailTask = taskDetail.history?.slice(indexOfFirstMemberViewDetailTask, indexOfLastMemberViewDetailTask);

    const paginateViewDetailTask = (pageNumber) => setCurrentViewDetailTask(pageNumber);
    const totalViewDetailTask = Math.ceil(taskDetail.history?.length / rowsPerViewDetailTask);
    // ////console.log("manger", projectdetail.manager)
    // ////console.log("members", currentMembers)
    useEffect(() => {
        if (projectdetail.project_description?.length > 100) {
            setShowViewMore(true);
        } else {
            setShowViewMore(false);
        }
    }, [projectdetail.project_description]);
    const editProject = () => {
        window.location.href = `/projects/detail/${project_id}/edit`;
    };
    const tablesManager = (project) => {

        window.location.href = `/projects/${versions[0]?.version_id}/tables`;

        // window.location.href = `tables`;
    };
    const apisManager = (project) => {

        window.location.href = `/projects/${project_id}/${versions[0]?.version_id}/apis`;

        // window.location.href = `tables`;
    };
    const uisManager = (project) => {

        window.location.href = `/projects/${versions[0]?.version_id}/uis`;

        // window.location.href = `tables`;
    };
    const handleSelectChangeMember = async (e) => {
        const role = e.target.value
        const username = e.target.dataset.username;

        // ////console.log(role);
        // ////console.log(username)
        updateRoleMember({ username: username, role: role });
    }

    const updateRoleMember = (member) => {
        let newRole = '';
        if (member.role === 'supervisor') {
            newRole = 'supervisor';
        } else if (member.role === 'deployer') {
            newRole = 'deployer';
        }
        // ////console.log(member)
        const requestBody = {
            project_id: project.project_id,
            username: member.username,
            permission: newRole
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/projects/project/member/privilege`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;

                showApiResponseMessage(status);

            });
    }

    const handleSelectChange = async (e) => {
        const newTaskStatus = parseInt(e.target.value, 10);
        const taskId = e.target.options[e.target.selectedIndex].dataset.taskid;
        // ////console.log(taskId);
        updateStatusTask({ task_id: taskId, newTaskStatus: newTaskStatus });
    }

    const updateStatusTask = (taskInfo) => {
        const requestBody = {
            project_id: project.project_id,
            task_id: taskInfo.task_id,
            task_status: taskInfo.newTaskStatus
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/tasks/task/status`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                if (success) {
                    showApiResponseMessage(status);
                } else {
                    showApiResponseMessage(status);
                }
            });
    }

    const closeModalManually = () => {
        $("#exportOptions").removeAttr("style")
        $(".modal-backdrop").remove()
        $('#exportClickTrigger').click()
    }

    const exportTrigger = () => {
        closeModalManually()
        setShowModal(false)
        const { version, type } = exporter
        if (version != undefined && type != undefined) {
            const option = exportTypes.find(opt => opt.id == type)
            const { func } = option;
            func();
        } else {
            Swal.fire({
                title: lang["error.title"],
                icon: "error",
                showConfirmButton: true,
                text: lang["export.error.invalidData"],
            }).then(function () {
                // Không cần reload trang
            });
        }
    }

    const exportWholeProject = () => {
        const { version } = exporter;
        fetch(`${proxy}/versions/d/${version}/write-ui`, {
            method: "GET",
            headers: {
                Authorization: `${_token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                const { data, success, content } = res;
                if (success) {
                    window.open(`${proxy}/versions/d/${version}/whole`)
                } else {
                    Swal.fire({
                        title: lang["error.title"],
                        icon: "error",
                        showConfirmButton: true,
                        text: lang["export.error.invalidVersionData"],
                    })
                }
            })
    }

    const exportTablesOnly = () => {
        const { version } = exporter;
        const ver = versions.find(v => v.version_id == version)
        fetch(`${proxy}/versions/d/${version}/tables`, {
            method: "GET",
            headers: {
                Authorization: `${_token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                const { data, success, content } = res;
                const { database } = data;

                const jsonData = JSON.stringify({ data: database });
                const blob = new Blob([jsonData], { type: 'application/json' });
                saveAs(blob, `${project.project_name}-${ver.version_name}-database.json`);
            })
    }

    const exportApisOnly = () => {
        const { version } = exporter;
        const ver = versions.find(v => v.version_id == version)
        fetch(`${proxy}/versions/d/${version}/apis`, {
            method: "GET",
            headers: {
                Authorization: `${_token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                const { data, success, content } = res;
                const { apis } = data;

                const jsonData = JSON.stringify({ data: { apis } });
                const blob = new Blob([jsonData], { type: 'application/json' });
                saveAs(blob, `${project.project_name}-${ver.version_name}-apis.json`);
            })
    }

    const exportUIOnly = () => {
        const { version } = exporter;
        const ver = versions.find(v => v.version_id == version)
        fetch(`${proxy}/versions/d/${version}/ui`, {
            method: "GET",
            headers: {
                Authorization: `${_token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                const { data, success, content } = res;
                const { uis } = data;

                const jsonData = JSON.stringify({ data: uis });
                const blob = new Blob([jsonData], { type: 'application/json' });
                saveAs(blob, `${project.project_name}-${ver.version_name}-ui.json`);
            })
    }

    const exportNewUI = () => {
        const { version } = exporter;
        const ver = versions.find(v => v.version_id == version)

        fetch(`${proxy}/uis/${version}/savedui`, {
            method: "GET",
            headers: {
                Authorization: `${_token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                const { pages } = res.data.ui;                

                const jsonData = JSON.stringify({ data: pages });
                const blob = new Blob([jsonData], { type: 'application/json' });
                saveAs(blob, `${project.project_name}-${ver.version_name}-ui.json`);
            })
    }

    const exportTypes = [
        { id: 0, label: lang["export.types.wholeProjects"], func: exportWholeProject },
        { id: 1, label: lang["export.types.tablesOnly"], func: exportTablesOnly },
        { id: 2, label: lang["export.types.apisOnly"], func: exportApisOnly },
        { id: 3, label: lang["export.types.uiOnly"], func: exportUIOnly },
        { id: 4, label: `${lang["export.types.uiOnly"]} 2`, func: exportNewUI },
    ]

    const generateKey = () => {
        fetch(`${proxy}/activation/generate/key`, {
            method: "POST",
            headers: {
                Authorization: `${_token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ ...activate, project_id }),
        }).then(res => res.json()).then(res => {
            const { success, activation_key, status } = res;
            setActivate({ ...activate, activation_key })
            functions.showApiResponseMessage(status, false)
        })
    }

    //page table
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const rowsPerPageTable = 3;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);
    // page api
    const [currentPageApi, setCurrentPageApi] = useState(1);
    const rowsPerPageApi = 3;

    const indexOfLastApi = currentPageApi * rowsPerPageApi;
    const indexOfFirstApi = indexOfLastApi - rowsPerPageApi;
    const currentApi = apis.slice(indexOfFirstApi, indexOfLastApi);

    const paginateApi = (pageNumber) => setCurrentPageApi(pageNumber);
    const totalPagesApi = Math.ceil(apis.length / rowsPerPageApi);
    //page ui
    const [currentPageUi, setCurrentPageUi] = useState(1);
    const rowsPerPageUi = 3;

    const indexOfLastUi = currentPageUi * rowsPerPageUi;
    const indexOfFirstUi = indexOfLastUi - rowsPerPageUi;
    const currentUi = uis.slice(indexOfFirstUi, indexOfLastUi);

    const paginateUi = (pageNumber) => setCurrentPageUi(pageNumber);
    const totalPagesUi = Math.ceil(uis.length / rowsPerPageUi);


    const toTitleCase = (word) => {
        let result = ""
        if (word != undefined) {
            const splitted = word.split(' ')
            result = splitted.map(piece => {
                if (piece != undefined && piece.length > 0) {
                    return piece[0].toUpperCase() + piece.slice(1, piece.length)
                }
                return ""
            }).join(' ')
        }
        return result
    }
    const openDetailTask = () => {
        window.location.href = `/projects/detail/task/${project_id}`;
    };

    const COLORS = [
        StatusStatisticalTask.DONE.color,
        StatusStatisticalTask.NEED.color,
        StatusStatisticalTask.LATE.color,
    ];

    const [statisTask, setStatisTask] = useState([]);
    // ////console.log(statisTask)
    useEffect(() => {

        fetch(`${proxy}/tasks/${project_id}/statistic`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content, statistic } = resp;
                // ////console.log(resp)
                if (success) {

                    const data = Object.entries(statistic).map(([key, { percentage, amount }]) => {
                        let name;
                        switch (key) {
                            case 'completed':
                                name = lang["task.complete"];
                                break;
                            case 'inProgress':
                                name = lang["task.inprogress"];
                                break;
                            case 'expired':
                                name = lang["task.expired"];
                                break;
                            default:
                                name = '';
                        }
                        return { name, value: percentage, total: amount };
                    });
                    setStatisTask(data)

                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    const totalOfAllTasks = statisTask.reduce((total, task) => total + task.total, 0);



    // ////console.log(statisTask)

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent === 0) {
            return;
        }
        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    // Tìm member trong sortedMembers có username trùng với _users.username
    let memberCheck = {}

    memberCheck = sortedMembers?.find(member => member.username === _users.username);

    // useEffect(() => {
    //     if (!memberCheck || memberCheck === undefined) {
    //         Swal.fire({
    //             title: lang["confirm"],
    //             text: lang["delete.task"],
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: lang["btn.delete"],
    //             cancelButtonText: lang["btn.cancel"],
    //             target: document.getElementById("second-row"),
    //             customClass: {
    //                 confirmButton: 'swal2-confirm my-confirm-button-class'
    //             }
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 window.history.back()
    //             }
    //         });
    //     }
    // }, []);
    // ////console.log(memberCheck)










    return (
        <div class="midde_cont">
            <div class="container-fluid">

                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4><label class="pointer mb-0" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["project_detail.title"]}
                            </label> </h4>
                        </div>
                    </div>
                </div>
                <div class="row">
                    {/* Detail */}
                    <div class="col-md-6">
                        <div class="full" style={{ height: "100%", paddingBottom: 15 }}>
                            <div className="white_shd full" style={{ height: "100%" }}>
                                <div class="full graph_head_project_detail  d-flex justify-content-between align-items-center">
                                    <div class="heading1_project_detail  margin_0">
                                        <h5>{lang["project.info"]}</h5>
                                    </div>

                                    {
                                        (["ad", "uad"].indexOf(auth.role) != -1 || memberCheck?.permission === "supervisor" || projectmanager.username === _users.username) &&
                                        <div class="" onClick={editProject}>
                                            <i class="fa fa-list-ul icon-detail-project" title={lang["edit.project"]}></i>
                                        </div>
                                    }

                                </div>
                                <div class="table_section padding_infor_info">
                                    <p class="font-weight-bold">{lang["projectname"]}:</p>
                                    <p class="mb-2">{projectdetail.project_name}</p>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <p class="font-weight-bold">{lang["projectcode"]}:</p>
                                            <p class="mb-2">{projectdetail.project_code}</p>
                                        </div>
                                        <div class="col-md-4">
                                            <p class="font-weight-bold">{lang["versionname"]}:</p>
                                            {versions.map(version => (
                                                <p class="mb-2">{version.version_name}</p>
                                            ))}
                                        </div>
                                        <div class="col-md-4">
                                            <p class="font-weight-bold">{lang["projecttype"]}:</p>
                                            <p class="mb-2">{toTitleCase(projectdetail.project_type)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-weight-bold">{lang["description"]}: </p>
                                        <div className="description-container">
                                            <div style={{
                                                width: "100%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                // Giữ nguyên nội dung trên một hàng và thêm ellipsis nếu quá dài
                                            }}>
                                                {text}
                                                {/* <div dangerouslySetInnerHTML={{ __html: project.project_description }} /> */}
                                            </div>
                                            {showViewMore && (
                                                <div className="view-more-link">
                                                    <a href="#" data-toggle="modal" data-target="#viewDescription">
                                                        <b>{lang["read more"]}</b>
                                                    </a>
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <p class="font-weight-bold mt-2">{lang["projectmanager"]}: </p>
                                            <div class="profile_contacts">
                                                <img class="img-responsive circle-image" src={proxy + projectdetail.manager?.avatar} alt="#" />
                                                {projectdetail.manager?.fullname}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <p class="font-weight-bold mt-2">{lang["createby"]}:</p>
                                            <p> {projectdetail.create_by?.fullname}</p>
                                        </div>
                                        <div class="col-md-4">
                                            <p class="font-weight-bold mt-2">{lang["time"]}:</p>
                                            <p> {formatDate(projectdetail.create_at)}</p>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center mb-1">
                                        <p class="font-weight-bold">{lang["projectmember"]}: </p>
                                        {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto mb-1" data-toggle="modal" data-target="#editMember">
                                            <i class="fa fa-edit"></i>
                                        </button> */}
                                    </div>

                                    <div class="table-responsive">
                                        {
                                            sortedMembers && sortedMembers.length > 0 ? (
                                                <>
                                                    <table class="table table-striped ">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold" style={{ width: "30px" }} scope="col">{lang["log.no"]}</th>
                                                                <th class="font-weight-bold align-center" style={{ width: "100px" }} scope="col">{lang["members"]}</th>
                                                                <th class="font-weight-bold" scope="col">{lang["fullname"]}</th>
                                                                <th class="font-weight-bold" style={{ width: "100px" }} scope="col">{lang["duty"]}</th>
                                                                {
                                                                    // (["ad", "uad"].indexOf(auth.role) != -1 || memberCheck.permission === "supervisor" || projectmanager.username === _users.username) &&
                                                                    (["ad", "uad"].indexOf(auth.role) != -1 || projectmanager.username === _users.username) &&
                                                                    <th class="font-weight-bold" style={{ width: "80px" }}>{lang["log.action"]}</th>
                                                                }
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentMembers.map((member, index) => (
                                                                <tr key={member.username}>
                                                                    <td scope="row">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                                    <td class="align-center"><img src={proxy + member.avatar} class="img-responsive circle-image-cus " alt="#" /></td>
                                                                    <td>{member.fullname}</td>
                                                                    {/* {
                                                                        (_users.username === projectdetail.manager?.username || ["ad", "uad"].indexOf(auth.role) !== -1) ? (
                                                                            <td className="align-center" style={{ minWidth: "130px" }}>
                                                                                <select
                                                                                    className="form-control"
                                                                                    value={member.permission}
                                                                                    onChange={handleSelectChangeMember}
                                                                                    data-username={member.username}
                                                                                >
                                                                                    {RolesMember.map((role, index) => {
                                                                                        return (
                                                                                            <option key={index} value={role.value} data-taskid={member.permission}>
                                                                                                {lang[role.label]}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                            </td>
                                                                        ) : (
                                                                            <td style={{ minWidth: "80px" }}>
                                                                                {
                                                                                    member.permission === "supervisor" ? lang["supervisor"] :
                                                                                        member.permission === "deployer" ? lang["deployers"] :
                                                                                            "Khác"
                                                                                }
                                                                            </td>
                                                                        )
                                                                    } */}
                                                                    <td style={{ minWidth: "80px" }}>
                                                                        {
                                                                            member.permission === "supervisor" ? lang["supervisor"] :
                                                                                member.permission === "deployer" ? lang["deployers"] :
                                                                                    "Khác"
                                                                        }
                                                                    </td>
                                                                    {
                                                                        (["ad", "uad"].indexOf(auth.role) != -1 || projectmanager.username === _users.username) &&
                                                                        <td class="align-center">
                                                                            <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteUser(member)} title={lang["delete"]}></i>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </>
                                            ) : (
                                                <div class="list_cont ">
                                                    <p>{lang["empty.member"]}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                    {currentMembers && currentMembers.length > 0 ? (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>
                                                {lang["show"]} {currentMembers.length > 0 ? indexOfFirstMember + 1 : 0}-{Math.min(indexOfLastMember, sortedMembers.length)} {lang["of"]} {sortedMembers.length} {lang["results"]}
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
                                    ) : (null)
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update member */}
                    <div class={`modal show`} id="editMember">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Cập nhật thành viên dự án</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="row">
                                            <div className="form-group col-lg-12">
                                                <label>Thành viên dự án</label>
                                                <div class="options-container">
                                                    <div class="option">
                                                        <h5>Phụ trách</h5>
                                                        {

                                                            selectedUsers.map(user => {
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
                                                        }
                                                        <button type="button" class="btn btn-primary custom-buttonadd" onClick={handleOpenAdminPopup} >
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div class="option">
                                                        <h5>Triển Khai</h5>
                                                        {
                                                            selectedImple.map(user => {
                                                                const userData = users.find(u => u.username === user.username);
                                                                return (
                                                                    <div key={user.username}>
                                                                        <p>{userData ? userData.fullname : 'User not found'}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        <button type="button" class="btn btn-primary custom-buttonadd" onClick={handleOpenImplementationPopup} >
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div class="option">
                                                        <h5>Theo Dõi</h5>
                                                        {
                                                            selectedMonitor.map(user => {
                                                                const userData = users.find(u => u.username === user.username);
                                                                return (
                                                                    <div key={user.username}>
                                                                        <p>{userData ? userData.fullname : 'User not found'}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        <button type="button" class="btn btn-primary custom-buttonadd" onClick={handleOpenMonitorPopup} >
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showAdminPopup && (
                                                <div class="user-popup4">
                                                    <div class="user-popup-content">
                                                        {users && users.map(user => {
                                                            if (user.username !== manager && !selectedImple.some(u => u.username === user.username) && !selectedMonitor.some(u => u.username === user.username)) {
                                                                return (
                                                                    <div key={user.username} class="user-item">
                                                                        <input
                                                                            class="user-checkbox"
                                                                            type="checkbox"
                                                                            checked={tempSelectedUsers.some(u => u.username === user.username)}
                                                                            onChange={() => handleAdminCheck(user, 'supervisor')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'supervisor')}>
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
                                                                            onChange={() => handleImpleCheck(user, 'deployer')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'deployer')}>
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
                                            {/* {showMonitorPopup && (
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
                                            )} */}
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" onClick={addMember} class="btn btn-success ">Lưu lại</button>
                                    <button type="button" data-dismiss="modal" class="btn btn-danger">Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Project */}
                    <div class={`modal show`} id="editProject">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">{lang["updateproject"]}</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="row">
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
                                            <div class="form-group col-lg-6 ">
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

                                            <div class="form-group col-lg-12 ">
                                                <label>{lang["projectdescripton"]} </label>
                                                <textarea rows="10" type="text" class="form-control" value={project.project_description} onChange={
                                                    (e) => { setProject({ ...project, project_description: e.target.value }) }
                                                } placeholder={lang["p.projectdescripton"]} />
                                            </div>
                                            <div className="form-group col-lg-12">
                                                <label>{lang["projectmember"]}</label>
                                                <div class="options-container">
                                                    <div class="option" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <h5>{lang["supervisor"]}</h5>
                                                        <div class="div-to-scroll" style={{ overflowY: 'auto', maxHeight: '105px', minWidth: "50px", paddingRight: '15px' }}>
                                                            {
                                                                selectedUsers.map(user => {
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
                                                            }
                                                        </div>
                                                        <button type="button" class="btn btn-primary custom-buttonadd" onClick={handleOpenAdminPopup} >
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div class="option" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <h5>{lang["deployers"]}</h5>
                                                        <div class="div-to-scroll" style={{ overflowY: 'auto', maxHeight: '105px', minWidth: "50px", paddingRight: '15px' }}>
                                                            {
                                                                selectedImple.map(user => {
                                                                    const userData = users.find(u => u.username === user.username);
                                                                    return (
                                                                        <div key={user.username}>
                                                                            <p>{userData ? userData.fullname : 'User not found'}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <button type="button" class="btn btn-primary custom-buttonadd" onClick={handleOpenImplementationPopup} >
                                                            <i class="fa fa-plus"></i>
                                                        </button>
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
                                                                        <input
                                                                            class="user-checkbox"
                                                                            type="checkbox"
                                                                            checked={tempSelectedUsers.some(u => u.username === user.username)}
                                                                            onChange={() => handleAdminCheck(user, 'supervisor')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'supervisor')}>
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
                                                            if (user.username !== manager && !selectedUsers.some(u => u.username === user.username)) {
                                                                return (
                                                                    <div key={user.username} class="user-item">
                                                                        <input
                                                                            class="user-checkbox"
                                                                            type="checkbox"
                                                                            checked={tempSelectedImple.some(u => u.username === user.username)}
                                                                            onChange={() => handleImpleCheck(user, 'deployer')}
                                                                        />
                                                                        <span class="user-name" onClick={() => handleAdminCheck(user, 'deployer')}>
                                                                            <img width={20} class="img-responsive circle-image-list" src={proxy + user.avatar} alt="#" />  {user.username}-{user.fullname}
                                                                        </span>
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
                                    <button type="button" onClick={submitUpdateProject} class="btn btn-success ">{lang["btn.update"]}</button>
                                    <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div class="col-md-6">
                        <div class="white_shd full margin_bottom_30">

                            <div class="full graph_head_project_detail  d-flex justify-content-between align-items-center">
                                <div class="heading1_project_detail  margin_0">
                                    <h5>{lang["projectprocess"]}</h5>
                                </div>
                                <div>
                                    {/* <button type="button" class="btn btn-primary btn-header" onClick={openDetailTask} data-toggle="modal">
                                        <i class="fa fa-list-ul size pointer" title={lang["view.task"]}></i>
                                        
                                    </button> */}
                                    <i class="fa fa-list-ul icon-detail-project pointer mr-1" onClick={openDetailTask} title={lang["view.task"]}></i>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div className="d-flex">

                                    <span class="skill d-block" style={{ width: `100%` }}><span class="info_valume">{process.progress}%</span></span>
                                </div>
                                <div class="progress skill-bar ">
                                    <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow={process.progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${process.progress}%` }}>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center mt-2">
                                    <p class="font-weight-bold"> </p>
                                    <span className="status-label ml-auto" style={{
                                        backgroundColor: (statusProject.find((s) => s.value === projectdetail.project_status) || {}).color,
                                        whiteSpace: "nowrap"
                                    }}>
                                        {lang[`${(statusProject.find((s) => s.value === projectdetail.project_status) || {}).label || 'Trạng thái không xác định'}`]}
                                    </span>
                                </div>
                                {statisTask && statisTask.length > 0 ? (
                                    <div style={{ display: 'flex', height: '365px', width: '100%' }}>
                                        <ResponsiveContainer width="60%">
                                            <PieChart>
                                                <Pie
                                                    data={statisTask}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={90 + '%'}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={renderCustomizedLabel}
                                                    labelLine={false}
                                                >
                                                    {statisTask.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center' }}>
                                            {statisTask.map((task, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <div style={{
                                                        display: 'inline-block',
                                                        width: '25px',
                                                        height: '15px',
                                                        backgroundColor: COLORS[index % COLORS.length],  // Lấy màu từ mảng COLORS dựa trên chỉ số của task
                                                        marginRight: '10px'
                                                    }}></div>
                                                    <p>{`${task.name}: ${task.value}% (${task.total}/${totalOfAllTasks})`}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {/* <div className="row">
                                        <div className="col-md-5 d-flex justify-content-center">
                                            <div className="my-auto">
                                          
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            
                                            <div class="table-responsive mt-4">
                                                <table class="table table1 no-border-table no-border ">
                                            
                                                    <tbody>
                                                    
                                                            <tr>
                                                                <td>
                                                                    <div style={{
                                                                        display: 'inline-block',
                                                                        width: '10px',
                                                                        height: '10px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: "red",
                                                                        marginRight: '10px'
                                                                    }}></div>
                                                                    
                                                                </td>
                                                                <td>1</td>
                                                                <td>2</td>
                                                            </tr>
                                                 
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div> */}





                            </div>
                        </div>
                    </div>

                    {/* View Description Project */}
                    <div class={`modal no-select-modal ${showModal ? 'show' : ''}`} id="viewDescription">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">{lang["description"]}</h4>
                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="row">
                                            <div class="form-group col-lg-12">
                                                <span className="d-block" style={{ textAlign: "justify" }}>
                                                    {/* {projectdetail.project_description && projectdetail.project_description.split('\n').map(s => <span style={{ display: "block" }}>{s}</span>)} */}
                                                    <div dangerouslySetInnerHTML={{ __html: projectdetail.project_description }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export file to many form */}
                    <div class={`modal ${showModal ? 'show' : ''}`} id="exportOptions">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">{lang["export.title"]}</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div className="row">
                                            <div class="form-group col-lg-6 ">
                                                <label>{lang["export.version"]} <span className='red_star'>*</span></label>
                                                <select className="form-control" onChange={(e) => { setExporter({ ...exporter, version: e.target.value }) }}>
                                                    <option value="">{lang["choose"]}</option>
                                                    {versions.map((ver, index) => {
                                                        return (
                                                            <option key={index} value={ver.version_id}>{ver.version_name}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div class="form-group col-lg-6 ">
                                                <label>{lang["export.type"]} <span className='red_star'>*</span></label>
                                                <select className="form-control" onChange={(e) => { setExporter({ ...exporter, type: parseInt(e.target.value) }) }}>
                                                    <option value="">{lang["choose"]}</option>
                                                    {exportTypes.map((type, index) => {
                                                        return (
                                                            <option key={index} value={type.id}>{type.label}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" onClick={exportTrigger} class="btn btn-success ">{lang["btn.export"]}</button>
                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate activation key */}
                    <div class={`modal ${showModal ? 'show' : ''}`} id="generateActivationKey">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">{lang["activate.title"]}</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div className="row">

                                            <div class="form-group col-lg-12">
                                                <label>{lang["activate.mac"]} <span className='red_star'>*</span></label>
                                                <input type="text" class="form-control" value={activate.id} onChange={
                                                    (e) => { setActivate({ ...activate, id: e.target.value }) }
                                                } />
                                            </div>

                                            {activate.activation_key ?
                                                <div class="form-group col-lg-12">
                                                    <label>{lang["activate.key"]}</label>
                                                    <textarea type="text" class="form-control" value={activate.activation_key} onChange={
                                                        (e) => { e.preventDefault() }
                                                    }
                                                        style={{ minHeight: 275 }}
                                                        spellCheck={false}

                                                    />
                                                </div>
                                                : null
                                            }

                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" onClick={generateKey} class="btn btn-success ">{lang["btn.export"]}</button>
                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Website info */}
                <div class="row">
                    <div style={{ paddingLeft: "10px" }} class="col-md-12">
                        <div class="white_shd full">
                            <div class="full graph_head_project_detail  d-flex">
                                <div class="heading1_project_detail  margin_0 ">
                                    <h5>{lang["project.deploy"]}</h5>
                                </div>
                                <div class="ml-auto pointer" type="button" data-toggle="modal" data-target="#generateActivationKey" >
                                    <i className="fa fa-key size-24 icon-detail-project" style={{ color: "green", marginRight: "16px" }} title={lang["activate.key"]}></i>
                                </div>
                                <div class="pointer" type="button" id="exportClickTrigger" data-toggle="modal" data-target="#exportOptions" >
                                    <i className="fa fa-download  icon-detail-project size-24 mr-2" style={{ color: "#ff6655" }} title={lang["export"]}></i>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info_website">
                                <div class="row column1">
                                    <div class="col-md-6 col-lg-4">
                                        <div class="full counter_section_website mb-1 mt-1 box-table">
                                            <div class="couter_icon">
                                                <div class="d-flex">
                                                    <i class="fa fa-table yellow_color"></i>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    <p class="total_no  mt-4">{tables.tables?.length || 0} Tables</p>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    <p class="total_no mt-4">
                                                        <i class="fa fa-cog icon-detail pointer size-32 ml-auto" onClick={() => tablesManager()} title={lang["viewdetail"]}></i>
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-lg-4">
                                        <div class="full counter_section_website mb-1 mt-1 box-api">
                                            <div class="couter_icon">
                                                <div>
                                                    <i class="fa fa-cloud blue1_color"></i>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    <p class="total_no  mt-4">{apis.length || 0} API</p>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    <p class="total_no mt-4">
                                                        <i class="fa fa-cog icon-detail pointer size-32 ml-auto" onClick={() => apisManager()} title={lang["viewdetail"]}></i>
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-lg-4">
                                        <div class="full counter_section_website mb-1 mt-1  box-ui " >
                                            <div class="couter_icon">
                                                <div>
                                                    <i class="fa fa-newspaper-o green_color"></i>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    <p class="total_no  mt-4">{uis.length || 0} UI</p>
                                                </div>
                                            </div>
                                            <div class="counter_no">
                                                <div>
                                                    {/* <p class="total_no mt-4"> <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => uisManager()} data-toggle="modal" data-target="#">
                                                        <i class="fa fa-plus"></i>
                                                    </button></p> */}
                                                    <p class="total_no mt-4">
                                                        <i class="fa fa-cog icon-detail pointer size-32 ml-auto" onClick={() => uisManager()} title={lang["viewdetail"]}></i>
                                                    </p>
                                                </div>
                                            </div>
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

