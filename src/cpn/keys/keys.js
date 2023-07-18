import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import responseMessages from "../enum/response-code";
import { StatusEnum, StatusTask } from '../enum/status';
import Swal from 'sweetalert2';
import { Header } from '../common';
import $, { data } from 'jquery';

export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const dispatch = useDispatch()
    const _token = localStorage.getItem("_token");
    // const stringifiedUser = localStorage.getItem("user");
    // const users = JSON.parse(stringifiedUser)
    const [project, setProject] = useState({ project_type: "database" });
    const [projects, setProjects] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const status = [
        { id: 0, label: lang["initialization"], value: 1, color: "#1ed085" },
        { id: 1, label: lang["implement"], value: 2, color: "#8884d8" },
        { id: 2, label: lang["deploy"], value: 3, color: "#ffc658" },
        { id: 3, label: lang["complete"], value: 4, color: "#ff8042" },
        { id: 4, label: lang["pause"], value: 5, color: "#FF0000" }
    ]


    useEffect(() => {
        fetch(`${proxy}/activation/keys`, {
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
                    setLoaded(true)
                } else {
                    window.location = "/404-not-found"
                }

            })

    }, [])


    console.log(projects)
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
                                            {
                                                loaded ? (
                                                    <>
                                                        {
                                                            projects && projects.length > 0 ? (
                                                                projects.map((item) => (

                                                                    <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
                                                                        <div class="card project-block">
                                                                            <div class="card-body">
                                                                                <div class="row project-name-min-height">
                                                                                    <div class="col-sm-10" >

                                                                                        <h5 class="project-name d-flex align-items-center" >{item.project?.project_name?.slice(0, 55)}{item.project?.project_name?.length > 55 ? "..." : ""}</h5>
                                                                                    </div>

                                                                                    <div class="col-sm-2 pointer scaled-hover">


                                                                                    </div>
                                                                                </div>
                                                                                <p class="card-title font-weight-bold">{lang["projectcode"]}: {item.project.project_code}</p>
                                                                                <p class="card-text">{lang["createby"]}: {item.project.create_by}</p>

                                                                                <p>{lang["time"]}: {
                                                                                    lang["time"] === "Time" ?
                                                                                        item.project.create_at?.replace("lúc", "at") :
                                                                                        item.project.create_at
                                                                                }</p>



                                                                                <div className="d-flex position-relative">
                                                                                    <p class="card-title font-weight-bold mt-1 mr-2">{lang["projectstatus"]}: </p>
                                                                                    <div>
                                                                                        <span className="d-block status-label" style={{
                                                                                            backgroundColor: (status.find((s) => s.value === item.project.project_status) || {}).color
                                                                                        }}>
                                                                                            {(status.find((s) => s.value === item.project.project_status) || {}).label || 'Trạng thái không xác định'}
                                                                                        </span>

                                                                                    </div>

                                                                                </div>
                                                                                <p class="card-title font-weight-bold mt-1 mr-2">{lang["activation"]}:  </p>
                                                                                <p class="mt-1 mr-2">UUID: {item.uuid} </p>
                                                                                <p class="card-title font-weight-bold mt-1 mr-2">{lang["key"]}:  </p>
                                                                                <textarea type="text" class="form-control" value={item.key}
                                                                                    style={{ minHeight: 270 }}
                                                                                    spellCheck={false}
                                                                                />
                                                                                


                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                ))
                                                            ) :
                                                                <div class="d-flex justify-content-center align-items-center w-100 responsive-div">
                                                                    {lang["projects.noprojectfound"]}
                                                                </div>
                                                        }
                                                    </>
                                                ) : (
                                                    <div class="d-flex justify-content-center align-items-center w-100 responsive-div" >
                                                        {/* {lang["projects.noprojectfound"]} */}
                                                        <img width={350} className="scaled-hover-target" src="/images/icon/loading.gif" ></img>

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
            </div >
        </div >
    )
}