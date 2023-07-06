
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
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
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
    console.log(apis)

    const handleGetApi = (apiid) => {
        console.log("api", apiid)
    }

    const downloadAPI = () => {
        console.log(apis);
      
        const header = ["API ID", "Tên API", "Phương thức API", "Ngày tạo"];
      
        // Biến đổi dữ liệu để phù hợp với cấu trúc của báo cáo
        const reportData = apis.map(item => {
          return [
            item.api_id,
            item.api_name,
            item.api_method,
            item.create_at,
          ];
        });
      
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
      
        const mergeTitle = { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } };
        const mergeInfo = { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }; // gộp hàng từ A2 đến D2
     
         // gộp hàng từ A1 đến D1
         ws["!merges"] = [mergeTitle, mergeInfo];
      
        // Định nghĩa định dạng
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
        ws["A2"].s = infoStyle;
        ws["A3"].s = infoStyle;
      
        // Thêm định dạng cho header
        ws["A4"].s = headerStyle;
        ws["B4"].s = headerStyle;
        ws["C4"].s = headerStyle;
        ws["D4"].s = headerStyle;
      
        ws["!cols"] = [{ width: 6 }, { width: 45 }, { width: 20 }, { width: 35 }, { width: 20 }, { width: 40 }];
        ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
        // Tạo một Workbook mới và thêm Worksheet vào Workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "APIs");
      
        // Ghi Workbook ra file Excel
        XLSX.writeFile(wb, "APIs.xlsx");
      };
      
      
      


    const handleUpdateStatus = (apiid) => {
        console.log("api", apiid)
        const newStatus = !apiid.status;
        const requestBody = {
            version_id: version_id,
            api: { ...apiid, status: newStatus }
        };

        console.log(requestBody)
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
                    showApiResponseMessage(status);
                } else {
                    showApiResponseMessage(status);
                }
            });


    }
    const handleDeleteApi = (apiid) => {
        console.log(apiid)
        const requestBody = {
            version_id: version_id,
            api_id: apiid.api_id
        };
        console.log(requestBody)
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
                            showApiResponseMessage(status);

                        });
                }
            });
    }

    const [currentPageApi, setCurrentPageApi] = useState(1);
    const rowsPerPageApi = 11;

    const indexOfLastApi = currentPageApi * rowsPerPageApi;
    const indexOfFirstApi = indexOfLastApi - rowsPerPageApi;
    const currentApi = apis.slice(indexOfFirstApi, indexOfLastApi);

    const paginateApi = (pageNumber) => setCurrentPageApi(pageNumber);
    const totalPagesApi = Math.ceil(apis.length / rowsPerPageApi);

    const apisManager = (project) => {
        window.location.href = `/projects/${version_id}/apis/create`;
        // window.location.href = `tables`;
    };
    const updateApi = (apiData) => {
        console.log(apiData)
        window.location.href = `/projects/${version_id}/apis/update/${apiData.api_id}`;
        // window.location.href = `tables`;
    };





    const [nameFilter, setNameFilter] = useState("");
    const [methodFilter, setMethodFilter] = useState("");

    const filteredApi = currentApi.filter(api =>
        api.api_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        api.api_method.toLowerCase().includes(methodFilter.toLowerCase())
    );
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];

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
                                    <h5><a onClick={() => navigate(-1)}><i class="fa fa-chevron-circle-left mr-3"></i></a>{lang["manage api"]}</h5>
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
                                                <div class="col-md-12">
                                                    <select class="form-control"
                                                        value={methodFilter}
                                                        onChange={e => setMethodFilter(e.target.value)}
                                                    >
                                                        <option value="">ALL</option>
                                                        {methods.map((method, index) => (
                                                            <option key={index} value={method}>{method}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div class="col-md-1">

                                                </div>
                                            </div>

                                            {/* <p class="font-weight-bold">Danh sách bảng </p> */}
                                            {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTable">
                                                <i class="fa fa-plus"></i>
                                            </button> */}
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
                                            filteredApi && filteredApi.length > 0 ? (
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
                                                                {filteredApi.map((api, index) => (
                                                                    <tr key={index}>
                                                                        <td>{indexOfFirstApi + index + 1}</td>
                                                                        <td style={{ textTransform: 'uppercase' }}>{api.api_method}</td>
                                                                        <td>{api.api_name}</td>
                                                                        {/* <td>{api.api_scope}</td> */}
                                                                        <td>{api.create_by.fullname}</td>
                                                                        <td>{api.create_at}</td>
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
                                                                            <i class="fa fa-edit size pointer icon-margin icon-edit" onClick={() => updateApi(api)} title={lang["edit"]}></i>
                                                                            <i class="fa fa-trash-o size pointer icon-margin icon-delete" onClick={() => handleDeleteApi(api)} title={lang["delete"]}></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>{lang["show"]} {indexOfFirstApi + 1}-{Math.min(indexOfLastApi, filteredApi.length)} {lang["of"]} {filteredApi.length} {lang["results"]}</p>
                                                        <nav aria-label="Page navigation example">
                                                            <ul className="pagination mb-0">
                                                                <li className={`page-item ${currentPageApi === 1 ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(currentPageApi - 1)}>
                                                                        &laquo;
                                                                    </button>
                                                                </li>
                                                                {Array(totalPagesApi).fill().map((_, index) => (
                                                                    <li key={index} className={`page-item ${currentPageApi === index + 1 ? 'active' : ''}`}>
                                                                        <button className="page-link" onClick={() => paginateApi(index + 1)}>
                                                                            {index + 1}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                                <li className={`page-item ${currentPageApi === totalPagesApi ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => paginateApi(currentPageApi + 1)}>
                                                                        &raquo;
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </>
                                            ) : (
                                                <div class="list_cont ">
                                                    <p>Chưa có api</p>
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

