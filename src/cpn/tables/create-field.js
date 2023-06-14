
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';

import Swal from 'sweetalert2';
import { Tables } from ".";


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

export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser)


    const { project_id, version_id } = useParams();
    const [showModal, setShowModal] = useState(false);

    const [fieldTemp, setFieldTemp] = useState({});
    const [modalTemp, setModalTemp] = useState({ DATATYPE: types[0].value });
    const [table, setTable] = useState({});
    const [tables, setTables] = useState({});
    const { tempFields, tempCounter } = useSelector(state => state); // const tempFields = useSelector( state => state.tempFields );

    const dispatch = useDispatch();

    const handleCloseModal = () => {

        setModalTemp({
            field_name: '',
        });
        setShowModal(false);

    };
    const handleSubmitModal = () => {
        setFieldTemp(modalTemp)
        if (isOn) {
            setPrimaryKey([...primaryKey, tempCounter])
        }

        setIsOn(false)

        dispatch({
            branch: "db",
            type: "addField",
            payload: {
                field: {  ...modalTemp, index: tempCounter }
            }
        })
        setModalTemp({
            field_name: '',
          

        });

        console.log(tempFields)
        console.log(primaryKey)
    };

    const goBack = () => {
        window.history.back();
    };


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


    const addTable = (e) => {
        e.preventDefault();
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
                    // console.log(data)
                    const tableId = data.table.id; // Lấy id bảng vừa tạo
                    addField(tableId);
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    };

    const addField = (tableId) => {
        const fieldRequestBody = {            
            table_id: tableId,
            fields: [
                ...tempFields
            ],
        };
         console.log("field", fieldRequestBody)

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
                console.log( data )
                if (success) {
                    const fieldId = data.id;
                    const tableId = data.table_id;
                    // addKey(fieldId, tableId);
                    // handleClickPrimary(fieldId);
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    };

    const addKey = (fieldId, tableId) => {
        const KeyRequestBody = {
            table_id: tableId,
            primary_key: primaryKey,
            foreign_keys: foreignKey

        };
        console.log("KLey", KeyRequestBody)

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
                if (success) {
                    Swal.fire({
                        title: "Thành công!",
                        text: content,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {

                    });
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    };


    //primary
    const [isOn, setIsOn] = useState(false);
    const [primaryKey, setPrimaryKey] = useState([]);

    const handleClickPrimary = () => {
        setIsOn(!isOn);
    };
    //forenkey
    const [isOnforenkey, setIsOnforenkey] = useState(false);
    const [foreignKey, setForeignKeys] = useState([]);

    const tableId = 9; // Giả sử table_id là 9
    const refFieldId = 12; // Giả sử ref_field_id là 12

    const handleClickForenkey = () => {
        //  if (isOnforenkey) {
        //      setForeignKeys([]);
        //  } else {
        //      const newForeignKey = { field_id: fieldId, table_id: tableId, ref_field_id: refFieldId };
        //      setForeignKeys(newForeignKey);
        //  }
        //  setIsOnforenkey(!isOnforenkey);
    };


    const [tableUpdate, setUpdateTable] = useState([]);
    const getIdTable = (tableid) => {
        setUpdateTable(tableid);

    }
    const handleSubmit = (e) => {
        // Gửi temporaryData lên server để thêm dữ liệu vào cơ sở dữ liệu
        e.preventDefault();
        const requestBody = {
            table_id: tableUpdate.id,
            table_name: tableUpdate.table_name,

        };
        console.log(requestBody)
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
                if (success) {
                    Swal.fire({
                        title: "Thành công!",
                        text: content,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        window.location.reload();
                        setShowModal(false);
                    });
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            })
        // Sau khi thành công, có thể xóa bảng tạm thời
        setFieldTemp([]);
    };

    useEffect(() => {
        console.log(tableUpdate);
    }, [tableUpdate]);

    const updateTable = (e) => {
        e.preventDefault();
        const requestBody = {
            table_id: tableUpdate.id,
            table_name: tableUpdate.table_name,

        };
        console.log(requestBody)
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
                if (success) {
                    Swal.fire({
                        title: "Thành công!",
                        text: content,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        window.location.reload();
                        setShowModal(false);
                    });
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            })


    };
    const handleDeleteTask = (tableid) => {
        const requestBody = {
            table_id: parseInt(tableid.id)
        };
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa bảng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'rgb(209, 72, 81)',
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
                        if (status === "0x52404") {
                            Swal.fire({
                                title: "Cảnh báo!",
                                text: content,
                                icon: "warning",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                            return;
                        }
                        if (success) {
                            Swal.fire({
                                title: "Thành công!",
                                text: content,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: "Thất bại!",
                                text: content,
                                icon: "error",
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(function () {
                                // Không cần reload trang
                            });
                        }
                    });
            }
        });
    }
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const rowsPerPageTable = 7;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);

    // console.log("p key", primaryKey)
    // console.log("f key", foreignKey)

    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>Quản lý bảng</h4>
                        </div>
                    </div>
                </div>

                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5>Tạo bảng mới</h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-4">
                                        <label class="font-weight-bold">Tên bảng <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={table.field_name}
                                            onChange={(e) => setTable({ ...table, table_name: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => { console.log(tempCounter) }} data-toggle="modal" data-target="#addField">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">
                                            {
                                                tempFields && tempFields.length > 0 ? (
                                                    <>
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">Khóa</th>
                                                                    <th class="font-weight-bold" scope="col">Tên trường</th>
                                                                    <th class="font-weight-bold" scope="col">Kiểu dữ liệu</th>
                                                                    <th class="font-weight-bold" scope="col">Null</th>
                                                                    <th class="font-weight-bold" scope="col">Người tạo</th>
                                                                    <th class="font-weight-bold align-center" scope="col">Ngày tạo</th>

                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {tempFields.map((field, index) => (
                                                                    <tr key={field.id}>
                                                                        <td scope="row">{index + 1}</td>
                                                                        <td></td>
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
                                                                        <td></td>
                                                                        <td>{users.fullname}</td>

                                                                        <td>{field.create_at.toString()}</td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>
                                                                            <span>{field.index}</span>
                                                                            {/* <i class="fa fa-edit size pointer icon-margin icon-edit"   onClick={() => getIdTable(field)} data-toggle="modal" data-target="#editTable" title={lang["edit"]}></i>
                                                                    
                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteTask(field)} title={lang["delete"]}></i> */}
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                    </>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>Chưa có trường</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {
                                            tempFields && tempFields.length > 0 ? (
                                                <div className="button-container mt-4">

                                                    <button type="button" onClick={addTable} class="btn btn-success ">{lang["btn.update"]}</button>
                                                    <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                                                </div>) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add table */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addField">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Tạo mới trường</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="form-group col-lg-12">
                                            <label>Tên trường <span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalTemp.field_name}
                                                onChange={(e) => setModalTemp({ ...modalTemp, field_name: e.target.value })}
                                                placeholder=""
                                            />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Trạng thái khóa <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>

                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">Khóa chính </label>
                                            <i
                                                className={`fa fa-toggle-${isOn ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickPrimary}
                                            ></i>
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">Khóa ngoại </label>
                                            <i
                                                className={`fa fa-toggle-${isOnforenkey ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickForenkey}
                                            ></i>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Tên bảng <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={fieldTemp.type}>
                                                {tables.tables?.map((table, index) => {
                                                    return (
                                                        <option key={index} value={table.table_name} >
                                                            {table.table_name}
                                                        </option>
                                                    );
                                                })}
                                            </select>

                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Tên trường <span className='red_star'>*</span></label>
                                            <select className="form-control" >
                                                <option value={1}>Option</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Yêu cầu dữ liệu <span className='red_star'>*</span></label>
                                            <select className="form-control" >
                                                <option value={1}>Null</option>
                                                <option value={2}>Not Null</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Kiểu dữ liệu <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={modalTemp.DATATYPE}
                                                onChange={(e) => setModalTemp({ ...modalTemp, DATATYPE: e.target.value })}>
                                                {types.map((type, index) => {
                                                    return (
                                                        <option key={index} value={type.value} >
                                                            {type.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Người tạo <span className='red_star'>*</span></label>
                                            <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Thời gian <span className='red_star'>*</span></label>
                                            <input class="form-control" type="text" value={"2023-06-12"} readOnly />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitModal} data-dismiss="modal" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
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

