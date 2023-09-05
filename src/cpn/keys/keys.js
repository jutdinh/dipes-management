import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import responseMessages from "../enum/response-code";
import { StatusEnum, StatusTask } from '../enum/status';
import Swal from 'sweetalert2';
import { Header } from '../common';
import $, { data } from 'jquery';
import { formatDate } from '../../redux/configs/format-date';
import copy from 'copy-to-clipboard';
import { da } from 'date-fns/locale';
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
    const [key, setKey] = useState({ MAC: "", activated: true });
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        fetch(`${proxy}/activation/keys`, {
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
                        setProjects(data);

                    }
                    setLoaded(true)
                } else {
                    window.location = "/404-not-found"
                }

            })

    }, [])
    const handleCopy = (data) => {
        // console.log(data)
        copy(data.key);

        setIsCopied(true);


        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage =11;

    const indexOfLastKey = currentPage * rowsPerPage;
    const indexOfFirstKey = indexOfLastKey - rowsPerPage;
    const currentKey = projects.slice(indexOfFirstKey, indexOfLastKey);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(projects.length / rowsPerPage);
    // console.log(projects)
    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["key manager.title"]}</h4>
                            {/* {
                                ["ad", "uad"].indexOf(auth.role) != -1 ?
                                    <button type="button" id="create-btn" class="btn btn-primary custom-buttonadd ml-auto" data-toggle="modal" data-target="#addProject">
                                        <i class="fa fa-plus"></i>
                                    </button> :
                                    null
                            } */}
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
                                                                <div class="col-md-12">
                                                                    <div class="table-responsive">
                                                                        {
                                                                            currentKey && currentKey.length > 0 ? (
                                                                                <>
                                                                                    <table class="table table-striped ">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th class="font-weight-bold" style={{ width: "30px" }} scope="col">{lang["log.no"]}</th>
                                                                                                <th class="font-weight-bold" style={{ width: "200px" }} scope="col">{lang["projectname"]}</th>
                                                                                                <th class="font-weight-bold" style={{ width: "100px" }} scope="col">{lang["projectcode"]}</th>
                                                                                                <th class="font-weight-bold" style={{ width: "180px" }} scope="col">UUID:</th>
                                                                                                <th class="font-weight-bold align-center" style={{ width: "300px" }} scope="col">{lang["key"]}</th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {currentKey.map((project, index) => (
                                                                                                <tr key={index}>
                                                                                                    <td>{indexOfFirstKey + index + 1}</td>
                                                                                                    <td>{project.project?.project_name?.slice(0, 55)}{project.project?.project_name?.length > 55 ? "..." : ""}</td>
                                                                                                    <td>{project.project.project_code}</td>
                                                                                                    <td>{project.uuid}</td>
                                                                                                    <td>
                                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                            <textarea
                                                                                                                type="text"
                                                                                                                class="form-control"
                                                                                                                value={project.key}
                                                                                                                style={{ minHeight: 50 }}
                                                                                                                spellCheck={false}
                                                                                                            />
                                                                                                            <i
                                                                                                                className="fa fa-clipboard ml-3 pointer"
                                                                                                                onClick={() => handleCopy(project)}
                                                                                                                style={{ fontSize: '24px' }}
                                                                                                                title='Copy'
                                                                                                            ></i>
                                                                                                        </div>

                                                                                                        {isCopied &&
                                                                                                            <div className="copy-alert" style={{
                                                                                                                animation: 'fadeInOut 3s ease-out',
                                                                                                                position: 'absolute',
                                                                                                                top: '1%',
                                                                                                                left: '40%',
                                                                                                                transform: 'translate(10px, -50%)',
                                                                                                                zIndex: 1
                                                                                                            }}>
                                                                                                                <i className='fa fa-check-circle mr-1 mt-1'></i> {lang["copied"]}
                                                                                                            </div>
                                                                                                        }
                                                                                                    </td>


                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                            ) : (
                                                                                <div class="d-flex justify-content-center align-items-center w-100 responsive-div">
                                                                                    {lang["projects.noprojectfound"]}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                                        <p>
                                                                            {lang["show"]} {indexOfFirstKey + 1}-{Math.min(indexOfLastKey, projects.length)} {lang["of"]} {projects.length} {lang["results"]}
                                                                        </p>
                                                                        <nav aria-label="Page navigation example">
                                                                            <ul className="pagination mb-0">
                                                                                {/* Nút đến trang đầu */}
                                                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                                    <button className="page-link" onClick={() => paginate(1)}>
                                                                                        &#8810;
                                                                                    </button>
                                                                                </li>
                                                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                                    <button className="page-link" onClick={() => paginate(Math.max(1, currentPage - 1))}>
                                                                                        &laquo;
                                                                                    </button>
                                                                                </li>
                                                                                {currentPage > 2 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                                {Array(totalPages).fill().map((_, index) => {
                                                                                    if (
                                                                                        index + 1 === currentPage ||
                                                                                        (index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1)
                                                                                    ) {
                                                                                        return (
                                                                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                                                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                                                                                    {index + 1}
                                                                                                </button>
                                                                                            </li>
                                                                                        );
                                                                                    }
                                                                                    return null;  // Đảm bảo trả về null nếu không có gì được hiển thị
                                                                                })}
                                                                                {currentPage < totalPages - 1 && <li className="page-item"><span className="page-link">...</span></li>}
                                                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                                    <button className="page-link" onClick={() => paginate(Math.min(totalPages, currentPage + 1))}>
                                                                                        &raquo;
                                                                                    </button>
                                                                                </li>
                                                                                {/* Nút đến trang cuối */}
                                                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                                    <button className="page-link" onClick={() => paginate(totalPages)}>
                                                                                        &#8811;
                                                                                    </button>
                                                                                </li>
                                                                            </ul>
                                                                        </nav>
                                                                    </div>
                                                                </div>
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