
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { error, ready } from "jquery";
import responseMessages from "../enum/response-code";
import $ from "jquery"


export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
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
    // const showApiResponseMessage = (status) => {
    //     const langItem = (localStorage.getItem("lang") || "Vi").toLowerCase(); // fallback to English if no language is set
    //     const message = responseMessages[status];

    //     const title = message?.[langItem]?.type || "Unknown error";
    //     const description = message?.[langItem]?.description || "Unknown error";
    //     const icon = (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") ? "success" : "error";

    //     Swal.fire({
    //         title,
    //         text: description,
    //         icon,
    //         showConfirmButton: false,
    //         timer: 1500,
    //     }).then(() => {
    //         if (icon === "success") {
    //             window.location.reload();

    //         }
    //     });
    // };


    const [errorApi, setErrorApi] = useState({});
    const validateApiname = () => {
        let temp = {};
        temp.api_name = modalTemp.api_name ? "" : lang["error.input"];
        temp.tables = tables && tables.length > 0 ? "" : lang["table empty"];
        setErrorApi({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }


    const validateApiParams = () => {
        let temp = {};
        temp.params = modalTemp.params && modalTemp.params.length > 0 ? "" : lang["params empty"];
        setErrorApi({
            ...temp
        });
        return Object.values(temp).every(x => x === "");
    }

    const validateApiBody = () => {
        let temp = {};
        temp.body = modalTemp.body && modalTemp.body.length > 0 ? "" : lang["body empty"];
        setErrorApi({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const validateApiFieldShow = () => {
        let temp = {};
        temp.fields = modalTemp.fields && modalTemp.fields.length > 0 ? "" : lang["show empty"];

        setErrorApi({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const handleSubmitModal = () => {
        const validator = {
            "get": [validateApiname, validateApiFieldShow],
            "post": [validateApiname, validateApiBody],
            "put": [validateApiname, validateApiParams, validateApiBody],
            "delete": [validateApiParams]
        }

        const validateFunctions = validator[modalTemp.api_method]
        let valid = true;

        for (let i = 0; i < validateFunctions.length; i++) {
            const checkResult = validateFunctions[i]()
            if (!checkResult) {
                valid = false

                break;
            }
        }

        // console.log("VALID: ", valid)

        if (valid) {
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
            // console.log("adddsa")
            addApi();
        }
    }, [tempFieldParam]); // Theo dõi sự thay đổi của tempFieldParam

    const addApi = () => {
        const requestBody = {
            version_id: parseInt(version_id),
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
                // console.log(resp)
                if (success) {
                    functions.showApiResponseMessage(status);
                } else {
                   functions.showApiResponseMessage(status);
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
    // console.log(selectedTables)

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
    // console.log(tableFields)
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
    // console.log("FieldShow", selectedFieldsModal2)
    /////luu truong param
    const [selectedFields, setSelectedFields] = useState({});
    // console.log("FieldParams", selectedFields)

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
    // console.log("trường hiển thị:", selectedFieldsModal2)
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
    // console.log("calustasud", calculates)
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

        temp.display_name = display_name ? "" : lang["error.input"];
        temp.fomular = fomular ? "" : lang["error.input"];


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
            Swal.fire({
                title: lang["success.title"],
                text: lang["success.add"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $("#closeAddCalculates").click()
        }

    };
    //Cập nhật trường tính toán
    const [calculatesUpdate, setCalculatesUpdate] = useState({
        display_name: "",
        fomular: "",
        fomular_alias: ""
    });
    const updateFieldCalculates = (cal) => {
        setCalculatesUpdate(cal)

    }
    const validateCaculatesUpdate = () => {
        let temp = {};

        temp.display_name = calculatesUpdate.display_name ? "" : lang["error.input"];
        temp.fomular = calculatesUpdate.fomular ? "" : lang["error.input"];
        setErrorCaculates({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const submitupdateFieldCalculates = () => {
        if (validateCaculatesUpdate()) {
            const updatedCalculates = modalTemp.calculates.map(item =>
                item.fomular_alias === calculatesUpdate.fomular_alias ? calculatesUpdate : item
            );
            setCalculates(updatedCalculates);
            setModalTemp(prev => ({
                ...prev,
                calculates: updatedCalculates
            }));
            Swal.fire({
                title: lang["success.title"],
                text: lang["success.update"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $("#closeEditCalculates").click()
        }
    };

    // Khi calculatesUpdate thay đổi, cập nhật mảng calculates
    // useEffect(() => {
    //     if (calculatesUpdate.fomular_alias) {
    //         submitupdateFieldCalculates();
    //     }
    // }, [calculatesUpdate]);
    // console.log(calculates)
    // console.log(modalTemp.calculates)

    const handleDeleteCalculates = (cal) => {
        // console.log(cal)
        // const newCalculates = calculates.filter(item => item.fomular_alias !== cal.fomular_alias);
        // setModalTemp(prev => ({
        //     ...prev,
        //     calculates: newCalculates
        // }));
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
        }).then((result) => {
            if (result.isConfirmed) {
                const newCalculates = modalTemp.calculates.filter(item => item.fomular_alias !== cal.fomular_alias);
                setModalTemp(prev => ({
                    ...prev,
                    calculates: newCalculates
                }));
                Swal.fire({
                    title: lang["success.title"],
                    text: lang["delete.success.field"],
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        });
    }
    ///Cập nhât trường  thống kê
    const [statisticalUpdate, setStatisticalUpdate] = useState({
        display_name: "",
        field: "",
        fomular: "",
        fomular_alias: ""
    });
    const updateFieldStatistical = (sta) => {
        // console.log(sta)
        setStatisticalUpdate(sta)
    }
    const validateStatisticalUpdate = () => {
        let temp = {};

        temp.display_name = statisticalUpdate.display_name ? "" : lang["error.input"];
        temp.fomular = statisticalUpdate.fomular ? "" : lang["error.input"];
        temp.field = statisticalUpdate.field ? "" : lang["error.input"];

        setErrorStatistical({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const submitupdateFieldStatistical = () => {
        if (validateStatisticalUpdate()) {
            const updatedStatistical = modalTemp.statistic.map(item =>
                item.fomular_alias === statisticalUpdate.fomular_alias ? statisticalUpdate : item
            );
            setModalTemp(prev => ({
                ...prev,
                statistic: updatedStatistical
            }));
            Swal.fire({
                title: lang["success.title"],
                text: lang["success.update"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $("#closeEditStatis").click()
        }
    };

    // Khi calculatesUpdate thay đổi, cập nhật mảng calculates
    // useEffect(() => {
    //     if (statisticalUpdate.fomular_alias) {
    //         submitupdateFieldStatistical();
    //     }
    // }, [statisticalUpdate]);



    const handleDeleteStatistical = (sta) => {
        // console.log(sta)
        // const newCalculates = calculates.filter(item => item.fomular_alias !== cal.fomular_alias);
        // setModalTemp(prev => ({
        //     ...prev,
        //     calculates: newCalculates
        // }));
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
        }).then((result) => {
            if (result.isConfirmed) {
                const newCalculates = modalTemp.statistic.filter(item => item.fomular_alias !== sta.fomular_alias);
                setModalTemp(prev => ({
                    ...prev,
                    statistic: newCalculates
                }));

                Swal.fire({
                    title: lang["success.title"],
                    text: lang["delete.success.field"],
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        });
    }

    const [errorStatistical, setErrorStatistical] = useState({});
    const validateStatistical = () => {
        let temp = {};

        temp.display_name = display_name ? "" : lang["error.input"];
        temp.fomular = fomular ? "" : lang["error.input"];
        temp.field = field ? "" : lang["error.input"];

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
            Swal.fire({
                title: lang["success.title"],
                text: lang["success.add"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $("#closeAddStatis").click()
        }

    };
    // console.log(modalTemp)

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
    const handleCloseModal = () => {
        setErrorStatistical({});
        setDisplayname("");
        setField("");
        setFomular("");
        // console.log(errorStatistical)
        setErrorCaculates({})
        // console.log(errorCaculates)
    };
    // console.log(modalTemp)
    // console.log(tempFieldParam)
    // console.log(calculates)
    // console.log(tableFields)


    // console.log(modalTemp.fields)

    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["manage api"]}</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["create api"]}
                                    </label> </h5>

                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="font-weight-bold">{lang["api name"]} <span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalTemp.api_name}
                                                onChange={(e) => setModalTemp({ ...modalTemp, api_name: e.target.value })}
                                                placeholder=""
                                            />
                                            {errorApi.api_name && <p className="text-danger">{errorApi.api_name}</p>}
                                        </div>
                                        <div class="form-group">
                                            <label class="font-weight-bold">{lang["projectstatus"]} <span className='red_star'>*</span></label>
                                            <div class="checkbox-group">
                                                <div class="checkbox-item">
                                                    <label >
                                                        <input
                                                            class="mr-1"
                                                            type="radio"
                                                            checked={modalTemp.status === true}
                                                            onChange={() => setModalTemp({ ...modalTemp, status: true })}
                                                        />
                                                        On
                                                    </label>
                                                </div>
                                                <div class="checkbox-item">
                                                    <label> <input
                                                        class="mr-1"
                                                        type="radio"
                                                        checked={modalTemp.status === false}
                                                        onChange={() => setModalTemp({ ...modalTemp, status: false })}
                                                    />
                                                        Off
                                                    </label>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="form-group">
                                            <label class="font-weight-bold">{lang["method"]} <span className='red_star'>*</span></label>
                                            <div class="checkbox-group">
                                                <div class="checkbox-item">
                                                    <label>
                                                        <input
                                                            class="mr-1"
                                                            type="radio"
                                                            checked={modalTemp.api_method === "get"}
                                                            onChange={() => {
                                                                const updatedModalTemp = {
                                                                    ...modalTemp,
                                                                    api_method: "get",
                                                                    tables: [],
                                                                    params: [],
                                                                    fields: [],
                                                                    body: [],
                                                                    calculates: [],
                                                                    statistic: []

                                                                };
                                                                setModalTemp(updatedModalTemp);
                                                                setSelectedFieldsModal2([]);
                                                                setSelectedFields([]);
                                                                setSelectedFieldsBody([]);
                                                            }}
                                                        />
                                                        GET
                                                    </label>
                                                </div>
                                                <div class="checkbox-item">
                                                    <label>
                                                        <input
                                                            class="mr-1"
                                                            type="radio"
                                                            checked={modalTemp.api_method === "post"}
                                                            onChange={() => {
                                                                const updatedModalTemp = {
                                                                    ...modalTemp,
                                                                    api_method: "post",
                                                                    tables: [],
                                                                    params: [],
                                                                    fields: [],
                                                                    body: [],
                                                                    calculates: [],
                                                                    statistic: []
                                                                };
                                                                setModalTemp(updatedModalTemp);
                                                                setSelectedFieldsModal2([]);
                                                                setSelectedFields([]);
                                                                setSelectedFieldsBody([]);

                                                            }}
                                                        />
                                                        POST</label>
                                                </div>

                                                <div class="checkbox-item round">
                                                    <label>
                                                        <input
                                                            class="mr-1"
                                                            type="radio"
                                                            checked={modalTemp.api_method === "put"}
                                                            onChange={() => {
                                                                const updatedModalTemp = {
                                                                    ...modalTemp,
                                                                    api_method: "put",
                                                                    tables: [],
                                                                    params: [],
                                                                    fields: [],
                                                                    body: [],
                                                                    calculates: [],
                                                                    statistic: []
                                                                };
                                                                setModalTemp(updatedModalTemp);
                                                                setSelectedFieldsModal2([]);
                                                                setSelectedFields([]);
                                                                setSelectedFieldsBody([]);

                                                            }}
                                                        />
                                                        PUT
                                                    </label>
                                                </div>
                                                <div class="checkbox-item">
                                                    <label>
                                                        <input
                                                            class="mr-1"
                                                            type="radio"
                                                            checked={modalTemp.api_method === "delete"}
                                                            onChange={() => {
                                                                const updatedModalTemp = {
                                                                    ...modalTemp,
                                                                    api_method: "delete",
                                                                    tables: [],
                                                                    params: [],
                                                                    fields: [],
                                                                    body: [],
                                                                    calculates: [],
                                                                    statistic: []

                                                                };
                                                                setModalTemp(updatedModalTemp);
                                                                setSelectedFieldsModal2([]);
                                                                setSelectedFields([]);
                                                                setSelectedFieldsBody([]);

                                                            }}
                                                        />
                                                        DELETE
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="font-weight-bold">{lang["api.description"]}</label>
                                            <textarea rows={7}
                                                className="form-control"
                                                value={modalTemp.description}
                                                onChange={(e) => setModalTemp({ ...modalTemp, description: e.target.value })}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>

                                    {/* Chọn các bảng */}
                                    <div class="col-md-12 col-lg-12 bordered mr-4">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">
                                                {lang["list of tables"]}
                                                <span className='red_star'> *</span>
                                            </p>
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
                                                                    <th class="font-weight-bold" scope="col">{lang["table name"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["creator"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["time"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tables.map((table, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{table.table_name}</td>
                                                                        <td>{table.create_by?.fullname}</td>
                                                                        <td>{table.create_at}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>{lang["not found"]}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {/* {
                                        tables && tables.length > 0 ? (
                                            <> */}
                                    {
                                        tables && tables.length > 0 ? (
                                            <>
                                                {/* Chọn đối số */}
                                                {(modalTemp.api_method === "get" || modalTemp.api_method === "put" || modalTemp.api_method === "delete") && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">
                                                                {lang["param fields"]}
                                                                {(modalTemp.api_method === "put" || modalTemp.api_method === "delete") && <span className='red_star'> *</span>}
                                                            </p>

                                                            {(modalTemp.api_method === "put" || modalTemp.api_method === "delete" && errorApi.params) && <p className="text-danger ml-2">{errorApi.params}</p>}


                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldParam">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {
                                                                modalTemp && modalTemp.params.length > 0 ? (
                                                                    <>
                                                                        <table class="table table-striped">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["fields name"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["table name"]}</th>

                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {modalTemp.params.map((fieldId, index) => {
                                                                                    const { tableId, fieldInfo } = findTableAndFieldInfo(fieldId);

                                                                                    if (!tableId || !fieldInfo) {
                                                                                        return null; // Xử lý trường hợp không tìm thấy thông tin bảng hoặc trường
                                                                                    }

                                                                                    const tableInfo = tableFields[tableId];

                                                                                    if (!tableInfo) {
                                                                                        return null; // Xử lý trường hợp không tìm thấy thông tin bảng
                                                                                    }

                                                                                    return (
                                                                                        <tr key={`${tableId}-${fieldId}`}>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{fieldInfo.field_name}</td>
                                                                                            <td>{tableInfo.table_name}</td>
                                                                                        </tr>
                                                                                    );
                                                                                })}

                                                                                {/* {modalTemp.params.map((params, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{statistic}</td>

                                                                                    </tr>
                                                                                ))} */}
                                                                            </tbody>
                                                                        </table>
                                                                    </>
                                                                ) : (
                                                                    <div class="list_cont ">
                                                                        <p>{lang["not found"]}</p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Chọn body */}
                                                {(modalTemp.api_method === "post" || modalTemp.api_method === "put") && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">
                                                                {lang["fields data"]}
                                                                {(modalTemp.api_method === "post" || modalTemp.api_method === "put") && <span className='red_star'> *</span>}
                                                            </p>
                                                            {(modalTemp.api_method === "put" || modalTemp.api_method === "post" && errorApi.body) && <p className="text-danger ml-2">{errorApi.body}</p>}

                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldBody">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {
                                                                modalTemp && modalTemp.body.length > 0 ? (
                                                                    <>
                                                                        <table class="table table-striped">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["fields name"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["table name"]}</th>

                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {modalTemp.body.map((fieldId, index) => {
                                                                                    const { tableId, fieldInfo } = findTableAndFieldInfo(fieldId);

                                                                                    if (!tableId || !fieldInfo) {
                                                                                        return null; // Xử lý trường hợp không tìm thấy thông tin bảng hoặc trường
                                                                                    }

                                                                                    const tableInfo = tableFields[tableId];

                                                                                    if (!tableInfo) {
                                                                                        return null; // Xử lý trường hợp không tìm thấy thông tin bảng
                                                                                    }

                                                                                    return (
                                                                                        <tr key={`${tableId}-${fieldId}`}>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{fieldInfo.field_name}</td>
                                                                                            <td>{tableInfo.table_name}</td>
                                                                                        </tr>
                                                                                    );
                                                                                })}
                                                                            </tbody>
                                                                        </table>
                                                                    </>
                                                                ) : (
                                                                    <div class="list_cont ">
                                                                        <p>{lang["not found"]}</p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}



                                                {/* Chọn trường hiện thị */}
                                                {modalTemp.api_method === "get" && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">{lang["fields display"]} <span className='red_star'>*</span></p>
                                                            {(modalTemp.api_method === "get") && <p className="text-danger ml-2">{errorApi.fields}</p>}
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldShow">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {
                                                                modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                                    <table class="table table-striped">
                                                                        <thead>
                                                                            <tr>
                                                                                <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                                <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                                <th class="font-weight-bold">{lang["alias"]}</th>
                                                                                <td class="font-weight-bold">{lang["table name"]}</td>

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
                                                                        <p>{lang["not found"]}</p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            null
                                        )
                                    }
                                    {
                                        modalTemp.fields && modalTemp.fields.length > 0 ? (
                                            <>
                                                {/* Chọn trường tính toán */}
                                                {modalTemp.api_method === "get" && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">{lang["calculated fields"]}</p>
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldCalculates">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {modalTemp.calculates && modalTemp.calculates.length > 0 ? (
                                                                <table class="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                            <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                            <th class="font-weight-bold">{lang["alias"]}</th>
                                                                            <th class="font-weight-bold">{lang["calculations"]}</th>
                                                                            <th class="font-weight-bold align-center">{lang["log.action"]}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {modalTemp.calculates.map((calculates, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{calculates.display_name}</td>
                                                                                <td>{calculates.fomular_alias}</td>
                                                                                <td>{calculates.fomular}</td>
                                                                                <td class="align-center " style={{ minWidth: "130px" }}>
                                                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => updateFieldCalculates(calculates)} data-toggle="modal" data-target="#editCalculates" title={lang["edit"]}></i>
                                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteCalculates(calculates)} title={lang["delete"]}></i>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div class="list_cont ">
                                                                    <p>{lang["not found"]}</p>
                                                                </div>
                                                            )
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Chọn trường thống kê */}
                                                {modalTemp.api_method === "get" && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">{lang["statistical fields"]}</p>
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldStatistical">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {modalTemp.statistic && modalTemp.statistic.length > 0 ? (
                                                                <table class="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                            <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                            <th class="font-weight-bold">{lang["alias"]}</th>
                                                                            <th class="font-weight-bold">{lang["calculations"]}</th>
                                                                            <th class="font-weight-bold align-center">{lang["log.action"]}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {modalTemp.statistic.map((statistic, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{statistic.display_name}</td>
                                                                                <td>{statistic.field}</td>
                                                                                <td>{statistic.fomular}</td>
                                                                                <td class="align-center" style={{ minWidth: "130px" }}>
                                                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => updateFieldStatistical(statistic)} data-toggle="modal" data-target="#editStatistical" title={lang["edit"]}></i>
                                                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteStatistical(statistic)} title={lang["delete"]}></i>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div class="list_cont ">
                                                                    <p>{lang["not found"]}</p>
                                                                </div>
                                                            )
                                                            }
                                                        </div>


                                                    </div>

                                                )}
                                            </>
                                        ) : (
                                            null
                                        )
                                    }
                                    <div className="mt-2 d-flex justify-content-end ml-auto">
                                        <button type="button" onClick={handleSubmitModal} class="btn btn-success mr-2">{lang["btn.update"]}</button>
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
                                <h4 class="modal-title">{lang["select table"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                        <select className="form-control" onChange={handleChange}>
                                            <option value="">{lang["choose"]}</option>
                                            {possibleTables.map(table => (
                                                <option key={table.id} value={table.table_name}>
                                                    {table.table_name}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedTables.length > 0 && (
                                            <div className={`form-group col-lg-12 mt-2`}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <label >{lang["selected table"]}: <span className='red_star'>*</span></label>
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
                                        <label>{lang["creator"]}</label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]}</label>
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
                {/*add fieldParam */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldParam">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["add param"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="container-field">
                                        {/* {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className={`form-group table-wrapper`}>
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex}>
                                                        <label>
                                                            <input className="mr-1 "
                                                                type="checkbox"
                                                                checked={selectedFields[tableId]?.includes(field.id) ?? false}
                                                                onChange={e => handleCheckboxChange(tableId, field.id, e.target.checked)}
                                                            />
                                                            {field.field_name}
                                                            {field.props.DATATYPE}
                                                        </label>
                                                    </div>
                                                ))}
                                                
                                            </div>
                                        ))} */}

                                        {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className="form-group table-wrapper">
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                <div className="field-wrapper">
                                                    {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => {
                                                        // Check if the field is a foreign key
                                                        let isForeignKey = tableFields[tableId]?.foreign_keys?.find(fk => fk.field_id === field.id);
                                                        let correspondingPrimaryKeyExists = false;

                                                        // Check if the corresponding primary key exists in any of the tables
                                                        if (isForeignKey) {
                                                            modalTemp.tables?.forEach(tid => {
                                                                correspondingPrimaryKeyExists = tableFields[tid]?.fields.some(obj => obj.id === isForeignKey.ref_field_id) || correspondingPrimaryKeyExists;
                                                            });
                                                        }

                                                        // Check if the field is of type 'date'
                                                        let isDateField = field.props.DATATYPE === 'DATE' || field.props.DATATYPE === 'DATETIME' || field.props.DATATYPE === 'DECIMAL' || field.props.DATATYPE === 'DECIMAL UNSIGNED';

                                                        return (
                                                            <div key={fieldIndex}>
                                                                <label>
                                                                    <input
                                                                        className="mr-1"
                                                                        type="checkbox"
                                                                        checked={selectedFields[tableId]?.includes(field.id) ?? false}
                                                                        onChange={e => {
                                                                            // If it's a date field, show error and prevent checking
                                                                            if (isDateField && e.target.checked) {
                                                                                Swal.fire({
                                                                                    title: "Lỗi!",
                                                                                    text: "Không thể chọn trường đối số có kiểu dữ liệu là DATE hoặc DECIMAL",
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                });
                                                                                e.preventDefault();
                                                                            }
                                                                            // If more than one table is selected and it's a foreign key and corresponding primary key exists, show error and prevent checking
                                                                            else if (modalTemp.tables?.length > 1 && isForeignKey && correspondingPrimaryKeyExists && e.target.checked) {
                                                                                Swal.fire({
                                                                                    title: "Lỗi!",
                                                                                    text: "Không thể chọn trường này vì nó là khóa ngoại và khóa chính tương ứng tồn tại trong danh sách các trường",
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                });
                                                                                e.preventDefault();
                                                                            } else {
                                                                                handleCheckboxChange(tableId, field.id, e.target.checked);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {field.field_name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}





                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["creator"]} </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]} </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>

                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitParam} data-dismiss="modal" class="btn btn-success ">{lang["btn.create"]}</button>
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
                                <h4 class="modal-title">{lang["add fields show"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="container-field">
                                        {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className={`form-group table-wrapper`}>
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                <div className="field-wrapper">
                                                    {tableFields[tableId] && tableFields[tableId].fields.map((field, fieldIndex) => {
                                                        // Check if the field is a foreign key
                                                        let isForeignKey = tableFields[tableId]?.foreign_keys?.find(fk => fk.field_id === field.id);
                                                        let correspondingPrimaryKeyExists = false;

                                                        // Check if the corresponding primary key exists in any of the tables
                                                        if (isForeignKey) {
                                                            modalTemp.tables?.forEach(tid => {
                                                                correspondingPrimaryKeyExists = tableFields[tid]?.fields.some(obj => obj.id === isForeignKey.ref_field_id) || correspondingPrimaryKeyExists;
                                                            });
                                                        }

                                                        return (
                                                            <div key={fieldIndex}>
                                                                <label>
                                                                    <input
                                                                        className="mr-1"
                                                                        type="checkbox"
                                                                        value={field.id}
                                                                        checked={selectedFieldsModal2[tableId]?.some(obj => obj.id === field.id) ?? false}
                                                                        onChange={(e) => {
                                                                            // If it's a foreign key and corresponding primary key exists, show error and prevent checking
                                                                            if (isForeignKey && correspondingPrimaryKeyExists && e.target.checked) {
                                                                                Swal.fire({
                                                                                    title: "Lỗi!",
                                                                                    text: "Không thể chọn trường này vì nó là khóa ngoại và khóa chính tương ứng tồn tại trong danh sách các trường",
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                });
                                                                                e.preventDefault();
                                                                            } else {
                                                                                const checked = e.target.checked;
                                                                                setSelectedFieldsModal2(prevState => {
                                                                                    let newFields = { ...prevState };
                                                                                    if (checked) {
                                                                                        if (!newFields[tableId]) newFields[tableId] = [];
                                                                                        newFields[tableId].push({
                                                                                            id: field.id,
                                                                                            display_name: field.field_name,
                                                                                            fomular_alias: field.fomular_alias
                                                                                        });
                                                                                    } else {
                                                                                        newFields[tableId] = newFields[tableId].filter(f => f.id !== field.id);
                                                                                    }
                                                                                    return newFields;
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    {field.field_name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["creator"]} </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]} </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitShow} data-dismiss="modal" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field Body */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldBody">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["add fields body"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="container-field">
                                        {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className={`form-group table-wrapper`}>
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                <div className="field-wrapper">
                                                    {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => {
                                                        // Check if the field is a foreign key
                                                        let isForeignKey = tableFields[tableId]?.foreign_keys?.find(fk => fk.field_id === field.id);
                                                        let correspondingPrimaryKeyExists = false;

                                                        // Check if the corresponding primary key exists in any of the tables
                                                        if (isForeignKey) {
                                                            modalTemp.tables?.forEach(tid => {
                                                                correspondingPrimaryKeyExists = tableFields[tid]?.fields.some(obj => obj.id === isForeignKey.ref_field_id) || correspondingPrimaryKeyExists;
                                                            });
                                                        }

                                                        return (
                                                            <div key={fieldIndex}>
                                                                <label>
                                                                    <input
                                                                        className="mr-1"
                                                                        type="checkbox"
                                                                        checked={selectedFieldsBody[tableId]?.includes(field.id) ?? false}
                                                                        onChange={e => {
                                                                            // If more than one table is selected and it's a foreign key and corresponding primary key exists, show error and prevent checking
                                                                            if (modalTemp.tables?.length > 1 && isForeignKey && correspondingPrimaryKeyExists && e.target.checked) {
                                                                                Swal.fire({
                                                                                    title: "Lỗi!",
                                                                                    text: "Không thể chọn trường này vì nó là khóa ngoại và khóa chính tương ứng tồn tại trong danh sách các trường",
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                });
                                                                                e.preventDefault();
                                                                            } else {
                                                                                handleCheckboxChangeBody(tableId, field.id, e.target.checked);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {field.field_name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        {/* {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className="form-group table-wrapper">
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex}>
                                                        <label>
                                                            <input
                                                                className="mr-1"
                                                                type="checkbox"
                                                                checked={selectedFieldsBody[tableId]?.includes(field.id) ?? false}
                                                                onChange={e => {
                                                                    if (!field.props.NULL) {
                                                                        handleCheckboxChangeBody(tableId, field.id, e.target.checked);
                                                                    } else {
                                                                        Swal.fire({
                                                                            title: "Thất bại!",
                                                                            text: "Không thể chọn trường này.",
                                                                            icon: "error",
                                                                            showConfirmButton: false,
                                                                            timer: 2000,
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            {field.field_name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))} */}
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["creator"]} </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]}</label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitBody} data-dismiss="modal" class="btn btn-success ">{lang["btn.create"]}</button>
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
                                <h4 class="modal-title">{lang["add field calculations"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fields name"]} <span className='red_star'>*</span></label>
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
                                        <label>{lang["fields display"]}</label>
                                        <div class="table-responsive">
                                            {
                                                modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                <th class="font-weight-bold">{lang["alias"]}</th>
                                                                <td class="font-weight-bold">{lang["table name"]}</td>

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
                                                        <p>{lang["not found"]}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fomular"]} <span className='red_star'>*</span></label>
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
                                        <label>{lang["creator"]} </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]} </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitFieldCalculates} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddCalculates" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field calculates */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editCalculates">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["edit field calculations"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="form-group col-lg-12">
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <input type="text" className="form-control" value={calculatesUpdate.display_name} onChange={
                                                (e) => { setCalculatesUpdate({ ...calculatesUpdate, display_name: e.target.value }) }
                                            } placeholder="" />
                                            {errorCaculates.display_name && <p className="text-danger">{errorCaculates.display_name}</p>}
                                        </div>
                                        <div class="form-group  col-md-12">
                                            <label> < p class="font-weight-bold">{lang["fields display"]}</p></label>
                                            <div class="table-responsive">
                                                {
                                                    modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                    <th class="font-weight-bold">{lang["alias"]}</th>
                                                                    <td class="font-weight-bold">{lang["table name"]}</td>

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
                                                            <p>{lang["not found"]}</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={`form-group col-lg-12`}>
                                            <label>{lang["fomular"]} <span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={calculatesUpdate.fomular}
                                                onChange={
                                                    (e) => { setCalculatesUpdate({ ...calculatesUpdate, fomular: e.target.value }) }
                                                }
                                                required
                                            />
                                            {errorCaculates.fomular && <p className="text-danger">{errorCaculates.fomular}</p>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submitupdateFieldCalculates}  class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditCalculates" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field statistical */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldStatistical">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["add fields statis"]} </h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={display_name}
                                            onChange={(e) => setDisplayname(e.target.value)}
                                            required
                                        />
                                        {errorStatistical.display_name && <p className="text-danger">{errorStatistical.display_name}</p>}
                                    </div>

                                    {/* <div className={`form-group col-lg-12`}>
                                        <label>Chọn trường <span className='red_star'>*</span></label>
                                        <select className="form-control" onChange={(e) => setField(e.target.value)}>
                                            {Object.values(selectedFieldsModal2).flat().map((field, index) => (
                                                <option key={index} value={field.fomular_alias}>
                                                    {field.fomular_alias}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                    <div class="form-group col-md-12">
                                        <label>< p class="font-weight-bold">{lang["fields display"]}</p></label>
                                        <div class="table-responsive">
                                            {
                                                modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                <th class="font-weight-bold">{lang["alias"]}</th>
                                                                <td class="font-weight-bold">{lang["table name"]}</td>

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
                                                        <p>{lang["not found"]}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <label>< p class="font-weight-bold">{lang["calculated fields"]}</p></label>
                                        <div class="table-responsive">
                                            {modalTemp.calculates && modalTemp.calculates.length > 0 ? (
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold">{lang["log.no"]}</th>
                                                            <th class="font-weight-bold">{lang["fields name"]}</th>
                                                            <th class="font-weight-bold">{lang["alias"]}</th>
                                                            <th class="font-weight-bold">{lang["calculations"]}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {modalTemp.calculates.map((calculate, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{calculate.display_name}</td>
                                                                <td>{calculate.fomular_alias}</td>
                                                                <td>{calculate.fomular}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div class="list_cont ">
                                                    <p>{lang["not found"]}</p>
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["select fields"]}<span className='red_star'>*</span></label>
                                        <select className="form-control" value={field} onChange={(e) => setField(e.target.value)}>
                                            <option value="">{lang["choose"]}</option>
                                            {Object.values(selectedFieldsModal2).flat().map((field, index) => (
                                                <option key={index} value={field.fomular_alias}>
                                                    {field.fomular_alias}
                                                </option>
                                            ))}
                                            {modalTemp.calculates.map((calculate, index) => (
                                                <option key={`calculate-${index}`} value={calculate.fomular_alias}>
                                                    {calculate.fomular_alias}
                                                </option>
                                            ))}
                                        </select>
                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>

                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fomular"]} <span className='red_star'>*</span></label>
                                        <select
                                            className="form-control"
                                            value={fomular}
                                            onChange={(e) => setFomular(e.target.value)}
                                            required
                                        >
                                            <option value="">{lang["choose"]}</option>
                                            <option value="SUM">SUM</option>
                                            <option value="AVERAGE">AVERAGE</option>
                                            <option value="COUNT">COUNT</option>
                                        </select>
                                        {errorStatistical.fomular && <p className="text-danger">{errorStatistical.fomular}</p>}
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["creator"]} </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]} </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button"  onClick={handleSubmitFieldStatistical} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddStatis" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field statistical */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editStatistical">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["edit statistical fields"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="form-group col-lg-12">
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <input type="text" className="form-control" value={statisticalUpdate.display_name} onChange={
                                                (e) => { setStatisticalUpdate({ ...statisticalUpdate, display_name: e.target.value }) }
                                            } placeholder="" />
                                            {errorStatistical.display_name && <p className="text-danger">{errorStatistical.display_name}</p>}
                                        </div>
                                        <div class="form-group  col-md-12">
                                            <label> < p class="font-weight-bold">{lang["fields display"]}</p></label>
                                            <div class="table-responsive">
                                                {
                                                    modalTemp.fields && modalTemp.fields.length > 0 ? (
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                    <th class="font-weight-bold">{lang["alias"]}</th>
                                                                    <td class="font-weight-bold">{lang["table name"]}</td>

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
                                                            <p>{lang["not found"]}</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <label>< p class="font-weight-bold">{lang["calculated fields"]}</p></label>
                                            <div class="table-responsive">
                                                {modalTemp.calculates && modalTemp.calculates.length > 0 ? (
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                <th class="font-weight-bold">{lang["alias"]}</th>
                                                                <th class="font-weight-bold">{lang["calculations"]}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {modalTemp.calculates.map((calculate, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{calculate.display_name}</td>
                                                                    <td>{calculate.fomular_alias}</td>
                                                                    <td>{calculate.fomular}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div class="list_cont ">
                                                        <p>{lang["not found"]}</p>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        </div>
                                        <div className={`form-group col-lg-12`}>
                                            <label>{lang["select fields"]}<span className='red_star'>*</span></label>
                                            <select className="form-control" value={statisticalUpdate.field} onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, field: e.target.value })}>
                                                <option value="">{lang["choose"]}</option>
                                                {modalTemp.fields.map((field, index) => (
                                                    <option key={index} value={field.fomular_alias}>
                                                        {field.fomular_alias}
                                                    </option>
                                                ))}
                                                {modalTemp.calculates.map((calculate, index) => (
                                                    <option key={`calculate-${index}`} value={calculate.fomular_alias}>
                                                        {calculate.fomular_alias}
                                                    </option>
                                                ))}
                                            </select>
                                            {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                        </div>

                                        <div className={`form-group col-lg-12`}>
                                            <label>{lang["fomular"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={statisticalUpdate.fomular}
                                                onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, fomular: e.target.value })}
                                                required
                                            >
                                                <option value="">{lang["choose"]}</option>
                                                <option value="SUM">SUM</option>
                                                <option value="AVERAGE">AVERAGE</option>
                                                <option value="COUNT">COUNT</option>
                                            </select>
                                            {errorStatistical.fomular && <p className="text-danger">{errorStatistical.fomular}</p>}
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={submitupdateFieldStatistical}  class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditStatis" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

