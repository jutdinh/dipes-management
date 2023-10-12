
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Tables } from ".";
import { data } from "jquery";
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
    ValidTypeEnum.TEXT
]
const typenull = [
    { value: false, label: "Not null" },
    { value: true, label: "Null" }

]
export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser)
    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/${version_id}/tables`);
    };
    const { project_id, version_id } = useParams();
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

    // console.log(modalTemp)
    const [table, setTable] = useState({});
    const [tables, setTables] = useState({});
    const { tempFields, tempCounter } = useSelector(state => state); // const tempFields = useSelector( state => state.tempFields );

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

    const [errors, setErrors] = useState({});
    // console.log(modalTemp)
    const validate = () => {
        let temp = {};

        temp.field_name = modalTemp.field_name ? "" : lang["error.input"];
        temp.DATATYPE = modalTemp.DATATYPE ? "" : lang["error.input"];

        // if (isOnforenkey) {
        //     if (!foreignKey.table_id) {
        //         temp.table_id = lang["error.select.table"];
        //     } else {
        //         temp.table_id = "";
        //     }

        //     if (!foreignKey.ref_field_id) {
        //         temp.ref_field_id = lang["error.select.field"];
        //     } else {
        //         temp.ref_field_id = "";
        //     }
        // }

        setErrors({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const [errorTable, setErrorTable] = useState({});
    const validateTablename = () => {
        let temp = {};
        temp.table_name = table.table_name ? "" : lang["error.input"];



        setErrorTable({
            ...temp
        });
        return Object.values(temp).every(x => x === "");
    }


    const handleSubmitModal = () => {
        if (validate()) {
            setFieldTemp(modalTemp)
            if (isOn) {
                setPrimaryKey([...primaryKey, tempCounter])
            }

            if (isOnforenkey) {
                setForeignKeys([...foreignKeys, { ...foreignKey, index: tempCounter }])
            }

            setIsOn(false)
            setIsOnforenkey(false)
            // setForeignKey({ ...foreignKey, table_id: "", ref_field_id: "" });

            dispatch({
                branch: "db",
                type: "addField",
                payload: {
                    field: { ...modalTemp, index: tempCounter }
                }
            })
            setModalTemp((prevModalTemp) => ({
                ...prevModalTemp,
                ...defaultValues,
            }));
            setModalTemp({
                field_name: '',
                DATATYPE: '',
                NULL: false,
                LENGTH: 66535,
                AUTO_INCREMENT: true,
                MIN: '',
                MAX: '',
                FORMAT: '',
                DECIMAL_PLACE: '',
                DEFAULT: '',
                DEFAULT_TRUE: '',
                DEFAULT_FALSE: ''
            });

            // Swal.fire({
            //     title: lang["success.title"],
            //     text: lang["success.update"],
            //     icon: 'success',
            //     showConfirmButton: false,
            //     timer: 1500,
            // })
            // $("#closeAddField").click()

        }

    };

    const handleUpdatetModal = () => {
        if (validate()) {
            if (!isOn && primaryKey.includes(fieldTempUpdate.index)) {
                const newPrimaryKey = primaryKey.filter(index => index !== fieldTempUpdate.index);
                setPrimaryKey(newPrimaryKey);
            }
            if (isOn) {
                const newPrimaryKey = new Set([...primaryKey, fieldTempUpdate.index]);
                const uniquePrimaryKey = [...newPrimaryKey];
                setPrimaryKey(uniquePrimaryKey)
            }
            if (isOnforenkey) {
                const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.index !== fieldTempUpdate.index);
                updatedForeignKeys.push({ ...foreignKey, index: fieldTempUpdate.index });
                setForeignKeys(updatedForeignKeys);
            } else {
                const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.index !== fieldTempUpdate.index);
                setForeignKeys(updatedForeignKeys);
            }
            dispatch({
                branch: "db",
                type: "updateField",
                payload: {
                    field: { ...modalTemp }

                }
            })
            setModalTemp((prevModalTemp) => ({
                ...prevModalTemp,
                ...defaultValues,
            }));

            Swal.fire({
                title: lang["success.title"],
                text: lang["success.update"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })

            $('#closeEditField').click()
        }

    };

    // console.log(modalTemp)

    const [fieldTempUpdate, setFieldTempupdate] = useState([]);
    useEffect(() => {
        if (primaryKey.includes(fieldTempUpdate.index)) {
            setIsOn(true);
        }
        else {
            setIsOn(false);
        }
    }, [fieldTempUpdate]);

    useEffect(() => {

        if (foreignKeys.some((fk) => fk.index === fieldTempUpdate.index)) {
            setIsOnforenkey(true);


        }
        else {
            setIsOnforenkey(false);
        }
    }, [fieldTempUpdate]);
    // console.log(fieldTempUpdate)
    const loadModalTemp = (fieldData) => {
        setModalTemp({
            ...defaultValues,
            ...fieldData
        });
    }

    const getIdFieldTemp = (fieldId) => {
        setFieldTempupdate(fieldId);
        loadModalTemp(fieldId); // load data vào modalTemp khi mở form chỉnh sửa
        // console.log(fieldId)

    }
    const deleteFieldTemp = (fieldId) => {
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.field"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class'
            }
        })

            .then((result) => {
                if (result.isConfirmed) {
                    const tempFieldsUpdate = tempFields.filter((field) => field.index !== fieldId.index);
                    const newPrimaryKey = primaryKey.filter(index => index !== fieldId.index);
                    setPrimaryKey(newPrimaryKey);

                    dispatch({
                        branch: "db",
                        type: "updateFields",
                        payload: {
                            tempFieldsUpdate
                        }
                    })

                    Swal.fire({
                        title: lang["success"],
                        text: lang["delete.success.field"],
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                }
            });
    }

    useEffect(() => {
        fetch(`${proxy}/db/tables/v/${version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {
                        setTables(data);
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    const [fields, setFields] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState(null);
    // Chọn bảng
    const handleSelectTable = async (event) => {
        const tableId = event.target.value;
        setSelectedTableId(tableId);

        // Fetch fields for the selected table
        fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data } = resp;
                if (success) {
                    if (data) {
                        setFields(data);
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            });
    };

    // console.log(tempFields)
    // console.log(table)
    const [isTableCreated, setTableCreated] = useState(false);
    const addTable = (e) => {
        e.preventDefault();
        if (!isTableCreated) {
            // if (primaryKey.length === 0) {
            //     Swal.fire({
            //         title: lang["error.title"],
            //         text: lang["primary-table"],
            //         icon: "error",
            //         showConfirmButton: true,

            //     });
            //     return;
            // }
            if (validateTablename()) {
                // console.log( table )
                const tableRequestBody = {
                    version_id: version_id,
                    table: {
                        table_name: table.table_name
                    }
                };
                //console.log("body",tableRequestBody)
                fetch(`${proxy}/db/tables/table`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${_token}`,
                    },
                    body: JSON.stringify(tableRequestBody),
                })
                    .then((res) => res.json())
                    .then((resp) => {
                        const { success, content, data, status } = resp;
                        if (success) {
                            if (tempFields.length > 0) {
                                const tableId = data.table.id; // Lấy id bảng vừa tạo
                                addField(tableId, status);
                            } else {
                                functions.showApiResponseMessage(status);
                            }



                        } else {
                            functions.showApiResponseMessage(status);
                        }
                    });
            }

            setTableCreated(true);
        }


    };
    // console.log(tempFields)

    const addField = (tableId, prevStatus = undefined) => {
        if (primaryKey.length !== 0) {
            const fieldRequestBody = {
                version_id,
                table_id: tableId,
                fields: [
                    ...tempFields
                ],
            };
            // console.log("field", fieldRequestBody)

            fetch(`${proxy}/db/fields/fields`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${_token}`,
                },
                body: JSON.stringify(fieldRequestBody),
            })
                .then((res) => res.json())
                .then((resp) => {
                    const { success, content, data, status } = resp;
                    // console.log(data)
                    if (success) {

                        addKey({ tableId, data }, prevStatus);
                        // handleClickPrimary(fieldId);
                    } else {
                        functions.showApiResponseMessage(status);

                    }
                });
        }

    };

    const addKey = ({ data, tableId }, prevStatus) => {
        const matchingItem = data.filter(item => primaryKey.indexOf(item.index) != -1)
        const primaryKeyid = matchingItem.map(item => item.id)

        for (let i = 0; i < foreignKeys.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (foreignKeys[i].index === data[j].index) {
                    foreignKeys[i].field_id = data[j].id
                }
            }
        }

        const KeyRequestBody = {
            version_id,
            table_id: tableId,
            primary_key: primaryKeyid,
            foreign_keys: foreignKeys
        };
        // console.log("KLey", KeyRequestBody)

        fetch(`${proxy}/db/tables/table/keys`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(KeyRequestBody),
        })
            .then((res) => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                functions.showApiResponseMessage(prevStatus);

            });
    };

    //primary
    const [isOn, setIsOn] = useState(false);
    const [primaryKey, setPrimaryKey] = useState([]);

    const handleClickPrimary = () => {
        if (isOn) {
            setIsOn(false);

        } else {
            setIsOn(true);

        }
    };

    //forenkey
    const [isOnforenkey, setIsOnforenkey] = useState(false);
    const [foreignKey, setForeignKey] = useState({ field_id: null, table_id: null, ref_field_id: null });
    const [foreignKeys, setForeignKeys] = useState([]);

    const handleClickForenkey = () => {
        if (isOnforenkey) {
            setIsOnforenkey(false);

        } else {
            setIsOnforenkey(true);

        }
    };

    const [tableUpdate, setUpdateTable] = useState([]);
    const getIdTable = (tableid) => {
        setUpdateTable(tableid);
    }
    const autoType = (field_id) => {
        const field = fields.find(f => f.id == field_id);

        if (field) {
            // console.log(field)
            setModalTemp({
                ...modalTemp, ...field.props
            });
            // console.log(modalTemp)

        }


    }
    const handleSubmit = (e) => {
        // Gửi temporaryData lên server để thêm dữ liệu vào cơ sở dữ liệu
        e.preventDefault();
        const requestBody = {
            version_id,
            table_id: tableUpdate.id,
            table_name: tableUpdate.table_name,

        };
        // console.log(requestBody)
        fetch(`${proxy}/db/tables/table`, {
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
                functions.showApiResponseMessage(status);

            })
        // Sau khi thành công, có thể xóa bảng tạm thời
        setFieldTemp([]);
    };

    // useEffect(() => {
    //     // console.log(tableUpdate);
    // }, [tableUpdate]);

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

    const handleDeleteTask = (tableid) => {
        const requestBody = {
            version_id,
            table_id: parseInt(tableid.id)
        };

        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.api"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.table"],
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
    const rowsPerPageTable = 12;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentTable = tempFields?.slice(indexOfFirstTable, indexOfLastTable);

    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(tempFields?.length / rowsPerPageTable);

    // console.log("p key", primaryKey)
    // console.log("f key", foreignKeys)
    // // console.log(modalTemp)

    // console.log(tempFields)
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

                                    <h5><label onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["create table"]}
                                    </label> </h5>
                                </div>
                            </div>

                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-4">
                                        <label class="font-weight-bold">{lang["table name"]} <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={table.table_name}
                                            onChange={(e) => setTable({ ...table, table_name: e.target.value })}
                                            placeholder=""
                                        />
                                        {errorTable.table_name && <p className="text-danger">{errorTable.table_name}</p>}
                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">{lang["list fields"]}</p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addField">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                            {/* setIsOn(false)
                                                    setIsOnforenkey(false) */}
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                currentTable && currentTable.length > 0 ? (
                                                    <>
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["key"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["fields name"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["datatype"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["null"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["creator"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col">{lang["create-at"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {currentTable.map((field, index) => (
                                                                    <tr key={field.id}>
                                                                        <td scope="row">{indexOfFirstTable + index + 1}</td>
                                                                        <td class="align-center"> {primaryKey.includes(field.index) ? <img src="/images/icon/p-key.png" width={14} alt="Key" /> : null}
                                                                            {foreignKeys.some((fk) => fk.index === field.index) && (
                                                                                <img src="/images/icon/f-key.png" width={14} alt="Foreign Key" />
                                                                            )}
                                                                        </td>
                                                                        <td style={{ maxWidth: "100px" }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap"
                                                                            }}>
                                                                                {field.field_name}
                                                                            </div>
                                                                        </td>
                                                                        <td>{field.DATATYPE}</td>
                                                                        <td> {field.NULL ? (
                                                                            <span>Null</span>
                                                                        ) : (
                                                                            <span>Not null</span>
                                                                        )}
                                                                        </td>
                                                                        <td>{users.fullname}</td>
                                                                        <td>{formatDate(field.create_at.toISOString())}</td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>
                                                                            <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => getIdFieldTemp(field)} data-toggle="modal" data-target="#editFieldTemp" title={lang["edit"]}></i>
                                                                            <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => deleteFieldTemp(field)} title={lang["delete"]}></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}

                                                            </tbody>
                                                        </table>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p>{lang["show"]} {indexOfFirstTable + 1}-{Math.min(indexOfLastTable, tempFields?.length)} {lang["of"]} {tempFields?.length} {lang["results"]}</p>
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
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>{lang["not found"]}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {
                                            // tempFields && tempFields.length > 0 ? (
                                            table.table_name && table.table_name !== "" ? (
                                                <div className="button-container mt-4">

                                                    <button type="button" onClick={addTable} class="btn btn-success ">{lang["btn.update"]}</button>
                                                    <button type="button" onClick={() => back()} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                                    </button>

                                                </div>) : null
                                        }
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
                {/*add field */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addField">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["create fields"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalTemp.field_name}
                                                onChange={(e) => setModalTemp({ ...modalTemp, field_name: e.target.value })}
                                                placeholder=""
                                            />
                                            {errors.field_name && <p className="text-danger">{errors.field_name}</p>}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        {/* <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["pkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOn ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickPrimary}
                                            ></i>
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOnforenkey ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickForenkey}
                                            ></i>
                                        </div> */}
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["pkey"]}</label>
                                            <img
                                                src={isOn ? '/images/icon/on.png' : '/images/icon/off.png'}
                                                className='toggle-icon'
                                                alt='toggle'
                                                onClick={handleClickPrimary}
                                                tabindex="0"
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        handleClickPrimary();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <img
                                                src={isOnforenkey ? '/images/icon/on.png' : '/images/icon/off.png'}
                                                className='toggle-icon'
                                                alt='toggle'
                                                onClick={handleClickForenkey}
                                                tabIndex="0"
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        handleClickForenkey();
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={foreignKey.table_id}
                                                onChange={(e) => {
                                                    handleSelectTable(e);
                                                    setForeignKey({ ...foreignKey, table_id: e.target.value })
                                                    if (e.target.value !== "") {
                                                        setErrors({ ...errors, table_id: "" }); // Xóa thông báo lỗi
                                                    }
                                                }}
                                                disabled={!isOnforenkey}>
                                                <option value={""}>{lang["choose"]} </option>
                                                {tables.tables?.map((table, index) => {
                                                    return (
                                                        <option key={index} value={table.id}>
                                                            {table.table_name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {errors.table_id && <p className="text-danger">{errors.table_id}</p>}
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control"
                                                value={foreignKey.ref_field_id}
                                                disabled={!isOnforenkey}
                                                onChange={(e) => {
                                                    // console.log(e.target.value);
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                    if (e.target.value !== "") {
                                                        setErrors({ ...errors, ref_field_id: "" }); // Xóa thông báo lỗi
                                                    }
                                                    autoType(e.target.value) // ? type
                                                }}>

                                                <option value={""}>{lang["choose"]} </option>
                                                {
                                                    fields.filter(field => {
                                                        const selectedTableIdAsNumber = Number(selectedTableId);
                                                        const selectedTable = tables.tables.find(table => table.id === selectedTableIdAsNumber);
                                                        return selectedTable?.primary_key.includes(field.id);
                                                    }).map((field, index) => {
                                                        return (
                                                            <option key={index} value={field.id}>
                                                                {field.field_name}
                                                            </option>
                                                        );
                                                    })
                                                }
                                            </select>
                                            {errors.ref_field_id && <p className="text-danger">{errors.ref_field_id}</p>}

                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["null"]} </label>
                                            <select className="form-control" onChange={(e) => setModalTemp({ ...modalTemp, NULL: e.target.value == "true" ? true : false })}>
                                                {typenull.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.value} >
                                                            {item.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div class={`form-group col-lg-12`}>
                                            <label> {lang["datatype"]}  <span className='red_star'>*</span> </label>
                                            <select
                                                className="form-control"
                                                value={modalTemp.DATATYPE}
                                                onChange={(e) => {
                                                    const selectedDataType = e.target.value;
                                                    const selectedType = types.find((type) => type.name === selectedDataType);
                                                    if (selectedType) {
                                                        setModalTemp(prevModalTemp => {
                                                            const updateValues = {
                                                                DATATYPE: selectedDataType
                                                            };
                                                            // Nếu có giới hạn, gán giá trị min, max tương ứng
                                                            if (selectedType.limit) {
                                                                const { min, max } = selectedType.limit;
                                                                updateValues.MIN = min !== undefined ? String(min) : prevModalTemp.MIN;
                                                                updateValues.MAX = max !== undefined ? String(max) : prevModalTemp.MAX;
                                                            }
                                                            // Nếu là kiểu date, gán định dạng ngày
                                                            if (selectedType.type === 'date' || selectedType.type === 'datetime') {
                                                                updateValues.FORMAT = selectedType.format;
                                                            }
                                                            return {
                                                                ...prevModalTemp,
                                                                ...updateValues
                                                            };
                                                        });
                                                    } else {
                                                        setModalTemp(prevModalTemp => ({
                                                            ...prevModalTemp,
                                                            DATATYPE: selectedDataType,
                                                        }));
                                                    }
                                                }}
                                            >
                                                <option value="">{lang["choose"]} </option>
                                                {types.map((type, index) => (
                                                    <option key={index} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.DATATYPE && <p className="text-danger">{errors.DATATYPE}</p>}
                                        </div>
                                        <div class="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== modalTemp.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let value = modalTemp[prop.name];

                                                            if (inputType === "int") {
                                                                if (prop.name === 'MIN') value = type.limit.min;
                                                                if (prop.name === 'MAX') value = type.limit.max;
                                                            }
                                                            return (
                                                                <div key={index} className="form-group col-lg-12">
                                                                    <label>{prop.label} </label>
                                                                    {isBoolType ? (
                                                                        <select
                                                                            className="form-control"
                                                                            value={value}
                                                                            onChange={(e) => {
                                                                                setModalTemp((prevModalTemp) => ({
                                                                                    ...prevModalTemp,
                                                                                    [prop.name]: e.target.value === "true",
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <option value="true">True</option>
                                                                            <option value="false">False</option>
                                                                        </select>
                                                                    ) : (
                                                                        <input
                                                                            className="form-control"
                                                                            type={inputType === "int" ? "number" : inputType}
                                                                            defaultValue={value}
                                                                            onChange={(e) => {
                                                                                setModalTemp((prevModalTemp) => ({
                                                                                    ...prevModalTemp,
                                                                                    [prop.name]: e.target.value,
                                                                                }));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>



                                        <div class="form-group col-lg-6">
                                            <label>{lang["creator"]}  </label>
                                            <input class="form-control" type="text" value={users.fullname} readOnly />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["time"]} </label>
                                            <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitModal} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddField" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editFieldTemp">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["update fields"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalTemp.field_name}
                                                onChange={(e) => setModalTemp({ ...modalTemp, field_name: e.target.value })}
                                                placeholder=""
                                            />
                                            {errors.field_name && <p className="text-danger">{errors.field_name}</p>}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["pkey"]}</label>
                                            <img
                                                src={isOn ? '/images/icon/on.png' : '/images/icon/off.png'}
                                                className='toggle-icon'
                                                alt='toggle'
                                                onClick={handleClickPrimary}
                                                tabindex="0"
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        handleClickPrimary();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <img
                                                src={isOnforenkey ? '/images/icon/on.png' : '/images/icon/off.png'}
                                                className='toggle-icon'
                                                alt='toggle'
                                                onClick={handleClickForenkey}
                                                tabIndex="0"
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        handleClickForenkey();
                                                    }
                                                }}
                                            />
                                        </div>


                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    handleSelectTable(e);

                                                    setForeignKey({ ...foreignKey, table_id: e.target.value })
                                                    if (e.target.value !== "") {
                                                        setErrors({ ...errors, table_id: "" }); // Xóa thông báo lỗi
                                                    }
                                                }}
                                                disabled={!isOnforenkey}>
                                                <option value="">{lang["choose"]}</option>
                                                {tables.tables?.map((table, index) => {
                                                    const field_id = fieldTempUpdate.index;

                                                    const foreignKey = foreignKeys.find(key => key.index == field_id);
                                                    if (foreignKey && foreignKey.table_id == table.id) {
                                                        <option value={""}>{lang["choose"]}</option>
                                                        return (
                                                            <option selected="selected" key={index} value={table.id}>
                                                                {table.table_name}
                                                            </option>
                                                        );
                                                    } else {
                                                        <option value={""}>{lang["choose"]}</option>
                                                        return (
                                                            <option key={index} value={table.id}>
                                                                {table.table_name}
                                                            </option>
                                                        );
                                                    }
                                                })}
                                            </select>
                                            {errors.table_id && <p className="text-danger">{errors.table_id}</p>}
                                        </div>

                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control"

                                                disabled={!isOnforenkey}
                                                onChange={(e) => {
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                    if (e.target.value !== "") {
                                                        setErrors({ ...errors, ref_field_id: "" })
                                                    }
                                                    autoType(e.target.value) // ? type
                                                }}
                                            > <option>{lang["choose"]}</option>

                                                {fields && fields.length > 0 && (

                                                    fields.filter(field => {
                                                        const selectedTableIdAsNumber = Number(selectedTableId);
                                                        const selectedTable = tables.tables.find(table => table.id === selectedTableIdAsNumber);
                                                        return selectedTable?.primary_key.includes(field.id);
                                                    }).map((field, index) => {
                                                        const field_id = fieldTempUpdate.index;

                                                        const foreignKey = foreignKeys.find(key => key.index == field_id);
                                                        if (foreignKey && foreignKey.ref_field_id == field.id) {
                                                            return (
                                                                <option selected="selected" key={index} value={field.id}>
                                                                    {field.field_name}
                                                                </option>
                                                            );
                                                        } else {
                                                            return (
                                                                <option key={index} value={field.id}>
                                                                    {field.field_name}
                                                                </option>
                                                            );
                                                        }
                                                    })
                                                )}
                                            </select>
                                            {errors.ref_field_id && <p className="text-danger">{errors.ref_field_id}</p>}

                                        </div>


                                        <div class="form-group col-lg-12">
                                            <label>{lang["null"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={modalTemp.NULL} onChange={(e) => setModalTemp({ ...modalTemp, NULL: e.target.value == "true" ? true : false })}>

                                                {typenull.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.value} >
                                                            {item.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div class={`form-group col-lg-12`}>
                                            <label> {lang["datatype"]}<span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={modalTemp.DATATYPE}
                                                onChange={(e) => {
                                                    const selectedDataType = e.target.value;
                                                    const selectedType = types.find((type) => type.name === selectedDataType);
                                                    if (selectedType) {
                                                        setModalTemp(prevModalTemp => {
                                                            const updateValues = {
                                                                DATATYPE: selectedDataType
                                                            };
                                                            // Nếu có giới hạn, gán giá trị min, max tương ứng
                                                            if (selectedType.limit) {
                                                                const { min, max } = selectedType.limit;
                                                                updateValues.MIN = min !== undefined ? String(min) : prevModalTemp.MIN;
                                                                updateValues.MAX = max !== undefined ? String(max) : prevModalTemp.MAX;
                                                            }
                                                            // Nếu là kiểu date, gán định dạng ngày
                                                            if (selectedType.type === 'date' || selectedType.type === 'datetime') {
                                                                updateValues.FORMAT = selectedType.format;
                                                            }
                                                            return {
                                                                ...prevModalTemp,
                                                                ...updateValues
                                                            };
                                                        });
                                                    } else {
                                                        setModalTemp(prevModalTemp => ({
                                                            ...prevModalTemp,
                                                            DATATYPE: selectedDataType,
                                                        }));
                                                    }
                                                }}
                                            >
                                                <option value="">{lang["choose"]} </option>
                                                {types.map((type, index) => (
                                                    <option key={index} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.DATATYPE && <p className="text-danger">{errors.DATATYPE}</p>}
                                        </div>
                                        <div class="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== modalTemp.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let value = modalTemp[prop.name];

                                                            if (inputType === "int") {
                                                                if (prop.name === 'MIN') value = type.limit.min;
                                                                if (prop.name === 'MAX') value = type.limit.max;
                                                            }
                                                            return (
                                                                <div key={index} className="form-group col-lg-12">
                                                                    <label>{prop.label} </label>
                                                                    {isBoolType ? (
                                                                        <select
                                                                            className="form-control"
                                                                            value={value}
                                                                            onChange={(e) => {
                                                                                setModalTemp((prevModalTemp) => ({
                                                                                    ...prevModalTemp,
                                                                                    [prop.name]: e.target.value === "true",
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <option value="true">True</option>
                                                                            <option value="false">False</option>
                                                                        </select>
                                                                    ) : (
                                                                        <input
                                                                            className="form-control"
                                                                            type={inputType === "int" ? "number" : inputType}
                                                                            value={value}
                                                                            onChange={(e) => {
                                                                                setModalTemp((prevModalTemp) => ({
                                                                                    ...prevModalTemp,
                                                                                    [prop.name]: e.target.value,
                                                                                }));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["creator"]} <span className='red_star'>*</span></label>
                                            <input class="form-control" type="text" value={users.fullname} readOnly />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["time"]}<span className='red_star'>*</span></label>
                                            <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly />
                                        </div>

                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleUpdatetModal} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditField" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit table */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editTable">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Chỉnh sửa bảng</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>Tên bảng <span className='red_star'>*</span></label>
                                            <input type="text" class="form-control" value={tableUpdate.table_name} onChange={
                                                (e) => { setUpdateTable({ ...tableUpdate, table_name: e.target.value }) }
                                            } placeholder="" />
                                        </div>


                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={updateTable} class="btn btn-success ">{lang["btn.update"]}</button>
                                {/* <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

