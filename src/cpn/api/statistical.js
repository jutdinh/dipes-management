
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidTypeEnum } from '../enum/type';

import Swal from 'sweetalert2';
import { ready } from "jquery";



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

export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const { project_id, version_id } = useParams();
    const [showModal, setShowModal] = useState(false);


    // const [currentPageTable, setCurrentPageTable] = useState(1);
    // const rowsPerPageTable = 7;

    // const indexOfLastTable = currentPageTable * rowsPerPageTable;
    // const indexOfFirstTable = indexOfLastTable - rowsPerPageTable;
    // const currentTable = tables.tables?.slice(indexOfFirstTable, indexOfLastTable);

    // const paginateTable = (pageNumber) => setCurrentPageTable(pageNumber);
    // const totalPagesTable = Math.ceil(tables.tables?.length / rowsPerPageTable);

    // console.log("p key", primaryKey)
    // console.log("f key", foreignKey)

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
                                    <h5>Tạo mới apis </h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="row column1">
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Tên api <span className='red_star'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"


                                            placeholder=""
                                        />
                                    </div>
                                    <div class="form-group col-lg-7"></div>
                                    <div class="form-group col-lg-5">
                                        <label class="font-weight-bold">Phương thức <span className='red_star'>*</span></label>
                                        <div class="checkbox-group">
                                            <div class="checkbox-item">
                                                <input type="radio" checked />
                                                <label class="ml-1">GET</label>
                                            </div>

                                            <div class="checkbox-item">
                                                <input type="radio" />
                                                <label class="ml-1">POST</label>
                                            </div>
                                            <div class="checkbox-item round">
                                                <input type="radio" />
                                                <label class="ml-1">PUT</label>
                                            </div>
                                            <div class="checkbox-item">
                                                <input type="radio" />
                                                <label class="ml-1">DELETE</label>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường đối số </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldParam">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">

                                        </div>


                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường hiển thị </p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldShow">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">

                                        </div>


                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="d-flex align-items-center mb-1">
                                            <p class="font-weight-bold">Danh sách các trường thống kê</p>
                                            <button type="button" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addFieldStatistical">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>

                                        <div class="table-responsive">

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field param */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldParam">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường đối số</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text"  value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*add Field show */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="addFieldShow">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Thêm trường hiển thị</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text"  value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
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
                                <h4 class="modal-title">Thêm trường thống kê</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên bảng <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div className={`form-group col-lg-12`}>
                                        <label>Tên trường <span className='red_star'>*</span></label>
                                        <select className="form-control">
                                            <option value="">Chọn</option>

                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Người tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text" value={"Nguyễn Văn A"} readOnly></input>
                                    </div>
                                    <div class="form-group col-md-12">
                                    <label>Ngày tạo <span className='red_star'>*</span></label>
                                        <input class="form-control" type="text"  value={new Date().toISOString().substring(0, 10)} readOnly></input>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success ">{lang["btn.create"]}</button>
                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div >
        </div >
    )
}

