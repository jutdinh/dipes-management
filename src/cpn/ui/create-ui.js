
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { error, ready } from "jquery";




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
        calculates: [],
        statistic: [],
        api_scope: "public",
        status: true
    };

    const [modalTemp, setModalTemp] = useState(defaultValues);/////tạo api



    const [errorApi, setErrorApi] = useState({});
    const validateApiname = () => {
        let temp = {};

        temp.api_name = modalTemp.api_name ? "" : "Trường này không được để trống.";
        temp.tables = tables && tables.length > 0 ? "" : "Bảng không được để trống.";


        setErrorApi({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const handleSubmitModal = () => {
        if (validateApiname()) {
            setModalTemp(prevModalTemp => ({ ...prevModalTemp, api_method: apiMethod }));


            dispatch({
                branch: "api",
                type: "addFieldParam",
                payload: {
                    field: { ...modalTemp }

                }
            })
        }


    }
    useEffect(() => {
        // Kiểm tra điều kiện dữ liệu sẵn sàng
        if (tempFieldParam && Object.keys(tempFieldParam).length > 0) {
            addUI();
        }
    }, [tempFieldParam]); // Theo dõi sự thay đổi của tempFieldParam
    const addUI = () => {
        const requestBody = {
            version_id: parseInt(version_id),
            ui: {
                title: "",
                status: ""
            },
            widget:{
                table_id: "",
                layout_id: "",
                statistic: [
                    {"display_name": "Thống kê nè", "fomular": "SUM", "field": "FILE1"}
                ]
            },

            api: {
                ...tempFieldParam
            }
        }
        // console.log(requestBody)
        fetch(`${proxy}/apis/api`, {
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
    };
    const handleSubmitTables = () => {
        // Tạo một mảng mới bao gồm tất cả fieldId đã chọn từ tất cả bảng
        const allSelectedFields = Object.values(selectedFields).flat();

        // Cập nhật modalTemp
        setModalTemp(prev => ({
            ...prev,
            tables: selectedTables.map(table => table.id),
        }));
    };
    const handleSubmitParam = () => {
        // Tạo một mảng mới bao gồm tất cả fieldId đã chọn từ tất cả bảng
        const allSelectedFields = Object.values(selectedFields).flat();

        // Cập nhật modalTemp
        setModalTemp(prevModalTemp => ({
            ...prevModalTemp,
            params: allSelectedFields,
        }));
    };
    const handleSubmitShow = () => {
        // Tạo một mảng mới bao gồm tất cả fieldId đã chọn từ tất cả bảng
        const allSelectedFields2 = Object.values(selectedFieldsModal2).flat();

        // Cập nhật modalTemp
        setModalTemp(prevModalTemp => ({
            ...prevModalTemp,
            fields: allSelectedFields2,
        }));
    };
    const handleSubmitBody = () => {
        // Tạo một mảng mới bao gồm tất cả fieldId đã chọn từ tất cả bảng
        const allSelectedFieldBody = Object.values(selectedFieldsBody).flat();

        // Cập nhật modalTemp
        setModalTemp(prevModalTemp => ({
            ...prevModalTemp,
            body: allSelectedFieldBody,
        }));
    };
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

    // console.log(getAllField)
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
    console.log(selectedTables)

    // lưu id bảng được chọn
    // useEffect(() => {
    //     // get IDs from selected tables and set them into modalTemp.tables
    //     setModalTemp(prev => ({
    //         ...prev,
    //         tables: selectedTables.map(table => table.id),
    //     }));

    // }, [selectedTables]);
    // console.log("Table Selected", selectedTables)
    // const handleChange = (e) => {
    //     const selectedTableName = e.target.value;
    //     const selectedTableData = allTable.find(
    //         (table) => table.table_name === selectedTableName
    //     );

    //     setSelectedTables((prevSelectedTables) => [
    //         ...prevSelectedTables,
    //         selectedTableData,
    //     ]);

    //     // Filter tables that are linked to the selected table
    //     const linkedTables = allTable.filter(
    //         (table) =>
    //             (selectedTableData.foreign_keys.some(
    //                 (fk) => fk.table_id === table.id || fk.ref_table_id === table.id
    //             ) ||
    //                 table.foreign_keys.some(
    //                     (fk) => fk.table_id === selectedTableData.id || fk.ref_table_id === selectedTableData.id
    //                 )) &&
    //             !selectedTables.some((selectedTable) => selectedTable.id === table.id)
    //     );

    //     setPossibleTables(linkedTables);
    // };
    // selectedTables.forEach(table => {
    //     console.log(`Khóa chính của bảng ${table.table_name}: ${table.primary_key}`);

    //     table.foreign_keys.forEach((fk, index) => {
    //         console.log(`Khóa ngoại ${index+1} của bảng ${table.table_name}: ${fk}`);
    //     });
    // });
    const handleChange = (e) => {
        const selectedTableName = e.target.value;
        const selectedTableData = allTable.find(
            (table) => table.table_name === selectedTableName
        );

        setSelectedTables((prevSelectedTables) => [
            ...prevSelectedTables,
            selectedTableData,
        ]);

        // After updating selectedTables, we need to find the linked tables
        const updatedSelectedTables = [...selectedTables, selectedTableData];
        const linkedTables = allTable.filter(
            (table) => !updatedSelectedTables.some((selectedTable) => selectedTable.id === table.id) &&
                updatedSelectedTables.some(
                    (selectedTable) => (selectedTable.foreign_keys.some(
                        (fk) => fk.table_id === table.id || fk.ref_table_id === table.id
                    ) || selectedTable.primary_key === table.id ||
                        table.foreign_keys.some(
                            (fk) => fk.table_id === selectedTable.id || fk.ref_table_id === selectedTable.id
                        ) || table.primary_key === selectedTable.id)
                )
        );

        setPossibleTables(linkedTables);
    };

    // console.log("All table", allTable)
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
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const fetchTable = (tableId) => {
            return fetch(`${proxy}/db/tables/table/${tableId}`, {
                headers: {
                    Authorization: _token
                }
            }).then(res => res.json());
        }

        Promise.all(modalTemp.tables.map(fetchTable))
            .then(responses => {
                const tableNames = responses.map(resp => resp.success ? resp.data : 'unknown');
                setTables(tableNames);
            });

    }, [modalTemp.tables]);

    // console.log(tables)

    const [tableFields, setTableFields] = useState([]);
    console.log(tableFields)
    useEffect(() => {
        const fetchFields = async (tableId) => {
            const res = await fetch(`${proxy}/db/tables/table/${tableId}`, {
                headers: {
                    Authorization: _token
                }
            });
            const resp = await res.json();

            if (resp.success) {
                return resp.data; // Trả về toàn bộ đối tượng data
            } else {
                console.error('Error fetching fields:', resp.content);
                return null; // Trả về null nếu có lỗi
            }
        }

        const fetchAllFields = async () => {
            const fieldsByTable = {};
            for (const tableId of modalTemp.tables) {
                const fields = await fetchFields(tableId);
                fieldsByTable[tableId] = fields;
            }
            setTableFields(fieldsByTable);
        }

        fetchAllFields();

    }, [modalTemp.tables]);

    // luu truong body 
    const [selectedFieldsBody, setSelectedFieldsBody] = useState({});
    const handleCheckboxChangeBody = (tableId, fieldId, isChecked) => {
        // Sao chép state hiện tại
        const updatedSelections = { ...selectedFieldsBody };

        // Nếu không có mảng cho tableId này, tạo mới
        if (!updatedSelections[tableId]) {
            updatedSelections[tableId] = [];
        }

        if (isChecked) {
            // Nếu checkbox được chọn, thêm fieldId vào mảng
            updatedSelections[tableId].push(fieldId);
        } else {
            // Nếu checkbox không được chọn, loại bỏ fieldId khỏi mảng
            updatedSelections[tableId] = updatedSelections[tableId].filter(id => id !== fieldId);
        }

        setSelectedFieldsBody(updatedSelections);

    };

    // luu truong show 
    const [selectedFieldsModal2, setSelectedFieldsModal2] = useState({});
    console.log("FieldShow", selectedFieldsModal2)
    /////luu truong param
    const [selectedFields, setSelectedFields] = useState({});
    console.log("FieldParams", selectedFields)

    const handleCheckboxChange = (tableId, fieldId, isChecked) => {
        // Sao chép state hiện tại
        const updatedSelections = { ...selectedFields };
        // Nếu không có mảng cho tableId này, tạo mới
        if (!updatedSelections[tableId]) {
            updatedSelections[tableId] = [];
        }
        if (isChecked) {
            // Nếu checkbox được chọn, thêm fieldId vào mảng
            updatedSelections[tableId].push(fieldId);
        } else {
            // Nếu checkbox không được chọn, loại bỏ fieldId khỏi mảng
            updatedSelections[tableId] = updatedSelections[tableId].filter(id => id !== fieldId);
        }
        setSelectedFields(updatedSelections);
    };
    console.log("trường hiển thị:", selectedFieldsModal2)
    const getFieldDetails = (tableId, fieldId) => {
        const tableInfo = tableFields[tableId];
        const fieldInfo = tableInfo?.fields.find(field => field.id === fieldId);
        const fieldName = fieldInfo?.field_name;
        const tableName = tableInfo?.table_name;
        return { fieldName, tableName };
    };

    //console.log(selectedFields)
    //delete selected table 

    const [display_name, setDisplayname] = useState("");
    const [fomular, setFomular] = useState("");

    const [calculates, setCalculates] = useState([]);
    console.log("calustasud", calculates)
    const [aliasCalculates, setaliasCalculates] = useState([]);

    const generateUniqueFormularAlias = async (display_name) => {

        const requestBody = { field_name: display_name };
        const response = await fetch(`${proxy}/apis/make/alias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody),
        });

        const resp = await response.json();
        if (resp.success) {
            setaliasCalculates(resp.alias);
            return resp.alias;
        } else {
            // Handle error here
            return null;
        }
    };

    const [errorCaculates, setErrorCaculates] = useState({});
    const validateCaculates = () => {
        let temp = {};

        temp.display_name = display_name ? "" : "Trường này không được để trống.";
        temp.fomular = fomular ? "" : "Trường này không được để trống.";


        setErrorCaculates({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const handleSubmitFieldCalculates = async (event) => {
        event.preventDefault();
        if (validateCaculates()) {
            const fomular_alias = await generateUniqueFormularAlias(display_name);
            const newCalculate = { display_name, fomular_alias, fomular };


            // Cập nhật modalTemp
            setModalTemp(prev => ({
                ...prev,
                calculates: [...prev.calculates, newCalculate]
            }));
            setCalculates([...calculates, newCalculate])
            setDisplayname("");
            setFomular("");
        }

    };

    const [errorStatistical, setErrorStatistical] = useState({});
    const validateStatistical = () => {
        let temp = {};

        temp.display_name = display_name ? "" : "Trường này không được để trống.";
        temp.fomular = fomular ? "" : "Trường này không được để trống.";
        temp.field = field ? "" : "Trường này không được bỏ trống.";

        setErrorStatistical({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const [field, setField] = useState("");

    const [statistical, setStatistical] = useState([]);

    const handleSubmitFieldStatistical = async (event) => {

        event.preventDefault();
        if (validateStatistical()) {
            const fomular_alias = await generateUniqueFormularAlias(display_name);

            const newStatistical = { fomular_alias, display_name, field, fomular };


            // Cập nhật modalTemp
            setModalTemp(prev => ({
                ...prev,
                statistic: [...prev.statistic, newStatistical]
            }));
            setStatistical([...statistical, newStatistical])
            setDisplayname("");
            setField("");
            setFomular("");
        }

    };
    console.log(modalTemp)

    const fieldShow = (project) => {
        window.location.href = `/projects/${version_id}/apis/create/fieldshow`;
        // window.location.href = `tables`;
    };
    const fieldStatistical = (project) => {
        window.location.href = `/projects/${version_id}/apis/create/fieldstatis`;
        // window.location.href = `tables`;
    };

    const findTableAndFieldInfo = (fieldId) => {
        for (const [tableId, tableInfo] of Object.entries(tableFields)) {
            const fieldInfo = tableInfo.fields.find((field) => field.id === fieldId);

            if (fieldInfo) {
                return { tableId, fieldInfo };
            }
        }

        return { tableId: null, fieldInfo: null };
    };

    // console.log(modalTemp)
    // console.log(tempFieldParam)
    console.log(calculates)
    console.log(selectedFieldsModal2)
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>Quản lý giao diện</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5><a onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-3"></i></a>Tạo mới giao diện</h5>

                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Tiêu đề <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={modalTemp.api_name}
                                            onChange={(e) => setModalTemp({ ...modalTemp, api_name: e.target.value })}
                                            placeholder=""
                                        />
                                        {errorApi.api_name && <p className="text-danger">{errorApi.api_name}</p>}
                                    </div>
                                    <div class="form-group col-lg-7"></div>
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Layout <span className='red_star'>*</span></label>
                                        <select
                                            className="form-control mb-3"
                                            value={modalTemp.api_name}
                                            onChange={(e) => setModalTemp({ ...modalTemp, api_name: e.target.value })}
                                        >

                                            <option>Layout 1</option>
                                            <option>Layout 2</option>
                                        </select>


                                    </div>

                                    {/* Chọn các bảng */}
                                    <div class="col-md-12 col-lg-12 bordered mb-3">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các bảng <span className='red_star'> *</span> </p>
                                            {errorApi.tables && <p className="text-danger">{(errorApi.tables)}</p>}
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTables">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            {
                                                tables && tables.length > 0 ? (
                                                    <>
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold" scope="col">Tên bảng</th>
                                                                    <th class="font-weight-bold" scope="col">Người tạo</th>
                                                                    <th class="font-weight-bold" scope="col">Thời gian</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tables.map((table, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{table.table_name}</td>
                                                                        <td>{table.create_by.fullname}</td>
                                                                        <td>{table.create_at}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>Chưa có dữ liệu bảng</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>


                                    {
                                        modalTemp.tables && modalTemp.tables.length > 0 ? (
                                            <>
                                                {/* Chọn trường tính toán */}

                                                <div class="col-md-12 col-lg-12 bordered ">
                                                    <div class="d-flex align-items-center mb-1">
                                                        <p class="font-weight-bold">Danh sách các trường tính toán </p>
                                                        <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldCalculates">
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div class="table-responsive">
                                                        {calculates && calculates.length > 0 ? (
                                                            <table class="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="font-weight-bold">STT</th>
                                                                        <th class="font-weight-bold">Tên trường tính toán</th>
                                                                        <th class="font-weight-bold">Bí danh</th>
                                                                        <th class="font-weight-bold">Phép tính</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {calculates.map((calculates, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{calculates.display_name}</td>
                                                                            <td>{calculates.fomular_alias}</td>
                                                                            <td>{calculates.fomular}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div class="list_cont ">
                                                                <p>Chưa có dữ liệu trường tính toán</p>
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            null
                                        )
                                    }
                                    <div className="mt-2 d-flex justify-content-end ml-auto">
                                        <button type="button" onClick={handleSubmitModal} class="btn btn-success mr-2">{lang["btn.create"]}</button>
                                        <button type="button" onClick={() => navigate(-1)} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                        </button>
                                    </div>
                                    {/* </>
                                        ) : (
                                            null
                                        )
                                    } */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add table */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addTables">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Chọn bảng</h4>
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
                                    <div class="form-group col-md-12">
                                        <label>Người tạo</label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Ngày tạo</label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" data-dismiss="modal" onClick={handleSubmitTables}> {lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>


                {/*add Field calculates */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldCalculates">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường tính toán</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={display_name}
                                            onChange={(e) => setDisplayname(e.target.value)}
                                            required
                                        />
                                        {errorCaculates.display_name && <p className="text-danger">{errorCaculates.display_name}</p>}
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Danh sách trường hiển thị</label>
                                        <div class="table-responsive">
                                            {
                                                modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold">STT</th>
                                                                <th class="font-weight-bold">Tên trường hiển thị</th>
                                                                <th class="font-weight-bold">Bí danh</th>
                                                                <td class="font-weight-bold">Tên bảng</td>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {modalTemp.fields.map((field, index) => {
                                                                const { tableId, fieldInfo } = findTableAndFieldInfo(field.id);
                                                                if (!tableId || !fieldInfo) {
                                                                    return null; // Xử lý trường hợp không tìm thấy thông tin bảng hoặc trường
                                                                }
                                                                const tableInfo = tableFields[tableId];
                                                                if (!tableInfo) {
                                                                    return null; // Xử lý trường hợp không tìm thấy thông tin bảng
                                                                }
                                                                return (
                                                                    <tr key={`${tableId}-${field.id}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{fieldInfo.field_name}</td>
                                                                        <td>{fieldInfo.fomular_alias}</td>
                                                                        <td>{tableInfo.table_name}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>Chưa có dữ liệu trường hiển thị</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Công thức <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={fomular}
                                            onChange={(e) => setFomular(e.target.value)}
                                            required
                                        />
                                        {errorCaculates.fomular && <p className="text-danger">{errorCaculates.fomular}</p>}
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Người tạo </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>Ngày tạo </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" data-dismiss="modal" onClick={handleSubmitFieldCalculates} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </div >
    )
}

