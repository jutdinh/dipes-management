
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { ready } from "jquery";

import ReactSelect from "react-select";

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

    const { tempFieldParam } = useSelector(state => state);

    const dispatch = useDispatch();

    const { project_id, version_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    let navigate = useNavigate();
    const [apiMethod, setApiMethod] = useState(1); // Default is GET
    const [fieldsShow, setFieldShow] = useState({ id: null, display_name: null, formular: null });
    const defaultValues = {
        api_name: '',
        api_method: "get",
        tables: [],
        params: [],
        fields: [],
        body: [],
        api_scope: ["public"]
    };

    const [modalTemp, setModalTemp] = useState(defaultValues);/////tạo api

    const handleSubmitModal = () => {
        setModalTemp(prevModalTemp => ({ ...prevModalTemp, api_method: apiMethod }));


        dispatch({
            branch: "api",
            type: "addFieldParam",
            payload: {
                field: { ...modalTemp }

            }
        })
    }

    const [getAllField, setAllField] = useState([]);
    useEffect(() => {
        fetch(`${proxy}/db/tables/table/27/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {
                        setAllField(data)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    console.log(getAllField)
    const [allTable, setAllTable] = useState([]);
    const [possibleTables, setPossibleTables] = useState([]);
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
                        setAllTable(data.tables);
                        setPossibleTables(data.tables);
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    const [selectedTables, setSelectedTables] = useState([]);
    // lưu id bảng được chọn
    useEffect(() => {
        // get IDs from selected tables and set them into modalTemp.tables
        setModalTemp(prev => ({
            ...prev,
            tables: selectedTables.map(table => table.id),
        }));

    }, [selectedTables]);
    const handleChange = (e) => {
        const selectedTableName = e.target.value;
        const selectedTableData = allTable.find(
            (table) => table.table_name === selectedTableName
        );

        setSelectedTables((prevSelectedTables) => [
            ...prevSelectedTables,
            selectedTableData,
        ]);

        // Filter tables that are linked to the selected table
        const linkedTables = allTable.filter(
            (table) =>
                (selectedTableData.foreign_keys.some(
                    (fk) => fk.table_id === table.id || fk.ref_table_id === table.id
                ) ||
                    table.foreign_keys.some(
                        (fk) => fk.table_id === selectedTableData.id || fk.ref_table_id === selectedTableData.id
                    )) &&
                !selectedTables.some((selectedTable) => selectedTable.id === table.id)
        );

        setPossibleTables(linkedTables);
    };

    console.log(allTable)
    //xóa bảng đã chọn 
    const handleDeleteAll = () => {
        setSelectedTables([]);
        setPossibleTables(allTable)
        setModalTemp(prevState => ({
            ...prevState,
            params: []
        }));
    }
    //  hiển thị các tường của bảngđược chọn
    const [allFields, setAllFields] = useState([]);

    useEffect(() => {
        selectedTables.forEach((table) => {
            fetch(`${proxy}/db/tables/table/${table.id}/fields`, {
                headers: {
                    Authorization: _token
                }
            })
                .then(res => res.json())
                .then(resp => {
                    const { success, data, status, content } = resp;

                    if (success) {
                        if (data) {
                            setAllFields(prevFields => ({
                                ...prevFields,
                                [table.id]: data
                            }));
                        }
                    } else {
                        // handle error
                    }
                });
        });
    }, [selectedTables]);
    console.log(allFields)
    const handleFieldSelection = (event) => {
        const selectedFieldId = parseInt(event.target.value);

        setModalTemp(prevState => {
            // Kiểm tra xem selectedFieldId đã tồn tại trong mảng params hay chưa
            const isFieldExist = prevState.params.includes(selectedFieldId);

            // Nếu selectedFieldId đã tồn tại, không cần thay đổi mảng params
            if (isFieldExist) {
                return prevState;
            }

            // Ngược lại, cập nhật mảng params trong modalTemp với ID đã chọn
            return {
                ...prevState,
                params: [...prevState.params, selectedFieldId]
            };
        });
    };



    console.log(modalTemp)
    // const [currentPageTable, setCurrentPageTable] = useState(1);
    // const rowsPerPageTable = 7;

    // const indexOfLastTable = currentPageTable * rowsPerPageTable;
    // const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    // const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    // const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    // const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);

    // console.log("p key", primaryKey)
    // console.log("f key", foreignKey)
    const fieldShow = (project) => {
        window.location.href = `/projects/${version_id}/apis/create/fieldshow`;
        // window.location.href = `tables`;
    };
    const fieldStatistical = (project) => {
        window.location.href = `/projects/${version_id}/apis/create/fieldstatis`;
        // window.location.href = `tables`;
    };


    console.log(modalTemp.params)
    console.log(tempFieldParam)
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>Quản lý API</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5>Tạo mới apis </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Tên api <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => setModalTemp({ ...modalTemp, api_name: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>
                                    <div class="form-group col-lg-7"></div>
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Phương thức <span className='red_star'>*</span></label>
                                        <div class="checkbox-group">
                                            <div class="checkbox-item">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_method === "get"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_method: "get" })}
                                                />
                                                <label class="ml-1">GET</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_method === "post"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_method: "post" })}
                                                />
                                                <label class="ml-1">POST</label>
                                            </div>
                                            <div class="checkbox-item round">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_method === "put"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_method: "put" })}
                                                />
                                                <label class="ml-1">PUT</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_method === "delete"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_method: "delete" })}
                                                />
                                                <label class="ml-1">DELETE</label>
                                            </div>
                                        </div>

                                    </div>


                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường đối số </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldParam">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                <>
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                <th class="font-weight-bold" scope="col">Tên trường</th>
                                                                <th class="font-weight-bold" scope="col">Tên bảng</th>
                                                                <th class="font-weight-bold" scope="col">Người tạo</th>
                                                                <th class="font-weight-bold align-center" scope="col">Ngày tạo</th>
                                                                <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {modalTemp.tables.map((tableId, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>

                                                                    <td>{modalTemp.params[index]}</td>
                                                                    <td>{tableId}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>

                                                </>

                                            }
                                        </div>


                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường hiển thị </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => fieldShow()}>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">

                                        </div>


                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường thống kê</p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => fieldStatistical()}>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">

                                        </div>
                                        <div className="button-container mt-4">

                                            <button type="button" onClick={handleSubmitModal} class="btn btn-success ">{lang["btn.update"]}</button>
                                            <button type="button" onClick={() => navigate(-1)} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field param */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldParam">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường đối số</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control" onChange={handleChange}>
                                            <option value="">Chọn</option>
                                            {possibleTables.map(table => (
                                                <option key={table.id} value={table.table_name}>
                                                    {table.table_name}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedTables.length > 0 && (
                                            <div className={`form-group col-lg-12 mt-2`}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <label >Danh sách các bảng đã chọn: <span className='red_star'>*</span></label>
                                                    <button class="btn btn-danger mb-2" onClick={handleDeleteAll}>Xóa tất cả</button>
                                                </div>
                                                <div className="outerBox">
                                                    {selectedTables.map(table => (
                                                        <div key={table.id} className="innerBox">
                                                            {table.table_name}
                                                        </div>
                                                    ))}


                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {selectedTables.map((table, index) => (

                                        <div key={index} className={`form-group col-lg-6`}>
                                            <label>{table.table_name} <span className='red_star'>*</span></label>
                                            <select className="form-control" onChange={handleFieldSelection}>
                                                <option value="">Chọn</option>
                                                {allFields[table.id]?.map((field) => (
                                                    <option key={field.id} value={field.id}>
                                                        {field.field_name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    ))}


                                    {/* <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        hiển thị các trường đã đã được chọn
                                    </div> */}
                                    <div class="form-group col-md-12">
                                        <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" onClick={handleSubmitModal}>{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field show */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldShow">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường hiển thị</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field statistical */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldStatistical">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường thống kê</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div >
        </div >
    )
}
