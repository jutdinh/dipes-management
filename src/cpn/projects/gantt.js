import React, { useState, useEffect, useLayoutEffect } from "react";
import Timeline from "react-timelines";
import moment from 'moment';
import "react-timelines/lib/css/style.css";
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../enum/status';
import { useDispatch, useSelector } from 'react-redux';
import tasks from "../tasks/tasks";

const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);
const MIN_ZOOM = 30;
const MAX_ZOOM = 37;

const TimelineChart = ({ data }) => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(MAX_ZOOM);

    const [start, setStart] = useState(moment().startOf('year').toDate());
    const [end, setEnd] = useState(moment().endOf('year').toDate());

    const [timebar, setTimebar] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    useLayoutEffect(() => {
        setStart(moment({ year: selectedYear, month: selectedMonth }).startOf('month').toDate());
        setEnd(moment({ year: selectedYear, month: selectedMonth }).endOf('month').toDate());
    }, [selectedYear, selectedMonth]);
    const months = [
        lang["january"],
        lang["february"],
        lang["march"],
        lang["april"],
        lang["may"],
        lang["june"],
        lang["july"],
        lang["august"],
        lang["september"],
        lang["october"],
        lang["november"],
        lang["december"],
    ];

    useEffect(() => {
        const buildTimebar = () => {
            // ...your timebar initialization...

            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];


            const years = Array.from({ length: 4 }, (_, i) => {
                const year = selectedYear;
                const quartersCells = quarters.map((q, j) => {
                    return {
                        id: `${year}-${q}-${i}-${j}`,
                        title: `${year} ${q}`,
                        start: moment({ year }).quarter(j + 1).startOf('quarter').toDate(),
                        end: moment({ year }).quarter(j + 1).endOf('quarter').toDate(),
                        children: Array.from({ length: 3 }, (_, k) => {
                            const month = j * 3 + k;
                            return {
                                id: `${year}-${month + 1}-${i}-${j}`,
                                title: months[month],
                                start: moment({ year, month }).startOf('month').toDate(),
                                end: moment({ year, month }).endOf('month').toDate(),
                                children: Array.from({ length: moment({ year, month }).daysInMonth() }, (_, d) => {
                                    const day = d + 1;
                                    return {
                                        id: `${year}-${month + 1}-${day}-${i}-${j}-${k}-${d}`,
                                        title: `${day}`,
                                        start: moment({ year, month, day }).startOf('day').toDate(),
                                        end: moment({ year, month, day }).endOf('day').toDate(),
                                    };
                                })
                            };
                        }),
                    };
                });

                return {
                    id: `${year}-${i}`,
                    title: `${year}`,
                    start: moment({ year }).startOf('year').toDate(),
                    end: moment({ year }).endOf('year').toDate(),
                    cells: quartersCells,
                };
            });

            return [
                { id: 'years', title: lang["gantt.year"], cells: years },
                { id: 'quarters', title: lang["gantt.quarters"], cells: years.flatMap(year => year.cells) },
                { id: 'months', title: lang["gantt.months"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children)) },
                { id: 'days', title: lang["gantt.day"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children.flatMap(month => month.children))) },
            ];
        };

        const statusTaskView = [
            StatusTask.INITIALIZATION.color,
            StatusTask.IMPLEMENT.color,
            StatusTask.COMPLETE.color,
            StatusTask.PAUSE.color
        ]

        const styles = {
            container: {
                position: "relative",
            },

            images: {
                position: "absolute",
                right: 0,
                top: 0,
                padding: "0 8px",
                margin: '8px',
                display: 'flex',       // Add this
                flexWrap: 'wrap',      // Add this
                maxWidth: '110px'      // Change this value as per your requirement
            },
        }

        const tracks = data.map((task, index) => ({
            id: index + 1,
            // title:
            //     (<div style={styles.container}>
            //         <div style={styles.images}>
            //             {task.members?.map(mem =>
            //                 <img style={{ width: "22px" }} class="img-responsive circle-image mt-1 ml-1" src={proxy + mem.avatar} alt="#" />
            //             )}
            //         </div>
            //         <span> Task {index + 1}</span>

            //     </div>),

            title: `Task ${index + 1}`,
            elements: [{
                id: 0,
                title: (
                    <div className="task-name" style={{
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}>
                        {task.task_name}
                    </div>
                    
                    
                ),


                start: moment(task.start).toDate(),
                end: moment(task.end).toDate(),
                // img: <img class="img-responsive circle-image" src={proxy + tasks.members?.avatar} alt="#" />,
                style: {
                    backgroundColor: `${statusTaskView[task.task_status - 1]}`,
                    borderRadius: `4px`,
                    boxShadow: `0 5px 20px rgba(0, 0, 0, 0.05)`,
                }
            }]
        }));

        setTimebar(buildTimebar());
        setTracks(tracks);

    }, [data, lang, selectedYear, selectedMonth]); // dependencies for useEffect, adjust as needed

    const handleToggleOpen = () => setOpen(!open);
    const handleZoomIn = () => setZoom(Math.min(zoom + 4, MAX_ZOOM));
    const handleZoomOut = () => {
        const newZoom = Math.max(zoom - 2, MIN_ZOOM);

        setStart(moment().startOf('year').toDate());
        setEnd(moment().add(4, 'year').endOf('year').toDate());

        setZoom(newZoom);
    }

    const now = moment().toDate();
    useEffect(() => {
        // Điều chỉnh vị trí cuộn sau khi chọn một năm và tháng.
        const container = document.getElementById("timeline-container");
        if (container) {
            const currentDay = moment().date();
            const totalDays = moment({ year: selectedYear, month: selectedMonth }).daysInMonth();
            const scrollPosition = (currentDay / totalDays) * container.scrollWidth;
            container.scrollLeft = scrollPosition;
        }
    }, [selectedYear, selectedMonth]);
    return (
        <div className="app app1">
            <div class="d-flex align-items-center mb-1">
                <div class="row">
                    <div class="col-md-12">
                        <select class="form-control mt-1"
                            value={selectedYear}
                            onChange={(e) => {
                                const newYear = parseInt(e.target.value);
                                setSelectedYear(newYear);
                                setSelectedMonth(0); // Reset month to January when year changes
                                setStart(moment({ year: newYear }).startOf('year').toDate());
                                setEnd(moment({ year: newYear }).endOf('year').toDate());
                            }}
                        >
                            {Array.from({ length: 5 }, (_, i) => 2021 + i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div class="col-md-1">
                    </div>
                </div>
            </div>



            <select
                value={selectedMonth}
                onChange={(e) => {
                    const newMonth = parseInt(e.target.value);
                    setSelectedMonth(newMonth);
                    setStart(moment({ year: selectedYear, month: newMonth }).startOf('month').toDate());
                    setEnd(moment({ year: selectedYear, month: newMonth }).endOf('month').toDate());
                }}
            >
                {months.map((month, i) => (
                    <option key={i} value={i}>
                        {month}
                    </option>
                ))}
            </select>

            <Timeline

                scale={{
                    start,
                    end,
                    zoom,
                    zoomMin: MIN_ZOOM,
                    zoomMax: MAX_ZOOM,
                }}
                isOpen={open}
                toggleOpen={handleToggleOpen}
                //   zoomIn={handleZoomIn}
                //   zoomOut={handleZoomOut}
                clickElement={clickElement}
                timebar={timebar}
                tracks={tracks}
                now={now}
                enableSticky
                scrollToNow
            />
        </div>
    );
}

export default TimelineChart;
