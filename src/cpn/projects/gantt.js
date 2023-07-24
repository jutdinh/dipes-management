import React, { Component } from "react";
import Timeline from "react-timelines";
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import "react-timelines/lib/css/style.css";

// eslint-disable-next-line no-alert
const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);


const MIN_ZOOM = 2;
const MAX_ZOOM = 14;

class TimelineChart extends Component {
    constructor(props) {
        super(props);
        const {  data } = props;
        console.log(data)
        const buildTimebar = () => {
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            const months = moment.months();
        
            const years = Array.from({ length: 4 }, (_, i) => {
                const year = moment().year() + i;  // bắt đầu từ năm hiện tại
                // ... phần còn lại của mã 
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
                                children: Array.from({ length: moment({year, month}).daysInMonth() }, (_, d) => {
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
                { id: 'years', title: 'Years', cells: years },
                { id: 'quarters', title: 'Quarters', cells: years.flatMap(year => year.cells) },
                { id: 'months', title: 'Months', cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children)) },
                // { id: 'days', title: 'Days', cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children.flatMap(month => month.children))) },
            ];
        };
        
        const currentQuarter = moment().quarter();
        const tracks = data.map((task, index) => ({
            id: index + 1,
            title: `Member ${index + 1}`,
            elements: task.members.map((member, memberIndex) => ({
                id: memberIndex + 1,
                title: task.task_name,
                start: moment(task.start).toDate(),
                end: moment(task.end).toDate(),
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
    render() {
        const { open, zoom, tracks } = this.state;
        // const start = moment().startOf('year').toDate();  // bắt đầu từ đầu năm hiện tại
        // const end = moment().add(3, 'year').toDate();    

        // const start = moment().startOf('year').toDate(); /// hiển thị tất cả quý của năm
        // const end = moment().endOf('year').toDate();

        // const start = moment().startOf('quarter').toDate(); // theo quý hiện tại
        // const end = moment().endOf('quarter').toDate();

        const start = moment().startOf('quarter').toDate();
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
