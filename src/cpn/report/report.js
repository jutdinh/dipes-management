
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
                        dispatch({
                            branch: "default",
                            type: "setProjects",
                            payload: {
                                projects: data
                            }
                        })
                    }
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
    console.log(projects)

    return (


        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["report"]}</h4>

                            <img className="ml-auto mr-2" width={36}  src="/assets/icon/viewmode/data-analytics.png" />

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
                                <div class="col-md-12 col-lg-12 bordered">
                                        <p class="font-weight-bold">Tên dự án: </p>
                                        <p class="font-weight-bold">Mã dự án:  </p>
                                        <p class="font-weight-bold">Ngày tạo:  </p>
                                        <p class="font-weight-bold">Trạng thái:  </p>
                                        <button type="button" class="btn btn-primary  mt-2" >
                                               Xuất
                                            </button>
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

