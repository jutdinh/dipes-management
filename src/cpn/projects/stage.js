import { da } from 'date-fns/locale';
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { StatusEnum, StatusTask, StatusAprove } from '../enum/status';
import GanttTest from "./gantt-test"
import FloatingTextBox from '../common/floatingTextBox';
import CheckList from '../common/checkList';
import FilterableDate from '../common/searchDate';

const Stage = (props) => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const { project_id, version_id } = useParams();
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser)
    const { removeVietnameseTones } = functions
    const [expandedTasks, setExpandedTasks] = useState({});
    const [expandedSubsubtasks, setExpandedSubsubtasks] = useState({});

    const [dataGantt, setGanttData] = useState([]);
    const [errorMessagesadd, setErrorMessagesadd] = useState({});

    const [dataStageUpdate, setDataStageUpdate] = useState([])
    const [periodId, setPeriodId] = useState(null)
    const [taskId, setTaskId] = useState(null)

    const [task, setTask] = useState({ task_status: 1 });
    const [taskUpdate, setTaskUpadte] = useState({});
    const [taskChild, setTaskChild] = useState({ child_task_status: 1 });

    const [dataViewDetail, setDataViewDetail] = useState({})
    const [taskUpdateChild, setTaskUpadteChild] = useState({});
    const [formData, setFormData] = useState({});
    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const handleCloseModal = () => {
        setErrorMessagesadd({})
    };
    console.log(props)
    const dataTask = props.data
    const membersProject = props.members.members
    const manageProject = props.manager
    console.log(dataTask)
    //drop
    // console.log(props.data.period_members)
    const [containerWidth, setContainerWidth] = useState('90%');
    const [isResizing, setIsResizing] = useState(false);



    const containerRef = useRef(null);
    const scrollRef1 = useRef(null);
    const scrollRef2 = useRef(null);
    useEffect(() => {
        containerRef.current = scrollRef1.current;
    }, []);
    const handleScroll = (ref1, ref2) => {
        return () => {
            if (ref1.current && ref2.current) {
                ref2.current.scrollTop = ref1.current.scrollTop;
            }
        };
    };
    const handleMouseDown = useCallback(() => {
        setIsResizing(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    const handleMouseMove = useCallback(
        (e) => {
            if (isResizing && containerRef.current) {
                const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
                setContainerWidth(newWidth + 'px');
            }
        },
        [isResizing]
    );
    const [columnWidths, setColumnWidths] = useState({
        col1: 100,
        col2: 100,
        // ... (thêm cho các cột khác)
    });



    useEffect(() => {
        let isDown = false;
        let startX;
        let scrollLeft;

        const containerElement = scrollRef2.current;
        let svgElement;

        if (containerElement) {
            svgElement = containerElement.querySelector('svg');
        }

        const onMouseDown = (e) => {
            isDown = true;
            svgElement.classList.add('active');
            startX = e.pageX - svgElement.getBoundingClientRect().left;
            scrollLeft = svgElement.scrollLeft;
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - svgElement.getBoundingClientRect().left;
            const walk = (x - startX);
            svgElement.scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
            isDown = false;
            svgElement.classList.remove('active');
        };

        const onMouseLeave = () => {
            isDown = false;
            svgElement.classList.remove('active');
        };

        if (svgElement) {
            svgElement.addEventListener('mousedown', onMouseDown);
            svgElement.addEventListener('mousemove', onMouseMove);
            svgElement.addEventListener('mouseup', onMouseUp);
            svgElement.addEventListener('mouseleave', onMouseLeave);
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mousedown', onMouseDown);
                svgElement.removeEventListener('mousemove', onMouseMove);
                svgElement.removeEventListener('mouseup', onMouseUp);
                svgElement.removeEventListener('mouseleave', onMouseLeave);
            }
        };
    }, []);





    const handleColumnResizeMouseDown = (colIndex) => (e) => {
        e.preventDefault();

        let pageX = e.pageX;

        const handleMouseMove = (e) => {
            const offsetX = e.pageX - pageX;
            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [`col${colIndex}`]: prevWidths[`col${colIndex}`] + offsetX,
            }));
            pageX = e.pageX;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    useEffect(() => {
        // Khi component được mount, lấy trạng thái từ localStorage và đặt vào state
        const savedExpandedTasks = JSON.parse(localStorage.getItem('expandedTasks')) || {};
        const savedExpandedSubsubtasks = JSON.parse(localStorage.getItem('expandedSubsubtasks')) || {};

        setExpandedTasks(savedExpandedTasks);
        setExpandedSubsubtasks(savedExpandedSubsubtasks);
    }, []);

    // const handleToggle = (taskId) => {
    //     const newExpandedTasks = { ...expandedTasks };
    //     newExpandedTasks[taskId] = !newExpandedTasks[taskId];
    //     setExpandedTasks(newExpandedTasks);

    // };
    // const handleSubsubtaskToggle = (childTaskId) => {
    //     const newExpandedSubsubtasks = { ...expandedSubsubtasks };
    //     newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];
    //     setExpandedSubsubtasks(newExpandedSubsubtasks);
    // };
    const handleToggle = (taskId) => {
        const newExpandedTasks = { ...expandedTasks };
        newExpandedTasks[taskId] = !newExpandedTasks[taskId];

        // Lưu trạng thái mới vào localStorage
        localStorage.setItem('expandedTasks', JSON.stringify(newExpandedTasks));

        setExpandedTasks(newExpandedTasks);
    };

    const handleSubsubtaskToggle = (childTaskId) => {
        const newExpandedSubsubtasks = { ...expandedSubsubtasks };
        newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];

        // Lưu trạng thái mới vào localStorage
        localStorage.setItem('expandedSubsubtasks', JSON.stringify(newExpandedSubsubtasks));

        setExpandedSubsubtasks(newExpandedSubsubtasks);
    };
    const statusTask = [
        StatusAprove.APROVE,
        StatusAprove.NOTAPROVE
    ]
    const getStatusLabel = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);

        return status ? lang[status.label] : 'N/A';
    };

    const getStatusColor = (statusId) => {
        const status = statusTask.find(st => st.id === statusId);

        return status ? status.color : 'N/A';
    };

    useEffect(() => {
        const newGanttData = dataTask.map(period => {
            const tasks = expandedTasks[period.period_id]
                ? period.tasks.map(task => {
                    const child_tasks = expandedTasks[period.period_id] && expandedSubsubtasks[task.task_id]
                        ? task.child_tasks.map(child_task => {
                            return {
                                ...child_task,
                                child_tasks: expandedSubsubtasks[child_task.child_task_id] ? child_task.child_tasks : []
                            };
                        })
                        : [];
                    return { ...task, child_tasks };
                })
                : [];
            return { ...period, tasks };
        });

        setGanttData(newGanttData);
    }, [dataTask, expandedTasks, expandedSubsubtasks, expandedTasks]);


    console.log(173, selectedUsernames)


    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]
    function getTaskPriorityLabel(taskPriority) {
        const item = statusPriority.find(item => item.value === parseInt(taskPriority));
        return item ? lang[item.label] || '' : '';
    }
    const getIdStage = (stage) => {
        setDataStageUpdate(stage);
    }

    const getPeriodId = (taskId, periodId) => {

        setPeriodId(periodId);
        setTaskId(taskId)

    };


    const getPeriodId_addTask = (taskId) => {

        setPeriodId(taskId.period_id);
    };
    //viewdetal
    const getDataViewDetail = (taskId, periodId) => {
        setDataViewDetail(taskId)


    };
    console.log(dataViewDetail)
    //info update task
    const getInfoTask = (taskId, periodId) => {
        setTaskId(taskId.task_id)
        setTaskUpadte(taskId)
        setPeriodId(periodId)

    };
    //info update task
    const getInfoTaskChild = (subtask, taskId, periodId) => {
        setTaskUpadteChild(subtask)
        setTaskId(taskId)
        setPeriodId(periodId);

    };


    useEffect(() => {
        if (dataStageUpdate.period_id) {
            const newSelectedUsernames = dataTask.find(period => period.period_id === dataStageUpdate.period_id)?.period_members.map(member => member.username) || [];
            setSelectedUsernames(newSelectedUsernames);

            setFormData({
                stage_name: dataStageUpdate.period_name,
                stage_start: dataStageUpdate.start,
                stage_end: dataStageUpdate.end,
            });
        }
    }, [dataStageUpdate]);

    const handleCheckboxChange = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsernames(prevState => [...prevState, user.username]);
        } else {
            setSelectedUsernames(prevState => prevState.filter(username => username !== user.username));
        }
    };


    useEffect(() => {
        // Dùng để load danh sách username của các thành viên trong task hiện tại
        if (taskUpdate && taskUpdate.members) {
            const initialSelectedUsernames = taskUpdate.members.map(member => member.username);
            setSelectedUsernames(initialSelectedUsernames);
        }
    }, [taskUpdate]);
    useEffect(() => {
        // Dùng để load danh sách username của các thành viên trong task child hiện tại
        if (taskUpdateChild && taskUpdateChild.members) {
            const initialSelectedUsernames = taskUpdateChild.members.map(member => member.username);
            setSelectedUsernames(initialSelectedUsernames);
        }
    }, [taskUpdateChild]);

    const updateStage = (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.stage_name) {
            errors.stage_name = lang["error.stagename"];
        }
        if (!formData.stage_start) {
            errors.stage_start = lang["error.start"];
        }
        if (!formData.stage_end) {
            errors.stage_end = lang["error.end"];
        }
        if (new Date(formData.stage_start) > new Date(formData.stage_end)) {
            errors.checkday = lang["error.checkday_end"];
        }




        // if (!selectedUsernames || selectedUsernames.length === 0) {
        //     errors.members = lang["error.members"];
        // }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }
        const requestBody = {
            period: {
                period_name: formData.stage_name,
                start: formData.stage_start,
                end: formData.stage_end,
                members: selectedUsernames
            }
        }
        // console.log(requestBody)
        fetch(`${proxy}/projects/project/${project_id}/period/${dataStageUpdate.period_id}`, {
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
                console.log(resp)
                if (success) {
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            })

    };
    const handleDeleteStage = (stageId) => {


        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.stage"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/projects/project/${project_id}/period/${stageId.period_id}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status);
                    });
            }
        });
    }


    const submitAddTask = (e) => {
        e.preventDefault();
        task.members = selectedUsernames;
        const requestBody = {
            period_id: periodId,

            task: task

        }
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
        // if (!task.members || task.members.length === 0) {
        //     errors.members = lang["error.members"];
        // }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }
        console.log(requestBody)

        fetch(`${proxy}/projects/project/${project_id}/task`, {
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
    };
    const updateTask = (e) => {
        e.preventDefault();
        taskUpdate.members = selectedUsernames;

        const requestBody = {

            task: taskUpdate
        }
        const errors = {};
        if (!taskUpdate.task_name) {
            errors.task_name = lang["error.taskname"];
        }
        if (!taskUpdate.task_priority) {
            errors.task_priority = lang["error.task_priority"];
        }
        if (!taskUpdate.start) {
            errors.start = lang["error.start"];
        }
        if (!taskUpdate.end) {
            errors.end = lang["error.end"];
        }
        if (new Date(taskUpdate.start) > new Date(taskUpdate.end)) {
            errors.checkday = lang["error.checkday_end"];
        }

        if (new Date(taskUpdate.start) > new Date(taskUpdate.timeline) || new Date(taskUpdate.timeline) > new Date(taskUpdate.end)) {
            errors.checkday_timeline = lang["error.checkday_timeline"];
        }
        if (!taskUpdate.task_description) {
            errors.task_description = lang["error.task_description"];
        }
        // if (!task.members || task.members.length === 0) {
        //     errors.members = lang["error.members"];
        // }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }
        console.log(requestBody)
        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskUpdate.task_id}`, {
            method: "PUT",
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
    };
    const handleDeleteTask = (taskId, periodId) => {


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
                fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId.task_id}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status);
                    });
            }
        });
    }
    const handleConfirmTask = (task, periodId) => {
        console.log(task)
        const newTaskApproveStatus = !task.task_approve;
        const requestBody = {
            task: {
                task_approve: newTaskApproveStatus
            }
        };
        // console.log(requestBody)
        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${task.task_id}/approve`, {
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
                // console.log(resp)
                if (success) {
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            });
    }



    const submitAddTaskChild = (e) => {
        e.preventDefault();
        taskChild.members = selectedUsernames;
        const requestBody = {
            child_task: taskChild
        }
        console.log(requestBody)
        const errors = {};
        if (!taskChild.child_task_name) {
            errors.child_task_name = lang["error.taskname"];
        }
        if (!taskChild.priority) {
            errors.priority = lang["error.task_priority"];
        }
        if (!taskChild.start) {
            errors.start = lang["error.start"];
        }
        if (!taskChild.end) {
            errors.end = lang["error.end"];
        }
        if (new Date(taskChild.start) > new Date(taskChild.end)) {
            errors.checkday = lang["error.checkday_end"];
        }

        if (new Date(taskChild.start) > new Date(taskChild.timeline) || new Date(taskChild.timeline) > new Date(taskChild.end)) {
            errors.checkday_timeline = lang["error.checkday_timeline"];
        }
        if (!taskChild.child_task_description) {
            errors.child_task_description = lang["error.task_description"];
        }
        // if (!task.members || task.members.length === 0) {
        //     errors.members = lang["error.members"];
        // }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }
        console.log(requestBody)

        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
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
                    console.log(resp)
                    if (success) {
                        functions.showApiResponseMessage(status);
                    } else {
                        functions.showApiResponseMessage(status);
                    }
                }
            })
    };
    // console.log(selectedUsernames)

    const updateTaskChild = (dataUpdate, useDataUpdate = false) => {
        console.log(dataUpdate)
        if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
            const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
            setSelectedUsernames(initialSelectedUsernames);
        }

        taskUpdateChild.members = selectedUsernames;

        dataUpdate.members = selectedUsernames;
        console.log(dataUpdate)


        const currentTask = useDataUpdate ? dataUpdate : taskUpdateChild;
        const requestBody = {
            child_task: currentTask,
        };
        const errors = {};
        if (!currentTask.child_task_name) {
            errors.task_name = lang["error.taskname"];
        }
        if (!currentTask.priority) {
            errors.task_priority = lang["error.task_priority"];
        }
        if (!currentTask.start) {
            errors.start = lang["error.start"];
        }
        if (!currentTask.end) {
            errors.end = lang["error.end"];
        }
        if (new Date(currentTask.start) > new Date(currentTask.end)) {
            errors.checkday = lang["error.checkday_end"];
        }

        if (new Date(currentTask.start) > new Date(currentTask.timeline) || new Date(currentTask.timeline) > new Date(currentTask.end)) {
            errors.checkday_timeline = lang["error.checkday_timeline"];
        }
        if (!currentTask.child_task_description) {
            errors.task_description = lang["error.task_description"];
        }
        // if (!task.members || task.members.length === 0) {
        //     errors.members = lang["error.members"];
        // }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }
        console.log(requestBody)

        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${currentTask.child_task_id}`, {
            method: "PUT",
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
    };
    const handleConfirmTaskChild = (subtask, taskId, periodId,) => {

        const newTaskApproveStatus = !subtask.approve;

        const requestBody = {
            child_task: {
                approve: newTaskApproveStatus
            },
        };
        console.log(requestBody)

        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${subtask.child_task_id}/approve`, {
            method: "PUT",
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
    const [progressValues, setProgressValues] = useState({});
    console.log(progressValues)
    const handleProgressBlur = (e, subsubtask, taskId, periodId, uniqueId) => {

        updateTaskChild({
            ...subsubtask,
            progress: progressValues[uniqueId] || subsubtask.progress,
        }, true);
    };

    const handleProgressChange = (normalizedValue, subsubtask, taskId, periodId, uniqueId) => {
        setProgressValues(prevState => ({
            ...prevState,
            [uniqueId]: normalizedValue,
        }));
        setTaskId(taskId);
        setPeriodId(periodId);
    };

    const handleProgressFocus = (childTask) => {
        const members = childTask.members ? childTask.members : []

        const usernames = members.map(mem => mem.username)
        setSelectedUsernames(usernames)
    }


    function onlyContainsNumbers(inputString) {
        const value = parseInt(inputString, 10);
        return !isNaN(value) && value >= 0 && value <= 100;
    }
    function formatPercentage(value) {
        let num = parseFloat(value);
        num = Math.max(0, Math.min(num, 100));
        return num.toFixed(2) + '%';
    }
    useEffect(() => {
        const initialProgressValues = {};

        // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
        dataTask.forEach((task, taskIndex) => {
            task.tasks?.forEach((subtask, subtaskIndex) => {
                subtask.child_tasks?.forEach((subsubtask, subsubtaskIndex) => {
                    const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${subsubtaskIndex}`;
                    initialProgressValues[uniqueId] = subsubtask.progress;
                });
            });
        });

        setProgressValues(initialProgressValues);
    }, [dataTask]);


    const handleDeleteTaskChild = (subsubtask, taskId, periodId) => {


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
                fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${subsubtask.child_task_id}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status);
                    });
            }
        });
    }

    // console.log(selectedUsernames)
    // console.log(formData)
    // lọc để set điều kiện chọn ngày 
    const currentPeriod = dataTask.find(period => period.period_id === periodId) || [];
    const currentTask = dataTask?.flatMap((period) => period.tasks)?.find((task) => task.task_id === taskId) || [];

    // console.log(currentPeriod)
    // console.log(currentTask)
    //filter
    const [tableFilter, setTableFilter] = useState({ task_name: false });
    const handleTaskNameFilterChange = (e) => {
        setTaskNameFilter({ name: e.target.value });
    }
    // State để lưu giá trị lọc
    const [taskNameFilter, setTaskNameFilter] = useState("");
    const resetTaskNameFilter = () => {
        setTaskNameFilter({ name: "" });
    }
    const [showStartDateInput, setShowStartDateInput] = useState(false);
    const [showEndDateInput, setShowEndDateInput] = useState(false);

    const [startDateFilter, setStartDateFilter] = useState(null);
    const [endDateFilter, setEndDateFilter] = useState(null);

    return (
        <>
            <div style={{ display: 'flex', width: '100%', height: "89%", minHeight: "30%", overflowY: 'auto' }} class="no-select" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>

                <div
                    // ref={containerRef}
                    ref={scrollRef1}
                    onScroll={handleScroll(scrollRef1, scrollRef2)}
                    style={{ flex: '0 0 auto', width: containerWidth, border: '1px solid gray', maxWidth: '100%', height: "80%", overflowX: 'auto' }}>

                    <table className="table fix-layout-header-table" style={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ height: "60px" }}>

                                {/* <th style={{ width: `${columnWidths.col1}px`, position: 'relative' }}> */}
                                <th style={{ minWidth: `45px`, maxWidth: `45px`, minHeight: "37px", maxHeight: "37px", position: 'relative' }}>
                                    <div
                                        style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
                                        onMouseDown={handleColumnResizeMouseDown(1)}
                                    />
                                </th>
                                {/* <th style={{ width: `${columnWidths.col2}px`, position: 'relative' }} class="font-weight-bold align-center"># */}
                                <th style={{ minWidth: `85px`, maxWidth: `85px`, position: 'relative' }} class="font-weight-bold align-center">#
                                    <div
                                        style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
                                        onMouseDown={handleColumnResizeMouseDown(2)}
                                    />
                                </th>
                                <th class="font-weight-bold" style={{ minWidth: `400px`, maxWidth: `400px` }}>
                                    {lang["title.task"]}
                                    <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_name: !tableFilter.task_name }) }} />
                                    {tableFilter.task_name &&
                                        <div className="position-relative">
                                            <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px" }}>
                                                <FloatingTextBox
                                                    title={lang["title.task"]}
                                                    initialData={taskNameFilter.name}
                                                    setDataFunction={handleTaskNameFilterChange}
                                                    destructFunction={() => { setTableFilter({ ...tableFilter, task_name: false }); }}
                                                />
                                            </div>
                                        </div>
                                    }
                                </th>
                                <th class="font-weight-bold">
                                    {lang["task_priority"]}
                                </th>
                                <th class="font-weight-bold" style={{ width: `80px` }}>%{lang["complete"]}</th>
                                <th class="font-weight-bold align-center position-relative" scope="col">
                                    {lang["confirm"]}
                                    {/* <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_approve: !tableFilter.task_approve }) }} /> */}
                                    {/* {tableFilter.task_approve &&
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
                                } */}
                                </th>
                                <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
                                    {lang["log.daystart"]}
                                    <i className="fa fa-filter icon-view block ml-2" onClick={() => setShowStartDateInput(!showStartDateInput)} />
                                    <FilterableDate
                                        label={lang["log.daystart"]}
                                        dateValue={startDateFilter}
                                        setDateValue={setStartDateFilter}
                                        iconLabel="Chọn ngày bắt đầu"
                                        showDateInput={showStartDateInput}
                                        closePopup={() => setShowStartDateInput(false)}
                                    />
                                </th>
                                <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
                                    {lang["log.dayend"]}
                                    <i className="fa fa-filter icon-view block ml-2" onClick={() => setShowEndDateInput(!showEndDateInput)} />
                                    <FilterableDate
                                        label={lang["log.dayend"]}
                                        dateValue={endDateFilter}
                                        setDateValue={setEndDateFilter}
                                        iconLabel="Chọn ngày kết thúc"
                                        showDateInput={showEndDateInput}
                                        closePopup={() => setShowEndDateInput(false)}
                                    />
                                </th>
                                <th class="font-weight-bold" style={{ minWidth: `115px`, maxWidth: `115px` }}>Timeline</th>
                                <th class="font-weight-bold ">{lang["log.create_user"]}</th>
                                <th class="font-weight-bold align-center" style={{ position: 'sticky', right: 0, backgroundColor: '#fff', borderLeft: '1px solid #ccc' }} scope="col">
                                    {lang["log.action"]}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTask.filter((task) => {
                                let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
                                let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
                                let taskStart = new Date(task.start);
                                let taskEnd = new Date(task.end);
                                return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
                                    (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
                                    (!endDateFilter || taskEnd <= new Date(endDateFilter));
                            }).map((task, index) => (
                                <React.Fragment key={index}>
                                    <tr class="font-weight-bold fix-layout">
                                        <td class="fix-layout" onClick={() => handleToggle(task.period_id)}>
                                            {task.tasks.length > 0 ? (expandedTasks[task.period_id]
                                                ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                                : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                            ) : <div style={{ minHeight: "27px" }}></div>
                                            }
                                        </td>
                                        {/* <td>{task.period_id}</td> */}
                                        <td>{index + 1}</td>
                                        <td>{task.period_name}</td>
                                        <td></td>
                                        {/* <td>{task.progress}</td> */}
                                        <td>{!isNaN(parseFloat(task.progress)) ? (parseFloat((task.progress))).toFixed(1) + '%' : 'Invalid value'}</td>
                                        <td></td>
                                        <td>{functions.formatDateTask(task.start)}</td>
                                        <td>{functions.formatDateTask(task.end)}</td>
                                        <td></td>
                                        <td>
                                            {task.period_members && task.period_members.length > 0 ?
                                                task.period_members.map(member => member.fullname).join(', ') :
                                                <>{lang["projectempty"]}</>
                                            }
                                        </td>
                                        <td style={{
                                            position: 'sticky',
                                            right: 0,
                                            backgroundColor: '#fff',
                                            borderLeft: '1px solid #ccc !important',
                                            boxSizing: 'border-box',
                                        }}>
                                            {
                                                (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                <>

                                                    <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId_addTask(task)} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
                                                    <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
                                                    <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                    {expandedTasks[task.period_id] && task.tasks.map((subtask, subtaskIndex) => (
                                        <>
                                            {/* <tr class="sub-task fix-layout" key={subtask.task_id}> */}
                                            <tr class="font-weight-bold fix-layout" key={subtask.task_id}>
                                        
                                                <td style={{ width: "50px", paddingLeft: "20px" }} className="toggle-subtasks fix-layout" onClick={() => handleSubsubtaskToggle(subtask.task_id)}>
                                                    {subtask.child_tasks && subtask.child_tasks.length > 0 ? (expandedSubsubtasks[subtask.task_id]
                                                        ? <i className="fa fa-caret-down  toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                                        : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                                    ) : <div style={{ height: "25px" }}></div>
                                                    }
                                                </td>
                                                {/* <td>{subtask.task_id}</td> */}
                                                <td style={{ paddingLeft: "30px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}`}</td>
                                                <td style={{ paddingLeft: "10px" }}>{subtask.task_name}</td>
                                                <td>{getTaskPriorityLabel(subtask.task_priority)}</td>
                                                <td>{!isNaN(parseFloat(subtask.progress)) ? (parseFloat(subtask.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
                                                <td class="font-weight-bold" style={{ color: getStatusColor(subtask.task_approve ? 1 : 0), textAlign: "center" }}>
                                                    {getStatusLabel(subtask.task_approve ? 1 : 0)}
                                                </td>
                                                <td>{functions.formatDateTask(subtask.start)}</td>
                                                <td>{functions.formatDateTask(subtask.end)}</td>
                                                <td>{functions.formatDateTask(subtask.timeline)}</td>
                                                {/* <td>
                                                {
                                                    subtask.members && subtask.members.length > 0 ?
                                                        subtask.members.slice(0, 2).map(member => (
                                                            <img class="img-responsive circle-image-cus" src={proxy + member.avatar} alt={member.username} title={member.fullname} />
                                                        )) :
                                                        <>{lang["projectempty"]} </>
                                                }
                                                {
                                                    subtask.members.length > 2 &&
                                                    <div className="img-responsive circle-image-projectdetail ml-1" style={{ backgroundImage: `url(${proxy + subtask.members[2].avatar})` }}>
                                                        <span>+{subtask.members.length - 2}</span>
                                                    </div>
                                                }
                                            </td> */}
                                                <td>
                                                    {
                                                        subtask.members && subtask.members.length > 0 ?
                                                            subtask.members.map(member => (
                                                                <img class="img-responsive circle-image-cus-gantt pointer" src={proxy + member.avatar} alt={member.username} title={member.fullname} />
                                                            )) :
                                                            <>{lang["projectempty"]} </>
                                                    }
                                                </td>
                                                <td class="align-center" style={{
                                                    position: 'sticky',
                                                    right: 0,
                                                    backgroundColor: '#fff',
                                                    borderLeft: '1px solid #ccc !important',
                                                    boxSizing: 'border-box',
                                                }}>
                                                    <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" onClick={() => getDataViewDetail(subtask, task.period_id)} data-target="#viewTask" title={lang["viewdetail"]}></i>
                                                    {
                                                        (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                        <>
                                                            {subtask.task_approve
                                                                ? (subtask.task_approve === true
                                                                    ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                    : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                : (subtask.progress === "100.00"
                                                                    ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                    : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                            }

                                                            <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId(subtask.task_id, task.period_id)} data-toggle="modal" data-target="#addTaskChild" title={lang["addtaskchild"]}></i>

                                                            <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTask(subtask, task.period_id)} data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
                                                            <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTask(subtask, task.period_id)} title={lang["delete"]}></i>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                            {expandedSubsubtasks[subtask.task_id] && subtask.child_tasks.map((subsubtask, Subtaskindex) => {
                                                const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${Subtaskindex}`;
                                                return (
                                                    <tr class="sub-subtask fix-layout" key={uniqueId}>
                                                        <td class="fix-layout" style={{ height: "38.3px" }}></td>
                                                        {/* <td >{subsubtask.child_task_id}</td> */}
                                                        <td style={{ paddingLeft: "40px" }}>{`${index + 1}.${subtaskIndex + 1}.${Subtaskindex + 1}`}</td>
                                                        <td style={{ paddingLeft: "40px" }}>{subsubtask.child_task_name}</td>
                                                        <td>{getTaskPriorityLabel(subsubtask.priority)}</td>
                                                        {/* <td>{subsubtask.progress}</td> */}
                                                        <td>
                                                            {
                                                                (_users.username === manageProject?.username || membersProject?.some(member => member.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subsubtask.approve ?
                                                                    <div class="fix-layout-input" style={{ display: 'inline-block', position: 'relative' }}>
                                                                        <input
                                                                            type="text"
                                                                            className='form-control'
                                                                            value={progressValues[uniqueId] ?? ''}
                                                                            onBlur={(e) => handleProgressBlur(e, subsubtask, subtask.task_id, task.period_id, uniqueId)}
                                                                            onFocus={(e) => { handleProgressFocus(subsubtask) }}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                if (value === '' || onlyContainsNumbers(value)) {
                                                                                    const normalizedValue = value === '' ? 0 : parseInt(value, 10);
                                                                                    handleProgressChange(normalizedValue, subsubtask, subtask.task_id, task.period_id, uniqueId);
                                                                                }
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'enter') {
                                                                                    e.preventDefault();
                                                                                    updateTaskChild({
                                                                                        ...subsubtask,
                                                                                        progress: progressValues[uniqueId] || subsubtask.progress,
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
                                                                    </div>
                                                                    :
                                                                    <div style={{ display: 'inline-block', position: 'relative' }}>
                                                                        {!isNaN(parseFloat(progressValues[uniqueId])) ? (parseFloat(progressValues[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
                                                                    </div>
                                                            }

                                                        </td>
                                                        <td class="font-weight-bold" style={{ color: getStatusColor(subsubtask.approve ? 1 : 0), textAlign: "center" }}>
                                                            {getStatusLabel(subsubtask.approve ? 1 : 0)}
                                                        </td>
                                                        <td>{functions.formatDateTask(subsubtask.start)}</td>
                                                        <td>{functions.formatDateTask(subsubtask.end)}</td>
                                                        <td>{functions.formatDateTask(subsubtask.timeline)}</td>
                                                        <td>
                                                            {subsubtask.members && subsubtask.members.length > 0 ?
                                                                subsubtask.members.map(member => member.fullname).join(', ') :
                                                                <>{lang["projectempty"]}</>
                                                            }
                                                        </td>
                                                        <td class="align-center" style={{
                                                            position: 'sticky',
                                                            right: 0,
                                                            backgroundColor: '#fff',
                                                            borderLeft: '1px solid #ccc !important',
                                                            boxSizing: 'border-box',
                                                        }}> <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" data-target="#viewTask" title={lang["viewdetail"]}></i>
                                                            {
                                                                (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                                <>
                                                                    {subsubtask.approve
                                                                        ? (subsubtask.approve === true
                                                                            ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
                                                                            : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                        : (subsubtask.progress === 100
                                                                            ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
                                                                            : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                    }
                                                                    <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTaskChild(subsubtask, subtask.task_id, task.period_id)} data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>

                                                                    <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["delete"]}></i>
                                                                </>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            )}
                                        </>
                                    ))}

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div style={{ width: '5px', cursor: 'col-resize', background: '#ccc', height: "80%" }} onMouseDown={handleMouseDown}
                ></div>
                <div
                    className="active"
                    ref={scrollRef2}
                    onScroll={handleScroll(scrollRef2, scrollRef1)}
                    // onMouseDown={handleMouseDownGantt}
                    // onMouseLeave={handleMouseLeave}
                    // onMouseUp={handleMouseUpGantt}
                    // onMouseMove={handleMouseMoveGantt}
                    style={{ flex: '1', border: '1px solid gray', background: '#f6f6f6', maxWidth: '100%', height: "80%", overflowY: 'hidden', overflowX: 'auto' }}
                >
                    {dataGantt.length > 0 && <GanttTest data={dataGantt} />}
                </div>
                {/* Add Task */}
                <div class={`modal show`} id="addTask">
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
                                            <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.start}
                                                onChange={
                                                    (e) => { setTask({ ...task, start: e.target.value }) }
                                                } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.end} onChange={
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
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.period_members?.map((user, index) => (
                                                            <div key={index} className="user-checkbox-item ">
                                                                <label class="pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-1"
                                                                        value={JSON.stringify(user)}
                                                                        onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                                                                    />
                                                                    {user.fullname}
                                                                </label>
                                                            </div>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submitAddTask} class="btn btn-success">{lang["btn.create"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Update Task */}
                <div class={`modal show`} id="editTask">
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
                                            <input type="text" class="form-control" value={taskUpdate.task_name} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, task_name: e.target.value }) }
                                            } placeholder={lang["p.taskname"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12 ">
                                            <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={taskUpdate.task_priority} onChange={(e) => { setTaskUpadte({ ...taskUpdate, task_priority: e.target.value }) }}>
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
                                            <input type="hidden" class="form-control" value={taskUpdate.task_status} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, task_status: e.target.value }) }
                                            } />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.start} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, start: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.end} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, end: e.target.value }) }
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
                                            <input type="date" min={taskUpdate.start} max={taskUpdate.end} className="form-control" value={taskUpdate.timeline} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, timeline: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["p.description"]} <span className='red_star'>*</span></label>
                                            <textarea rows="4" type="text" class="form-control" value={taskUpdate.task_description} onChange={
                                                (e) => { setTaskUpadte({ ...taskUpdate, task_description: e.target.value }) }
                                            } placeholder={lang["p.description"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["taskmember"]} <span className='red_star'>*</span></label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.period_members?.map((user, index) => {
                                                            const isMember = selectedUsernames.includes(user.username);
                                                            return (
                                                                <div key={index} className="user-checkbox-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-1"
                                                                            value={JSON.stringify(user)}
                                                                            checked={isMember}
                                                                            onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                                                                        />
                                                                        {user.fullname}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={updateTask} class="btn btn-success">{lang["btn.update"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* View Task */}
                <div class={`modal 'show' : ''}`} id="viewTask">
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
                                            <span className="d-block"> {dataViewDetail.task_name} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["description"]}</b></label>
                                            <span className="d-block"> {dataViewDetail.task_description} </span>
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label><b>{lang["log.daystart"]}</b></label>
                                            <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
                                        </div>

                                        <div class="form-group col-lg-4">
                                            <label><b>{lang["log.dayend"]}</b></label>
                                            <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label><b>Timeline</b></label>
                                            <span className="d-block"> {functions.formatDateTask(dataViewDetail.timeline)} </span>
                                        </div>

                                        {/* <div class="form-group col-lg-4">
                                        <label><b>{lang["taskstatus"]}</b></label>
                                        <div>
                                            <span className="status-label" style={{
                                                backgroundColor: (statusTaskView.find((s) => s.value === dataViewDetail.task_status) || {}).color,
                                                whiteSpace: "nowrap"
                                            }}>
                                                {lang[`${(statusTaskView.find((s) => s.value === dataViewDetail.task_status) || {}).label || 'Trạng thái không xác định'}`]}
                                            </span>
                                        </div>
                                    </div> */}
                                        <div class="form-group col-lg-4">
                                            <label><b>{lang["create-at"]}</b></label>
                                            <span className="d-block"> {functions.formatDate(dataViewDetail.create_at)} </span>
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label><b>{lang["creator"]}</b></label>
                                            <span className="d-block"> {dataViewDetail.create_by?.fullname} </span>
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label><b>{lang["task_priority"]}</b></label>
                                            <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.task_priority)) || {}).label || dataViewDetail.task_priority}`]} </span>

                                        </div>
                                        {/* <div class="form-group col-lg-4">
                                        <label><b>{lang["confirm"]}</b></label>
                                        <td class="font-weight-bold" style={{ color: getStatusColor(dataViewDetail.task_approve ? 1 : 0), textAlign: "center" }}>
                                            {getStatusLabel(dataViewDetail.task_approve ? 1 : 0)}
                                        </td>
                                    </div> */}

                                        {/* <div class="form-group col-lg-12">
                                        <div class="table-responsive">
                                            {
                                                dataViewDetail.members && dataViewDetail.members.length > 0 ? (
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
                                                                {dataViewDetail.members.map((member, index) => (
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
                                    </div>   */}
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
                                            {
                                                dataViewDetail.task_modified && dataViewDetail.task_modified.length > 0 ? (
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
                                                                        {dataViewDetail.task_modified.reverse().map((task, index) => (
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
                                                                                                `${task.old_value}`
                                                                                    }
                                                                                </td>
                                                                                <td scope="row">
                                                                                    {
                                                                                        task.new_value === true ? lang["approved"] :
                                                                                            task.new_value === false ? lang["await"] :
                                                                                                `${task.new_value}`
                                                                                        // `${task.new_value.slice(0, 100)}${task.new_value.length > 100 ? '...' : ''}`
                                                                                    }
                                                                                </td>
                                                                                <td scope="row">{functions.formatDate(task.modified_at)}</td>
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
                {/* Add Task Child */}
                <div class={`modal show`} id="addTaskChild">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["addtask"]} con</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>{lang["taskname"]} <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={taskChild.child_task_name} onChange={
                                                (e) => { setTaskChild({ ...taskChild, child_task_name: e.target.value }) }
                                            } placeholder={lang["p.taskname"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.child_task_name && <span class="error-message">{errorMessagesadd.child_task_name}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12 ">
                                            <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={taskChild.priority} onChange={(e) => { setTaskChild({ ...taskChild, priority: e.target.value }) }}>
                                                <option value="">{lang["choose"]}</option>
                                                {statusPriority.map((status, index) => {
                                                    return (
                                                        <option key={index} value={status.value}>{lang[status.label]}</option>
                                                    );
                                                })}
                                            </select>
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.priority && <span class="error-message">{errorMessagesadd.riority}</span>}
                                            </div>
                                            <input type="hidden" class="form-control" value={taskChild.child_task_status} onChange={
                                                (e) => { setTaskChild({ ...taskChild, child_task_status: e.target.value }) }
                                            } />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.start} onChange={
                                                (e) => { setTaskChild({ ...taskChild, start: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.end} onChange={
                                                (e) => { setTaskChild({ ...taskChild, end: e.target.value }) }
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
                                            <input type="date" min={taskChild.start} max={taskChild.end} className="form-control" value={taskChild.timeline} onChange={
                                                (e) => { setTaskChild({ ...taskChild, timeline: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["p.description"]} <span className='red_star'>*</span></label>
                                            <textarea rows="4" type="text" class="form-control" value={taskChild.child_task_description} onChange={
                                                (e) => { setTaskChild({ ...taskChild, child_task_description: e.target.value }) }
                                            } placeholder={lang["p.description"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.child_task_description && <span class="error-message">{errorMessagesadd.child_task_description}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["taskmember"]} <span className='red_star'>*</span></label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.tasks.find((task) => task.task_id === taskId)
                                                        ?.members?.map((user, index) => {
                                                            return (
                                                                <div key={index} className="user-checkbox-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-1"
                                                                            value={JSON.stringify(user)}

                                                                            onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                                                                        />
                                                                        {user.fullname}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submitAddTaskChild} class="btn btn-success">{lang["btn.create"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Update Task Child */}
                <div class={`modal show`} id="editTaskChild">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["edittaskchild"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>{lang["taskname"]} <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={taskUpdateChild.child_task_name} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_name: e.target.value }) }
                                            } placeholder={lang["p.taskname"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12 ">
                                            <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={taskUpdateChild.priority} onChange={(e) => { setTaskUpadteChild({ ...taskUpdateChild, priority: e.target.value }) }}>
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
                                            <input type="hidden" class="form-control" value={taskUpdateChild.child_task_status} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_status: e.target.value }) }
                                            } />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.start} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, start: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                            <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.end} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, end: e.target.value }) }
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
                                            <input type="date" min={taskUpdateChild.start} max={taskUpdateChild.end} className="form-control" value={taskUpdateChild.timeline} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, timeline: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["p.description"]} <span className='red_star'>*</span></label>
                                            <textarea rows="4" type="text" class="form-control" value={taskUpdateChild.child_task_description} onChange={
                                                (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_description: e.target.value }) }
                                            } placeholder={lang["p.description"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["taskmember"]} <span className='red_star'>*</span></label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.tasks.find((task) => task.task_id === taskId)
                                                        ?.members?.map((user, index) => {
                                                            const isMember = selectedUsernames.includes(user.username);
                                                            return (
                                                                <div key={index} className="user-checkbox-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-1"
                                                                            value={JSON.stringify(user)}
                                                                            checked={isMember}
                                                                            onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                                                                        />
                                                                        {user.fullname}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={updateTaskChild} class="btn btn-success">{lang["btn.update"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Update Stage */}
                <div class={`modal 'show'`} id="editStage">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["updatestage"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>{lang["stagename"]} <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={formData.stage_name || ''} onChange={
                                                (e) => { setFormData({ ...formData, stage_name: e.target.value }) }
                                            } placeholder={lang["p.stagename"]} />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.stage_name && <span class="error-message">{errorMessagesadd.stage_name}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                            <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_start || ''} onChange={
                                                (e) => { setFormData({ ...formData, stage_start: e.target.value }) }
                                            } />
                                            <div style={{ minHeight: '20px' }}>
                                                {errorMessagesadd.stage_start && <span class="error-message">{errorMessagesadd.stage_start}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                            <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_end || ''} onChange={
                                                (e) => { setFormData({ ...formData, stage_end: e.target.value }) }
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
                                                {membersProject?.map((user, index) => {
                                                    const isMember = selectedUsernames.includes(user.username);
                                                    return (
                                                        <div key={index} class="user-checkbox-item">
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    class="mr-1"
                                                                    value={JSON.stringify(user)}
                                                                    checked={isMember}
                                                                    onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                                                                />
                                                                {user.fullname}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={updateStage} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <GanttTest data={dataGantt} /> */}
        </>

    );
};

export default Stage;
