import { da } from 'date-fns/locale';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// const data = [
//     { id: 1, name: 'Task 1', duration: '5 days', start: '2023-09-01', end: '2023-09-06', subtasks: [] },
//     {
//         id: 2, name: 'Task 2', duration: '3 days', start: '2023-09-07', end: '2023-09-10',
//         subtasks: [
//             { id: 2.1, name: 'Subtask 1', duration: '1 day', start: '2023-09-07', end: '2023-09-08' },
//             { id: 2.2, name: 'Subtask 2', duration: '2 days', start: '2023-09-08', end: '2023-09-10' }
//         ]
//     },
//     {
//         id: 3, name: 'Task 2', duration: '3 days', start: '2023-09-07', end: '2023-09-10',
//         subtasks: [
//             { id: 3.1, name: 'Subtask 1', duration: '1 day', start: '2023-09-07', end: '2023-09-08' },
//             { id: 3.2, name: 'Subtask 2', duration: '2 days', start: '2023-09-08', end: '2023-09-10' }
//         ]
//     }
// ];

const Stage = (props) => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const [expandedTasks, setExpandedTasks] = useState({});
    const dataTask = props.data
    const [dataStageUpdate, setdataStageUpdate] = useState([])
    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const handleCloseModal = () => {
        // setErrorMessagesadd({})
    };
    console.log(selectedUsernames)
    const membersProject = props.members.members
    console.log(dataTask)
    const handleToggle = (taskId) => {
        const newExpandedTasks = { ...expandedTasks };
        newExpandedTasks[taskId] = !newExpandedTasks[taskId];
        setExpandedTasks(newExpandedTasks);
    };
    const getIdStage = (stageid) => {
        setdataStageUpdate(stageid)
    }
    const handleCheckboxChange = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsernames(prevState => [...prevState, user.username]);
        } else {
            setSelectedUsernames(prevState => prevState.filter(username => username !== user.username));
        }
    };
   

    console.log(dataStageUpdate)
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: '0 0 50%', border: '1px solid gray' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>#</th>
                            <th>{lang["title.task"]}</th>
                            <th>%{lang["complete"]}</th>
                            <th>{lang["log.daystart"]}</th>
                            <th>{lang["log.dayend"]}</th>
                            <th>{lang["log.create_user"]}</th>
                            <th class="font-weight-bold align-center" scope="col">
                                {lang["log.action"]}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {dataTask.map((task, index) => (
                            <React.Fragment key={task.index}>
                                <tr>
                                    <td style={{ width: "20px" }} className="toggle-subtasks" onClick={() => handleToggle(task.period_id)}>
                                        {task.tasks.length > 0 ? (expandedTasks[task.period_id]
                                            ? <i className="fa fa-minus-circle size-18" aria-hidden="true"></i>
                                            : <i className="fa fa-plus-circle size-18" aria-hidden="true"></i>
                                        ) : ""
                                        }
                                    </td>
                                    <td>{task.period_id}</td>
                                    <td>{task.period_name}</td>
                                    <td>0 nhe</td>
                                    <td>{functions.formatDateTask(task.start)}</td>
                                    <td>{functions.formatDateTask(task.end)}</td>
                                    <td>
                                        {task.period_members && task.period_members.length > 0 ?
                                            task.period_members.map(member => member.fullname).join(', ') :
                                            <p>{lang["projectempty"]}</p>
                                        }
                                    </td>

                                  
                                    <td>
                                        <i class="fa fa-eye size-24 pointer icon-margin icon-view" data-toggle="modal" data-target="#viewTask" title={lang["viewdetail"]}></i>
                                        <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdStage(task)} data-toggle="modal" data-target="#editStage" title={lang["edit"]}></i>
                                    </td>
                                </tr>
                                {expandedTasks[task.period_id] && task.tasks.map(subtask => (
                                    <tr class="sub-task" key={subtask.task_id}>
                                        <td></td>
                                        <td>{subtask.task_id}</td>
                                        <td>-- {subtask.task_name}</td>
                                        <td>{subtask.task_progress}</td>
                                        <td>{subtask.start}</td>
                                        <td>{subtask.end}</td>
                                        <td>
                                            {
                                                subtask.members && subtask.members.length > 0 ?
                                                    subtask.members.slice(0, 2).map(member => (
                                                        <img

                                                            class="img-responsive circle-image-cus"
                                                            src={proxy + member.avatar}
                                                            alt={member.username}
                                                        />
                                                    )) :
                                                    <p>{lang["projectempty"]} </p>
                                            }
                                            {
                                                subtask.members.length > 2 &&
                                                <div className="img-responsive circle-image-projectdetail ml-1" style={{ backgroundImage: `url(${proxy + subtask.members[2].avatar})` }}>
                                                    <span>+{subtask.members.length - 2}</span>
                                                </div>
                                            }
                                        </td>

                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
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
                                        <input type="text" class="form-control" value={dataStageUpdate.period_name} onChange={
                                            (e) => { setdataStageUpdate({ ...dataStageUpdate, stage_name: e.target.value }) }
                                        } placeholder={lang["p.stagename"]} />
                                        <div style={{ minHeight: '20px' }}>
                                            {/* {errorMessagesadd.stage_name && <span class="error-message">{errorMessagesadd.stage_name}</span>} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>{lang["log.daystart"]} <span className='red_star'>*</span></label>
                                        <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={dataStageUpdate.start} onChange={
                                            (e) => { setdataStageUpdate({ ...dataStageUpdate, stage_start: e.target.value }) }
                                        } />
                                        <div style={{ minHeight: '20px' }}>
                                            {/* {errorMessagesadd.stage_start && <span class="error-message">{errorMessagesadd.stage_start}</span>} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>{lang["log.dayend"]} <span className='red_star'>*</span></label>
                                        <input type="date" min="2020-01-01" max="2030-12-31" className="form-control" value={dataStageUpdate.end} onChange={
                                            (e) => { setdataStageUpdate({ ...dataStageUpdate, stage_end: e.target.value }) }
                                        } />

                                        <div style={{ minHeight: '20px' }}>
                                            {/* {errorMessagesadd.stage_end && <span class="error-message">{errorMessagesadd.stage_end}</span>} */}
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div style={{ minHeight: '20px' }}>
                                            {/* {errorMessagesadd.checkday && <span class="error-message">{errorMessagesadd.checkday}</span>} */}
                                        </div>
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <label>{lang["taskmember"]} <span className='red_star'>*</span></label>
                                        {/* {errorMessagesadd.members && <span class="ml-1 error-message">{errorMessagesadd.members}</span>} */}
                                        <div class="user-checkbox-container">
                                            {membersProject?.map((user, index) => {
                                                const periodToUpdate = dataTask.find(period => period.period_id === dataStageUpdate.period_id);
                                                const isMember = periodToUpdate ? periodToUpdate.period_members.some(member => member.username === user.username) : false;

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
                            <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
                            <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: '1', border: '1px solid gray', background: '#f6f6f6' }}>
                {/* Biểu đồ Gantt có thể được thêm vào đây */}

            </div>
        </div>
    );
};

export default Stage;
