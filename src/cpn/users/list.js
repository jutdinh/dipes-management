import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import Swal from 'sweetalert2';
export default (props) => {
    const { lang, proxy } = useSelector(state => state);
    const [showModal, setShowModal] = useState(false);
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const users = JSON.parse(stringifiedUser)
    const [errorMessages, setErrorMessages] = useState({});
    const [isDataAdded, setIsDataAdded] = useState(false);
    const roles = [
        { id: 0, label: "Quản trị viên ( Administrator )", value: "ad" },
        { id: 1, label: "Quản lý dự án ( Project manager )", value: "pm" },
        { id: 2, label: "Người triển khai ( Implementation Staff )", value: "pd" },
        { id: 3, label: "Người theo dõi dự án ( Monitor Staff )", value: "ps" },
    ]
    const [user, setUser] = useState({});
    const [editUser, setEditUser] = useState({});
    const handleCloseModal = () => {
        setEditUser({
            username: '',
            password: '',
            fullname: '',
            role: '',
            email: '',
            phone: '',
            address: '',
            note: ''
        });
        setUser({
            username: '',
            password: '',
            fullname: '',
            role: '',
            email: '',
            phone: '',
            address: '',
            note: ''
        });
        setShowModal(false);
    };
    const [profiles, setProfile] = useState([]);
    useEffect(() => {
        fetch(`${proxy}/auth/all/accounts`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {
                    if (data != undefined && data.length > 0) {
                        setProfile(data);
                        // console.log(data)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isValidPhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/; // Kiểm tra 10 chữ số
        return phoneRegex.test(phone);
    };
    // Add user
    const submit = (e) => {
        e.preventDefault();
        // const { username, password, fullname, role, email, phone, address } = user;
        // const errors = {};
        // if (!username) {
        //     errors.username = "Vui lòng nhập tên đăng nhập";
        // }
        // if (!password) {
        //     errors.password = "Vui lòng nhập mật khẩu";
        // }
        // if (!fullname) {
        //     errors.fullname = "Vui lòng nhập họ tên";
        // }
        // if (!role) {
        //     errors.role = "Vui lòng chọn quyền";
        // }
        // if (!email) {
        //     errors.email = "Vui lòng nhập email";
        // } else if (!isValidEmail(email)) { // Kiểm tra tính hợp lệ của email
        //     errors.email = "Email không hợp lệ";
        // }
        // if (!phone) {
        //     errors.phone = "Vui lòng nhập số điện thoại";
        // }
        // else if (!isValidPhone(phone)) { // Kiểm tra tính hợp lệ của phone
        //     errors.phone = "Số điện thoại không hợp lệ";
        // }
        // if (!address) {
        //     errors.address = "Vui lòng nhập địa chỉ";
        // }
        // if (user.password !== user.confirmPassword) {
        //     setErrorMessages({ ...errorMessages, confirmPassword: "Mật khẩu không khớp" });
        //     return;
        // }
        // // Kiểm tra xem có lỗi không
        // if (Object.keys(errors).length > 0) {
        //     setErrorMessages(errors);
        //     return;
        // }
        // console.log(_token);
        if (user.username && user.password) {
            fetch(`${proxy}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${_token}`,
                },
                body: JSON.stringify({ account: user }),
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
                        setUser({});
                        setShowModal(false);
                        setIsDataAdded(true);
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
    };

    const handleDeleteUser = (user) => {
        const requestBody = {
            account: {
                username: user.username
            }
        };
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa người dùng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'rgb(209, 72, 81)',
          }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${proxy}/auth/user`, {
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
                        if(status==="0x52404")
                        {
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
                  // console.log(requestBody)
       
    }

    const submitUpdate = (e) => {
        e.preventDefault();
        if (!editUser.fullname || !editUser.role || !editUser.email || !editUser.phone || !editUser.address) {
            Swal.fire({
                title: "Lỗi!",
                text: "Vui lòng điền đầy đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const requestBody = {
            account: {
                ...editUser
            }
        };
        fetch(`${proxy}/auth/user`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content } = resp;
                console.log(resp)
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
    const handleUpdateUser = (editUser) => {
        console.log("Thông tin người dùng:", editUser.role);
        if (editUser.role === users.role) {
            Swal.fire({
                title: "Thất bại!",
                text: "Không có quyền thực hiện thao tác",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
            }).then(function () {
                //  window.location.reload();
                $('.modal-backdrop').remove()
            });
            setShowModal(false);
            return;
        }
        setEditUser(editUser)
        setShowModal(true); // 
    }
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h2>{lang["accounts manager"]}</h2>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <div className="row justify-content-end">
                                        <div className="col-auto">
                                            <h2>{lang["accounts list"]}</h2>
                                        </div>
                                        <div className="col-auto">
                                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal add */}
                            <div class={`modal ${showModal ? 'show' : ''}`} id="myModal">
                                <div class="modal-dialog modal-dialog-left container">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title">Thêm mới người dùng</h4>
                                            <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <div class="form-group">
                                                    <label>Tên đăng nhập <span className='red_start'>*</span></label>
                                                    <input type="text" class="form-control" value={user.username} onChange={
                                                        (e) => { setUser({ ...user, username: e.target.value }) }
                                                    } placeholder="Nhập tên đăng nhập" />
                                                    {errorMessages.username && <span class="error-message">{errorMessages.username}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Mật khẩu <span className='red_start'>*</span></label>
                                                    <input type="password" class="form-control" value={user.password} onChange={
                                                        (e) => { setUser({ ...user, password: e.target.value }) }
                                                    } placeholder="Nhập mật khẩu" />
                                                    {errorMessages.password && <span class="error-message">{errorMessages.password}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Nhập lại mật khẩu <span className='red_start'>*</span></label>
                                                    <input
                                                        type="password"
                                                        class="form-control"
                                                        value={user.confirmPassword}
                                                        onChange={(e) => {
                                                            setUser({ ...user, confirmPassword: e.target.value });
                                                        }}
                                                        placeholder="Nhập lại mật khẩu"
                                                    />
                                                    {errorMessages.confirmPassword && <span class="error-message">{errorMessages.confirmPassword}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label >Họ tên <span className='red_start'>*</span></label>
                                                    <input type="text" class="form-control" value={user.fullname} onChange={
                                                        (e) => { setUser({ ...user, fullname: e.target.value }) }
                                                    } placeholder="Nhập đầy đủ họ tên" />
                                                    {errorMessages.fullname && <span class="error-message">{errorMessages.fullname}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="sel1">Quyền <span className='red_start'>*</span></label>
                                                    <select className="form-control" name="role" value={user.role} onChange={handleChange}>
                                                        <option value="">Chọn quyền</option>
                                                        {users.role === "ad" ? (
                                                            roles.slice(1, 4).map(role => (
                                                                <option key={role.id} value={role.value}>{role.label}</option>
                                                            ))
                                                        ) : (
                                                            roles.map(role => (
                                                                <option key={role.id} value={role.value}>{role.label}</option>
                                                            ))
                                                        )}
                                                    </select>
                                                    {errorMessages.role && <span className="error-message">{errorMessages.role}</span>}
                                                </div>


                                                <div class="form-group">
                                                    <label>Email <span className='red_start'>*</span></label>
                                                    <input type="email" class="form-control" value={user.email} onChange={
                                                        (e) => { setUser({ ...user, email: e.target.value }) }
                                                    } placeholder="Nhập email" />
                                                    {errorMessages.email && <span class="error-message">{errorMessages.email}</span>}
                                                </div>

                                                <div class="form-group">
                                                    <label>Số điện thoại <span className='red_start'>*</span></label>
                                                    <input type="phone" class="form-control" value={user.phone} onChange={
                                                        (e) => { setUser({ ...user, phone: e.target.value }) }
                                                    } placeholder="Số điện thoại" />
                                                    {errorMessages.phone && <span class="error-message">{errorMessages.phone}</span>}
                                                </div>

                                                <div class="form-group">
                                                    <label>Địa chỉ <span className='red_start'>*</span></label>
                                                    <input type="text" class="form-control" value={user.address} onChange={
                                                        (e) => { setUser({ ...user, address: e.target.value }) }
                                                    } placeholder="Địa chỉ" />
                                                    {errorMessages.address && <span class="error-message">{errorMessages.address}</span>}
                                                </div>

                                                <div class="form-group">
                                                    <label>Ghi chú</label>
                                                    <input type="text" class="form-control" value={user.note} onChange={
                                                        (e) => { setUser({ ...user, note: e.target.value }) }
                                                    } placeholder="Ghi chú" />
                                                </div>

                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" onClick={submit} class="btn btn-success">Thêm mới</button>
                                            <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">Đóng</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal edit */}
                            <div class={`modal ${showModal ? 'show' : 'hidden'}`} id="myEditmodal">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title">Cập nhật thông tin</h4>
                                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <div class="form-group">
                                                    <input type="hidden" class="form-control" value={editUser.username} onChange={
                                                        (e) => { setEditUser({ ...editUser, username: e.target.value }) }
                                                    } placeholder="Nhập tên đăng nhập" />
                                                    {errorMessages.username && <span class="error-message">{errorMessages.username}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <input type="hidden" class="form-control" value={editUser.password} onChange={
                                                        (e) => { setEditUser({ ...editUser, password: e.target.value }) }
                                                    } placeholder="Nhập mật khẩu" />
                                                    {errorMessages.password && <span class="error-message">{errorMessages.password}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label >Họ tên <span className='red_start'>*</span></label>
                                                    <input type="text" class="form-control" value={editUser.fullname} onChange={
                                                        (e) => { setEditUser({ ...editUser, fullname: e.target.value }) }
                                                    } placeholder="Nhập đầy đủ họ tên" />
                                                    {errorMessages.fullname && <span class="error-message">{errorMessages.fullname}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="sel1">Quyền <span className='red_start'>*</span></label>
                                                    <select className="form-control" name="role" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                                                        <option value="">Chọn quyền</option>
                                                        {users.role === "ad" ? (
                                                            roles.slice(1, 4).map(role => (
                                                                <option key={role.id} value={role.value}>{role.label}</option>
                                                            ))
                                                        ) : (
                                                            roles.map(role => (
                                                                <option key={role.id} value={role.value}>{role.label}</option>
                                                            ))
                                                        )}
                                                    </select>
                                                    {errorMessages.role && <span className="error-message">{errorMessages.role}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Email <span className='red_start'>*</span></label>
                                                    <input type="email" class="form-control" value={editUser.email} onChange={
                                                        (e) => { setEditUser({ ...editUser, email: e.target.value }) }
                                                    } placeholder="Nhập email" />
                                                    {errorMessages.email && <span class="error-message">{errorMessages.email}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Số điện thoại <span className='red_start'>*</span></label>
                                                    <input type="phone" class="form-control" value={editUser.phone} onChange={
                                                        (e) => { setEditUser({ ...editUser, phone: e.target.value }) }
                                                    } placeholder="Số điện thoại" />
                                                    {errorMessages.phone && <span class="error-message">{errorMessages.phone}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Địa chỉ <span className='red_start'>*</span></label>
                                                    <input type="text" class="form-control" value={editUser.address} onChange={
                                                        (e) => { setEditUser({ ...editUser, address: e.target.value }) }
                                                    } placeholder="Địa chỉ" />
                                                    {errorMessages.address && <span class="error-message">{errorMessages.address}</span>}
                                                </div>
                                                <div class="form-group">
                                                    <label>Ghi chú</label>
                                                    <input type="text" class="form-control" value={editUser.note} onChange={
                                                        (e) => { setEditUser({ ...editUser, note: e.target.value }) }
                                                    } placeholder="Ghi chú" />
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" onClick={submitUpdate} class="btn btn-success">Cập nhật</button>
                                            <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">Đóng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* List user */}
                            <div class="full price_table padding_infor_info">
                                <div class="container-fluid">
                                    <div class="row">
                                        {profiles.map((item) => (
                                            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 profile_details margin_bottom_30">
                                                <div class="contact_blog">
                                                    <div class="contact_inner">
                                                        <div class="left-cus">
                                                            <h3>{item.fullname}</h3>
                                                            <p><strong>Tài khoản: {item.username} </strong></p>
                                                            <p><strong>Quyền: </strong>
                                                                {item.role === "ad" ? "Quản trị viên" :
                                                                    item.role === "pm" ? "Quản lý dự án" :
                                                                        item.role === "pd" ? "Người triển khai" :
                                                                            item.role === "ps" ? "Người theo dõi dự án" :
                                                                                item.role}</p>
                                                            <ul class="list-unstyled">
                                                                <li><i class="fa fa-envelope-o"></i> : {item.email}</li>
                                                                <li><i class="fa fa-phone"></i> : {item.phone}</li>
                                                                <li>Tạo bởi: {item.create_by}</li>
                                                                <li>Thời gian: {item.create_at}</li>
                                                            </ul>
                                                        </div>
                                                        <div class="right">
                                                            <div class="profile_contacts">
                                                                <img class="img-responsive" width={100} src={proxy + item.avatar} alt="#" />
                                                            </div>
                                                        </div>
                                                        <div class="bottom_list">
                                                            <div class="right_button">
                                                                <button type="button" class="btn btn-primary" onClick={() => handleUpdateUser(item)} data-toggle="modal" data-target="#myEditmodal">
                                                                    <i class="fa fa-edit"></i>
                                                                </button>
                                                                <button type="button" class="btn btn-danger" onClick={() => handleDeleteUser(item)}>
                                                                    <i class="fa fa-trash-o"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}