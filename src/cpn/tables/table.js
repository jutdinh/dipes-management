
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';

import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
 


    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["project_detail.title"]}</h4>
                        </div>
                    </div>
                </div>
              
                {/* Website info */}
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
                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            {/* <p class="font-weight-bold">Danh sách bảng </p> */}
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#">
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
            </div >
        </div >
    )
}

