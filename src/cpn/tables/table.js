
import { useParams } from "react-router-dom";
import Header from "../common/header"
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Tables } from ".";
import Diagram from './diagram/digram';
import responseMessages from "../enum/response-code";
import functions from "../../redux/configs/functions";
import { formatDate } from "../../redux/configs/format-date";


const TABLES = "tables";
const DIAGRAM = "diagram"

export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    const [showModal, setShowModal] = useState(false);

    const storedProjectId = localStorage.getItem('project_id');

    const dispatch = useDispatch();

    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/detail/${storedProjectId}`);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const [table, setTable] = useState({});
    const [tables, setTables] = useState({});

    const [section, setSection] = useState(DIAGRAM)

    useEffect(() => {

        fetch(`${proxy}/db/tables/v/${version_id}/tables/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)

                if (success) {

                    if (data) {
                        setTables(data);
                        const { tables, fields } = data;
                        dispatch({
                            branch: "db",
                            type: "initializeData",
                            payload: { tables, fields }
                        })
                        setSection(TABLES)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    const [tableUpdate, setUpdateTable] = useState([]);
    const getIdTable = (tableid) => {
        setUpdateTable(tableid);

    }
    useEffect(() => {
        // console.log(tableUpdate);

    }, [tableUpdate]);

    const updateTable = (e) => {
        e.preventDefault();
        const requestBody = {
            version_id,
            table_id: tableUpdate.id,
            table_name: tableUpdate.table_name,
        };
        // console.log(requestBody)
        fetch(`${proxy}/db/tables/table`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                functions.showApiResponseMessage(status);
            })


    };
    const handleDeleteTable = (tableid) => {
        const requestBody = {
            version_id,
            table_id: parseInt(tableid.id)
        };
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.table"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class',
                // add more custom classes if needed
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/db/tables/table`, {
                    method: 'DELETE',
                    headers: {
                        "content-type": "application/json",
                        Authorization: `${_token}`,
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(res => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        functions.showApiResponseMessage(status);
                    });
            }
        });
    }
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const rowsPerPageTable = 15;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);
    const openPageAddTable = (project) => {
        window.location.href = `/projects/${version_id}/tables/field`;
    };

    const openPageUpdateTable = (tableid) => {
        window.location.href = `/projects/${version_id}/table/${tableid.id}`;
    };
    // console.log(currentTable)

    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            {/* <h4><a onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-4"></i></a>Quản lý bảng</h4> */}
                            <h4>{lang["managetable"]}</h4>
                        </div>
                    </div>
                </div>

                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">

                                    <h5><label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["managetable"]}
                                    </label> </h5>
                                </div>

                                <div class="ml-auto" onClick={() => { setSection(section === TABLES ? DIAGRAM : TABLES) }}>
                                    <i class="fa fa-database pointer icon-database"></i>
                                </div>

                            </div>

                            <div class={`table_section padding_infor_info`}>
                                <div class={`row column1 ${section == TABLES ? "" : "d-none"}`}>
                                    <div class="form-group col-lg-4">
                                        {/* <label class="font-weight-bold">Tên bảng <span className='red_star'>*</span></label>
                                                <input type="text" class="form-control" 
                                                 placeholder="" /> */}
                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            {/* <p class="font-weight-bold">Danh sách bảng </p> */}
                                            {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTable">
                                                <i class="fa fa-plus"></i>
                                            </button> */}
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => openPageAddTable()}>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                currentTable && currentTable.length > 0 ? (
                                                    <>
                                                        <table class="table table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["table name"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["creator"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col">{lang["create-at"]}</th>

                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentTable.map((table, index) => (
                                                                    <tr key={table.id}>
                                                                        <td scope="row">{indexOfFirstTable + index + 1}</td>
                                                                        <td style={{ maxWidth: "100px" }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap"
                                                                            }}>
                                                                                {table.table_name}
                                                                            </div>
                                                                        </td>
                                                                        <td>{table.create_by?.fullname}</td>
                                                                        <td>{formatDate(table.create_at)}</td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>

                                                                            {/* <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => getIdTable(table)} data-toggle="modal" data-target="#editTable" title={lang["edit"]}></i> */}
                                                                            <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => openPageUpdateTable(table)} title={lang["edit"]}></i>

                                                                            <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteTable(table)} title={lang["delete"]}></i>
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p>
                                                                {lang["show"]} {indexOfFirstTable + 1}-{Math.min(indexOfLastTable, tables.tables.length)} {lang["of"]} {tables.tables.length} {lang["results"]}
                                                            </p>
                                                            <nav aria-label="Page navigation example">
                                                                <ul className="pagination mb-0">
                                                                    {/* Nút đến trang đầu */}
                                                                    <li className={`page-item ${currentPageTable === 1 ? 'disabled' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateTable(1)}>
                                                                            &#8810;
                                                                        </button>
                                                                    </li>
                                                                    <li className={`page-item ${currentPageTable === 1 ? 'disabled' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateTable(Math.max(1, currentPageTable - 1))}>
                                                                            &laquo;
                                                                        </button>
                                                                    </li>
                                                                    {currentPageTable > 2 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                    {Array(totalPagesTable).fill().map((_, index) => {
                                                                        if (
                                                                            index + 1 === currentPageTable ||
                                                                            (index + 1 >= currentPageTable - 1 && index + 1 <= currentPageTable + 1)
                                                                        ) {
                                                                            return (
                                                                                <li key={index} className={`page-item ${currentPageTable === index + 1 ? 'active' : ''}`}>
                                                                                    <button className="page-link" onClick={() => paginateTable(index + 1)}>
                                                                                        {index + 1}
                                                                                    </button>
                                                                                </li>
                                                                            );
                                                                        }
                                                                        return null;  // Đảm bảo trả về null nếu không có gì được hiển thị
                                                                    })}
                                                                    {currentPageTable < totalPagesTable - 1 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                    <li className={`page-item ${currentPageTable === totalPagesTable ? 'disabled' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateTable(Math.min(totalPagesTable, currentPageTable + 1))}>
                                                                            &raquo;
                                                                        </button>
                                                                    </li>
                                                                    {/* Nút đến trang cuối */}
                                                                    <li className={`page-item ${currentPageTable === totalPagesTable ? 'disabled' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateTable(totalPagesTable)}>
                                                                            &#8811;
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </nav>
                                                        </div>

                                                    </>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>Chưa có bảng</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div class={`row column1 ${section == DIAGRAM ? "" : "d-none"}`}>
                                    <Diagram />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </div >
    )
}

