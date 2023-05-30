import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from "react";
import Swal from 'sweetalert2';
import { Profile } from '.';
export default (props) => {
    const { lang, proxy } = useSelector(state => state);

    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const user = JSON.parse(stringifiedUser)
    const [profile, setProfile] = useState({});
    useEffect(() => {
        fetch(`${proxy}/auth/u/${user.username}`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { data } = resp;
                console.log(resp)
                if (data != undefined) {
                    setProfile(data);
                    console.log(data)
                }
            })
    }, [])
    useEffect(() => {
        console.log(profile)
    }, [profile])
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        // Xử lý tệp tin tại đây
        if (file) {
            if (file != undefined) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    setProfile({ ...profile, avatar: e.target.result })
                    fetch(`${proxy}/auth/self/avatar`, {
                        method: "PUT",
                        headers: {
                            "content-type": "application/json",
                            Authorization: _token
                        },
                        body: JSON.stringify({ image: e.target.result })
                    }).then(res => res.json()).then(data => {
                        console.log(data)
                    })
                }
            }
        }
    };
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
                                <div class="heading1 margin_0">
                                    <h5>{lang["profile user"]}</h5>
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
                                                    accept='image/*'
                                                    ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
                                            </div>
                                            <div class="profile_contant">
                                                <div class="contact_inner">
                                                    <h3>{profile.fullname || "Administrator"}</h3>
                                                    <ul class="list-unstyled">
                                                        <li><i class="fa fa-envelope-o"></i> : {profile.email || "nhan.to@mylangroup.com"}</li>
                                                        <li> <i class="fa fa-phone"></i> : {profile.phone || "0359695554"}</li>
                                                        <li>Địa chỉ: {profile.address || "Phong Thạnh, Cầu Kè, Trà Vinh"}</li>
                                                        <li>Ghi chú: {profile.note || "Ghi chú"}</li>
                                                    </ul>
                                                </div>
                                                <div class="user_progress_bar">
                                                    <div class="progress_bar">
                                                        <span class="skill" style={{ width: 500 }}>Web Applications <span class="info_valume">85%</span></span>
                                                        <div class="progress skill-bar ">
                                                            <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: 500 }}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="full inner_elements margin_top_30">
                                            <div class="tab_style2">
                                                <div class="tabbar">
                                                    <nav>
                                                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#recent_activity" role="tab" aria-selected="true">{lang["tasks"]}</a>
                                                            <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#project_worked" role="tab" aria-selected="false">{lang["projects worked"]}</a>
                                                        </div>
                                                    </nav>
                                                    <div class="tab-content" id="nav-tabContent">
                                                        <div class="tab-pane fade show active" id="recent_activity" role="tabpanel" aria-labelledby="nav-home-tab">
                                                            <div class="msg_list_main">
                                                                <ul class="msg_list">
                                                                    <li>
                                                                        {/* <span><img src="images/layout_img/msg2.png" class="img-responsive" alt="#" /></span> */}
                                                                        <span>
                                                                            <span class="name_user">Yêu cầu 1</span>
                                                                            <span class="msg_user">Mô tả</span>< br />
                                                                            <span class="msg_user">Dự án: Tên dự án</span>
                                                                            <span class="time_ago">12 {lang["min ago"]}</span>
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        {/* <span><img src="images/layout_img/msg2.png" class="img-responsive" alt="#" /></span> */}
                                                                        <span>
                                                                            <span class="name_user">Yêu cầu 2</span>
                                                                            <span class="msg_user">Mô tả</span>< br />
                                                                            <span class="msg_user">Dự án: Tên dự án</span>
                                                                            <span class="time_ago">12 {lang["min ago"]}</span>
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div class="tab-pane fade" id="project_worked" role="tabpanel" aria-labelledby="nav-profile-tab">
                                                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
                                                                quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
                                                                qui ratione voluptatem sequi nesciunt.
                                                            </p>
                                                        </div>
                                                    </div>
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