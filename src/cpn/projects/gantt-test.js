import React, { useEffect, useRef } from 'react';
import { FrappeGantt, ViewMode } from 'frappe-gantt-react';
import ReactGantt from "gantt-for-react";

import { useDispatch, useSelector } from 'react-redux';
import $ from "jquery"
function GanttTest({ data }) {
    const containerRef = useRef(null);

    const { lang, proxy, auth, functions } = useSelector(state => state);
    console.log(data)



    // React.useEffect(() => {
    //     const updateHeight = () => {
    //         // Sử dụng ref để truy cập phần tử DOM
    //         const containerElement = containerRef.current;
    //         if (containerElement) {
    //             const currentHeight = containerElement.offsetHeight;
    //             if (currentHeight) {
    //                 const newHeight = currentHeight - 100; // Tính đến độ cao của thanh cuộn
    //                 if (newHeight > 0) {
    //                     containerElement.style.height = newHeight + 'px';
    //                 }
    //             }
    //         }

    //     };

    //     // Thêm một delay lớn hơn để đảm bảo rằng thư viện đã kết thúc việc render
    //     setTimeout(updateHeight, 1);
    // }, [data]);

 






    const currentDate = new Date();
    console.log(currentDate)
    const tasks = data.map((period) => [
        {
            id: `period-${period.period_id}`,
            name: period.period_name,
            start: period.start,
            end: period.end,
            progress: parseFloat(period.progress),
            dependencies: '',
            custom_class: (new Date(period.end) < currentDate && parseFloat(period.progress) < 100) ? "bar-milestone" : "",
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        },

        ...(period.tasks ?? []).map((task) => [
            {
                id: `task-${task.task_id}`,
                name: task.task_name,
                start: task.start,
                end: task.end,
                progress: parseFloat(task.progress),
                dependencies: `period-${period.period_id}`,
                custom_class: (new Date(task.end) < currentDate && parseFloat(task.progress) < 100) ? "bar-milestone" : ""
            },
            ...(task.child_tasks ?? []).map((childTask) => {
                return {
                    id: `childTask-${childTask.child_task_id}`,
                    name: childTask.child_task_name,
                    start: childTask.start,
                    end: childTask.end,
                    progress: parseFloat(childTask.progress),
                    dependencies: `task-${task.task_id}`,
                    description: childTask.child_task_description,
                    // isDelayed: new Date(childTask.end) < currentDate,
                    custom_class: (new Date(childTask.end) < currentDate && parseFloat(childTask.progress) < 100) ? "bar-milestone" : ""
                };
            }),
        ]),
    ]).flat(2);

    console.log(tasks)
    // const customPopupHtml = task => {
    //     return `
    //           <div class="details-container">
    //             <p class="font-weight-bold">${task.name}</p>
    //             <p>${lang["log.daystart"]}: ${functions.formatDateTask(task.start)}</p>
    //             <p>${lang["log.dayend"]}: ${functions.formatDateTask(task.end)}</p>
    //             <p>${lang["complete"]}: ${task.progress}%</p>
    //           </div>
    //         `;
    // };
    const customPopupHtml = task => {
        return `
              <div class="details-container">
                <p class="font-weight-bold">${task.name}</p>
                <p>${lang["time"]}: ${functions.formatDateTask(task.start)} - ${functions.formatDateTask(task.end)}</p>
               
                <p>${lang["complete"]}: ${task.progress}%</p>
              </div>
            `;
    };


    return (
        <div ref={containerRef} style={{ maxWidth: '100%', overflowX: 'auto', overflowY: 'auto' }}>
            {/* <FrappeGantt
                tasks={tasks}
                columnWidth="40px"
                // viewMode="Month"
                viewMode={ViewMode.Y}
                onClick={period => console.log(period)}
                customRowClass={getRowClass}
                customPopupHtml={customPopupHtml}
            /> */}
            <ReactGantt
               
                columnWidth="20px"
                arrow_curve="5"
                tasks={tasks}
                viewMode={ViewMode.Day}
                customPopupHtml={customPopupHtml}
                // customRowClass={getRowClass}
                onClick={task => console.log(task)}
                onDateChange={null}
                onProgressChange={null}
                onTasksChange={null}
            />
        </div>
    );
}

export default GanttTest;

