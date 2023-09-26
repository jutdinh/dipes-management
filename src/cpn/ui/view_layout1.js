
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport, faDownload, faSquarePlus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';
import MyPieChart from "./chart/pie";
import { Tables } from ".";
export default (props) => {
    const { lang, proxy, auth } = useSelector(state => state);
    const { title, data, calculate, statistic, fields } = props;
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
console.log(props)
    let uis_temp;


    if (fields) {
        let fields_temp = fields?.slice(0, 5); // Chỉ lấy 5 phần tử đầu tiên của mảng fields

        uis_temp = fields_temp.map((field, index) => {
            const tempObject = {
                id: index + 1,
            };

            for (let f of fields) {
                tempObject[f.display_name] = `  ${f.display_name} ${index + 1}`;
            }

            return tempObject;
        });
    } else {
        uis_temp = [
            {
                "id": 1,
                "data": lang["data"] + " 1"
            },
            {
                "id": 2,
                "data": lang["data"] + " 2"
            }, {
                "id": 3,
                "data": lang["data"] + " 3"
            }, {
                "id": 4,
                "data": lang["data"] + " 4"
            },
           
        ]
    }

    let uis_temp_cal;


    if (calculate) {
        let calculate_temp = calculate.slice(0, 5);
        uis_temp_cal = calculate_temp.map((field, index) => {
            const tempObject = {
                id: index + 1,
            };

            for (let f of calculate) {
                // tempObject[f.display_name] = ` ${f.display_name} ${index + 1}`;
                tempObject[f.display_name] = lang["data"];
            }

            return tempObject;
        });
    }
    const [currentPageUi, setCurrentPageUi] = useState(1);
    const rowsPerPageUi = 5;

    const indexOfLastUi = currentPageUi * rowsPerPageUi;
    const indexOfFirstUi = indexOfLastUi - rowsPerPageUi;
    const currentUi = uis_temp.slice(indexOfFirstUi, indexOfLastUi);

    const paginateUi = (pageNumber) => setCurrentPageUi(pageNumber);
    const totalPagesUi = Math.ceil(uis_temp.length / rowsPerPageUi);
    // console.log("statistic", statistic)
    // console.log("cal", uis_temp_cal)
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff4263'];

    const MyPieChart = () => {
        const uis_temp = [
            {
                "id": 1,
                "data": lang["data"] + " 1"
            },
            {
                "id": 2,
                "data": lang["data"] + " 2"
            },
            {
                "id": 3,
                "data": lang["data"] + " 3"
            },
            {
                "id": 4,
                "data": lang["data"] + " 4"
            },
            
        ];

        let pieData = [];

        if (uis_temp.length < 10) {
            pieData = uis_temp.map(item => ({
                name: item.data,
                value: item.id,
            }));
        }

        return (
            <ResponsiveContainer className="pie-chart-container">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#8884d8"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    {/* <Legend
                        verticalAlign="bottom"
                        height={60}
                        wrapperStyle={{ paddingBottom: '5px' }}
                        iconType="circle"
                        align="center"
                    /> */}
                    <Tooltip
                        content={({ payload }) => {
                            if (payload && payload.length > 0) {
                                return (
                                    <div className="custom-tooltip">
                                        <p>{`${payload[0].name} : ${payload[0].value.toFixed()}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };



    // const colorIndices = display.map((header) => headers.indexOf(header));

    return (
        <div class="container-fluid">
            <div class="row column_title">
                <div class="col-md-12">
                    <div class="page_title" style={{ marginLeft: "0px", marginRight: "0px" }}>
                        <h4 style={{ marginLeft: "-30px" }}>Layout 1</h4>
                    </div>
                </div>
            </div>
            {/* List table */}
            <div class="row">
                <div class="col-md-12">
                    <div class="white_shd full margin_bottom_30">
                        <div class="full graph_head_cus d-flex">

                            <div class="heading1_cus margin_0 ">
                                <div class="tab_style2">
                                    <div class="tabbar">
                                        <nav>
                                            <div class="nav nav-tabs" style={{ borderBottomStyle: "0px" }} id="nav-tab" role="tablist">
                                                <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home_s2" role="tab" aria-controls="nav-home_s2" aria-selected="true">   <h5> <a ></a>{title || lang["ui.table"]}</h5></a>
                                                <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile_s2" role="tab" aria-controls="nav-profile_s2" aria-selected="false"> <h5>{lang["statistic"]}: {title || lang["ui.table_statis"]}</h5></a>
                                            </div>
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <div class="ml-auto mt-2 pointer" data-toggle="modal" title="Add">

                                <FontAwesomeIcon icon={faSquarePlus} className="icon-add" />
                            </div>

                            <div class="ml-4 mt-2 pointer" data-toggle="modal" data-target="#exportExcel" title="Export to file">

                                <FontAwesomeIcon icon={faDownload} className="icon-export" />
                            </div>

                            <div class="ml-4 mt-2 pointer" data-toggle="modal" data-target="#exportExcelEx" title="Export Data Example">
                                <FontAwesomeIcon icon={faFileExport} className="icon-export-ex" />

                            </div>
                            <div class="ml-4 mr-3 mt-2 pointer" title="Import data">
                                <FontAwesomeIcon icon={faFileImport} className="icon-import" />
                            </div>


                        </div>
                        <div class="tab_style2">
                            <div class="tabbar padding_infor_info_layout1">
                                <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="nav-home_s2" role="tabpanel" aria-labelledby="nav-home-tab">
                                        <div class="table_section">
                                            <div class="col-md-12 col-lg-12">
                                                <div class="table-responsive">
                                                    {
                                                        fields && fields.length > 0 ? (
                                                            <table class="table table-hover">
                                                                <thead>
                                                                    <tr class="color-tr">
                                                                        <th class="font-weight-bold" style={{ width: "80px" }}>{lang["log.no"]}</th>
                                                                        
                                                                        {fields?.map((ui, index) => (
                                                                            <th class="font-weight-bold">{ui.display_name}</th>
                                                                        ))}
                                                                        {calculate.map((cal, index) => (    
                                                                            <th class="font-weight-bold">{cal.display_name}</th>
                                                                        ))}
                                                                        <th class="font-weight-bold align-center" style={{ minWidth: "100px" }}>{lang["log.action"]}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {currentUi.map((ui, index) => (
                                                                        <tr key={index} >
                                                                            <td>{index + 1}</td>

                                                                            {fields?.map((field, fieldIndex) => (
                                                                                <td key={fieldIndex}>{ui[field.display_name]}</td>
                                                                            ))}
                                                                            {uis_temp_cal.map((calc, calcIndex) => (
                                                                                <td key={calcIndex}>{calc[calculate[calcIndex].display_name]}</td>
                                                                            ))}

                                                                            <td class="align-center" >
                                                                                <i class="fa fa-edit size-24 pointer icon-margin icon-edit" title={lang["edit"]}></i>
                                                                                <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" title={lang["delete"]}></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))}

                                                                    {/* {statistic && statistic.map((stat, index) => (
                                                            <tr key={index}>
                                                                <td class="font-weight-bold" colspan={`${data[0]?.fields.length + calculate.length + 2}`} style={{ textAlign: 'right' }}>
                                                                    {stat.display_name}: Dữ liệu
                                                                </td>
                                                            </tr>
                                                        ))} */}

                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <table class="table table-hover">
                                                                <thead>
                                                                    <tr class="color-tr">
                                                                        <th class="font-weight-bold" style={{ width: "80px" }}>{lang["log.no"]}</th>
                                                                        <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                        <th class="font-weight-bold align-center" style={{ width: "100px" }} scope="col" >{lang["log.action"]}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {currentUi.map((ui, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{ui.data}</td>
                                                                            <td class="align-center" >
                                                                                <i class="fa fa-edit size-24 pointer icon-margin icon-edit" title={lang["edit"]}></i>
                                                                                <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" title={lang["delete"]}></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    {/* <tr>
                                                            <td class="font-weight-bold" colspan="3" style={{ textAlign: 'right' }}>Thống kê: 4</td>
                                                        </tr> */}
                                                                </tbody>
                                                            </table>
                                                        )
                                                    }
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>{lang["show"]} {indexOfFirstUi + 1}-{Math.min(indexOfLastUi, uis_temp.length)} {lang["of"]} {uis_temp.length} {lang["results"]}</p>
                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination mb-0">
                                                                <li className={`page-item ${currentPageUi === 1 ? 'disabled' : ''}`}>
                                                                    <span className="page-link" >
                                                                        &laquo;
                                                                    </span>
                                                                </li>
                                                                {Array(totalPagesUi).fill().map((_, index) => (
                                                                    <li key={index} className={`page-item ${currentPageUi === index + 1 ? 'active' : ''}`}>
                                                                        <span className="page-link" >
                                                                            {index + 1}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                                <li className={`page-item ${currentPageUi === totalPagesUi ? 'disabled' : ''}`}>
                                                                    <span className="page-link" >
                                                                        &raquo;
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="nav-profile_s2" role="tabpanel" aria-labelledby="nav-profile-tab">
                                        <div class="col-md-12">

                                            <div class="row column1">
                                                <div class="col-md-6 col-lg-6">
                                                    <div class="table-responsive">
                                                        {
                                                            data && data.length > 0 ? (
                                                                <table class="table table-hover">
                                                                    <thead>
                                                                        <tr class="color-tr">
                                                                            <th class="font-weight-bold" style={{ width: "80px" }}>{lang["log.no"]}</th>
                                                                            {fields?.slice(0, 1).map((ui, index) => (
                                                                                <th class="font-weight-bold">{ui.display_name}</th>
                                                                            ))}
                                                                            {/* {calculate.slice(0, 1).map((cal, index) => (
                                                                                <th class="font-weight-bold">{cal.display_name}</th>
                                                                            ))} */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentUi.map((ui, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                {fields?.slice(0, 1).map((field, fieldIndex) => (
                                                                                    <td key={fieldIndex}>
                                                                                        <div style={{
                                                                                            display: 'inline-block',
                                                                                            width: '10px',
                                                                                            height: '10px',
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: COLORS[index],
                                                                                            marginRight: '10px'
                                                                                        }}></div>
                                                                                        {ui[field.display_name]}
                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>

                                                            ) : (
                                                                <table class="table table-hover">
                                                                    <thead>
                                                                        <tr class="color-tr">
                                                                            <th class="font-weight-bold" style={{ width: "80px" }}>{lang["log.no"]}</th>
                                                                            <th class="font-weight-bold">{lang["fields name"]}</th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentUi.map((ui, index) => (
                                                                            <tr key={index} >
                                                                                <td>{index + 1}</td>
                                                                                <td><div style={{
                                                                                    display: 'inline-block',
                                                                                    width: '10px',
                                                                                    height: '10px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: COLORS[index],
                                                                                    marginRight: '10px'
                                                                                }}></div>{ui.data}</td>
                                                                            </tr>
                                                                        ))}

                                                                    </tbody>
                                                                </table>
                                                            )
                                                        }
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p>{lang["show"]} {indexOfFirstUi + 1}-{Math.min(indexOfLastUi, uis_temp.length)} {lang["of"]} {uis_temp.length} {lang["results"]}</p>
                                                            <nav aria-label="Page navigation example">
                                                                <ul className="pagination mb-0">
                                                                    <li className={`page-item ${currentPageUi === 1 ? 'disabled' : ''}`}>
                                                                        <span className="page-link" >
                                                                            &laquo;
                                                                        </span>
                                                                    </li>
                                                                    {Array(totalPagesUi).fill().map((_, index) => (
                                                                        <li key={index} className={`page-item ${currentPageUi === index + 1 ? 'active' : ''}`}>
                                                                            <span className="page-link" >
                                                                                {index + 1}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                    <li className={`page-item ${currentPageUi === totalPagesUi ? 'disabled' : ''}`}>
                                                                        <span className="page-link" >
                                                                            &raquo;
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-lg-6">
                                                    < MyPieChart />
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
    )
}

