import { da } from 'date-fns/locale';
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize, faDownload, faCompress, faChartBar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { StatusEnum, StatusTask, StatusAprove } from '../../enum/status';
import GanttTest from "../gantt/gantt-test"
import FloatingTextBox from '../../common/floatingTextBox';
import CheckList from '../../common/checkList';
import FilterableDate from '../../common/searchDate';
import $ from 'jquery';
import TableScroll from "../table-test-scroll"
// task new input
// const Stage = (props) => {
//     const { lang, proxy, auth, functions, socket } = useSelector(state => state);
//     const { project_id, version_id } = useParams();
//     const _token = localStorage.getItem("_token");
//     const stringifiedUser = localStorage.getItem("user");
//     const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}
//     const { removeVietnameseTones } = functions

//     const [expandedTasks, setExpandedTasks] = useState({});
//     const [expandedSubsubtasks, setExpandedSubsubtasks] = useState({});
//     const [showGantt, setShowGantt] = useState(false);
//     const [dataGantt, setGanttData] = useState([]);
//     const [errorMessagesadd, setErrorMessagesadd] = useState({});

//     const [dataStageUpdate, setDataStageUpdate] = useState([])
//     const [periodId, setPeriodId] = useState(null)
//     // console.log(dataStageUpdate.period_members)
//     const [taskId, setTaskId] = useState(null)
//     const [childTask, setChildTask] = useState(null)
//     const [typeAction, setTypeAction] = useState(0)
//     const [actionShow, setActionShow] = useState(0)
//     const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//     // console.log(actionShow)
//     const [task, setTask] = useState({ task_status: 1 });
//     const [taskUpdate, setTaskUpadte] = useState({});
//     const [taskChild, setTaskChild] = useState({ child_task_status: 1 });

//     const wrapperRef = useRef(null);
//     const heights = [30, 35, 40, 45, 50, 55, 60, 65, 80]


//     const [dataViewDetail, setDataViewDetail] = useState({})
//     const [taskUpdateChild, setTaskUpadteChild] = useState({});

//     const [formData, setFormData] = useState({});
//     // console.log(formData)
//     const [selectedUsernamesStage, setSelectedUsernamesStage] = useState([]);
//     // console.log(selectedUsernamesStage)
//     const [selectedUsernames, setSelectedUsernames] = useState([]);

//     const [selectedUsernamesAdd, setSelectedUsernamesAdd] = useState([]);

//     const [selectedUsernamesChild, setSelectedUsernamesChild] = useState([]);


//     const handleCloseModal = () => {
//         hideBackdrop()
//         setSelectedUsernamesChild([])
//         setSelectedRowIndex(null)
//         setActionShow(0)
//         setErrorMessagesadd({})
//         setTask({

//             task_name: '',
//             task_priority: '',
//             task_status: 1,
//             start: '',
//             end: '',
//             timeline: '',
//             task_description: '',
//             members: []
//         })

//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         });
//     };

//     const handleCloseModalAdd = () => {
//         hideBackdrop()
//         setSelectedUsernamesAdd([]);
//         setSelectedRowIndex(null)
//         setActionShow(0)
//         setErrorMessagesadd({})
//         setTask({

//             task_name: '',
//             task_priority: '',
//             task_status: 1,
//             start: '',
//             end: '',
//             timeline: '',
//             task_description: '',
//             members: []
//         })

//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         })

//     };

//     const clearModalChild = () => {

//         setSelectedUsernamesChild([])
//         setErrorMessagesadd({})
//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         });
//     };
//     const [enterPressed, setEnterPressed] = useState(false);
//     const [dataTask, setDataTask] = useState(props.data || []);

//     const membersProject = Array.from(new Map(props?.members?.members?.map(member => [member.username, member])).values());
//     const manageProject = props.members.manager
//     const fullScreen = props.fullScreen
//     membersProject.push(manageProject)

//     useEffect(() => {
//         setDataTask(props.data || []);
//     }, [props.data]);

//     // console.log(manageProject)
//     // console.log(dataTask)
//     //drop

//     const [containerWidth, setContainerWidth] = useState('80%');
//     const [isResizing, setIsResizing] = useState(false);
//     const [lenghtTask, setLenghtTask] = useState(1);

//     //Đếm tr
//     const tableRef = useRef();
//     useEffect(() => {
//         const numberOfTR = $(tableRef.current).find('tr').length;
//         setLenghtTask(numberOfTR)

//     }, [dataGantt, expandedTasks]);

//     const containerRef = useRef(null);
//     const scrollRef1 = useRef(null);
//     const scrollRef2 = useRef(null);

//     useEffect(() => {
//         containerRef.current = scrollRef1.current;
//     }, []);

//     useEffect(() => {
//         if (!showGantt) {
//             setContainerWidth("100%")
//         } else {
//             setContainerWidth("80%")
//         }
//     }, [showGantt]);

//     const handleShowGantt = () => {
//         setShowGantt(!showGantt)
//     };

//     const handleScroll = (ref1, ref2) => {
//         return () => {
//             if (ref1.current && ref2.current) {
//                 ref2.current.scrollTop = ref1.current.scrollTop;
//             }
//         };
//     };

//     const handleMouseDown = useCallback(() => {
//         setIsResizing(true);
//     }, []);


//     const handleMouseUp = useCallback(() => {
//         setIsResizing(false);
//     }, []);


//     const handleMouseMove = useCallback(
//         (e) => {
//             if (isResizing && containerRef.current) {
//                 const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
//                 setContainerWidth(newWidth + 'px');
//             }
//         },
//         [isResizing]
//     );

//     const [columnWidths, setColumnWidths] = useState({
//         col1: 100,
//         col2: 100,

//     });

//     useEffect(() => {
//         let isDown = false;
//         let startX;
//         let scrollLeft;

//         const containerElement = scrollRef2.current;
//         let svgElement;

//         if (containerElement) {
//             svgElement = containerElement.querySelector('svg');
//         }

//         const onMouseDown = (e) => {
//             isDown = true;
//             svgElement.classList.add('active');
//             startX = e.pageX - svgElement.getBoundingClientRect().left;
//             scrollLeft = svgElement.scrollLeft;
//         };

//         const onMouseMove = (e) => {
//             if (!isDown) return;
//             e.preventDefault();
//             const x = e.pageX - svgElement.getBoundingClientRect().left;
//             const walk = (x - startX);
//             svgElement.scrollLeft = scrollLeft - walk;
//         };

//         const onMouseUp = () => {
//             isDown = false;
//             svgElement.classList.remove('active');
//         };

//         const onMouseLeave = () => {
//             isDown = false;
//             svgElement.classList.remove('active');
//         };

//         if (svgElement) {
//             svgElement.addEventListener('mousedown', onMouseDown);
//             svgElement.addEventListener('mousemove', onMouseMove);
//             svgElement.addEventListener('mouseup', onMouseUp);
//             svgElement.addEventListener('mouseleave', onMouseLeave);
//         }

//         return () => {
//             if (svgElement) {
//                 svgElement.removeEventListener('mousedown', onMouseDown);
//                 svgElement.removeEventListener('mousemove', onMouseMove);
//                 svgElement.removeEventListener('mouseup', onMouseUp);
//                 svgElement.removeEventListener('mouseleave', onMouseLeave);
//             }
//         };
//     }, []);

//     useEffect(() => {
//         $('#content').css({
//             display: "flex",
//             flexDirection: "column"
//         })

//         $('.midde_cont').css({
//             display: "flex",
//             flexDirection: "column",
//             flexGrow: 1,
//         })

//         $('.midde_cont .container-fluid').css({
//             display: "flex",
//             flexDirection: "column",
//             flexGrow: 1,
//         })

//         $('#second-row').css({
//             flexGrow: 1
//         })

//     }, [])


//     const handleColumnResizeMouseDown = (colIndex) => (e) => {
//         e.preventDefault();

//         let pageX = e.pageX;

//         const handleMouseMove = (e) => {
//             const offsetX = e.pageX - pageX;
//             setColumnWidths((prevWidths) => ({
//                 ...prevWidths,
//                 [`col${colIndex}`]: prevWidths[`col${colIndex}`] + offsetX,
//             }));
//             pageX = e.pageX;
//         };

//         const handleMouseUp = () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };

//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//     };
//     useEffect(() => {
//         // Khi component được mount, lấy trạng thái từ localStorage và đặt vào state
//         const savedExpandedTasks = JSON.parse(localStorage.getItem('expandedTasks')) || {};
//         const savedExpandedSubsubtasks = JSON.parse(localStorage.getItem('expandedSubsubtasks')) || {};

//         setExpandedTasks(savedExpandedTasks);
//         setExpandedSubsubtasks(savedExpandedSubsubtasks);
//     }, []);

//     // const handleToggle = (taskId) => {
//     //     const newExpandedTasks = { ...expandedTasks };
//     //     newExpandedTasks[taskId] = !newExpandedTasks[taskId];
//     //     setExpandedTasks(newExpandedTasks);

//     // };
//     // const handleSubsubtaskToggle = (childTaskId) => {
//     //     const newExpandedSubsubtasks = { ...expandedSubsubtasks };
//     //     newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];
//     //     setExpandedSubsubtasks(newExpandedSubsubtasks);
//     // };
//     const handleToggle = (taskId, event) => {
//         event.stopPropagation();
//         const newExpandedTasks = { ...expandedTasks };
//         newExpandedTasks[taskId] = !newExpandedTasks[taskId];

//         // Lưu trạng thái mới vào localStorage
//         localStorage.setItem('expandedTasks', JSON.stringify(newExpandedTasks));

//         setExpandedTasks(newExpandedTasks);
//     };



//     const [isEditing, setIsEditing] = useState(false); // Thêm biến để theo dõi trạng thái chỉnh sửa
//     const [focusedInput, setFocusedInput] = useState(null);
// const [selectedInput, setSelectedInput] = useState(null);

//     useEffect(() => {
//         // Lắng nghe sự kiện click toàn cục trên trang web
//         document.addEventListener('click', handleClickOutside);

//         return () => {
//             // Hủy lắng nghe khi component unmount
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, []);

//     const handleClickOutside = (event) => {
//         // Kiểm tra xem sự kiện click có xảy ra bên ngoài phần tử bao bọc của bảng hay không
//         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//             if (isEditing) {
//                 setIsEditing(false);
//                 setFocusedInput(null);
//                 setSelectedRowIndex(null); // Bỏ trạng thái chỉnh s
//             }

//         }
//     };


//     const handleRowClick = (taskId, index, isCurrentlyEditing) => {
//         // Kiểm tra xem có đang trong trạng thái chỉnh sửa hay không
//         if (!isCurrentlyEditing) {
//             setIsEditing(true);
//             setFocusedInput(taskId);
//             setSelectedRowIndex(index);
//         }
//     };
//     console.log(isEditing)
//     const handleInputChange = (taskId, columnName, value) => {
//         setDataTask(prevData => prevData.map(task =>
//             task.period_id === taskId ? { ...task, [columnName]: value } : task
//         ));
//     };


//     const handleSubsubtaskToggle = (childTaskId, event) => {
//         event.stopPropagation();
//         const newExpandedSubsubtasks = { ...expandedSubsubtasks };
//         newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];

//         // Lưu trạng thái mới vào localStorage
//         localStorage.setItem('expandedSubsubtasks', JSON.stringify(newExpandedSubsubtasks));

//         setExpandedSubsubtasks(newExpandedSubsubtasks);
//     };
//     const statusTask = [
//         StatusAprove.APROVE,
//         StatusAprove.NOTAPROVE
//     ]
//     const getStatusLabel = (statusId) => {
//         const status = statusTask.find(st => st.id === statusId);

//         return status ? lang[status.label] : 'N/A';
//     };

//     const getStatusColor = (statusId) => {
//         const status = statusTask.find(st => st.id === statusId);

//         return status ? status.color : 'N/A';
//     };
//     const [taskNameFilter, setTaskNameFilter] = useState("");
//     const [startDateFilter, setStartDateFilter] = useState(null);
//     const [endDateFilter, setEndDateFilter] = useState(null);
//     useEffect(() => {
//         const newGanttData = dataTask.filter((task) => {
//             let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
//             let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
//             let taskStart = new Date(task.start);
//             let taskEnd = new Date(task.end);
//             return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
//                 (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
//                 (!endDateFilter || taskEnd <= new Date(endDateFilter));
//         }).map(period => {
//             const tasks = expandedTasks[period.period_id]
//                 ? period.tasks.map(task => {
//                     const child_tasks = expandedTasks[period.period_id] && expandedSubsubtasks[task.task_id]
//                         ? task.child_tasks.map(child_task => {
//                             return {
//                                 ...child_task,
//                                 child_tasks: expandedSubsubtasks[child_task.child_task_id] ? child_task.child_tasks : []
//                             };
//                         })
//                         : [];
//                     return { ...task, child_tasks };
//                 })
//                 : [];
//             return { ...period, tasks };
//         });

//         setGanttData(newGanttData);
//     }, [dataTask, expandedTasks, expandedSubsubtasks, expandedTasks, taskNameFilter, startDateFilter, endDateFilter]);

//     const statusPriority = [
//         { id: 0, label: "high", value: 1, color: "#1ed085" },
//         { id: 1, label: "medium", value: 2, color: "#8884d8" },
//         { id: 2, label: "low", value: 3, color: "#ffc658" },

//     ]
//     function getTaskPriorityLabel(taskPriority) {
//         const item = statusPriority.find(item => item.value === parseInt(taskPriority));
//         return item ? lang[item.label] || '' : '';
//     }


//     const getPeriodId = (taskId, periodId) => {

//         setPeriodId(periodId);
//         setTaskId(taskId)

//     };


//     const getPeriodId_addTask = (taskId) => {
//         setPeriodId(taskId.period_id);
//     };
//     //viewdetal
//     const getDataViewDetail = (taskId, periodId) => {
//         // (taskId)
//         setDataViewDetail(taskId)


//     };

//     //info update task
//     const getInfoTask = (taskId, periodId) => {
//         setTaskId(taskId.task_id)
//         setTaskUpadte(taskId)
//         setPeriodId(periodId)

//     };
//     //info update task
//     const getInfoTaskChild = (subtask, taskId, periodId) => {
//         setTaskUpadteChild(subtask)
//         setTaskId(taskId)
//         setPeriodId(periodId);

//     };


//     useEffect(() => {
//         if (dataStageUpdate.period_id) {
//             const newSelectedUsernames = dataTask.find(period => period.period_id === dataStageUpdate.period_id)?.period_members.map(member => member.username);
//             setSelectedUsernamesStage(newSelectedUsernames);

//             setFormData({
//                 stage_id: dataStageUpdate.period_id,
//                 stage_name: dataStageUpdate.period_name,
//                 stage_description: dataStageUpdate.period_description,
//                 stage_start: dataStageUpdate.start,
//                 stage_end: dataStageUpdate.end,
//             });
//         }
//     }, [dataStageUpdate]);

//     const handleCheckboxChangeStage = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernamesStage(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernamesStage(prevState => prevState.filter(username => username !== user.username));
//         }
//     };
//     const handleCheckboxChangeAdd = (user, isChecked) => {
//         setSelectedUsernamesAdd(prevState => {
//             if (isChecked) {
//                 // Thêm username nếu checkbox được chọn
//                 return [...prevState, user.username];
//             } else {
//                 // Loại bỏ username nếu checkbox không được chọn
//                 return prevState.filter(username => username !== user.username);
//             }
//         });
//     };
//     const handleCheckboxChange = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernames(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernames(prevState => prevState.filter(username => username !== user.username));
//         }
//     };

//     const handleCheckboxChangeChildAdd = (user, isChecked) => {
//         setSelectedUsernamesChild(prevState => {
//             const isAlreadySelected = prevState.includes(user.username);
//             if (isChecked && !isAlreadySelected) {
//                 return [...prevState, user.username];
//             } else if (!isChecked && isAlreadySelected) {
//                 return prevState.filter(username => username !== user.username);
//             } else {
//                 return prevState;
//             }
//         });
//     };

//     const handleCheckboxChangeChild = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernamesChild(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernamesChild(prevState => prevState.filter(username => username !== user.username));
//         }
//     };


//     useEffect(() => {
//         // Dùng để load danh sách username của các thành viên trong task hiện tại
//         if (taskUpdate && taskUpdate.members) {
//             const initialSelectedUsernames = taskUpdate?.members.map(member => member.username);
//             // console.log(taskUpdate)
//             setSelectedUsernames(initialSelectedUsernames);
//         }
//     }, [taskUpdate]);

//     // console.log(taskUpdate)
//     useEffect(() => {
//         // Dùng để load danh sách username của các thành viên trong task child hiện tại
//         if (taskUpdateChild && taskUpdateChild.members) {
//             const initialSelectedUsernames = taskUpdateChild?.members.map(member => member.username);
//             setSelectedUsernamesChild(initialSelectedUsernames);
//             // (selectedUsernamesChild)

//         }
//     }, [taskUpdateChild]);


//     const getIdStage = (stage) => {
//         setTypeAction(1)
//         setDataStageUpdate(stage);
//         setPeriodId(stage.period_id);

//     }
//     function findDifferences(memberProjectTemp, uniqueArray) {
//         // console.log("123", memberProjectTemp)
//         // console.log("456", uniqueArray)
//         const mapTemp = new Map(memberProjectTemp.map(item => [item.username, item])) || [];
//         const mapUnique = new Map(uniqueArray.map(username => [username, true]));

//         // Tìm những người dùng bị xóa dựa trên 'username'
//         const removedUsers = memberProjectTemp.filter(item => !mapUnique.has(item.username)).map(item => item.username);

//         // Tìm những người dùng mới được thêm vào dựa trên 'username'
//         const addedUsers = uniqueArray.filter(username => !mapTemp.has(username));

//         let status;
//         let changedUsers;
//         if (removedUsers.length > 0) {
//             status = 'users removed';
//             changedUsers = removedUsers.map(username => ({ username }));
//         } else if (addedUsers.length > 0) {
//             status = 'users added';
//             changedUsers = addedUsers.map(username => ({ username }));
//         } else {
//             status = 'no change';
//             changedUsers = [];
//         }

//         return { status, changedUsers };
//     }





//     const updateStage = (e) => {
//         e.preventDefault();

//         const errors = {};
//         if (!formData.stage_name) {
//             errors.stage_name = lang["error.stagename"];
//         }
//         if (!formData.stage_start) {
//             errors.stage_start = lang["error.start"];
//         }
//         if (!formData.stage_end) {
//             errors.stage_end = lang["error.end"];
//         }
//         if (new Date(formData.stage_start) > new Date(formData.stage_end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (!selectedUsernamesStage || selectedUsernamesStage.length === 0) {
//             errors.members = lang["error.members_stage"];
//         }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         const result = findDifferences(dataStageUpdate.period_members, selectedUsernamesStage);

//         // console.log("data check", result);
//         // console.log("data check 1", selectedUsernamesStage);
//         let dataSocket
//         if (result.status === "users added") {
//             dataSocket = {
//                 targets: result.changedUsers,
//                 actor: {
//                     fullname: _users.fullname,
//                     username: _users.username,
//                     avatar: _users.avatar
//                 },
//                 context: 'project/add-period-member',
//                 note: {
//                     project_name: props.projectname,
//                     period_name: formData.stage_name,
//                     project_id: project_id
//                 }
//             }
//         } else if (result.status === "users removed") {
//             dataSocket = {
//                 targets: result.changedUsers,
//                 actor: {
//                     fullname: _users.fullname,
//                     username: _users.username,
//                     avatar: _users.avatar
//                 },
//                 context: 'project/remove-period-member',
//                 note: {
//                     project_name: props.projectname,
//                     period_name: formData.stage_name,
//                     period_id: formData.stage_id,
//                     project_id: project_id
//                 }
//             }
//         }
//         const requestBody = {
//             period: {
//                 period_name: formData.stage_name,
//                 start: formData.stage_start,
//                 period_description: formData.stage_description,
//                 end: formData.stage_end,
//                 members: selectedUsernamesStage
//             }
//         }
//         // console.log(requestBody)
//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then((res) => res.json())
//             .then((resp) => {
//                 const { success, content, data, status } = resp;
//                 if (success) {
//                     functions.showApiResponseMessage(status, false);
//                     socket.emit("project/notify", dataSocket)
//                     props.callDataTask()
//                     $('#closeModalUpdateStage').click()
//                 } else {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 }
//             })

//     };

//     const handleDeleteStage = () => {


//         Swal.fire({
//             title: lang["confirm"],
//             text: lang["delete.stage"],
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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     // console.log(task)
//     const submitAddTask = (e) => {

//         e.preventDefault();
//         task.members = selectedUsernamesAdd;
//         const requestBody = {
//             period_id: periodId,
//             task: task
//         }




//         const errors = {};
//         if (!task.task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!task.task_priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!task.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!task.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(task.start) > new Date(task.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(task.start) > new Date(task.timeline) || new Date(task.timeline) > new Date(task.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!task.task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }


//         fetch(`${proxy}/projects/project/${project_id}/task`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 // console.log(resp)
//                 if (resp) {
//                     const { success, content, data, task, status } = resp;
//                     if (success) {

//                         const dataSocket = {
//                             targets: selectedUsernamesAdd.map(username => ({ username })),
//                             actor: {
//                                 fullname: _users.fullname,
//                                 username: _users.username,
//                                 avatar: _users.avatar
//                             },
//                             context: 'project/add-task-member',
//                             note: {
//                                 project_name: props.projectname,
//                                 project_id: project_id,
//                                 task_id: task.task_id
//                             }
//                         }

//                         functions.showApiResponseMessage(status, false);
//                         socket.emit("project/notify", dataSocket)
//                         props.callDataTask()

//                         $('#closeModalAddTask').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalAddTask').click()
//                     }
//                 }
//             })




//     }
//     const updateTask = (dataUpdate, useDataUpdate = false) => {

//         if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
//             const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
//             setSelectedUsernames(initialSelectedUsernames);
//         }
//         taskUpdate.members = selectedUsernames;

//         dataUpdate.members = selectedUsernames;

//         const currentTask = useDataUpdate ? dataUpdate : taskUpdate;
//         const requestBody = {
//             task: currentTask,

//         };
//         const dataSocket = {
//             targets: selectedUsernamesAdd.map(username => ({ username })),
//             actor: {
//                 fullname: _users.fullname,
//                 username: _users.username,
//                 avatar: _users.avatar
//             },
//             context: 'project/add-task-member',
//             note: {
//                 project_name: props.projectname,
//                 project_id: project_id,
//                 task_id: taskUpdate.task_id
//             }
//         }
//         const errors = {};
//         if (!taskUpdate.task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!taskUpdate.task_priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!taskUpdate.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!taskUpdate.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(taskUpdate.start) > new Date(taskUpdate.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(taskUpdate.start) > new Date(taskUpdate.timeline) || new Date(taskUpdate.timeline) > new Date(taskUpdate.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!taskUpdate.task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskUpdate.task_id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTask').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTask').click()
//                     }
//                 }
//             })

//     };

//     const handleDeleteTask = () => {

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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     const handleConfirmTask = (task, periodId) => {

//         const newTaskApproveStatus = !task.task_approve;
//         const requestBody = {
//             task: {
//                 task_approve: newTaskApproveStatus
//             }
//         };

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${task.task_id}/approve`, {
//             method: 'PUT',
//             headers: {
//                 "content-type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody)
//         })
//             .then(res => res.json())
//             .then((resp) => {
//                 const { success, content, data, status } = resp;

//                 if (success) {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 } else {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 }
//             });
//     }

//     const submitAddTaskChild = (e) => {
//         e.preventDefault();
//         taskChild.members = selectedUsernamesChild;
//         const requestBody = {
//             child_task: taskChild
//         }


//         const errors = {};
//         if (!taskChild.child_task_name) {
//             errors.child_task_name = lang["error.taskname"];
//         }
//         if (!taskChild.priority) {
//             errors.priority = lang["error.task_priority"];
//         }
//         if (!taskChild.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!taskChild.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(taskChild.start) > new Date(taskChild.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(taskChild.start) > new Date(taskChild.timeline) || new Date(taskChild.timeline) > new Date(taskChild.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!taskChild.child_task_description) {
//             errors.child_task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }
//         // console.log(requestBody)
//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 // console.log(resp)
//                 if (resp) {
//                     const { success, content, data, status, child_task } = resp;
//                     if (success) {
//                         const dataSocket = {
//                             targets: selectedUsernamesChild.map(username => ({ username })),
//                             actor: {
//                                 fullname: _users.fullname,
//                                 username: _users.username,
//                                 avatar: _users.avatar
//                             },
//                             context: 'project/add-child-task-member',
//                             note: {
//                                 project_name: props.projectname,
//                                 project_id: project_id,
//                                 child_task_id: child_task.child_task_id
//                             }
//                         }
//                         functions.showApiResponseMessage(status, false);
//                         socket.emit("project/notify", dataSocket)
//                         props.callDataTask()
//                         $('#closeModalAddTaskChild').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalAddTaskChild').click()
//                     }
//                 }
//             })

//     };

//     const updateTaskChild = (dataUpdate, useDataUpdate = false) => {

//         if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
//             const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
//             setSelectedUsernamesChild(initialSelectedUsernames);
//         }

//         taskUpdateChild.members = selectedUsernamesChild;
//         dataUpdate.members = selectedUsernamesChild;

//         const currentTask = useDataUpdate ? dataUpdate : taskUpdateChild;
//         const requestBody = {
//             child_task: currentTask,
//         };
//         const errors = {};
//         if (!currentTask.child_task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!currentTask.priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!currentTask.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!currentTask.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(currentTask.start) > new Date(currentTask.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(currentTask.start) > new Date(currentTask.timeline) || new Date(currentTask.timeline) > new Date(currentTask.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!currentTask.child_task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${currentTask.child_task_id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {

//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTaskChild').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTaskChild').click()
//                     }
//                 }
//             })
//     };
//     const handleConfirmTaskChild = (subtask, taskId, periodId,) => {

//         const newTaskApproveStatus = !subtask.approve;
//         const requestBody = {
//             child_task: {
//                 approve: newTaskApproveStatus
//             },
//         };

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${subtask.child_task_id}/approve`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {

//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                     }
//                 }
//             })
//     }
//     const [progressValues, setProgressValues] = useState({});
//     const [progressValuesTask, setProgressValuesTask] = useState({});
//     // console.log(progressValues)
//     const handleProgressBlur = (e, subsubtask, taskId, periodId, uniqueId) => {

//         updateTaskChild({
//             ...subsubtask,
//             progress: progressValues[uniqueId],
//         }, true);
//     };

//     const handleProgressBlurTask = (e, subtask, taskId, periodId, uniqueId) => {
//         // console.log(uniqueId)
//         updateTask({
//             ...subtask,
//             progress: progressValuesTask[uniqueId],
//         }, true);
//     };

//     const handleProgressChange = (normalizedValue, subsubtask, taskId, periodId, uniqueId) => {
//         setProgressValues(prevState => ({
//             ...prevState,
//             [uniqueId]: normalizedValue,
//         }));
//         setTaskId(taskId);
//         setPeriodId(periodId);
//     };

//     const handleProgressChangeTask = (normalizedValue, subtask, taskId, periodId, uniqueId) => {
//         setProgressValuesTask(prevState => ({
//             ...prevState,
//             [uniqueId]: normalizedValue,
//         }));
//         setTaskId(taskId);
//         setPeriodId(periodId);
//     };

//     const handleProgressFocus = (childTask) => {
//         const members = childTask.members ? childTask.members : []

//         const usernames = members.map(mem => mem.username)
//         setSelectedUsernames(usernames)
//     }

//     const handleProgressFocusTask = (childTask) => {
//         const members = childTask.members ? childTask.members : []

//         const usernames = members.map(mem => mem.username)
//         setSelectedUsernames(usernames)
//     }

//     function onlyContainsNumbers(inputString) {
//         const value = parseInt(inputString, 10);
//         return !isNaN(value) && value >= 0 && value <= 100;
//     }

//     function formatPercentage(value) {
//         let num = parseFloat(value);
//         num = Math.max(0, Math.min(num, 100));
//         return num.toFixed(2) + '%';
//     }

//     useEffect(() => {
//         const initialProgressValues = {};

//         // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
//         dataTask.forEach((task, taskIndex) => {
//             task.tasks?.forEach((subtask, subtaskIndex) => {
//                 subtask.child_tasks?.forEach((subsubtask, subsubtaskIndex) => {
//                     const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${subsubtaskIndex}`;
//                     initialProgressValues[uniqueId] = subsubtask.progress;
//                 });
//             });
//         });

//         setProgressValues(initialProgressValues);
//     }, [dataTask]);

//     useEffect(() => {
//         const initialProgressValues = {};

//         // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
//         dataTask.forEach((task, taskIndex) => {
//             task.tasks?.forEach((subtask, subtaskIndex) => {

//                 const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;

//                 initialProgressValues[uniqueId] = subtask.progress;

//             });
//         });
//         setProgressValuesTask(initialProgressValues);
//     }, [dataTask]);

//     const handleDeleteTaskChild = () => {
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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${childTask.child_task_id}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     // lọc để set điều kiện chọn ngày 
//     const currentPeriod = dataTask.find(period => period.period_id === periodId) || [];

//     const currentTask = dataTask?.flatMap((period) => period.tasks)?.find((task) => task.task_id === taskId) || [];

//     //filter
//     const [tableFilter, setTableFilter] = useState({ task_name: false });

//     const handleTaskNameFilterChange = (e) => {
//         setTaskNameFilter({ name: e.target.value });
//     }

//     // State để lưu giá trị lọc
//     const resetTaskNameFilter = () => {
//         setTaskNameFilter({ name: "" });
//     }
//     function showBackdrop() {

//         let backdrop = document.createElement('div');
//         backdrop.classList.add('custom-backdrop');

//         backdrop.id = 'custom-backdrop';
//         backdrop.style.display = 'block';

//         document.body.appendChild(backdrop);
//     }


//     function hideBackdrop() {
//         let backdrop = document.getElementById('custom-backdrop');
//         if (backdrop) {
//             backdrop.style.display = 'none';
//             backdrop.parentNode.removeChild(backdrop);
//         }
//     }



//     const [showStartDateInput, setShowStartDateInput] = useState(false);

//     const [showEndDateInput, setShowEndDateInput] = useState(false);

//     return (
//         <>
//             <div class="d-flex align-items-center mt-2" >
//                 <div class="custom-backdrop" id="custom-backdrop"></div>

//                 {/* <button class="btn btn-info" style={{ width: "115px" }} onClick={() => handleShowGantt()}>
//                     {showGantt ? lang["hidden-gantt"] : lang["show-gantt"]}
//                 </button> */}
//                 <span>{props.process}%</span>
//                 <i class="fa fa-eye size-24 pointer ml-auto icon-view icon-hidden"></i>
//                 {actionShow === 1 ? (

//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         <i className={`fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                         <i className={`fa fa-edit size-32 pointer icon-margin icon-edit ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                         <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete ${typeAction === 1 ? '' : 'disabled_action'}`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                     </>
//                 ) : actionShow === 2 ? (

//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         <i class="fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto" data-toggle="modal" onClick={() => clearModalChild()} data-target="#addTaskChild" title={lang["addtaskchild"]}></i>
//                         <i class="fa fa-edit size-32 pointer icon-margin icon-edit" data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
//                         <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTask()} title={lang["delete"]}></i>
//                     </>

//                 ) : actionShow === 3 ?

//                     (
//                         (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                         <>
//                             <i class="fa fa-edit size-32 pointer icon-margin icon-edit ml-auto" data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
//                             <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTaskChild()} title={lang["delete"]}></i>
//                         </>
//                     ) : actionShow === 0 ?

//                         (
//                             (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                             <>
//                                 <i className={`fa fa-plus-square size-32  pointer icon-margin icon-add-task ml-auto disabled_action`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                                 <i className={`fa fa-edit size-32 pointer icon-margin icon-edit disabled_action`} onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                                 <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1  icon-delete disabled_action`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                             </>
//                         ) : null
//                 }
//                 {
//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         {/* <button type="button" class="btn btn-primary custom-buttonadd" data-toggle="modal" data-target="#addStage">
//                         <i class="fa fa-plus" title={lang["addstage"]}></i>
//                     </button> */}
//                         <img class="img-responsive mr-1 pointer" width={32} src="/images/icon/add.png" title={lang["add stage"]} data-toggle="modal" data-target="#addStage" />

//                     </>
//                 }

//                 <FontAwesomeIcon icon={faChartBar} onClick={() => handleShowGantt()} className="ml-2 size-28 pointer icon-showgantt" title={showGantt ? lang["hidden-gantt"] : lang["show-gantt"]} />
//             </div>

//             <div style={{ display: 'flex', width: '100%', minHeight: "30%", height: "98%", overflowY: 'auto', marginTop: "5px" }} class="no-select" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
//                 <div
//                     // ref={containerRef}
//                     ref={scrollRef1}
//                     onScroll={handleScroll(scrollRef1, scrollRef2)}
//                     style={{
//                         flex: '0 0 auto',
//                         width: containerWidth,
//                         border: '1px solid gray',
//                         maxWidth: '100%',
//                         height: lenghtTask === 1 ? "30%" :
//                             (lenghtTask === 2 ? "35%" :
//                                 (lenghtTask === 3 ? "40%" :
//                                     (lenghtTask === 4 ? "45%" :
//                                         (lenghtTask === 5 ? "50%" :
//                                             (lenghtTask === 6 ? "60%" :
//                                                 (lenghtTask === 7 ? "70%" :
//                                                     (lenghtTask === 8 ? "75%" :
//                                                         (lenghtTask === 9 ? "80%" :
//                                                             (lenghtTask === 10 ? "85%" :
//                                                                 (lenghtTask === 11 ? "90%" : "")))))))))),
//                         // height: heights[ lenghtTask + 1 ] ? `${heights[ lenghtTask + 1 ]}%` : "85%",
//                         overflowX: 'auto'
//                     }}>
//                     <table ref={wrapperRef} className="table fix-layout-header-table" style={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
//                         <thead>
//                             <tr class="color-tr" style={{ height: "60px" }}>

//                                 {/* <th style={{ width: `${columnWidths.col1}px`, position: 'relative' }}> */}
//                                 <th style={{ minWidth: `45px`, maxWidth: `45px`, minHeight: "37px", maxHeight: "37px", position: 'relative' }}>
//                                     <div
//                                         style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
//                                         onMouseDown={handleColumnResizeMouseDown(1)}
//                                     />
//                                 </th>

//                                 {/* <th style={{ width: `${columnWidths.col2}px`, position: 'relative' }} class="font-weight-bold align-center"># */}
//                                 <th style={{ minWidth: `85px`, maxWidth: `85px`, position: 'relative' }} class="font-weight-bold align-center">#
//                                     <div
//                                         style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
//                                         onMouseDown={handleColumnResizeMouseDown(2)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `400px`, maxWidth: `400px` }}>
//                                     {lang["title.task"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_name: !tableFilter.task_name }) }} />
//                                     {tableFilter.task_name &&
//                                         <div className="position-relative">
//                                             <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px", zIndex: 10 }}>
//                                                 <FloatingTextBox
//                                                     title={lang["title.task"]}
//                                                     initialData={taskNameFilter.name}
//                                                     setDataFunction={handleTaskNameFilterChange}
//                                                     destructFunction={() => { setTableFilter({ ...tableFilter, task_name: false }); }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     }
//                                 </th>

//                                 <th class="font-weight-bold">
//                                     {lang["task_priority"]}
//                                 </th>

//                                 <th class="font-weight-bold" style={{ width: `80px` }}>%{lang["complete"]}</th>

//                                 <th class="font-weight-bold align-center position-relative" scope="col">
//                                     {lang["confirm"]}
//                                     {/* <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_approve: !tableFilter.task_approve }) }} /> */}
//                                     {/* {tableFilter.task_approve &&
//                                     <div className="position-relative">
//                                         <div className="position-absolute shadow" style={{ top: 0, left: 0, width: "150px" }}>
//                                             <CheckList
//                                                 title={lang["confirm"]}
//                                                 initialData={confirmFilter}
//                                                 setDataFunction={addOrRemoveConfirm}
//                                                 data={confirmFilterOptions}
//                                                 destructFunction={() => { setTableFilter({ ...tableFilter, task_approve: false }); }}
//                                             />
//                                         </div>
//                                     </div>
//                                 } */}
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
//                                     {lang["log.daystart"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => {
//                                         setShowEndDateInput(false);
//                                         setShowStartDateInput(!showStartDateInput);
//                                     }} />
//                                     <FilterableDate
//                                         label={lang["log.daystart"]}
//                                         dateValue={startDateFilter}
//                                         setDateValue={setStartDateFilter}
//                                         iconLabel="Chọn ngày bắt đầu"
//                                         showDateInput={showStartDateInput}
//                                         closePopup={() => setShowStartDateInput(false)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
//                                     {lang["log.dayend"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => {
//                                         setShowStartDateInput(false);
//                                         setShowEndDateInput(!showEndDateInput);
//                                     }} />
//                                     <FilterableDate
//                                         label={lang["log.dayend"]}
//                                         dateValue={endDateFilter}
//                                         setDateValue={setEndDateFilter}
//                                         iconLabel="Chọn ngày kết thúc"
//                                         showDateInput={showEndDateInput}
//                                         closePopup={() => setShowEndDateInput(false)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `115px`, maxWidth: `115px` }}>Timeline</th>

//                                 <th class="font-weight-bold ">{lang["log.create_user"]}</th>

//                                 <th class="font-weight-bold align-center"
//                                     style={{
//                                         // position: 'sticky', 
//                                         right: 0,
//                                         // backgroundColor: '#fff',
//                                         borderLeft: '1px solid #ccc'
//                                     }} scope="col">
//                                     {lang["log.action"]}
//                                 </th>

//                             </tr>
//                         </thead>
//                         <tbody ref={tableRef}>
//                             {dataTask.filter((task) => {
//                                 let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
//                                 let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
//                                 let taskStart = new Date(task.start);
//                                 let taskEnd = new Date(task.end);
//                                 return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
//                                     (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
//                                     (!endDateFilter || taskEnd <= new Date(endDateFilter));
//                             }).map((task, index) => (
//                                 <React.Fragment key={index}>
//                                     <tr
//                                         key={index}
//                                         className={`font-weight-bold fix-layout ${isEditing && selectedRowIndex === index ? 'selected-row' : ''}`}
//                                         onClick={() => {
//                                             // setSelectedUsernames([])
//                                             handleRowClick(task.period_id, index, isEditing && selectedRowIndex === index)
//                                             setActionShow(1);
//                                             getIdStage(task);
//                                             setPeriodId(task.period_id)
//                                         }}
//                                     >
                                        
//                                         <td class="fix-layout" onClick={(event) => handleToggle(task.period_id, event)}>

//                                             {task.tasks.length > 0 ? (expandedTasks[task.period_id]
//                                                 ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
//                                                 : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
//                                             ) : <div style={{ minHeight: "25px" }}></div>
//                                             }
//                                         </td>
//                                         {/* <td>{task.period_id}</td> */}
//                                         <td>{index + 1}</td>
//                                         {/* <td class="truncate" >{task.period_name}</td> */}
//                                          <td onClick={() => setSelectedInput(`period_name_${task.period_id}`)}>
//                                             {isEditing && selectedInput === `period_name_${task.period_id}` ? (
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     value={task.period_name}
//                                                     onChange={(e) => handleInputChange(task.period_id, 'period_name', e.target.value)}
//                                                     autoFocus // Focus vào ô input khi chỉnh sửa
//                                                 />
//                                             ) : (
//                                                 <span class="truncate" >{task.period_name}</span>
//                                             )}
//                                         </td>
//                                         <td></td>
//                                         {/* <td>{task.progress}</td> */}
//                                         <td>{!isNaN(parseFloat(task.progress)) ? (parseFloat((task.progress))).toFixed(0) + '%' : 'Invalid value'}</td>
//                                         <td></td>
//                                         <td>{functions.formatDateTask(task.start)}</td>
//                                         <td>{functions.formatDateTask(task.end)}</td>
//                                         <td></td>
//                                         <td>
//                                             {task.period_members && task.period_members.length > 0 ?
//                                                 task.period_members.map(member => member.fullname).join(', ') :
//                                                 <>{lang["projectempty"]}</>
//                                             }
//                                         </td>
//                                         {/* <td style={{
//                                             // position: 'sticky',
//                                             right: 0,
//                                             backgroundColor: '#fff',
//                                             borderLeft: '1px solid #ccc !important',
//                                             boxSizing: 'border-box',
//                                         }}>
//                                             {
//                                                 (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                 <>

//                                                     <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId_addTask(task)} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                                                     <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                                                     <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                                                 </>
//                                             }
//                                         </td> */}
//                                         {/* <td>
//                                             <div style={{ minHeight: "27px" }}></div>
//                                         </td> */}
//                                         <td class="" style={{
//                                             // position: 'sticky',
//                                             right: 0,
//                                             // backgroundColor: '#fff',
//                                             // borderLeft: '1px solid #ccc !important',
//                                             boxSizing: 'border-box',
//                                         }}>
//                                             <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(task)} data-toggle="modal" data-target="#viewStage" title={lang["viewdetail"]}></i>
//                                             <i class="fa fa-eye size-24 pointer icon-margin icon-view icon-hidden"></i>


//                                         </td>
//                                     </tr>
//                                     {expandedTasks[task.period_id] && task.tasks.map((subtask, subtaskIndex) => {
//                                         const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;
//                                         return (
//                                             <>
//                                                 {/* <tr class="sub-task fix-layout" key={subtask.task_id}> */}

//                                                 <tr
//                                                     key={uniqueId}
//                                                     className={`fix-layout italic ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
//                                                     onClick={() => {
//                                                         // setSelectedUsernames([])
//                                                         handleRowClick(uniqueId)
//                                                         setActionShow(2)
//                                                         setTaskUpadte(subtask)
//                                                         getIdStage(subtask, task.period_id);
//                                                         setPeriodId(task.period_id)
//                                                         setTaskId(subtask.task_id)
//                                                     }}
//                                                 >

//                                                     <td style={{ width: "50px", paddingLeft: "20px" }} className="fix-layout" onClick={(event) => handleSubsubtaskToggle(subtask.task_id, event)}>
//                                                         {subtask.child_tasks && subtask.child_tasks.length > 0 ? (expandedSubsubtasks[subtask.task_id]
//                                                             ? <i className="fa fa-caret-down poniter toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
//                                                             : <i className="fa fa-caret-right  size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
//                                                         ) : <div style={{ height: "25px" }}></div>
//                                                         }
//                                                     </td>
//                                                     {/* <td>{subtask.task_id}</td> */}
//                                                     <td style={{ paddingLeft: "30px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}`}</td>
//                                                     <td class="truncate" style={{ paddingLeft: "20px" }}>{subtask.task_name}</td>
//                                                     <td>{getTaskPriorityLabel(subtask.task_priority)}</td>
//                                                     {subtask.child_tasks.length > 0 ? (
//                                                         <td>{!isNaN(parseFloat(subtask.progress)) ? (parseFloat(subtask.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
//                                                     ) : (
//                                                         <td style={{ height: "38px", overflowY: "hidden" }}>
//                                                             {
//                                                                 (_users.username === manageProject?.username || membersProject?.some(member => member?.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subtask.task_approve ?
//                                                                     <div class="fix-layout-input " style={{ display: 'inline-block', position: 'relative' }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className='form-control '
//                                                                             value={progressValuesTask[uniqueId] ?? ''}
//                                                                             onBlur={(e) => {

//                                                                                 if (!enterPressed) {
//                                                                                     handleProgressBlurTask(e, subtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                 }

//                                                                                 setEnterPressed(false)
//                                                                             }}

//                                                                             onFocus={(e) => { handleProgressFocusTask(subtask) }}
//                                                                             onChange={(e) => {
//                                                                                 const value = e.target.value;
//                                                                                 if (value === '' || onlyContainsNumbers(value)) {
//                                                                                     const normalizedValue = value === '' ? 0 : parseInt(value, 10);
//                                                                                     handleProgressChangeTask(normalizedValue, subtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                 }
//                                                                             }}
//                                                                             style={{ padding: "2px 4px" }}
//                                                                             onKeyDown={(e) => {
//                                                                                 if (e.key === 'Enter') {
//                                                                                     e.preventDefault();

//                                                                                     setEnterPressed(true)
//                                                                                     updateTask({
//                                                                                         ...subtask,
//                                                                                         progress: progressValuesTask[uniqueId],
//                                                                                     }, true);
//                                                                                 }
//                                                                             }}
//                                                                         />
//                                                                         <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
//                                                                     </div>
//                                                                     :
//                                                                     <div style={{ display: 'inline-block', position: 'relative' }}>
//                                                                         {!isNaN(parseFloat(progressValuesTask[uniqueId])) ? (parseFloat(progressValuesTask[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
//                                                                     </div>
//                                                             }
//                                                         </td>
//                                                     )

//                                                     }
//                                                     <td class="font-weight-bold italic-non" style={{ color: getStatusColor(subtask.task_approve ? 1 : 0), textAlign: "center" }}>
//                                                         {getStatusLabel(subtask.task_approve ? 1 : 0)}
//                                                     </td>
//                                                     <td>{functions.formatDateTask(subtask.start)}</td>
//                                                     <td>{functions.formatDateTask(subtask.end)}</td>
//                                                     <td>{functions.formatDateTask(subtask.timeline)}</td>
//                                                     <td>{subtask.members && subtask.members.length > 0 ?
//                                                         subtask.members.map(member => member.fullname).join(', ') :
//                                                         <>{lang["projectempty"]}</>
//                                                     }</td>
//                                                     <td class="" style={{
//                                                         // position: 'sticky',
//                                                         right: 0,
//                                                         // backgroundColor: '#fff',
//                                                         // borderLeft: '1px solid #ccc !important',
//                                                         boxSizing: 'border-box',
//                                                     }}>
//                                                         <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" onClick={() => getDataViewDetail(subtask, task.period_id)} data-target="#viewTask" title={lang["viewdetail"]}></i>
//                                                         {subtask.child_tasks.length > 0 ?
//                                                             <>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subtask.task_approve
//                                                                             ? (subtask.task_approve === true
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                     </>
//                                                                 }
//                                                             </>
//                                                             : <>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subtask.task_approve
//                                                                             ? (subtask.task_approve
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subtask.progress === "100.00" || subtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                     </>
//                                                                 }
//                                                             </>
//                                                         }
//                                                     </td>
//                                                 </tr>
//                                                 {expandedSubsubtasks[subtask.task_id] && subtask.child_tasks.map((subsubtask, Subtaskindex) => {
//                                                     const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${Subtaskindex}`;
//                                                     return (
//                                                         <tr
//                                                             key={uniqueId}
//                                                             className={`sub-subtask fix-layout ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
//                                                             onClick={() => {
//                                                                 // setSelectedUsernames([])
//                                                                 handleRowClick(uniqueId)
//                                                                 setActionShow(3)
//                                                                 getIdStage(subsubtask, subtask.task_id, task.period_id);
//                                                                 setPeriodId(task.period_id)
//                                                                 setTaskId(subtask.task_id)
//                                                                 setTaskUpadteChild(subsubtask)
//                                                                 setChildTask(subsubtask)
//                                                             }}
//                                                         >
//                                                             <td class="fix-layout" ></td>
//                                                             {/* <td >{subsubtask.child_task_id}</td> */}
//                                                             <td style={{ paddingLeft: "40px" }}>{`${index + 1}.${subtaskIndex + 1}.${Subtaskindex + 1}`}</td>
//                                                             <td class="truncate" style={{ paddingLeft: "40px" }}>{subsubtask.child_task_name}</td>
//                                                             <td>{getTaskPriorityLabel(subsubtask.priority)}</td>
//                                                             {/* <td>{subsubtask.progress}</td> */}
//                                                             <td style={{ height: "38px", overflowY: "hidden" }}>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || membersProject?.some(member => member.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subsubtask.approve ?
//                                                                         <div class="fix-layout-input" style={{ display: 'inline-block', position: 'relative' }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className='form-control'
//                                                                                 value={progressValues[uniqueId] ?? ''}
//                                                                                 onBlur={(e) => {
//                                                                                     if (!enterPressed) {
//                                                                                         handleProgressBlur(e, subsubtask, subtask.task_id, task.period_id, uniqueId)
//                                                                                     }
//                                                                                     setEnterPressed(false)
//                                                                                 }}
//                                                                                 onFocus={(e) => { handleProgressFocus(subsubtask) }}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.target.value;
//                                                                                     if (value === '' || onlyContainsNumbers(value)) {
//                                                                                         const normalizedValue = value === '' ? 0 : parseInt(value, 10);
//                                                                                         handleProgressChange(normalizedValue, subsubtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                     }
//                                                                                 }}
//                                                                                 style={{ padding: "2px 4px" }}
//                                                                                 onKeyDown={(e) => {
//                                                                                     if (e.key === 'Enter') {
//                                                                                         e.preventDefault();

//                                                                                         setEnterPressed(true)
//                                                                                         updateTaskChild({
//                                                                                             ...subsubtask,
//                                                                                             progress: progressValues[uniqueId],
//                                                                                         }, true);
//                                                                                     }
//                                                                                 }}
//                                                                             />
//                                                                             <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
//                                                                         </div>
//                                                                         :
//                                                                         <div style={{ display: 'inline-block', position: 'relative' }}>
//                                                                             {!isNaN(parseFloat(progressValues[uniqueId])) ? (parseFloat(progressValues[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
//                                                                         </div>
//                                                                 }
//                                                             </td>
//                                                             <td class="font-weight-bold" style={{ color: getStatusColor(subsubtask.approve ? 1 : 0), textAlign: "center" }}>
//                                                                 {getStatusLabel(subsubtask.approve ? 1 : 0)}
//                                                             </td>
//                                                             <td>{functions.formatDateTask(subsubtask.start)}</td>
//                                                             <td>{functions.formatDateTask(subsubtask.end)}</td>
//                                                             <td>{functions.formatDateTask(subsubtask.timeline)}</td>
//                                                             <td>
//                                                                 {subsubtask.members && subsubtask.members.length > 0 ?
//                                                                     subsubtask.members.map(member => member.fullname).join(', ') :
//                                                                     <>{lang["projectempty"]}</>
//                                                                 }
//                                                             </td>
//                                                             <td class="" style={{
//                                                                 // position: 'sticky',
//                                                                 right: 0,
//                                                                 // backgroundColor: '#fff',
//                                                                 // borderLeft: '1px solid #ccc !important',
//                                                                 boxSizing: 'border-box',
//                                                             }}>
//                                                                 <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(subsubtask)} data-toggle="modal" data-target="#viewTaskChild" title={lang["viewdetail"]}></i>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subsubtask.approve
//                                                                             ? (subsubtask.approve === true
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subsubtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                         {/* <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTaskChild(subsubtask, subtask.task_id, task.period_id)} data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
//                                                                         <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["delete"]}></i> */}
//                                                                     </>
//                                                                 }
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 }
//                                                 )}
//                                             </>
//                                         )
//                                     }
//                                     )}
//                                 </React.Fragment >
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 {showGantt ?
//                     (<>
//                         <div style={{
//                             width: '5px', cursor: 'col-resize', background: '#ccc',
//                             height: lenghtTask === 1 ? "30%" :
//                                 (lenghtTask === 2 ? "35%" :
//                                     (lenghtTask === 3 ? "40%" :
//                                         (lenghtTask === 4 ? "45%" :
//                                             (lenghtTask === 5 ? "50%" :
//                                                 (lenghtTask === 6 ? "60%" :
//                                                     (lenghtTask === 7 ? "70%" :
//                                                         (lenghtTask === 8 ? "75%" :
//                                                             (lenghtTask === 9 ? "80%" :
//                                                                 (lenghtTask === 10 ? "85%" :
//                                                                     (lenghtTask === 11 ? "90%" : "")))))))))),
//                         }} onMouseDown={handleMouseDown}></div>

//                         <div
//                             className="active"
//                             ref={scrollRef2}
//                             onScroll={handleScroll(scrollRef2, scrollRef1)}
//                             style={{
//                                 flex: '1',
//                                 border: '1px solid gray',
//                                 background: '#f6f6f6',
//                                 maxWidth: '100%',
//                                 height: lenghtTask === 1 ? "30%" :
//                                     (lenghtTask === 2 ? "35%" :
//                                         (lenghtTask === 3 ? "40%" :
//                                             (lenghtTask === 4 ? "45%" :
//                                                 (lenghtTask === 5 ? "50%" :
//                                                     (lenghtTask === 6 ? "60%" :
//                                                         (lenghtTask === 7 ? "70%" :
//                                                             (lenghtTask === 8 ? "75%" :
//                                                                 (lenghtTask === 9 ? "80%" :
//                                                                     (lenghtTask === 10 ? "85%" :
//                                                                         (lenghtTask === 11 ? "90%" : "")))))))))),
//                                 overflowY: 'hidden',
//                                 overflowX: 'auto'
//                             }}
//                         >
//                             {dataGantt.length > 0 && <GanttTest data={dataGantt} />}
//                         </div>
//                     </>
//                     )
//                     : null
//                 }
//                 {/* Add Task */}
//                 <div class={`modal show no-select-modal`} id="addTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["addtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModalAdd} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={task.task_name} onChange={
//                                                 (e) => { setTask({ ...task, task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={task.task_priority} onChange={(e) => { setTask({ ...task, task_priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={task.task_status} onChange={
//                                                 (e) => { setTask({ ...task, task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.start}
//                                                 onChange={
//                                                     (e) => { setTask({ ...task, start: e.target.value }) }
//                                                 } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.end} onChange={
//                                                 (e) => { setTask({ ...task, end: e.target.value }) }
//                                             } />

//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={task.start} max={task.end} className="form-control" value={task.timeline} onChange={
//                                                 (e) => { setTask({ ...task, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={task.task_description} onChange={
//                                                 (e) => { setTask({ ...task, task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.period_members?.map((user, index) => (
//                                                             <div key={index} className="user-checkbox-item">
//                                                                 <label className="pointer">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="mr-1"
//                                                                         checked={selectedUsernamesAdd.includes(user.username)}
//                                                                         onChange={(e) => handleCheckboxChangeAdd(user, e.target.checked)}
//                                                                     />
//                                                                     {user.fullname}
//                                                                 </label>
//                                                             </div>
//                                                         ))
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={submitAddTask} class="btn btn-success">{lang["btn.create"]}</button>
//                                 <button type="button" onClick={handleCloseModalAdd} id="closeModalAddTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Task */}
//                 <div class={`modal show no-select-modal`} id="editTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["edittask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskUpdate.task_name} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskUpdate.task_priority} onChange={(e) => { setTaskUpadte({ ...taskUpdate, task_priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskUpdate.task_status} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.start} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.end} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskUpdate.start} max={taskUpdate.end} className="form-control" value={taskUpdate.timeline} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskUpdate.task_description} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.period_members?.map((user, index) => {
//                                                             const isMember = selectedUsernames.includes(user.username);
//                                                             return (
//                                                                 <div key={index} className="user-checkbox-item">
//                                                                     <label class="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             value={JSON.stringify(user)}
//                                                                             checked={isMember}
//                                                                             onChange={(e) => handleCheckboxChange(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateTask} class="btn btn-success">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Task */}
//                 <div class={`modal 'show' no-select-modal`} id="viewTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.task_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.task_description} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>Timeline</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.timeline)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["create-at"]}</b></label>
//                                             <span className="d-block"> {functions.formatDate(dataViewDetail.create_at)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["creator"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.create_by?.fullname} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["task_priority"]}</b></label>
//                                             <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.task_priority)) || {}).label || dataViewDetail.task_priority}`]} </span>

//                                         </div>
//                                         {
//                                             (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&

//                                             <div class="form-group col-lg-12">
//                                                 <label><b>{lang["log.title"]}</b></label>
//                                                 {
//                                                     dataViewDetail.task_modified && dataViewDetail.task_modified.length > 0 ? (
//                                                         <>
//                                                             <div class="table-outer">
//                                                                 <table class="table-head">
//                                                                     <thead>
//                                                                         <th class="font-weight-bold align-center" style={{ width: "45px", height: "53px" }} scope="col">{lang["log.no"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["modify_what"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["oldvalue"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["newvalue"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["time"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["user change"]}</th>
//                                                                         <th class="scrollbar-measure"></th>
//                                                                     </thead>
//                                                                 </table>
//                                                                 <div class="table-body">
//                                                                     <table class="table table-striped">
//                                                                         <tbody>
//                                                                             {dataViewDetail.task_modified.reverse().map((task, index) => (
//                                                                                 <tr key={task.id}>
//                                                                                     <td scope="row" style={{ width: "50px" }}>{index + 1}</td>
//                                                                                     <td scope="row">
//                                                                                         {task.modified_what === "approve" ? lang["confirm"] :
//                                                                                             task.modified_what === "infor" ? lang["log.information"] :
//                                                                                                 task.modified_what === "status" ? lang["taskstatus"] :
//                                                                                                     task.modified_what}
//                                                                                     </td>
//                                                                                     <td scope="row">
//                                                                                         {
//                                                                                             task.old_value === true ? lang["approved"] :
//                                                                                                 task.old_value === false ? lang["await"] :
//                                                                                                     `${task.old_value}`
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td scope="row">
//                                                                                         {
//                                                                                             task.new_value === true ? lang["approved"] :
//                                                                                                 task.new_value === false ? lang["await"] :
//                                                                                                     `${task.new_value}`
//                                                                                             // `${task.new_value.slice(0, 100)}${task.new_value.length > 100 ? '...' : ''}`
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td scope="row">{functions.formatDate(task.modified_at)}</td>
//                                                                                     <td scope="row">
//                                                                                         <img class="img-responsive circle-image-cus" src={proxy + task.modified_by?.avatar} />
//                                                                                         {task.modified_by?.fullname}
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             ))}
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </div>
//                                                             </div>
//                                                         </>
//                                                     ) : (
//                                                         <div class="list_cont ">
//                                                             <p>{lang["no history yet"]}</p>
//                                                         </div>
//                                                     )
//                                                 }
//                                             </div>
//                                         }
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Add Task Child */}
//                 <div class={`modal show no-select-modal`} id="addTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["addtask"]} con</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskChild.child_task_name} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.child_task_name && <span class="error-message">{errorMessagesadd.child_task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskChild.priority} onChange={(e) => { setTaskChild({ ...taskChild, priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.priority && <span class="error-message">{errorMessagesadd.riority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskChild.child_task_status} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.start} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.end} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskChild.start} max={taskChild.end} className="form-control" value={taskChild.timeline} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskChild.child_task_description} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.child_task_description && <span class="error-message">{errorMessagesadd.child_task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.tasks.find((task) => task.task_id === taskId)
//                                                         ?.members?.map((user, index) => {
//                                                             return (
//                                                                 <div key={user.username} className="user-checkbox-item">
//                                                                     <label className="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             checked={selectedUsernamesChild.includes(user.username)}
//                                                                             onChange={(e) => handleCheckboxChangeChildAdd(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={submitAddTaskChild} class="btn btn-success">{lang["btn.create"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalAddTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Task Child */}
//                 <div class={`modal show no-select-modal`} id="editTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["edittaskchild"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskUpdateChild.child_task_name} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskUpdateChild.priority} onChange={(e) => { setTaskUpadteChild({ ...taskUpdateChild, priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskUpdateChild.child_task_status} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.start} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.end} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskUpdateChild.start} max={taskUpdateChild.end} className="form-control" value={taskUpdateChild.timeline} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskUpdateChild.child_task_description} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.tasks.find((task) => task.task_id === taskId)
//                                                         ?.members?.map((user, index) => {
//                                                             const isMember = selectedUsernamesChild.includes(user.username);
//                                                             return (
//                                                                 <div key={index} className="user-checkbox-item">
//                                                                     <label class="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             value={JSON.stringify(user)}
//                                                                             checked={isMember}
//                                                                             onChange={(e) => handleCheckboxChangeChild(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateTaskChild} class="btn btn-success">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Task Child*/}
//                 <div class={`modal 'show' no-select-modal`} id="viewTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.child_task_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.child_task_description} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>Timeline</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.timeline)} </span>
//                                         </div>


//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["create-at"]}</b></label>
//                                             <span className="d-block"> {functions.formatDate(dataViewDetail.create_at)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["creator"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.create_by?.fullname} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["task_priority"]}</b></label>
//                                             <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.priority)) || {}).label || dataViewDetail.priority}`]} </span>

//                                         </div>


//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Stage */}
//                 <div class={`modal 'show' no-select-modal`} id="editStage">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["updatestage"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["stagename"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={formData.stage_name || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_name: e.target.value }) }
//                                             } placeholder={lang["p.stagename"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_name && <span class="error-message">{errorMessagesadd.stage_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["description"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={formData.stage_description || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_description: e.target.value }) }
//                                             } placeholder={lang["p.description stage"]} />
//                                             <div style={{ minHeight: '20px' }}>

//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_start || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_start && <span class="error-message">{errorMessagesadd.stage_start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_end || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_end: e.target.value }) }
//                                             } />

//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_end && <span class="error-message">{errorMessagesadd.stage_end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="col-md-12">
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} <span className='red_star'>*</span> </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {membersProject?.map((user, index) => {
//                                                     const isMember = selectedUsernamesStage?.includes(user?.username);
//                                                     return (
//                                                         <div key={index} class="user-checkbox-item">
//                                                             <label>
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     class="mr-1"
//                                                                     value={JSON.stringify(user)}
//                                                                     checked={isMember}
//                                                                     onChange={(e) => handleCheckboxChangeStage(user, e.target.checked)}
//                                                                 />
//                                                                 {user?.fullname}
//                                                             </label>
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateStage} class="btn btn-success ">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateStage" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Stage*/}
//                 <div class={`modal 'show' no-select-modal`} id="viewStage">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.period_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.period_description || lang["no description"]} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>


//                                         <div class="form-group col-lg-4">
//                                             <label><b>%{lang["complete"]}</b></label>
//                                             <span className="d-block">{!isNaN(parseFloat(dataViewDetail.progress)) ? (parseFloat(dataViewDetail.progress)).toFixed(0) + '%' : 'Invalid value'}</span>
//                                         </div>



//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div >
//             {/* <GanttTest data={dataGantt} /> */}

//         </>

//     );
// };

// task 

const Stage = (props) => {
    const { lang, proxy, auth, functions, socket } = useSelector(state => state);
    const { project_id, version_id } = useParams();
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}
    const { removeVietnameseTones } = functions

    const [expandedTasks, setExpandedTasks] = useState({});
    const [expandedSubsubtasks, setExpandedSubsubtasks] = useState({});
    const [showGantt, setShowGantt] = useState(false);
    const [dataGantt, setGanttData] = useState([]);
    const [errorMessagesadd, setErrorMessagesadd] = useState({});

    const [dataStageUpdate, setDataStageUpdate] = useState([])
    const [periodId, setPeriodId] = useState(null)
    // console.log(dataStageUpdate.period_members)
    const [taskId, setTaskId] = useState(null)
    const [childTask, setChildTask] = useState(null)
    const [typeAction, setTypeAction] = useState(0)
    const [actionShow, setActionShow] = useState(0)
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    // console.log(actionShow)
    const [task, setTask] = useState({ task_status: 1 });
    const [taskUpdate, setTaskUpadte] = useState({});
    const [taskChild, setTaskChild] = useState({ child_task_status: 1 });

    const wrapperRef = useRef(null);
    const heights = [30, 35, 40, 45, 50, 55, 60, 65, 80]


    const [dataViewDetail, setDataViewDetail] = useState({})
    const [taskUpdateChild, setTaskUpadteChild] = useState({});

    const [formData, setFormData] = useState({});
    // console.log(formData)
    const [selectedUsernamesStage, setSelectedUsernamesStage] = useState([]);
    // console.log(selectedUsernamesStage)
    const [selectedUsernames, setSelectedUsernames] = useState([]);

    const [selectedUsernamesAdd, setSelectedUsernamesAdd] = useState([]);

    const [selectedUsernamesChild, setSelectedUsernamesChild] = useState([]);


    const handleCloseModal = () => {
        hideBackdrop()
        setSelectedUsernamesChild([])
        setSelectedRowIndex(null)
        setActionShow(0)
        setErrorMessagesadd({})
        setTask({

            task_name: '',
            task_priority: '',
            task_status: 1,
            start: '',
            end: '',
            timeline: '',
            task_description: '',
            members: []
        })

        setTaskChild({
            child_task_status: 1,
            child_task_name: "",
            priority: "",
            start: "",
            end: "",
            timeline: "",
            child_task_description: "",
            members: []
        });
    };

    const handleCloseModalAdd = () => {
        hideBackdrop()
        setSelectedUsernamesAdd([]);
        setSelectedRowIndex(null)
        setActionShow(0)
        setErrorMessagesadd({})
        setTask({

            task_name: '',
            task_priority: '',
            task_status: 1,
            start: '',
            end: '',
            timeline: '',
            task_description: '',
            members: []
        })

        setTaskChild({
            child_task_status: 1,
            child_task_name: "",
            priority: "",
            start: "",
            end: "",
            timeline: "",
            child_task_description: "",
            members: []
        })

    };

    const clearModalChild = () => {

        setSelectedUsernamesChild([])
        setErrorMessagesadd({})
        setTaskChild({
            child_task_status: 1,
            child_task_name: "",
            priority: "",
            start: "",
            end: "",
            timeline: "",
            child_task_description: "",
            members: []
        });
    };
    const [enterPressed, setEnterPressed] = useState(false);
    const [dataTask, setDataTask] = useState(props.data || []);

    const membersProject = Array.from(new Map(props?.members?.members?.map(member => [member.username, member])).values());
    const manageProject = props.members.manager
    const fullScreen = props.fullScreen
    membersProject.push(manageProject)

    useEffect(() => {
        setDataTask(props.data || []);
    }, [props.data]);

    // console.log(manageProject)
    // console.log(dataTask)
    //drop

    const [containerWidth, setContainerWidth] = useState('80%');
    const [isResizing, setIsResizing] = useState(false);
    const [lenghtTask, setLenghtTask] = useState(1);

    //Đếm tr
    const tableRef = useRef();
    useEffect(() => {
        const numberOfTR = $(tableRef.current).find('tr').length;
        setLenghtTask(numberOfTR)

    }, [dataGantt, expandedTasks]);

    const containerRef = useRef(null);
    const scrollRef1 = useRef(null);
    const scrollRef2 = useRef(null);

    useEffect(() => {
        containerRef.current = scrollRef1.current;
    }, []);

    useEffect(() => {
        if (!showGantt) {
            setContainerWidth("100%")
        } else {
            setContainerWidth("80%")
        }
    }, [showGantt]);

    const handleShowGantt = () => {
        setShowGantt(!showGantt)
    };

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

    useEffect(() => {
        $('#content').css({
            display: "flex",
            flexDirection: "column"
        })

        $('.midde_cont').css({
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        })

        $('.midde_cont .container-fluid').css({
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        })

        $('#second-row').css({
            flexGrow: 1
        })

    }, [])


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
    const handleToggle = (taskId, event) => {
        event.stopPropagation();
        const newExpandedTasks = { ...expandedTasks };
        newExpandedTasks[taskId] = !newExpandedTasks[taskId];

        // Lưu trạng thái mới vào localStorage
        localStorage.setItem('expandedTasks', JSON.stringify(newExpandedTasks));

        setExpandedTasks(newExpandedTasks);
    };



    const [isEditing, setIsEditing] = useState(false); // Thêm biến để theo dõi trạng thái chỉnh sửa
    const [focusedInput, setFocusedInput] = useState(null);
const [selectedInput, setSelectedInput] = useState(null);

    useEffect(() => {
        // Lắng nghe sự kiện click toàn cục trên trang web
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Hủy lắng nghe khi component unmount
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        // Kiểm tra xem sự kiện click có xảy ra bên ngoài phần tử bao bọc của bảng hay không
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            if (isEditing) {
                setIsEditing(false);
                setFocusedInput(null);
                setSelectedRowIndex(null); // Bỏ trạng thái chỉnh s
            }

        }
    };


    const handleRowClick = (taskId, index, isCurrentlyEditing) => {
        // Kiểm tra xem có đang trong trạng thái chỉnh sửa hay không
        if (!isCurrentlyEditing) {
            setIsEditing(true);
            setFocusedInput(taskId);
            setSelectedRowIndex(index);
        }
    };
    console.log(isEditing)
    const handleInputChange = (taskId, columnName, value) => {
        setDataTask(prevData => prevData.map(task =>
            task.period_id === taskId ? { ...task, [columnName]: value } : task
        ));
    };


    const handleSubsubtaskToggle = (childTaskId, event) => {
        event.stopPropagation();
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
    const [taskNameFilter, setTaskNameFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState(null);
    const [endDateFilter, setEndDateFilter] = useState(null);
    useEffect(() => {
        const newGanttData = dataTask.filter((task) => {
            let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
            let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
            let taskStart = new Date(task.start);
            let taskEnd = new Date(task.end);
            return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
                (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
                (!endDateFilter || taskEnd <= new Date(endDateFilter));
        }).map(period => {
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
    }, [dataTask, expandedTasks, expandedSubsubtasks, expandedTasks, taskNameFilter, startDateFilter, endDateFilter]);

    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]
    function getTaskPriorityLabel(taskPriority) {
        const item = statusPriority.find(item => item.value === parseInt(taskPriority));
        return item ? lang[item.label] || '' : '';
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
        // (taskId)
        setDataViewDetail(taskId)


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
            const newSelectedUsernames = dataTask.find(period => period.period_id === dataStageUpdate.period_id)?.period_members.map(member => member.username);
            setSelectedUsernamesStage(newSelectedUsernames);

            setFormData({
                stage_id: dataStageUpdate.period_id,
                stage_name: dataStageUpdate.period_name,
                stage_description: dataStageUpdate.period_description,
                stage_start: dataStageUpdate.start,
                stage_end: dataStageUpdate.end,
            });
        }
    }, [dataStageUpdate]);

    const handleCheckboxChangeStage = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsernamesStage(prevState => [...prevState, user.username]);
        } else {
            setSelectedUsernamesStage(prevState => prevState.filter(username => username !== user.username));
        }
    };
    const handleCheckboxChangeAdd = (user, isChecked) => {
        setSelectedUsernamesAdd(prevState => {
            if (isChecked) {
                // Thêm username nếu checkbox được chọn
                return [...prevState, user.username];
            } else {
                // Loại bỏ username nếu checkbox không được chọn
                return prevState.filter(username => username !== user.username);
            }
        });
    };
    const handleCheckboxChange = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsernames(prevState => [...prevState, user.username]);
        } else {
            setSelectedUsernames(prevState => prevState.filter(username => username !== user.username));
        }
    };

    const handleCheckboxChangeChildAdd = (user, isChecked) => {
        setSelectedUsernamesChild(prevState => {
            const isAlreadySelected = prevState.includes(user.username);
            if (isChecked && !isAlreadySelected) {
                return [...prevState, user.username];
            } else if (!isChecked && isAlreadySelected) {
                return prevState.filter(username => username !== user.username);
            } else {
                return prevState;
            }
        });
    };

    const handleCheckboxChangeChild = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsernamesChild(prevState => [...prevState, user.username]);
        } else {
            setSelectedUsernamesChild(prevState => prevState.filter(username => username !== user.username));
        }
    };


    useEffect(() => {
        // Dùng để load danh sách username của các thành viên trong task hiện tại
        if (taskUpdate && taskUpdate.members) {
            const initialSelectedUsernames = taskUpdate?.members.map(member => member.username);
            // console.log(taskUpdate)
            setSelectedUsernames(initialSelectedUsernames);
        }
    }, [taskUpdate]);

    // console.log(taskUpdate)
    useEffect(() => {
        // Dùng để load danh sách username của các thành viên trong task child hiện tại
        if (taskUpdateChild && taskUpdateChild.members) {
            const initialSelectedUsernames = taskUpdateChild?.members.map(member => member.username);
            setSelectedUsernamesChild(initialSelectedUsernames);
            // (selectedUsernamesChild)

        }
    }, [taskUpdateChild]);


    const getIdStage = (stage) => {
        setTypeAction(1)
        setDataStageUpdate(stage);
        setPeriodId(stage.period_id);

    }
    function findDifferences(memberProjectTemp, uniqueArray) {
        // console.log("123", memberProjectTemp)
        // console.log("456", uniqueArray)
        const mapTemp = new Map(memberProjectTemp.map(item => [item.username, item])) || [];
        const mapUnique = new Map(uniqueArray.map(username => [username, true]));

        // Tìm những người dùng bị xóa dựa trên 'username'
        const removedUsers = memberProjectTemp.filter(item => !mapUnique.has(item.username)).map(item => item.username);

        // Tìm những người dùng mới được thêm vào dựa trên 'username'
        const addedUsers = uniqueArray.filter(username => !mapTemp.has(username));

        let status;
        let changedUsers;
        if (removedUsers.length > 0) {
            status = 'users removed';
            changedUsers = removedUsers.map(username => ({ username }));
        } else if (addedUsers.length > 0) {
            status = 'users added';
            changedUsers = addedUsers.map(username => ({ username }));
        } else {
            status = 'no change';
            changedUsers = [];
        }

        return { status, changedUsers };
    }





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

        if (!selectedUsernamesStage || selectedUsernamesStage.length === 0) {
            errors.members = lang["error.members_stage"];
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesadd(errors);
            return;
        }

        const result = findDifferences(dataStageUpdate.period_members, selectedUsernamesStage);

        // console.log("data check", result);
        // console.log("data check 1", selectedUsernamesStage);
        let dataSocket
        if (result.status === "users added") {
            dataSocket = {
                targets: result.changedUsers,
                actor: {
                    fullname: _users.fullname,
                    username: _users.username,
                    avatar: _users.avatar
                },
                context: 'project/add-period-member',
                note: {
                    project_name: props.projectname,
                    period_name: formData.stage_name,
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
                context: 'project/remove-period-member',
                note: {
                    project_name: props.projectname,
                    period_name: formData.stage_name,
                    period_id: formData.stage_id,
                    project_id: project_id
                }
            }
        }
        const requestBody = {
            period: {
                period_name: formData.stage_name,
                start: formData.stage_start,
                period_description: formData.stage_description,
                end: formData.stage_end,
                members: selectedUsernamesStage
            }
        }
        // console.log(requestBody)
        fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
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
                    functions.showApiResponseMessage(status, false);
                    socket.emit("project/notify", dataSocket)
                    props.callDataTask()
                    $('#closeModalUpdateStage').click()
                } else {
                    functions.showApiResponseMessage(status, false);
                    props.callDataTask()
                }
            })

    };

    const handleDeleteStage = () => {


        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.stage"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            target: document.getElementById("second-row"),
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status, false);
                        setSelectedRowIndex(null)
                        setActionShow(0)
                        props.callDataTask()
                    });
            }
        });
    }

    // console.log(task)
    const submitAddTask = (e) => {

        e.preventDefault();
        task.members = selectedUsernamesAdd;
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
                // console.log(resp)
                if (resp) {
                    const { success, content, data, task, status } = resp;
                    if (success) {

                        const dataSocket = {
                            targets: selectedUsernamesAdd.map(username => ({ username })),
                            actor: {
                                fullname: _users.fullname,
                                username: _users.username,
                                avatar: _users.avatar
                            },
                            context: 'project/add-task-member',
                            note: {
                                project_name: props.projectname,
                                project_id: project_id,
                                task_id: task.task_id
                            }
                        }

                        functions.showApiResponseMessage(status, false);
                        socket.emit("project/notify", dataSocket)
                        props.callDataTask()

                        $('#closeModalAddTask').click()
                    } else {
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalAddTask').click()
                    }
                }
            })




    }
    const updateTask = (dataUpdate, useDataUpdate = false) => {

        if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
            const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
            setSelectedUsernames(initialSelectedUsernames);
        }
        taskUpdate.members = selectedUsernames;

        dataUpdate.members = selectedUsernames;

        const currentTask = useDataUpdate ? dataUpdate : taskUpdate;
        const requestBody = {
            task: currentTask,

        };
        const dataSocket = {
            targets: selectedUsernamesAdd.map(username => ({ username })),
            actor: {
                fullname: _users.fullname,
                username: _users.username,
                avatar: _users.avatar
            },
            context: 'project/add-task-member',
            note: {
                project_name: props.projectname,
                project_id: project_id,
                task_id: taskUpdate.task_id
            }
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
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalUpdateTask').click()
                    } else {
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalUpdateTask').click()
                    }
                }
            })

    };

    const handleDeleteTask = () => {

        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.task"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            target: document.getElementById("second-row"),
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {

            if (result.isConfirmed) {
                fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status, false);
                        setSelectedRowIndex(null)
                        setActionShow(0)
                        props.callDataTask()
                    });
            }
        });
    }

    const handleConfirmTask = (task, periodId) => {

        const newTaskApproveStatus = !task.task_approve;
        const requestBody = {
            task: {
                task_approve: newTaskApproveStatus
            }
        };

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

                if (success) {
                    functions.showApiResponseMessage(status, false);
                    props.callDataTask()
                } else {
                    functions.showApiResponseMessage(status, false);
                    props.callDataTask()
                }
            });
    }

    const submitAddTaskChild = (e) => {
        e.preventDefault();
        taskChild.members = selectedUsernamesChild;
        const requestBody = {
            child_task: taskChild
        }


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
        // console.log(requestBody)
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
                // console.log(resp)
                if (resp) {
                    const { success, content, data, status, child_task } = resp;
                    if (success) {
                        const dataSocket = {
                            targets: selectedUsernamesChild.map(username => ({ username })),
                            actor: {
                                fullname: _users.fullname,
                                username: _users.username,
                                avatar: _users.avatar
                            },
                            context: 'project/add-child-task-member',
                            note: {
                                project_name: props.projectname,
                                project_id: project_id,
                                child_task_id: child_task.child_task_id
                            }
                        }
                        functions.showApiResponseMessage(status, false);
                        socket.emit("project/notify", dataSocket)
                        props.callDataTask()
                        $('#closeModalAddTaskChild').click()
                    } else {
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalAddTaskChild').click()
                    }
                }
            })

    };

    const updateTaskChild = (dataUpdate, useDataUpdate = false) => {

        if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
            const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
            setSelectedUsernamesChild(initialSelectedUsernames);
        }

        taskUpdateChild.members = selectedUsernamesChild;
        dataUpdate.members = selectedUsernamesChild;

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
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalUpdateTaskChild').click()
                    } else {
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                        $('#closeModalUpdateTaskChild').click()
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
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                    } else {
                        functions.showApiResponseMessage(status, false);
                        props.callDataTask()
                    }
                }
            })
    }
    const [progressValues, setProgressValues] = useState({});
    const [progressValuesTask, setProgressValuesTask] = useState({});
    // console.log(progressValues)
    const handleProgressBlur = (e, subsubtask, taskId, periodId, uniqueId) => {

        updateTaskChild({
            ...subsubtask,
            progress: progressValues[uniqueId],
        }, true);
    };

    const handleProgressBlurTask = (e, subtask, taskId, periodId, uniqueId) => {
        // console.log(uniqueId)
        updateTask({
            ...subtask,
            progress: progressValuesTask[uniqueId],
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

    const handleProgressChangeTask = (normalizedValue, subtask, taskId, periodId, uniqueId) => {
        setProgressValuesTask(prevState => ({
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

    const handleProgressFocusTask = (childTask) => {
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

    useEffect(() => {
        const initialProgressValues = {};

        // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
        dataTask.forEach((task, taskIndex) => {
            task.tasks?.forEach((subtask, subtaskIndex) => {

                const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;

                initialProgressValues[uniqueId] = subtask.progress;

            });
        });
        setProgressValuesTask(initialProgressValues);
    }, [dataTask]);

    const handleDeleteTaskChild = () => {
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.task"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            target: document.getElementById("second-row"),
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${childTask.child_task_id}`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },

                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status, false);
                        setSelectedRowIndex(null)
                        setActionShow(0)
                        props.callDataTask()
                    });
            }
        });
    }

    // lọc để set điều kiện chọn ngày 
    const currentPeriod = dataTask.find(period => period.period_id === periodId) || [];

    const currentTask = dataTask?.flatMap((period) => period.tasks)?.find((task) => task.task_id === taskId) || [];

    //filter
    const [tableFilter, setTableFilter] = useState({ task_name: false });

    const handleTaskNameFilterChange = (e) => {
        setTaskNameFilter({ name: e.target.value });
    }

    // State để lưu giá trị lọc
    const resetTaskNameFilter = () => {
        setTaskNameFilter({ name: "" });
    }
    function showBackdrop() {

        let backdrop = document.createElement('div');
        backdrop.classList.add('custom-backdrop');

        backdrop.id = 'custom-backdrop';
        backdrop.style.display = 'block';

        document.body.appendChild(backdrop);
    }


    function hideBackdrop() {
        let backdrop = document.getElementById('custom-backdrop');
        if (backdrop) {
            backdrop.style.display = 'none';
            backdrop.parentNode.removeChild(backdrop);
        }
    }



    const [showStartDateInput, setShowStartDateInput] = useState(false);

    const [showEndDateInput, setShowEndDateInput] = useState(false);

    return (
        <>
            <div class="d-flex align-items-center mt-2" >
                <div class="custom-backdrop" id="custom-backdrop"></div>

                {/* <button class="btn btn-info" style={{ width: "115px" }} onClick={() => handleShowGantt()}>
                    {showGantt ? lang["hidden-gantt"] : lang["show-gantt"]}
                </button> */}
                <span>{props.process}%</span>
                <i class="fa fa-eye size-24 pointer ml-auto icon-view icon-hidden"></i>
                {actionShow === 1 ? (

                    (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                    <>
                        <i className={`fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
                        <i className={`fa fa-edit size-32 pointer icon-margin icon-edit ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
                        <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete ${typeAction === 1 ? '' : 'disabled_action'}`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
                    </>
                ) : actionShow === 2 ? (

                    (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                    <>
                        <i class="fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto" data-toggle="modal" onClick={() => clearModalChild()} data-target="#addTaskChild" title={lang["addtaskchild"]}></i>
                        <i class="fa fa-edit size-32 pointer icon-margin icon-edit" data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
                        <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTask()} title={lang["delete"]}></i>
                    </>

                ) : actionShow === 3 ?

                    (
                        (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                        <>
                            <i class="fa fa-edit size-32 pointer icon-margin icon-edit ml-auto" data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
                            <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTaskChild()} title={lang["delete"]}></i>
                        </>
                    ) : actionShow === 0 ?

                        (
                            (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                            <>
                                <i className={`fa fa-plus-square size-32  pointer icon-margin icon-add-task ml-auto disabled_action`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
                                <i className={`fa fa-edit size-32 pointer icon-margin icon-edit disabled_action`} onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
                                <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1  icon-delete disabled_action`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
                            </>
                        ) : null
                }
                {
                    (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                    <>
                        {/* <button type="button" class="btn btn-primary custom-buttonadd" data-toggle="modal" data-target="#addStage">
                        <i class="fa fa-plus" title={lang["addstage"]}></i>
                    </button> */}
                        <img class="img-responsive mr-1 pointer" width={32} src="/images/icon/add.png" title={lang["add stage"]} data-toggle="modal" data-target="#addStage" />

                    </>
                }

                <FontAwesomeIcon icon={faChartBar} onClick={() => handleShowGantt()} className="ml-2 size-28 pointer icon-showgantt" title={showGantt ? lang["hidden-gantt"] : lang["show-gantt"]} />
            </div>

            <div style={{ display: 'flex', width: '100%', minHeight: "30%", height: "98%", overflowY: 'auto', marginTop: "5px" }} class="no-select" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                <div
                    // ref={containerRef}
                    ref={scrollRef1}
                    onScroll={handleScroll(scrollRef1, scrollRef2)}
                    style={{
                        flex: '0 0 auto',
                        width: containerWidth,
                        border: '1px solid gray',
                        maxWidth: '100%',
                        height: lenghtTask === 1 ? "30%" :
                            (lenghtTask === 2 ? "35%" :
                                (lenghtTask === 3 ? "40%" :
                                    (lenghtTask === 4 ? "45%" :
                                        (lenghtTask === 5 ? "50%" :
                                            (lenghtTask === 6 ? "60%" :
                                                (lenghtTask === 7 ? "70%" :
                                                    (lenghtTask === 8 ? "75%" :
                                                        (lenghtTask === 9 ? "80%" :
                                                            (lenghtTask === 10 ? "85%" :
                                                                (lenghtTask === 11 ? "90%" : "")))))))))),
                        // height: heights[ lenghtTask + 1 ] ? `${heights[ lenghtTask + 1 ]}%` : "85%",
                        overflowX: 'auto'
                    }}>
                    <table ref={wrapperRef} className="table fix-layout-header-table" style={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr class="color-tr" style={{ height: "60px" }}>

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
                                            <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px", zIndex: 10 }}>
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
                                    <i className="fa fa-filter icon-view block ml-2" onClick={() => {
                                        setShowEndDateInput(false);
                                        setShowStartDateInput(!showStartDateInput);
                                    }} />
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
                                    <i className="fa fa-filter icon-view block ml-2" onClick={() => {
                                        setShowStartDateInput(false);
                                        setShowEndDateInput(!showEndDateInput);
                                    }} />
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

                                <th class="font-weight-bold align-center"
                                    style={{
                                        // position: 'sticky', 
                                        right: 0,
                                        // backgroundColor: '#fff',
                                        borderLeft: '1px solid #ccc'
                                    }} scope="col">
                                    {lang["log.action"]}
                                </th>

                            </tr>
                        </thead>
                        <tbody ref={tableRef}>
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
                                    <tr
                                        key={index}
                                        className={`font-weight-bold fix-layout ${isEditing && selectedRowIndex === index ? 'selected-row' : ''}`}
                                        onClick={() => {
                                            // setSelectedUsernames([])
                                            handleRowClick(task.period_id, index, isEditing && selectedRowIndex === index)
                                            setActionShow(1);
                                            getIdStage(task);
                                            setPeriodId(task.period_id)
                                        }}
                                    >
                                        
                                        <td class="fix-layout" onClick={(event) => handleToggle(task.period_id, event)}>

                                            {task.tasks.length > 0 ? (expandedTasks[task.period_id]
                                                ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                                : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                            ) : <div style={{ minHeight: "25px" }}></div>
                                            }
                                        </td>
                                        {/* <td>{task.period_id}</td> */}
                                        <td>{index + 1}</td>
                                        {/* <td class="truncate" >{task.period_name}</td> */}
                                         <td onClick={() => setSelectedInput(`period_name_${task.period_id}`)}>
                                            {isEditing && selectedInput === `period_name_${task.period_id}` ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={task.period_name}
                                                    onChange={(e) => handleInputChange(task.period_id, 'period_name', e.target.value)}
                                                    autoFocus // Focus vào ô input khi chỉnh sửa
                                                />
                                            ) : (
                                                <span class="truncate" >{task.period_name}</span>
                                            )}
                                        </td>
                                        <td></td>
                                        {/* <td>{task.progress}</td> */}
                                        <td>{!isNaN(parseFloat(task.progress)) ? (parseFloat((task.progress))).toFixed(0) + '%' : 'Invalid value'}</td>
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
                                        {/* <td style={{
                                            // position: 'sticky',
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
                                        </td> */}
                                        {/* <td>
                                            <div style={{ minHeight: "27px" }}></div>
                                        </td> */}
                                        <td class="" style={{
                                            // position: 'sticky',
                                            right: 0,
                                            // backgroundColor: '#fff',
                                            // borderLeft: '1px solid #ccc !important',
                                            boxSizing: 'border-box',
                                        }}>
                                            <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(task)} data-toggle="modal" data-target="#viewStage" title={lang["viewdetail"]}></i>
                                            <i class="fa fa-eye size-24 pointer icon-margin icon-view icon-hidden"></i>


                                        </td>
                                    </tr>
                                    {expandedTasks[task.period_id] && task.tasks.map((subtask, subtaskIndex) => {
                                        const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;
                                        return (
                                            <>
                                                {/* <tr class="sub-task fix-layout" key={subtask.task_id}> */}

                                                <tr
                                                    key={uniqueId}
                                                    className={`fix-layout italic ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
                                                    onClick={() => {
                                                        // setSelectedUsernames([])
                                                        handleRowClick(uniqueId)
                                                        setActionShow(2)
                                                        setTaskUpadte(subtask)
                                                        getIdStage(subtask, task.period_id);
                                                        setPeriodId(task.period_id)
                                                        setTaskId(subtask.task_id)
                                                    }}
                                                >

                                                    <td style={{ width: "50px", paddingLeft: "20px" }} className="fix-layout" onClick={(event) => handleSubsubtaskToggle(subtask.task_id, event)}>
                                                        {subtask.child_tasks && subtask.child_tasks.length > 0 ? (expandedSubsubtasks[subtask.task_id]
                                                            ? <i className="fa fa-caret-down poniter toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
                                                            : <i className="fa fa-caret-right  size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
                                                        ) : <div style={{ height: "25px" }}></div>
                                                        }
                                                    </td>
                                                    {/* <td>{subtask.task_id}</td> */}
                                                    <td style={{ paddingLeft: "30px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}`}</td>
                                                    <td class="truncate" style={{ paddingLeft: "20px" }}>{subtask.task_name}</td>
                                                    <td>{getTaskPriorityLabel(subtask.task_priority)}</td>
                                                    {subtask.child_tasks.length > 0 ? (
                                                        <td>{!isNaN(parseFloat(subtask.progress)) ? (parseFloat(subtask.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
                                                    ) : (
                                                        <td style={{ height: "38px", overflowY: "hidden" }}>
                                                            {
                                                                (_users.username === manageProject?.username || membersProject?.some(member => member?.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subtask.task_approve ?
                                                                    <div class="fix-layout-input " style={{ display: 'inline-block', position: 'relative' }}>
                                                                        <input
                                                                            type="text"
                                                                            className='form-control '
                                                                            value={progressValuesTask[uniqueId] ?? ''}
                                                                            onBlur={(e) => {

                                                                                if (!enterPressed) {
                                                                                    handleProgressBlurTask(e, subtask, subtask.task_id, task.period_id, uniqueId);
                                                                                }

                                                                                setEnterPressed(false)
                                                                            }}

                                                                            onFocus={(e) => { handleProgressFocusTask(subtask) }}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                if (value === '' || onlyContainsNumbers(value)) {
                                                                                    const normalizedValue = value === '' ? 0 : parseInt(value, 10);
                                                                                    handleProgressChangeTask(normalizedValue, subtask, subtask.task_id, task.period_id, uniqueId);
                                                                                }
                                                                            }}
                                                                            style={{ padding: "2px 4px" }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();

                                                                                    setEnterPressed(true)
                                                                                    updateTask({
                                                                                        ...subtask,
                                                                                        progress: progressValuesTask[uniqueId],
                                                                                    }, true);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
                                                                    </div>
                                                                    :
                                                                    <div style={{ display: 'inline-block', position: 'relative' }}>
                                                                        {!isNaN(parseFloat(progressValuesTask[uniqueId])) ? (parseFloat(progressValuesTask[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
                                                                    </div>
                                                            }
                                                        </td>
                                                    )

                                                    }
                                                    <td class="font-weight-bold italic-non" style={{ color: getStatusColor(subtask.task_approve ? 1 : 0), textAlign: "center" }}>
                                                        {getStatusLabel(subtask.task_approve ? 1 : 0)}
                                                    </td>
                                                    <td>{functions.formatDateTask(subtask.start)}</td>
                                                    <td>{functions.formatDateTask(subtask.end)}</td>
                                                    <td>{functions.formatDateTask(subtask.timeline)}</td>
                                                    <td>{subtask.members && subtask.members.length > 0 ?
                                                        subtask.members.map(member => member.fullname).join(', ') :
                                                        <>{lang["projectempty"]}</>
                                                    }</td>
                                                    <td class="" style={{
                                                        // position: 'sticky',
                                                        right: 0,
                                                        // backgroundColor: '#fff',
                                                        // borderLeft: '1px solid #ccc !important',
                                                        boxSizing: 'border-box',
                                                    }}>
                                                        <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" onClick={() => getDataViewDetail(subtask, task.period_id)} data-target="#viewTask" title={lang["viewdetail"]}></i>
                                                        {subtask.child_tasks.length > 0 ?
                                                            <>
                                                                {
                                                                    (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                                    <>
                                                                        {subtask.task_approve
                                                                            ? (subtask.task_approve === true
                                                                                ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                                : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                            : (subtask.progress === 100
                                                                                ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                                : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                            : <>
                                                                {
                                                                    (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
                                                                    <>
                                                                        {subtask.task_approve
                                                                            ? (subtask.task_approve
                                                                                ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                                : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                            : (subtask.progress === "100.00" || subtask.progress === 100
                                                                                ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
                                                                                : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </td>
                                                </tr>
                                                {expandedSubsubtasks[subtask.task_id] && subtask.child_tasks.map((subsubtask, Subtaskindex) => {
                                                    const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${Subtaskindex}`;
                                                    return (
                                                        <tr
                                                            key={uniqueId}
                                                            className={`sub-subtask fix-layout ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
                                                            onClick={() => {
                                                                // setSelectedUsernames([])
                                                                handleRowClick(uniqueId)
                                                                setActionShow(3)
                                                                getIdStage(subsubtask, subtask.task_id, task.period_id);
                                                                setPeriodId(task.period_id)
                                                                setTaskId(subtask.task_id)
                                                                setTaskUpadteChild(subsubtask)
                                                                setChildTask(subsubtask)
                                                            }}
                                                        >
                                                            <td class="fix-layout" ></td>
                                                            {/* <td >{subsubtask.child_task_id}</td> */}
                                                            <td style={{ paddingLeft: "40px" }}>{`${index + 1}.${subtaskIndex + 1}.${Subtaskindex + 1}`}</td>
                                                            <td class="truncate" style={{ paddingLeft: "40px" }}>{subsubtask.child_task_name}</td>
                                                            <td>{getTaskPriorityLabel(subsubtask.priority)}</td>
                                                            {/* <td>{subsubtask.progress}</td> */}
                                                            <td style={{ height: "38px", overflowY: "hidden" }}>
                                                                {
                                                                    (_users.username === manageProject?.username || membersProject?.some(member => member.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subsubtask.approve ?
                                                                        <div class="fix-layout-input" style={{ display: 'inline-block', position: 'relative' }}>
                                                                            <input
                                                                                type="text"
                                                                                className='form-control'
                                                                                value={progressValues[uniqueId] ?? ''}
                                                                                onBlur={(e) => {
                                                                                    if (!enterPressed) {
                                                                                        handleProgressBlur(e, subsubtask, subtask.task_id, task.period_id, uniqueId)
                                                                                    }
                                                                                    setEnterPressed(false)
                                                                                }}
                                                                                onFocus={(e) => { handleProgressFocus(subsubtask) }}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (value === '' || onlyContainsNumbers(value)) {
                                                                                        const normalizedValue = value === '' ? 0 : parseInt(value, 10);
                                                                                        handleProgressChange(normalizedValue, subsubtask, subtask.task_id, task.period_id, uniqueId);
                                                                                    }
                                                                                }}
                                                                                style={{ padding: "2px 4px" }}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        e.preventDefault();

                                                                                        setEnterPressed(true)
                                                                                        updateTaskChild({
                                                                                            ...subsubtask,
                                                                                            progress: progressValues[uniqueId],
                                                                                        }, true);
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
                                                            <td class="" style={{
                                                                // position: 'sticky',
                                                                right: 0,
                                                                // backgroundColor: '#fff',
                                                                // borderLeft: '1px solid #ccc !important',
                                                                boxSizing: 'border-box',
                                                            }}>
                                                                <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(subsubtask)} data-toggle="modal" data-target="#viewTaskChild" title={lang["viewdetail"]}></i>
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
                                                                        {/* <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTaskChild(subsubtask, subtask.task_id, task.period_id)} data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
                                                                        <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["delete"]}></i> */}
                                                                    </>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                )}
                                            </>
                                        )
                                    }
                                    )}
                                </React.Fragment >
                            ))}
                        </tbody>
                    </table>
                </div>
                {showGantt ?
                    (<>
                        <div style={{
                            width: '5px', cursor: 'col-resize', background: '#ccc',
                            height: lenghtTask === 1 ? "30%" :
                                (lenghtTask === 2 ? "35%" :
                                    (lenghtTask === 3 ? "40%" :
                                        (lenghtTask === 4 ? "45%" :
                                            (lenghtTask === 5 ? "50%" :
                                                (lenghtTask === 6 ? "60%" :
                                                    (lenghtTask === 7 ? "70%" :
                                                        (lenghtTask === 8 ? "75%" :
                                                            (lenghtTask === 9 ? "80%" :
                                                                (lenghtTask === 10 ? "85%" :
                                                                    (lenghtTask === 11 ? "90%" : "")))))))))),
                        }} onMouseDown={handleMouseDown}></div>

                        <div
                            className="active"
                            ref={scrollRef2}
                            onScroll={handleScroll(scrollRef2, scrollRef1)}
                            style={{
                                flex: '1',
                                border: '1px solid gray',
                                background: '#f6f6f6',
                                maxWidth: '100%',
                                height: lenghtTask === 1 ? "30%" :
                                    (lenghtTask === 2 ? "35%" :
                                        (lenghtTask === 3 ? "40%" :
                                            (lenghtTask === 4 ? "45%" :
                                                (lenghtTask === 5 ? "50%" :
                                                    (lenghtTask === 6 ? "60%" :
                                                        (lenghtTask === 7 ? "70%" :
                                                            (lenghtTask === 8 ? "75%" :
                                                                (lenghtTask === 9 ? "80%" :
                                                                    (lenghtTask === 10 ? "85%" :
                                                                        (lenghtTask === 11 ? "90%" : "")))))))))),
                                overflowY: 'hidden',
                                overflowX: 'auto'
                            }}
                        >
                            {dataGantt.length > 0 && <GanttTest data={dataGantt} />}
                        </div>
                    </>
                    )
                    : null
                }
                {/* Add Task */}
                <div class={`modal show no-select-modal`} id="addTask">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["addtask"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModalAdd} data-dismiss="modal">&times;</button>
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
                                            <label>Timeline </label>
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
                                            <label>{lang["taskmember"]} </label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.period_members?.map((user, index) => (
                                                            <div key={index} className="user-checkbox-item">
                                                                <label className="pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-1"
                                                                        checked={selectedUsernamesAdd.includes(user.username)}
                                                                        onChange={(e) => handleCheckboxChangeAdd(user, e.target.checked)}
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
                                <button type="button" onClick={handleCloseModalAdd} id="closeModalAddTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Update Task */}
                <div class={`modal show no-select-modal`} id="editTask">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                            <label>Timeline </label>
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
                                            <label>{lang["taskmember"]} </label>
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
                                <button type="button" onClick={handleCloseModal} id="closeModalUpdateTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* View Task */}
                <div class={`modal 'show' no-select-modal`} id="viewTask">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                        {
                                            (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&

                                            <div class="form-group col-lg-12">
                                                <label><b>{lang["log.title"]}</b></label>
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
                                                            <p>{lang["no history yet"]}</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        }
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
                <div class={`modal show no-select-modal`} id="addTaskChild">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                            <label>Timeline </label>
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
                                            <label>{lang["taskmember"]} </label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.tasks.find((task) => task.task_id === taskId)
                                                        ?.members?.map((user, index) => {
                                                            return (
                                                                <div key={user.username} className="user-checkbox-item">
                                                                    <label className="pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-1"
                                                                            checked={selectedUsernamesChild.includes(user.username)}
                                                                            onChange={(e) => handleCheckboxChangeChildAdd(user, e.target.checked)}
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
                                <button type="button" onClick={handleCloseModal} id="closeModalAddTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Update Task Child */}
                <div class={`modal show no-select-modal`} id="editTaskChild">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                            <label>Timeline </label>
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
                                            <label>{lang["taskmember"]} </label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {
                                                    dataTask
                                                        ?.find((period) => period.period_id === periodId)
                                                        ?.tasks.find((task) => task.task_id === taskId)
                                                        ?.members?.map((user, index) => {
                                                            const isMember = selectedUsernamesChild.includes(user.username);
                                                            return (
                                                                <div key={index} className="user-checkbox-item">
                                                                    <label class="pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-1"
                                                                            value={JSON.stringify(user)}
                                                                            checked={isMember}
                                                                            onChange={(e) => handleCheckboxChangeChild(user, e.target.checked)}
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
                                <button type="button" onClick={handleCloseModal} id="closeModalUpdateTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* View Task Child*/}
                <div class={`modal 'show' no-select-modal`} id="viewTaskChild">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                            <span className="d-block"> {dataViewDetail.child_task_name} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["description"]}</b></label>
                                            <span className="d-block"> {dataViewDetail.child_task_description} </span>
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
                                            <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.priority)) || {}).label || dataViewDetail.priority}`]} </span>

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
                {/* Update Stage */}
                <div class={`modal 'show' no-select-modal`} id="editStage">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                        <div class="form-group col-lg-12">
                                            <label>{lang["description"]} <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={formData.stage_description || ''} onChange={
                                                (e) => { setFormData({ ...formData, stage_description: e.target.value }) }
                                            } placeholder={lang["p.description stage"]} />
                                            <div style={{ minHeight: '20px' }}>

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
                                            <label>{lang["taskmember"]} <span className='red_star'>*</span> </label>
                                            {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
                                            <div class="user-checkbox-container">
                                                {membersProject?.map((user, index) => {
                                                    const isMember = selectedUsernamesStage?.includes(user?.username);
                                                    return (
                                                        <div key={index} class="user-checkbox-item">
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    class="mr-1"
                                                                    value={JSON.stringify(user)}
                                                                    checked={isMember}
                                                                    onChange={(e) => handleCheckboxChangeStage(user, e.target.checked)}
                                                                />
                                                                {user?.fullname}
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
                                <button type="button" onClick={handleCloseModal} id="closeModalUpdateStage" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* View Stage*/}
                <div class={`modal 'show' no-select-modal`} id="viewStage">
                    <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
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
                                            <span className="d-block"> {dataViewDetail.period_name} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["description"]}</b></label>
                                            <span className="d-block"> {dataViewDetail.period_description || lang["no description"]} </span>
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
                                            <label><b>%{lang["complete"]}</b></label>
                                            <span className="d-block">{!isNaN(parseFloat(dataViewDetail.progress)) ? (parseFloat(dataViewDetail.progress)).toFixed(0) + '%' : 'Invalid value'}</span>
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
            </div >
            {/* <GanttTest data={dataGantt} /> */}

        </>

    );
};


// const Stage = (props) => {
//     const { lang, proxy, auth, functions, socket } = useSelector(state => state);
//     const { project_id, version_id } = useParams();
//     const _token = localStorage.getItem("_token");
//     const stringifiedUser = localStorage.getItem("user");
//     const _users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}
//     const { removeVietnameseTones } = functions
// // console.log(props)
//     const [expandedTasks, setExpandedTasks] = useState({});
//     const [expandedSubsubtasks, setExpandedSubsubtasks] = useState({});
//     const [showGantt, setShowGantt] = useState(false);
//     const [dataGantt, setGanttData] = useState([]);
//     const [errorMessagesadd, setErrorMessagesadd] = useState({});

//     const [dataStageUpdate, setDataStageUpdate] = useState([])
//     const [periodId, setPeriodId] = useState(null)
//     // console.log(dataStageUpdate.period_members)
//     const [taskId, setTaskId] = useState(null)
//     const [childTask, setChildTask] = useState(null)
//     const [typeAction, setTypeAction] = useState(0)
//     const [actionShow, setActionShow] = useState(0)
//     const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//     // console.log(actionShow)
//     const [task, setTask] = useState({ task_status: 1 });
//     const [taskUpdate, setTaskUpadte] = useState({});
//     const [taskChild, setTaskChild] = useState({ child_task_status: 1 });

//     const wrapperRef = useRef(null);
//     const heights = [30, 35, 40, 45, 50, 55, 60, 65, 80]


//     const [dataViewDetail, setDataViewDetail] = useState({})
//     const [taskUpdateChild, setTaskUpadteChild] = useState({});

//     const [formData, setFormData] = useState({});
//     // console.log(formData)
//     const [selectedUsernamesStage, setSelectedUsernamesStage] = useState([]);
//     // console.log(selectedUsernamesStage)
//     const [selectedUsernames, setSelectedUsernames] = useState([]);

//     const [selectedUsernamesAdd, setSelectedUsernamesAdd] = useState([]);

//     const [selectedUsernamesChild, setSelectedUsernamesChild] = useState([]);


//     const handleCloseModal = () => {
//         hideBackdrop()
//         setSelectedUsernamesChild([])
//         setSelectedRowIndex(null)
//         setActionShow(0)
//         setErrorMessagesadd({})
//         setTask({

//             task_name: '',
//             task_priority: '',
//             task_status: 1,
//             start: '',
//             end: '',
//             timeline: '',
//             task_description: '',
//             members: []
//         })

//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         });
//     };

//     const handleCloseModalAdd = () => {
//         hideBackdrop()
//         setSelectedUsernamesAdd([]);
//         setSelectedRowIndex(null)
//         setActionShow(0)
//         setErrorMessagesadd({})
//         setTask({

//             task_name: '',
//             task_priority: '',
//             task_status: 1,
//             start: '',
//             end: '',
//             timeline: '',
//             task_description: '',
//             members: []
//         })

//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         })

//     };

//     const clearModalChild = () => {

//         setSelectedUsernamesChild([])
//         setErrorMessagesadd({})
//         setTaskChild({
//             child_task_status: 1,
//             child_task_name: "",
//             priority: "",
//             start: "",
//             end: "",
//             timeline: "",
//             child_task_description: "",
//             members: []
//         });
//     };
//     const [enterPressed, setEnterPressed] = useState(false);
//     const [dataTask, setDataTask] = useState(props.data || []);

//     const membersProject = Array.from(new Map(props?.members?.members?.map(member => [member.username, member])).values());
//     const manageProject = props.members.manager
//     const fullScreen = props.fullScreen
//     membersProject.push(manageProject)

//     useEffect(() => {
//         setDataTask(props.data || []);
//     }, [props.data]);

//     // console.log(manageProject)
//     // console.log(dataTask)
//     //drop

//     const [containerWidth, setContainerWidth] = useState('80%');
//     const [isResizing, setIsResizing] = useState(false);
//     const [lenghtTask, setLenghtTask] = useState(1);

//     //Đếm tr
//     const tableRef = useRef();
//     useEffect(() => {
//         const numberOfTR = $(tableRef.current).find('tr').length;
//         setLenghtTask(numberOfTR)

//     }, [dataGantt, expandedTasks]);

//     const containerRef = useRef(null);
//     const scrollRef1 = useRef(null);
//     const scrollRef2 = useRef(null);

//     useEffect(() => {
//         containerRef.current = scrollRef1.current;
//     }, []);

//     useEffect(() => {
//         if (!showGantt) {
//             setContainerWidth("100%")
//         } else {
//             setContainerWidth("80%")
//         }
//     }, [showGantt]);

//     const handleShowGantt = () => {
//         setShowGantt(!showGantt)
//     };

//     const handleScroll = (ref1, ref2) => {
//         return () => {
//             if (ref1.current && ref2.current) {
//                 ref2.current.scrollTop = ref1.current.scrollTop;
//             }
//         };
//     };

//     const handleMouseDown = useCallback(() => {
//         setIsResizing(true);
//     }, []);


//     const handleMouseUp = useCallback(() => {
//         setIsResizing(false);
//     }, []);


//     const handleMouseMove = useCallback(
//         (e) => {
//             if (isResizing && containerRef.current) {
//                 const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
//                 setContainerWidth(newWidth + 'px');
//             }
//         },
//         [isResizing]
//     );

//     const [columnWidths, setColumnWidths] = useState({
//         col1: 100,
//         col2: 100,

//     });

//     useEffect(() => {
//         let isDown = false;
//         let startX;
//         let scrollLeft;

//         const containerElement = scrollRef2.current;
//         let svgElement;

//         if (containerElement) {
//             svgElement = containerElement.querySelector('svg');
//         }

//         const onMouseDown = (e) => {
//             isDown = true;
//             svgElement.classList.add('active');
//             startX = e.pageX - svgElement.getBoundingClientRect().left;
//             scrollLeft = svgElement.scrollLeft;
//         };

//         const onMouseMove = (e) => {
//             if (!isDown) return;
//             e.preventDefault();
//             const x = e.pageX - svgElement.getBoundingClientRect().left;
//             const walk = (x - startX);
//             svgElement.scrollLeft = scrollLeft - walk;
//         };

//         const onMouseUp = () => {
//             isDown = false;
//             svgElement.classList.remove('active');
//         };

//         const onMouseLeave = () => {
//             isDown = false;
//             svgElement.classList.remove('active');
//         };

//         if (svgElement) {
//             svgElement.addEventListener('mousedown', onMouseDown);
//             svgElement.addEventListener('mousemove', onMouseMove);
//             svgElement.addEventListener('mouseup', onMouseUp);
//             svgElement.addEventListener('mouseleave', onMouseLeave);
//         }

//         return () => {
//             if (svgElement) {
//                 svgElement.removeEventListener('mousedown', onMouseDown);
//                 svgElement.removeEventListener('mousemove', onMouseMove);
//                 svgElement.removeEventListener('mouseup', onMouseUp);
//                 svgElement.removeEventListener('mouseleave', onMouseLeave);
//             }
//         };
//     }, []);

//     useEffect(() => {
//         $('#content').css({
//             display: "flex",
//             flexDirection: "column"
//         })

//         $('.midde_cont').css({
//             display: "flex",
//             flexDirection: "column",
//             flexGrow: 1,
//         })

//         $('.midde_cont .container-fluid').css({
//             display: "flex",
//             flexDirection: "column",
//             flexGrow: 1,
//         })

//         $('#second-row').css({
//             flexGrow: 1
//         })

//     }, [])


//     const handleColumnResizeMouseDown = (colIndex) => (e) => {
//         e.preventDefault();

//         let pageX = e.pageX;

//         const handleMouseMove = (e) => {
//             const offsetX = e.pageX - pageX;
//             setColumnWidths((prevWidths) => ({
//                 ...prevWidths,
//                 [`col${colIndex}`]: prevWidths[`col${colIndex}`] + offsetX,
//             }));
//             pageX = e.pageX;
//         };

//         const handleMouseUp = () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };

//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//     };
//     useEffect(() => {
//         // Khi component được mount, lấy trạng thái từ localStorage và đặt vào state
//         const savedExpandedTasks = JSON.parse(localStorage.getItem('expandedTasks')) || {};
//         const savedExpandedSubsubtasks = JSON.parse(localStorage.getItem('expandedSubsubtasks')) || {};

//         setExpandedTasks(savedExpandedTasks);
//         setExpandedSubsubtasks(savedExpandedSubsubtasks);
//     }, []);

//     // const handleToggle = (taskId) => {
//     //     const newExpandedTasks = { ...expandedTasks };
//     //     newExpandedTasks[taskId] = !newExpandedTasks[taskId];
//     //     setExpandedTasks(newExpandedTasks);

//     // };
//     // const handleSubsubtaskToggle = (childTaskId) => {
//     //     const newExpandedSubsubtasks = { ...expandedSubsubtasks };
//     //     newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];
//     //     setExpandedSubsubtasks(newExpandedSubsubtasks);
//     // };
//     const handleToggle = (taskId, event) => {
//         event.stopPropagation();
//         const newExpandedTasks = { ...expandedTasks };
//         newExpandedTasks[taskId] = !newExpandedTasks[taskId];

//         // Lưu trạng thái mới vào localStorage
//         localStorage.setItem('expandedTasks', JSON.stringify(newExpandedTasks));

//         setExpandedTasks(newExpandedTasks);
//     };



//     const [isEditing, setIsEditing] = useState(false); // Thêm biến để theo dõi trạng thái chỉnh sửa
//     const [focusedInput, setFocusedInput] = useState(null);
// const [selectedInput, setSelectedInput] = useState(null);

//     useEffect(() => {
//         // Lắng nghe sự kiện click toàn cục trên trang web
//         document.addEventListener('click', handleClickOutside);

//         return () => {
//             // Hủy lắng nghe khi component unmount
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, []);

//     const handleClickOutside = (event) => {
//         // Kiểm tra xem sự kiện click có xảy ra bên ngoài phần tử bao bọc của bảng hay không
//         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//             if (isEditing) {
//                 setIsEditing(false);
//                 setFocusedInput(null);
//                 setSelectedRowIndex(null); // Bỏ trạng thái chỉnh s
//             }

//         }
//     };


//     const handleRowClick = (taskId, index, isCurrentlyEditing) => {
//         // Kiểm tra xem có đang trong trạng thái chỉnh sửa hay không
//         if (!isCurrentlyEditing) {
//             setIsEditing(true);
//             setFocusedInput(taskId);
//             setSelectedRowIndex(index);
//         }
//     };

//     const handleRowClick2 = ( index) => {
//         // Kiểm tra xem có đang trong trạng thái chỉnh sửa hay không
       
//             setSelectedRowIndex(index);
        
//     };

//     console.log(isEditing)
//     const handleInputChange = (taskId, columnName, value) => {
//         setDataTask(prevData => prevData.map(task =>
//             task.period_id === taskId ? { ...task, [columnName]: value } : task
//         ));
//     };


//     const handleSubsubtaskToggle = (childTaskId, event) => {
//         event.stopPropagation();
//         const newExpandedSubsubtasks = { ...expandedSubsubtasks };
//         newExpandedSubsubtasks[childTaskId] = !newExpandedSubsubtasks[childTaskId];

//         // Lưu trạng thái mới vào localStorage
//         localStorage.setItem('expandedSubsubtasks', JSON.stringify(newExpandedSubsubtasks));

//         setExpandedSubsubtasks(newExpandedSubsubtasks);
//     };
//     const statusTask = [
//         StatusAprove.APROVE,
//         StatusAprove.NOTAPROVE
//     ]
//     const getStatusLabel = (statusId) => {
//         const status = statusTask.find(st => st.id === statusId);

//         return status ? lang[status.label] : 'N/A';
//     };

//     const getStatusColor = (statusId) => {
//         const status = statusTask.find(st => st.id === statusId);

//         return status ? status.color : 'N/A';
//     };
//     const [taskNameFilter, setTaskNameFilter] = useState("");
//     const [startDateFilter, setStartDateFilter] = useState(null);
//     const [endDateFilter, setEndDateFilter] = useState(null);
//     useEffect(() => {
//         const newGanttData = dataTask.filter((task) => {
//             let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
//             let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
//             let taskStart = new Date(task.start);
//             let taskEnd = new Date(task.end);
//             return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
//                 (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
//                 (!endDateFilter || taskEnd <= new Date(endDateFilter));
//         }).map(period => {
//             const tasks = expandedTasks[period.period_id]
//                 ? period.tasks.map(task => {
//                     const child_tasks = expandedTasks[period.period_id] && expandedSubsubtasks[task.task_id]
//                         ? task.child_tasks.map(child_task => {
//                             return {
//                                 ...child_task,
//                                 child_tasks: expandedSubsubtasks[child_task.child_task_id] ? child_task.child_tasks : []
//                             };
//                         })
//                         : [];
//                     return { ...task, child_tasks };
//                 })
//                 : [];
//             return { ...period, tasks };
//         });

//         setGanttData(newGanttData);
//     }, [dataTask, expandedTasks, expandedSubsubtasks, expandedTasks, taskNameFilter, startDateFilter, endDateFilter]);

//     const statusPriority = [
//         { id: 0, label: "high", value: 1, color: "#1ed085" },
//         { id: 1, label: "medium", value: 2, color: "#8884d8" },
//         { id: 2, label: "low", value: 3, color: "#ffc658" },

//     ]
//     function getTaskPriorityLabel(taskPriority) {
//         const item = statusPriority.find(item => item.value === parseInt(taskPriority));
//         return item ? lang[item.label] || '' : '';
//     }


//     const getPeriodId = (taskId, periodId) => {

//         setPeriodId(periodId);
//         setTaskId(taskId)

//     };


//     const getPeriodId_addTask = (taskId) => {
//         setPeriodId(taskId.period_id);
//     };
//     //viewdetal
//     const getDataViewDetail = (taskId, periodId) => {
//         // (taskId)
//         setDataViewDetail(taskId)


//     };

//     //info update task
//     const getInfoTask = (taskId, periodId) => {
//         setTaskId(taskId.task_id)
//         setTaskUpadte(taskId)
//         setPeriodId(periodId)

//     };
//     //info update task
//     const getInfoTaskChild = (subtask, taskId, periodId) => {
//         setTaskUpadteChild(subtask)
//         setTaskId(taskId)
//         setPeriodId(periodId);

//     };


//     useEffect(() => {
//         if (dataStageUpdate.period_id) {
//             const newSelectedUsernames = dataTask.find(period => period.period_id === dataStageUpdate.period_id)?.period_members.map(member => member.username);
//             setSelectedUsernamesStage(newSelectedUsernames);

//             setFormData({
//                 stage_id: dataStageUpdate.period_id,
//                 stage_name: dataStageUpdate.period_name,
//                 stage_description: dataStageUpdate.period_description,
//                 stage_start: dataStageUpdate.start,
//                 stage_end: dataStageUpdate.end,
//             });
//         }
//     }, [dataStageUpdate]);

//     const handleCheckboxChangeStage = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernamesStage(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernamesStage(prevState => prevState.filter(username => username !== user.username));
//         }
//     };
//     const handleCheckboxChangeAdd = (user, isChecked) => {
//         setSelectedUsernamesAdd(prevState => {
//             if (isChecked) {
//                 // Thêm username nếu checkbox được chọn
//                 return [...prevState, user.username];
//             } else {
//                 // Loại bỏ username nếu checkbox không được chọn
//                 return prevState.filter(username => username !== user.username);
//             }
//         });
//     };
//     const handleCheckboxChange = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernames(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernames(prevState => prevState.filter(username => username !== user.username));
//         }
//     };

//     const handleCheckboxChangeChildAdd = (user, isChecked) => {
//         setSelectedUsernamesChild(prevState => {
//             const isAlreadySelected = prevState.includes(user.username);
//             if (isChecked && !isAlreadySelected) {
//                 return [...prevState, user.username];
//             } else if (!isChecked && isAlreadySelected) {
//                 return prevState.filter(username => username !== user.username);
//             } else {
//                 return prevState;
//             }
//         });
//     };

//     const handleCheckboxChangeChild = (user, isChecked) => {
//         if (isChecked) {
//             setSelectedUsernamesChild(prevState => [...prevState, user.username]);
//         } else {
//             setSelectedUsernamesChild(prevState => prevState.filter(username => username !== user.username));
//         }
//     };


//     useEffect(() => {
//         // Dùng để load danh sách username của các thành viên trong task hiện tại
//         if (taskUpdate && taskUpdate.members) {
//             const initialSelectedUsernames = taskUpdate?.members.map(member => member.username);
//             // console.log(taskUpdate)
//             setSelectedUsernames(initialSelectedUsernames);
//         }
//     }, [taskUpdate]);

//     // console.log(taskUpdate)
//     useEffect(() => {
//         // Dùng để load danh sách username của các thành viên trong task child hiện tại
//         if (taskUpdateChild && taskUpdateChild.members) {
//             const initialSelectedUsernames = taskUpdateChild?.members.map(member => member.username);
//             setSelectedUsernamesChild(initialSelectedUsernames);
//             // (selectedUsernamesChild)

//         }
//     }, [taskUpdateChild]);


//     const getIdStage = (stage) => {
//         setTypeAction(1)
//         setDataStageUpdate(stage);
//         setPeriodId(stage.period_id);

//     }
//     function findDifferences(memberProjectTemp, uniqueArray) {
//         // console.log("123", memberProjectTemp)
//         // console.log("456", uniqueArray)
//         const mapTemp = new Map(memberProjectTemp.map(item => [item.username, item])) || [];
//         const mapUnique = new Map(uniqueArray.map(username => [username, true]));

//         // Tìm những người dùng bị xóa dựa trên 'username'
//         const removedUsers = memberProjectTemp.filter(item => !mapUnique.has(item.username)).map(item => item.username);

//         // Tìm những người dùng mới được thêm vào dựa trên 'username'
//         const addedUsers = uniqueArray.filter(username => !mapTemp.has(username));

//         let status;
//         let changedUsers;
//         if (removedUsers.length > 0) {
//             status = 'users removed';
//             changedUsers = removedUsers.map(username => ({ username }));
//         } else if (addedUsers.length > 0) {
//             status = 'users added';
//             changedUsers = addedUsers.map(username => ({ username }));
//         } else {
//             status = 'no change';
//             changedUsers = [];
//         }

//         return { status, changedUsers };
//     }





//     const updateStage = (e) => {
//         e.preventDefault();

//         const errors = {};
//         if (!formData.stage_name) {
//             errors.stage_name = lang["error.stagename"];
//         }
//         if (!formData.stage_start) {
//             errors.stage_start = lang["error.start"];
//         }
//         if (!formData.stage_end) {
//             errors.stage_end = lang["error.end"];
//         }
//         if (new Date(formData.stage_start) > new Date(formData.stage_end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (!selectedUsernamesStage || selectedUsernamesStage.length === 0) {
//             errors.members = lang["error.members_stage"];
//         }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         const result = findDifferences(dataStageUpdate.period_members, selectedUsernamesStage);

//         // console.log("data check", result);
//         // console.log("data check 1", selectedUsernamesStage);
//         let dataSocket
//         if (result.status === "users added") {
//             dataSocket = {
//                 targets: result.changedUsers,
//                 actor: {
//                     fullname: _users.fullname,
//                     username: _users.username,
//                     avatar: _users.avatar
//                 },
//                 context: 'project/add-period-member',
//                 note: {
//                     project_name: props.projectname,
//                     period_name: formData.stage_name,
//                     project_id: project_id
//                 }
//             }
//         } else if (result.status === "users removed") {
//             dataSocket = {
//                 targets: result.changedUsers,
//                 actor: {
//                     fullname: _users.fullname,
//                     username: _users.username,
//                     avatar: _users.avatar
//                 },
//                 context: 'project/remove-period-member',
//                 note: {
//                     project_name: props.projectname,
//                     period_name: formData.stage_name,
//                     period_id: formData.stage_id,
//                     project_id: project_id
//                 }
//             }
//         }
//         const requestBody = {
//             period: {
//                 period_name: formData.stage_name,
//                 start: formData.stage_start,
//                 period_description: formData.stage_description,
//                 end: formData.stage_end,
//                 members: selectedUsernamesStage
//             }
//         }
//         // console.log(requestBody)
//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then((res) => res.json())
//             .then((resp) => {
//                 const { success, content, data, status } = resp;
//                 if (success) {
//                     functions.showApiResponseMessage(status, false);
//                     socket.emit("project/notify", dataSocket)
//                     props.callDataTask()
//                     $('#closeModalUpdateStage').click()
//                 } else {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 }
//             })

//     };

//     const handleDeleteStage = () => {


//         Swal.fire({
//             title: lang["confirm"],
//             text: lang["delete.stage"],
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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     // console.log(task)
//     const submitAddTask = (e) => {

//         e.preventDefault();
//         task.members = selectedUsernamesAdd;
//         const requestBody = {
//             period_id: periodId,
//             task: task
//         }




//         const errors = {};
//         if (!task.task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!task.task_priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!task.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!task.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(task.start) > new Date(task.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(task.start) > new Date(task.timeline) || new Date(task.timeline) > new Date(task.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!task.task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }


//         fetch(`${proxy}/projects/project/${project_id}/task`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 // console.log(resp)
//                 if (resp) {
//                     const { success, content, data, task, status } = resp;
//                     if (success) {

//                         const dataSocket = {
//                             targets: selectedUsernamesAdd.map(username => ({ username })),
//                             actor: {
//                                 fullname: _users.fullname,
//                                 username: _users.username,
//                                 avatar: _users.avatar
//                             },
//                             context: 'project/add-task-member',
//                             note: {
//                                 project_name: props.projectname,
//                                 project_id: project_id,
//                                 task_id: task.task_id
//                             }
//                         }

//                         functions.showApiResponseMessage(status, false);
//                         socket.emit("project/notify", dataSocket)
//                         props.callDataTask()

//                         $('#closeModalAddTask').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalAddTask').click()
//                     }
//                 }
//             })




//     }
//     const updateTask = (dataUpdate, useDataUpdate = false) => {

//         if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
//             const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
//             setSelectedUsernames(initialSelectedUsernames);
//         }
//         taskUpdate.members = selectedUsernames;

//         dataUpdate.members = selectedUsernames;

//         const currentTask = useDataUpdate ? dataUpdate : taskUpdate;
//         const requestBody = {
//             task: currentTask,

//         };
//         const dataSocket = {
//             targets: selectedUsernamesAdd.map(username => ({ username })),
//             actor: {
//                 fullname: _users.fullname,
//                 username: _users.username,
//                 avatar: _users.avatar
//             },
//             context: 'project/add-task-member',
//             note: {
//                 project_name: props.projectname,
//                 project_id: project_id,
//                 task_id: taskUpdate.task_id
//             }
//         }
//         const errors = {};
//         if (!taskUpdate.task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!taskUpdate.task_priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!taskUpdate.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!taskUpdate.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(taskUpdate.start) > new Date(taskUpdate.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(taskUpdate.start) > new Date(taskUpdate.timeline) || new Date(taskUpdate.timeline) > new Date(taskUpdate.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!taskUpdate.task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskUpdate.task_id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTask').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTask').click()
//                     }
//                 }
//             })

//     };

//     const handleDeleteTask = () => {

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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     const handleConfirmTask = (task, periodId) => {

//         const newTaskApproveStatus = !task.task_approve;
//         const requestBody = {
//             task: {
//                 task_approve: newTaskApproveStatus
//             }
//         };

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${task.task_id}/approve`, {
//             method: 'PUT',
//             headers: {
//                 "content-type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody)
//         })
//             .then(res => res.json())
//             .then((resp) => {
//                 const { success, content, data, status } = resp;

//                 if (success) {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 } else {
//                     functions.showApiResponseMessage(status, false);
//                     props.callDataTask()
//                 }
//             });
//     }

//     const submitAddTaskChild = (e) => {
//         e.preventDefault();
//         taskChild.members = selectedUsernamesChild;
//         const requestBody = {
//             child_task: taskChild
//         }


//         const errors = {};
//         if (!taskChild.child_task_name) {
//             errors.child_task_name = lang["error.taskname"];
//         }
//         if (!taskChild.priority) {
//             errors.priority = lang["error.task_priority"];
//         }
//         if (!taskChild.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!taskChild.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(taskChild.start) > new Date(taskChild.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(taskChild.start) > new Date(taskChild.timeline) || new Date(taskChild.timeline) > new Date(taskChild.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!taskChild.child_task_description) {
//             errors.child_task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }
//         // console.log(requestBody)
//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {
//                 // console.log(resp)
//                 if (resp) {
//                     const { success, content, data, status, child_task } = resp;
//                     if (success) {
//                         const dataSocket = {
//                             targets: selectedUsernamesChild.map(username => ({ username })),
//                             actor: {
//                                 fullname: _users.fullname,
//                                 username: _users.username,
//                                 avatar: _users.avatar
//                             },
//                             context: 'project/add-child-task-member',
//                             note: {
//                                 project_name: props.projectname,
//                                 project_id: project_id,
//                                 child_task_id: child_task.child_task_id
//                             }
//                         }
//                         functions.showApiResponseMessage(status, false);
//                         socket.emit("project/notify", dataSocket)
//                         props.callDataTask()
//                         $('#closeModalAddTaskChild').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalAddTaskChild').click()
//                     }
//                 }
//             })

//     };

//     const updateTaskChild = (dataUpdate, useDataUpdate = false) => {

//         if (useDataUpdate && Object.keys(dataUpdate).length > 0) {
//             const initialSelectedUsernames = dataUpdate.members.map(member => member.username);
//             setSelectedUsernamesChild(initialSelectedUsernames);
//         }

//         taskUpdateChild.members = selectedUsernamesChild;
//         dataUpdate.members = selectedUsernamesChild;

//         const currentTask = useDataUpdate ? dataUpdate : taskUpdateChild;
//         const requestBody = {
//             child_task: currentTask,
//         };
//         const errors = {};
//         if (!currentTask.child_task_name) {
//             errors.task_name = lang["error.taskname"];
//         }
//         if (!currentTask.priority) {
//             errors.task_priority = lang["error.task_priority"];
//         }
//         if (!currentTask.start) {
//             errors.start = lang["error.start"];
//         }
//         if (!currentTask.end) {
//             errors.end = lang["error.end"];
//         }
//         if (new Date(currentTask.start) > new Date(currentTask.end)) {
//             errors.checkday = lang["error.checkday_end"];
//         }

//         if (new Date(currentTask.start) > new Date(currentTask.timeline) || new Date(currentTask.timeline) > new Date(currentTask.end)) {
//             errors.checkday_timeline = lang["error.checkday_timeline"];
//         }
//         if (!currentTask.child_task_description) {
//             errors.task_description = lang["error.task_description"];
//         }
//         // if (!task.members || task.members.length === 0) {
//         //     errors.members = lang["error.members"];
//         // }
//         if (Object.keys(errors).length > 0) {
//             setErrorMessagesadd(errors);
//             return;
//         }

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${currentTask.child_task_id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {

//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTaskChild').click()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                         $('#closeModalUpdateTaskChild').click()
//                     }
//                 }
//             })
//     };
//     const handleConfirmTaskChild = (subtask, taskId, periodId,) => {

//         const newTaskApproveStatus = !subtask.approve;
//         const requestBody = {
//             child_task: {
//                 approve: newTaskApproveStatus
//             },
//         };

//         fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${subtask.child_task_id}/approve`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${_token}`,
//             },
//             body: JSON.stringify(requestBody),
//         })
//             .then(res => res && res.json())
//             .then((resp) => {

//                 if (resp) {
//                     const { success, content, data, status } = resp;
//                     if (success) {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                     } else {
//                         functions.showApiResponseMessage(status, false);
//                         props.callDataTask()
//                     }
//                 }
//             })
//     }
//     const [progressValues, setProgressValues] = useState({});
//     const [progressValuesTask, setProgressValuesTask] = useState({});
//     // console.log(progressValues)
//     const handleProgressBlur = (e, subsubtask, taskId, periodId, uniqueId) => {

//         updateTaskChild({
//             ...subsubtask,
//             progress: progressValues[uniqueId],
//         }, true);
//     };

//     const handleProgressBlurTask = (e, subtask, taskId, periodId, uniqueId) => {
//         // console.log(uniqueId)
//         updateTask({
//             ...subtask,
//             progress: progressValuesTask[uniqueId],
//         }, true);
//     };

//     const handleProgressChange = (normalizedValue, subsubtask, taskId, periodId, uniqueId) => {
//         setProgressValues(prevState => ({
//             ...prevState,
//             [uniqueId]: normalizedValue,
//         }));
//         setTaskId(taskId);
//         setPeriodId(periodId);
//     };

//     const handleProgressChangeTask = (normalizedValue, subtask, taskId, periodId, uniqueId) => {
//         setProgressValuesTask(prevState => ({
//             ...prevState,
//             [uniqueId]: normalizedValue,
//         }));
//         setTaskId(taskId);
//         setPeriodId(periodId);
//     };

//     const handleProgressFocus = (childTask) => {
//         const members = childTask.members ? childTask.members : []

//         const usernames = members.map(mem => mem.username)
//         setSelectedUsernames(usernames)
//     }

//     const handleProgressFocusTask = (childTask) => {
//         const members = childTask.members ? childTask.members : []

//         const usernames = members.map(mem => mem.username)
//         setSelectedUsernames(usernames)
//     }

//     function onlyContainsNumbers(inputString) {
//         const value = parseInt(inputString, 10);
//         return !isNaN(value) && value >= 0 && value <= 100;
//     }

//     function formatPercentage(value) {
//         let num = parseFloat(value);
//         num = Math.max(0, Math.min(num, 100));
//         return num.toFixed(2) + '%';
//     }

//     useEffect(() => {
//         const initialProgressValues = {};

//         // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
//         dataTask.forEach((task, taskIndex) => {
//             task.tasks?.forEach((subtask, subtaskIndex) => {
//                 subtask.child_tasks?.forEach((subsubtask, subsubtaskIndex) => {
//                     const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${subsubtaskIndex}`;
//                     initialProgressValues[uniqueId] = subsubtask.progress;
//                 });
//             });
//         });

//         setProgressValues(initialProgressValues);
//     }, [dataTask]);

//     useEffect(() => {
//         const initialProgressValues = {};

//         // Duyệt qua mỗi task và subtask để thiết lập giá trị ban đầu
//         dataTask.forEach((task, taskIndex) => {
//             task.tasks?.forEach((subtask, subtaskIndex) => {

//                 const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;

//                 initialProgressValues[uniqueId] = subtask.progress;

//             });
//         });
//         setProgressValuesTask(initialProgressValues);
//     }, [dataTask]);

//     const handleDeleteTaskChild = () => {
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
//                 fetch(`${proxy}/projects/project/${project_id}/period/${periodId}/task/${taskId}/child/${childTask.child_task_id}`, {
//                     method: 'DELETE',
//                     headers: {
//                         "content-type": "application/json",
//                         Authorization: `${_token}`,
//                     },

//                 })
//                     .then(res => res.json())
//                     .then((resp) => {
//                         const { success, content, data, status } = resp;
//                         functions.showApiResponseMessage(status, false);
//                         setSelectedRowIndex(null)
//                         setActionShow(0)
//                         props.callDataTask()
//                     });
//             }
//         });
//     }

//     // lọc để set điều kiện chọn ngày 
//     const currentPeriod = dataTask.find(period => period.period_id === periodId) || [];

//     const currentTask = dataTask?.flatMap((period) => period.tasks)?.find((task) => task.task_id === taskId) || [];

//     //filter
//     const [tableFilter, setTableFilter] = useState({ task_name: false });

//     const handleTaskNameFilterChange = (e) => {
//         setTaskNameFilter({ name: e.target.value });
//     }

//     // State để lưu giá trị lọc
//     const resetTaskNameFilter = () => {
//         setTaskNameFilter({ name: "" });
//     }
//     function showBackdrop() {

//         let backdrop = document.createElement('div');
//         backdrop.classList.add('custom-backdrop');

//         backdrop.id = 'custom-backdrop';
//         backdrop.style.display = 'block';

//         document.body.appendChild(backdrop);
//     }


//     function hideBackdrop() {
//         let backdrop = document.getElementById('custom-backdrop');
//         if (backdrop) {
//             backdrop.style.display = 'none';
//             backdrop.parentNode.removeChild(backdrop);
//         }
//     }



//     const [showStartDateInput, setShowStartDateInput] = useState(false);

//     const [showEndDateInput, setShowEndDateInput] = useState(false);

//     return (
//         <>
//             <div class="d-flex align-items-center mt-2" >
//                 <div class="custom-backdrop" id="custom-backdrop"></div>

//                 {/* <button class="btn btn-info" style={{ width: "115px" }} onClick={() => handleShowGantt()}>
//                     {showGantt ? lang["hidden-gantt"] : lang["show-gantt"]}
//                 </button> */}
//                 <span>{props.process}%</span>
//                 <i class="fa fa-eye size-24 pointer ml-auto icon-view icon-hidden"></i>
//                 {actionShow === 1 ? (

//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         <i className={`fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                         <i className={`fa fa-edit size-32 pointer icon-margin icon-edit ${typeAction === 1 ? '' : 'disabled_action'}`} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                         <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete ${typeAction === 1 ? '' : 'disabled_action'}`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                     </>
//                 ) : actionShow === 2 ? (

//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         <i class="fa fa-plus-square size-32 pointer icon-margin icon-add-task ml-auto" data-toggle="modal" onClick={() => clearModalChild()} data-target="#addTaskChild" title={lang["addtaskchild"]}></i>
//                         <i class="fa fa-edit size-32 pointer icon-margin icon-edit" data-toggle="modal" data-target="#editTask" title={lang["edit"]}></i>
//                         <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTask()} title={lang["delete"]}></i>
//                     </>

//                 ) : actionShow === 3 ?

//                     (
//                         (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                         <>
//                             <i class="fa fa-edit size-32 pointer icon-margin icon-edit ml-auto" data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
//                             <i class="fa fa-trash-o size-32 pointer icon-margin  mb-1 icon-delete" onClick={() => handleDeleteTaskChild()} title={lang["delete"]}></i>
//                         </>
//                     ) : actionShow === 0 ?

//                         (
//                             (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                             <>
//                                 <i className={`fa fa-plus-square size-32  pointer icon-margin icon-add-task ml-auto disabled_action`} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                                 <i className={`fa fa-edit size-32 pointer icon-margin icon-edit disabled_action`} onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                                 <i class={`fa fa-trash-o size-32 pointer icon-margin  mb-1  icon-delete disabled_action`} onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                             </>
//                         ) : null
//                 }
//                 {
//                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                     <>
//                         {/* <button type="button" class="btn btn-primary custom-buttonadd" data-toggle="modal" data-target="#addStage">
//                         <i class="fa fa-plus" title={lang["addstage"]}></i>
//                     </button> */}
//                         <img class="img-responsive mr-1 pointer" width={32} src="/images/icon/add.png" title={lang["add stage"]} data-toggle="modal" data-target="#addStage" />

//                     </>
//                 }

//                 <FontAwesomeIcon icon={faChartBar} onClick={() => handleShowGantt()} className="ml-2 size-28 pointer icon-showgantt" title={showGantt ? lang["hidden-gantt"] : lang["show-gantt"]} />
//             </div>

//             <div style={{ display: 'flex', width: '100%', minHeight: "30%", height: "98%", overflowY: 'auto', marginTop: "5px" }} class="no-select" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
//                 <div
//                     // ref={containerRef}
//                     ref={scrollRef1}
//                     onScroll={handleScroll(scrollRef1, scrollRef2)}
//                     style={{
//                         flex: '0 0 auto',
//                         width: containerWidth,
//                         border: '1px solid gray',
//                         maxWidth: '100%',
//                         height: lenghtTask === 1 ? "30%" :
//                             (lenghtTask === 2 ? "35%" :
//                                 (lenghtTask === 3 ? "40%" :
//                                     (lenghtTask === 4 ? "45%" :
//                                         (lenghtTask === 5 ? "50%" :
//                                             (lenghtTask === 6 ? "60%" :
//                                                 (lenghtTask === 7 ? "70%" :
//                                                     (lenghtTask === 8 ? "75%" :
//                                                         (lenghtTask === 9 ? "80%" :
//                                                             (lenghtTask === 10 ? "85%" :
//                                                                 (lenghtTask === 11 ? "90%" : "")))))))))),
//                         // height: heights[ lenghtTask + 1 ] ? `${heights[ lenghtTask + 1 ]}%` : "85%",
//                         overflowX: 'auto'
//                     }}>
//                     <table ref={wrapperRef} className="table fix-layout-header-table" style={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
//                         <thead>
//                             <tr class="color-tr" style={{ height: "60px" }}>

//                                 {/* <th style={{ width: `${columnWidths.col1}px`, position: 'relative' }}> */}
//                                 <th style={{ minWidth: `45px`, maxWidth: `45px`, minHeight: "37px", maxHeight: "37px", position: 'relative' }}>
//                                     <div
//                                         style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
//                                         onMouseDown={handleColumnResizeMouseDown(1)}
//                                     />
//                                 </th>

//                                 {/* <th style={{ width: `${columnWidths.col2}px`, position: 'relative' }} class="font-weight-bold align-center"># */}
//                                 <th style={{ minWidth: `85px`, maxWidth: `85px`, position: 'relative' }} class="font-weight-bold align-center">#
//                                     <div
//                                         style={{ cursor: 'col-resize', width: '5px', height: '100%', position: 'absolute', right: 0, top: 0 }}
//                                         onMouseDown={handleColumnResizeMouseDown(2)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `400px`, maxWidth: `400px` }}>
//                                     {lang["title.task"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_name: !tableFilter.task_name }) }} />
//                                     {tableFilter.task_name &&
//                                         <div className="position-relative">
//                                             <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px", zIndex: 10 }}>
//                                                 <FloatingTextBox
//                                                     title={lang["title.task"]}
//                                                     initialData={taskNameFilter.name}
//                                                     setDataFunction={handleTaskNameFilterChange}
//                                                     destructFunction={() => { setTableFilter({ ...tableFilter, task_name: false }); }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     }
//                                 </th>

//                                 <th class="font-weight-bold">
//                                     {lang["task_priority"]}
//                                 </th>

//                                 <th class="font-weight-bold" style={{ width: `80px` }}>%{lang["complete"]}</th>

//                                 <th class="font-weight-bold align-center position-relative" scope="col">
//                                     {lang["confirm"]}
//                                     {/* <i className="fa fa-filter icon-view block ml-2" onClick={() => { setTableFilter({ task_approve: !tableFilter.task_approve }) }} /> */}
//                                     {/* {tableFilter.task_approve &&
//                                     <div className="position-relative">
//                                         <div className="position-absolute shadow" style={{ top: 0, left: 0, width: "150px" }}>
//                                             <CheckList
//                                                 title={lang["confirm"]}
//                                                 initialData={confirmFilter}
//                                                 setDataFunction={addOrRemoveConfirm}
//                                                 data={confirmFilterOptions}
//                                                 destructFunction={() => { setTableFilter({ ...tableFilter, task_approve: false }); }}
//                                             />
//                                         </div>
//                                     </div>
//                                 } */}
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
//                                     {lang["log.daystart"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => {
//                                         setShowEndDateInput(false);
//                                         setShowStartDateInput(!showStartDateInput);
//                                     }} />
//                                     <FilterableDate
//                                         label={lang["log.daystart"]}
//                                         dateValue={startDateFilter}
//                                         setDateValue={setStartDateFilter}
//                                         iconLabel="Chọn ngày bắt đầu"
//                                         showDateInput={showStartDateInput}
//                                         closePopup={() => setShowStartDateInput(false)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `130px`, maxWidth: `130px` }}>
//                                     {lang["log.dayend"]}
//                                     <i className="fa fa-filter icon-view block ml-2" onClick={() => {
//                                         setShowStartDateInput(false);
//                                         setShowEndDateInput(!showEndDateInput);
//                                     }} />
//                                     <FilterableDate
//                                         label={lang["log.dayend"]}
//                                         dateValue={endDateFilter}
//                                         setDateValue={setEndDateFilter}
//                                         iconLabel="Chọn ngày kết thúc"
//                                         showDateInput={showEndDateInput}
//                                         closePopup={() => setShowEndDateInput(false)}
//                                     />
//                                 </th>

//                                 <th class="font-weight-bold" style={{ minWidth: `115px`, maxWidth: `115px` }}>Timeline</th>

//                                 <th class="font-weight-bold ">{lang["log.create_user"]}</th>

//                                 <th class="font-weight-bold align-center"
//                                     style={{
//                                         // position: 'sticky', 
//                                         right: 0,
//                                         // backgroundColor: '#fff',
//                                         borderLeft: '1px solid #ccc'
//                                     }} scope="col">
//                                     {lang["log.action"]}
//                                 </th>

//                             </tr>
//                         </thead>
//                         <tbody ref={tableRef}>
//                             {dataTask.filter((task) => {
//                                 let filterText = taskNameFilter && taskNameFilter.name ? taskNameFilter.name.toLowerCase() : '';
//                                 let taskName = task && task.period_name ? task.period_name.toLowerCase() : '';
//                                 let taskStart = new Date(task.start);
//                                 let taskEnd = new Date(task.end);
//                                 return removeVietnameseTones(taskName).includes(removeVietnameseTones(filterText)) &&
//                                     (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
//                                     (!endDateFilter || taskEnd <= new Date(endDateFilter));
//                             }).map((task, index) => (
//                                 <React.Fragment key={index}>
//                                     <tr
//                                         key={index}
//                                         className={`font-weight-bold fix-layout ${isEditing && selectedRowIndex === index ? 'selected-row' : ''}`}
//                                         onClick={() => {
//                                             // setSelectedUsernames([])
//                                             handleRowClick(task.period_id, index, isEditing && selectedRowIndex === index)
//                                             setActionShow(1);
//                                             getIdStage(task);
//                                             setPeriodId(task.period_id)
//                                         }}
//                                     >
                                        
//                                         <td class="fix-layout" onClick={(event) => handleToggle(task.period_id, event)}>

//                                             {task.tasks.length > 0 ? (expandedTasks[task.period_id]
//                                                 ? <i className="fa fa-caret-down size-24 toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
//                                                 : <i className="fa fa-caret-right size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
//                                             ) : <div style={{ minHeight: "25px" }}></div>
//                                             }
//                                         </td>
//                                         {/* <td>{task.period_id}</td> */}
//                                         <td>{index + 1}</td>
//                                         {/* <td class="truncate" >{task.period_name}</td> */}
//                                          <td onClick={() => setSelectedInput(`period_name_${task.period_id}`)}>
//                                            { task.period_name}
//                                         </td>
//                                         <td></td>
//                                         {/* <td>{task.progress}</td> */}
//                                         <td>{!isNaN(parseFloat(task.progress)) ? (parseFloat((task.progress))).toFixed(0) + '%' : 'Invalid value'}</td>
//                                         <td></td>
//                                         <td>{functions.formatDateTask(task.start)}</td>
//                                         <td>{functions.formatDateTask(task.end)}</td>
//                                         <td></td>
//                                         <td>
//                                             {task.period_members && task.period_members.length > 0 ?
//                                                 task.period_members.map(member => member.fullname).join(', ') :
//                                                 <>{lang["projectempty"]}</>
//                                             }
//                                         </td>
//                                         {/* <td style={{
//                                             // position: 'sticky',
//                                             right: 0,
//                                             backgroundColor: '#fff',
//                                             borderLeft: '1px solid #ccc !important',
//                                             boxSizing: 'border-box',
//                                         }}>
//                                             {
//                                                 (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                 <>

//                                                     <i class="fa fa-plus-square size-24 pointer icon-margin icon-add" onClick={() => getPeriodId_addTask(task)} data-toggle="modal" data-target="#addTask" title={lang["addtask"]}></i>
//                                                     <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["editstage"]}></i>
//                                                     <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteStage(task)} title={lang["deletetask"]}></i>
//                                                 </>
//                                             }
//                                         </td> */}
//                                         {/* <td>
//                                             <div style={{ minHeight: "27px" }}></div>
//                                         </td> */}
//                                         <td class="" style={{
//                                             // position: 'sticky',
//                                             right: 0,
//                                             // backgroundColor: '#fff',
//                                             // borderLeft: '1px solid #ccc !important',
//                                             boxSizing: 'border-box',
//                                         }}>
//                                             <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(task)} data-toggle="modal" data-target="#viewStage" title={lang["viewdetail"]}></i>
//                                             <i class="fa fa-eye size-24 pointer icon-margin icon-view icon-hidden"></i>


//                                         </td>
//                                     </tr>
//                                     {expandedTasks[task.period_id] && task.tasks.map((subtask, subtaskIndex) => {
//                                         const uniqueId = `${task.period_id}-${subtask.task_id}-${subtaskIndex}`;
//                                         return (
//                                             <>
//                                                 {/* <tr class="sub-task fix-layout" key={subtask.task_id}> */}

//                                                 <tr
//                                                     key={uniqueId}
//                                                     className={`fix-layout italic ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
//                                                     onClick={() => {
//                                                         // setSelectedUsernames([])
//                                                         handleRowClick2(uniqueId)
//                                                         setActionShow(2)
//                                                         setTaskUpadte(subtask)
//                                                         getIdStage(subtask, task.period_id);
//                                                         setPeriodId(task.period_id)
//                                                         setTaskId(subtask.task_id)
//                                                     }}
//                                                 >

//                                                     <td style={{ width: "50px", paddingLeft: "20px" }} className="fix-layout" onClick={(event) => handleSubsubtaskToggle(subtask.task_id, event)}>
//                                                         {subtask.child_tasks && subtask.child_tasks.length > 0 ? (expandedSubsubtasks[subtask.task_id]
//                                                             ? <i className="fa fa-caret-down poniter toggle-down" aria-hidden="true" title={lang["collapse"]}></i>
//                                                             : <i className="fa fa-caret-right  size-24 toggle-right" aria-hidden="true" title={lang["expand"]}></i>
//                                                         ) : <div style={{ height: "25px" }}></div>
//                                                         }
//                                                     </td>
//                                                     {/* <td>{subtask.task_id}</td> */}
//                                                     <td style={{ paddingLeft: "30px" }}>{`${index + 1}.${task.tasks.indexOf(subtask) + 1}`}</td>
//                                                     <td class="truncate" style={{ paddingLeft: "20px" }}>{subtask.task_name}</td>
//                                                     <td>{getTaskPriorityLabel(subtask.task_priority)}</td>
//                                                     {subtask.child_tasks.length > 0 ? (
//                                                         <td>{!isNaN(parseFloat(subtask.progress)) ? (parseFloat(subtask.progress)).toFixed(0) + '%' : 'Invalid value'}</td>
//                                                     ) : (
//                                                         <td style={{ height: "38px", overflowY: "hidden" }}>
//                                                             {
//                                                                 (_users.username === manageProject?.username || membersProject?.some(member => member?.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subtask.task_approve ?
//                                                                     <div class="fix-layout-input " style={{ display: 'inline-block', position: 'relative' }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className='form-control '
//                                                                             value={progressValuesTask[uniqueId] ?? ''}
//                                                                             onBlur={(e) => {

//                                                                                 if (!enterPressed) {
//                                                                                     handleProgressBlurTask(e, subtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                 }

//                                                                                 setEnterPressed(false)
//                                                                             }}

//                                                                             onFocus={(e) => { handleProgressFocusTask(subtask) }}
//                                                                             onChange={(e) => {
//                                                                                 const value = e.target.value;
//                                                                                 if (value === '' || onlyContainsNumbers(value)) {
//                                                                                     const normalizedValue = value === '' ? 0 : parseInt(value, 10);
//                                                                                     handleProgressChangeTask(normalizedValue, subtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                 }
//                                                                             }}
//                                                                             style={{ padding: "2px 4px" }}
//                                                                             onKeyDown={(e) => {
//                                                                                 if (e.key === 'Enter') {
//                                                                                     e.preventDefault();

//                                                                                     setEnterPressed(true)
//                                                                                     updateTask({
//                                                                                         ...subtask,
//                                                                                         progress: progressValuesTask[uniqueId],
//                                                                                     }, true);
//                                                                                 }
//                                                                             }}
//                                                                         />
//                                                                         <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
//                                                                     </div>
//                                                                     :
//                                                                     <div style={{ display: 'inline-block', position: 'relative' }}>
//                                                                         {!isNaN(parseFloat(progressValuesTask[uniqueId])) ? (parseFloat(progressValuesTask[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
//                                                                     </div>
//                                                             }
//                                                         </td>
//                                                     )

//                                                     }
//                                                     <td class="font-weight-bold italic-non" style={{ color: getStatusColor(subtask.task_approve ? 1 : 0), textAlign: "center" }}>
//                                                         {getStatusLabel(subtask.task_approve ? 1 : 0)}
//                                                     </td>
//                                                     <td>{functions.formatDateTask(subtask.start)}</td>
//                                                     <td>{functions.formatDateTask(subtask.end)}</td>
//                                                     <td>{functions.formatDateTask(subtask.timeline)}</td>
//                                                     <td>{subtask.members && subtask.members.length > 0 ?
//                                                         subtask.members.map(member => member.fullname).join(', ') :
//                                                         <>{lang["projectempty"]}</>
//                                                     }</td>
//                                                     <td class="" style={{
//                                                         // position: 'sticky',
//                                                         right: 0,
//                                                         // backgroundColor: '#fff',
//                                                         // borderLeft: '1px solid #ccc !important',
//                                                         boxSizing: 'border-box',
//                                                     }}>
//                                                         <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" onClick={() => getDataViewDetail(subtask, task.period_id)} data-target="#viewTask" title={lang["viewdetail"]}></i>
//                                                         {subtask.child_tasks.length > 0 ?
//                                                             <>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subtask.task_approve
//                                                                             ? (subtask.task_approve === true
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                     </>
//                                                                 }
//                                                             </>
//                                                             : <>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subtask.task_approve
//                                                                             ? (subtask.task_approve
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subtask.progress === "100.00" || subtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTask(subtask, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                     </>
//                                                                 }
//                                                             </>
//                                                         }
//                                                     </td>
//                                                 </tr>
//                                                 {expandedSubsubtasks[subtask.task_id] && subtask.child_tasks.map((subsubtask, Subtaskindex) => {
//                                                     const uniqueId = `${task.period_id}-${subtask.task_id}-${subsubtask.task_id}-${Subtaskindex}`;
//                                                     return (
//                                                         <tr
//                                                             key={uniqueId}
//                                                             className={`sub-subtask fix-layout ${selectedRowIndex === uniqueId ? 'selected-row' : ''}`}
//                                                             onClick={() => {
//                                                                 // setSelectedUsernames([])
//                                                                 handleRowClick2(uniqueId)
//                                                                 setActionShow(3)
//                                                                 getIdStage(subsubtask, subtask.task_id, task.period_id);
//                                                                 setPeriodId(task.period_id)
//                                                                 setTaskId(subtask.task_id)
//                                                                 setTaskUpadteChild(subsubtask)
//                                                                 setChildTask(subsubtask)
//                                                             }}
//                                                         >
//                                                             <td class="fix-layout" ></td>
//                                                             {/* <td >{subsubtask.child_task_id}</td> */}
//                                                             <td style={{ paddingLeft: "40px" }}>{`${index + 1}.${subtaskIndex + 1}.${Subtaskindex + 1}`}</td>
//                                                             <td class="truncate" style={{ paddingLeft: "40px" }}>{subsubtask.child_task_name}</td>
//                                                             <td>{getTaskPriorityLabel(subsubtask.priority)}</td>
//                                                             {/* <td>{subsubtask.progress}</td> */}
//                                                             <td style={{ height: "38px", overflowY: "hidden" }}>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || membersProject?.some(member => member.username === _users.username) || ["ad", "uad"].indexOf(auth.role) !== -1) && !subsubtask.approve ?
//                                                                         <div class="fix-layout-input" style={{ display: 'inline-block', position: 'relative' }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className='form-control'
//                                                                                 value={progressValues[uniqueId] ?? ''}
//                                                                                 onBlur={(e) => {
//                                                                                     if (!enterPressed) {
//                                                                                         handleProgressBlur(e, subsubtask, subtask.task_id, task.period_id, uniqueId)
//                                                                                     }
//                                                                                     setEnterPressed(false)
//                                                                                 }}
//                                                                                 onFocus={(e) => { handleProgressFocus(subsubtask) }}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.target.value;
//                                                                                     if (value === '' || onlyContainsNumbers(value)) {
//                                                                                         const normalizedValue = value === '' ? 0 : parseInt(value, 10);
//                                                                                         handleProgressChange(normalizedValue, subsubtask, subtask.task_id, task.period_id, uniqueId);
//                                                                                     }
//                                                                                 }}
//                                                                                 style={{ padding: "2px 4px" }}
//                                                                                 onKeyDown={(e) => {
//                                                                                     if (e.key === 'Enter') {
//                                                                                         e.preventDefault();

//                                                                                         setEnterPressed(true)
//                                                                                         updateTaskChild({
//                                                                                             ...subsubtask,
//                                                                                             progress: progressValues[uniqueId],
//                                                                                         }, true);
//                                                                                     }
//                                                                                 }}
//                                                                             />
//                                                                             <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>%</span>
//                                                                         </div>
//                                                                         :
//                                                                         <div style={{ display: 'inline-block', position: 'relative' }}>
//                                                                             {!isNaN(parseFloat(progressValues[uniqueId])) ? (parseFloat(progressValues[uniqueId])).toFixed(0) + '%' : 'Invalid value'}
//                                                                         </div>
//                                                                 }
//                                                             </td>
//                                                             <td class="font-weight-bold" style={{ color: getStatusColor(subsubtask.approve ? 1 : 0), textAlign: "center" }}>
//                                                                 {getStatusLabel(subsubtask.approve ? 1 : 0)}
//                                                             </td>
//                                                             <td>{functions.formatDateTask(subsubtask.start)}</td>
//                                                             <td>{functions.formatDateTask(subsubtask.end)}</td>
//                                                             <td>{functions.formatDateTask(subsubtask.timeline)}</td>
//                                                             <td>
//                                                                 {subsubtask.members && subsubtask.members.length > 0 ?
//                                                                     subsubtask.members.map(member => member.fullname).join(', ') :
//                                                                     <>{lang["projectempty"]}</>
//                                                                 }
//                                                             </td>
//                                                             <td class="" style={{
//                                                                 // position: 'sticky',
//                                                                 right: 0,
//                                                                 // backgroundColor: '#fff',
//                                                                 // borderLeft: '1px solid #ccc !important',
//                                                                 boxSizing: 'border-box',
//                                                             }}>
//                                                                 <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => getDataViewDetail(subsubtask)} data-toggle="modal" data-target="#viewTaskChild" title={lang["viewdetail"]}></i>
//                                                                 {
//                                                                     (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&
//                                                                     <>
//                                                                         {subsubtask.approve
//                                                                             ? (subsubtask.approve === true
//                                                                                 ? <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-times-circle-o size-24 pointer icon-margin icon-close" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                             : (subsubtask.progress === 100
//                                                                                 ? <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" onClick={() => handleConfirmTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["updatestatus"]}></i>
//                                                                                 : <i class="fa fa-check-circle-o size-24 pointer icon-margin icon-check" style={{ pointerEvents: "none", opacity: 0.4 }} title={lang["updatestatus"]}></i>)
//                                                                         }
//                                                                         {/* <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getInfoTaskChild(subsubtask, subtask.task_id, task.period_id)} data-toggle="modal" data-target="#editTaskChild" title={lang["edit"]}></i>
//                                                                         <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTaskChild(subsubtask, subtask.task_id, task.period_id)} title={lang["delete"]}></i> */}
//                                                                     </>
//                                                                 }
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 }
//                                                 )}
//                                             </>
//                                         )
//                                     }
//                                     )}
//                                 </React.Fragment >
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 {showGantt ?
//                     (<>
//                         <div style={{
//                             width: '5px', cursor: 'col-resize', background: '#ccc',
//                             height: lenghtTask === 1 ? "30%" :
//                                 (lenghtTask === 2 ? "35%" :
//                                     (lenghtTask === 3 ? "40%" :
//                                         (lenghtTask === 4 ? "45%" :
//                                             (lenghtTask === 5 ? "50%" :
//                                                 (lenghtTask === 6 ? "60%" :
//                                                     (lenghtTask === 7 ? "70%" :
//                                                         (lenghtTask === 8 ? "75%" :
//                                                             (lenghtTask === 9 ? "80%" :
//                                                                 (lenghtTask === 10 ? "85%" :
//                                                                     (lenghtTask === 11 ? "90%" : "")))))))))),
//                         }} onMouseDown={handleMouseDown}></div>

//                         <div
//                             className="active"
//                             ref={scrollRef2}
//                             onScroll={handleScroll(scrollRef2, scrollRef1)}
//                             style={{
//                                 flex: '1',
//                                 border: '1px solid gray',
//                                 background: '#f6f6f6',
//                                 maxWidth: '100%',
//                                 height: lenghtTask === 1 ? "30%" :
//                                     (lenghtTask === 2 ? "35%" :
//                                         (lenghtTask === 3 ? "40%" :
//                                             (lenghtTask === 4 ? "45%" :
//                                                 (lenghtTask === 5 ? "50%" :
//                                                     (lenghtTask === 6 ? "60%" :
//                                                         (lenghtTask === 7 ? "70%" :
//                                                             (lenghtTask === 8 ? "75%" :
//                                                                 (lenghtTask === 9 ? "80%" :
//                                                                     (lenghtTask === 10 ? "85%" :
//                                                                         (lenghtTask === 11 ? "90%" : "")))))))))),
//                                 overflowY: 'hidden',
//                                 overflowX: 'auto'
//                             }}
//                         >
//                             {dataGantt.length > 0 && <GanttTest data={dataGantt} />}
//                         </div>
//                     </>
//                     )
//                     : null
//                 }
//                 {/* Add Task */}
//                 <div class={`modal show no-select-modal`} id="addTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["addtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModalAdd} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={task.task_name} onChange={
//                                                 (e) => { setTask({ ...task, task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={task.task_priority} onChange={(e) => { setTask({ ...task, task_priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={task.task_status} onChange={
//                                                 (e) => { setTask({ ...task, task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.start}
//                                                 onChange={
//                                                     (e) => { setTask({ ...task, start: e.target.value }) }
//                                                 } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={task.end} onChange={
//                                                 (e) => { setTask({ ...task, end: e.target.value }) }
//                                             } />

//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={task.start} max={task.end} className="form-control" value={task.timeline} onChange={
//                                                 (e) => { setTask({ ...task, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={task.task_description} onChange={
//                                                 (e) => { setTask({ ...task, task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.period_members?.map((user, index) => (
//                                                             <div key={index} className="user-checkbox-item">
//                                                                 <label className="pointer">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="mr-1"
//                                                                         checked={selectedUsernamesAdd.includes(user.username)}
//                                                                         onChange={(e) => handleCheckboxChangeAdd(user, e.target.checked)}
//                                                                     />
//                                                                     {user.fullname}
//                                                                 </label>
//                                                             </div>
//                                                         ))
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={submitAddTask} class="btn btn-success">{lang["btn.create"]}</button>
//                                 <button type="button" onClick={handleCloseModalAdd} id="closeModalAddTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Task */}
//                 <div class={`modal show no-select-modal`} id="editTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["edittask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskUpdate.task_name} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskUpdate.task_priority} onChange={(e) => { setTaskUpadte({ ...taskUpdate, task_priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskUpdate.task_status} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.start} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentPeriod.start} max={currentPeriod.end} className="form-control" value={taskUpdate.end} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskUpdate.start} max={taskUpdate.end} className="form-control" value={taskUpdate.timeline} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskUpdate.task_description} onChange={
//                                                 (e) => { setTaskUpadte({ ...taskUpdate, task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.period_members?.map((user, index) => {
//                                                             const isMember = selectedUsernames.includes(user.username);
//                                                             return (
//                                                                 <div key={index} className="user-checkbox-item">
//                                                                     <label class="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             value={JSON.stringify(user)}
//                                                                             checked={isMember}
//                                                                             onChange={(e) => handleCheckboxChange(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateTask} class="btn btn-success">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateTask" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Task */}
//                 <div class={`modal 'show' no-select-modal`} id="viewTask">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.task_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> 
//                                             {dataViewDetail.task_description && dataViewDetail.task_description.split('\n').map(s => <span style={{ display: "block" }}>{s}</span>)}
//                                              </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>Timeline</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.timeline)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["create-at"]}</b></label>
//                                             <span className="d-block"> {functions.formatDate(dataViewDetail.create_at)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["creator"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.create_by?.fullname} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["task_priority"]}</b></label>
//                                             <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.task_priority)) || {}).label || dataViewDetail.task_priority}`]} </span>

//                                         </div>
//                                         {
//                                             (_users.username === manageProject?.username || ["ad", "uad"].indexOf(auth.role) !== -1) &&

//                                             <div class="form-group col-lg-12">
//                                                 <label><b>{lang["log.title"]}</b></label>
//                                                 {
//                                                     dataViewDetail.task_modified && dataViewDetail.task_modified.length > 0 ? (
//                                                         <>
//                                                             <div class="table-outer">
//                                                                 <table class="table-head">
//                                                                     <thead>
//                                                                         <th class="font-weight-bold align-center" style={{ width: "45px", height: "53px" }} scope="col">{lang["log.no"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["modify_what"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["oldvalue"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["newvalue"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["time"]}</th>
//                                                                         <th class="font-weight-bold align-center" scope="col">{lang["user change"]}</th>
//                                                                         <th class="scrollbar-measure"></th>
//                                                                     </thead>
//                                                                 </table>
//                                                                 <div class="table-body">
//                                                                     <table class="table table-striped">
//                                                                         <tbody>
//                                                                             {dataViewDetail.task_modified.reverse().map((task, index) => (
//                                                                                 <tr key={task.id}>
//                                                                                     <td scope="row" style={{ width: "50px" }}>{index + 1}</td>
//                                                                                     <td scope="row">
//                                                                                         {task.modified_what === "approve" ? lang["confirm"] :
//                                                                                             task.modified_what === "infor" ? lang["log.information"] :
//                                                                                                 task.modified_what === "status" ? lang["taskstatus"] :
//                                                                                                     task.modified_what}
//                                                                                     </td>
//                                                                                     <td scope="row">
//                                                                                         {
//                                                                                             task.old_value === true ? lang["approved"] :
//                                                                                                 task.old_value === false ? lang["await"] :
//                                                                                                     `${task.old_value}`
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td scope="row">
//                                                                                         {
//                                                                                             task.new_value === true ? lang["approved"] :
//                                                                                                 task.new_value === false ? lang["await"] :
//                                                                                                     `${task.new_value}`
//                                                                                             // `${task.new_value.slice(0, 100)}${task.new_value.length > 100 ? '...' : ''}`
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td scope="row">{functions.formatDate(task.modified_at)}</td>
//                                                                                     <td scope="row">
//                                                                                         <img class="img-responsive circle-image-cus" src={proxy + task.modified_by?.avatar} />
//                                                                                         {task.modified_by?.fullname}
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             ))}
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </div>
//                                                             </div>
//                                                         </>
//                                                     ) : (
//                                                         <div class="list_cont ">
//                                                             <p>{lang["no history yet"]}</p>
//                                                         </div>
//                                                     )
//                                                 }
//                                             </div>
//                                         }
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Add Task Child */}
//                 <div class={`modal show no-select-modal`} id="addTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["addtask"]} con</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskChild.child_task_name} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.child_task_name && <span class="error-message">{errorMessagesadd.child_task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskChild.priority} onChange={(e) => { setTaskChild({ ...taskChild, priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.priority && <span class="error-message">{errorMessagesadd.riority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskChild.child_task_status} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.start} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskChild.end} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskChild.start} max={taskChild.end} className="form-control" value={taskChild.timeline} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskChild.child_task_description} onChange={
//                                                 (e) => { setTaskChild({ ...taskChild, child_task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.child_task_description && <span class="error-message">{errorMessagesadd.child_task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.tasks.find((task) => task.task_id === taskId)
//                                                         ?.members?.map((user, index) => {
//                                                             return (
//                                                                 <div key={user.username} className="user-checkbox-item">
//                                                                     <label className="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             checked={selectedUsernamesChild.includes(user.username)}
//                                                                             onChange={(e) => handleCheckboxChangeChildAdd(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={submitAddTaskChild} class="btn btn-success">{lang["btn.create"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalAddTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Task Child */}
//                 <div class={`modal show no-select-modal`} id="editTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["edittaskchild"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskname"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={taskUpdateChild.child_task_name} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_name: e.target.value }) }
//                                             } placeholder={lang["p.taskname"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_name && <span class="error-message">{errorMessagesadd.task_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12 ">
//                                             <label>{lang["task_priority"]} <span className='red_star'>*</span></label>
//                                             <select className="form-control" value={taskUpdateChild.priority} onChange={(e) => { setTaskUpadteChild({ ...taskUpdateChild, priority: e.target.value }) }}>
//                                                 <option value="">{lang["choose"]}</option>
//                                                 {statusPriority.map((status, index) => {
//                                                     return (
//                                                         <option key={index} value={status.value}>{lang[status.label]}</option>
//                                                     );
//                                                 })}
//                                             </select>
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_priority && <span class="error-message">{errorMessagesadd.task_priority}</span>}
//                                             </div>
//                                             <input type="hidden" class="form-control" value={taskUpdateChild.child_task_status} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_status: e.target.value }) }
//                                             } />
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.start} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.start && <span class="error-message">{errorMessagesadd.start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min={currentTask.start} max={currentTask.end} className="form-control" value={taskUpdateChild.end} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, end: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.end && <span class="error-message">{errorMessagesadd.end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-6"></div>
//                                         <div class="form-group col-lg-6">
//                                             {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>Timeline </label>
//                                             <input type="date" min={taskUpdateChild.start} max={taskUpdateChild.end} className="form-control" value={taskUpdateChild.timeline} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, timeline: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday_timeline && <span class="error-message">{errorMessagesadd.checkday_timeline}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["p.description"]} <span className='red_star'>*</span></label>
//                                             <textarea rows="4" type="text" class="form-control" value={taskUpdateChild.child_task_description} onChange={
//                                                 (e) => { setTaskUpadteChild({ ...taskUpdateChild, child_task_description: e.target.value }) }
//                                             } placeholder={lang["p.description"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.task_description && <span class="error-message">{errorMessagesadd.task_description}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {
//                                                     dataTask
//                                                         ?.find((period) => period.period_id === periodId)
//                                                         ?.tasks.find((task) => task.task_id === taskId)
//                                                         ?.members?.map((user, index) => {
//                                                             const isMember = selectedUsernamesChild.includes(user.username);
//                                                             return (
//                                                                 <div key={index} className="user-checkbox-item">
//                                                                     <label class="pointer">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="mr-1"
//                                                                             value={JSON.stringify(user)}
//                                                                             checked={isMember}
//                                                                             onChange={(e) => handleCheckboxChangeChild(user, e.target.checked)}
//                                                                         />
//                                                                         {user.fullname}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateTaskChild} class="btn btn-success">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateTaskChild" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Task Child*/}
//                 <div class={`modal 'show' no-select-modal`} id="viewTaskChild">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.child_task_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> 
//                                             {dataViewDetail.child_task_description && dataViewDetail.child_task_description.split('\n').map(s => <span style={{ display: "block" }}>{s}</span>)}
//                                             </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>Timeline</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.timeline)} </span>
//                                         </div>


//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["create-at"]}</b></label>
//                                             <span className="d-block"> {functions.formatDate(dataViewDetail.create_at)} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["creator"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.create_by?.fullname} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["task_priority"]}</b></label>
//                                             <span className="d-block"> {lang[`${(statusPriority.find((s) => s.value === Number(dataViewDetail.priority)) || {}).label || dataViewDetail.priority}`]} </span>

//                                         </div>


//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Update Stage */}
//                 <div class={`modal 'show' no-select-modal`} id="editStage">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["updatestage"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["stagename"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={formData.stage_name || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_name: e.target.value }) }
//                                             } placeholder={lang["p.stagename"]} />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_name && <span class="error-message">{errorMessagesadd.stage_name}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["description"]} <span className='red_star'>*</span></label>
//                                             <input type="text" class="form-control" value={formData.stage_description || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_description: e.target.value }) }
//                                             } placeholder={lang["p.description stage"]} />
//                                             <div style={{ minHeight: '20px' }}>

//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_start || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_start: e.target.value }) }
//                                             } />
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_start && <span class="error-message">{errorMessagesadd.stage_start}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6">
//                                             <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
//                                             <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={formData.stage_end || ''} onChange={
//                                                 (e) => { setFormData({ ...formData, stage_end: e.target.value }) }
//                                             } />

//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.stage_end && <span class="error-message">{errorMessagesadd.stage_end}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="col-md-12">
//                                             <div style={{ minHeight: '20px' }}>
//                                                 {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>}
//                                             </div>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label>{lang["taskmember"]} <span className='red_star'>*</span> </label>
//                                             {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>}
//                                             <div class="user-checkbox-container">
//                                                 {membersProject?.map((user, index) => {
//                                                     const isMember = selectedUsernamesStage?.includes(user?.username);
//                                                     return (
//                                                         <div key={index} class="user-checkbox-item">
//                                                             <label>
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     class="mr-1"
//                                                                     value={JSON.stringify(user)}
//                                                                     checked={isMember}
//                                                                     onChange={(e) => handleCheckboxChangeStage(user, e.target.checked)}
//                                                                 />
//                                                                 {user?.fullname}
//                                                             </label>
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={updateStage} class="btn btn-success ">{lang["btn.update"]}</button>
//                                 <button type="button" onClick={handleCloseModal} id="closeModalUpdateStage" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* View Stage*/}
//                 <div class={`modal 'show' no-select-modal`} id="viewStage">
//                     <div class={`modal-dialog modal-dialog-center ${fullScreen ? "fake-model-bg" : ""}`}>
//                         <div class="modal-content">
//                             <div class="modal-header">
//                                 <h4 class="modal-title">{lang["detailtask"]}</h4>
//                                 <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
//                             </div>
//                             <div class="modal-body">
//                                 <form>
//                                     <div class="row">
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["taskname"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.period_name} </span>
//                                         </div>
//                                         <div class="form-group col-lg-12">
//                                             <label><b>{lang["description"]}</b></label>
//                                             <span className="d-block"> {dataViewDetail.period_description || lang["no description"]} </span>
//                                         </div>
//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.daystart"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.start)} </span>
//                                         </div>

//                                         <div class="form-group col-lg-4">
//                                             <label><b>{lang["log.dayend"]}</b></label>
//                                             <span className="d-block"> {functions.formatDateTask(dataViewDetail.end)} </span>
//                                         </div>


//                                         <div class="form-group col-lg-4">
//                                             <label><b>%{lang["complete"]}</b></label>
//                                             <span className="d-block">{!isNaN(parseFloat(dataViewDetail.progress)) ? (parseFloat(dataViewDetail.progress)).toFixed(0) + '%' : 'Invalid value'}</span>
//                                         </div>



//                                     </div>
//                                 </form>
//                             </div>
//                             <div class="modal-footer">
//                                 <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div >
//             {/* <GanttTest data={dataGantt} /> */}

//         </>

//     );
// };


export default Stage;
