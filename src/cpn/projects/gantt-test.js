import React, { useEffect, useRef, useState } from 'react';
import { FrappeGantt, ViewMode } from 'frappe-gantt-react';
import ReactGantt from "gantt-for-react";

import { useDispatch, useSelector } from 'react-redux';
import $ from "jquery"
function GanttTest({ data }) {

    const containerRef = useRef(null);
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const [ scrollLeft, setScrollLeft ] = useState(0)
    const currentDate = new Date();
    // console.log(currentDate)
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
                custom_class: (new Date(task.end) < currentDate && parseFloat(task.progress) < 100) ? "bar-milestone " : ""
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



    

    const handleMouseDown = (e) => {
        const $target = $(e.target).closest('.gantt-container')
        const latestScrollLeft =  $target.scrollLeft()        
        const latestX = e.clientX
        $('.gantt .grid').css({
            cursor: "grabbing"
        })
        $('*').on( "mousemove", (e) => {
            const currentX = e.clientX
            const distance = currentX - latestX;            
            $target.scrollLeft(latestScrollLeft - distance )
        })
        $('*').on( "mouseup", (e) => {
            $('*').off( "mousemove")
            $('*').off("mouseup")
            $('.gantt .grid').removeAttr("style")
        })
    };
    
    
    useEffect(() => {
        $('.gantt-container').on("mousedown", (e) => {
            handleMouseDown(e)
        })
    }, [])
    
      

    return (
       


        <div className="gantt-container grab" style={{ maxWidth: '100%', overflowX: 'auto'}}>
            
            <ReactGantt
                columnWidth="20px"
                arrow_curve="5"
                tasks={tasks}
                viewMode={ViewMode.Day}
                customPopupHtml={customPopupHtml}
                // customRowClass={getRowClass}
                // onClick={task => console.log(task)}
                onDateChange={null}
                onProgressChange={null}
                onTasksChange={null}
            />
        </div>
    );

}

export default GanttTest;

