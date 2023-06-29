import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Label, LabelList, CartesianGrid, Tooltip, Legend,
} from 'recharts';
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
                    // window.location = "/404-not-found"
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
                    // window.location = "/404-not-found"
                }
            })
    }, [])


    const [statis, setStatis] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/projects/statistic`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {

                    console.log(data.annualStatistic)
                    setStatis(data.annualStatistic);


                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    console.log(statis)

    const mapStatus = {
        "1": "Khởi tạo",
        "2": "Thực hiện",
        "3": "Triển khai",
        "4": "Hoàn thành",
        "5": "Tạm dừng",
    };

    const dataKeyY = "y";

    // const processData = (statis) => {
    //     return statis.map((item) => {
    //       let obj = { XAxisData: item.year };

    //       for (const key in item) {
    //         if (key !== "year") {
    //           obj[mapStatus[key]] = item[key];
    //         }
    //       }

    //       return obj;
    //     });
    //   };
    const processData = (statis) => {
        return statis.map((item) => {
            let obj = { XAxisData: item.year, y: 0, z: 1 };
            let totalProjects = 0;

            for (const key in item) {
                if (key !== "year") {
                    const projectCount = item[key];
                    obj[mapStatus[key]] = projectCount;
                    totalProjects += projectCount;
                }
            }

            obj.y = totalProjects;
            return obj;
        });
    };

    const data = processData(statis);





    const CustomTooltipStack = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const filteredPayload = payload.filter((pld) => pld.dataKey !== 'z');
            const totalValue = filteredPayload.reduce((sum, pld) => sum + pld.value, 0);
            if (filteredPayload.length > 0) {
                return (
                    <div className="custom-tooltip" style={{ textAlign: 'center', background: '#d8e2ed', padding: '10px' }}>
                        <p className="label" >{`Năm ${label}: ${totalValue} dự án`}</p>
                        <div style={{ display: 'inline', justifyContent: 'center' }}>
                            {filteredPayload.map((pld) => (
                                <div style={{ padding: '15px', textAlign: 'left' }}>
                                    <div style={{ color: pld.fill }}>{pld.dataKey}: {pld.value}</div>

                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        }
        return null;
    };


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const filteredPayload = payload.filter((pld) => pld.dataKey !== 'z');
            const totalValue = filteredPayload.reduce((sum, pld) => sum + pld.value, 0);
            if (filteredPayload.length > 0) {
                return (
                    <div className="custom-tooltip" style={{ textAlign: 'center', background: '#d8e2ed', padding: '10px' }}>
                        <p className="label">{`Năm ${label}: ${totalValue} dự án`}</p>
                        <div style={{ display: 'inline', justifyContent: 'center' }}>
                            {filteredPayload.map((pld) => (
                                <div style={{ padding: '15px', textAlign: 'left' }}>
                                    <div style={{ color: pld.fill }}>{pld.dataKey}: {pld.value}</div>

                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        }
        return null;
    };

    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, value, dataKey } = props;
        let labelValue;
        let yPos;// Vị trí y nằm giữa cột
        if (dataKey != 'y') {
            labelValue = value === 0 ? '' : value;
            yPos = y + height / 2; // Giữ nhãn ở giữa thanh
        } else {
            labelValue = `${value} dự án`;
            yPos = y - 20; // Di chuyển nhãn lên phía trên thanh. Bạn có thể điều chỉnh giá trị này nếu cần.
        }
        return (
            <text x={x + width / 2} y={yPos} fill="#ffffff" fontSize={18} fontWeight={10} textAnchor="middle" dominantBaseline="middle">
                {labelValue}
            </text>
        );
    };








    return (

        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["home"]}</h4>

                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-6 col-lg-6">
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
                    <div class="col-md-6 col-lg-6">
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
                    {/* <div class="col-md-6 col-lg-3">
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
                    </div> */}
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
                                    <h2>Biểu đồ cột thống kê dự án qua các năm</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">

                                <BarChart
                                    style={{ margin: 'auto', display: 'block' }}
                                    width={700}
                                    height={500}
                                    data={data}
                                    margin={{
                                        top: 25, right: 30, left: 20, bottom: 5,
                                    }}>
                                    <XAxis dataKey="XAxisData" >
                                        <Label value="Năm" fontSize={16} position="insideBottomRight" />
                                    </XAxis>
                                    <YAxis>
                                        <Label value="Số dự án" fontSize={16} angle={-90} position='insideLeft' />
                                    </YAxis>
                                    <CartesianGrid strokeDasharray="1 1" />

                                    <Tooltip
                                        content={<CustomTooltipStack />}
                                        cursor={{ fill: "transparent" }}
                                        isAnimationActive={true}
                                        animationEasing="ease-out"
                                        position={{ x: 600, y: 25 }}
                                    />
                                    <Legend />
                                    <Bar barSize={55} dataKey="Khởi tạo" stackId="a" fill="#1ed085" >
                                        <LabelList dataKey="Khởi tạo" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar dataKey="Thực hiện" stackId="a" fill="#8884d8" >
                                        <LabelList dataKey="Thực hiện" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar dataKey="Triển khai" stackId="a" fill="#ffc658" >
                                        <LabelList dataKey="Triển khai" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar dataKey="Hoàn thành" stackId="a" fill="#ff8042" >
                                        <LabelList dataKey="Hoàn thành" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar dataKey="Tạm dừng" stackId="a" fill="#FF0000" >
                                        <LabelList dataKey="Tạm dừng" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar barSize={70} dataKey="z" stackId="a" fill="transparent">
                                        <LabelList dataKey={dataKeyY} position="top" fill="#000000" formatter={(value) => `${value} dự án`} />
                                    </Bar>
                                </BarChart>

                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Biểu đồ cột chồng thống kê dự án qua các năm</h2>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <BarChart
                                    style={{ margin: 'auto', display: 'block' }}
                                    width={700}
                                    height={500}
                                    data={data}
                                    margin={{
                                        top: 25, right: 30, left: 20, bottom: 5,
                                    }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="XAxisData" >
                                        <Label value="Năm" fontSize={16} position="insideBottomRight" />
                                    </XAxis>
                                    <YAxis

                                    >
                                        <Label value="Số dự án" angle={-90} fontSize={16} position='insideLeft' />
                                    </YAxis>
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "transparent" }}
                                        isAnimationActive={true}
                                        animationEasing="ease-out"
                                        position={{ x: 550, y: 25 }}
                                    />
                                    <Legend />
                                    {/* <Bar barSize={70} dataKey="z" fill="transparent">
                                                <LabelList dataKey="displayY" position="top" fill="#000000" />
                                            </Bar> */}

                                    <Bar barSize={100} dataKey="Khởi tạo" fill="#1ed085" >
                                        <LabelList dataKey="Khởi tạo" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar barSize={100} dataKey="Thực hiện" fill="#8884d8"  >
                                        <LabelList dataKey="Thực hiện" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar barSize={100} dataKey="Triển khai" fill="#ffc658" >
                                        <LabelList dataKey="Triển khai" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar barSize={100} dataKey="Hoàn thành" fill="#ff8042" >
                                        <LabelList dataKey="Hoàn thành" position="inside" content={renderCustomizedLabel} />
                                    </Bar>
                                    <Bar barSize={100} dataKey="Tạm dừng" fill="#FF0000" >
                                        <LabelList dataKey="Tạm dừng" position="inside" content={renderCustomizedLabel} />
                                    </Bar>

                                </BarChart>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}