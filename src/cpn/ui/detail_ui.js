
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Layout2 from './view_layout2'
import Layout1 from './view_layout1'
import responseMessages from "../enum/response-code";
import { formatDate } from "../../redux/configs/format-date";
import { fi } from "date-fns/locale";

export default () => {

    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id, ui_id } = useParams();
    let navigate = useNavigate();
    const storedProjectId = localStorage.getItem('project_id');
    const back = () => {
        navigate(`/projects/${version_id}/uis`);
    };
    const [apis, setApis] = useState([]);
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
                        setApis(data.apis);

                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    const [uis, setUis] = useState([]);
    // console.log("api", apis.slice(0, 2))

    useEffect(() => {
        fetch(`${proxy}/uis/v/${version_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                const matchedUi = data.uis.find(ui => ui.ui_id.toString() === ui_id);
                if (matchedUi) {
                    setUis(matchedUi);
                    setDetailUi(matchedUi)
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    const [filteredApis, setFilteredApis] = useState([])
    useEffect(() => {
        if (uis.components && Array.isArray(uis.components)) {
            let uiApiUrls = [];
            uis.components.forEach(component => {
                // Dùng mảng các chuỗi API để kiểm tra
                ['api_get', 'api_post', 'api_put', 'api_delete', 'api_search', 'api_export', 'api_import'].forEach(apiKey => {
                    if (component[apiKey]) {
                        uiApiUrls.push(component[apiKey]);
                    }
                });
            });
    
    
            let filteredApis = apis.filter(api => uiApiUrls.includes(api.url));
            setFilteredApis(filteredApis)
    
            // console.log(filteredApis);
        } 
    }, [uis,apis])

   
   


    const [detailUi, setDetailUi] = useState({});
    const [layout, setLayout] = useState({});
    const [fieldShow, setFieldShow] = useState({});
    const [fieldCalculates, setFieldCalculates] = useState({});

    useEffect(() => {
        if (uis && uis.components) {
            setDetailUi(uis);
            const firstComponentLayoutId = uis.components[Object.keys(uis.components)[0]].layout_id;
            const fields = uis.components[Object.keys(uis.components)[0]].fields;
            const fieldCalculates = [];
            const fieldShow = [];

            fields.forEach(item => {
                if (item.hasOwnProperty('fomular')) {
                    fieldCalculates.push(item);
                } else {
                    fieldShow.push(item);
                }
            });

            setLayout(firstComponentLayoutId);
            setFieldShow(fieldShow);
            setFieldCalculates(fieldCalculates);
        }
    }, [uis]);
    // console.log(detailUi)
    const [currentPageApi, setCurrentPageApi] = useState(1);
    const rowsPerPageApi = 12;
    const indexOfLastApi = currentPageApi * rowsPerPageApi;
    const indexOfFirstApi = indexOfLastApi - rowsPerPageApi;
    const currentApiPage = filteredApis.slice(indexOfFirstApi, indexOfLastApi);

    const paginateApi = (pageNumber) => setCurrentPageApi(pageNumber);
    const totalPagesApi = Math.ceil(filteredApis.length / rowsPerPageApi);
    const updateApi = (apiData) => {
        // console.log(apiData)
        window.location.href = `/projects/${version_id}/apis/update/${apiData.api_id}`;
        // window.location.href = `tables`;
    };
    const handleUpdateStatus = (apiid) => {
        // console.log("api", apiid)
        const newStatus = !apiid.status;
        const requestBody = {
            version_id: version_id,
            api: { ...apiid, status: newStatus }
        };

        // console.log(requestBody)
        fetch(`${proxy}/apis/api`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content, data, status } = resp;
                if (success) {
                    functions.showApiResponseMessage(status);
                } else {
                    functions.showApiResponseMessage(status);
                }
            });


    }
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
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>
                                        {lang["manage ui"]} </label>
                                        <i class="fa fa-chevron-right mr-2 ml-2" aria-hidden="true"></i>
                                        {lang["detail ui"]}
                                    </h5>
                                </div>
                                {/* <div class="ml-auto" onClick={downloadAPI}>
                        <i class="fa fa-download icon-ui"></i>
                    </div> */}
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-6 ">
                                        <label class="font-weight-bold">{lang["name page"]}</label>
                                        <span className="d-block"> {detailUi?.title} </span>
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold"><b>URL</b></label>
                                        <span className="d-block"> {detailUi?.url} </span>
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold"><b>{lang["projectstatus"]}</b></label>
                                        <span className="d-block"> {detailUi?.status ? "On" : "Off"} </span>
                                    </div>
                                    {/* <div class="form-group col-lg-6">
                                            <label><b>{lang["log.type"]}</b></label>
                                            <span className="d-block"> {detailUi.type === "ui" ? lang["api auto"] : lang["api custom"]} </span>
                                        </div> */}
                                    <div class="form-group col-lg-6">
                                        <label class="font-weight-bold"><b>{lang["creator"]}</b></label>
                                        <span className="d-block"> {detailUi?.create_by?.fullname} </span>
                                    </div>
                                    {/* <div class="form-group col-lg-6">
                                        <label class="font-weight-bold"><b>{lang["time"]}</b></label>
                                        <span className="d-block"> {formatDate(detailUi?.create_at)} </span>
                                    </div> */}
                                    <div class="form-group col-md-12">
                                        <label class="font-weight-bold"><b>{lang["preview"]}</b></label>
                                        {layout === 0 && <Layout1 fields={fieldShow} calculate={fieldCalculates} />}
                                        {layout === 1 && <Layout2 fields={fieldShow} calculate={fieldCalculates} />}

                                        {/* {layout === 0 && <Layout1 fields={fields}/>}
                                            {layout === 1 && <Layout2 fields={fields} />} */}

                                    </div>
                                    <div class="form-group col-md-12">
                                        <label class="font-weight-bold"><b>{lang["list of api"]}</b></label>
                                        {
                                            currentApiPage && currentApiPage.length > 0 ? (
                                                <>
                                                    <div class="table-responsive">
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th class="font-weight-bold">{lang["log.no"]}</th>
                                                                    <th class="font-weight-bold">{lang["method"]}</th>
                                                                    <th class="font-weight-bold">{lang["api name"]}</th>
                                                                    {/* <th class="font-weight-bold">Phạm vi</th> */}
                                                                    <th class="font-weight-bold">{lang["creator"]}</th>
                                                                    <th class="font-weight-bold">{lang["time"]}</th>
                                                                    <th class="font-weight-bold align-center">{lang["projectstatus"]}</th>
                                                                    <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentApiPage.map((api, index) => (
                                                                    <tr key={index}>
                                                                        <td>{indexOfFirstApi + index + 1}</td>
                                                                        <td style={{ textTransform: 'uppercase' }}>{api.api_method}</td>
                                                                        <td>{api.api_name}</td>
                                                                        {/* <td>{api.api_scope}</td> */}
                                                                        <td>{api.create_by?.fullname}</td>
                                                                        <td>{formatDate(api.create_at)}</td>
                                                                        <td class="font-weight-bold align-center">
                                                                            <select className="form-control" onChange={() => handleUpdateStatus(api)}>
                                                                                <option value={true} selected={api.status} style={{ color: 'green' }}>On</option>
                                                                                <option value={false} selected={!api.status} style={{ color: 'red' }}>Off</option>
                                                                            </select>
                                                                        </td>
                                                                        <td class="align-center" style={{ minWidth: "130px" }}>
                                                                            {/* {api.status ?
                                                                            <i class="fa fa-times-circle-o size pointer icon-margin icon-check" onClick={() => handleUpdateStatus(api)} title={lang["updatestatus"]}></i>
                                                                            : <i class="fa fa-check-circle-o size pointer icon-margin icon-close" onClick={() => handleUpdateStatus(api)} title={lang["updatestatus"]}></i>
                                                                        } */}
                                                                        {api.api_method=== ''}
                                                                            <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => updateApi(api)} title={lang["edit"]}></i>
                                                                            {/* <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteApi(api)} title={lang["delete"]}></i> */}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>
                                                            {lang["show"]} {indexOfFirstApi + 1}-{Math.min(indexOfFirstApi + currentApiPage.length, filteredApis.length)} {lang["of"]} {filteredApis.length} {lang["results"]}
                                                        </p>
                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination mb-0">
                                                                {/* Nút đến trang đầu */}
                                                                <li className={`page-item ${currentPageApi === 1 ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(1)}>
                                                                        &#8810;
                                                                    </button>
                                                                </li>
                                                                <li className={`page-item ${currentPageApi === 1 ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(Math.max(1, currentPageApi - 1))}>
                                                                        &laquo;
                                                                    </button>
                                                                </li>
                                                                {currentPageApi > 2 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                {Array(totalPagesApi).fill().map((_, index) => {
                                                                    if (
                                                                        index + 1 === currentPageApi ||
                                                                        (index + 1 >= currentPageApi - 1 && index + 1 <= currentPageApi + 1)
                                                                    ) {
                                                                        return (
                                                                            <li key={index} className={`page-item ${currentPageApi === index + 1 ? 'active' : ''}`}>
                                                                                <button className="page-link" onClick={() => paginateApi(index + 1)}>
                                                                                    {index + 1}
                                                                                </button>
                                                                            </li>
                                                                        );
                                                                    }
                                                                    return null;  // Đảm bảo trả về null nếu không có gì được hiển thị
                                                                })}
                                                                {currentPageApi < totalPagesApi - 1 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                <li className={`page-item ${currentPageApi === totalPagesApi ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(Math.min(totalPagesApi, currentPageApi + 1))}>
                                                                        &raquo;
                                                                    </button>
                                                                </li>
                                                                {/* Nút đến trang cuối */}
                                                                <li className={`page-item ${currentPageApi === totalPagesApi ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(totalPagesApi)}>
                                                                        &#8811;
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

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

