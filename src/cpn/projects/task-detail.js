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
import Stage from "./stage"
import GanttTest from "./gantt-test"
import TableScroll from "./table-test-scroll"

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
    // console.log(projectdetail)




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

    const [stage, setStage] = useState([]);
    // console.log(stage)
    const [stageData, setStageData] = useState([]);
    // console.log(stageData)
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
                // console.log(resp)
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
    useEffect(() => {
        fetch(`${proxy}/projects/project/${project_id}/periods`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(166,resp)
                if (success) {
                    if (data && data.length > 0) {
                        setStageData(data)

                    }
                }
            })
    }, [])

    //    console.log(stageData)
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

    const submitAddStage = (e) => {
        e.preventDefault();
        stage.members = selectedMemberTask.map(user => user.username);
        const errors = {};
        if (!stage.stage_name) {
            errors.stage_name = lang["error.stagename"];
        }
        if (!stage.stage_start) {
            errors.stage_start = lang["error.start"];
        }
        if (!stage.stage_end) {
            errors.stage_end = lang["error.end"];
        }
        if (new Date(stage.stage_start) > new Date(stage.stage_end)) {
            errors.checkday = lang["error.checkday_end"];
        }




        if (!stage.members || stage.members.length === 0) {
            errors.members = lang["error.members_stage"];
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }

        const requestBody = {
            project_id: parseInt(project_id),
            period: {
                period_name: stage.stage_name,
                start: stage.stage_start,
                end: stage.stage_end,
                members: stage.members,
            }

        }
        // console.log(requestBody)

        fetch(`${proxy}/projects/periods`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
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
        // console.log(errors)

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
    // console.log(tasks)
    // console.log(project)

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

    // const exportToExcel = () => {
    //     const workbook = XLSX.utils.book_new();

    //     stageData.forEach((period) => {
    //         const ws_data = [
    //             ['ID', 'Tên công việc', 'Mức độ ưu tiên', '% Hoàn thành', 'Xác nhận', 'Ngày bắt đầu', 'Ngày kết thúc','Timeline', 'Người thực hiện'], 
    //             [period.period_id, period.period_name, , period.progress, , period.start, period.end, period.timeline,  period.period_members.map(member => member.fullname).join(', ')],
    //         ];


    //         // Thêm dữ liệu về tasks

    //         period.tasks.forEach((task) => {
    //             ws_data.push([task.task_id, task.task_name, task.start, task.end, task.progress]);

    //             // Thêm dữ liệu về child tasks

    //             task.child_tasks.forEach((childTask) => {
    //                 ws_data.push([childTask.child_task_id, childTask.child_task_name, childTask.start, childTask.end, childTask.progress]);
    //             });
    //         });

    //         const ws = XLSX.utils.aoa_to_sheet(ws_data);
    //         XLSX.utils.book_append_sheet(workbook, ws, period.period_name);
    //     });

    //     // Xuất file Excel
    //     XLSX.writeFile(workbook, 'project-data.xlsx');
    // };
    // console.log(stageData)
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const projectTasks = project.tasks;


        const dataExport = project

        const projectName = project.project_name
        const projectMaster = project.manager.fullname;
        const now = new Date();
        const date = now.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const header = ['ID', 'Tên công việc', 'Mức độ ưu tiên', '% Hoàn thành', 'Xác nhận', 'Ngày bắt đầu (dd/MM/yyyy)', 'Ngày kết thúc (dd/MM/yyyy)', 'Timeline', 'Người thực hiện'];
        stageData.forEach((period, periodIndex) => {
            const ws_data = [
                // Header Information
                [`DANH SÁCH CÁC CÔNG VIỆC CỦA DỰ ÁN ${projectName}`, , , ,],
                [`Trưởng dự án: ${projectMaster}`, "", "", "", "", "", `Nhân viên xuất: ${auth?.fullname}`, "", ""],
                [`Ngày xuất (dd/MM/yyyy): ${date}`, "", "", "", "", "", "", "", "", "", ""],
                [`Tên giai đoạn: ${period.period_name}`, "", "", "", "", "", "", "", "", "", ""],
                [`Thời gian thực hiện: ${functions.formatDateTask(period.start)} - ${functions.formatDateTask(period.end)}`, "", "", "", "", "", "", "", "", "", ""],
                header,
                // ... (the rest of your data)
            ];



            const taskGroupings = [];
            period.tasks.forEach((task, taskIndex) => {
                const startRow = ws_data.length;
                ws_data.push([

                    // taskIndex + 1,
                    task.task_id,
                    task.task_name,
                    getTaskPriorityLabel(task.task_priority),
                    `${task.progress}%`,
                    task.task_approve ? "Đã xác nhận" : "Chưa xác nhận",
                    functions.formatDateTask(task.start),
                    functions.formatDateTask(task.end),
                    functions.formatDateTask(task.timeline),
                    task.members.map(member => member.fullname).join(', '),
                ]);

                task.child_tasks.forEach((childTask, childIndex) => {
                    ws_data.push([
                        // childIndex + 1,
                        childTask.child_task_id,
                        childTask.child_task_name,
                        getTaskPriorityLabel(childTask.priority),
                        `${childTask.progress}%`,
                        childTask.task_approve ? "Đã xác nhận" : "Chưa xác nhận",
                        functions.formatDateTask(childTask.start),
                        functions.formatDateTask(childTask.end),
                        functions.formatDateTask(childTask.timeline),
                        childTask.members.map(member => member.fullname).join(', '),

                    ]);
                });

                const endRow = ws_data.length - 1;
                if (startRow < endRow) {
                    taskGroupings.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
                }
            });

            const ws = XLSX.utils.aoa_to_sheet(ws_data);

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

            ws["!cols"] = [{ width: 6 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
            ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
            ws["A1"].s = titleStyle;
            ws["A2"].s = athurStyle;
            ws["A4"].s = athurStyle;
            ws["A5"].s = athurStyle;
            ws["B4"].s = athurStyle;

            ws["B2"].s = athurStyle;
            ws["C4"].s = athurStyle;
            ws["D4"].s = athurStyle;
            ws["E4"].s = athurStyle;
            ws["F4"].s = athurStyle;
            ws["G4"].s = athurStyle;
            ws["H4"].s = athurStyle;
            ws["I4"].s = athurStyle;

            ws["C5"].s = athurStyle;
            ws["D5"].s = athurStyle;
            ws["E5"].s = athurStyle;
            ws["F5"].s = athurStyle;
            ws["G5"].s = athurStyle;
            ws["H5"].s = athurStyle;
            ws["I5"].s = athurStyle;

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



            ws["A6"].s = headerStyle;
            ws["B6"].s = headerStyle;
            ws["C6"].s = headerStyle;
            ws["D6"].s = headerStyle;
            ws["E6"].s = headerStyle;
            ws["F6"].s = headerStyle;
            ws["G6"].s = headerStyle;
            ws["H6"].s = headerStyle;
            ws["I6"].s = headerStyle;


            const bodyStyle = {
                font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border: borderStyle
            };
            

            for (let i = 0; i < stageData.length; i++) {
                for (let j = 0; j < stageData[i].length; j++) {
                    const cellAddress = `${String.fromCharCode(65 + j)}${5 + i}`;

                    if (!ws[cellAddress]) {
                        ws[cellAddress] = { t: 's', v: stageData[i][j] ?? "" };
                    }

                    if (j === 0) {
                        ws[cellAddress].s = centerStyle;
                    } else {
                        ws[cellAddress].s = bodyStyle;
                    }
                }
            }


            ws["!merges"] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },//ghép từ ô tại hàng 0, cột 0 đến ô tại hàng 0, cột 11.
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
                { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
                { s: { r: 1, c: 6 }, e: { r: 1, c: 8 } },


            ];


            XLSX.utils.book_append_sheet(workbook, ws, period.period_name.substring(0, 31));
            // Thêm nhóm vào trang tính
            if (!ws['!rows']) ws['!rows'] = [];
            taskGroupings.forEach(group => {
                for (let r = group.s.r; r <= group.e.r; ++r) {
                    if (!ws['!rows'][r]) ws['!rows'][r] = {};
                    ws['!rows'][r].level = 1;
                }
            });

            ws['!outline'] = { summaryBelow: true };

        });

        // Xuất file Excel
        const projectCode = project.project_code;
        XLSX.writeFile(workbook, `Project-${projectCode}-${projectName}-${(new Date()).getTime()}.xlsx`);

    };

    const exportToExcelBK = () => {
        // console.log(project)

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
            let daystart = functions.ormatDateTask(task.start)
            let dayend = functions.formatDateTask(task.end)
            let timeline = functions.formatDateTask(task.timeline)
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

    // console.log(tasks)

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
                        <div class="white_shd full">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5>
                                        {lang["listtask"]}
                                    </h5>

                                </div>
                                {/* <div class="ml-auto">
                                    <select
                                        class="form-control ml-4 pointer">
                                        <option>Giai đoạn 1</option>
                                        <option>Giai đoạn 2</option>
                                    </select>
                                </div> */}
                                {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addStage">
                                    <i class="fa fa-plus" title={lang["btn.create"]}></i>
                                </button> */}
                                
                                <div class= "ml-auto">
                                    <span className="status-label d-block " style={{
                                        backgroundColor: (statusProject.find((s) => s.value === projectdetail.project_status) || {}).color,
                                        whiteSpace: "nowrap"
                                    }}>
                                        {lang[`${(statusProject.find((s) => s.value === projectdetail.project_status) || {}).label || 'Trạng thái không xác định'}`]}
                                    </span>
                                </div>
                                {
                                    stageData && stageData.length > 0 ? (
                                        <div class="ml-2 mt-1" title={lang["export task"]} onClick={exportToExcel}>
                                            <i class="fa fa-download size-32 pointer icon-ui"></i>
                                        </div>
                                    ) : null
                                }

                            </div>
                            <div class="table_section padding_infor_info_list_task">
                                <div class="row column1">
                                    {/* Add Stage */}
                                    <div class={`modal ${showModal ? 'show' : ''}`} id="addStage">
                                        <div class="modal-dialog modal-dialog-center">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">{lang["addstage"]}</h4>
                                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="row">
                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["stagename"]} <span className='red_star'>*</span></label>
                                                                <input type="text" class="form-control" value={task.stage_name} onChange={
                                                                    (e) => { setStage({ ...stage, stage_name: e.target.value }) }
                                                                } placeholder={lang["p.stagename"]} />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.stage_name && <span class="error-message">{errorMessagesadd.stage_name}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={stage.stage_start} onChange={
                                                                    (e) => { setStage({ ...stage, stage_start: e.target.value }) }
                                                                } />
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.stage_start && <span class="error-message">{errorMessagesadd.stage_start}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                                                <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={stage.stage_end} onChange={
                                                                    (e) => { setStage({ ...stage, stage_end: e.target.value }) }
                                                                } />

                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.stage_end && <span class="error-message">{errorMessagesadd.stage_end}</span>}
                                                                </div>
                                                            </div>
                                                            <div class="col-md-12">
                                                                <div style={{ minHeight: '20px' }}>
                                                                    {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
                                                                </div>
                                                            </div>
                                                            <div class="form-group col-lg-12">
                                                                <label>{lang["taskmember"]} <span className='red_star'>*</span></label>
                                                                {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                                                <div class="user-checkbox-container">
                                                                    {projectdetail.members?.map((user, index) => (
                                                                        <div key={index} class="user-checkbox-item">
                                                                            <label class="pointer">
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
                                                    <button type="button" onClick={submitAddStage} class="btn btn-success ">{lang["btn.create"]}</button>
                                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Stage */}
                                    {/* <TableScroll /> */}
                                    {/* Progresss */}
                                    <div class="table_section padding_infor_info_list_task ">
                                        <div className="d-flex">

                                            <span class="skill mt-0" style={{ width: `100%` }}><span class="info_valume">{process.progress}%</span></span>
                                        </div>
                                        <div class="progress skill-bar ">
                                            <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow={process.progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${process.progress}%` }}>
                                            </div>
                                        </div>
                                       
                                        < Stage data={stageData} members={projectdetail} />
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
                                                                <input type="date" min={task.start} max={task.end} className="form-control" value={task.timeline} onChange={
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
                                                                <input type="date" min={updateTaskinfo.start} max={updateTaskinfo.end} className="form-control" value={updateTaskinfo.timeline} onChange={
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
                    {/* <GanttTest data={stageData} /> */}
                    {/*  */}
                </div>
            </div >
        </div >
    )
}

