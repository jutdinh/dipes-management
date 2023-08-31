import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from "react";
import Swal from 'sweetalert2';
import { Profile } from '.';
import responseMessages from "../enum/response-code";

export default (props) => {
    const { lang, proxy, functions } = useSelector(state => state);

    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const user = JSON.parse(stringifiedUser)
    const [profile, setProfile] = useState({});
    const [editUser, setEditUser] = useState({});
    const [errorMessagesedit, setErrorMessagesedit] = useState({});
    // const showApiResponseMessage = (status) => {
    //     const langItem = (localStorage.getItem("lang") || "Vi").toLowerCase(); // fallback to English if no language is set
    //     const message = responseMessages[status];

    //     const title = message?.[langItem]?.type || "Unknown error";
    //     const description = message?.[langItem]?.description || "Unknown error";
    //     const icon = (message?.[langItem]?.type === "Thành công" || message?.[langItem]?.type === "Success") ? "success" : "error";

    //     Swal.fire({
    //         title,
    //         text: description,
    //         icon,
    //         showConfirmButton: false,
    //         timer: 1500,
    //     }).then(() => {
    //         if (icon === "success") {
    //             window.location.reload();

    //         }
    //     });
    // };

    useEffect(() => {
        fetch(`${proxy}/auth/u/${user.username}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { data } = resp;
       
                if (data != undefined) {
                    setProfile(data);
                    setEditUser(data)
              
                }
            })
    }, [])
    useEffect(() => {
      
    }, [profile])
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setProfile({ ...profile, avatar: e.target.result });

                // Send the image data to the server for processing
                fetch(`${proxy}/auth/self/avatar`, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        Authorization: _token,
                    },
                    body: JSON.stringify({ image: e.target.result }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        const { success, content, status } = data;

                        functions.showApiResponseMessage(status);
                    })
                    .catch((error) => {
                        // Handle any errors that occur during the request
                        console.error("Error uploading image:", error);
                    });
            };
        }
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isValidPhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/; // Kiểm tra 10 chữ số
        return phoneRegex.test(phone);
    };
    const submitUpdate = (e) => {
        e.preventDefault();
        // if (!editUser.fullname || !editUser.role || !editUser.email || !editUser.phone || !editUser.address) {
        //     Swal.fire({
        //         title: "Lỗi!",
        //         text: lang["profile.error.invaliddata"],
        //         icon: "error",
        //         showConfirmButton: false,
        //         timer: 2000,
        //     });
        //     return;
        // }

        const errors = {};

        if (!editUser.fullname) {
            errors.fullname = lang["error.fullname"];
        }
        if (!editUser.role) {
            errors.role = lang["error.permission"];
        }

        if (!editUser.email) {
            errors.email = lang["error.email"];
        } else if (!isValidEmail(editUser.email)) {
            errors.email = lang["error.vaildemail"];
        }
        if (!editUser.phone) {
            errors.phone = lang["error.phone"];
        }
        else if (!isValidPhone(editUser.phone)) {
            errors.phone = lang["error.vaildphone"];
        }
        if (!editUser.address) {
            errors.address = lang["error.address"];
        }



        if (Object.keys(errors).length > 0) {
            setErrorMessagesedit(errors);
            return;
        }
        const requestBody = {
            account: {
                ...editUser
            }
        };
        // console.log(requestBody)
        fetch(`${proxy}/auth/self/info`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(requestBody)

        })
            .then(res => res.json())
            .then((resp) => {
                const { success, content, status } = resp;
                // console.log(resp)
                if (success) {
                    const stringifiedUser = JSON.stringify(requestBody.account)
                    localStorage.setItem("user", stringifiedUser)
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
                            <h4>{lang["profile"]}</h4>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="heading1 margin_0">
                                        <h5>{lang["profile user"]}</h5>
                                    </div>
                                    {user.role !== "uad" ? (
                                        <i className="fa fa-edit size pointer" data-toggle="modal" data-target="#editMember"></i>
                                    ) : null

                                    }

                                </div>
                                <div class="modal fade" tabindex="-1" role="dialog" id="editMember" aria-labelledby="edit" aria-hidden="true">
                                    <div class="modal-dialog modal-lg modal-dialog-center" role="document">
                                        <div class="modal-content p-md-3">
                                            <div class="modal-header">
                                                <h4 class="modal-title">{lang["profile.title"]} </h4>

                                                {/* <button class="close" type="button" onClick={handleCloseModal} data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> */}
                                            </div>
                                            <div class="modal-body">
                                                <form>
                                                    <div class="row">
                                                        <div class="form-group col-lg-6">
                                                            <label class="font-weight-bold text-small" for="firstname">{lang["fullname"]}<span className='red_star ml-1'>*</span></label>
                                                            <input type="text" class="form-control" value={editUser.fullname} onChange={
                                                                (e) => { setEditUser({ ...editUser, fullname: e.target.value }) }
                                                            } placeholder={lang["p.fullname"]} />
                                                            {errorMessagesedit.fullname && <span class="error-message">{errorMessagesedit.fullname}</span>}
                                                        </div>


                                                        <div class="form-group col-lg-12">
                                                            <label class="font-weight-bold text-small" for="email">{lang["email"]}<span class="red_star ml-1">*</span></label>
                                                            <input type="email" class="form-control" value={editUser.email} onChange={
                                                                (e) => { setEditUser({ ...editUser, email: e.target.value }) }
                                                            } placeholder={lang["p.email"]} />
                                                            {errorMessagesedit.email && <span class="error-message">{errorMessagesedit.email}</span>}
                                                        </div>
                                                        <div class="form-group col-lg-6">
                                                            <label class="font-weight-bold text-small" for="phone">{lang["phone"]}<span class="red_star ml-1">*</span></label>
                                                            <input type="phone" class="form-control" value={editUser.phone} onChange={
                                                                (e) => { setEditUser({ ...editUser, phone: e.target.value }) }
                                                            } placeholder={lang["p.phone"]} />
                                                            {errorMessagesedit.phone && <span class="error-message">{errorMessagesedit.phone}</span>}
                                                        </div>


                                                        <div class="form-group col-lg-12">
                                                            <label class="font-weight-bold text-small" for="projectdetail">{lang["address"]}<span class="red_star ml-1">*</span></label>
                                                            <textarea maxlength="500" rows="5" type="text" class="form-control" value={editUser.address} onChange={
                                                                (e) => { setEditUser({ ...editUser, address: e.target.value }) }
                                                            } placeholder={lang["p.address"]} />
                                                            {errorMessagesedit.address && <span class="error-message">{errorMessagesedit.address}</span>}
                                                        </div>
                                                        <div class="form-group col-lg-12">
                                                            <label class="font-weight-bold text-small" for="projectdetail">{lang["note"]}</label>
                                                            <textarea maxlength="500" rows="5" type="text" class="form-control" value={editUser.note} onChange={
                                                                (e) => { setEditUser({ ...editUser, note: e.target.value }) }
                                                            } placeholder={lang["p.note"]} />

                                                        </div>

                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" onClick={submitUpdate} class="btn btn-success">{lang["btn.update"]}</button>
                                                <button type="button" data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="full price_table padding_infor_info">
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="full dis_flex center_text">
                                            <div className="profile_img" onClick={handleClick}>
                                                <img
                                                    width="180"
                                                    className="rounded-circle"
                                                    src={profile.avatar && profile.avatar.length < 255 ? (proxy + profile.avatar) : profile.avatar}
                                                    alt="#"
                                                />
                                                <input type="file"
                                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                                    ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
                                            </div>
                                            <div class="profile_contant">
                                                <div class="contact_inner">
                                                    <h3 class="mt-2">{profile.fullname || "Administrator"}</h3>
                                                    <ul class="list-unstyled">
                                                        {/* <li>{lang["username"]}: {profile.username}</li> */}
                                                        <li class="mt-2">{lang["permission"]}: {profile.role === "ad" ? lang["administrator"] :
                                                            profile.role === "pm" ? lang["uprojectmanager"] :
                                                                profile.role === "pd" ? lang["normal"] :
                                                                    profile.role === "ps" ? "Người theo dõi dự án" :
                                                                        profile.role}</li>
                                                        <li class="mt-2"><i class="fa fa-envelope-o"></i> : {profile.email || "nhan.to@mylangroup.com"}</li>
                                                        <li class="mt-2"> <i class="fa fa-phone"></i> : {profile.phone || "0359695554"}</li>
                                                        <li class="mt-2">{lang["address"]}: {profile.address || "Phong Thạnh, Cầu Kè, Trà Vinh"}</li>
                                                        <li class="mt-2">{lang["note"]}: {profile.note || lang["note"]}</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                    <div class="col-lg-4">

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