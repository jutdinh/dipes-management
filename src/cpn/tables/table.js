
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';

import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const [table, setTable] = useState({});
    const [tables, setTables] = useState({});
    useEffect(() => {

        fetch(`${proxy}/projects/project/${project_id}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;

                if (success) {
                    if (data) {
                       setTables(data);
                    }
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    const addTable = (e) => {
        e.preventDefault();
        const requestBody = {
            project_id: project_id,
            project_name: table.project_name
        }
        console.log(requestBody)
        fetch(`${proxy}/db/tables/table`, {
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
                if (success) {
                    Swal.fire({
                        title: "Thành công!",
                        text: content,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        window.location.reload();
                        setShowModal(false);
                    });
                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            })


    };

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
                                    <h5>Quản lý bảng</h5>
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
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addTable">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Tên bảng</th>
                                                    <th>Ngày tạo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Bảng 1</td>
                                                    <td>06/06/2023 11:12</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>Bảng 2</td>
                                                    <td>06/06/2023 11:14</td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>Bảng 3</td>
                                                    <td>06/06/2023 11:16</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                   

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                {/*add table */}
              
                <div class={`modal ${showModal ? 'show' : ''}`} id="addTable">
                        <div class="modal-dialog modal-dialog-center">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Thêm bảng</h4>
                                    <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="row">
                                            <div class="form-group col-lg-12">
                                                <label>Tên bảng <span className='red_star'>*</span></label>
                                                <input type="text" class="form-control" value={table.task_name} onChange={
                                                    (e) => { setTable({ ...table, table_name: e.target.value }) }
                                                } placeholder="" />
                                            </div>

                                           
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" onClick={addTable} class="btn btn-success ">{lang["btn.create"]}</button>
                                    {/* <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
            </div >
        </div >
    )
}

