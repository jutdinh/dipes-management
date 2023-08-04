
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
    BarChart, Bar, XAxis, YAxis, Label, LabelList, CartesianGrid, Tooltip, Legend,
} from 'recharts';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const dispatch = useDispatch()
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const [tab, setTab] = useState(1);
   
    const [data, setData] = useState([]);
    const chartTab = () => {
        setTab(!tab)
    }
    

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

                    // console.log(data.annualStatistic)
                    setStatis(data.annualStatistic);
                    setData(processData(data.annualStatistic))

                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    // console.log(statis)
   
    const mapStatus = {
        "1": lang["initialization"],
        "2": lang["implement"],
        "3": lang["deploy"],
        "4": lang["complete"],
        "5": lang["pause"]
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

    const CustomTooltipStack = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const filteredPayload = payload.filter((pld) => pld.dataKey !== 'z');
            const totalValue = filteredPayload.reduce((sum, pld) => sum + pld.value, 0);
            if (filteredPayload.length > 0) {
                return (
                    <div className="custom-tooltip" style={{ textAlign: 'center', background: '#e9eef4', padding: '10px' }}>
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const filteredPayload = payload.filter((pld) => pld.dataKey !== 'z');
            const totalValue = filteredPayload.reduce((sum, pld) => sum + pld.value, 0);
            if (filteredPayload.length > 0) {
                return (
                    <div className="custom-tooltip" style={{ textAlign: 'center', background: '#e9eef4', padding: '10px' }}>
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
        // console.log(props)
        let labelValue;
        let yPos;// Vị trí y nằm giữa cột
        if (dataKey != 'y') {
            labelValue = value === 0 ? '' : value;
            yPos = y + height / 2; // Giữ nhãn ở giữa thanh
        } else {
            labelValue = `${value} ${lang["projects"]}`;
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
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["statistic"]}</h4>
                            <img className="ml-auto mr-2" width={36} onClick={chartTab} src="/assets/icon/viewmode/data-analytics.png" />
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            {/* <div class="full graph_head">
                            <div class="heading1 margin_0">
                                <div className="row justify-content-end">
                                    <div className="col-auto">
                                        <h4>{lang["accounts list"]}</h4>
                                    </div>

                                </div>
                            </div>
                        </div> */}
                            {/* List user */}
                            <div class="full price_table padding_infor_info">
                                <div class="container-fluid">
                                    {tab &&
                                        <div class="container">
                                            <BarChart
                                                style={{ margin: 'auto', display: 'block' }}
                                                width={1100}
                                                height={700}
                                                data={data}
                                                margin={{
                                                    top: 25, right: 30, left: 20, bottom: 5,
                                                }}>
                                                <XAxis dataKey="XAxisData" >
                                                    <Label value={lang["year"]} fontSize={16} position="insideBottomRight" />
                                                </XAxis>
                                                <YAxis>
                                                    <Label value={lang["project-number"]} fontSize={16} angle={-90} position='insideLeft' />
                                                </YAxis>
                                                <CartesianGrid strokeDasharray="1 1" />
                                                <Tooltip
                                                    content={<CustomTooltipStack />}
                                                    cursor={{ fill: "transparent" }}
                                                    isAnimationActive={true}
                                                    animationEasing="ease-out"
                                                    position={{ x: 1100, y: 25 }}
                                                />
                                                <Legend />
                                              <Bar barSize={100} dataKey={lang["initialization"]} stackId="a" fill="#1ed085" >
                                                    <LabelList dataKey={lang["initialization"]} position="inside" content={renderCustomizedLabel} />
                                                </Bar>
                                                <Bar dataKey={lang["implement"]} stackId="a" fill="#8884d8" >
                                                    <LabelList dataKey={lang["implement"]} position="inside" content={renderCustomizedLabel} />
                                                </Bar>
                                                <Bar dataKey={lang["deploy"]} stackId="a" fill="#ffc658" >
                                                    <LabelList dataKey={lang["deploy"]} position="inside" content={renderCustomizedLabel} />
                                                </Bar>
                                                <Bar dataKey={lang["complete"]} stackId="a" fill="#ff8042" >
                                                    <LabelList dataKey={lang["complete"]} position="inside" content={renderCustomizedLabel} />
                                                </Bar>
                                                <Bar dataKey={lang["pause"]} stackId="a" fill="#FF0000" >
                                                    <LabelList dataKey={lang["pause"]} position="inside" content={renderCustomizedLabel} />
                                                </Bar>
                                                <Bar barSize={70} dataKey="z" stackId="a" fill="transparent">
                                                    <LabelList dataKey={dataKeyY} position="top" fill="#000000" formatter={(value) => `${value} ${lang["projects"]}`} />
                                                </Bar>
                                            </BarChart>
                                            {/* <p class="align-center mt-4"> Biểu đồ cột thống kê dự án qua các năm</p> */}
                                        </div>

                                    }


                                    {!tab &&
                                        <div class="container">
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
                                            domain={[0, 'dataMax + 1']}
                                            tickFormatter={(value) => Math.floor(value)}
                                            allowDecimals={false}
                                            tickCount={5}>
                                            
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
                                            {/* <p class="align-center mt-4"> Biểu đồ cột thống kê dự án qua các năm</p> */}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

