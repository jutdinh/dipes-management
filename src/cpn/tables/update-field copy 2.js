
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { formatDate } from '../../redux/configs/format-date';
import $ from "jquery"
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

    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser)

    const { project_id, version_id, table_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    let navigate = useNavigate();
    const [fieldTemp, setFieldTemp] = useState({});


    const [primaryFlicker, setPrimaryFlicker] = useState({
        on: false,
        foucs: false
    })

    const [foreignFlicker, setForeignFlicker] = useState({
        on: false,
        foucs: false
    })


    const [cascadeFlicker, setCascadeFlicker] = useState({
        on: false,
        foucs: false
    })



    const styles = {
        hiddenInput: {
            width: 1,
            opacity: 0
        }
    }

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
    const [tables, setTables] = useState([]);
    const { tempFields, newFields, tempCounter } = useSelector(state => state); // const tempFields = useSelector( state => state.tempFields );
    const dispatch = useDispatch();
    //forenkey
    const [isOnforenkey, setIsOnforenkey] = useState(false);
    const [foreignKey, setForeignKey] = useState({ field_id: null, table_id: null, ref_field_id: null });
    const [foreignKeys, setForeignKeys] = useState([]);
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
        setErrors({})
    };
    // console.log(tables)
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
    const [errors, setErrors] = useState({});

    const validate = () => {
        let temp = {};

        temp.field_name = fieldTempUpdate.field_name ? "" : lang["error.input"];
        temp.DATATYPE = fieldTempUpdate.DATATYPE ? "" : lang["error.input"];

        if (isOnforenkey) {
            if (!foreignKey.table_id) {
                temp.table_id = lang["error.select.table"];
            } else {
                temp.table_id = "";
            }

            if (!foreignKey.ref_field_id) {
                temp.ref_field_id = lang["error.select.field"];
            } else {
                temp.ref_field_id = "";
            }
        }

        setErrors({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const validateUpdate = () => {
        let temp = {};
        temp.field_name = fieldTempUpdate.field_name ? "" : lang["error.input"];
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

    const handleUpdatetModal = () => {
        if (validateUpdate()) {
            let newPrimaryKey = [...primaryKey];

            if (isOn) {
                if (!newPrimaryKey.includes(fieldTempUpdate.id)) {
                    newPrimaryKey.push(fieldTempUpdate.id);
                }
            } else {
                newPrimaryKey = newPrimaryKey.filter(index => index !== fieldTempUpdate.id);
            }
            setPrimaryKey(newPrimaryKey);

            setTableFields({ ...getTableFields, primary_key: newPrimaryKey })

            if (isOnforenkey) {
                // const updatedForeignKeys = foreignKeys.filter(foreignKey => foreignKey.field_id === fieldTempUpdate.id);
                const updatedForeignKeys = foreignKeys
                updatedForeignKeys.push({ ...foreignKey, field_id: fieldTempUpdate.id, cascade: isOnCascade });
                // console.log(updatedForeignKeys)
                setForeignKeys(updatedForeignKeys);
                setTableFields({ ...getTableFields, foreign_keys: updatedForeignKeys });
            } else {
                const updatedForeignKeys = foreignKeys
                setForeignKeys(updatedForeignKeys);
                setTableFields({ ...getTableFields, foreign_keys: updatedForeignKeys });
            }

            const newfIELDS = getTableFields.fields.map(field => {
                if (field.id == fieldTempUpdate.id) {
                    // Define the props fields that you want to move back into props
                    const propsFields = ["DATATYPE", "NULL", "LENGTH", "AUTO_INCREMENT", "MIN", "MAX", "FORMAT", "DECIMAL_PLACE", "DEFAULT", "DEFAULT_TRUE", "DEFAULT_FALSE"];
                    // Create a new props object
                    const newProps = {};
                    propsFields.forEach(field => {
                        if (fieldTempUpdate.hasOwnProperty(field)) {
                            newProps[field] = fieldTempUpdate[field];
                        }
                    });

                    // Return the new field object
                    return {
                        ...fieldTempUpdate,
                        props: newProps
                    }
                }
                return field;
            });

            setTableFields({ ...getTableFields, fields: newfIELDS });
            setIsOn(false);

            setModalTemp((prevModalTemp) => ({
                ...prevModalTemp,
                ...defaultValues,
            }));

            $("#closeEditField").click()
        }
    };

    const validateAddFieldTemp = () => {
        let temp = {};

        temp.field_name = modalTemp.field_name ? "" : lang["error.input"];
        temp.DATATYPE = modalTemp.DATATYPE ? "" : lang["error.input"];

        if (isOnforenkey) {
            if (!foreignKey.table_id) {
                temp.table_id = lang["error.select.table"];
            } else {
                temp.table_id = "";
            }

            if (!foreignKey.ref_field_id) {
                temp.ref_field_id = lang["error.select.field"];
            } else {
                temp.ref_field_id = "";
            }
        }

        setErrors({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const handleAddNewField = () => {
        if (validateAddFieldTemp()) {
            setFieldTemp({...modalTemp, index: tempCounter})
            const newPrimaryKey = [...getTableFields.primary_key];
            if (isOn) {
                setPrimaryKey([...newPrimaryKey, tempCounter])
            }

            if (isOnforenkey) {
                setForeignKeys([...foreignKeys, { ...foreignKey, index: tempCounter }])
            }

            setIsOn(false)
            setIsOnforenkey(false)
            setIsOnCascade(false)

            setPrimaryFlicker({ focus: false, on: false })
            setForeignFlicker({ focus: false, on: false })
            setCascadeFlicker({ focus: false, on: false })

            setForeignKey({ ...foreignKey, table_id: "", ref_field_id: "" });
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
            setModalTemp({...defaultValues});
            $("#closeAddFieldTemp").click()
        }
    };
    const validateUpdateFieldTemp = () => {
        let temp = {};

        temp.field_name = fieldNew.field_name ? "" : lang["error.input"];
        temp.DATATYPE = fieldNew.DATATYPE ? "" : lang["error.input"];

        if (isOnforenkey) {
            if (!foreignKey.table_id) {
                temp.table_id = lang["error.select.table"];
            } else {
                temp.table_id = "";
            }

            if (!foreignKey.ref_field_id) {
                temp.ref_field_id = lang["error.select.field"];
            } else {
                temp.ref_field_id = "";
            }
        }

        setErrors({
            ...temp
        });

        return Object.values(temp).every(x => x === "");
    }
    const handleUpdatetModalNewField = () => {
        if (validateUpdateFieldTemp()) {
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
        }
        $("#closeEditFieldTemp").click()


    };



    const [fieldTempUpdate, setFieldTempupdate] = useState(defaultValues);


console.log("FieldTemp", fieldTempUpdate)
    useEffect(() => {
        if (primaryKey.includes(fieldTempUpdate.id)) {
            setIsOn(true);
        }
        else {
            setIsOn(false);
        }
    }, [fieldTempUpdate]);
console.log(foreignKeys)
    useEffect(() => {

        if (foreignKeys.some((fk) => fk.field_id === fieldTempUpdate.id)) {
            setIsOnforenkey(true);
        }
        // else {
        //     setIsOnforenkey(false);
        // }
    }, [fieldTempUpdate]);



    const loadModalTemp = (fieldData) => {
        setModalTemp({
            ...defaultValues,
            ...fieldData
        });
    }

    // console.log(fieldTempUpdate)
    const getIdField = (fieldId) => {
        // console.log(fieldId)
        const updatedField = {
            ...fieldId,
            ...fieldId.props
        };

        delete updatedField.props;  // Xóa thuộc tính `props` không cần thiết

        setFieldTempupdate(updatedField);


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
    // console.log(fieldNew)
    const [fieldNewTemp, setFieldNewTemp] = useState([]);
    const getIdFieldTempNew = (fieldId) => {

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
        console.log(fieldTempUpdate)
        console.log(primaryKey)
        console.log(foreignKeys)
        console.log(getTableFields)
        let primaryOn = false

        if (primaryKey.includes(fieldTempUpdate.id)) {
            primaryOn = true            
        }

        if (getTableFields?.primary_key?.includes(fieldTempUpdate.id)) {
            primaryOn = true
        }

        if (primaryKey.includes(fieldTempUpdate.index)) {
            primaryOn = true
            
        }
        console.log(primaryOn)
        if( primaryOn ){            
            setPrimaryFlicker({ on: true, focus: true })
        }else{
            setPrimaryFlicker({ on: false, focus: false })
        }
        
        setIsOn(primaryOn)

    }, [ fieldTempUpdate ]);


    useEffect(() => {
        console.log(fieldNew)
        console.log(primaryKey)
        console.log(foreignKeys)
        console.log(getTableFields)
        let primaryOn = false

        if (primaryKey.includes(fieldNew.id)) {
            primaryOn = true            
        }

        if (getTableFields?.primary_key?.includes(fieldNew.id)) {
            primaryOn = true
        }

        if (primaryKey.includes(fieldNew.index)) {
            primaryOn = true
            
        }
        
        if( primaryOn ){            
            setPrimaryFlicker({ on: true, focus: true })
        }else{
            setPrimaryFlicker({ on: false, focus: false })
        }
        
        setIsOn(primaryOn)

    }, [ fieldNew ]);


    

    const deleteField = (fieldId) => {
        const requestBody = {
            table_id: table_id,
            field_ids: [fieldId.id],
            version_id
        };
        // console.log(requestBody)
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.field"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class',
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
                        // console.log(resp)
                        if (data.failFields?.length > 0) {
                            Swal.fire({
                                title: lang["alarm.alarm"],
                                text: lang["error.delete.pramry"],
                                icon: 'warning',
                                showConfirmButton: true,
                                customClass: {
                                    confirmButton: 'swal2-confirm my-confirm-button-class',
                                }
                            })
                            return;
                        }
                        else {
                            functions.showApiResponseMessage(status);
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
                    title: lang["success.title"],
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
        fetch(`${proxy}/db/tables/v/${version_id}/table/${table_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log("data", data)
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

    // console.log(getTableFields)
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
                        const filteredData = data.tables.filter(table => table.id !== parseInt(table_id));
                        setTables({ tables: filteredData });
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

        fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data } = resp;
                if (success) {
                    setFields(data);
                    // console.log(data)
                } else {
                    // Xử lý lỗi ở đây
                    // window.location = "/404-not-found"
                }
            });
    };
    // console.log(selectedTableId)
    const selectDefaultTable = (tableId) => {
        setSelectedTableId(tableId);
        fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}/fields`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data } = resp;
                if (success) {
                    setFields(data);
                    // console.log(data)
                } else {
                    // Xử lý lỗi ở đây
                    // window.location = "/404-not-found"
                }
            });
    }

    //primary
    const [isOn, setIsOn] = useState(false);
    const [primaryKey, setPrimaryKey] = useState([]);
console.log(primaryKey)

    const handleClickPrimary = () => {
        setIsOn(!isOn);
    };


    const handleClickForenkey = () => {
        if (isOnforenkey) {
            setIsOnforenkey(false);

        } else {
            setIsOnforenkey(true);

        }
    };


    const [isOnCascade, setIsOnCascade] = useState(false);
    const handleClickCascade = () => {
        if (isOnCascade) {
            setIsOnCascade(false);

        } else {
            setIsOnCascade(true);
        }
    };

    
    const autoType = (field_id) => {
        const field = fields.find(f => f.id == field_id);

        if (field) {
            // console.log(field)
            setFieldTempupdate({
                ...fieldTempUpdate, ...field.props
            });
        }

    }


    const autoTypeTemp = (field_id) => {
        const field = fields.find(f => f.id == field_id);

        if (field) {
            // console.log(field)
            setModalTemp({
                ...modalTemp, ...field.props
            });
            // console.log(modalTemp)

        }


    }
    const [tableUpdate, setUpdateTable] = useState([]);
    useEffect(() => {
        // console.log(tableUpdate);
    }, [tableUpdate]);
    // console.log(fieldTempUpdate)
    const updateTable = (e) => {
        e.preventDefault();
        const requestBody = {
            version_id,
            table_id: getTableFields.id,
            table_name: getTableFields.table_name,
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
                if (success) {
                    updateFields();
                } else {
                    functions.showApiResponseMessage(status);
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
            version_id,
            table_id: getTableFields.id,
            fields: hashedFields,
        };
        // console.log(requestBody)
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
                    // console.log(data)
                    updateKey(data);
                } else {
                    functions.showApiResponseMessage(status);
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
            version_id,
            table_id: getTableFields.id,
            primary_key: primaryKey,
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
                functions.showApiResponseMessage(status);
            });
    };



    const addField = (tableId) => {
        const fieldRequestBody = {
            version_id,
            table_id: getTableFields.id,
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
                    addKey({ tableId, data });
                    // handleClickPrimary(fieldId);
                } else {
                    // functions.showApiResponseMessage(status, false);
                }
            });
    };

    const addKey = ({ tableId, data }) => {
        const matchingItem = data.filter(item => primaryKey.indexOf(item.index) != -1)
        const primaryKeyid = matchingItem.map(item => item.id)
        const newPrimaryKey = [...getTableFields.primary_key, ...primaryKeyid]
        
        // console.log( foreignKeys )

        for (let i = 0; i < foreignKeys.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if( data[j].index != undefined ){
                    if (foreignKeys[i].index === data[j].index) {
                        foreignKeys[i].field_id = data[j].id
                    }
                }
            }
        }
   

        const KeyRequestBody = {
            version_id,
            table_id: getTableFields.id,
            primary_key: newPrimaryKey,
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
                // console.log(resp)
                functions.showApiResponseMessage(status);
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

    // console.log("p key", foreignKey)
    // console.log("f key", foreignKeys)
    // console.log(foreignKey)
    // console.log(tempFields)
    // console.log(primaryKey)
    // console.log(foreignKeys)
    // console.log("FK", getTableFields.foreign_keys)

    // console.log(getTableFields.fields)
    // console.log(getTableFields.primary_key)
    // console.log(tempFields)
    // console.log(fieldNew)
    // console.log(getTableFields)
    // console.log(isOnforenkey)



    const enterPrimaryTrigger = (e) => {
        if (e.keyCode == 13) {
            setPrimaryFlicker({ ...primaryFlicker, on: !primaryFlicker.on })
            handleClickPrimary()
        }
    }

    const primaryFlickerOnClick = (e) => {
        const newState = !primaryFlicker.on
        setPrimaryFlicker({ ...primaryFlicker, on: newState })
        handleClickPrimary()
    }

    const enterForeignTrigger = (e) => {
        if (e.keyCode == 13) {
            setForeignFlicker({ ...foreignFlicker, on: !foreignFlicker.on })
            handleClickForenkey()
        }
    }

    const foreignFlickerOnClick = (e) => {
        const newState = !foreignFlicker.on
        setForeignFlicker({ ...foreignFlicker, on: newState })
        handleClickForenkey()
    }

    const enterCascadeTrigger = (e) => {
        if (e.keyCode == 13) {
            setCascadeFlicker({ ...cascadeFlicker, on: !cascadeFlicker.on })
            handleClickCascade()
        }
    }

    const cascadeFlickerOnClick = (e) => {
        const newState = !cascadeFlicker.on
        setCascadeFlicker({ ...cascadeFlicker, on: newState })
        handleClickCascade()
    }

    const resetFlickers = () => {
        setPrimaryFlicker({ focus: false, on: false })
        setCascadeFlicker({ focus: false, on: false })
        setForeignFlicker({ focus: false, on: false })
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
                                    <h5><label class="pointer" onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["edit table"]}
                                    </label> </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-4">
                                        <label class="font-weight-bold">{lang["table name"]}  <span className='red_star'>*</span></label>
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
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto"
                                                onClick={ () => { resetFlickers() } }
                                                data-toggle="modal" data-target="#addField">
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
                                                                        <td>{field.props?.DATATYPE}</td>
                                                                        <td> {field.props?.NULL ? (
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
                                                        <p>{lang["not found"]}</p>
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
                                                                            <td>
                                                                                {field.NULL ? (
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
                                            {errors.field_name && <p className="text-danger">{errors.field_name}</p>}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center">
                                            <label class="mr-2">{lang["pkey"]}</label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterPrimaryTrigger}
                                                    onFocus={() => { setPrimaryFlicker({ ...primaryFlicker, focus: true }) }}
                                                    onBlur={() => { setPrimaryFlicker({ ...primaryFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${primaryFlicker.on ? "flicker-on" : ""} ${primaryFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={primaryFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="form-group col-lg-6 d-flex align-items-center">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterForeignTrigger}
                                                    onFocus={() => { setForeignFlicker({ ...foreignFlicker, focus: true }) }}
                                                    onBlur={() => { setForeignFlicker({ ...foreignFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${foreignFlicker.on ? "flicker-on" : ""} ${foreignFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={foreignFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>




                                        <div class="form-group col-lg-6 d-flex align-items-center" style={{ opacity: `${isOnforenkey ? 1 : 0}` }}>

                                            <label class="mr-2">{lang["cascading"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterCascadeTrigger}
                                                    onFocus={() => { setCascadeFlicker({ ...cascadeFlicker, focus: true }) }}
                                                    onBlur={() => { setCascadeFlicker({ ...cascadeFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${cascadeFlicker.on ? "flicker-on" : ""} ${cascadeFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={cascadeFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
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
                                                    autoTypeTemp(e.target.value) // ? type
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
                                                {/* <option value={false}>{lang["choose"]}</option> */}
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
                                            <label> {lang["datatype"]} </label>
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
                                <button type="button" onClick={handleAddNewField} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddFieldTemp" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
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
                                            {errors.field_name && <p className="text-danger">{errors.field_name}</p>}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center">
                                            <label class="mr-2">{lang["pkey"]}</label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterPrimaryTrigger}
                                                    onFocus={() => { setPrimaryFlicker({ ...primaryFlicker, focus: true }) }}
                                                    onBlur={() => { setPrimaryFlicker({ ...primaryFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${primaryFlicker.on ? "flicker-on" : ""} ${primaryFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={primaryFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="form-group col-lg-6 d-flex align-items-center">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterForeignTrigger}
                                                    onFocus={() => { setForeignFlicker({ ...foreignFlicker, focus: true }) }}
                                                    onBlur={() => { setForeignFlicker({ ...foreignFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${foreignFlicker.on ? "flicker-on" : ""} ${foreignFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={foreignFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>




                                        <div class="form-group col-lg-6 d-flex align-items-center" style={{ opacity: `${isOnforenkey ? 1 : 0}` }}>

                                            <label class="mr-2">{lang["cascading"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterCascadeTrigger}
                                                    onFocus={() => { setCascadeFlicker({ ...cascadeFlicker, focus: true }) }}
                                                    onBlur={() => { setCascadeFlicker({ ...cascadeFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${cascadeFlicker.on ? "flicker-on" : ""} ${cascadeFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={cascadeFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
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
                                            {errors.table_id && <p className="text-danger">{errors.table_id}</p>}
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control"

                                                disabled={!isOnforenkey}
                                                onChange={(e) => {
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                   
                                                    autoType(e.target.value) // ? type
                                                }}
                                            > <option>{lang["choose"]}</option>

                                                {fields && fields.length > 0 && (

                                                    fields.filter(field => {
                                                        const selectedTableIdAsNumber = Number(selectedTableId);
                                                        const selectedTable = tables.tables.find(table => table.id === selectedTableIdAsNumber);
                                                        return selectedTable?.primary_key.includes(field.id);
                                                    }).map((field, index) => {
                                                        const field_id = fieldTempUpdate.id;

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
                                            {errors.ref_field_id && <p className="text-danger">{errors.ref_field_id}</p>}

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
                                            <select className="form-control" value={fieldTempUpdate.NULL} onChange={(e) => setFieldTempupdate({ ...fieldTempUpdate, NULL: e.target.value == "true" ? true : false })}>
                                                {typenull.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.value}>
                                                            {item.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>


                                        <div className={`form-group col-lg-12`}>
                                            <label>{lang["datatype"]} <span className='red_star'>*</span></label>
                                            <select
                                                className="form-control"
                                                value={fieldTempUpdate.DATATYPE}
                                                onChange={(e) => {
                                                    const selectedDataType = e.target.value;
                                                    const selectedType = types.find((type) => type.name === selectedDataType);
                                                    if (selectedType) {
                                                        setFieldTempupdate((prevFieldTempUpdate) => {
                                                            const updateValues = {
                                                                DATATYPE: selectedDataType,
                                                            };
                                                            if (selectedType.limit) {
                                                                const { min, max } = selectedType.limit;
                                                                updateValues.MIN = min !== undefined ? String(min) : prevFieldTempUpdate.MIN;
                                                                updateValues.MAX = max !== undefined ? String(max) : prevFieldTempUpdate.MAX;
                                                            }
                                                            if (selectedType.type === 'date' || selectedType.type === 'datetime') {
                                                                updateValues.FORMAT = selectedType.format;
                                                            }
                                                            return {
                                                                ...prevFieldTempUpdate,
                                                                ...updateValues,
                                                            };
                                                        });
                                                    } else {
                                                        setFieldTempupdate((prevFieldTempUpdate) => ({
                                                            ...prevFieldTempUpdate,
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
                                        <div className="form-group col-lg-12 ml-2">
                                            {types.map((type) => {
                                                if (type.name !== fieldTempUpdate.DATATYPE) return null;

                                                return (
                                                    <div key={type.id}>
                                                        {type.props.map((prop, index) => {
                                                            let inputType = prop.type;
                                                            let isBoolType = prop.type === "bool";
                                                            let value = fieldTempUpdate[prop.name];

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
                                                                                setFieldTempupdate((prevFieldTempUpdate) => ({
                                                                                    ...prevFieldTempUpdate,
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
                                                                                setFieldTempupdate((prevFieldTempUpdate) => ({
                                                                                    ...prevFieldTempUpdate,
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
                                <button type="button" onClick={handleUpdatetModal} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditField" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
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
                                            {errors.field_name && <p className="text-danger">{errors.field_name}</p>}
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>{lang["key"]} <span className='red_star'>*</span></label>
                                        </div>
                                        <div class="form-group col-lg-6"></div>
                                        <div class="form-group col-lg-12 d-flex align-items-center">
                                            <label class="mr-2">{lang["pkey"]}</label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterPrimaryTrigger}
                                                    onFocus={() => { setPrimaryFlicker({ ...primaryFlicker, focus: true }) }}
                                                    onBlur={() => { setPrimaryFlicker({ ...primaryFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${primaryFlicker.on ? "flicker-on" : ""} ${primaryFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={primaryFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="form-group col-lg-6 d-flex align-items-center">
                                            <label class="mr-2">{lang["fkey"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterForeignTrigger}
                                                    onFocus={() => { setForeignFlicker({ ...foreignFlicker, focus: true }) }}
                                                    onBlur={() => { setForeignFlicker({ ...foreignFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${foreignFlicker.on ? "flicker-on" : ""} ${foreignFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={foreignFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>




                                        <div class="form-group col-lg-6 d-flex align-items-center" style={{ opacity: `${isOnforenkey ? 1 : 0}` }}>

                                            <label class="mr-2">{lang["cascading"]} </label>
                                            <div className="flicker-container">
                                                <input type="text" style={styles.hiddenInput}
                                                    onKeyUp={enterCascadeTrigger}
                                                    onFocus={() => { setCascadeFlicker({ ...cascadeFlicker, focus: true }) }}
                                                    onBlur={() => { setCascadeFlicker({ ...cascadeFlicker, focus: false }) }}
                                                />
                                                <div
                                                    className={`flicker ${cascadeFlicker.on ? "flicker-on" : ""} ${cascadeFlicker.focus ? "flicker-focus" : ""} `}
                                                    onClick={cascadeFlickerOnClick}
                                                >
                                                    <div className="thumb">
                                                        <div className="bar" />
                                                    </div>
                                                </div>
                                            </div>
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
                                                    const field_id = fieldTempUpdate.id;

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
                                            {errors.table_id && <p className="text-danger">{errors.table_id}</p>}
                                        </div>
                                        <div className={`form-group col-lg-6`}>
                                            <label>{lang["fields name"]} <span className='red_star'>*</span></label>
                                            <select className="form-control"

                                                disabled={!isOnforenkey}
                                                onChange={(e) => {
                                                    setForeignKey({ ...foreignKey, ref_field_id: e.target.value });
                                                    if (e.target.value !== "") {
                                                        setErrors({ ...errors, ref_field_id: "" }); // Xóa thông báo lỗi
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
                                                        const field_id = fieldTempUpdate.id;

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
                                            {errors.ref_field_id && <p className="text-danger">{errors.ref_field_id}</p>}

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
                                            {errors.DATATYPE && <p className="text-danger">{errors.DATATYPE}</p>}
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
                                <button type="button" onClick={handleUpdatetModalNewField} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditFieldTemp" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
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
