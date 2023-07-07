import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import {
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Label, LabelList, CartesianGrid, Tooltip, Legend,
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

    const [statisStatus, setStatisStatus] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/projects/statistic/status/over/years`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, statistic, status, content } = resp;
                // console.log(resp)
                if (success) {
                    const dataArray = Object.keys(statistic).map((key) => {
                        return {
                            "status": key,
                            ...statistic[key]
                        };
                    });
                    setStatisStatus(dataArray);
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    console.log(statisStatus)

    const [statisLead, setStatisLead] = useState([]);

    useEffect(() => {
        fetch(`${proxy}/projects/statistic/manager/and/their/projects`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, statistic, status, content } = resp;
                // console.log(resp)
                if (success) {

                    setStatisLead(statistic);
                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    console.log(statisLead)
    const mapStatus = {
        "1": lang["initialization"],
        "2": lang["implement"],
        "3": lang["deploy"],
        "4": lang["complete"],
        "5": lang["pause"]
    };

    const dataKeyY = "y";

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
    

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const filteredPayload = payload.filter((pld) => pld.dataKey !== 'z');
            const totalValue = filteredPayload.reduce((sum, pld) => sum + pld.value, 0);
            if (filteredPayload.length > 0) {
                return (
                    <div className="custom-tooltip" style={{ textAlign: 'center', background: '#d8e2ed', padding: '10px' }}>
                        <p className="label">{`${lang["year"]} ${label}: ${totalValue} ${lang["projects"]}`}</p>
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
    // const status = [
    //     { id: 0, label: lang["initialization"], value: 1, color: "#1ed085" },
    //     { id: 1, label: lang["implement"], value: 2, color: "#8884d8" },
    //     { id: 2, label: lang["deploy"], value: 3, color: "#ffc658" },
    //     { id: 3, label: lang["complete"], value: 4, color: "#ff8042" },
    //     { id: 4, label: lang["pause"], value: 5, color: "#FF0000" }
    // ]
    let statusNames = {
        "0": lang["initialization"],
        "1": lang["implement"],
        "2": lang["deploy"],
        "3": lang["complete"],
        "4": lang["pause"]
    };
    let outputData = Object.keys(statisStatus).map(key => ({
        name: statusNames[key],
        value: statisStatus[key].total
    }));
    let totalSum = statisStatus.reduce((sum, statis) => sum + statis.total, 0);



    const COLORS = ['#1ed085', '#8884d8', '#ffc658', '#ff8042', "#FF0000"];


    let outputDataLead = Object.keys(statisLead).map(key => ({
        name: statisLead[key].fullname,
        value: statisLead[key].total,
        avatar: statisLead[key].avatar
    }));
    console.log(outputDataLead)
    let totalSumLead = statisStatus.reduce((sum, statis) => sum + statis.total, 0);



    const COLORSLEAD = ['#1ed085', '#8884d8', '#ffc658', '#ff8042', "#FF0000"];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel1 = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    console.log(outputDataLead)
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
                <div class="row column1">
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["project-status-chart"]}</h5>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info_home">
                                <div className="row">
                                    <div className="col-md-5 d-flex justify-content-center">
                                        <div className="my-auto">
                                            <PieChart width={300} height={300}>
                                                <Pie
                                                    dataKey="value"
                                                    startAngle={360}
                                                    endAngle={0}
                                                    data={outputData}
                                                    cx="45%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    label
                                                    labelLine={{ outerRadius: '90%' }}
                                                    innerRadius={60}
                                                >
                                                    {
                                                        outputData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                                    }
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <div class="table-responsive mt-4">
                                            {statisStatus && statisStatus.length > 0 ? (
                                                <table class="table table1 no-border-table no-border ">
                                                    <thead class="no-border" style={{ borderCollapse: 'inherit' }}>
                                                        <tr>
                                                            <th>{lang["projectstatus"]}</th>
                                                            <th style={{}}>{totalSum} {lang["project"]}</th>
                                                            <th>%</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {statisStatus?.map((statis, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div style={{
                                                                        display: 'inline-block',
                                                                        width: '10px',
                                                                        height: '10px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: COLORS[index % COLORS.length],
                                                                        marginRight: '10px'
                                                                    }}></div>
                                                                    {statusNames[String(index)]}
                                                                </td>
                                                                <td>{statis.total}</td>
                                                                <td>{statis.percentage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div class="list_cont ">
                                                    <p>Not Found !</p>
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["project-lead-chart"]}</h5>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info_home">
                                <div className="row">
                                    <div className="col-md-5 d-flex justify-content-center">
                                        <div className="my-auto">
                                            <PieChart width={250} height={300}>
                                                <Pie
                                                    data={outputDataLead}
                                                    cx="45%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel1}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {
                                                        outputDataLead.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORSLEAD[index % COLORSLEAD.length]} />)
                                                    }
                                                </Pie>
                                            </PieChart>
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <div class="table-responsive mt-4">
                                            {statisLead && statisLead.length > 0 ? (
                                                <table class="table table1 no-border-table no-border ">
                                                    <thead class="no-border" style={{ borderCollapse: 'inherit' }}>
                                                        <tr>
                                                            <th>{lang["projects manager"]}</th>
                                                            <th>{totalSumLead} {lang["project"]}</th>
                                                            <th>%</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {statisLead?.map((statis, index) => (
                                                            <tr key={index}>

                                                                <td>
                                                                    <div class="profile_contacts_chart">
                                                                        <div style={{
                                                                            display: 'inline-block',
                                                                            width: '10px',
                                                                            height: '10px',
                                                                            borderRadius: '50%',
                                                                            backgroundColor: COLORSLEAD[index % COLORSLEAD.length],
                                                                            marginRight: '10px'
                                                                        }}></div>
                                                                        <img class="img-responsive circle-image-home mr-1" src={proxy + statis.avatar} alt="#" />
                                                                        {statis.fullname}
                                                                    </div>
                                                                </td>
                                                                <td>{statis.total}</td>
                                                                <td>{statis.percentage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div class="list_cont ">
                                                    <p>Not Found !</p>
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-lg-12 col-lg-3">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["project-status-chart-year"]}</h5>
                                </div>
                            </div>
                            <div class="map_section padding_infor_info">
                                <ResponsiveContainer width="95%" height={500}>
                                    <BarChart
                                        style={{ margin: 'auto', display: 'block' }}
                                        width={1100}
                                        height={700}
                                        data={data}
                                        margin={{
                                            top: 25, right: 30, left: 20, bottom: 5,
                                        }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="XAxisData" >
                                            <Label value={lang["year"]} fontSize={16} position="insideBottomRight" />
                                        </XAxis>
                                        <YAxis

                                        >
                                            <Label value={lang["project-number"]} angle={-90} fontSize={16} position='insideLeft' />
                                        </YAxis>
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ fill: "transparent" }}
                                            isAnimationActive={true}
                                            animationEasing="ease-out"
                                            position={{ x: 1100, y: 10 }}
                                        />
                                        <Legend />
                                        {/* <Bar barSize={70} dataKey="z" fill="transparent">
                                                <LabelList dataKey="displayY" position="top" fill="#000000" />
                                            </Bar> */}

                                        <Bar barSize={100} dataKey={lang["initialization"]} fill="#1ed085" >
                                            <LabelList dataKey={lang["initialization"]} position="inside" content={renderCustomizedLabel} />
                                        </Bar>
                                        <Bar barSize={100} dataKey={lang["implement"]} fill="#8884d8"  >
                                            <LabelList dataKey={lang["implement"]} position="inside" content={renderCustomizedLabel} />
                                        </Bar>
                                        <Bar barSize={100} dataKey={lang["deploy"]} fill="#ffc658" >
                                            <LabelList dataKey={lang["deploy"]} position="inside" content={renderCustomizedLabel} />
                                        </Bar>
                                        <Bar barSize={100} dataKey={lang["complete"]} fill="#ff8042" >
                                            <LabelList dataKey={lang["complete"]} position="inside" content={renderCustomizedLabel} />
                                        </Bar>
                                        <Bar barSize={100} dataKey={lang["pause"]} fill="#FF0000" >
                                            <LabelList dataKey={lang["pause"]} position="inside" content={renderCustomizedLabel} />
                                        </Bar>

                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}