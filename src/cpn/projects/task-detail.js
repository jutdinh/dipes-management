
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Gantt from "./gantt"



export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser)
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const [errorMessagesadd, setErrorMessagesadd] = useState({});
    const [projectdetail, setProjectDetail] = useState([]); //// Detail project
    const [projectmember, setProjectMember] = useState([]);
    const [selectedMemberTask, setSelectedMemberTask] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); // admin
    const [selectedImple, setSelectedImple] = useState([]);
    const [project, setProject] = useState({}); //// Update project
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
    const statusTask = [
        { id: 0, label: lang["await"], value: 0, color: "#1ed085" },
        { id: 1, label: lang["approved"], value: 1, color: "#181dd4" },


    ]
    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]
    const getStatusLabel = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? status.label : 'N/A';
    };

    const getStatusColor = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? status.color : 'N/A';
    };
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ task_status: 1 });
    const [taskDetail, setTaskDetail] = useState([]);
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
                        setProcess(data)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])

    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}/tasks`, {
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
                        // console.log("data task", data)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessagesadd({})
    };
    console.log(selectedMemberTask)
    const submitAddTask = (e) => {

        e.preventDefault();
        task.members = selectedMemberTask.map(user => user.username);

        const errors = {};
        if (!task.task_name) {
            errors.task_name = lang["error.taskname"];
        }
        if (!task.task_priority) {
            errors.task_priority = lang["error.task_priority"];
        }
        if (!task.start) {
            errors.start = lang["error.start"];
        }
        if (!task.end) {
            errors.end = lang["error.end"];
        }
        if (new Date(task.start) > new Date(task.end)) {
            errors.checkday = lang["error.checkday"];
        }

        if (!task.task_description) {
            errors.task_description = lang["error.task_description"];
        }
        if (!task.members || task.members.length === 0) {
            errors.members = lang["error.members"];
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }

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
                        functions.showApiResponseMessage(status);
                    } else {
                        functions.showApiResponseMessage(status);
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
    console.log(updateTaskinfo)
    useEffect(() => {
        if (updateTaskinfo && updateTaskinfo.members) {
            setSelectedMemberTask(updateTaskinfo.members);
        }
    }, [updateTaskinfo]);



    const updateTask = (e) => {
        e.preventDefault();
        const errors = {};
        if (!updateTaskinfo.task_name) {
            errors.task_name = lang["error.taskname"];
        }

        if (!updateTaskinfo.start) {
            errors.start = lang["error.start"];
        }
        if (!updateTaskinfo.end) {
            errors.end = lang["error.end"];
        }
        if (new Date(updateTaskinfo.start) > new Date(updateTaskinfo.end)) {
            errors.checkday = lang["error.checkday"];
        }

        if (!updateTaskinfo.task_description) {
            errors.task_description = lang["error.task_description"];
        }
        // if (!task.members || task.members.length === 0) {
        //     errors.members = lang["error.members"];
        // }

        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }

        const requestBody = {
            project_id: project.project_id,
            task_id: updateTaskinfo.task_id,
            task_name: updateTaskinfo.task_name,
            start: updateTaskinfo.start,
            end: updateTaskinfo.end,
            // members: selectedMemberTask,
            task_description: updateTaskinfo.task_description,
            task_priority: updateTaskinfo.task_priority,
        };
        // console.log(requestBody)
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
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            })

        setErrorMessagesadd({})
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
    // console.log(taskDetail)
    const [deleteTask, setDelelteTask] = useState(false);

    const handleConfirmTask = (taskid) => {
        const newTaskApproveStatus = !taskid.task_approve;
        const requestBody = {
            project_id: project.project_id,
            task_id: taskid.task_id,
            task_approve: newTaskApproveStatus
        };
        // console.log(requestBody)
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
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            });


    }
    const handleDeleteTask = (taskid) => {
        const requestBody = {

            project_id: project.project_id,
            task_id: taskid.task_id

        };
        // console.log(requestBody)

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
                        functions.showApiResponseMessage(status);
                    });
            }
        });
    }
    const handleSelectChange = async (e) => {
        const newTaskStatus = parseInt(e.target.value, 10);
        const taskId = e.target.options[e.target.selectedIndex].dataset.taskid;
        // console.log(taskId);
        updateStatusTask({ task_id: taskId, newTaskStatus: newTaskStatus });
    }


    const updateStatusTask = (taskInfo) => {

        const requestBody = {
            project_id: project.project_id,
            task_id: taskInfo.task_id,
            task_status: taskInfo.newTaskStatus
        };
        // console.log(requestBody)
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
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const indexOfLastMember = currentPage * rowsPerPage;
    const indexOfFirstMember = indexOfLastMember - rowsPerPage;
    const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(sortedMembers.length / rowsPerPage);



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

    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["projectprocess"]}</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-2" title={lang["back"]}></i>Timeline
                                    </label> </h5>
                                </div>
                                {/* <div class="ml-auto">
                                    <i class="fa fa-newspaper-o icon-ui"></i>
                                </div> */}
                            </div>
                            <div class="table_section padding_infor_info">
                                <div calss="row column1">
                                    <div class="col-md-12">
                                        <h4 class="font-weight-bold ml-2">{lang["projectname"]}: {project.project_name} </h4>
                                    </div>
                                </div>
                                <div class="row column1">
                                    {/* Progresss */}
                                    <div class="table_section padding_infor_info">
                                        <div className="d-flex">
                                            <div>
                                                <span className="status-label d-block" style={{
                                                    backgroundColor: (statusProject.find((s) => s.value === projectdetail.project_status) || {}).color,
                                                    whiteSpace: "nowrap"
                                                }}>
                                                    {lang[`${(statusProject.find((s) => s.value === projectdetail.project_status) || {}).label || 'Trạng thái không xác định'}`]}
                                                </span>
                                            </div>
                                            <span class="skill d-block" style={{ width: `100%` }}><span class="info_valume">{process.progress}%</span></span>
                                        </div>
                                        <div class="progress skill-bar ">
                                            <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow={process.progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${process.progress}%` }}>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center mt-2">
                                            <p class="font-weight-bold">{lang["tasklist"]}: </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTask">
                                                <i class="fa fa-plus" title={lang["btn.create"]}></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                sortedMembers && sortedMembers.length > 0 ? (
                                                    <>
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["task"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.create_user"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col">{lang["taskstatus"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col">{lang["taskstatus"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["confirm"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.daystart"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.dayend"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentMembersTask.map((task, index) => (
                                                                    <tr key={task.id}>
                                                                        <td scope="row">{indexOfFirstMemberTask + index + 1}</td>

                                                                        <td style={{ maxWidth: "100px" }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap"
                                                                            }}>
                                                                                {task.task_name}
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "170px" }} >
                                                                            {
                                                                                task.members && task.members.length > 0 ?
                                                                                    task.members.slice(0, 2).map(member => (
                                                                                        <img
                                                                                            class="img-responsive circle-image-cus"
                                                                                            src={proxy + member.avatar}
                                                                                            alt={member.username}
                                                                                        />
                                                                                    )) :
                                                                                    <p>{lang["projectempty"]} </p>
                                                                            }
                                                                            {
                                                                                task.members.length > 2 &&
                                                                                <div className="img-responsive circle-image-projectdetail ml-1" style={{ backgroundImage: `url(${proxy + task.members[2].avatar})` }}>
                                                                                    <span>+{task.members.length - 2}</span>
                                                                                </div>
                                                                            }
                                                                        </td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }} >


                                                                            <select
                                                                                className="form-control"
                                                                                value={task.task_status}
                                                                                onChange={handleSelectChange}
                                                                                disabled={task.task_approve}
                                                                            >

                                                                                {statusTaskView.map((status, index) => {
                                                                                    return (
                                                                                        <option key={index} value={status.value} data-taskid={task.task_id}>
                                                                                            {lang[status.label]}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>

                                                                        </td>
                                                                        <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                            <input style={{ maxWidth: 75 }} className="form-control" value={ task.task_progress } />
                                                                        </td>
                                                                        <td class="font-weight-bold" style={{ color: getStatusColor(task.task_approve ? 1 : 0), textAlign: "center" }}>
                                                                            {getStatusLabel(task.task_approve ? 1 : 0)}
                                                                        </td>
                                                                        <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                            {task.start}
                                                                        </td>
                                                                        <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                            {task.end}
                                                                        </td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>
                                                                            <i class="fa fa-eye size pointer icon-margin icon-view" onClick={() => detailTask(task)} data-toggle="modal" data-target="#viewTask" title={lang["viewdetail"]}></i>
                                                                            {
                                                                                (_users.username === projectdetail.manager?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                                                <>
                                                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => getIdTask(task)} data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
                                                                                    {task.task_approve
                                                                                        ? (task.task_status !== StatusTask.NOT_APPROVED
                                                                                            ? <i class="fa fa-times-circle-o size pointer icon-margin icon-check" onClick={() => handleConfirmTask(task)} title={lang["updatestatus"]}></i>
                                                                                            : <i class="fa fa-times-circle-o size pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                                        : (task.task_status === StatusTask.COMPLETE.value
                                                                                            ? <i class="fa fa-check-circle-o size pointer icon-margin icon-close" onClick={() => handleConfirmTask(task)} title={lang["updatestatus"]}></i>
                                                                                            : <i class="fa fa-check-circle-o size pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                                    }
                                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteTask(task)} title={lang["delete"]}></i>
                                                                                </>
                                                                            }
                                                                        </td>
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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>{lang["show"]} {indexOfFirstMemberTask + 1}-{Math.min(indexOfLastMemberTask, tasks.length)} {lang["of"]} {tasks.length} {lang["results"]}</p>
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination mb-0">
                                                    <li className={`page-item ${currentPageTask === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginateTask(currentPageTask - 1)}>
                                                            &laquo;
                                                        </button>
                                                    </li>
                                                    {Array(totalPagesTask).fill().map((_, index) => (
                                                        <li className={`page-item ${currentPageTask === index + 1 ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => paginateTask(index + 1)}>
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPageTask === totalPagesTask ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => paginateTask(currentPageTask + 1)}>
                                                            &raquo;
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    {/* Gantt */}
                                    <div class="table_section padding_infor_info">

                                        <div class="d-flex align-items-center mt-2">
                                            <p class="font-weight-bold">{lang["timeline"]}: </p>

                                        </div>
                                        {
                                            tasks && tasks.length > 0 ? (
                                                <Gantt data={tasks} />
                                            ) : null
                                        }

                                    </div>

                                    {/* Add Progress */}
                                    <div class={`modal ${showModal ? 'show' : ''}`} id="addTask">
                                        <div class="modal-dialog modal-dialog-center">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">{lang["addtask"]}</h4>
                                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="row">
                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["taskname"]} <span className='red_star'>*</span></label>
                                                                <input type="text" class="form-control" value={task.task_name} onChange={
                                                                    (e) => { setTask({ ...task, task_name: e.target.value }) }
                                                                } placeholder={lang["p.taskname"]} />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
                                                                </div>
                                                            </div>


                                                            <div class="form-group col-lg-12 ">
                                                                <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
                                                                <select className="form-control" value={task.task_priority} onChange={(e) => { setTask({ ...task, task_priority: e.target.value }) }}>
                                                                    <option value="">{lang["choose"]}</option>
                                                                    {statusPriority.map((status, index) => {
                                                                        return (
                                                                            <option key={index} value={status.value}>{lang[status.label]}</option>
                                                                        );
                                                                    })}
                                                                </select>
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
                                                                </div>
                                                                <input type="hidden" class="form-control" value={task.task_status} onChange={
                                                                    (e) => { setTask({ ...task, task_status: e.target.value }) }
                                                                } />
                                                            </div>

                                                            <div className="col-lg-6">
                                                                <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                                                <input type="date" className="form-control" value={task.start} onChange={
                                                                    (e) => { setTask({ ...task, start: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                                                <input type="date" className="form-control" value={task.end} onChange={
                                                                    (e) => { setTask({ ...task, end: e.target.value }) }
                                                                } />
                                                                {!errorMessagesadd.checkday ? (
                                                                    <div style={{ minHeight: '20px' }}>
                                                                        {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
                                                                    </div>
                                                                ) : null

                                                                }

                                                            </div>
                                                            <div class="form-group col-lg-6"></div>
                                                            <div class="form-group col-lg-6">
                                                                {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
                                                            </div>

                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["p.description"]} <span className='red_star'>*</span></label>
                                                                <textarea rows="4" type="text" class="form-control" value={task.task_description} onChange={
                                                                    (e) => { setTask({ ...task, task_description: e.target.value }) }
                                                                } placeholder={lang["p.description"]} />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-lg-12">

                                                                <label>{lang["taskmember"]} <span className='red_star'>*</span></label>

                                                                {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}

                                                                <div class="user-checkbox-container">
                                                                    {projectdetail.members?.map((user, index) => (
                                                                        <div key={index} class="user-checkbox-item">
                                                                            <label>
                                                                                <input
                                                                                    type="checkbox" class="mr-1"
                                                                                    value={JSON.stringify(user)}
                                                                                    onChange={(e) => {
                                                                                        let selectedUser = JSON.parse(e.target.value);
                                                                                        let alreadySelected = selectedMemberTask.find(u => u.username === selectedUser.username);
                                                                                        if (alreadySelected) {
                                                                                            setSelectedMemberTask(selectedMemberTask.filter(u => u.username !== selectedUser.username));
                                                                                        } else {
                                                                                            setSelectedMemberTask([...selectedMemberTask, selectedUser]);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                {user.fullname}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" onClick={submitAddTask} class="btn btn-success ">{lang["btn.create"]}</button>
                                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Update Progress */}
                                    <div class={`modal ${showModal ? 'show' : ''}`} id="editTask">
                                        <div class="modal-dialog modal-dialog-center">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">{lang["edittask"]}</h4>
                                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="row">
                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["taskname"]} <span className='red_star'>*</span></label>
                                                                <input type="text" class="form-control" value={updateTaskinfo.task_name} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, task_name: e.target.value }) }
                                                                } placeholder={lang["p.taskname"]} />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-lg-4 ">
                                                                <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
                                                                <select className="form-control" value={updateTaskinfo.task_priority} onChange={(e) => { setUpdateTask({ ...updateTaskinfo, task_priority: e.target.value }) }}>
                                                                    {statusPriority.map((status, index) => {
                                                                        return (
                                                                            <option key={index} value={status.value} selected={status.value == updateTaskinfo.task_priority ? true : false} >{lang[status.label]}</option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>  <div class="form-group col-lg-8"></div>

                                                            <div className="col-lg-6">
                                                                <label>{lang["log.daystart"]}:</label>
                                                                <input type="date" className="form-control" value={updateTaskinfo.start} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, start: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.dayend"]}:</label>
                                                                <input type="date" className="form-control" value={updateTaskinfo.end} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, end: e.target.value }) }
                                                                } />
                                                                {!errorMessagesadd.checkday ? (
                                                                    <div style={{ minHeight: '20px' }}>
                                                                        {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
                                                                    </div>
                                                                ) : null

                                                                }
                                                            </div>
                                                            <div class="form-group col-lg-6"></div>
                                                            <div class="form-group col-lg-6">
                                                                {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
                                                            </div>
                                                            {/* <div class="form-group col-lg-6 ">
                                                <label>{lang["taskstatus"]} <span className='red_star'>*</span></label>
                                                <select className="form-control" value={updateTaskinfo.task_status} onChange={(e) => { setUpdateTask({ ...updateTaskinfo, task_status: e.target.value }) }}>
                                                    <option value="">Chọn</option>
                                                    {statusTaskView.map((status, index) => {
                                                        return (
                                                            <option key={index} value={status.value}>{lang[`${status.label}`]}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div> */}


                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["p.description"]}</label>
                                                                <textarea rows="4" type="text" class="form-control" value={updateTaskinfo.task_description} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, task_description: e.target.value }) }
                                                                } placeholder={lang["p.description"]} />
                                                            </div>
                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["taskmember"]}</label>
                                                                <span className="d-block"> {
                                                                    updateTaskinfo.members && updateTaskinfo.members.length > 0 ?
                                                                        updateTaskinfo.members.map(member => (
                                                                            <img
                                                                                class="img-responsive circle-image-cus"
                                                                                src={proxy + member.avatar}
                                                                                alt={member.username}
                                                                            />
                                                                        )) :
                                                                        <p>{lang["projectempty"]} </p>
                                                                }
                                                                </span>
                                                            </div>
                                                            {/* <div class="form-group col-lg-12">
                                                                <label>{lang["taskmember"]} <span className='red_star'>*</span></label>

                                                                {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}

                                                                <div class="user-checkbox-container">
                                                                    {projectdetail.members?.map((user, index) => (
                                                                        <div key={index} class="user-checkbox-item">
                                                                            <label>
                                                                                <input
                                                                                    type="checkbox" class="mr-1"
                                                                                    value={JSON.stringify(user)}
                                                                                    checked={selectedMemberTask.find(u => u.username === user.username) ? true : false} // this line checks if the user was previously selected
                                                                                    onChange={(e) => {
                                                                                        let selectedUser = JSON.parse(e.target.value);
                                                                                        let alreadySelected = selectedMemberTask.find(u => u.username === selectedUser.username);
                                                                                        if (alreadySelected) {
                                                                                            setSelectedMemberTask(selectedMemberTask.filter(u => u.username !== selectedUser.username));
                                                                                        } else {
                                                                                            setSelectedMemberTask([...selectedMemberTask, selectedUser]);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                {user.fullname}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div> */}


                                                            {/* <div class="form-group col-lg-12">
                                                <label>Quản lý</label>
                                                <div class="user-checkbox-container">
                                                    {updateTaskinfo.members?.map((user, index) => (
                                                        <div key={index} class="user-checkbox-item">
                                                            <input
                                                                type="checkbox"
                                                                value={JSON.stringify(user)}
                                                                onChange={(e) => {
                                                                    let selectedUser = JSON.parse(e.target.value);
                                                                    let alreadySelected = selectedMemberTask.find(u => u.username === selectedUser.username);
                                                                    if (alreadySelected) {
                                                                        setSelectedMemberTask(selectedMemberTask.filter(u => u.username !== selectedUser.username));
                                                                    } else {
                                                                        setSelectedMemberTask([...selectedMemberTask, selectedUser]);
                                                                    }
                                                                }}
                                                            />
                                                            <label>{user.fullname}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div> */}
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" onClick={updateTask} class="btn btn-success ">{lang["btn.update"]}</button>
                                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* View Task */}
                                    <div class={`modal ${showModal ? 'show' : ''}`} id="viewTask">
                                        <div class="modal-dialog modal-dialog-center">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">{lang["detailtask"]}</h4>
                                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="row">
                                                            <div class="form-group col-lg-12">
                                                                <label><b>{lang["taskname"]}</b></label>
                                                                <span className="d-block"> {taskDetail.task_name} </span>
                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["log.daystart"]}</b></label>
                                                                <span className="d-block"> {taskDetail.start} </span>
                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["log.dayend"]}</b></label>
                                                                <span className="d-block"> {taskDetail.end} </span>
                                                            </div>
                                                            <div class="form-group col-lg-4"></div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["taskstatus"]}</b></label>
                                                                <div>
                                                                    <span className="status-label" style={{
                                                                        backgroundColor: (statusTaskView.find((s) => s.value === taskDetail.task_status) || {}).color,
                                                                        whiteSpace: "nowrap"
                                                                    }}>
                                                                        {lang[`${(statusTaskView.find((s) => s.value === taskDetail.task_status) || {}).label || 'Trạng thái không xác định'}`]}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["create-at"]}</b></label>
                                                                <span className="d-block"> {taskDetail.create_at} </span>
                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["creator"]}</b></label>
                                                                <span className="d-block"> {taskDetail.create_by?.fullname} </span>
                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["task_priority"]}</b></label>
                                                                <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(taskDetail.task_priority)) || {}).label || taskDetail.task_priority}`]} </span>

                                                            </div>
                                                            <div class="form-group col-lg-4">
                                                                <label><b>{lang["confirm"]}</b></label>
                                                                <td class="font-weight-bold" style={{ color: getStatusColor(taskDetail.task_approve ? 1 : 0), textAlign: "center" }}>
                                                                    {getStatusLabel(taskDetail.task_approve ? 1 : 0)}
                                                                </td>
                                                            </div>
                                                            <div class="form-group col-lg-4">

                                                            </div>
                                                            <div class="form-group col-lg-12">
                                                                <label><b>{lang["members"]}</b></label>
                                                                <span className="d-block"> {
                                                                    taskDetail.members && taskDetail.members.length > 0 ?
                                                                        taskDetail.members.map(member => (
                                                                            <img
                                                                                class="img-responsive circle-image-cus"
                                                                                src={proxy + member.avatar}
                                                                                alt={member.username}
                                                                            />
                                                                        )) :
                                                                        <p>{lang["projectempty"]} </p>
                                                                }
                                                                </span>
                                                            </div>

                                                            {/* <div class="form-group col-lg-12">
                                                                <label><b>{lang["members"]}</b></label>
                                                                <span className="d-block"> {
                                                                    taskDetail.members && taskDetail.members.length > 0 ?
                                                                        taskDetail.members.slice(0, 4).map(member => (
                                                                            <img
                                                                                class="img-responsive circle-image-cus"
                                                                                src={proxy + member.avatar}
                                                                                alt={member.username}
                                                                            />
                                                                        )) :
                                                                        <p>{lang["projectempty"]} </p>
                                                                }
                                                                    {
                                                                        taskDetail.members?.length > 5 &&
                                                                        <div className="img-responsive circle-image-projectdetail ml-1" style={{ backgroundImage: `url(${proxy + taskDetail.members[4].avatar})` }}>
                                                                            <span>+{taskDetail.members.length - 4}</span>
                                                                        </div>
                                                                    }</span>
                                                            </div> */}

                                                            <div class="form-group col-lg-12">
                                                                <label><b>{lang["description"]}</b></label>
                                                                <span className="d-block"> {taskDetail.task_description} </span>
                                                            </div>
                                                            <div class="form-group col-lg-12">
                                                                <label><b>Lịch sử</b></label>
                                                                <div class="table-responsive">
                                                                    {/* {
                                                        currentMembersViewDetailTask && currentMembersViewDetailTask.length > 0 ? (
                                                            <>
                                                                <table class="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                            <th class="font-weight-bold" scope="col">{lang["task"]}</th>
                                                                            <th class="font-weight-bold" scope="col">Giá trị cũ</th>
                                                                            <th class="font-weight-bold" scope="col">Giá trị mới</th>
                                                                            <th class="font-weight-bold" scope="col">Thời gian thay đổi</th>
                                                                            <th class="font-weight-bold" scope="col">Người thay đổi</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentMembersViewDetailTask.map((task, index) => (
                                                                            <tr key={task.id}>
                                                                                <td scope="row">{index + 1}</td>
                                                                                <td scope="row">
                                                                                    {task.modified_what === "approve" ? lang["confirm"] :
                                                                                        task.modified_what === "info" ? lang["log.information"] :
                                                                                            task.modified_what === "status" ? lang["taskstatus"] :
                                                                                                task.modified_what}
                                                                                </td>
                                                                                <td scope="row">
                                                                                    {task.old_value === "true" ? "Đã duyệt" :
                                                                                        task.old_value === "false" ? "Chờ duyệt" :
                                                                                            task.old_value}
                                                                                </td>
                                                                                <td scope="row">
                                                                                    {task.old_value === "true" ? "Chờ duyệt" :
                                                                                        task.old_value === "false" ? "Đã duyệt" :
                                                                                            task.old_value}</td>
                                                                                <td scope="row">{task.modified_at}</td>
                                                                                <td scope="row">
                                                                                    <img class="img-responsive circle-image-cus" src={proxy + task.modified_by?.avatar} />
                                                                                    {task.modified_by?.fullname}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p>{lang["show"]} {indexOfFirstMemberViewDetailTask + 1}-{Math.min(indexOfLastMemberViewDetailTask, taskDetail.history?.length)} {lang["of"]} {taskDetail.history?.length} {lang["results"]}</p>
                                                                    <nav aria-label="Page navigation example">
                                                                        <ul className="pagination mb-0">
                                                                            <li className={`page-item ${currentViewDetailTask === 1 ? 'disabled' : ''}`}>
                                                                                <button className="page-link" onClick={(e) => { e.stopPropagation(); paginateViewDetailTask(currentViewDetailTask - 1); }}>&laquo;</button>
                                                                            </li>
                                                                            {Array(totalPagesTask).fill().map((_, index) => (
                                                                                <li className={`page-item ${currentViewDetailTask === index + 1 ? 'active' : ''}`}>
                                                                                    <button className="page-link" onClick={(e) => { e.stopPropagation(); paginateViewDetailTask(index + 1); }}>{index + 1}</button>
                                                                                </li>
                                                                            ))}
                                                                            <li className={`page-item ${currentViewDetailTask === totalViewDetailTask ? 'disabled' : ''}`}>
                                                                                <button className="page-link" onClick={(e) => { e.stopPropagation(); paginateViewDetailTask(currentViewDetailTask + 1); }}>&raquo;</button>
                                                                            </li>
                                                                        </ul>
                                                                    </nav>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div class="list_cont ">
                                                                <p>Chưa có lịch sử</p>
                                                            </div>
                                                        )
                                                    } */}
                                                                    {
                                                                        taskDetail.history && taskDetail.history.length > 0 ? (
                                                                            <>
                                                                                <table class="table table-striped table-rounded table-scrollable ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th class="font-weight-bold" scope="col" style={{ maxWidth: "80px" }} >{lang["log.no"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["modify_what"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["oldvalue"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["newvalue"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["time"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["user change"]}</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {taskDetail.history.reverse().map((task, index) => (
                                                                                            <tr key={task.id}>
                                                                                                <td scope="row" style={{ maxWidth: "80px" }}>{index + 1}</td>
                                                                                                <td scope="row">
                                                                                                    {task.modified_what === "approve" ? lang["confirm"] :
                                                                                                        task.modified_what === "infor" ? lang["log.information"] :
                                                                                                            task.modified_what === "status" ? lang["taskstatus"] :
                                                                                                                task.modified_what}
                                                                                                </td>
                                                                                                <td scope="row">
                                                                                                    {
                                                                                                        task.old_value === "true" ? lang["approved"] :
                                                                                                            task.old_value === "false" ? lang["await"] :
                                                                                                                !isNaN(task.old_value) ?
                                                                                                                    lang[`${(statusTaskView.find((s) => s.value === Number(task.old_value)) || {}).label || 'Trạng thái không xác định'}`]
                                                                                                                    :
                                                                                                                    `${task.old_value.slice(0, 100)}${task.old_value.length > 100 ? '...' : ''}`

                                                                                                    }
                                                                                                </td>
                                                                                                <td scope="row">
                                                                                                    {
                                                                                                        task.new_value === "true" ? lang["approved"] :
                                                                                                            task.new_value === "false" ? lang["await"] :
                                                                                                                !isNaN(task.new_value) ?
                                                                                                                    lang[`${(statusTaskView.find((s) => s.value === Number(task.new_value)) || {}).label || 'Trạng thái không xác định'}`]
                                                                                                                    :
                                                                                                                    `${task.new_value.slice(0, 100)}${task.new_value.length > 100 ? '...' : ''}`
                                                                                                    }
                                                                                                </td>

                                                                                                <td scope="row">{task.modified_at}</td>
                                                                                                <td scope="row">
                                                                                                    <img class="img-responsive circle-image-cus" src={proxy + task.modified_by?.avatar} />
                                                                                                    {task.modified_by?.fullname}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </>
                                                                        ) : (
                                                                            <div class="list_cont ">
                                                                                <p>Chưa có lịch sử</p>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
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

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div >
        </div >
    )
}

