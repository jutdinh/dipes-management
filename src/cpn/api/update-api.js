
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { error, ready } from "jquery";
import responseMessages from "../enum/response-code";
import clipboardCopy from 'clipboard-copy';
import $ from 'jquery';
import { formatDate } from "../../redux/configs/format-date";
import bootstrap from "bootstrap";
import { da } from "date-fns/locale";

var hideModal = hideModalInfo => {
    $("#addFieldCalculates").modal("hide");
};
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('myParam');

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
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser)

    const { tempFieldParam } = useSelector(state => state);

    const dispatch = useDispatch();

    const { project_id, version_id, api_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    let navigate = useNavigate();
    const back = () => {
        navigate(`/projects/${project_id}/${version_id}/apis`);
    };
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
        api_scope: "public"
    };
    const defaultValuesExternalbody = {
        field_name: "",
        fomular_alias: "",
        props: {
            DATATYPE: "",
            NULL: false,
            LENGTH: 65535,
            AUTO_INCREMENT: true,
            MIN: "-2147483648",
            MAX: "2147483647",
            FORMAT: "",
            PATTERN: "",
            DECIMAL_PLACE: "",
            DEFAULT: "",
            DEFAULT_TRUE: "",
            DEFAULT_FALSE: ""
        }
    }
    const [modalTemp, setModalTemp] = useState(defaultValues);/////tạo api
    console.log(modalTemp)
    const [externalBody, setExternalBody] = useState(defaultValuesExternalbody);
    const showApiResponseMessage = (status) => {
        const langItem = (localStorage.getItem("lang") || "Vi").toLowerCase(); // fallback to English if no language is set
        const message = responseMessages[status];

        const title = message?.[langItem]?.type || "Unknown error";
        const description = message?.[langItem]?.description || "Unknown error";
        const icon = (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") ? "success" : "error";

        Swal.fire({
            title,
            text: description,
            icon,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            if (icon === "success") {
                window.location.reload();

            }
        });
    };

    const myModal = useRef();


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
        temp.fields = modalTemp.fields && modalTemp.fields.length > 0 ? "" : lang[""];

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
            "delete": [validateApiname, validateApiParams]
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
            updateApi();
        }
    }, [tempFieldParam]); // Theo dõi sự thay đổi của tempFieldParam


    const [allApi, setAllApi] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/apis/v/${version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                if (success) {
                    if (data) {

                        const filteredAPI = data.apis.find(api => api.api_id === api_id);
                        setAllApi(filteredAPI);
                        setModalTemp(filteredAPI)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [api_id])

    const [typeProject, setTypeProject] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/projects/project/${project_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {
                    setTypeProject(data.project_type)
                }

            })
    }, [api_id])
    // console.log(modalTemp.tables)
    // console.log(allApi)



    const [data, setData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            const fieldsData = [];

            for (let tableId of modalTemp.tables) {
                const response = await fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}`, {
                    headers: {
                        Authorization: _token
                    }
                });
                const tableData = await response.json();

                const filteredFields = Array.isArray(tableData.data.fields) && modalTemp?.body
                    ? tableData.data.fields.filter(field => modalTemp.body.includes(field.id))
                    : [];


                fieldsData.push(...filteredFields);
            }

            setData(fieldsData);
        };

        if (modalTemp.tables) {
            fetchData();
        }
    }, [modalTemp]);

    // console.log(data)


    const copyToClipboard = () => {
        const jsonData = data.reduce((acc, field) => {
            acc[field.fomular_alias] = '';
            return acc;
        }, {});

        const jsonString = JSON.stringify(jsonData);

        clipboardCopy(jsonString)
            .then(() => {
                // console.log('Đã sao chép dữ liệu vào clipboard.');
            })
            .catch((error) => {
                // console.error('Lỗi khi sao chép dữ liệu vào clipboard:', error);
            });
    };
    // console.log(allApi)
    const copyURL = () => {

        clipboardCopy(allApi.cai_gi_cung_dc_het_tron_a)
            .then(() => {
                // console.log('Đã sao chép dữ liệu vào clipboard.');
            })
            .catch((error) => {
                // console.error('Lỗi khi sao chép dữ liệu vào clipboard:', error);
            });
    };

    const updateApi = () => {
        const requestBody = {
            version_id: parseInt(version_id),
            api: {
                ...tempFieldParam
            }
        }
        // console.log(requestBody)
        fetch(`${proxy}/apis/api`, {
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
                    showApiResponseMessage(status);
                } else {
                    showApiResponseMessage(status);
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


    // console.log(modalTemp.tables)


    const [allTable, setAllTable] = useState([]);
    // console.log(allTable)
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
    //luu id bảng được chọn
    // console.log(selectedTables)

    // const handleChange = (e) => {
    //     const selectedTableName = e.target.value;
    //     const selectedTableData = allTable.find(
    //         (table) => table.table_name === selectedTableName
    //     );

    //     setSelectedTables((prevSelectedTables) => [
    //         ...prevSelectedTables,
    //         selectedTableData,
    //     ]);


    //     const updatedSelectedTables = [...selectedTables, selectedTableData];
    //     setPossibleTables(findLinkedTables(updatedSelectedTables));
    //     const linkedTables = allTable.filter(
    //         (table) => !updatedSelectedTables.some((selectedTable) => selectedTable.id === table.id) &&
    //             updatedSelectedTables.some(
    //                 (selectedTable) => (selectedTable.foreign_keys.some(
    //                     (fk) => fk.table_id === table.id || fk.ref_table_id === table.id
    //                 ) || selectedTable.primary_key === table.id ||
    //                     table.foreign_keys.some(
    //                         (fk) => fk.table_id === selectedTable.id || fk.ref_table_id === selectedTable.id
    //                     ) || table.primary_key === selectedTable.id)
    //             )
    //     );

    //     setPossibleTables(linkedTables);
    // };
    const handleChange = (e) => {
        const selectedTableName = e.target.value;
        // console.log("a")
        const selectedTableData = allTable.find(
            (table) => table.table_name === selectedTableName
        );

        setSelectedTables((prevSelectedTables) => [
            ...prevSelectedTables,
            selectedTableData,
        ]);

        const updatedSelectedTables = [...selectedTables, selectedTableData];
        const linkedTables = allTable.filter(
            (table) =>
                !updatedSelectedTables.some((selectedTable) => selectedTable.id === table.id) &&
                updatedSelectedTables.some(
                    (selectedTable) =>
                        selectedTable.foreign_keys.some((fk) => fk.table_id === table.id || fk.ref_table_id === table.id)
                )
        );
        setPossibleTables(linkedTables);
    };

    const findLinkedTables = (selectedTables) => {
        const updatedSelectedTables = [...selectedTables];
        return allTable.filter(
            (table) =>
                !updatedSelectedTables.some((selectedTable) => selectedTable.id === table.id) &&
                updatedSelectedTables.some(
                    (selectedTable) =>
                        selectedTable.foreign_keys.some((fk) => fk.table_id === table.id || fk.ref_table_id === table.id)
                )
        );
    };


    useEffect(() => {
        if (selectedTables.length < 1) {
            setPossibleTables(allTable);
        } else {
            setPossibleTables(findLinkedTables(selectedTables));
        }
    }, [selectedTables]);

    const handleDeleteAll = () => {
        setSelectedTables([]);


        setModalTemp(prevState => ({
            ...prevState,
            params: [],
            body: [],
            fields: [],
            tables: [],
            calculates: [],
            statistic: [],
        }));
    }




    //  hiển thị các tường của bảngđược chọn
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const fetchTable = (tableId) => {
            return fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}`, {
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

    useEffect(() => {

        setSelectedTables(tables);

    }, [tables]);




    const [tableFields, setTableFields] = useState([]);
    useEffect(() => {
        const fetchFields = async (tableId) => {
            const res = await fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}`, {
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

    const findTableAndFieldInfo = (fieldId) => {
        for (const [tableId, tableInfo] of Object.entries(tableFields)) {
            const fieldInfo = tableInfo?.fields.find((field) => field.id === fieldId);

            if (fieldInfo) {
                return { tableId, fieldInfo };
            }
        }

        return { tableId: null, fieldInfo: null };
    };
    // luu truong body 
    const [selectedFieldsBody, setSelectedFieldsBody] = useState({});
    // load dữ liệu checked
    const initializeCheckboxState = () => {
        if (modalTemp.body) {
            let tempBody = {};
            modalTemp.body.forEach((id) => {
                const { tableId } = findTableAndFieldInfo(id); // Use your function to get the tableId
                if (tableId) {
                    if (!tempBody[tableId]) {
                        tempBody[tableId] = [];
                    }
                    tempBody[tableId].push(id);
                }
            });
            setSelectedFieldsBody(tempBody);
        }
    };

    const handleCheckboxChangeBody = (tableId, fieldId, isChecked) => {
        // Sao chép state hiện tại
        const updatedSelections = { ...selectedFieldsBody };
        // Nếu không có mảng cho tableId này, tạo mới
        if (!updatedSelections[tableId]) {
            updatedSelections[tableId] = [];
        }
        if (isChecked) {
            updatedSelections[tableId].push(fieldId);

            // Nếu là khóa chính và được chọn, bỏ chọn khóa ngoại tương ứng (nếu có)
            if (isPrimaryKey(tableId, fieldId)) {
                for (let tid in tableFields) {
                    for (const fk of tableFields[tid]?.foreign_keys || []) {
                        if (fk.ref_field_id === fieldId && updatedSelections[tid]) {
                            updatedSelections[tid] = updatedSelections[tid].filter(id => id !== fk.field_id);
                        }
                    }
                }
            }
        } else {
            if (updatedSelections[tableId]) {
                updatedSelections[tableId] = updatedSelections[tableId].filter(id => id !== fieldId);
            }
        }
        setSelectedFieldsBody(updatedSelections);

    };

    // luu truong show 
    const [selectedFieldsModal2, setSelectedFieldsModal2] = useState({});

    const initializeCheckboxStateShow = () => {
        if (modalTemp.fields) {
            const tempField = modalTemp.fields.reduce((acc, field) => {
                const { id, display_name, fomular_alias } = field;
                const tableId = findTableAndFieldInfo(id).tableId;
                if (tableId) {
                    if (!acc[tableId]) {
                        acc[tableId] = [];
                    }
                    acc[tableId].push({
                        id,
                        display_name,
                        fomular_alias,
                    });
                }
                return acc;
            }, {});
            setSelectedFieldsModal2(tempField);
        }
    };


    /////luu truong param
    const [selectedFields, setSelectedFields] = useState({});

    const initializeCheckboxStateParam = () => {
        if (modalTemp.params) {
            let tempParam = {};
            modalTemp.params.forEach((id) => {
                const { tableId } = findTableAndFieldInfo(id); // Use your function to get the tableId
                if (tableId) {
                    if (!tempParam[tableId]) {
                        tempParam[tableId] = [];
                    }
                    tempParam[tableId].push(id);
                }
            });
            setSelectedFields(tempParam);
        }
    };
    function isPrimaryKey(tableId, fieldId) {
        return tableFields[tableId]?.primary_key.includes(fieldId);
    }

    const handleCheckboxChange = (tableId, fieldId, isChecked) => {
        const updatedSelections = { ...selectedFields };

        if (!updatedSelections[tableId]) {
            updatedSelections[tableId] = [];
        }

        if (isChecked) {
            updatedSelections[tableId].push(fieldId);

            // Nếu là khóa chính và được chọn, bỏ chọn khóa ngoại tương ứng (nếu có)
            if (isPrimaryKey(tableId, fieldId)) {
                for (let tid in tableFields) {
                    for (const fk of tableFields[tid]?.foreign_keys || []) {
                        if (fk.ref_field_id === fieldId && updatedSelections[tid]) {
                            updatedSelections[tid] = updatedSelections[tid].filter(id => id !== fk.field_id);
                        }
                    }
                }
            }
        } else {
            if (updatedSelections[tableId]) {
                updatedSelections[tableId] = updatedSelections[tableId].filter(id => id !== fieldId);
            }
        }

        setSelectedFields(updatedSelections);
    };


    //delete selected table 

    const [display_name, setDisplayname] = useState("");
    const [fomular, setFomular] = useState("");

    const [calculates, setCalculates] = useState([]);
    // console.log("calustasud", calculates)
    const [aliasCalculates, setaliasCalculates] = useState([]);

    const generateUniqueFormularAlias = async (display_name) => {
        const requestBody = { field_name: display_name, version_id };
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


    const handleDeleteExternal = (ex) => {

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
                const newExternal = modalTemp.external_body.filter(item => item.fomular_alias !== ex.fomular_alias);

                setModalTemp(prev => ({
                    ...prev,
                    external_body: newExternal,
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
            // $('#addFieldCalculates').modal('hide');
            Swal.fire({
                title: lang["success.title"],
                text: lang["success.add"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $('#closeAddCalculates').click()
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

            $('#closeEditCalculates').click()
        }


    };

    // Khi calculatesUpdate thay đổi, cập nhật mảng calculates
    // useEffect(() => {
    //     if (calculatesUpdate.fomular_alias) {
    //         submitupdateFieldCalculates();
    //     }
    // }, [calculatesUpdate]);


    const handleDeleteCalculates = (cal) => {
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
        // console.log(modalTemp.fields)
        const data = [...(modalTemp.fields || []), ...(modalTemp.calculates || [])]
        const raw_group_by = data.filter(field => sta.group_by.includes(field.fomular_alias));
        setGroupBy(raw_group_by)
        // console.log(raw_group_by)
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
                item.fomular_alias === statisticalUpdate.fomular_alias ? { ...statisticalUpdate, group_by: groupBy.map(g => g.fomular_alias), raw_group_by: groupBy } : item
            );

            setModalTemp(prev => ({
                ...prev,
                statistic: updatedStatistical
            }));

            setGroupBy([])

            Swal.fire({
                title: lang["success.title"],
                text: lang["success.update"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })

            $('#closeEditStatis').click()
        }
    };

    const handleDeleteStatistical = (sta) => {
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
    const [groupBy, setGroupBy] = useState([])
    // console.log(groupBy)
    const combinedFields = [...(modalTemp.fields || []), ...(modalTemp.calculates || [])];
    const addOrRemoveGroupByField = (fomular_alias) => {
        // console.log(id)
        const corespondingGroupByField = groupBy.find(f => f.fomular_alias == fomular_alias);
        let newGroupBy
        if (corespondingGroupByField) {
            newGroupBy = groupBy.filter(f => f.fomular_alias != fomular_alias);
        } else {

            const field = combinedFields.find(f => f.fomular_alias == fomular_alias);

            if (field) {
                newGroupBy = [...groupBy, field];
                // console.log(newGroupBy)
            }
        }
        setGroupBy(newGroupBy);
    }
    console.log(groupBy)
    const isFieldChecked = (fomular_alias) => {
        console.log(fomular_alias)
        return groupBy.some(f => f.fomular_alias == fomular_alias);
    }

    const [field, setField] = useState("");
    const [statistical, setStatistical] = useState([]);
    const handleSubmitFieldStatistical = async (event) => {
        if (validateStatistical()) {
            event.preventDefault();

            const fomular_alias = await generateUniqueFormularAlias(display_name);
            // console.log(fomular_alias)
            const newStatistical = { fomular_alias, display_name, field, fomular, group_by: groupBy.map(g => g.fomular_alias), raw_group_by: groupBy };

            // Cập nhật modalTemp
            setModalTemp(prev => ({
                ...prev,
                statistic: [...prev.statistic, newStatistical]
            }));

            setStatistical([...statistical, newStatistical])
            setDisplayname("");
            setField("");
            setFomular("");
            setGroupBy([])
            setShowModal(false);

            Swal.fire({
                title: lang["success.title"],
                text: lang["success.add"],
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            })
            $('#closeAddStatis').click()
        }
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




    const validateExternalBody = () => {
        let temp = {};
        temp.field_name = externalBody.field_name ? "" : lang["error.input"];
        const fomularAliasRegex = /^[A-Za-z0-9_.-]+$/;
        if (!fomularAliasRegex.test(externalBody.fomular_alias) || !externalBody.fomular_alias) {
            temp.fomular_alias = lang["error.invalidCharacter"];
        } else {
            temp.fomular_alias = "";
        }
        temp.DATATYPE = externalBody.props.DATATYPE ? "" : lang["error.input"];
        setErrorApi({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }

    const handleSubmitExternalBody = () => {

        if (validateExternalBody()) {

            setModalTemp(prevModalTemp => ({
                ...prevModalTemp,
                external_body: [...prevModalTemp.external_body, externalBody],
            }));

            setExternalBody(defaultValuesExternalbody)

            $('#closeModalExternalBody').click();
        }

    };
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

                            <div class="full graph_head d-flex justify-content-between align-items-center">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["edit api"]}
                                    </label> </h5>
                                </div>
                                <div>
                                    {["post", "put"].includes(allApi.api_method) && (
                                        <button type="button" className="btn btn-primary mr-2" onClick={copyToClipboard}>
                                            {lang["copy json"]}
                                        </button>
                                    )}
                                    <button type="button" className="btn btn-primary" onClick={copyURL}>
                                        {lang["copy url"]}
                                    </button>
                                </div>
                            </div>

                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-6">
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

                                    {typeProject === "api" ? (
                                        <div class="form-group col-lg-6">
                                            <label class="font-weight-bold">Remote URL </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalTemp.remote_url}
                                                onChange={(e) => setModalTemp({ ...modalTemp, remote_url: e.target.value })}
                                                placeholder=""
                                            />

                                        </div>
                                    ) : (
                                        <div class="form-group col-lg-6"></div>
                                    )
                                    }

                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold">{lang["api.description"]} <span className='red_star'>*</span></label>
                                        <textarea
                                            className="form-control"
                                            value={modalTemp.description}
                                            onChange={(e) => setModalTemp({ ...modalTemp, description: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>
                                    <div class="form-group col-lg-6"></div>


                                    {/* <div class="form-group col-lg-4">
                                        <label class="font-weight-bold">Phạm vi <span className='red_star'>*</span></label>
                                        <div class="checkbox-group">
                                            <div class="checkbox-item">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_scope === "public"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_scope: "public" })}
                                                />
                                                <label class="ml-1">PUBLIC</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input
                                                    type="radio"
                                                    checked={modalTemp.api_scope === "private"}
                                                    onChange={() => setModalTemp({ ...modalTemp, api_scope: "private" })}
                                                />
                                                <label class="ml-1">PRIVATE</label>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div class="form-group col-lg-8"></div>
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">{lang["method"]} <span className='red_star'>*</span></label>
                                        <div class="checkbox-group">
                                            <div class="checkbox-item">
                                                <input
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
                                                    }}
                                                />
                                                <label class="ml-1">GET</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input
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
                                                    }}
                                                />
                                                <label class="ml-1">POST</label>
                                            </div>

                                            <div class="checkbox-item round">
                                                <input
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
                                                    }}
                                                />
                                                <label class="ml-1">PUT</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input
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
                                                    }}
                                                />
                                                <label class="ml-1">DELETE</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chọn các bảng */}
                                    <div class="col-md-12 col-lg-12 bordered">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">{lang["list of tables"]} <span className='red_star'> *</span> </p>
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
                                                                        <td>{formatDate(table.create_at)}</td>
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
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={initializeCheckboxStateParam} data-toggle="modal" data-target="#addFieldParam">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {
                                                                modalTemp.params && modalTemp.params.length > 0 ? (
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
                                                            <p class="font-weight-bold">{lang["fields data"]} </p>
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={initializeCheckboxState} data-toggle="modal" data-target="#addFieldBody">
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
                                                {/* External Body */}
                                                {(modalTemp.api_method === "post" || modalTemp.api_method === "put" || modalTemp.api_method === "delete") && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">
                                                                {lang["fields external body"]}
                                                            </p>
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldExternalBody">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            {
                                                                modalTemp && modalTemp.external_body.length > 0 ? (
                                                                    <>
                                                                        <table class="table table-striped">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th class="font-weight-bold" scope="col">{lang["log.no"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["fields name"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["alias"]}</th>
                                                                                    <th class="font-weight-bold" scope="col">{lang["log.action"]}</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {modalTemp.external_body.map((ex, index) => {
                                                                                    return (
                                                                                        <tr key={`${index}`}>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{ex.field_name}</td>
                                                                                            <td>{ex.fomular_alias}</td>
                                                                                            <td class="align-center" style={{ minWidth: "130px" }}>
                                                                                                {/* <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => updateFieldExternalBody(ex)} data-toggle="modal" data-target="#editExternalBody" title={lang["edit"]}></i> */}
                                                                                                <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteExternal(ex)} title={lang["delete"]}></i>
                                                                                            </td>
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
                                                {/* Chọn trường hiển thị */}
                                                {(modalTemp.api_method === "get" || modalTemp.api_method === "post") && (
                                                    <div class="col-md-12 col-lg-12 bordered">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <p class="font-weight-bold">{lang["fields display"]} {modalTemp.api_method === "get" ? (<span className='red_star'>*</span>) : null}</p>
                                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={initializeCheckboxStateShow} data-toggle="modal" data-target="#addFieldShow">
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
                                                {(modalTemp.api_method === "get" || modalTemp.api_method === "post") && (
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
                                                                                    <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => updateFieldCalculates(calculates)} data-toggle="modal" data-target="#editCalculates" title={lang["edit"]}></i>
                                                                                    <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteCalculates(calculates)} title={lang["delete"]}></i>
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
                                                {(modalTemp.api_method === "get" || modalTemp.api_method === "post") && (
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
                                                                            <th class="font-weight-bold">{lang["group by"]}</th>
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
                                                                                <td>{[...(modalTemp.fields || []), ...(modalTemp.calculates || [])].filter(field => statistic?.group_by?.includes(field.fomular_alias)).map(field => field.display_name).join(", ")}</td>

                                                                                <td>{statistic.fomular}</td>
                                                                                <td class="align-center" style={{ minWidth: "130px" }}>
                                                                                    <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => updateFieldStatistical(statistic)} data-toggle="modal" data-target="#editStatistical" title={lang["edit"]}></i>
                                                                                    <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteStatistical(statistic)} title={lang["delete"]}></i>
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
                                        <button type="button" onClick={() => back()} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
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
                                <h4 class="modal-title">{lang["edit table"]}</h4>
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
                                                    <button class="btn btn-danger mb-2" onClick={handleDeleteAll}>{lang["deleteall"]}</button>
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
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]}</label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" data-dismiss="modal" onClick={handleSubmitTables}> {lang["btn.update"]}</button>
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
                                <h4 class="modal-title">{lang["edit param"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className="container-field">
                                        {/* {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className={`form-group table-wrapper`}>
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                <div className="field-wrapper">
                                                    {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => (
                                                        <div key={fieldIndex}>
                                                            <label>
                                                                <input className="mr-1 "
                                                                    type="checkbox"
                                                                    checked={selectedFields[tableId]?.includes(field.id) ?? false}
                                                                    onChange={e => handleCheckboxChange(tableId, field.id, e.target.checked)}
                                                                />
                                                                {field.field_name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
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

                                                        function isPrimaryKey(tableId, fieldId) {
                                                            return tableFields[tableId]?.primary_key.includes(fieldId);
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
                                                                                    title: lang["log.error"],
                                                                                    text: lang["error.date"],
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-confirm my-confirm-button-class'
                                                                                    }
                                                                                });
                                                                                e.preventDefault();
                                                                            }
                                                                            // If more than one table is selected and it's a foreign key and corresponding primary key exists, show error and prevent checking
                                                                            else if (isForeignKey && e.target.checked && isPrimaryKey(isForeignKey.table_id, isForeignKey.ref_field_id) && selectedFields[isForeignKey.table_id]?.includes(isForeignKey.ref_field_id)) {
                                                                                Swal.fire({
                                                                                    title: lang["log.error"],
                                                                                    text: lang["error.fk"],
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-confirm my-confirm-button-class'
                                                                                    }
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
                                <button type="button" onClick={handleSubmitParam} data-dismiss="modal" class="btn btn-success ">{lang["btn.update"]}</button>
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
                                <h4 class="modal-title">{lang["edit fields show"]}</h4>
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
                                                                            const checked = e.target.checked;

                                                                            // Kiểm tra nếu trường hiện tại là khóa ngoại và đã được chọn,
                                                                            // và khóa chính tương ứng của nó cũng đã được chọn trước đó.
                                                                            if (isForeignKey && checked && isPrimaryKey(isForeignKey.table_id, isForeignKey.ref_field_id) && selectedFieldsModal2[isForeignKey.table_id]?.some(f => f.id === isForeignKey.ref_field_id)) {
                                                                                Swal.fire({
                                                                                    title: lang["log.error"],
                                                                                    text: lang["error.fk"],
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-confirm my-confirm-button-class'
                                                                                    }
                                                                                });
                                                                                e.preventDefault();
                                                                            } else {
                                                                                setSelectedFieldsModal2(prevState => {
                                                                                    let newFields = { ...prevState };

                                                                                    if (checked) {
                                                                                        if (!newFields[tableId]) newFields[tableId] = [];
                                                                                        newFields[tableId].push({
                                                                                            id: field.id,
                                                                                            display_name: field.field_name,
                                                                                            fomular_alias: field.fomular_alias
                                                                                        });

                                                                                        // Bỏ chọn khóa ngoại nếu khóa chính tương ứng được chọn
                                                                                        if (isPrimaryKey(tableId, field.id)) {
                                                                                            for (let tid in tableFields) {
                                                                                                for (const fk of tableFields[tid]?.foreign_keys || []) {
                                                                                                    if (fk.ref_field_id === field.id && newFields[tid]) {
                                                                                                        newFields[tid] = newFields[tid].filter(f => f.id !== fk.field_id);
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
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
                                        <label>{lang["creator"]}  </label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]}  </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitShow} data-dismiss="modal" class="btn btn-success ">{lang["btn.update"]}</button>
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
                                <h4 class="modal-title">{lang["edit fields body"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    {/* <div className="container-field">
                                        {modalTemp.tables?.map((tableId, index) => (
                                            <div key={index} className={`form-group table-wrapper`}>
                                                <label className="table-label">{tableFields[tableId]?.table_name}</label>
                                                {tableFields[tableId]?.fields && tableFields[tableId].fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex}>
                                                        <label>
                                                            <input className="mr-1 "
                                                                type="checkbox"
                                                                checked={selectedFieldsBody[tableId]?.includes(field.id) ?? false}
                                                                onChange={e => handleCheckboxChangeBody(tableId, field.id, e.target.checked)}
                                                            />
                                                            {field.field_name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div> */}
                                    <div className="container-field">
                                        {/*  */}
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

                                                        function isPrimaryKey(tableId, fieldId) {
                                                            return tableFields[tableId]?.primary_key.includes(fieldId);
                                                        }



                                                        return (
                                                            <div key={fieldIndex}>
                                                                <label>
                                                                    <input
                                                                        className="mr-1"
                                                                        type="checkbox"
                                                                        checked={selectedFieldsBody[tableId]?.includes(field.id) ?? false}
                                                                        onChange={e => {

                                                                            if (isForeignKey && e.target.checked && isPrimaryKey(isForeignKey.table_id, isForeignKey.ref_field_id) && selectedFieldsBody[isForeignKey.table_id]?.includes(isForeignKey.ref_field_id)) {
                                                                                Swal.fire({
                                                                                    title: lang["log.error"],
                                                                                    text: lang["error.fk"],
                                                                                    icon: "error",
                                                                                    showConfirmButton: true,
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-confirm my-confirm-button-class'
                                                                                    }
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
                                <button type="button" onClick={handleSubmitBody} data-dismiss="modal" class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field External Body */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldExternalBody">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["add fields external body"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group col-lg-12">
                                        <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={externalBody.field_name}
                                            onChange={(e) => setExternalBody({ ...externalBody, field_name: e.target.value })}
                                            placeholder=""
                                        />
                                        {errorApi.field_name && <p className="text-danger">{errorApi.field_name}</p>}
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <label>{lang["alias"]}<span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={externalBody.fomular_alias}
                                            onInput={(e) => {
                                                let inputValue = e.target.value;

                                                // Regex này sẽ cho phép ký tự tiếng Việt, số, "_", và "-" mà không có khoảng trắng hoặc ký tự đặc biệt khác
                                                const allowedCharactersRegex = /^[A-Za-z0-9À-ỹ_.-]+$/;

                                                const check = modalTemp.external_body?.find(ex => ex.fomular_alias === inputValue);

                                                let temp = {};
                                                temp.fomular_alias = check ? lang["duplicate fomular"] : "";

                                                if (!allowedCharactersRegex.test(inputValue)) {
                                                    setErrorApi({
                                                        fomular_alias: lang["error.invalidCharacter"]
                                                    });
                                                    // Nếu chuỗi nhập vào không hợp lệ, không làm gì thêm và thoát ra khỏi hàm
                                                }

                                                setErrorApi({
                                                    ...temp
                                                });

                                                // Kiểm tra xem chuỗi có bắt đầu bằng một số
                                                if (inputValue && isNaN(inputValue[0])) {
                                                    setExternalBody({ ...externalBody, fomular_alias: inputValue });
                                                } else if (!inputValue) {
                                                    setExternalBody({ ...externalBody, fomular_alias: '' });
                                                }
                                            }}
                                            placeholder=""
                                        />
                                        {errorApi.fomular_alias && <p className="text-danger">{errorApi.fomular_alias}</p>}
                                    </div>
                                    
                                    <div class="form-group col-lg-12">
                                        <label>{lang["fields default"]} <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={externalBody.default_value}
                                            onChange={(e) => setExternalBody({ ...externalBody, default_value: e.target.value })}
                                            placeholder=""
                                        />
                                        {errorApi.field_name && <p className="text-danger">{errorApi.field_name}</p>}
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <label>{lang["null"]} </label>
                                        <select className="form-control" onChange={(e) =>
                                            setExternalBody(prevState => ({
                                                ...prevState,
                                                props: {
                                                    ...prevState.props,
                                                    NULL: e.target.value === "true" ? true : false
                                                }
                                            }))
                                        }>
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
                                            value={externalBody.props.DATATYPE}
                                            onChange={(e) => {
                                                const selectedDataType = e.target.value;
                                                const selectedType = types.find((type) => type.name === selectedDataType);
                                                if (selectedType) {
                                                    setExternalBody(prevModalTemp => {
                                                        const updateValues = {
                                                            ...prevModalTemp.props, // giữ nguyên các giá trị props hiện tại  
                                                            PATTERN: defaultValuesExternalbody.props.PATTERN,
                                                            FORMAT: defaultValuesExternalbody.props.FORMAT,
                                                            DATATYPE: selectedDataType
                                                        };
                                                        // Nếu có giới hạn, gán giá trị min, max tương ứng
                                                        if (selectedType.limit) {
                                                            const { min, max } = selectedType.limit;
                                                            updateValues.MIN = min !== undefined ? String(min) : prevModalTemp.props.MIN;
                                                            updateValues.MAX = max !== undefined ? String(max) : prevModalTemp.props.MAX;
                                                        }
                                                        // Nếu là kiểu date, gán định dạng ngày
                                                        if (selectedType.type === 'date' || selectedType.type === 'datetime') {
                                                            updateValues.FORMAT = selectedType.format;
                                                        }
                                                        return {
                                                            ...prevModalTemp, // giữ nguyên các giá trị hiện tại của externalBody
                                                            props: updateValues // cập nhật object props
                                                        };
                                                    });

                                                } else {
                                                    setExternalBody(prevModalTemp => ({
                                                        ...prevModalTemp,
                                                        props: {
                                                            ...prevModalTemp.props,
                                                            DATATYPE: selectedDataType,
                                                        }
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
                                        {errorApi.DATATYPE && <p className="text-danger">{errorApi.DATATYPE}</p>}
                                    </div>
                                    <div class="form-group col-lg-12 ml-2">
                                        {types.map((type) => {
                                            if (type.name !== externalBody.props.DATATYPE) return null;

                                            return (
                                                <div key={type.id}>
                                                    {type.props.map((prop, index) => {
                                                        let inputType = prop.type;
                                                        let isBoolType = prop.type === "bool";
                                                        let value = externalBody[prop.name];

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
                                                                            setExternalBody((prevModalTemp) => ({
                                                                                ...prevModalTemp,
                                                                                props: {
                                                                                    ...prevModalTemp.props,
                                                                                    [prop.name]: e.target.value === "true",
                                                                                }

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
                                                                            setExternalBody((prevModalTemp) => ({
                                                                                ...prevModalTemp,
                                                                                props: {
                                                                                    ...prevModalTemp.props,
                                                                                    [prop.name]: e.target.value,
                                                                                }

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
                                <button type="button" onClick={handleSubmitExternalBody} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" id="closeModalExternalBody" class="btn btn-danger">{lang["btn.close"]}</button>
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
                                    <div class="form-group  col-md-12">
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
                                <button type="button" onClick={handleSubmitFieldCalculates} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeAddCalculates" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field calculates */}
                <div class={`modal ${showModal ? 'show1' : ''}`} id="editCalculates">
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
                                <button type="button" onClick={submitupdateFieldCalculates} class="btn btn-success ">{lang["btn.update"]}</button>
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
                                <h4 class="modal-title">{lang["add fields statis"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fields name statistic"]} <span className='red_star'>*</span></label>
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
                                                                    return null;
                                                                }
                                                                const tableInfo = tableFields[tableId];
                                                                if (!tableInfo) {
                                                                    return null;
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
                                        <p className="font-weight-bold">
                                            {lang["group by"]}
                                        </p>

                                        <div className="form-group checkbox-container-wrapper">
                                            <div className="checkbox-container">
                                                {[...(modalTemp.fields || []), ...(modalTemp.calculates || [])].map((field, index) => (
                                                    <div key={index} className="form-check">
                                                        <label className="form-check-label">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={field.fomular_alias}
                                                                checked={isFieldChecked(field.fomular_alias)}
                                                                onChange={(e) => addOrRemoveGroupByField(e.target.value)}
                                                            />

                                                            {field.display_name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>
                                    {/* <div class="form-group col-lg-12">
                                        <div class="table-responsive">
                                            {
                                                groupBy.length > 0 ? (
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
                                                                {groupBy.map((field, index) =>
                                                                    <tr key={`${index}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{field.display_name}</td>
                                                                        <td>{field.fomular_alias}</td>
                                                                    </tr>
                                                                )}
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
                                    </div> */}
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["select fields"]} <span className='red_star'>*</span></label>
                                        <select className="form-control" value={field} onChange={(e) => setField(e.target.value)}>
                                            <option value="">{lang["select fields"]}</option>
                                            {modalTemp.fields?.map((field, index) => (
                                                <option key={index} value={field.fomular_alias}>
                                                    {field.display_name} ({field.fomular_alias})
                                                </option>
                                            ))}
                                            {calculates.map((calculate, index) => (
                                                <option key={`calculate-${index}`} value={calculate.fomular_alias}>
                                                    {calculate.display_name} ({calculate.fomular_alias})
                                                </option>
                                            ))}
                                        </select>
                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>

                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fomular"]}<span className='red_star'>*</span></label>
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
                                <button type="button" onClick={handleSubmitFieldStatistical} class="btn btn-success ">{lang["btn.update"]}</button>
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
                                                                        return null;
                                                                    }
                                                                    const tableInfo = tableFields[tableId];
                                                                    if (!tableInfo) {
                                                                        return null;
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
                                            <p className="font-weight-bold">
                                                {lang["group by"]}
                                            </p>

                                            <div className="form-group checkbox-container-wrapper">
                                                <div className="checkbox-container">
                                                    {[...(modalTemp.fields || []), ...(modalTemp.calculates || [])].map((field, index) => (
                                                        <div key={index} className="form-check">
                                                            <label className="form-check-label">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={field.fomular_alias}
                                                                    checked={isFieldChecked(field.fomular_alias)}
                                                                    onChange={(e) => addOrRemoveGroupByField(e.target.value)}
                                                                />

                                                                {field.display_name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                        </div>
                                        {/* <div class="form-group col-lg-12">
                                            <div class="table-responsive">
                                                {
                                                    groupBy.length > 0 ? (
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
                                                                    {groupBy.map((field, index) =>
                                                                        <tr key={`${index}`}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{field.display_name}</td>
                                                                            <td>{field.fomular_alias}</td>
                                                                        </tr>
                                                                    )}
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
                                        </div> */}
                                        <div className={`form-group col-lg-12`}>
                                            <label>{lang["select fields"]}<span className='red_star'>*</span></label>
                                            <select className="form-control" value={statisticalUpdate.field} onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, field: e.target.value })}>
                                                <option value="">{lang["choose"]}</option>
                                                {modalTemp.fields.map((field, index) => (
                                                    <option key={index} value={field.fomular_alias}>
                                                        {field.display_name} ({field.fomular_alias})
                                                    </option>
                                                ))}
                                                {modalTemp.calculates.map((calculate, index) => (
                                                    <option key={`calculate-${index}`} value={calculate.fomular_alias}>
                                                        {calculate.fomular_alias} ({calculate.fomular_alias})
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
                                <button type="button" onClick={submitupdateFieldStatistical} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditStatis" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

