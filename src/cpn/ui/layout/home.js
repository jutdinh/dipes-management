import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport, faDownload, faSquarePlus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
// import StatisTable from '../statistic/table_chart'
// import StatisticChart from '../statistic/chart'
import Swal from 'sweetalert2';
import StatisticChart from '../chart/chart'
import $ from 'jquery'
import XLSX from 'xlsx-js-style';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';



export default (props) => {
    const { lang, proxy, auth, pages, functions, socket } = useSelector(state => state);
    const { openTab, renderDateTimeByFormat } = functions
    const { project_id, version_id, url } = useParams();
    const _token = localStorage.getItem("_token");
    const { formatNumber } = functions
    const stringifiedUser = localStorage.getItem("user");
    const _user = JSON.parse(stringifiedUser) || {}

    console.log(_user)
    const page = props.page
    const title = props.title
    const [apiDataName, setApiDataName] = useState([])
    const [apiData, setApiData] = useState([])
    const [dataStatis, setDataStatis] = useState([])
    const [loading, setLoading] = useState(false);
    const [dataTable_id, setDataTableID] = useState(null);

    const [inputValues, setInputValues] = useState({});
    const [searchValues, setSearchValues] = useState({});




    return (
        <>



            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <h4 style={{ marginLeft: "-30px" }}>Layout Chart</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="tab_style2">
                                <div class="tabbar">
                                    <nav>
                                        <div className="nav nav-tabs" style={{ borderBottomStyle: "0px" }} id="nav-tab" role="tablist">
                                            <div class="full graph_head_cus d-flex">
                                                <div class="heading1_cus margin_0 nav-item nav-link ">
                                                <h5>{title || lang["ui.table"]}</h5>
                                                </div>


                                            </div>
                                            <div class="table_section padding_infor_info_245">
                                                <div class="row column1">
                                                    <div class="col-md-12 col-lg-12">
                                                        <StatisticChart />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>





        </>

    )
}