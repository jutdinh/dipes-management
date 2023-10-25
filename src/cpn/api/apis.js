
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import XLSX from 'xlsx-js-style'
import Swal from 'sweetalert2';
import responseMessages from "../enum/response-code";
import { Tables } from ".";
import { formatDate } from "../../redux/configs/format-date";
export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    const storedProjectId = localStorage.getItem('project_id');
    let navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('myParam');
    const back = () => {
        navigate(`/projects/detail/${storedProjectId}`);
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
    // console.log(apis)

    const handleGetApi = (apiid) => {
        // console.log("api", apiid)
    }
    // console.log(apis);
    const downloadAPI = () => {
        // console.log(apis);

        const header = ["ID", "Tên API", "URL", "Phương thức", "Ngày tạo"];

        const reportData = apis.map(item => {
            return [
                item.api_id,
                item.api_name,
                item.cai_gi_cung_dc_het_tron_a, // cong.huynh đặt tên ????
                item.api_method,
                item.create_at,
            ];
        });
        const projectName = apis.project_name
        const now = new Date();
        const date = now.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const title = ["THÔNG TIN MÔ TẢ API"];
        const projectMasterInfo = [`Nhân viên xuất: ${auth.fullname}`];
        const datex = [`Ngày xuất: ${date}`];
        const formattedData = [
            title,
            projectMasterInfo,
            datex,
            header,
            ...reportData
        ];

        const ws = XLSX.utils.aoa_to_sheet(formattedData);

        const mergeTitle = { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } };
        const mergeInfo = { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }; // gộp hàng từ A2 đến D2
        const mareDate = { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } };
        // gộp hàng từ A1 đến D1
        ws["!merges"] = [mergeTitle, mergeInfo, mareDate];

        const titleStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "008000" } },
            alignment: { horizontal: "center", vertical: "center" },
        };
        const infoStyle = {
            alignment: { horizontal: "center", vertical: "center" },
        };
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "008000" } },
            alignment: { horizontal: "center", vertical: "center" },
        };

        // Thêm định dạng cho tiêu đề
        ws["A1"].s = titleStyle;

        // Thêm định dạng cho thông tin
        // ws["A2"].s = infoStyle;
        // ws["A3"].s = infoStyle;

        // Thêm định dạng cho header
        ws["A4"].s = headerStyle;
        ws["B4"].s = headerStyle;
        ws["C4"].s = headerStyle;
        ws["D4"].s = headerStyle;
        ws["E4"].s = headerStyle;

        ws["!cols"] = [{ width: 45 }, { width: 60 }, { width: 60 }, { width: 20 }, { width: 35 }, { width: 20 }, { width: 40 }];
        ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
        // Tạo một Workbook mới và thêm Worksheet vào Workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "APIs");

        // Ghi Workbook ra file Excel
        XLSX.writeFile(wb, "APIs.xlsx");
        XLSX.writeFile(wb, `API Description-${(new Date()).getTime()}.xlsx`);
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
    const handleDeleteApi = (apiid) => {
        // console.log(apiid)
        const requestBody = {
            version_id: version_id,
            api_id: apiid.api_id
        };
        // console.log(requestBody)
        Swal.fire({
            title: lang["confirm"],
            text: lang["delete.api"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: lang["btn.delete"],
            cancelButtonText: lang["btn.cancel"],
            customClass: {
                confirmButton: 'swal2-confirm my-confirm-button-class',
                // add more custom classes if needed
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`${proxy}/apis/api`, {
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



    const apisManager = (project) => {
        window.location.href = `/projects/${project_id}/${version_id}/apis/create`;
        // window.location.href = `tables`;
    };
    const updateApi = (apiData) => {
        // console.log(apiData)
        window.location.href = `/projects/${project_id}/${version_id}/apis/update/${apiData.api_id}`;
        // window.location.href = `tables`;
    };



    const [currentPageApi, setCurrentPageApi] = useState(1);
    const rowsPerPageApi = 12;
    const [nameFilter, setNameFilter] = useState("");
    const [methodFilter, setMethodFilter] = useState("");
    const [modeFilter, setModeFilter] = useState("Private");

    // Áp dụng bộ lọc trên toàn bộ danh sách `apis`
    const filteredApi = apis.filter(api =>
        api.api_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        api.api_method.toLowerCase().includes(methodFilter.toLowerCase()) &&
        api.api_scope.toLowerCase().includes(modeFilter.toLowerCase())

    );



    // Tính chỉ mục dựa trên danh sách đã lọc
    const indexOfLastApi = currentPageApi * rowsPerPageApi;
    const indexOfFirstApi = indexOfLastApi - rowsPerPageApi;
    const currentApiPage = filteredApi.slice(indexOfFirstApi, indexOfLastApi);

    const paginateApi = (pageNumber) => setCurrentPageApi(pageNumber);
    const totalPagesApi = Math.ceil(filteredApi.length / rowsPerPageApi);

    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const mode = ["Private", "Public"]
    // console.log(currentApiPage)
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
                            <div class="full graph_head d-flex">
                                <div class="heading1 margin_0 ">
                                    <h5><label class="pointer" onClick={() => back()}><i class="fa fa-chevron-circle-left mr-2"></i>{lang["manage api"]}
                                    </label> </h5>
                                </div>
                                <div class="ml-auto" onClick={downloadAPI}>
                                    <i class="fa fa-download icon-ui"></i>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-4">
                                        {/* <label class="font-weight-bold">Tên bảng <span className='red_star'>*</span></label>
                                                <input type="text" class="form-control" 
                                                 placeholder="" /> */}
                                    </div>
                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <div class="row">
                                                <div class="col-md-6">

                                                    <select class="form-control ml-1"
                                                        value={methodFilter}
                                                        onChange={e => {
                                                            setMethodFilter(e.target.value); 
                                                            setCurrentPageApi(1);
                                                        }}
                                                        
                                                    >
                                                        <option value="">ALL</option>
                                                        {methods.map((method, index) => (
                                                            <option key={index} value={method}>{method}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                                <div class="col-md-6">

                                                    <select class="form-control"
                                                        value={modeFilter}
                                                  
                                                        onChange={e => {
                                                            setModeFilter(e.target.value)
                                                            setCurrentPageApi(1);
                                                        }}
                                                    >
                                                        {mode.map((mode, index) => (
                                                            <option key={index} value={mode}>{mode}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => apisManager()}>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        {/* <input
                                            type="text"
                                            value={nameFilter}
                                            onChange={e => setNameFilter(e.target.value)}
                                            placeholder="Lọc theo tên API"
                                        /> */}
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
                                                                            <i class="fa fa-edit size-24 pointer icon-margin icon-edit" onClick={() => updateApi(api)} title={lang["edit"]}></i>
                                                                            <i class="fa fa-trash-o size-24 pointer icon-margin icon-delete" onClick={() => handleDeleteApi(api)} title={lang["delete"]}></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>
                                                            {lang["show"]} {indexOfFirstApi + 1}-{Math.min(indexOfFirstApi + currentApiPage.length, filteredApi.length)} {lang["of"]} {filteredApi.length} {lang["results"]}
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

