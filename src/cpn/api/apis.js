
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';

import Swal from 'sweetalert2';
import { Tables } from ".";
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();

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
    // const [currentPageTable, setCurrentPageTable] = useState(1);
    // const rowsPerPageTable = 7;

    // const indexOfLastTable = currentPageTable * rowsPerPageTable;
    // const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    // const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    // const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    // const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);
    const apisManager = (project) => {

        window.location.href = `/projects/${version_id}/apis/create`;

        // window.location.href = `tables`;
    };
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>Quản lý API</h4>
                        </div>
                    </div>
                </div>

                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0 ">
                                    <h5>Quản lý API</h5>
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
                                            {/* <p class="font-weight-bold">Danh sách bảng </p> */}
                                            {/* <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTable">
                                                <i class="fa fa-plus"></i>
                                            </button> */}
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" onClick={() => apisManager()}>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th class="font-weight-bold">STT</th>
                                                        <th class="font-weight-bold">Phương thức </th>
                                                        <th class="font-weight-bold">Tên API</th>
                                                        <th class="font-weight-bold">Phạm vi</th>
                                                        <th class="font-weight-bold">Người tạo</th>
                                                        <th class="font-weight-bold">Thời gian tạo</th>
                                                        <th class="font-weight-bold align-center" scope="col" >{lang["log.action"]}</th>
                                                      
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {apis.map((api, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{api.api_method}</td>
                                                            <td>{api.api_name}</td>
                                                            <td>{api.api_scope}</td>
                                                            <td>{api.create_by.fullname}</td>
                                                            <td>{api.create_at}</td>                                                          
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

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
