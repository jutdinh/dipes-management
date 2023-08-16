
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Layout2 from './view_layout2'
import Layout1 from './view_layout1'
import responseMessages from "../enum/response-code";
import { Navbar, Topbar } from '../navbar';
import ui from "./ui";
import $ from 'jquery'
import { formatDate } from "../../redux/configs/format-date";
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

    const [layout, setLayout] = useState(0); // Default is Layout 1

    const handleClickLayout = (layoutNumber) => {
        setLayout(layoutNumber);
    }

    const defaultValues = {
        title: "",
        status: true,
        layout_id: 0,
        parmas: [],
        tables: [],
        statistic_fields: [],
        calculates: []
    };

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
    const [modalTemp, setModalTemp] = useState(defaultValues);/////tạo api
    const [errorUi, setErrorUi] = useState({});
    const validateUiname = () => {
        let temp = {};
        temp.title = modalTemp.title ? "" : lang["error.input"];
        temp.tables = tables && tables.length > 0 ? "" : lang["error.input"];
        setErrorUi({
            ...temp
        });
        return Object.values(temp).every(x => x === "");
    }
    // const handleSubmitModal = () => {
    //     if (validateApiname()) {
    //         setModalTemp(prevModalTemp => ({ ...prevModalTemp, api_method: apiMethod }));

    //         dispatch({
    //             branch: "api",
    //             type: "addFieldParam",
    //             payload: {
    //                 field: { ...modalTemp }

    //             }
    //         })
    //     }
    // }
    // useEffect(() => {
    //     if (tempFieldParam && Object.keys(tempFieldParam).length > 0) {
    //         addUI();
    //     }
    // }, [tempFieldParam]);
    const addUI = () => {
        if (validateUiname()) {

            modalTemp.statistic_fields.map( field => {
                field.group_by = field.group_by.map( group => group.fomular_alias )
            })

            const requestBody = {
                version_id: parseInt(version_id),
                ui: {
                    title: modalTemp.title,
                    status: modalTemp.status,
                },
                widget: {
                    table_id: modalTemp.tables,
                    layout_id: modalTemp.layout_id,
                    statistic: modalTemp.statistic_fields,
                    calculates: modalTemp.calculates
                },
            }
            console.log(requestBody)
            fetch(`${proxy}/uis/ui`, {
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
        }
    };

    const [errorTable, setErrorTable] = useState({});
    const validateTable = () => {
        let temp = {};
        temp.selectedTables = selectedTables ? "" : lang["error.input"];
        setErrorTable({
            ...temp
        });
        return Object.values(temp).every(x => x === "");
    }
    const [getAllField, setAllField] = useState([]);
    const [fields, setFields] = useState([])
    

    const handleSubmitTables = () => {
        if (validateTable()) {
            setModalTemp(prevModalTemp => ({
                ...prevModalTemp,
                tables: selectedTables,
            }));

            if (selectedTables) {
                fetch(`${proxy}/db/tables/v/${version_id}/table/${selectedTables}`, {
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
                                setFields(data.fields)
                            }
                        } else {
                            // window.location = "/404-not-found"
                        }
                    })
            }
        }

    };

    // console.log(getAllField)

    const [allTable, setAllTable] = useState([]);

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
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])

    const [selectedTables, setSelectedTables] = useState(null);
    //  hiển thị các tường của bảng được chọn
    const [tables, setTables] = useState([]);
    // console.log("table", tables)
    useEffect(() => {
        const fetchTable = (tableId) => {
            return fetch(`${proxy}/db/tables/v/${version_id}/table/${tableId}`, {
                headers: {
                    Authorization: _token
                }
            }).then(res => res.json());
        };

        if (modalTemp.tables) {
            fetchTable(modalTemp.tables)
                .then(response => {
                    const tableName = response.success ? response.data : 'unknown';
                    setTables([tableName]);
                });
        }

    }, [modalTemp.tables]);

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
    }, [modalTemp.tables]);

    //console.log(selectedFields)
    //delete selected table 
    const [display_name, setDisplayname] = useState("");
    const [fomular, setFomular] = useState("");
    const [calculates, setCalculates] = useState([]);
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
    const [groupBy, setGroupBy] = useState([])

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

    const addOrRemoveGroupByField = ( id ) => {
        const corespondingGroupByField = groupBy.find( f => f.id == id )
        let newGroupBy;
        if( corespondingGroupByField ){
            newGroupBy = groupBy.filter( f => f.id != id )
        }else{
            const field = fields.find( f => f.id == id )
            if( field ){
                newGroupBy = [...groupBy, field]
            }
        }
        setGroupBy(newGroupBy)
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
        // console.log(cal)
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

    // // Khi calculatesUpdate thay đổi, cập nhật mảng calculates
    // useEffect(() => {
    //     if (calculatesUpdate.fomular_alias) {
    //         submitupdateFieldCalculates();
    //     }
    // }, [calculatesUpdate]);
    // console.log(calculatesUpdate)
    // console.log(modalTemp.calculates.display_name)

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

    const [statistical, setStatistical] = useState([]);
    const handleSubmitFieldStatistical = async (event) => {
        event.preventDefault();
        if (validateStatistical()) {
            const fomular_alias = await generateUniqueFormularAlias(display_name);
            const newStatistical = { fomular_alias, display_name, field, fomular, group_by: groupBy };
            // Cập nhật modalTemp
            setModalTemp(prev => ({
                ...prev,
                statistic_fields: [...prev.statistic_fields, newStatistical]
            }));
            setStatistical([...statistical, newStatistical])
            setDisplayname("");
            setField("");
            setFomular("");
            setGroupBy([])
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
        setGroupBy( sta.group_by )
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
            const updatedStatistical = modalTemp.statistic_fields.map(item =>
                item.fomular_alias === statisticalUpdate.fomular_alias ?{ ...statisticalUpdate, group_by: groupBy } : item
            );
            setGroupBy([])
            setModalTemp(prev => ({
                ...prev,
                statistic_fields: updatedStatistical
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

    const handleDeleteStatistical = (sta) => {
        // console.log(sta)

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
                const newCalculates = modalTemp.statistic_fields.filter(item => item.fomular_alias !== sta.fomular_alias);
                setModalTemp(prev => ({
                    ...prev,
                    statistic_fields: newCalculates
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
    const vietnameseChars = [
        {
            base: {
                base: "a",
                unicode: ["ă", "â"],
                unicodeWithSound: ["á", "à", "ả", "ã", "ạ", "ắ", "ằ", "ẳ", "ẵ", "ặ", "ấ", "ầ", "ẩ", "ẫ", "ậ"],
            }
        },
        {
            base: {
                base: "d",
                unicode: ["đ"],
                unicodeWithSound: []
            }
        },
        {
            base: {
                base: "e",
                unicode: ["ê"],
                unicodeWithSound: ["é", "è", "ẻ", "ẽ", "ẹ", "ế", "ề", "ể", "ễ", "ệ"]
            }
        },
        {
            base: {
                base: "i",
                unicode: [],
                unicodeWithSound: ["í", "ì", "ỉ", "ĩ", "ị"]
            }
        },
        {
            base: {
                base: "o",
                unicode: ["ô", "ơ"],
                unicodeWithSound: ["ó", "ò", "ỏ", "õ", "ọ", "ố", "ồ", "ổ", "ỗ", "ộ", "ớ", "ờ", "ở", "ỡ", "ợ"]
            }
        },
        {
            base: {
                base: "u",
                unicode: ["ư"],
                unicodeWithSound: ["ú", "ù", "ủ", "ũ", "ụ", "ứ", "ử", "ử", "ữ", "ự"]
            }
        },
        {
            base: {
                base: "y",
                unicode: [],
                unicodeWithSound: ["ý", "ỳ", "ỷ", "ỹ", "ỵ"]
            }
        }
    ];
    function removeVietnameseTones(str) {
        vietnameseChars.forEach(char => {
            const { base, unicode, unicodeWithSound } = char.base;
            const allVariants = [...unicode, ...unicodeWithSound];
            allVariants.forEach(variant => {
                const regex = new RegExp(variant, 'g');
                str = str.replace(regex, base);
            });
        });
        return str;
    }

    const handleCloseModal = () => {
        setErrorStatistical({});
        // console.log(errorStatistical)
        setErrorCaculates({})
        // console.log(errorCaculates)
    };
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["manage ui"]}</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5><label onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["create ui"]}
                                    </label> </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold">{lang["ui.title"]}<span className='red_star ml-1'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={modalTemp.title}
                                            onChange={(e) => setModalTemp({ ...modalTemp, title: e.target.value })}
                                            placeholder=""
                                        />
                                        {errorUi.title && <p className="text-danger">{errorUi.title}</p>}
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold">URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={"/" + removeVietnameseTones(modalTemp.title.toLowerCase()).replace(/\s/g, '-').toLowerCase()} readOnly
                                        />
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label class="font-weight-bold">Layout</label>
                                            {modalTemp.layout_id == 0 ?
                                                <i class="fa fa-eye size pointer icon-margin icon-view ml-2 ml-auto" onClick={() => handleClickLayout(0)} data-toggle="modal" data-target="#preview"></i>
                                                :
                                                <i class="fa fa-eye size pointer icon-margin icon-view ml-2 ml-auto" onClick={() => handleClickLayout(1)} data-toggle="modal" data-target="#preview"></i>
                                            }
                                        </div>
                                        <select
                                            className="form-control mb-3"
                                            value={modalTemp.layout_id}
                                            onChange={(e) => setModalTemp({ ...modalTemp, layout_id: e.target.value })}
                                        >
                                            <option value={0}>Layout 1</option>
                                            <option value={1}>Layout 2</option>
                                        </select>
                                    </div>
                                    {/* Chọn các bảng */}
                                    <div class="col-md-12 col-lg-12 bordered mb-3">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">{lang["selected table"]} <span className='red_star'> *</span> </p>
                                            {errorUi.tables && <p className="text-danger">{(errorUi.tables)}</p>}
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

                                                                    <th class="font-weight-bold" scope="col">{lang["table name"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["creator"]}</th>
                                                                    <th class="font-weight-bold" scope="col">{lang["time"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tables.map((table, index) => (
                                                                    <tr key={index}>
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
                                                        <p>Chưa có dữ liệu bảng</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {
                                        tables && tables.length > 0 ? (
                                            <>
                                                {/* Chọn trường tính toán */}
                                                <div class="col-md-12 col-lg-12 bordered mb-3">
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
                                                                    {modalTemp.calculates.map((calculate, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{calculate.display_name}</td>
                                                                            <td>{calculate.fomular_alias}</td>
                                                                            <td>{calculate.fomular}</td>
                                                                            <td class="align-center " style={{ minWidth: "130px" }}>
                                                                                <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => updateFieldCalculates(calculate)} data-toggle="modal" data-target="#editCalculates" title={lang["edit"]}></i>
                                                                                <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteCalculates(calculate)} title={lang["delete"]}></i>
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
                                                {/* Chọn trường thống kê */}
                                                <div class="col-md-12 col-lg-12 bordered mb-3">
                                                    <div class="d-flex align-items-center mb-1">
                                                        <p class="font-weight-bold">{lang["statistical fields"]}</p>
                                                        <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldStatistical">
                                                            <i class="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div class="table-responsive">
                                                        {modalTemp.statistic_fields && modalTemp.statistic_fields.length > 0 ? (
                                                            <table class="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                        <th class="font-weight-bold">{lang["fields name"]}</th>
                                                                        <th class="font-weight-bold">{lang["fields name statis"]}</th>
                                                                        <th class="font-weight-bold">{lang["group by"]}</th>
                                                                        <th class="font-weight-bold">{lang["fomular"]}</th>
                                                                        <th class="font-weight-bold align-center">{lang["log.action"]}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {modalTemp.statistic_fields.map((statistic, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{statistic.display_name}</td>
                                                                            <td>{statistic.field}</td>
                                                                            <td>{statistic.group_by?.map( field => field.field_name ).join(", ")}</td>
                                                                            <td>{statistic.fomular}</td>
                                                                            <td class="align-center" style={{ minWidth: "130px" }}>
                                                                                <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => updateFieldStatistical(statistic)} data-toggle="modal" data-target="#editFieldStatistical" title={lang["edit"]}></i>
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
                                            </>
                                        ) : (
                                            null
                                        )
                                    }
                                    {tables && tables.length > 0 ? (
                                        <div className="mt-2 d-flex justify-content-end ml-auto">
                                            {modalTemp.layout_id == 0 ?
                                                <button type="button" onClick={() => handleClickLayout(0)} class="btn btn-primary mr-2" data-toggle="modal" data-target="#preview">{lang["preview layout"]}</button>
                                                :
                                                <button type="button" onClick={() => handleClickLayout(1)} class="btn btn-primary mr-2" data-toggle="modal" data-target="#preview">{lang["preview layout"]}</button>
                                            }
                                            <button type="button" onClick={addUI} class="btn btn-success mr-2">{lang["btn.create"]}</button>
                                            <button type="button" onClick={() => navigate(-1)} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}
                                            </button>
                                        </div>
                                    ) : null
                                    }
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
                                        <select className="form-control"
                                            value={selectedTables}
                                            onChange={(e) => setSelectedTables(parseInt(e.target.value, 10))}>
                                            <option value="">{lang["choose"]}</option>
                                            {allTable.map(table => (
                                                <option key={table.id} value={table.id}>
                                                    {table.table_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errorTable.selectedTables && <p className="text-danger">{errorTable.selectedTables}</p>}
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
                                    <div class="form-group col-md-12">
                                        <label>{lang["fields tables"]} < p class="font-weight-bold">{getAllField.table_name}</p> </label>
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th class="font-weight-bold">{lang["log.no"]}</th>
                                                        <th class="font-weight-bold">{lang["fields name"]}</th>
                                                        <th class="font-weight-bold">{lang["alias"]}</th>
                                                        <th class="font-weight-bold">{lang["datatype"]}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getAllField.fields?.map((field, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{field.field_name}</td>
                                                            <td>{field.fomular_alias}</td>
                                                            <td>{field.props.DATATYPE}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <label>< p class="font-weight-bold">{lang["calculated fields"]}</p></label>
                                        <div class="table-responsive">
                                            {calculates && calculates.length > 0 ? (
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
                                        <p class="font-weight-bold">
                                            {lang["group by"]} 
                                        </p>
                                        <select className="form-control" value={statisticalUpdate.field} onChange={ (e) => { addOrRemoveGroupByField(e.target.value) }  }>
                                            <option value="">{lang["select fields"]}</option>

                                            {fields.map((field, index) => (
                                                <option key={index} value={field.id}>
                                                    {field.field_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>


                                    <div class="form-group col-lg-12">                                        
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
                                                                { groupBy.map( (field, index) => 
                                                                    <tr key={`${index}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{field.field_name}</td>
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
                                    </div>

                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["select fields"]} <span className='red_star'>*</span></label>
                                        <select className="form-control" value={field} onChange={(e) => setField(e.target.value)}>
                                            <option value="">{lang["select fields"]}</option>
                                            {getAllField.fields?.map((field, index) => (
                                                <option key={index} value={field.fomular_alias}>
                                                    {field.field_name} - {field.fomular_alias}
                                                </option>
                                            ))}
                                            {calculates.map((calculate, index) => (
                                                <option key={`calculate-${index}`} value={calculate.fomular_alias}>
                                                    {calculate.display_name}  {calculate.fomular_alias}
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
                                            <option value="">{lang["select fomular"]}</option>
                                            <option value="SUM">SUM</option>
                                            <option value="AVERAGE">AVERAGE</option>
                                            <option value="COUNT">COUNT</option>
                                        </select>
                                        {errorStatistical.fomular && <p className="text-danger">{errorStatistical.fomular}</p>}
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["creator"]}</label>
                                        <input class="form-control" type="text" value={users.fullname} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label>{lang["time"]} </label>
                                        <input class="form-control" type="text" value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleSubmitFieldStatistical} class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" id="closeAddStatis" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*update Field statistical */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="editFieldStatistical">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["update statistics fields"]} </h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fields name statis"]} <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={statisticalUpdate.display_name}
                                            onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, display_name: e.target.value })}
                                            required
                                        />
                                        {errorStatistical.display_name && <p className="text-danger">{errorStatistical.display_name}</p>}
                                    </div>                                 

                                    <div class="form-group col-md-12">
                                        <label> < p class="font-weight-bold">{getAllField.table_name}</p> </label>
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th class="font-weight-bold">{lang["log.no"]}</th>
                                                        <th class="font-weight-bold">{lang["fields name"]}</th>
                                                        <th class="font-weight-bold">{lang["fomular"]}</th>
                                                        <th class="font-weight-bold">{lang["datatype"]}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getAllField.fields?.map((field, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{field.field_name}</td>
                                                            <td>{field.fomular_alias}</td>
                                                            <td>{field.props.DATATYPE}</td>

                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                    <div className={`form-group col-lg-12`}>
                                        <p class="font-weight-bold">
                                            {lang["group by"]} 
                                        </p>
                                        <select className="form-control" value={statisticalUpdate.field} onChange={ (e) => { addOrRemoveGroupByField(e.target.value) }  }>
                                            <option value="">{lang["select fields"]}</option>

                                            {fields.map((field, index) => (
                                                <option key={index} value={field.id}>
                                                    {field.field_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>


                                    <div class="form-group col-lg-12">                                        
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
                                                                { groupBy.map( (field, index) => 
                                                                    <tr key={`${index}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{field.field_name}</td>
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
                                    </div>

                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["select fields"]} <span className='red_star'>*</span></label>
                                        <select className="form-control" value={statisticalUpdate.field} onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, field: e.target.value })}>
                                            <option value="">{lang["select fields"]}</option>

                                            {getAllField.fields?.map((field, index) => (
                                                <option key={index} value={field.fomular_alias}>
                                                    {field.field_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errorStatistical.field && <p className="text-danger">{errorStatistical.field}</p>}
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>{lang["fomular"]}<span className='red_star'>*</span></label>
                                        <select
                                            className="form-control"
                                            value={statisticalUpdate.fomular}
                                            onChange={(e) => setStatisticalUpdate({ ...statisticalUpdate, fomular: e.target.value })}
                                            required
                                        >
                                            <option value="">{lang["fomular"]}</option>
                                            <option value="SUM">SUM</option>
                                            <option value="AVERAGE">AVERAGE</option>
                                            <option value="COUNT">COUNT</option>
                                        </select>
                                        {errorStatistical.fomular && <p className="text-danger">{errorStatistical.fomular}</p>}
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
                                <button type="button" onClick={submitupdateFieldStatistical} class="btn btn-success ">{lang["btn.update"]}</button>
                                <button type="button" id="closeEditStatis" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
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
                                        <label><p class="font-weight-bold">{lang["fields display"]}</p></label>
                                        <div class="table-responsive">

                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th class="font-weight-bold">{lang["log.no"]}</th>
                                                        <th class="font-weight-bold">{lang["fields name"]}</th>
                                                        <th class="font-weight-bold">{lang["fomular"]}</th>
                                                        <th class="font-weight-bold">{lang["datatype"]}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getAllField.fields?.map((field, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{field.field_name}</td>
                                                            <td>{field.fomular_alias}</td>
                                                            <td>{field.props.DATATYPE}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
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
                                        <div class="form-group col-md-12">
                                            <label>{lang["fields tables"]} < p class="font-weight-bold">{getAllField.table_name}</p> </label>
                                            <div class="table-responsive">
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th class="font-weight-bold">{lang["log.no"]}</th>
                                                            <th class="font-weight-bold">{lang["fields name"]}</th>
                                                            <th class="font-weight-bold">{lang["alias"]}</th>
                                                            <th class="font-weight-bold">{lang["datatype"]}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getAllField.fields?.map((field, index) =>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{field.field_name}</td>
                                                                <td>{field.fomular_alias}</td>
                                                                <td>{field.props.DATATYPE}</td>

                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
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
                {/*Preview */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="preview">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["preview"]}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="midde_cont">
                                        <>
                                            {layout === 0 && <Layout1 title={modalTemp.title} data={tables} calculate={modalTemp.calculates} statistic={modalTemp.statistic_fields} />}
                                            {layout === 1 && <Layout2 title={modalTemp.title} data={tables} calculate={modalTemp.calculates} statistic={modalTemp.statistic_fields} />}
                                        </>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">

                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

