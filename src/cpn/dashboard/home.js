import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import { Header } from '../common';
export default () => {
    const { proxy, lang } = useSelector(state => state)
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const user = JSON.parse(stringifiedUser) || {}
    const [activeLink, setActiveLink] = useState("/");

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/projects/all/projects`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log(resp)
                if (success) {
                    if (data != undefined && data.length > 0) {
                        setProjects(data);
                        
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])

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
                        setUsers(data);
                        // console.log(data)
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])





    return (
        
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["home"]}</h4>
                            <p><Header/></p>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30">
                            <div class="couter_icon">
                                <div>
                                    <i class="fa fa-briefcase purple_color2"></i>
                                </div>
                            </div>
                            <div class="counter_no">
                                <div>
                                    <p class="total_no">{projects.length}</p>
                                    <p class="head_couter">{lang["projects"]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30">
                            <div class="couter_icon">
                                <div>
                                    <i class="fa fa-users blue1_color"></i>
                                </div>
                            </div>
                            <div class="counter_no">
                                <div>
                                    <p class="total_no">{users.length}</p>
                                    <p class="head_couter">Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30">
                            <div class="couter_icon">
                                <div>
                                    <i class="fa fa-cloud-download green_color"></i>
                                </div>
                            </div>
                            <div class="counter_no">
                                <div>
                                    <p class="total_no">1,805</p>
                                    <p class="head_couter">Collections</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full counter_section margin_bottom_30">
                            <div class="couter_icon">
                                <div>
                                    <i class="fa fa-comments-o red_color"></i>
                                </div>
                            </div>
                            <div class="counter_no">
                                <div>
                                    <p class="total_no">54</p>
                                    <p class="head_couter">Comments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div class="row column1 social_media_section">
                    <div class="col-md-6 col-lg-3">
                        <div class="full socile_icons fb margin_bottom_30">
                            <div class="social_icon">
                                <i class="fa fa-facebook"></i>
                            </div>
                            <div class="social_cont">
                                <ul>
                                    <li>
                                        <span><strong>35k</strong></span>
                                        <span>Friends</span>
                                    </li>
                                    <li>
                                        <span><strong>128</strong></span>
                                        <span>Feeds</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full socile_icons tw margin_bottom_30">
                            <div class="social_icon">
                                <i class="fa fa-twitter"></i>
                            </div>
                            <div class="social_cont">
                                <ul>
                                    <li>
                                        <span><strong>584k</strong></span>
                                        <span>Followers</span>
                                    </li>
                                    <li>
                                        <span><strong>978</strong></span>
                                        <span>Tweets</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full socile_icons linked margin_bottom_30">
                            <div class="social_icon">
                                <i class="fa fa-linkedin"></i>
                            </div>
                            <div class="social_cont">
                                <ul>
                                    <li>
                                        <span><strong>758+</strong></span>
                                        <span>Contacts</span>
                                    </li>
                                    <li>
                                        <span><strong>365</strong></span>
                                        <span>Feeds</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="full socile_icons google_p margin_bottom_30">
                            <div class="social_icon">
                                <i class="fa fa-google-plus"></i>
                            </div>
                            <div class="social_cont">
                                <ul>
                                    <li>
                                        <span><strong>450</strong></span>
                                        <span>Followers</span>
                                    </li>
                                    <li>
                                        <span><strong>57</strong></span>
                                        <span>Circles</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div class="row column1">
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Line Chart</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <canvas id="line_chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Line Chart</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <canvas id="bar_chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Radar Chart</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <canvas id="radar_chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Pie Chart</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <canvas id="pie_chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}