import { da } from 'date-fns/locale';
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import GanttTest from "./gantt-test"

const Stage = (props) => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const { project_id, version_id } = useParams();
    const _token = localStorage.getItem("_token");
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


    const [taskUpdateChild, setTaskUpadteChild] = useState({});
    const [formData, setFormData] = useState({});
    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const handleCloseModal = () => {
        setErrorMessagesadd({})
    };

    const dataTask = props.data
    const membersProject = props.members.members
    console.log(dataTask)
    //drop
    // console.log(props.data.period_members)
    const [containerWidth, setContainerWidth] = useState('50%');
    const [isResizing, setIsResizing] = useState(false);

    const containerRef = useRef(null);

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
                    // if (success) {
                    //     functions.showApiResponseMessage(status);
                    // } else {
                    //     functions.showApiResponseMessage(status);
                    // }
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
                    // if (success) {
                    //     functions.showApiResponseMessage(status);
                    // } else {
                    //     functions.showApiResponseMessage(status);
                    // }
                }
            })
    };
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

    const handleProgressFocus = ( childTask ) => {
        const  members = childTask.members ? childTask.members : []

        const usernames = members.map( mem => mem.username )
        setSelectedUsernames( usernames )
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



    return (
        <div style={{ display: 'flex', width: '100%' }} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div
                ref={containerRef}
                style={{ flex: '0 0 auto', width: containerWidth, border: '1px solid gray', maxWidth: '100%', overflowX: 'auto' }}
            >
                <table className="table" style={{ maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>


                    <thead>
                        <tr style={{ height: "60px" }}>

                            {/* <th style={{ width: `${columnWidths.col1}px`, position: 'relative' }}> */}
                            <th style={{ minWidth: `45px`, maxWidth: `45px`, position: 'relative' }}>
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
                            <th class="font-weight-bold" style={{ minWidth: `400px`, maxWidth: `400px` }}>{lang["title.task"]}</th>
                            <th class="font-weight-bold align-center"> {lang["task_priority"]}</th>
                            <th class="font-weight-bold align-center" style={{ width: `80px` }}>%{lang["complete"]}</th>
                            <th class="font-weight-bold align-center" style={{ width: `120px` }}>{lang["log.daystart"]}</th>
                            <th class="font-weight-bold align-center" style={{ width: `120px` }}>{lang["log.dayend"]}</th>
                            <th class="font-weight-bold align-center" style={{ width: `120px` }}>Timeline</th>
                            <th class="font-weight-bold align-center">{lang["log.create_user"]}</th>
                            <th class="font-weight-bold align-center" scope="col">
                                {lang["log.action"]}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {dataTask.map((task, index) => (
                            <React.Fragment key={index}>
                                <tr class="font-weight-bold">
                                    <td onClick={() => handleToggle(task.period_id)}>
                                        {task.tasks.length > 0 ? (expandedTasks[task.period_id]
                                            ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                            : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                        ) : ""
                                        }
                                    </td>
                                    {/* <td>{task.period_id}</td> */}
                                    <td>{index + 1}</td>
                                    <td>{task.period_name}</td>
                                    <td></td>
                                    {/* <td>{task.progress}</td> */}
                                    <td>{!isNaN(parseFloat(task.progress)) ? (parseFloat(task.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
                                    <td>{functions.formatDateTask(task.start)}</td>
                                    <td>{functions.formatDateTask(task.end)}</td>
                                    <td></td>
                                    <td>
                                        {task.period_members && task.period_members.length > 0 ?
                                            task.period_members.map(member => member.fullname).join(', ') :
                                            <>{lang["projectempty"]}</>
                                        }
                                    </td>
                                    <td>
                                        <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId_addTask(task)} data-toggle="modal" data-target="#addTask" title={lang["add"]}></i>
                                        {/* <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" data-target="#viewTask" title={lang["viewdetail"]}></i> */}
                                        <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["edit"]}></i>
                                        <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteStage(task)} title={lang["delete"]}></i>
                                    </td>
                                </tr>
                                {expandedTasks[task.period_id] && task.tasks.map(subtask => (
                                    <>
                                        <tr class="sub-task" key={subtask.task_id}>

                                            <td style={{ width: "50px", paddingLeft: "20px" }} className="toggle-subtasks" onClick={() => handleSubsubtaskToggle(subtask.task_id)}>
                                                {subtask.child_tasks && subtask.child_tasks.length > 0 ? (expandedSubsubtasks[subtask.task_id]
                                                    ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                                    : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                                ) : ""}
                                            </td>
                                            {/* <td>{subtask.task_id}</td> */}
                                            <td style={{ paddingLeft: "10px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}`}</td>
                                            <td style={{ paddingLeft: "10px" }}>{subtask.task_name}</td>
                                            <td>{getTaskPriorityLabel(subtask.task_priority)}</td>
                                            <td>{!isNaN(parseFloat(subtask.progress)) ? (parseFloat(subtask.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
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
                                                            <img class="img-responsive circle-image-cus" src={proxy + member.avatar} alt={member.username} title={member.fullname} />
                                                        )) :
                                                        <>{lang["projectempty"]} </>
                                                }
                                            </td>
                                            <td>
                                                <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId(subtask.task_id, task.period_id)} data-toggle="modal" data-target="#addTaskChild" title={lang["add"]}></i>
                                                <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTask(subtask, task.period_id)} data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
                                                <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTask(subtask, task.period_id)} title={lang["delete"]}></i>
                                            </td>
                                        </tr>
                                        {expandedSubsubtasks[subtask.task_id] && subtask.child_tasks.map((subsubtask, index) => {
                                            const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${index}`;
                                            return (
                                                <tr class="sub-subtask" key={uniqueId}>
                                                    <td></td>
                                                    {/* <td >{subsubtask.child_task_id}</td> */}
                                                    <td style={{ paddingLeft: "40px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}.${subtask.child_tasks.indexOf(subsubtask) + 1}`}</td>
                                                    <td style={{ paddingLeft: "40px" }}>{subsubtask.child_task_name}</td>
                                                    <td>{getTaskPriorityLabel(subsubtask.priority)}</td>
                                                    {/* <td>{subsubtask.progress}</td> */}
                                                    <td>
                                                        <div style={{ display: 'inline-block', position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                className='form-control'
                                                                value={progressValues[uniqueId] ?? ''}
                                                                onBlur={(e) => handleProgressBlur(e, subsubtask, subtask.task_id, task.period_id, uniqueId)}
                                                                onFocus ={ (e) => { handleProgressFocus( subsubtask ) } }
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === '' || onlyContainsNumbers(value)) {
                                                                        const normalizedValue = value === '' ? 0 : parseInt(value, 10);
                                                                        handleProgressChange(normalizedValue, subsubtask, subtask.task_id, task.period_id, uniqueId);
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
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
                                                    <td>
                                                        <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTaskChild(subsubtask, subtask.task_id, task.period_id)} data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
                                                        <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["delete"]}></i>
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
            <div style={{ width: '5px', cursor: 'col-resize', background: '#ccc' }} onMouseDown={handleMouseDown}
            ></div>

            <div style={{ flex: '1', border: '1px solid gray', background: '#f6f6f6', maxWidth: '100%', overflowX: 'auto' }}>
                {/* Biểu đồ Gantt có thể được thêm vào đây */}
                {
                    dataGantt.length > 0 && <GanttTest data={dataGantt} />
                }
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
                                                        <div key={index} className="user-checkbox-item">
                                                            <label>
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
                                                                <label>
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
                                                                <label>
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
                                                                <label>
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
    );
};

export default Stage;
