import React, { Component } from "react";
import Timeline from "react-timelines";
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import "react-timelines/lib/css/style.css";
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../enum/status';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-alert
const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);



const MIN_ZOOM = 27;
const MAX_ZOOM = 35;

class TimelineChart extends Component {
    constructor(props) {
        super(props);
        const { data } = props;
        console.log(data)
        
        const buildTimebar = () => {
            const { lang, proxy, auth, functions } = useSelector(state => state);
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
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

            const years = Array.from({ length: 4 }, (_, i) => {
                const year = moment().year() + i;  // bắt đầu từ năm hiện tại 
                const quartersCells = quarters.map((q, j) => {
                    return {
                        id: `${year}-${q}`,
                        title: `${year} ${q}`,
                        start: moment({ year }).quarter(j + 1).startOf('quarter').toDate(),
                        end: moment({ year }).quarter(j + 1).endOf('quarter').toDate(),
                        children: Array.from({ length: 3 }, (_, k) => {
                            const month = j * 3 + k;
                            return {
                                id: `${year}-${month + 1}`,
                                title: months[month],
                                start: moment({ year, month }).startOf('month').toDate(),
                                end: moment({ year, month }).endOf('month').toDate(),
                                children: Array.from({ length: moment({ year, month }).daysInMonth() }, (_, d) => {
                                    const day = d + 1;
                                    return {
                                        id: `${year}-${month + 1}-${day}`,
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
                    id: `${year}`,
                    title: `${year}`,
                    start: moment({ year }).startOf('year').toDate(),
                    end: moment({ year }).endOf('year').toDate(),
                    cells: quartersCells,
                };
            });

            return [
                { id: 'years', title: 'Năm', cells: years },
                { id: 'quarters', title: 'Quý', cells: years.flatMap(year => year.cells) },
                { id: 'months', title: 'Tháng', cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children)) },
                { id: 'days', title: 'Ngày', cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children.flatMap(month => month.children))) },
            ];
        };

        const currentQuarter = moment().quarter();

        const statusTaskView = [
            StatusTask.INITIALIZATION.color,
            StatusTask.IMPLEMENT.color,
            StatusTask.COMPLETE.color,
            StatusTask.PAUSE.color
        ]
        console.log(statusTaskView[1])
        const tracks = data.map((task, index) => ({
            id: index + 1,
            title: `Task ${index + 1}`,
            elements: task.members.map((member, memberIndex) => ({
                id: memberIndex + 1,
                title: task.task_name,
                start: moment(task.start).toDate(),
                end: moment(task.end).toDate(),
                style: {
                    backgroundColor: `${statusTaskView[task.task_status - 1]}`,
                    borderRadius: `4px`,
                    boxShadow: `1px 1px 0px rgba(0, 0, 0, 0.25)`
                }
            })),
        }));

        this.state = {
            open: false,
            zoom: MAX_ZOOM, // Set initial zoom level to the maximum, adjust accordingly to show the current quarter only
            start: moment().startOf('quarter').toDate(),
            end: moment().quarter(currentQuarter).endOf('quarter').toDate(),

            tracks,
            timebar: buildTimebar(),
        };
    }

    handleToggleOpen = () => {
        this.setState(({ open }) => ({ open: !open }));
    };

    handleZoomIn = () => {
        this.setState(({ zoom }) => ({ zoom: Math.min(zoom + 4, MAX_ZOOM) }));
    };

    handleZoomOut = () => {
        this.setState(({ zoom }) => ({ 
            zoom: Math.max(zoom - 2, MIN_ZOOM), // Adjust zoom level
            start: moment().startOf('year').toDate(), // start of current year
            end: moment().add(0, 'year').endOf('quarter').toDate()// end of next 4 years
        }));
    };

    handleZoomOut = () => {
        this.setState(({ zoom }) => {
            const newZoom = Math.max(zoom - 2, MIN_ZOOM);
            let start, end;
            if (newZoom === MIN_ZOOM) {
                // Display only the current quarter when minimum zoom is reached
                start = moment().startOf('quarter').toDate();
                end = moment().endOf('quarter').toDate();
            } else {
                // Otherwise display the full range
                start = moment().startOf('year').toDate();
                end = moment().add(4, 'year').endOf('year').toDate();
            }
            return {
                zoom: newZoom,
                start: start,
                end: end
            };
        });
    };

    render() {
        const { open, zoom, tracks } = this.state;
        // const start = moment().startOf('year').toDate();  // bắt đầu từ đầu năm hiện tại
        // const end = moment().add(3, 'year').toDate();    

        // const start = moment().startOf('year').toDate(); /// hiển thị tất cả quý của năm
        // const end = moment().endOf('year').toDate();

        // const start = moment().startOf('quarter').toDate(); // theo quý hiện tại
        // const end = moment().endOf('quarter').toDate();

        const start = moment().startOf('year').toDate();
        const end = moment().add(2, 'year').toDate();

        const now = moment().toDate();

        return (
            <div className="app">

                <Timeline
                    scale={{
                        start,
                        end,
                        zoom,
                        zoomMin: MIN_ZOOM,
                        zoomMax: MAX_ZOOM
                    }}
                    isOpen={open}
                    toggleOpen={this.handleToggleOpen}
                    zoomIn={this.handleZoomIn}
                    zoomOut={this.handleZoomOut}
                    clickElement={clickElement}
                    timebar={this.state.timebar}
                    tracks={tracks}
                    now={now}
                    enableSticky
                    scrollToNow
                />
            </div>
        );
    }
}

export default TimelineChart;
