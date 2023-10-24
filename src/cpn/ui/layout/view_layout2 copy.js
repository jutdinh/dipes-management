
import { useParams } from "react-router-dom";
import Header from "../../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport, faDownload, faSquarePlus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Tables } from "..";
export default (props) => {
    const { lang, proxy, auth } = useSelector(state => state);
    const { title, data, calculate, statistic } = props;
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();

    let uis_temp;


    if (data[0]?.fields) {
        let fields_temp = data[0].fields.slice(0, 4); // Chỉ lấy 5 phần tử đầu tiên của mảng fields

        uis_temp = fields_temp.map((field, index) => {
            const tempObject = {
                id: index + 1,
            };

            for (let f of data[0].fields) {
                tempObject[f.field_name] = `  ${f.field_name} ${index + 1}`;
            }

            return tempObject;
        });
    } else {
        uis_temp = [
            {
                "id": 1,
                "data": lang["data"] + "1"
            },
            {
                "id": 2,
                "data": lang["data"] + "2"
            }, {
                "id": 3,
                "data": lang["data"] + "3"
            }, {
                "id": 4,
                "data": lang["data"] + "4"
            }
        ]
    }

    let uis_temp_cal;

    if (calculate) {
        let calculate_temp = calculate.slice(0, 4);
        uis_temp_cal = calculate_temp.map((field, index) => {
            const tempObject = {
                id: index + 1,
            };

            for (let f of calculate) {
                tempObject[f.display_name] = ` ${f.display_name} ${index + 1}`;
            }

            return tempObject;
        });
    }
    const [currentPageUi, setCurrentPageUi] = useState(1);
    const rowsPerPageUi = 4;

    const indexOfLastUi = currentPageUi * rowsPerPageUi;
    const indexOfFirstUi = indexOfLastUi - rowsPerPageUi;
    const currentUi = uis_temp.slice(indexOfFirstUi, indexOfLastUi);

    const paginateUi = (pageNumber) => setCurrentPageUi(pageNumber);
    const totalPagesUi = Math.ceil(uis_temp.length / rowsPerPageUi);
    // console.log("statistic", statistic)
    // console.log("cal", uis_temp_cal)

    return (
        <div class="container-fluid">
            <div class="row column_title">
                <div class="col-md-12">
                    <div class="page_title" style={{ marginLeft: "0px", marginRight: "0px" }}>
                        <h4 style={{ marginLeft: "-30px" }}>Layout 2</h4>
                    </div>
                </div>
            </div>
            {/* List table */}
            <div class="row">
                <div class="col-md-12">
                    <div class="white_shd full margin_bottom_30">
                        <div class="full graph_head d-flex">
                            <div class="heading1 margin_0 ">
                                <h5> <a ><i class="fa fa-chevron-circle-left mr-3"></i></a>{title || lang["ui.table"]}</h5>
                            </div>

                            <div class="ml-auto pointer" data-toggle="modal" title="Add">

                                <FontAwesomeIcon icon={faSquarePlus} className="icon-add" />
                            </div>


                            <div class="ml-4 pointer" data-toggle="modal" data-target="#exportExcel" title="Export to file">

                                <FontAwesomeIcon icon={faDownload} className="icon-export" />
                            </div>

                            <div class="ml-4 pointer" data-toggle="modal" data-target="#exportExcelEx" title="Export Data Example">
                                <FontAwesomeIcon icon={faFileExport} className="icon-export-ex" />

                            </div>
                            <div class="ml-4 mr-3 pointer" title="Import data">
                                <FontAwesomeIcon icon={faFileImport} className="icon-import" />
                            </div>
                        </div>
                        <div class="table_section padding_infor_info_245">
                            <div class="row column1">
                                <div class="col-md-12 col-lg-12">
                                    <div class="table-responsive">
                                        {
                                            data && data.length > 0 ? (
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold" style={{width: "80px"}}>{lang["log.no"]}</th>
                                                            {data[0]?.fields.map((ui, index) => (
                                                                <th class="font-weight-bold">{ui.field_name}</th>
                                                            ))}
                                                            {calculate.map((cal, index) => (
                                                                <th class="font-weight-bold">{cal.display_name}</th>
                                                            ))}
                                                            <th class="font-weight-bold align-center" style={{ minWidth: "100px" }}>{lang["log.action"]}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUi.map((ui, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                {data[0]?.fields.map((field, fieldIndex) => (
                                                                    <td key={fieldIndex}>{ui[field.field_name]}</td>
                                                                ))}
                                                                {uis_temp_cal.map((calc, calcIndex) => (
                                                                    <td key={calcIndex}>{calc[calculate[calcIndex].display_name]}</td>
                                                                ))}
                                                                <td class="align-center" >
                                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" title={lang["edit"]}></i>
                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" title={lang["delete"]}></i>
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
                                                <table class="table table-hover ">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold" style={{width: "80px"}}>{lang["log.no"]}</th>
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
                                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" title={lang["edit"]}></i>
                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" title={lang["delete"]}></i>
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
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="white_shd full margin_bottom_30">
                        <div class="full graph_head d-flex">
                            <div class="heading1 margin_0 ">
                                <h5> <a ><i class="fa fa-chevron-circle-left mr-3"></i></a>{title || lang["ui.table_statis"]}</h5>
                            </div>
                            {/* <div class="ml-auto">
                                <button type="button" class="btn btn-primary custom-buttonadd ml-auto" >
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div> */}
                        </div>
                        <div class="table_section padding_infor_info_245" >
                            <div class="row column1">
                                <div class="col-md-12 col-lg-12">
                                    <div class="table-responsive">
                                        {
                                            data && data.length > 0 ? (
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold" style={{width: "80px"}}>{lang["log.no"]}</th>
                                                            {data[0]?.fields.map((ui, index) => (
                                                                <th class="font-weight-bold">{ui.field_name}</th>
                                                            ))}
                                                            {calculate.map((cal, index) => (
                                                                <th class="font-weight-bold">{cal.display_name}</th>
                                                            ))}
                                                           
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUi.map((ui, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                {data[0]?.fields.map((field, fieldIndex) => (
                                                                    <td key={fieldIndex}>{ui[field.field_name]}</td>
                                                                ))}
                                                                {/* {uis_temp_cal.map((calc, calcIndex) => (
                                                                    <td key={calcIndex}>{calc[calculate[calcIndex].display_name]}</td>
                                                                ))} */}

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold" style={{width: "80px"}}>{lang["log.no"]}</th>
                                                            <th class="font-weight-bold">{lang["fields name"]}</th>
                                                           
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUi.map((ui, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{ui.data}</td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

