
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { formatDate } from '../../redux/configs/format-date';

import Swal from 'sweetalert2';
import { Tables } from ".";
import { data } from "jquery";
import responseMessages from "../enum/response-code";

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

    const { project_id, version_id, table_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    let navigate = useNavigate();
    const [fieldTemp, setFieldTemp] = useState({});
    // const [modalTemp, setModalTemp] = useState({ DATATYPE: types[0].value });
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


    const defaultValues = {
        field_name: '',
        DATATYPE: '',
        NULL: 'false',
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


    const [tables, setTables] = useState([]);

    const { tempFields, newFields, tempCounter } = useSelector(state => state); // const tempFields = useSelector( state => state.tempFields );

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

    };


    const handleDelete = () => {


        dispatch({
            branch: "db",
            type: "resetTempFields",
        })
        setShowModal(false);

    };
    const handleSubmitModal = () => {

        setFieldTemp(modalTemp)
        if (isOn) {
            setPrimaryKey([...primaryKey, tempCounter])
        }

        if (isOnforenkey) {
            setForeignKeys([...foreignKeys, { ...foreignKey, index: tempCounter }])
        }

        setIsOn(false)
        setIsOnforenkey(false)

        dispatch({
            branch: "db",
            type: "addField",
            payload: {
                field: { ...modalTemp, index: tempCounter }

            }
        })
        // setModalTemp((prevModalTemp) => ({
        //     ...prevModalTemp,
        //     ...defaultValues,
        // }));

        // console.log(tempFields)
        // console.log(primaryKey)

    };

    const handleUpdatetModal = () => {

        let newPrimaryKey = [...primaryKey];
        // console.log(newPrimaryKey)
        if (isOn) {
            if (!newPrimaryKey.includes(fieldTempUpdate.id)) {
                newPrimaryKey.push(fieldTempUpdate.id);
            }
        } else {
            newPrimaryKey = newPrimaryKey.filter(index => index !== fieldTempUpdate.id);
        }
        setPrimaryKey(newPrimaryKey);

        setTableFields({ ...getTableFields, primary_key: newPrimaryKey })


        // let newForeignKeys = [...getTableFields.foreign_keys];
        // if (isOnforenkey) {
        //     if (!newForeignKeys.includes(fieldTempUpdate.id)) {
        //         newForeignKeys.push(fieldTempUpdate.id);
        //     }
        // } else {
        //     newForeignKeys = newForeignKeys.filter(index => index !== fieldTempUpdate.id);
        // }
        // setForeignKeys(newForeignKeys);

        // setTableFields({ ...getTableFields, primary_key: newPrimaryKey })

        // let newForeignKeys = [...getTableFields.foreign_keys];
        // const currentForeignKeyIndex = newForeignKeys.findIndex(fk => fk.field_id === fieldTempUpdate.id);

        // if (isOnforenkey) {
        //     if (currentForeignKeyIndex === -1) { // nếu không tìm thấy khóa ngoại trong mảng
        //         newForeignKeys.push(fieldTempUpdate); // thêm khóa ngoại mới
        //     }
        // } else {
        //     if (currentForeignKeyIndex !== -1) { // nếu tìm thấy khóa ngoại trong mảng
        //         newForeignKeys.splice(currentForeignKeyIndex, 1); // xóa khóa ngoại khỏi mảng
        //     }
        // }
        // setForeignKeys(newForeignKeys);
        if (isOnforenkey) {
            const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.field_id === fieldTempUpdate.id);
            updatedForeignKeys.push({ ...foreignKey, field_id: fieldTempUpdate.id });
            setForeignKeys(updatedForeignKeys);
            setTableFields({ ...getTableFields, foreign_keys: updatedForeignKeys });
        } else {
            const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.field_id !== fieldTempUpdate.id);
            setForeignKeys(updatedForeignKeys);
            setTableFields({ ...getTableFields, foreign_keys: updatedForeignKeys });
        }

        const newfIELDS = getTableFields.fields.map(field => {
            if (field.id == fieldTempUpdate.id) {
                return fieldTempUpdate
            }
            return field
        });

        setTableFields({ ...getTableFields, fields: newfIELDS });
        setIsOn(!isOn);
        setModalTemp((prevModalTemp) => ({
            ...prevModalTemp,
            ...defaultValues,
        }));

    };
    const handleAddNewField = () => {

        setFieldTemp(modalTemp)
        const newPrimaryKey = [...getTableFields.primary_key];
        if (isOn) {
            setPrimaryKey([...newPrimaryKey, tempCounter])
        }

        if (isOnforenkey) {
            setForeignKeys([...foreignKeys, { ...foreignKey, index: tempCounter }])
        }

        setIsOn(false)
        setIsOnforenkey(false)
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
    };

    const handleUpdatetModalNewField = () => {
        if (!isOn && primaryKey.includes(fieldNew.index)) {
            const newPrimaryKey = primaryKey.filter(index => index !== fieldNew.index);
            setPrimaryKey(newPrimaryKey);
        }
        if (isOn) {
            const newPrimaryKey = new Set([...primaryKey, fieldNew.index]);
            const uniquePrimaryKey = [...newPrimaryKey];
            setPrimaryKey(uniquePrimaryKey)
        }
        if (isOnforenkey) {
            const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.index !== fieldNew.index);
            updatedForeignKeys.push({ ...foreignKey, index: fieldNew.index });
            setForeignKeys(updatedForeignKeys);
        } else {
            const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.index !== fieldNew.index);
            setForeignKeys(updatedForeignKeys);
        }
        dispatch({
            branch: "db",
            type: "updateField",
            payload: {
                field: { ...fieldNew }
            }
        })

        setIsOn(false)
        setIsOnforenkey(false)

    };
    const [fieldTempUpdate, setFieldTempupdate] = useState([]);

    useEffect(() => {
        if (primaryKey.includes(fieldTempUpdate.id)) {
            setIsOn(true);
        }
        else {
            setIsOn(false);
        }
    }, [fieldTempUpdate]);

    useEffect(() => {

        if (foreignKeys.some((fk) => fk.field_id === fieldTempUpdate.id)) {
            setIsOnforenkey(true);
        }
        else {
            setIsOnforenkey(false);
        }
    }, [fieldTempUpdate]);



    ///update
    useEffect(() => {
        if (getTableFields?.primary_key?.includes(fieldTempUpdate.id)) {
            setIsOn(true);
        }
        else {
            setIsOn(false);
        }
    }, [fieldTempUpdate]);

    useEffect(() => {

        if (getTableFields?.foreign_keys?.some((fk) => fk.field_id === fieldTempUpdate.id)) {
            setIsOnforenkey(true);
        }
        else {
            setIsOnforenkey(false);
        }
    }, [fieldTempUpdate]);
    ////update
    // useEffect(() => {
    //     if (getTableFields?.primary_key?.includes(fieldTempUpdate.id)) {
    //         setIsOn(true);
    //     }
    //     else {
    //         setIsOn(false);
    //     }
    // }, [fieldTempUpdate]);
    // useEffect(() => {

    //     if (getTableFields.foreign_keys?.some((fk) => fk.field_id === fieldTempUpdate.id)) {
    //         setIsOnforenkey(true);
    //     }
    //     else {
    //         setIsOnforenkey(false);
    //     }
    // }, [fieldTempUpdate]);


    const loadModalTemp = (fieldData) => {
        setModalTemp({
            ...defaultValues,
            ...fieldData
        });
    }

    // console.log(fieldTempUpdate)
    const getIdField = (fieldId) => {
        // console.log(fieldId)
        setFieldTempupdate(fieldId);

        // loadModalTemp(fieldId);

        const field_id = fieldId.id;

        const foreignKeys = getTableFields.foreign_keys ? getTableFields.foreign_keys : [];
        const foreignKey = foreignKeys.find(key => key.field_id == field_id);

        if (foreignKey) {
            const foreignTable = tables.tables?.find(tb => tb.id == foreignKey.table_id);
            if (foreignTable) {
                selectDefaultTable(foreignTable.id)
            }
        } else {

        }
    }
    const [fieldNew, setFieldNew] = useState([]);

    const getIdFieldTempNew = (fieldId) => {
        // console.log(fieldId)
        setFieldNew(fieldId);

        // loadModalTemp(fieldId);

        const field_id = fieldId.id;

        const foreignKeys = getTableFields.foreign_keys ? getTableFields.foreign_keys : [];
        const foreignKey = foreignKeys.find(key => key.field_id == field_id);

        if (foreignKey) {
            const foreignTable = tables.tables?.find(tb => tb.id == foreignKey.table_id);
            if (foreignTable) {
                selectDefaultTable(foreignTable.id)
            }
        } else {

        }
    }
    useEffect(() => {
        if (primaryKey.includes(fieldNew.index)) {
            setIsOn(true);
        }
        else {
            setIsOn(false);
        }
    }, [fieldNew]);

    useEffect(() => {

        if (foreignKeys.some((fk) => fk.index === fieldNew.index)) {
            setIsOnforenkey(true);
        }
        else {
            setIsOnforenkey(false);
        }
    }, [fieldNew]);
    const deleteField = (fieldId) => {
        const requestBody = {
            table_id: fieldId.table_id,
            field_ids: [fieldId.id]
        };
        console.log(requestBody)
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.field"],
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
                fetch(`${proxy}/db/tables/table/fields`, {
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
                        console.log(resp)
                        if (data.failFields?.length > 0) {
                            Swal.fire({
                                title: lang["alarm.alarm"],
                                text: lang["error.delete.pramry"],
                                icon: 'warning ',
                                showConfirmButton: true,
                                customClass: {
                                    confirmButton: 'swal2-confirm my-confirm-button-class',
                                    // add more custom classes if needed
                                }

                            })
                            return;
                        }
                        else {
                            showApiResponseMessage(status);
                        }

                    });
            }
        });
    }
    const handleUpdatetModalFieldTemp = () => {
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
    };
    const deleteFieldTemp = (fieldId) => {
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.field"],
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

    const [getTableFields, setTableFields] = useState({});

    useEffect(() => {
        fetch(`${proxy}/db/tables/table/${table_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log("data", data)
                if (success) {
                    if (data) {
                        setTableFields(data);
                        setPrimaryKey(data.primary_key)
                        setForeignKeys(data.foreign_keys)
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    console.log(getTableFields)
    useEffect(() => {
        fetch(`${proxy}/db/tables/v/${version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log("data", data)
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

        fetch(`${proxy}/db/tables/table/${tableId}/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data } = resp;
                if (success) {
                    setFields(data);
                    console.log(data)
                } else {
                    // Xử lý lỗi ở đây
                    // window.location = "/404-not-found"
                }
            });
    };
    console.log(selectedTableId)
    const selectDefaultTable = (tableId) => {
        setSelectedTableId(tableId);
        fetch(`${proxy}/db/tables/table/${tableId}/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data } = resp;
                if (success) {
                    setFields(data);
                    console.log(data)
                } else {
                    // Xử lý lỗi ở đây
                    // window.location = "/404-not-found"
                }
            });
    }

    //primary
    const [isOn, setIsOn] = useState(false);
    const [primaryKey, setPrimaryKey] = useState([]);


    const handleClickPrimary = () => {
        setIsOn(!isOn);
    };
    const handleClickPrimaryTemp = () => {
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
        setIsOnforenkey(!isOnforenkey);
    };
    const autoType = (field_id) => {
        const field = fields.find(f => f.id == field_id);
        setModalTemp({
            ...modalTemp, ...field.props
        });
    }
    const [tableUpdate, setUpdateTable] = useState([]);
    useEffect(() => {
        console.log(tableUpdate);
    }, [tableUpdate]);

    const updateTable = (e) => {
        e.preventDefault();
        const requestBody = {
            table_id: getTableFields.id,
            table_name: getTableFields.table_name,
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
                    updateFields();
                } else {
                    showApiResponseMessage(status);
                }
            })
    };

    const updateFields = () => {
        const hashedFields = getTableFields.fields.map(field => {
            return {
                ...field.props, ...field
            }
        })

        const requestBody = {
            table_id: getTableFields.id,
            fields: hashedFields,
        };
        console.log(requestBody)
        fetch(`${proxy}/db/tables/table/fields`, {
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
                    console.log(data)
                    updateKey(data);
                } else {
                    showApiResponseMessage(status);
                }
            })
    };

    const updateKey = ({ data, tableId }) => {
        // const matchingItem = data.filter(item => primaryKey.indexOf(item.index) != -1)
        // const primaryKeyid = matchingItem.map(item => item.id)

        // for (let i = 0; i < foreignKeys.length; i++) {
        //     for (let j = 0; j < data.length; j++) {
        //         if (foreignKeys[i].index === data[j].index) {
        //             foreignKeys[i].field_id = data[j].id
        //         }
        //     }
        // }
        const KeyRequestBody = {
            table_id: getTableFields.id,
            primary_key: primaryKey,
            foreign_keys: foreignKeys
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
                showApiResponseMessage(status);
            });
    };



    const addField = (tableId) => {
        const fieldRequestBody = {
            table_id: getTableFields.id,
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
                console.log(data)
                if (success) {
                    addKey({ tableId, data });
                    // handleClickPrimary(fieldId);
                } else {
                    showApiResponseMessage(status);
                }
            });
    };

    const addKey = ({ data, tableId }) => {
        const matchingItem = data.filter(item => primaryKey.indexOf(item.index) != -1)
        const primaryKeyid = matchingItem.map(item => item.id)
        const newPrimaryKey = [...getTableFields.primary_key, ...primaryKeyid]

        for (let i = 0; i < foreignKeys.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (foreignKeys[i].index === data[j].index) {
                    foreignKeys[i].field_id = data[j].id
                }
            }
        }
        const newForeignKey = [...getTableFields.foreign_keys, ...foreignKeys]

        const KeyRequestBody = {
            table_id: getTableFields.id,
            primary_key: newPrimaryKey,
            foreign_keys: newForeignKey
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
                showApiResponseMessage(status);
            });
    };
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const rowsPerPageTable = 7;

    const indexOfLastTable = currentPageTable * rowsPerPageTable;
    const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    const currentTable = getTableFields.fields?.slice(indexOfFirstTable, indexOfLastTable);

    const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    const totalPagesTable = Math.ceil(getTableFields.fields?.length / rowsPerPageTable);




    const [currentPageFields, setCurrentPageFields] = useState(1);
    const rowsPerPageFields = 7;

    const indexOfLastFields = currentPageFields * rowsPerPageFields;
    const indexOfFirstFields = indexOfLastFields - rowsPerPageFields;
    const currentFields = tempFields?.slice(indexOfFirstFields, indexOfLastFields);

    const paginateFields = (pageNumber) => setCurrentPageFields(pageNumber);
    const totalPagesFields = Math.ceil(tempFields?.length / rowsPerPageFields);


    // console.log(tempFields)
    console.log(primaryKey)
    console.log(foreignKeys)
    // console.log("FK", getTableFields.foreign_keys)

    // console.log(getTableFields.fields)
    // console.log(getTableFields.primary_key)
    console.log(tempFields)
    console.log(fieldNew)
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
                                    <h5><a onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-3"></i></a>Chỉnh sửa bảng</h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-4">
                                        <label class="font-weight-bold">Tên bảng <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={getTableFields.table_name}
                                            onChange={(e) => setTableFields({ ...getTableFields, table_name: e.target.value })}
                                            readOnly
                                        />
                                    </div>
                                    {/* Field */}
                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">{lang["list fields"]}</p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addField">
                                                <i class="fa fa-plus"></i>
                                            </button>
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
                                                                        <td scope="row">{index + 1}</td>
                                                                        <td class="align-center"> {primaryKey.includes(field.id) ? <img src="/images/icon/p-key.png" width={14} alt="Key" /> : null}
                                                                            {foreignKeys.some((fk) => fk.field_id === field.id) && (
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
                                                                        <td>{field.props.DATATYPE}</td>
                                                                        <td> {field.props.NULL ? (
                                                                            <span>Null</span>
                                                                        ) : (
                                                                            <span>Not null</span>
                                                                        )}
                                                                        </td>
                                                                        <td>{users.fullname}</td>
                                                                        <td>{field.create_at.toString()}</td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>
                                                                            <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => getIdField(field)} data-toggle="modal" data-target="#editField" title={lang["edit"]}></i>
                                                                            <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => deleteField(field)} title={lang["delete"]}></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p>{lang["show"]} {indexOfFirstTable + 1}-{Math.min(indexOfLastTable, getTableFields.fields?.length)} {lang["of"]} {getTableFields.fields?.length} {lang["results"]}</p>
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
                                                        <p>Chưa có trường</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {
                                            currentTable && currentTable.length > 0 ? (
                                                <div className="button-container mt-4">

                                                    <button type="button" onClick={updateTable} class="btn btn-success ">{lang["btn.update"]}</button>
                                                    <button type="button" onClick={() => navigate(-1)} class="btn btn-danger ">{lang["btn.close"]}</button>
                                                </div>) : null}
                                    </div>
                                    {/* field add */}
                                    {currentFields && currentFields.length > 0 ? (
                                        <div class="col-md-12 col-lg-12">
                                            <div class="d-flex align-items-center mb-1">
                                                <p class="font-weight-bold">{lang["list add fields"]} </p>
                                                {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addField">
                                                <i class="fa fa-plus"></i>
                                            </button> */}
                                            </div>
                                            <div class="table-responsive">
                                                {
                                                    currentFields && currentFields.length > 0 ? (
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
                                                                        <th class="font-weight-bold align-center" scope="col">{lang["time"]}</th>
                                                                        <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {currentFields.map((field, index) => (
                                                                        <tr key={field.id}>
                                                                            <td scope="row">{index + 1}</td>
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
                                                                                <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => getIdFieldTempNew(field)} data-toggle="modal" data-target="#editFieldTemp" title={lang["edit"]}></i>
                                                                                <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => deleteFieldTemp(field)} title={lang["delete"]}></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <p>{lang["show"]} {indexOfFirstFields + 1}-{Math.min(indexOfLastFields, tempFields?.length)} {lang["of"]} {tempFields?.length} {lang["results"]}</p>
                                                                <nav aria-label="Page navigation example">
                                                                    <ul className="pagination mb-0">
                                                                        <li className={`page-item ${currentPageFields === 1 ? 'disabled' : ''}`}>
                                                                            <button className="page-link" onClick={() => paginateFields(currentPageFields - 1)}>
                                                                                &laquo;
                                                                            </button>
                                                                        </li>
                                                                        {Array(totalPagesFields).fill().map((_, index) => (
                                                                            <li className={`page-item ${currentPageFields === index + 1 ? 'active' : ''}`}>
                                                                                <button className="page-link" onClick={() => paginateFields(index + 1)}>
                                                                                    {index + 1}
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                        <li className={`page-item ${currentPageFields === totalPagesFields ? 'disabled' : ''}`}>
                                                                            <button className="page-link" onClick={() => paginateFields(currentPageFields + 1)}>
                                                                                &raquo;
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </nav>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div class="list_cont ">
                                                            <p>Chưa có trường</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {
                                                currentFields && currentFields.length > 0 ? (
                                                    <div className="button-container mt-4">

                                                        <button type="button" onClick={addField} class="btn btn-success ">{lang["btn.addfield"]}</button>
                                                        <button type="button" onClick={handleDelete} class="btn btn-danger ">{lang["btn.cancel"]}</button>
                                                    </div>) : null}
                                        </div>
                                    ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* addd field temp */}
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
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
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
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    handleSelectTable(e);
                                                    setForeignKey({ ...foreignKey, table_id: e.target.value })
                                                }}
                                                disabled={!isOnforenkey}>
                                                <option value="">{lang["choose"]}</option>
                                                {tables.tables?.map((table, index) => {
                                                    return (
                                                        <option key={index} value={table.id}>
                                                            {table.table_name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" disabled={!isOnforenkey} onChange={(e) => {
                                                // console.log(e.target.value);
                                                setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                autoType(e.target.value) // ? type
                                            }}
                                            > <option value="">{lang["choose"]}</option>
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
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["null"]} </label>
                                            <select className="form-control" onChange={(e) => setModalTemp({ ...modalTemp, NULL: e.target.value == "true" ? true : false })}>
                                                <option value={false}>{lang["choose"]}</option>
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
                                            <label> {lang["datatype"]}</label>
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
                                                <option value="">{lang["choose"]}</option>
                                                {types.map((type, index) => (
                                                    <option key={index} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== modalTemp.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let defaultValue = modalTemp[prop.name];

                                                            if (inputType === "int") {
                                                                if (prop.name === 'MIN') defaultValue = type.limit.min;
                                                                if (prop.name === 'MAX') defaultValue = type.limit.max;
                                                            }

                                                            return (
                                                                <div key={index} className="form-group col-lg-12">
                                                                    <label>{prop.label} </label>
                                                                    {isBoolType ? (
                                                                        <select
                                                                            className="form-control"
                                                                            value={defaultValue}  // Sử dụng defaultValue thay vì value
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
                                                                            defaultValue={defaultValue}  // Sử dụng defaultValue thay vì value
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
                                            <label>{lang["creator"]} </label>
                                            <input class="form-control" type="text" value={users.fullname} readOnly />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["time"]}</label>
                                            <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly />
                                        </div>

                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleAddNewField} data-dismiss="modal" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editField">
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
                                            <label>{lang["fields name"]}<span className='red_star'>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={fieldTempUpdate.field_name}
                                                onChange={(e) => setFieldTempupdate({ ...fieldTempUpdate, field_name: e.target.value })} placeholder=""
                                            />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["pkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOn ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickPrimary}
                                            ></i>
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4 ">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOnforenkey ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickForenkey}
                                            ></i>
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    handleSelectTable(e);
                                                    setForeignKey({ ...foreignKey, table_id: e.target.value })
                                                }}
                                                disabled={!isOnforenkey}>
                                                <option value="">{lang["choose"]}</option>
                                                {tables.tables?.map((table, index) => {
                                                    const field_id = fieldTempUpdate.id;
                                                    const table_id = getTableFields.id;

                                                    const foreignKeys = getTableFields.foreign_keys ? getTableFields.foreign_keys : [];
                                                    const foreignKey = foreignKeys.find(key => key.field_id == field_id);
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
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control"
                                                disabled={!isOnforenkey}
                                                onChange={(e) => {
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                    autoType(e.target.value) // ? type
                                                }}
                                            >
                                                {
                                                    fields.filter(field => {
                                                        const selectedTableIdAsNumber = Number(selectedTableId);
                                                        const selectedTable = tables.tables.find(table => table.id === selectedTableIdAsNumber);
                                                        return selectedTable?.primary_key.includes(field.id);
                                                    }).map((field, index) => {

                                                        return (
                                                            <option>{lang["choose"]}</option>

                                                        );
                                                    })
                                                }
                                                {fields && fields.length > 0 && (

                                                    fields.filter(field => {
                                                        const selectedTableIdAsNumber = Number(selectedTableId);
                                                        const selectedTable = tables.tables.find(table => table.id === selectedTableIdAsNumber);
                                                        return selectedTable?.primary_key.includes(field.id);
                                                    }).map((field, index) => {
                                                        const field_id = fieldTempUpdate.id;

                                                        const foreignKeys = getTableFields.foreign_keys;
                                                        const foreignKey = foreignKeys.find(key => key.field_id == field_id);
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

                                        </div>
                                        {/* <div className={`form-group col-lg-6`}>
                                            <label>Tên trường <span className='red_star'>*</span></label>
                                            <select className="form-control" disabled={!isOnforenkey} onChange={(e) => {
                                                console.log(e.target.value);
                                                setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                autoType(e.target.value) // ? type
                                            }}
                                            > <option value="">Chọn trường</option>
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
                                        </div> */}
                                        <div class="form-group col-lg-12">
                                            <label>{lang["null"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={fieldTempUpdate.props?.NULL} onChange={(e) => setFieldTempupdate({ ...fieldTempUpdate, props: { ...fieldTempUpdate.props, NULL: e.target.value == "true" ? true : false } })}>

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
                                            <label>{lang["datatype"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={fieldTempUpdate.props?.DATATYPE}
                                                onChange={(e) => setFieldTempupdate({ ...fieldTempUpdate, props: { ...fieldTempUpdate.props, DATATYPE: e.target.value } })}
                                            >
                                                {types.map((type, index) => (
                                                    <option key={index} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== fieldTempUpdate.props?.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let defaultValue = fieldTempUpdate.props?.[prop.name];
                                                            if (inputType === "int") {
                                                                if (prop.name === 'MIN') defaultValue = fieldTempUpdate.props?.MIN;
                                                                if (prop.name === 'MAX') defaultValue = fieldTempUpdate.props?.MAX;
                                                            }
                                                            return (
                                                                <div key={index} className="form-group col-lg-12">
                                                                    <label>{prop.label} <span className='red_star'>*</span></label>
                                                                    {isBoolType ? (
                                                                        <select
                                                                            className="form-control"
                                                                            defaultValue={defaultValue}  // Sử dụng defaultValue thay vì value
                                                                            onChange={(e) => {

                                                                                setFieldTempupdate((prevModalTemp) => ({
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
                                                                            defaultValue={defaultValue}  // Sử dụng defaultValue thay vì value
                                                                            onChange={(e) => {
                                                                                setFieldTempupdate((prevModalTemp) => ({
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
                                            <label>{lang["time"]} <span className='red_star'>*</span></label>
                                            <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleUpdatetModal} data-dismiss="modal" class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Field temp */}
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
                                                value={fieldNew.field_name}
                                                onChange={(e) => setFieldNew({ ...fieldNew, field_name: e.target.value })}


                                                placeholder=""
                                            />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4">
                                            <label class="mr-2">{lang["pkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOn ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickPrimary}
                                            ></i>
                                        </div>
                                        <div class="form-group col-lg-12 d-flex align-items-center ml-4 ">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <i
                                                className={`fa fa-toggle-${isOnforenkey ? 'on icon-toggle' : 'off'} fa-2x`}
                                                aria-hidden="true"
                                                onClick={handleClickForenkey}
                                            ></i>
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["table name"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={foreignKeys.table_id}
                                                onChange={(e) => {
                                                    handleSelectTable(e);
                                                    setForeignKey({ ...foreignKey, table_id: e.target.value })
                                                }}
                                                disabled={!isOnforenkey}>

                                                {tables.tables?.map((table, index) => {
                                                    return (
                                                        <option key={index} value={table.id}>
                                                            {table.table_name}
                                                        </option>
                                                    );
                                                })}

                                            </select>
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>

                                            <select className="form-control"
                                                value={foreignKeys.ref_field_id}
                                                disabled={!isOnforenkey} onChange={(e) => {
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                }}
                                            >
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
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>{lang["null"]} <span className='red_star'>*</span></label>
                                            <select className="form-control" value={fieldNew.NULL} onChange={(e) => setFieldNew({ ...fieldNew, NULL: e.target.value == "true" ? true : false })}>

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
                                            <select
                                                className="form-control"
                                                value={fieldNew.DATATYPE}

                                                onChange={(e) => setFieldNew({ ...fieldNew, DATATYPE: e.target.value })}
                                            >

                                                {types.map((type, index) => (
                                                    <option key={index} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== fieldNew.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let defaultValue = fieldNew[prop.name];

                                                            if (inputType === "int") {
                                                                if (prop.name === 'MIN') defaultValue = fieldNew.MIN;
                                                                if (prop.name === 'MAX') defaultValue = fieldNew.MAX;
                                                            }

                                                            return (
                                                                <div key={index} className="form-group col-lg-12">
                                                                    <label>{prop.label} <span className='red_star'>*</span></label>
                                                                    {isBoolType ? (
                                                                        <select
                                                                            className="form-control"
                                                                            value={defaultValue}  // Sử dụng defaultValue thay vì value
                                                                            onChange={(e) => {
                                                                                setFieldNew((prevModalTemp) => ({
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
                                                                            value={defaultValue}  // Sử dụng defaultValue thay vì value
                                                                            onChange={(e) => {
                                                                                setFieldNew((prevModalTemp) => ({
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
                                <button type="button" onClick={handleUpdatetModalNewField} data-dismiss="modal" class="btn btn-success ">{lang["btn.update"]}</button>
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

