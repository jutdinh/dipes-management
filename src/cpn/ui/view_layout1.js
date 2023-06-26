
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Tables } from ".";
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();


    const uis_temp = [
        {
            "id": 1,
            "data": "Dữ liệu 1"
        },
        {
            "id": 2,
            "data": "Dữ liệu 2"
        }, {
            "id": 3,
            "data": "Dữ liệu 3"
        }, {
            "id": 4,
            "data": "Dữ liệu 4"
        }, {
            "id": 5,
            "data": "Dữ liệu 5"
        },
    ]
    const [currentPageUi, setCurrentPageUi] = useState(1);
    const rowsPerPageUi = 11;

    const indexOfLastUi = currentPageUi * rowsPerPageUi;
    const indexOfFirstUi = indexOfLastUi - rowsPerPageUi;
    const currentUi = uis_temp.slice(indexOfFirstUi, indexOfLastUi);

    const paginateUi = (pageNumber) => setCurrentPageUi(pageNumber);
    const totalPagesUi = Math.ceil(uis_temp.length / rowsPerPageUi);


    return (
        <div class="table_section padding_infor_info">
            <div class="row column1">
                <div class="col-md-12 col-lg-12">
                    <div class="table-responsive">
                        {
                            currentUi && currentUi.length > 0 ? (
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th class="font-weight-bold">STT</th>
                                            <th class="font-weight-bold">Trường</th>
                                            <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUi.map((ui, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{ui.data}</td>
                                                <td class="align-center" style={{ minWidth: "130px" }}>
                                                    <i class="fa fa-edit size pointer icon-margin icon-edit" title={lang["edit"]}></i>
                                                    <i class="fa fa-trash-o size pointer icon-margin icon-delete" title={lang["delete"]}></i>
                                                </td>
                                            </tr>

                                        ))}
                                        <tr>
                                            <td colspan="3" style={{ textAlign: 'right' }}>Nam: 10, Nữ: 20, Tổng: 1000</td>
                                           
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <div class="list_cont ">
                                    <p>Chưa có trang</p>
                                </div>
                            )
                        }

                        <div className="d-flex justify-content-between align-items-center">
                            <p>{lang["show"]} {indexOfFirstUi + 1}-{Math.min(indexOfLastUi, uis_temp.length)} {lang["of"]} {uis_temp.length} {lang["results"]}</p>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPageUi === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginateUi(currentPageUi - 1)}>
                                            &laquo;
                                        </button>
                                    </li>
                                    {Array(totalPagesUi).fill().map((_, index) => (
                                        <li key={index} className={`page-item ${currentPageUi === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginateUi(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPageUi === totalPagesUi ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginateUi(currentPageUi + 1)}>
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

