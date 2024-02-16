
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Tables } from ".";
import { data, get } from "jquery";
import responseMessages from "../enum/response-code";
import { formatDate } from '../../redux/configs/format-date';
import $ from 'jquery'

const types = [
    ValidTypeEnum.INT,
    ValidTypeEnum.INT_UNSIGNED,
    ValidTypeEnum.BIGINT,
    ValidTypeEnum.BIGINT_UNSIGNED,
    ValidTypeEnum.BOOL,
    ValidTypeEnum.CHAR,
    ValidTypeEnum.DATE,
    ValidTypeEnum.DATETIME,
    ValidTypeEnum.DECIMAL,
    ValidTypeEnum.DECIMAL_UNSIGNED,
    ValidTypeEnum.EMAIL,
    ValidTypeEnum.PHONE,
    ValidTypeEnum.TEXT,
    // ValidTypeEnum.FILE,
    // ValidTypeEnum.PASSWORD
]

const typenull = [
    { value: false, label: "Not null" },
    { value: true, label: "Null" }

]

export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser) ? JSON.parse(stringifiedUser) : {}


    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/${version_id}/table/${table_id}`);
    };
    const { project_id, version_id, table_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [statusCreate, setStatusCreate] = useState({});
    const [fieldTemp, setFieldTemp] = useState({});
    // const [modalTemp, setModalTemp] = useState({ DATATYPE: types[0].value });
    const defaultValues = {
        field_name: '',
        DATATYPE: '',
        NULL: false,
        LENGTH: 65535,
        AUTO_INCREMENT: true,
        MIN: '',
        MAX: '',
        FORMAT: '',
        DECIMAL_PLACE: '',
        DEFAULT: '',
        DEFAULT_TRUE: '',
        DEFAULT_FALSE: ''
    };

    const [modalTemp, setModalTemp] = useState(defaultValues);

    // //////console.log(modalTemp)
    const [table, setTable] = useState({});
    const [tables, setTables] = useState({});
    const { tempFields, tempCounter } = useSelector(state => state); // const tempFields = useSelector( state => state.tempFields );
    //console.log(table)
    const dispatch = useDispatch();

    const handleCloseModal = () => {

        setModalTemp({
            field_name: '',
            DATATYPE: '',
            NULL: false,
            LENGTH: 65535,
            AUTO_INCREMENT: true,
            MIN: '',
            MAX: '',
            FORMAT: '',
            DECIMAL_PLACE: '',
            DEFAULT: '',
            DEFAULT_TRUE: '',
            DEFAULT_FALSE: ''
        });
        setShowModal(false);

        // setForeignKey({ ...foreignKey, table_id: "", ref_field_id: "" });
    };


    const [getTableFields, setTableFields] = useState([]);

    const [dataAdd, setDataAdd] = useState({});
    const [dataUpdate, setDataUpdate] = useState({});
    const [dataPreImport, setDataPreImport] = useState([]);


    useEffect(() => {
        fetch(`${proxy}/db/tables/v/${version_id}/table/${table_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                //console.log("data", data)
                if (success) {
                    if (data) {
                        setTableFields(data.fields);
                        setTable(data)

                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
        callData()
    }, [])


    const callData = () => {
        fetch(`${proxy}/db/preimport/${version_id}/${table_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                //console.log("data1", data)
                if (success) {
                    if (data) {
                        setDataPreImport(data)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    };





    //console.log(getTableFields)


    const handleChange = (event) => {
        const { name, value } = event.target;

        setDataAdd({ ...dataAdd, [name]: value });
    };
    //console.log(dataAdd)

    const addData = (e) => {
        e.preventDefault();
        const requestBody = {
            version_id: parseInt(version_id),
            table_id: parseInt(table_id),
            data: dataAdd
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/db/preimport/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                if (success) {

                    setDataAdd({})
                    Swal.fire({
                        title: lang["success.title"],
                        text: lang["success.title"],
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    }).then({

                    })
                    callData()
                    $("#closeAddData").click()
                    // functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            })
    };


    const [currentPageTable, setCurrentPageTable] = useState(1);
    const rowsPerPageTable = 12;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentData = dataPreImport.slice(indexOfFirstTable, indexOfLastTable);
    // ////console.log(currentTable)
    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(dataPreImport.length / rowsPerPageTable);


    const [formData, setFormData] = useState({});
    const handleUpdate = (row) => {
        //console.log(row)
        setFormData(row)
        setDataUpdate(row)
    };

    const handleChangeUpdate = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const updateData = (e) => {
        e.preventDefault();
        const requestBody = {
            version_id: parseInt(version_id),
            table_id: parseInt(table_id),
            data: formData
        };
        // ////console.log(requestBody)
        fetch(`${proxy}/db/preimport`, {
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
                if (success) {
                    callData()
                    Swal.fire({
                        title: lang["success.title"],
                        text: lang["success.title"],
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    }).then({

                    })
                } else {
                    functions.showApiResponseMessage(status);
                }
            })
    };


    const handleDelete = (row) => {
        const requestBody = {
            version_id: parseInt(version_id),
            table_id: parseInt(table_id),
            data: row
        };

        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.field"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["confirm"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class',
                // add more custom classes if needed
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/db/preimport`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${_token}`,
                    },
                    body: JSON.stringify(requestBody),
                })
                    .then((res) => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        if (success) {
                            callData()
                            // functions.showApiResponseMessage(status);
                            Swal.fire({
                                title: lang["success.title"],
                                text: lang["success.title"],
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then({
        
                            })
                        } else {
                            functions.showApiResponseMessage(status);
                        }
                    })
            }
        });
    }
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["managetable"]}</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5><label onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["edit table"]}<i class="fa fa-chevron-right ml-2"></i> {table.table_name}
                                    </label> </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">

                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addData">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                <>
                                                    <table class="table table-striped table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                {getTableFields.map(field => (
                                                                    <td key={field.id}>{field.field_name}</td>
                                                                ))}
                                                                <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentData.map((row, index) => {
                                                                if (row) {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td class="align-center" scope="row" style={{ minWidth: "50px" }} className="cell">{indexOfFirstTable + index + 1}</td>
                                                                            {getTableFields?.map((header) => (
                                                                                <td key={header.fomular_alias} className="cell">{functions.renderData(header, row)}</td>
                                                                            ))}
                                                                            <td class="align-center" style={{ minWidth: "130px" }}>
                                                                                <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => handleUpdate(row)} data-toggle="modal" data-target="#editData" title={lang["edit"]}></i>
                                                                                <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDelete(row)} title={lang["delete"]}></i>
                                                                            </td>
                                                                        </tr>)
                                                                } else {
                                                                    return null
                                                                }
                                                            })}
                                                        </tbody>
                                                    </table>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>{lang["show"]} {indexOfFirstTable + 1}-{Math.min(indexOfLastTable, dataPreImport?.length)} {lang["of"]} {dataPreImport?.length} {lang["results"]}</p>
                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination mb-0">
                                                                <li className={`page-item ${currentPageTable === 1 ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateTable(currentPageTable - 1)}>
                                                                        &laquo;
                                                                    </button>
                                                                </li>
                                                                {Array(totalPagesTable).fill().map((_, index) => (
                                                                    <li className={`page-item ${currentPageTable === index + 1 ? 'active' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateTable(index + 1)}>
                                                                            {index + 1}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                                <li className={`page-item ${currentPageTable === totalPagesTable ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateTable(currentPageTable + 1)}>
                                                                        &raquo;
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {/* {
                                            // tempFields && tempFields.length > 0 ? (
                                            table.table_name && table.table_name !== "" ? (
                                                <div className="button-container mt-4">
                                                    <button type="button" onClick={addTable} class="btn btn-success ">{lang["btn.update"]}</button>
                                                    <button type="button" onClick={() => back()} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                                    </button>

                                                </div>) : null
                                        } */}
                                        {/* <div className="button-container mt-4">
                                            <button type="button" onClick={() => navigate(-1)} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* add data */}
                <div class={`modal no-select-modal ${showModal ? 'show' : ''}`} id="addData">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["add data"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    {getTableFields.map(field => {
                                        // Skip fields with AUTO_INCREMENT set to true
                                        if (field.props.DATATYPE === 'INT' && field.props.AUTO_INCREMENT) {
                                            return null;
                                        }
                                        return (
                                            <div class="row" key={field.id}>
                                                <div class="form-group col-lg-12">
                                                    <label>{field.field_name} <span className='red_star'>*</span></label>
                                                    <input
                                                        type={field.props.DATATYPE === 'INT' ? 'number' : 'text'}
                                                        class="form-control"
                                                        name={field.fomular_alias}
                                                        required={!field.props.NULL}
                                                        maxLength={field.props.LENGTH}
                                                        min={field.props.MIN || undefined}
                                                        max={field.props.MAX || undefined}
                                                        pattern={field.props.PATTERN || undefined}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={addData} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddData" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* update data */}
                <div class={`modal no-select-modal ${showModal ? 'show' : ''}`} id="editData">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["update data"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    {getTableFields.map(field => {
                                        // Skip fields with AUTO_INCREMENT set to true
                                        if (field.props.DATATYPE === 'INT' && field.props.AUTO_INCREMENT) {
                                            return null;
                                        }
                                        return (
                                            <div class="row" key={field.id}>
                                                <div class="form-group col-lg-12">
                                                    <label>{field.field_name} <span className='red_star'>*</span></label>
                                                    <input
                                                        type={field.props.DATATYPE === 'INT' ? 'number' : 'text'}
                                                        class="form-control"
                                                        name={field.fomular_alias}
                                                        required={!field.props.NULL}
                                                        maxLength={field.props.LENGTH}
                                                        min={field.props.MIN || undefined}
                                                        max={field.props.MAX || undefined}
                                                        pattern={field.props.PATTERN || undefined}
                                                        onChange={handleChangeUpdate}
                                                        value={formData[field.fomular_alias]}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={updateData} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeAddField" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

