import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask, StatusAprove } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import FloatingTextBox from '../common/floatingTextBox';
import CheckList from '../common/checkList';
import FilterableDate from '../common/searchDate';
import XLSX from 'xlsx-js-style'
import Gantt from "./gantt"
import { formatDate } from "../../redux/configs/format-date";
import { da } from "date-fns/locale";

export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser)
    const { project_id, version_id } = useParams();
    const { removeVietnameseTones } = functions
    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/detail/${project_id}`);
    };
    const [errorMessagesadd, setErrorMessagesadd] = useState({});
    const [projectdetail, setProjectDetail] = useState([]); //// Detail project
    const [projectmember, setProjectMember] = useState([]);
    const [selectedMemberTask, setSelectedMemberTask] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); // admin
    const [selectedImple, setSelectedImple] = useState([]);
    const [project, setProject] = useState({}); //// Update project
    const [showStartDateInput, setShowStartDateInput] = useState(false);
    const [showEndDateInput, setShowEndDateInput] = useState(false);



    function formatDateTask(input) {
        if (input === null || input === undefined) return null
        const dateParts = input.split('-');
        if (dateParts.length !== 3) return null;
        const [year, month, day] = dateParts;
        return `${day}/${month}/${year}`;
    }

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
        StatusAprove.APROVE,
        StatusAprove.NOTAPROVE
    ]

    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]

    function onlyContainsNumbers(inputString) {
        const value = parseInt(inputString, 10);
        return !isNaN(value) && value >= 0 && value <= 100;
    }

    const getStatusLabel = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? lang[status.label] : 'N/A';
    };

    const getStatusColor = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);
        return status ? status.color : 'N/A';
    };

    const [tasks, setTasks] = useState([]);
    const [fakeTasks, setFakeTasks] = useState([]);
    const [task, setTask] = useState({ task_status: 1 });
    const [taskDetail, setTaskDetail] = useState([]);
    console.log(task)
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
                        // data.sort((a, b) => {
                        //     if (a.task_priority == b.task_priority) {
                        //         const aDate = new Date(a.raw_create_at)
                        //         const bDate = new Date(b.raw_create_at)
                        //         return aDate > b.Date ? -1 : 1
                        //     } else {
                        //         return a.task_priority > b.task_priority ? 1 : -1
                        //     }
                        // })
                        data.sort((a, b) => {
                            const aDate = new Date(a.create_at);
                            const bDate = new Date(b.create_at);
                            return bDate - aDate;
                        });

                        setTasks(data);
                        setFakeTasks(data)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    const filteredTasks = tasks.filter(task =>
        task.members?.some(member => member.username === _users.username) ||
        ["ad", "uad"].indexOf(auth.role) !== -1
    );
    // console.log(filteredTasks)
    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessagesadd({})
    };

    const getCorespondingValue = (task) => {
        // console.log(task)
        const corespondingTask = fakeTasks.find(t => t.task_id == task.task_id)
        return corespondingTask["task_progress"]
    }

    const changeProgress = (value, task) => {
        // const progress = e.target.value;
        const newFakeTasks = fakeTasks.map(t => {
            if (t.task_id == task.task_id) {
                t.task_progress = value
            }
            return t
        })
        const currentUpdateTask = newFakeTasks.find(t => t.task_id == task.task_id)
        setUpdateTask(currentUpdateTask)
        setFakeTasks(newFakeTasks)
    }

    const blurHandle = (task) => {

        const corespondingData = getCorespondingValue(task)
        updateTask(false)
        if (corespondingData != task.task_progress) {
        }
    }

    // console.log(selectedMemberTask)
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
            errors.checkday = lang["error.checkday_end"];
        }

        if (new Date(task.start) > new Date(task.timeline) || new Date(task.timeline) > new Date(task.end)) {
            errors.checkday_timeline = lang["error.checkday_timeline"];
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
        console.log(errors)

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
    // console.log(updateTaskinfo)

    useEffect(() => {
        if (updateTaskinfo && updateTaskinfo.members) {
            setSelectedMemberTask(updateTaskinfo.members);
        }
    }, [updateTaskinfo]);


    const updateTask = (reload = true) => {
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
            errors.checkday = lang["error.checkday_end"];
        }
        if (new Date(updateTaskinfo.start) > new Date(updateTaskinfo.timeline) || new Date(updateTaskinfo.timeline) > new Date(updateTaskinfo.end)) {
            errors.checkday_timeline = lang["error.checkday_timeline"];
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
            timeline: updateTaskinfo.timeline,
            // members: selectedMemberTask,
            task_description: updateTaskinfo.task_description,
            task_priority: updateTaskinfo.task_priority,
            task_progress: updateTaskinfo.task_progress
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
                    functions.showApiResponseMessage(status, reload);
                } else {
                    functions.showApiResponseMessage(status, reload);
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
    console.log(tasks)
    console.log(project)

    const statusMapping = {
        1: "Khởi tạo",
        2: "Thực hiện",
        3: "Hoàn thành",
        4: "Tạm dừng"
    };
    const priorityMapping = {
        1: "Cao",
        2: "Trung bình",
        3: "Thấp"
    };
    const exportToExcel = () => {
        console.log(project)

        // console.log(dataExport)
        const projectTasks = project.tasks;
        // console.log(projectTasks)
        // if (!projectTasks || projectTasks.length === 0) {
        //     console.error(`No tasks found for project ID: ${projectId}`);
        //     return;
        // }

        const dataExport = project

        const projectName = project.project_name
        const projectMaster = project.manager.fullname;
        const header = [
            "STT",
            "Công việc",
            "Mô tả",
            "Người thực hiện",
            "Trạng thái",
            "Mức độ ưu tiên",
            "% Hoàn thành",
            "Xác nhận",
            "Ngày bắt đầu (dd/MM/yyyy)",
            "Ngày kết thúc (dd/MM/yyyy)",
            "Timeline (dd/MM/yyyy)",


        ];
        const data = tasks.map((task, index) => {

            let changedAt = task.history.modified_at ? new Date(task.history.modified_at).toLocaleDateString("vi-VN") : '';
            // let status = statusTaskView.find((s) => s.value === task.task_status) || "Trạng thái không xác định";
            let status = statusMapping[task.task_status] || "Trạng thái không xác định";
            let priority = priorityMapping[task.task_priority] || "Mức độ ưu tiên không xác định";
            let complete = task.task_progress;
            let approve = task.task_approve ? "Đã xác nhận" : "Chờ xác nhận"
            let daystart = formatDateTask(task.start)
            let dayend = formatDateTask(task.end)
            let timeline = formatDateTask(task.timeline)
            let joinedNames = "";
            if (task.members) {
                joinedNames = task.members.map(mem => mem.fullname).join(', ');
            }
            return [
                index + 1,
                task.task_name,
                task.task_description,
                joinedNames || "Chưa có người thực hiện",
                status,
                priority,
                `${complete}%`,
                approve,
                daystart,
                dayend,
                timeline,


            ];
        });



        const now = new Date();
        const date = now.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const ws = XLSX.utils.aoa_to_sheet([
            [`DANH SÁCH CÁC CÔNG VIỆC CỦA DỰ ÁN ${projectName}`, , , , ,],
            [`Trưởng dự án: ${projectMaster}`, "", "", "", "", "", "", "", `Nhân viên xuất: ${auth?.fullname}`, "", ""],
            [`Ngày (dd/MM/yyyy): ${date}`, "", "", "", "", "", "", "", "", "", ""],
            header,
            ...data
        ]);

        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };

        const centerStyle = {
            font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: borderStyle
        };
        const rightStyle = {
            font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
            alignment: { horizontal: "right", vertical: "right", wrapText: true },
            border: borderStyle
        };

        const titleStyle = {
            font: { name: "UTM Avo", sz: 13, bold: true, color: { rgb: "FF000000" } },
            fill: { fgColor: { rgb: "70ad47" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: borderStyle
        };

        const athurStyle = {
            font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
            border: borderStyle
        };

        const headerStyle = {
            font: { name: "UTM Avo", sz: 11, bold: true, color: { rgb: "FF000000" } },
            fill: { fgColor: { rgb: "a9d08f" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: borderStyle
        };

        ws["!cols"] = [{ width: 6 }, { width: 40 }, { width: 40 }, { width: 30 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];
        ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
        ws["A1"].s = titleStyle;
        ws["A2"].s = athurStyle;
        ws["B2"].s = athurStyle;
        ws["E2"].s = athurStyle;
        ws["F2"].s = athurStyle;
        ws["A3"].s = athurStyle;
        ws["B3"].s = athurStyle;
        ws["C2"].s = athurStyle;
        ws["C3"].s = athurStyle;
        ws["D2"].s = athurStyle;
        ws["D3"].s = athurStyle;
        ws["E2"].s = athurStyle;
        ws["E3"].s = athurStyle;
        ws["F2"].s = athurStyle;
        ws["F3"].s = athurStyle;
        ws["G2"].s = athurStyle;
        ws["G3"].s = athurStyle;
        ws["H2"].s = athurStyle;
        ws["H3"].s = athurStyle;
        ws["I2"].s = athurStyle;
        ws["I3"].s = athurStyle;
        ws["J2"].s = athurStyle;
        ws["K2"].s = athurStyle;
        ws["K3"].s = athurStyle;


        ws["A4"].s = headerStyle;
        ws["B4"].s = headerStyle;
        ws["C4"].s = headerStyle;
        ws["D4"].s = headerStyle;
        ws["E4"].s = headerStyle;
        ws["F4"].s = headerStyle;
        ws["G4"].s = headerStyle;
        ws["H4"].s = headerStyle;
        ws["I4"].s = headerStyle;
        ws["J4"].s = headerStyle;
        ws["K4"].s = headerStyle;

        const bodyStyle = {
            font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: borderStyle
        };

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                const cellAddress = `${String.fromCharCode(65 + j)}${5 + i}`;


                if (!ws[cellAddress]) {
                    ws[cellAddress] = { t: 's', v: "" };
                }

                if (j === 0) {
                    ws[cellAddress].s = centerStyle;
                } else {
                    ws[cellAddress].s = bodyStyle;
                }
            }
        }

        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },//ghép từ ô tại hàng 0, cột 0 đến ô tại hàng 0, cột 11.
            { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
            { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } }
        ];
        const wb = XLSX.utils.book_new();
        const projectCode = project.project_code;
        XLSX.utils.book_append_sheet(wb, ws, `Project-${dataExport.project_id}`);
        XLSX.writeFile(wb, `Project-${projectCode}-${projectName}-${(new Date()).getTime()}.xlsx`);
    };

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

    const [tableFilter, setTableFilter] = useState({ task_name: false });
    const handleTaskNameFilterChange = (e) => {
        setTaskNameFilter({ name: e.target.value });
    }
    // State để lưu giá trị lọc
    const [taskNameFilter, setTaskNameFilter] = useState("");
    const resetTaskNameFilter = () => {
        setTaskNameFilter({ name: "" });
    }
    const [statusFilter, setStatusFilter] = useState([]);

    const statusFilterOptions = statusTaskView.map(status => ({ label: lang[status.label], value: status.value, id: status.id }));

    const addOrRemoveStatus = (status) => {
        const newFilter = [...statusFilter];
        const index = newFilter.findIndex(item => item.id === status.id);

        if (index !== -1) {
            newFilter.splice(index, 1);
        } else {
            newFilter.push(status);
        }

        setStatusFilter(newFilter);
    };

    const [confirmFilter, setConfrimFilter] = useState([]);
    const confirmFilterOptions = statusTask.map(status => ({ label: lang[status.label], value: status.value, id: status.id }));
    const addOrRemoveConfirm = (status) => {
        const newFilter = [...confirmFilter];
        const index = newFilter.findIndex(item => item.id === status.id);
        if (index !== -1) {
            newFilter.splice(index, 1);
        } else {
            newFilter.push(status);
        }
        setConfrimFilter(newFilter);
    };
    const priorityFilterOptions = statusPriority.map(priority => ({ label: lang[priority.label], value: priority.value, id: priority.id }));
    const [priorityFilter, setPriorityFilter] = useState([]);
    const addOrRemovePriority = (priority) => {
        const newFilter = [...priorityFilter];
        const index = newFilter.findIndex(item => item.id === priority.id);
        if (index !== -1) {
            newFilter.splice(index, 1);
        } else {
            newFilter.push(priority);
        }
        setPriorityFilter(newFilter);
    };
    const [startDateFilter, setStartDateFilter] = useState(null);
    const [endDateFilter, setEndDateFilter] = useState(null);
    const [showDateInputs, setShowDateInputs] = useState(false);

    function getTaskPriorityLabel(taskPriority) {
        const item = statusPriority.find(item => item.value === parseInt(taskPriority));
        return item ? lang[item.label] || '' : '';
    }
    console.log(tasks)
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>
                                <label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2" title={lang["back"]}></i>
                                    {lang["projectprocess"]}: {project.project_name}
                                </label>
                            </h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5>
                                        {lang["listtask"]}
                                    </h5>
                                </div>
                                <div class="ml-auto" title={lang["export task"]} onClick={exportToExcel}>
                                    <i class="fa fa-download pointer icon-ui"></i>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info_list_task">
                                <div class="row column1">
                                    {/* Progresss */}
                                    <div class="table_section padding_infor_info_list_task ">
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
                                            {
                                                (_users.username === projectdetail.manager?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTask">
                                                    <i class="fa fa-plus" title={lang["btn.create"]}></i>
                                                </button>
                                            }
                                        </div>
                                        <div class="table-outer">
                                            <table class="table-head">
                                                <thead>
                                                    <th class="font-weight-bold align-center" style={{ width: "45px", height: "53px" }} scope="col">
                                                        {lang["log.no"]}
                                                    </th>
                                                    <th class="font-weight-bold align-center" scope="col">
                                                        {lang["title.task"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_name: !tableFilter.task_name }) }} />
                                                        {tableFilter.task_name &&
                                                            <div className="position-relative">
                                                                <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px" }}>
                                                                    <FloatingTextBox
                                                                        title={lang["task"]}
                                                                        initialData={taskNameFilter.name}
                                                                        setDataFunction={handleTaskNameFilterChange}
                                                                        destructFunction={() => { setTableFilter({ ...tableFilter, task_name: false }); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                    </th>
                                                    <th class="font-weight-bold align-center position-relative" scope="col">
                                                        {lang["taskstatus"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_status: !tableFilter.task_status }) }} />
                                                        {tableFilter.task_status &&
                                                            <div className="position-relative">
                                                                <div className="position-absolute shadow" style={{ top: 0, left: 0, width: "155px" }}>
                                                                    <CheckList
                                                                        title={lang["taskstatus"]}
                                                                        initialData={statusFilter}
                                                                        setDataFunction={addOrRemoveStatus}
                                                                        data={statusFilterOptions}
                                                                        destructFunction={() => { setTableFilter({ ...tableFilter, task_status: false }); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                    </th>
                                                    <th class="font-weight-bold align-center position-relative" scope="col">
                                                        {lang["task_priority"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_priority: !tableFilter.task_apptask_priorityrove }) }} />
                                                        {tableFilter.task_priority &&
                                                            <div className="position-relative">
                                                                <div className="position-absolute shadow" style={{ top: 0, left: 0, width: "150px" }}>
                                                                    <CheckList
                                                                        title={lang["task_priority"]}
                                                                        initialData={priorityFilter}
                                                                        setDataFunction={addOrRemovePriority}
                                                                        data={priorityFilterOptions}
                                                                        destructFunction={() => { setTableFilter({ ...tableFilter, task_priority: false }); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                    </th>
                                                    <th class="font-weight-bold align-center" scope="col">%
                                                        {lang["complete"]}
                                                    </th>
                                                    <th class="font-weight-bold align-center position-relative" scope="col">
                                                        {lang["confirm"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_approve: !tableFilter.task_approve }) }} />
                                                        {tableFilter.task_approve &&
                                                            <div className="position-relative">
                                                                <div className="position-absolute shadow" style={{ top: 0, left: 0, width: "150px" }}>
                                                                    <CheckList
                                                                        title={lang["confirm"]}
                                                                        initialData={confirmFilter}
                                                                        setDataFunction={addOrRemoveConfirm}
                                                                        data={confirmFilterOptions}
                                                                        destructFunction={() => { setTableFilter({ ...tableFilter, task_approve: false }); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                    </th>
                                                    {/* <th class="font-weight-bold align-center" scope="col" >
                                                        {lang["log.daystart"]}
                                                    </th>
                                                    <th class="font-weight-bold align-center" scope="col" >
                                                        {lang["log.dayend"]}
                                                    </th> */}
                                                    <th className="font-weight-bold align-center">
                                                        {lang["log.daystart"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => setShowStartDateInput(!showStartDateInput)} />
                                                        <FilterableDate
                                                            label="Bắt đầu"
                                                            dateValue={startDateFilter}
                                                            setDateValue={setStartDateFilter}
                                                            iconLabel="Chọn ngày bắt đầu"
                                                            showDateInput={showStartDateInput}
                                                            closePopup={() => setShowStartDateInput(false)}
                                                        />
                                                    </th>
                                                    <th className="font-weight-bold align-center">
                                                        {lang["log.dayend"]}
                                                        <i className="fa fa-filter icon-view block ml-2" onClick={() => setShowEndDateInput(!showEndDateInput)} />
                                                        <FilterableDate
                                                            label="Kết thúc"
                                                            dateValue={endDateFilter}
                                                            setDateValue={setEndDateFilter}
                                                            iconLabel="Chọn ngày kết thúc"
                                                            showDateInput={showEndDateInput}
                                                            closePopup={() => setShowEndDateInput(false)}
                                                        />
                                                    </th>

                                                    <th class="font-weight-bold align-center" scope="col" >
                                                        Timeline
                                                    </th>
                                                    <th class="font-weight-bold align-center" scope="col">
                                                        {lang["log.create_user"]}
                                                    </th>
                                                    <th class="font-weight-bold align-center" scope="col">
                                                        {lang["log.action"]}
                                                    </th>
                                                    <th class="scrollbar-measure"></th>
                                                </thead>
                                            </table>
                                            <div class="table-body">
                                                <table class="table table-striped">
                                                    <tbody>
                                                        {tasks.filter((task) => {
                                                            let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
                                                            let taskName = task && task.task_name ? task.task_name.toLowerCase() : '';
                                                            let filterStatusValues = statusFilter.map(item => item.value);
                                                            let taskStatus = task && task.task_status ? task.task_status : '';
                                                            let filterConfirmValues = confirmFilter.map(item => item.value);
                                                            let taskConfirm = task && task.task_approve ? 1 : 0;
                                                            let filterPriorityValues = priorityFilter.map(item => item.value);
                                                            let taskPriority = task && task.task_priority ? parseInt(task.task_priority) : null;
                                                            let taskStart = new Date(task.start);
                                                            let taskEnd = new Date(task.end);

                                                            return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
                                                                (filterStatusValues.length > 0 ? filterStatusValues.includes(taskStatus) : true) &&
                                                                (filterConfirmValues.length > 0 ? filterConfirmValues.includes(taskConfirm) : true) &&
                                                                (filterPriorityValues.length > 0 ? filterPriorityValues.includes(taskPriority) : true) &&
                                                                (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
                                                                (!endDateFilter || taskEnd <= new Date(endDateFilter));
                                                        }).map((task, index) => (
                                                            <tr key={task.id}>
                                                                <td style={{ width: "40px" }} class="align-center" scope="row">{indexOfFirstMemberTask + index + 1}</td>
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
                                                                <td class="align-center" style={{ width: "135px" }}>
                                                                    <select
                                                                        className="form-control"
                                                                        value={task.task_status}
                                                                        onChange={handleSelectChange}
                                                                        disabled={
                                                                            task.task_approve ||
                                                                            !(_users.username === projectdetail.manager?.username || task.members?.some(member => member.username === _users.username) || (["ad", "uad"].indexOf(auth.role) !== -1))
                                                                        }
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
                                                                <td class="align-center">{getTaskPriorityLabel(task.task_priority)}</td>
                                                                <td class="font-weight-bold">
                                                                    {
                                                                        (_users.username === projectdetail.manager?.username || task.members?.some(member => member.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) ?
                                                                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                                                                <input
                                                                                    type="text"
                                                                                    style={{ textAlign: "center", paddingRight: '20px' }}
                                                                                    className="form-control"
                                                                                    value={getCorespondingValue(task) === '' ? '0' : getCorespondingValue(task)}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || onlyContainsNumbers(value)) {
                                                                                            const normalizedValue = value === '' ? 0 : parseInt(value, 10);
                                                                                            changeProgress(normalizedValue, task);
                                                                                        }
                                                                                    }}
                                                                                    onBlur={() => { blurHandle(task) }}
                                                                                />
                                                                                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
                                                                            </div>
                                                                            :
                                                                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                                                                <input
                                                                                    style={{ textAlign: "center", paddingRight: '20px' }}
                                                                                    className="form-control"
                                                                                    value={getCorespondingValue(task)}
                                                                                    readOnly
                                                                                />
                                                                                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
                                                                            </div>
                                                                    }
                                                                </td>
                                                                <td class="font-weight-bold" style={{ color: getStatusColor(task.task_approve ? 1 : 0), textAlign: "center" }}>
                                                                    {getStatusLabel(task.task_approve ? 1 : 0)}
                                                                </td>
                                                                <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                    {formatDateTask(task.start)}
                                                                </td>
                                                                <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                    {formatDateTask(task.end)}
                                                                </td>
                                                                <td class="font-weight-bold" style={{ textAlign: "center" }}>
                                                                    {formatDateTask(task.timeline)}
                                                                </td>
                                                                <td>
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
                                            </div>
                                        </div>
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
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={task.start} onChange={
                                                                    (e) => { setTask({ ...task, start: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={task.end} onChange={
                                                                    (e) => { setTask({ ...task, end: e.target.value }) }
                                                                } />

                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
                                                                </div>



                                                            </div>
                                                            <div class="form-group col-lg-6"></div>
                                                            <div class="form-group col-lg-6">
                                                                {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>Timeline <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={task.timeline} onChange={
                                                                    (e) => { setTask({ ...task, timeline: e.target.value }) }
                                                                } />

                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
                                                                </div>

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
                                                                <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={updateTaskinfo.start} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, start: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={updateTaskinfo.end} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, end: e.target.value }) }
                                                                } />
                                                                {!errorMessagesadd.checkday ? (
                                                                    <div style={{ minHeight: '20px' }}>
                                                                        {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
                                                                    </div>
                                                                ) : null

                                                                }
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>Timeline <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={updateTaskinfo.timeline} onChange={
                                                                    (e) => { setUpdateTask({ ...updateTaskinfo, timeline: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
                                                                </div>
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
                                                            <div class="form-group col-lg-12">
                                                                <label><b>{lang["description"]}</b></label>
                                                                <span className="d-block"> {taskDetail.task_description} </span>
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
                                                                <span className="d-block"> {formatDate(taskDetail.create_at)} </span>
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
                                                            {/* <div class="form-group col-lg-12">
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
                                                            </div> */}
                                                            <div class="form-group col-lg-12">
                                                                <div class="table-responsive">
                                                                    {
                                                                        taskDetail.members && taskDetail.members.length > 0 ? (
                                                                            <>
                                                                                <table class="table table-striped ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["members"]}</th>
                                                                                            <th class="font-weight-bold" scope="col">{lang["fullname"]}</th>

                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {taskDetail.members.map((member, index) => (
                                                                                            <tr key={member.username}>
                                                                                                <td scope="row">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                                                                <td style={{ minWidth: "100px" }}><img src={proxy + member.avatar} class="img-responsive circle-image-cus" alt="#" /></td>
                                                                                                <td>{member.fullname}</td>


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
                                                                <label><b>Lịch sử</b></label>

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
                                                                            <div class="table-outer">
                                                                                <table class="table-head">
                                                                                    <thead>
                                                                                        <th class="font-weight-bold align-center" style={{ width: "45px", height: "53px" }} scope="col">{lang["log.no"]}</th>
                                                                                        <th class="font-weight-bold align-center" scope="col">{lang["modify_what"]}</th>
                                                                                        <th class="font-weight-bold align-center" scope="col">{lang["oldvalue"]}</th>
                                                                                        <th class="font-weight-bold align-center" scope="col">{lang["newvalue"]}</th>
                                                                                        <th class="font-weight-bold align-center" scope="col">{lang["time"]}</th>
                                                                                        <th class="font-weight-bold align-center" scope="col">{lang["user change"]}</th>
                                                                                        <th class="scrollbar-measure"></th>
                                                                                    </thead>
                                                                                </table>
                                                                                <div class="table-body">
                                                                                    <table class="table table-striped">
                                                                                        <tbody>
                                                                                            {taskDetail.history.reverse().map((task, index) => (
                                                                                                <tr key={task.id}>
                                                                                                    <td scope="row" style={{ width: "50px" }}>{index + 1}</td>
                                                                                                    <td scope="row">
                                                                                                        {task.modified_what === "approve" ? lang["confirm"] :
                                                                                                            task.modified_what === "infor" ? lang["log.information"] :
                                                                                                                task.modified_what === "status" ? lang["taskstatus"] :
                                                                                                                    task.modified_what}
                                                                                                    </td>
                                                                                                    <td scope="row">
                                                                                                        {
                                                                                                            task.old_value === true ? lang["approved"] :
                                                                                                                task.old_value === false ? lang["await"] :
                                                                                                                    !isNaN(task.old_value) ?
                                                                                                                        lang[`${(statusTaskView.find((s) => s.value === Number(task.old_value)) || {}).label || 'Trạng thái không xác định'}`]
                                                                                                                        :
                                                                                                                        // `${task.old_value.slice(0, 100)}${task.old_value.length > 100 ? '...' : ''}`
                                                                                                                        `${task.old_value}`

                                                                                                        }
                                                                                                    </td>
                                                                                                    <td scope="row">
                                                                                                        {
                                                                                                            task.new_value === true ? lang["approved"] :
                                                                                                                task.new_value === false ? lang["await"] :
                                                                                                                    !isNaN(task.new_value) ?
                                                                                                                        lang[`${(statusTaskView.find((s) => s.value === Number(task.new_value)) || {}).label || 'Trạng thái không xác định'}`]
                                                                                                                        :
                                                                                                                        `${task.new_value}`
                                                                                                            // `${task.new_value.slice(0, 100)}${task.new_value.length > 100 ? '...' : ''}`
                                                                                                        }
                                                                                                    </td>

                                                                                                    <td scope="row">{formatDate(task.modified_at)}</td>
                                                                                                    <td scope="row">
                                                                                                        <img class="img-responsive circle-image-cus" src={proxy + task.modified_by?.avatar} />
                                                                                                        {task.modified_by?.fullname}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div class="list_cont ">
                                                                            <p>Chưa có lịch sử</p>
                                                                        </div>
                                                                    )
                                                                }

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
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5>
                                        {lang["timeline"]}
                                    </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info_gantt_chart">
                                <div class="row column1">
                                    {/* Gantt */}
                                    <div class="table_section padding_infor_info_gantt_chart">
                                        {
                                            filteredTasks && filteredTasks.length > 0 ? (
                                                <Gantt data={
                                                    filteredTasks.filter((task) => {
                                                        let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
                                                        let taskName = task && task.task_name ? task.task_name.toLowerCase() : '';
                                                        let filterStatusValues = statusFilter.map(item => item.value);
                                                        let taskStatus = task && task.task_status ? task.task_status : '';
                                                        let filterConfirmValues = confirmFilter.map(item => item.value);
                                                        let taskConfirm = task && task.task_approve ? 1 : 0;
                                                        let filterPriorityValues = priorityFilter.map(item => item.value);
                                                        let taskPriority = task && task.task_priority ? parseInt(task.task_priority) : null;
                                                        let taskStart = new Date(task.start);
                                                        let taskEnd = new Date(task.end);

                                                        return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
                                                            (filterStatusValues.length > 0 ? filterStatusValues.includes(taskStatus) : true) &&
                                                            (filterConfirmValues.length > 0 ? filterConfirmValues.includes(taskConfirm) : true) &&
                                                            (filterPriorityValues.length > 0 ? filterPriorityValues.includes(taskPriority) : true) &&
                                                            (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
                                                            (!endDateFilter || taskEnd <= new Date(endDateFilter));
                                                    })} project={projectdetail} data_raw={filteredTasks} />              //// Sử dụng dữ liệu đã lọc để hiển thị gantt
                                            ) : null
                                        }
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

