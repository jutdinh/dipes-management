import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from 'react';

import $ from 'jquery'
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';
import ReactECharts from 'echarts-for-react';
const RECORD_PER_PAGE = 10

export default (props) => {
    const { functions, lang } = useSelector(state => state)
    const { formatNumber } = functions
const dataBar ={
    "data": {
        "headers": [
            "1 2023 Controller",
            "1 2023 Print head",
            "2 2023 Controller",
            "2 2023 Print head",
            "3 2023 Controller",
            "3 2023 Print head",
            "4 2023 Controller",
            "4 2023 Print head",
            "5 2023 Controller",
            "5 2023 Print head",
            "6 2023 Controller",
            "6 2023 Print head",
            "7 2023 Controller",
            "7 2023 Print head",
            "8 2023 Controller",
            "8 2023 Print head",
            "9 2023 Controller",
            "9 2023 Print head",
            "10 2023 Controller",
            "10 2023 Print head",
            "11 2023 Controller",
            "11 2023 Print head",
            "12 2023 Controller",
            "12 2023 Print head"
        ],
        "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            6,
            8,
            0,
            0,
            0,
            0
        ]
    },
    "statis": {
        "display_name": "TỔNG KEY THEO THÁNG_NĂM",
        "data": {
            "headers": [
                "1 2023 Controller",
                "1 2023 Print head",
                "2 2023 Controller",
                "2 2023 Print head",
                "3 2023 Controller",
                "3 2023 Print head",
                "4 2023 Controller",
                "4 2023 Print head",
                "5 2023 Controller",
                "5 2023 Print head",
                "6 2023 Controller",
                "6 2023 Print head",
                "7 2023 Controller",
                "7 2023 Print head",
                "8 2023 Controller",
                "8 2023 Print head",
                "9 2023 Controller",
                "9 2023 Print head",
                "10 2023 Controller",
                "10 2023 Print head",
                "11 2023 Controller",
                "11 2023 Print head",
                "12 2023 Controller",
                "12 2023 Print head"
            ],
            "values": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                6,
                8,
                0,
                0,
                0,
                0
            ]
        },
        "type": "table"
    },
    "page": {
        "ui_id": 1915,
        "title": "THỐNG KÊ THÁNG NĂM",
        "url": "/thong-ke-thang-nam",
        "status": true,
        "params": [
            1730
        ],
        "type": "ui",
        "create_at": "2023-10-12T03:43:53.432Z",
        "create_by": {
            "username": "administrator",
            "fullname": "Administrator"
        },
        "components": [
            {
                "component_id": 1916,
                "component_name": "THỐNG KÊ THÁNG NĂM",
                "layout_id": 4,
                "api_get": "/api/2BCDEE0FA1464DD991F48D490945E630",
                "api_post": "/ui/61D5DE37C9AC4CCC8DF499DE43D8E48C",
                "api_put": "/ui/1270600071AA45F3944DC70B6195D44B",
                "api_delete": "/ui/CE8093E02CA74B3D822DA76270CEE9A1",
                "api_search": "/search/838A8A6C838843E6A85D8BCDFC95A134",
                "api_export": "/export/88561DF15E9741B2B6948A348B56E045",
                "api_import": "/import/EC4BEB752B09433FBB625F915EF2C685",
                "api_detail": "/d/57F2967BBFE243C5877C24636F804DD2"
            }
        ]
    }
}
    const { data, statis } = dataBar
    console.log(props)
    const { display_name, type } = statis;
    const { headers, values } = data;

    const [display, setDisplay] = useState(headers.slice(0, RECORD_PER_PAGE))
    const [currentPage, setCurrentPage] = useState(0)
    const totalPages = Math.ceil(headers.length / RECORD_PER_PAGE);
 
    const MyBarChart1 = () => {


        const COLORS = ["#4D90FE", "#50E3C2"];
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
        const LABELS = ["Data 1", "Data 2"];

        const years = [...new Set(data.headers.map(header => header.split(' ')[1]))];
        const currentYear = new Date().getFullYear();
        const [selectedYear, setSelectedYear] = useState(currentYear.toString());
        const [currentMonth, setSurrentMonth] = useState(new Date().getMonth()+1);
        const [barData, setBarData] = useState([]);

        const [totalControllerForYear, setTotalControllerForYear] = useState(0);
        const [totalPrintheadForYear, setTotalPrintheadForYear] = useState(0);
        const [totalControllerForCurrentMonth, setTotalControllerForCurrentMonth] = useState(0);
        const [totalPrintheadForCurrentMonth, setTotalPrintheadForCurrentMonth] = useState(0);
        console.log("controller trong năm", totalControllerForYear)
        console.log("printhead trong năm", totalPrintheadForYear)
        console.log("controller trong tháng", totalControllerForCurrentMonth)
        console.log("printhead trong tháng", totalPrintheadForCurrentMonth)
        useEffect(() => {
            let yearControllerTotal = 0;
            let yearPrintheadTotal = 0;
            let monthControllerTotal = 0;
            let monthPrintheadTotal = 0;

           // Trả về tháng hiện tại từ 1 (January) đến 12 (December)


            barData.forEach(item => {
                yearControllerTotal += item.controller;
                yearPrintheadTotal += item.printhead;


                const monthAndYear = item.name.split(' ');
                const itemMonth = monthAndYear[0]; // Tháng là phần tử đầu tiên trong mảng
                const itemYear = monthAndYear[1]; // Năm là phần tử thứ hai trong mảng
                const monthAbbreviation = months[itemMonth - 1]; // Chuyển đổi thành viết tắt

                if (monthAbbreviation === months[currentMonth-1] && itemYear === selectedYear) {
                    monthControllerTotal = item.controller;
                    monthPrintheadTotal = item.printhead;
                }
            });

            setTotalControllerForYear(yearControllerTotal);
            setTotalPrintheadForYear(yearPrintheadTotal);
            setTotalControllerForCurrentMonth(monthControllerTotal);
            setTotalPrintheadForCurrentMonth(monthPrintheadTotal);

        }, [barData, selectedYear]);

        useEffect(() => {
            const filteredData = [];
            for (let i = 0; i < data.headers.length; i += 2) {
                const monthYear = data.headers[i].split(' ')[0] + ' ' + data.headers[i].split(' ')[1];
                if (data.headers[i].split(' ')[1] === selectedYear) {
                    filteredData.push({
                        name: monthYear,
                        controller: data.values[i],
                        printhead: data.values[i + 1],
                    });
                }
            }
            setBarData(filteredData);
        }, [selectedYear]);

        const option = {
            grid: {
                left: '5%',
                right: '3%',
                top: '9%',
                bottom: '12%'
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const controllerData = params[0];
                    const printheadData = params[1];
                    return `<strong>${controllerData.name}</strong><br/>${LABELS[0]}: ${controllerData.value.toFixed()}<br/>${LABELS[1]}: ${printheadData.value.toFixed()}`;
                }
            },
            legend: {
                show: true,
                data: LABELS,
                align: 'left', // Align legend text
                padding: 5,   // Adjust padding if needed
                itemGap: 15,    // Gap between items
                textStyle: {
                    fontSize: 14,  // Adjust the font size
                    fontFamily: 'UTM Avo'  // Set the font family
                }
            },

            series: [{
                name: LABELS[0], // Controller
                type: 'bar',
                data: barData.map(item => item.controller),
                itemStyle: {
                    color: COLORS[0]
                }
            },
            {
                name: LABELS[1], // Printhead
                type: 'bar',
                data: barData.map(item => item.printhead),
                itemStyle: {
                    color: COLORS[1]
                }
            }]
        };

        return (
            <>
                <div class="row column1 mb-4">
                    <div class="col-lg-9">
                        <div class="white_shd full">
                            <div class="tab_style2 layout2">
                                <div class="tabbar">

                                    <div class="full graph_head d-flex">
                                        <div class="heading1 margin_0 ">
                                            <h5>Chart</h5>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="table_section padding_infor_info_layout_chart ">
                                <div className="bar-container">
                                    <div className="select-container">
                                        {years.length > 1 && (
                                            <select
                                                className="form-control"
                                                value={selectedYear}
                                                onChange={e => setSelectedYear(e.target.value)}
                                            >
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <ResponsiveContainer className="bar-chart-container">
                                        <ReactECharts option={option} style={{ height: 200, width: '100%' }} />
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="white_shd full">
                            <div class="tab_style2 layout2">
                                <div class="tabbar">

                                    <div class="full graph_head d-flex text-center">
                                        <div class="heading1 margin_0 ">
                                            <h5> Total {selectedYear}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info_layout_chart ">
                                <div class="row">
                                    <div class="col-md-12" style={{padding: 0}}>
                                        <div class="my-box">
                                            <span>
                                                {/* <IncrementalNumber value={totalControllerForYear + totalPrintheadForYear || 0} /> */}
                                                {totalControllerForYear + totalPrintheadForYear || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-lg-6">
                        <div class="white_shd full">
                            <div class="tab_style2 layout2">
                                <div class="tabbar">
                                    <div class="full graph_head d-flex text-center">
                                        <div class="heading1 margin_0 ">
                                            <h5>{LABELS[0]}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info_layout_chart_half ">
                                <div class="row">
                                    <div class="col-md-6" >
                                        <div class="white_shd full ">
                                            <div class="full graph_head text-center">
                                                <div class="heading1 margin_0">
                                                    {lang["gantt.months"]} {currentMonth}
                                                </div>
                                            </div>
                                            <div class="map_section padding_infor_info_statis">
                                                <div class="row">
                                                    <div class="col-md-12" style={{padding: 0}}>
                                                        <div class=" my-box-half">
                                                            <span>
                                                                {/* <IncrementalNumber value={totalControllerForCurrentMonth || 0} /> */}
                                                                {totalControllerForCurrentMonth || 0}

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="white_shd full ">
                                            <div class="full graph_head text-center">
                                                <div class="heading1 margin_0">
                                                    {lang["year"]} {selectedYear}
                                                </div>
                                            </div>
                                            <div class="map_section padding_infor_info_statis">
                                                <div class="row">
                                                    <div class="col-md-12" style={{padding: 0}}>
                                                        <div class=" my-box-half">
                                                            <span>
                                                                {/* <IncrementalNumber value={totalControllerForYear || 0} /> */}
                                                                {totalControllerForYear || 0}

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="white_shd full">
                            <div class="tab_style2 layout2">
                                <div class="tabbar">
                                    <div class="full graph_head d-flex text-center">
                                        <div class="heading1 margin_0 ">
                                            <h5>{LABELS[1]}</h5>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="table_section padding_infor_info_layout_chart_half ">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="white_shd full ">
                                            <div class="full graph_head text-center">
                                                <div class="heading1 margin_0">
                                                    {lang["gantt.months"]} {currentMonth}
                                                </div>
                                            </div>
                                            <div class="map_section padding_infor_info_statis">
                                                <div class="row">
                                                    <div class="col-md-12" style={{padding: 0}}>
                                                        <div class=" my-box-half">
                                                            <span>
                                                                {/* <IncrementalNumber value={totalPrintheadForCurrentMonth || 0} /> */}
                                                                {totalPrintheadForCurrentMonth || 0}

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="white_shd full ">
                                            <div class="full graph_head text-center">
                                                <div class="heading1 margin_0">
                                                    {lang["year"]} {selectedYear}
                                                </div>
                                            </div>
                                            <div class="map_section padding_infor_info_statis">
                                                <div class="row">
                                                    <div class="col-md-12" style={{padding: 0}}>
                                                        <div class=" my-box-half">
                                                            <span>
                                                                {/* <IncrementalNumber value={totalPrintheadForYear || 0} /> */}

                                                                {totalPrintheadForYear || 0}

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>

            <div class="col-md-12">
                <div class="tab-content">
                    <div class="col-md-12">

                        < MyBarChart1 />
                    </div>
                </div>
            </div>
        </>
    )
}