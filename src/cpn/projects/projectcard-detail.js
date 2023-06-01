
import { useParams } from "react-router-dom";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const [errorMessagesedit, setErrorMessagesedit] = useState({});
    const sortOptions = [
        { id: 0, label: "Mới nhất", value: "latest" },
        { id: 1, label: "Cũ nhất", value: "oldest" },
    ]
    const status = [
        { id: 0, label: "Khởi tạo", value: 1, color: "#1ed085" },
        { id: 1, label: "Thực hiện", value: 2, color: "#8884d8" },
        { id: 2, label: "Triển khai", value: 3, color: "#ffc658" },
        { id: 3, label: "Hoàn thành", value: 4, color: "#ff8042" },
        { id: 4, label: "Tạm dừng", value: 5, color: "#FF0000" }
    ]

    const { project_id } = useParams()
    const [projectdetail, setProjectDetail] = useState([]); //// Detail project
    const [project, setProject] = useState({}); //// Update project
    const [projectmember, setProjectMember] = useState({});


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
                        setProjectDetail(data);
                        setProject(data);
                        console.log(projectdetail)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
    const submit = (e) => {
        e.preventDefault();
        const { project_name, project_status } = project;
        const errors = {};
        if (!project_name) {
            errors.project_name = lang["error.project_name"];
        }
        if (!project_status) {
            errors.project_status = lang["error.project_status"];
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessagesedit(errors);
            return;
        }
        fetch(`${proxy}/projects/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify({ project }),
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
                    });

                } else {
                    Swal.fire({
                        title: "Thất bại!",
                        text: content,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                    });
                }
            });
    };
    // Sort 
    let adminMembers = projectdetail.members ? projectdetail.members.filter(member => member.role === 'ad') : [];
    let projectManagerMembers = projectdetail.members ? projectdetail.members.filter(member => member.role === 'pm') : [];
    let projectMonitorMembers = projectdetail.members ? projectdetail.members.filter(member => member.role === 'ps') : [];
    let sortedMembers = [...adminMembers, ...projectManagerMembers, ...projectMonitorMembers];

    const handleDeleteUser = (member) => {
         const requestBody = {
          
                project_id: project.project_id,
                username       : member.username
            
        };
        console.log(requestBody)
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa thành viên này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'rgb(209, 72, 81)',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/projects/remove/project/member`, {
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
                        console.log(resp)
                        if (status === "0x52404") {
                            Swal.fire({
                                title: "Cảnh báo!",
                                text: content,
                                icon: "warning",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                            return;
                        }
                        if (success) {
                            Swal.fire({
                                title: "Thành công!",
                                text: content,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function () {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: "Thất bại!",
                                text: content,
                                icon: "error",
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(function () {
                                // Không cần reload trang
                            });
                        }
                    });
            }
        });
    }
    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["project_detail.title"]}</h4>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            {/* <div class="full graph_head">
                            <div class="heading1 margin_0">
                                <h4>{lang["project list"]}</h4>
                            </div>
                        </div> */}
                            <div class="full price_table padding_infor_info">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="row column4 graph">
                                                {/* Proejct */}
                                                {/* Detail */}
                                                <div class="col-md-6">
                                                    <div class="white_shd full margin_bottom_30">
                                                        <div class="full graph_head">
                                                            <div class="row">
                                                                <div class="col-md-11">
                                                                    <h5>{projectdetail.project_name}</h5>
                                                                </div>
                                                                <div class="col-md-1">

                                                                    <p><i class="fa fa-edit size pointer" data-toggle="modal" data-target="#editProject"></i></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="full progress_bar_inner">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">

                                                                            <p>Mã dự án: {projectdetail.project_code}</p>

                                                                            <span className="status-label" style={{
                                                                                backgroundColor: (status.find((s) => s.value === projectdetail.project_status) || {}).color
                                                                            }}>
                                                                                {(status.find((s) => s.value === projectdetail.project_status) || {}).label || 'Trạng thái không xác định'}
                                                                            </span>
                                                                            <p>Người tạo dự án: {projectdetail.create_by?.fullname}</p>


                                                                            <p>Thời gian: {projectdetail.create_at}</p>
                                                                            <p>Mô tả: {projectdetail.project_description}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Update Project */}
                                                <div class={`modal show`} id="editProject">
                                                    <div class="modal-dialog modal-dialog-left container">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h4 class="modal-title">Cập nhật dự án</h4>
                                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <form>
                                                                    <div class="row">
                                                                        <div class="form-group col-lg-6">

                                                                            <label>Tên dự án <span className='red_star'>*</span></label>
                                                                            <input type="text" class="form-control" value={project.project_name} onChange={
                                                                                (e) => { setProject({ ...project, project_name: e.target.value }) }
                                                                            } placeholder="Nhập tên dự án" />
                                                                            {errorMessagesedit.project_name && <span class="error-message">{errorMessagesedit.project_name}</span>}

                                                                        </div>
                                                                        <div class="form-group col-lg-6">
                                                                            <label>Mã dự án </label>
                                                                            <input type="text" class="form-control" value={project.project_code} onChange={
                                                                                (e) => { setProject({ ...project, project_code: e.target.value }) }
                                                                            } placeholder="Nhập mã dự án" />

                                                                        </div>
                                                                        <div class="form-group col-lg-6 ">
                                                                            <label>Trạng thái <span className='red_star'>*</span></label>
                                                                            <select className="form-control" value={project.project_status} onChange={(e) => { setProject({ ...project, project_status: e.target.value }) }}>
                                                                                <option value="">Chọn trạng thái</option>
                                                                                {status.map((status, index) => {
                                                                                    return (
                                                                                        <option key={index} value={status.value}>{status.label}</option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            {errorMessagesedit.project_status && <span class="error-message">{errorMessagesedit.project_status}</span>}
                                                                        </div>
                                                                        <div class="form-group ">
                                                                            <label>Mô tả </label>
                                                                            <textarea type="text" class="form-control" value={project.project_description} onChange={
                                                                                (e) => { setProject({ ...project, project_description: e.target.value }) }
                                                                            } placeholder="Nhập mô tả" />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" onClick={submit} class="btn btn-success ">Lưu lại</button>
                                                                <button type="button" data-dismiss="modal" class="btn btn-danger">Đóng</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Version */}
                                                <div class="col-md-6">
                                                    <div class="white_shd full margin_bottom_30">
                                                        <div class="full graph_head">
                                                            <div class="row">
                                                                <div class="col-md-11">
                                                                    <h5>Version</h5>
                                                                </div>
                                                                <div class="col-md-1">
                                                                    <p><i class="fa fa-edit size pointer"></i></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="full progress_bar_inner">
                                                            <div class="row span-hover">
                                                                <div class="col-md-10">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">
                                                                            <span> Version 1.0.0</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* <div class="col-md-4">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">
                                                                            <p>{
                                                                                projectdetail.manager?.role === "ad" ? "Quản trị viên" :
                                                                                    projectdetail.manager?.role === "pm" ? "Quản lý dự án" :
                                                                                        projectdetail.manager?.role === "pd" ? "Triển dự án" :
                                                                                            projectdetail.manager?.role === "ps" ? "Theo dõi dự án" :
                                                                                                "Khác"
                                                                            } </p>
                                                                        </div>
                                                                    </div>
                                                                </div> */}
                                                                <div class="col-md-2">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info scaled-hover-targe pointer">
                                                                            <i class="fa fa-cogs"></i>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Task */}
                                                <div class="col-md-6">
                                                    <div class="white_shd full margin_bottom_30">
                                                        <div class="full graph_head">
                                                            <div class="row">
                                                                <div class="col-md-11">
                                                                    <h5>Task</h5>
                                                                </div>
                                                                <div class="col-md-1">
                                                                    <p><i class="fa fa-edit size pointer"></i></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="full progress_bar_inner">
                                                            <div class="row">
                                                                <div class="col-md-2">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">
                                                                            <img class="img-responsive circle-image-member" src={proxy + projectdetail.manager?.avatar} alt="#" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-6">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">



                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <div class="full">
                                                                        <div class="padding_infor_info">



                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Member */}
                                                <div class="col-md-6">
                                                    <div class="dash_blog">
                                                        <div class="dash_blog_inner">
                                                            <div class="full graph_head">
                                                                <div class="row">
                                                                    <div class="col-md-11">
                                                                        <h5>Nhân viên triển khai</h5>
                                                                    </div>
                                                                    <div class="col-md-1">
                                                                    <p><i class="fa fa-edit size pointer" data-toggle="modal" data-target="#editMember"></i></p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="msg_list_main">
                                                                <ul class="msg_list">
                                                                {sortedMembers && sortedMembers.length > 0 && sortedMembers.map(member => (
                                                                        <div key={member.username}>
                                                                            <li>
                                                                                <span><img src={proxy + member.avatar} class="img-responsive img_custom" alt="#" /></span>
                                                                                <span>
                                                                                    <span class="name_user">{member.fullname}</span>
                                                                                    <span class="msg_user">Sed ut perspiciatis unde omnis.</span><br />
                                                                                    <span class="msg_user">Sed ut perspiciatis unde omnis.</span>
                                                                                    <span class="time_ago">{
                                                                                        member.role === "ad" ? "Quản trị viên" :
                                                                                            member.role === "pm" ? "Quản lý dự án" :
                                                                                                member.role === "pd" ? "Triển dự án" :
                                                                                                    member.role === "ps" ? "Theo dõi dự án" :
                                                                                                        "Khác"
                                                                                    }</span>
                                                                                </span>
                                                                                <span class="close-button">
                                                                                   <img class="abc"width={20} src="/images/icon/cross-color.png" onClick={() => handleDeleteUser(member)} ></img>
                                                                                   </span>
                                                                            </li>
                                                                        </div>
                                                                    ))}

                                                                </ul>
                                                            </div>
                                                            <div class="read_more">
                                                                <div class="center"><a class="main_bt read_bt" href="#">Read More</a></div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                                 {/* Update member */}
                                                 <div class={`modal show`} id="editMember">
                                                    <div class="modal-dialog modal-dialog-left container">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h4 class="modal-title">Cập nhật thành viên dự án</h4>
                                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <form>
                                                                    <div class="row">
                                                                        <div class="form-group col-lg-6">

                                                                            <label>Tên dự án <span className='red_star'>*</span></label>
                                                                            <input type="text" class="form-control" value={project.project_name} onChange={
                                                                                (e) => { setProject({ ...project, project_name: e.target.value }) }
                                                                            } placeholder="Nhập tên dự án" />
                                                                            {errorMessagesedit.project_name && <span class="error-message">{errorMessagesedit.project_name}</span>}

                                                                        </div>
                                                                        <div class="form-group col-lg-6">
                                                                            <label>Mã dự án </label>
                                                                            <input type="text" class="form-control" value={project.project_code} onChange={
                                                                                (e) => { setProject({ ...project, project_code: e.target.value }) }
                                                                            } placeholder="Nhập mã dự án" />

                                                                        </div>
                                                                        <div class="form-group col-lg-6 ">
                                                                            <label>Trạng thái <span className='red_star'>*</span></label>
                                                                            <select className="form-control" value={project.project_status} onChange={(e) => { setProject({ ...project, project_status: e.target.value }) }}>
                                                                                <option value="">Chọn trạng thái</option>
                                                                                {status.map((status, index) => {
                                                                                    return (
                                                                                        <option key={index} value={status.value}>{status.label}</option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            {errorMessagesedit.project_status && <span class="error-message">{errorMessagesedit.project_status}</span>}
                                                                        </div>
                                                                        <div class="form-group ">
                                                                            <label>Mô tả </label>
                                                                            <textarea type="text" class="form-control" value={project.project_description} onChange={
                                                                                (e) => { setProject({ ...project, project_description: e.target.value }) }
                                                                            } placeholder="Nhập mô tả" />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" onClick={submit} class="btn btn-success ">Lưu lại</button>
                                                                <button type="button" data-dismiss="modal" class="btn btn-danger">Đóng</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
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

