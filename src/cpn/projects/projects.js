import { useSelector } from "react-redux"

import { Header, SearchBar, Dropdown } from "../common"

export default () => {
    const { lang } = useSelector(state => state);

    const sortOptions = [
        { id: 0, label: "Mới nhất", value: "latest" },
        { id: 1, label: "Cũ nhất", value: "oldest" },
    ]

    const projects = [

    ]

    const sortProjects = () => {

    }

    // const history = useHistory();

    // const handleRowClick = (pageUrl) => {
    //     history.push(pageUrl);
    // };
    return (
        <div className="container-fluid">
            <div class="midde_cont">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h2>{lang["projects.title"]}</h2>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h2>Project <small>( Listing Design )</small></h2>
                                </div>
                            </div>
                            <div class="full price_table padding_infor_info">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="table-responsive-sm">
                                            <table class="table table-striped table-hover-custom projects">
                                                <thead class="thead-dark">

                                                    <tr >
                                                        <th style={{ width: "2%" }}>No</th>
                                                        <th style={{ width: "30%" }}>Project Title</th>
                                                        <th>Members</th>
                                                        <th>Project Progress</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs">--</button>
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs">--</button>
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs" 
                                                                onClick={ () => { window.location = "/project/3" } }
                                                            >5--</button>
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs">--</button>
                                                        </td>
                                                    </tr>
                                                   
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs">--</button>
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td>1</td>
                                                        <td>
                                                            <a>Sed ut perspiciatis unde omnis iste natus error sit volup tatem accus antium doloremque</a>
                                                        </td>
                                                        <td>
                                                            <ul class="list-inline">
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg2.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                                <li>
                                                                    <img width="40" src="images/layout_img/msg3.png" class="rounded-circle" alt="#" />
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td class="project_progress">
                                                            <div class="progress progress_sm">
                                                                <div class="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100" style={{ width: "98%" }}></div>
                                                            </div>
                                                            <small>Almost Completed</small>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-success btn-xs">Success</button>
                                                        </td>
                                                        <td>
                                                            <button type="button" class="btn btn-info btn-xs">--</button>
                                                        </td>
                                                    </tr>
                                                   

                                                </tbody>
                                            </table>
                                        </div>
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