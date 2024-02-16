import React, { useState, useEffect } from "react";
import Timeline from "react-timelines";
import moment from 'moment';
import "react-timelines/lib/css/style.css";
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../../enum/status';
import { useDispatch, useSelector } from 'react-redux';


const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);
const MIN_ZOOM = 30;
const MAX_ZOOM = 38;

const TimelineChart = ({ data, project, data_raw }) => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(MAX_ZOOM);
    const [start, setStart] = useState(moment().startOf('year').toDate());
    const [end, setEnd] = useState(moment().endOf('year').toDate());
    const [timebar, setTimebar] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    // console.log(selectedMonth)
    // ///focus đến tháng hiện tại
    // useEffect(() => {
    //     setStart(moment({ year: selectedYear, month: selectedMonth }).startOf('month').toDate());
    //     setEnd(moment({ year: selectedYear, month: selectedMonth }).endOf('month').toDate());
    // }, [selectedYear, selectedMonth]);
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
    const statusProject = [
        StatusEnum.INITIALIZATION,
        StatusEnum.IMPLEMENT,
        StatusEnum.DEPLOY,
        StatusEnum.COMPLETE,
        StatusEnum.PAUSE
    ]

    useEffect(() => {
        // const buildTimebar = () => {
        //     const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        //     const years = Array.from({ length: 4 }, (_, i) => {
        //         const year = selectedYear;
        //         const quartersCells = quarters.map((q, j) => {
        //             return {
        //                 id: `${year}-${q}-${i}-${j}`,
        //                 title: `${year} ${q}`,
        //                 start: moment({ year }).quarter(j + 1).startOf('quarter').toDate(),
        //                 end: moment({ year }).quarter(j + 1).endOf('quarter').toDate(),
        //                 children: Array.from({ length: 3 }, (_, k) => {
        //                     const month = j * 3 + k;
        //                     return {
        //                         id: `${year}-${month + 1}-${i}-${j}`,
        //                         title: months[month],
        //                         start: moment({ year, month }).startOf('month').toDate(),
        //                         end: moment({ year, month }).endOf('month').toDate(),
        //                         children: Array.from({ length: moment({ year, month }).daysInMonth() }, (_, d) => {
        //                             const day = d + 1;
        //                             return {
        //                                 id: `${year}-${month + 1}-${day}-${i}-${j}-${k}-${d}`,
        //                                 title: `${day}`,
        //                                 start: moment({ year, month, day }).startOf('day').toDate(),
        //                                 end: moment({ year, month, day }).endOf('day').toDate(),
        //                             };
        //                         })
        //                     };
        //                 }),
        //             };
        //         });
        //         return {
        //             id: `${year}-${i}`,
        //             title: `${year}`,
        //             start: moment({ year }).startOf('year').toDate(),
        //             end: moment({ year }).endOf('year').toDate(),
        //             cells: quartersCells,
        //         };
        //     });

        //     return [
        //         { id: 'years', title: lang["gantt.year"], cells: years },
        //         { id: 'quarters', title: lang["gantt.quarters"], cells: years.flatMap(year => year.cells) },
        //         { id: 'months', title: lang["gantt.months"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children)) },
        //         { id: 'days', title: lang["gantt.day"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children.flatMap(month => month.children))) },
        //     ];
        // };
        const buildTimebar = () => {
            const years = Array.from({ length: 4 }, (_, i) => {
                const year = selectedYear;
                const monthsCells = months.map((m, j) => {
                    return {
                        id: `${year}-${m}-${i}-${j}`,
                        title: `${year} ${m}`,
                        start: moment({ year, month: j }).startOf('month').toDate(),
                        end: moment({ year, month: j }).endOf('month').toDate(),
                        children: Array.from({ length: moment({ year, month: j }).daysInMonth() }, (_, d) => {
                            const day = d + 1;
                            return {
                                id: `${year}-${m}-${day}-${i}-${j}-${d}`,
                                title: `${day}`,
                                start: moment({ year, month: j, day }).startOf('day').toDate(),
                                end: moment({ year, month: j, day }).endOf('day').toDate(),
                            };
                        })
                    };
                });
                return {
                    id: `${year}-${i}`,
                    title: `${year}`,
                    start: moment({ year }).startOf('year').toDate(),
                    end: moment({ year }).endOf('year').toDate(),
                    cells: monthsCells,
                };
            });

            return [

                { id: 'yearMonths', title: lang["gantt.yearmonths"], cells: years.flatMap(year => year.cells) },
                { id: 'days', title: lang["gantt.day"], cells: years.flatMap(year => year.cells.flatMap(month => month.children)) },
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
                margin: '15px 0px 10px 0px',
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: '110px'
            },
        }
        const tracks = data.map((task, index) => ({
            id: index + 1,
            title:
                (<div style={styles.container}>
                    <div style={styles.images}>
                        {task.members.slice(0, 1).map(mem =>
                            <img style={{ width: "26px" }} class="img-responsive circle-image mt-1 ml-1" src={proxy + mem.avatar} alt="#" />
                        )}
                        {
                            task.members.length > 1 &&
                            <div className="img-responsive circle-image-gantt mt-1 ml-1" style={{ width: "25px", backgroundImage: `url(${proxy + task.members[1].avatar})` }}>
                                <span>+{task.members.length - 1}</span>
                            </div>
                        }
                    </div>
                    <span> {lang["task"]} {index + 1}</span>

                </div>),
            // title: `Task ${index + 1}`,
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
                // end: moment(task.end).toDate(),
                end: moment(task.end).add(1, 'days').toDate(),
                style: {
                    backgroundColor: `${statusTaskView[task.task_status - 1]}`,
                    borderRadius: `4px`,
                    boxShadow: `0 5px 20px rgba(0, 0, 0, 0.25)`,
                }
            }]
        }));

        setTimebar(buildTimebar());
        setTracks(tracks);

    }, [data, lang, selectedYear, selectedMonth]); 

    const handleToggleOpen = () => setOpen(!open);
    const handleZoomIn = () => setZoom(Math.min(zoom + 4, MAX_ZOOM));
    const handleZoomOut = () => {
        const newZoom = Math.max(zoom - 2, MIN_ZOOM);
        setStart(moment().startOf('year').toDate());
        setEnd(moment().add(4, 'year').endOf('year').toDate());
        setZoom(newZoom);
    }
    const now = moment().toDate();
    //set năm
    function getYearsFromTasks(data_raw) {
        const years = new Set();
        data_raw.forEach(task => {
            const startYear = new Date(task.start).getFullYear();
            const endYear = new Date(task.end).getFullYear();
            years.add(startYear);
            years.add(endYear);//Set chỉ chứa các giá trị duy nhất, nên nếu một năm đã được thêm trước đó, nó sẽ không được thêm lại.
        });

        return Array.from(years);
    }

    useEffect(() => {
        setTimeout(() => {
            const container = document.querySelector(".rt-layout__timeline");
            if (container) {
                const startYear = moment(start).year();
                const endYear = moment(end).year();
                const totalMonthsInTimeline = (endYear - startYear + 1) * 12;
                const selectedYearMonth = (selectedYear - startYear) * 12 + selectedMonth;
                const scrollPosition = (selectedYearMonth / totalMonthsInTimeline) * container.scrollWidth;
                container.scrollLeft = scrollPosition;
            }
        }, 20);
    }, [selectedYear, selectedMonth, start, end]);

    // console.log(document.querySelector('.rt-layout__timeline'));
    let isDown = false;
    let startX;
    let scrollLeft;

    const timeline = document.querySelector('.rt-layout__timeline');
    if (timeline) {
        timeline.addEventListener('mousedown', (e) => {
            isDown = true;
            timeline.classList.add('active'); // Thêm class 'active' khi chuột nhấn xuống
            startX = e.pageX - timeline.offsetLeft;
            scrollLeft = timeline.scrollLeft;
        });
        timeline.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timeline.offsetLeft;
            const walk = (x - startX);
            timeline.scrollLeft = scrollLeft - walk;
        });
        timeline.addEventListener('mouseup', () => {
            isDown = false;
            timeline.classList.remove('active'); // Xóa class 'active' khi chuột nhả ra
        });
        timeline.addEventListener('mouseleave', () => {
            isDown = false;
            timeline.classList.remove('active'); // Xóa class 'active' khi chuột rời khỏi
        });
    }




    return (
        <div className="app app1">
            <div class="row">
                <div class="col-md-6">
                    <div class="row mt-2">
                        <div class="col-sm-6 col-md-4">
                            <select class="form-control mt-1"
                                value={selectedYear}
                                onChange={(e) => {
                                    const newYear = parseInt(e.target.value);
                                    setSelectedYear(newYear);
                                    setSelectedMonth(13); // Reset month to January when year changes
                                    setStart(moment({ year: newYear }).startOf('year').toDate());
                                    setEnd(moment({ year: newYear }).endOf('year').toDate());
                                }}
                            >
                                {getYearsFromTasks(data).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div class="col-sm-6 col-md-4">
                            <select class="form-control mt-1"
                                style={{ minWidth: "95px" }}
                                value={selectedMonth}
                                onChange={(e) => {
                                    const newMonth = parseInt(e.target.value);
                                    setSelectedMonth(newMonth);
                                    const timeline = document.querySelector(".rt-layout__timeline");
                                    const monthElements = timeline.getElementsByClassName("month");
                                    if (newMonth < monthElements.length) {
                                        const newScrollPosition = monthElements[newMonth].offsetLeft;
                                        timeline.scrollLeft = newScrollPosition;
                                    }
                                }}
                            >
                                <option value={13}>
                                    {lang["choose"]}
                                </option>
                                {months.map((month, i) => (
                                    <option key={i} value={i}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>
                </div>
                <div class="col-md-6">
                </div>
            </div>
            <div id="timeline-container">
                <Timeline
                    scale={{
                        start,
                        end,
                        zoom,
                        // zoomMin: MIN_ZOOM,
                        // zoomMax: MAX_ZOOM,
                    }}
                    isOpen={open}
                    toggleOpen={handleToggleOpen}
                    //   zoomIn={handleZoomIn}
                    //   zoomOut={handleZoomOut}
                    // clickElement={clickElement}
                    timebar={timebar}
                    tracks={
                        selectedMonth !== 13 ? (
                            tracks.filter(track => {
                                const trackStartDate = moment(track.elements[0].start);
                                const trackEndDate = moment(track.elements[0].end);
                                const selectedStartDate = moment().year(selectedYear).month(selectedMonth).date(1);
                                const selectedEndDate = moment(selectedStartDate).endOf('month');
                                
                                // console.log("Track Start Date:", trackStartDate.format('YYYY-MM-DD'));
                                // console.log("Track End Date:", trackEndDate.format('YYYY-MM-DD'));
                                // console.log("Selected Start Date:", selectedStartDate.format('YYYY-MM-DD'));
                                // console.log("Selected End Date:", selectedEndDate.format('YYYY-MM-DD'));

                                const isTrackStartBetween = trackStartDate.isBetween(selectedStartDate, selectedEndDate, null, '[]');
                                const isTrackEndBetween = trackEndDate.isBetween(selectedStartDate, selectedEndDate, null, '[]');
                                const isTrackSpanningSelectedStart = trackStartDate.isBefore(selectedStartDate) && trackEndDate.isAfter(selectedStartDate);
                                const isTrackSpanningSelectedEnd = trackStartDate.isBefore(selectedEndDate) && trackEndDate.isAfter(selectedEndDate);
                            
                                return isTrackStartBetween || isTrackEndBetween || isTrackSpanningSelectedStart || isTrackSpanningSelectedEnd;
                            })
                        ) : (
                            tracks.filter(track => {
                                const trackYear = moment(track.elements[0].start).year();
                                return trackYear === selectedYear;
                            })
                        )
                    }
                    // tracks={
                    //     tracks.filter(track => {
                    //     const trackStartDate = moment(track.elements[0].start);
                    //     return trackStartDate.year() === selectedYear && trackStartDate.month() === selectedMonth;
                    // })}
                    now={now}
                    enableSticky
                    scrollToNow
                />
            </div>
        </div>
    );
}
export default TimelineChart;
