import React, { useEffect, useRef, useState } from 'react';
import { FrappeGantt, ViewMode } from 'frappe-gantt-react';
import ReactGantt from "gantt-for-react";

import { useDispatch, useSelector } from 'react-redux';
import $ from "jquery"
function GanttTest({ data }) {

    const containerRef = useRef(null);
    const { lang, proxy, auth, functions } = useSelector(state => state);

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

    const customPopupHtml = task => {
        return `
              <div class="details-container">
                <p class="font-weight-bold">${task.name}</p>
                <p>${lang["time"]}: ${functions.formatDateTask(task.start)} - ${functions.formatDateTask(task.end)}</p>
               
                <p>${lang["complete"]}: ${task.progress}%</p>
              </div>
            `;
    };


    const [svgRectWidth, setSvgRectWidth] = useState(0); // Sử dụng state để lưu độ rộng của SVG


    useEffect(() => {
        const svgRectElement = document.querySelector('#content > div.midde_cont > div > div:nth-child(2) > div > div > div.table_section.padding_infor_info_list_task > div > div.table_section.padding_infor_info_list_task > div.no-select > div.active > div > div > div > div > svg > g.grid > rect.grid-background');

        const updateSvgRectWidth = () => {
            if (svgRectElement) {
                const svgRect = svgRectElement.getBoundingClientRect();
                setSvgRectWidth(svgRect.width);
            }
        };

        updateSvgRectWidth(); // Cập nhật lần đầu tiên khi component được render

        window.addEventListener('resize', updateSvgRectWidth); // Cập nhật khi cửa sổ thay đổi kích thước

        return () => {
            window.removeEventListener('resize', updateSvgRectWidth); // Hủy đăng ký event listener khi component bị hủy
        };
    }, []);
    console.log(svgRectWidth)

    return (
        // <div ref={containerRef} style={{ maxWidth: '100%', overflowX: 'auto', overflowY: 'visible' }}>
        //     {/* <FrappeGantt
        //         tasks={tasks}
        //         columnWidth="40px"
        //         // viewMode="Month"
        //         viewMode={ViewMode.Y}
        //         onClick={period => console.log(period)}
        //         customRowClass={getRowClass}
        //         customPopupHtml={customPopupHtml}
        //     /> */}
        //     <div ref={containerRef} class="scrollable-container"  style={{ width: "1000px" }}>
        //         <div class="content">
        //             <ReactGantt
        //                 columnWidth="20px"
        //                 arrow_curve="5"
        //                 tasks={tasks}
        //                 viewMode={ViewMode.Day}
        //                 customPopupHtml={customPopupHtml}
        //                 // customRowClass={getRowClass}
        //                 onClick={task => console.log(task)}
        //                 onDateChange={null}
        //                 onProgressChange={null}
        //                 onTasksChange={null}
        //             />
        //         </div>
        //     </div>

        // </div>


        <div ref={containerRef} style={{ maxWidth: '100%', overflowX: 'auto', overflowY: 'visible' }}>
            {/* <div ref={containerRef} className="scrollable-container">
                <div className="content" style={{ width: svgRectWidth }}> */}
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
                {/* </div>
            </div> */}
        </div>
    );

}

export default GanttTest;

