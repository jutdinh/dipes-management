import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import responseMessages from "../enum/response-code";
import Swal from 'sweetalert2';
import { Header } from '../common';
import $ from 'jquery';

export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const dispatch = useDispatch()
    const _token = localStorage.getItem("_token");
    // const stringifiedUser = localStorage.getItem("user");
    // const users = JSON.parse(stringifiedUser)
    const [project, setProject] = useState({ project_type: "database" });
    const [projects, setProjects] = useState([]);
    const [loaded, setLoaded] = useState(false);

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
                    setLoaded(true)
                } else {
                    window.location = "/404-not-found"
                }

            })

    }, [])



    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["key manager.title"]}</h4>
                            {
                                ["ad", "uad"].indexOf(auth.role) != -1 ?
                                    <button type="button" id="create-btn" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addProject">
                                        <i class="fa fa-plus"></i>
                                    </button> :
                                    null
                            }
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