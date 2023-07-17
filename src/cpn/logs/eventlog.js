
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const langItem = localStorage.getItem("lang") ? localStorage.getItem("lang") : "Vi";

    const MAX_RECORDS_PER_SHEET = 15;
    const MOVE_STEP = 3
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState({ type: 'info' });
    const [logDetail, setLogDetail] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    const [ currentPage, setCurrentPage ] = useState(5)
    const [ totalPages, setTotalPages ] = useState(0)

    const languages = langItem.toLowerCase();

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const eventType = {}
    eventType[lang["log.information"]] = { id: 0, label: lang["log.information"], value: 1, color: "#3029F7", icon: "fa fa-info-circle size-log " }
    eventType[lang["log.warning"]] = { id: 1, label: lang["log.warning"], value: 2, color: "#f3632e", icon: "fa fa-warning size-log " }
    eventType[lang["log.error"]] = { id: 2, label: lang["log.error"], value: 3, color: "#FF0000", icon: "fa fa-times-circle size-log " }

    useEffect(() => {

        fetch(`${proxy}/logs/${languages}`, {
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
                        const formatedData = data.map(log => {
                            return { ...log, icon: eventType[log.event_type] }
                        })
                        setLogs(formatedData);
                        const total = Math.ceil( formatedData.length / MAX_RECORDS_PER_SHEET )
                        console.log(total)
                        setTotalPages( total )
                    }
                } else {
                    window.location = "/login"
                }
            })
    }, [])
    // console.log(view)
    
    const detailLogs = async (logid) => {
        // console.log(logid)
        setLogDetail(logid)
    };

    

    const submitFilter = (e) => {
        e.preventDefault();
        filter["lang"] = languages



        fetch(`${proxy}/logs/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${_token}`,
            },
            body: JSON.stringify(filter),
        })
            .then(res => res && res.json())
            .then((resp) => {
                if (resp) {
                    const { success, content, data, status } = resp;
                    console.log(resp)
                    if (success) {

                        // window.location.reload();
                        setShowModal(false);

                    } else {
                        Swal.fire({
                            title: "Thất bại!",
                            text: content,
                            icon: "error",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }
                }
            })
    };


    const getPageData = ( pageIndex ) => {
        const firstItemIndex = (pageIndex - 1 ) * MAX_RECORDS_PER_SHEET
        const data = logs.slice( firstItemIndex, firstItemIndex + MAX_RECORDS_PER_SHEET )
        return data ? data : []
    }

    const getRelativeIndex = ( currentPage, step = 2 ) => {
        const indices = []
        for( let i = currentPage - step ; i < currentPage +step ; i++ ){
            if( i > 0  && i <= totalPages){
                indices.push( i )
            }
        }
        return indices
    }

    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title">
                            <h4>{lang["log.title"]}</h4>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["log.statis"]}</h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info-logs">
                                <div class="member-cus">
                                    <div class="msg_list_main">
                                        <div className="row column1 mb-3 mt-3">
                                            <div className="col-lg-3">
                                                <label>{lang["log.type"]}:</label>
                                                <select className="form-control" value={filter.type} onChange={(e) => { setFilter({ ...filter, type: e.target.value }) }}>


                                                    <option value="info">{lang["log.information"]}</option>
                                                    <option value="warn">{lang["log.warning"]}</option>
                                                    <option value="error">{lang["log.error"]}</option>

                                                </select>
                                            </div>
                                            <div className="col-lg-3">
                                                <label>{lang["log.daystart"]}:</label>
                                                <input type="datetime-local" className="form-control" value={filter.start} onChange={
                                                    (e) => { setFilter({ ...filter, start: e.target.value }) }
                                                } />
                                            </div>
                                            <div className="col-lg-3">
                                                <label>{lang["log.dayend"]}:</label>
                                                <input type="datetime-local" className="form-control" value={filter.end} onChange={
                                                    (e) => { setFilter({ ...filter, end: e.target.value }) }
                                                } />
                                            </div>
                                            <div className="col-lg-3 d-flex align-items-end justify-content-end">
                                                <button className="btn btn-primary mr-2 mt-2 btn-log" onClick={submitFilter}>{lang["btn.ok"]}</button>
                                                <button className="btn btn-secondary btn-log" onClick={() => {

                                                }}>{lang["btn.clear"]}</button>


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["log.listlog"]}</h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="table-responsive">
                                    {/* Qua tr met */}
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ width: 50 }}>{lang["log.no"]}</th>
                                                <th scope="col" style={{ width: 50 }} class="align-center">{lang["log.type"]}</th>
                                                <th scope="col">
                                                    {lang["log.listtitle"]}
                                                </th>
                                                <th scope="col">
                                                    {lang["description"]}
                                                </th>
                                                <th scope="col">
                                                    {lang["log.dayupdate"]}
                                                </th>
                                                <th scope="col" class="align-center">{lang["log.action"]}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getPageData( currentPage ).map((log, index) =>
                                                <tr key={log.id}>
                                                    <td scope="row">{ index + 1 }</td>
                                                    <td class="align-center">

                                                        <i class={`${log.icon?.icon}`} style={{ color: log.icon?.color }} title={log.icon?.label}></i>

                                                    </td>
                                                    <td>{log.event_title}</td>
                                                    <td>{log.event_description.slice(0, 100)}{log.event_description.length > 100 ? "..." : ""}</td>
                                                    <td>{log.create_at}</td>
                                                    <td class="align-center">
                                                        <i class="fa fa-eye size pointer icon-margin icon-view" onClick={() => detailLogs(log)} data-toggle="modal" data-target="#viewLog" style={{ color: "green" }} title={lang["btn.viewdetail"]}></i>

                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">

                    <p>{lang["show"]} { getPageData( currentPage ).length } {lang["of"]} {logs.length} {lang["results"]}</p>

                    <nav aria-label="Page navigation example">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => { setCurrentPage( 1 ) }}>
                                    &#8810;
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => { setCurrentPage( currentPage - 1 ) }}>
                                    &laquo;
                                </button>
                            </li>   

                            { getRelativeIndex( currentPage, MOVE_STEP ).map( page =>
                                <li key={ page } className={`page-item ${ page == currentPage ? "disabled": "" }}`}>
                                    <button className="page-link" onClick={() => { setCurrentPage( page ) } }>
                                        { page }
                                    </button>
                                </li>
                            ) }

                            <li className={`page-item ${currentPage === totalPages  ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => { setCurrentPage( currentPage + 1 ) }}>
                                    &raquo;
                                </button>
                            </li>                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => { setCurrentPage( totalPages ) }}>
                                    &#8811;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* View log */}
                <div class={`modal ${showModal ? 'show' : ''}`} id="viewLog">
                    <div class="modal-dialog modal-dialog-center">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">{lang["detaillog"]}</h4>
                                <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">

                                        <div class="form-group col-lg-6">
                                            <label><b>{lang["log.id"]}</b></label>
                                            <span className="d-block">{logDetail.event_id} </span>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><b>{lang["log.type"]}</b> </label>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <i className={` ${logDetail.icon?.icon}`} style={{ color: logDetail.icon?.color }} title={logDetail.icon?.label}></i>
                                                <span className="ml-1"> {logDetail.event_type}</span>
                                            </div>

                                        </div>


                                        {/* <div class="form-group col-lg-12">
                                                            <label>{lang["log.listtitle"]} </label>
                                                            <input type="text" class="form-control" value={logDetail.event_title} readOnly />
                                                            <label>{lang["description"]} </label>
                                                            <textarea rows={6} class="form-control"  value={logDetail.event_description} readOnly />
                                                           
                                                            
                                                            <label>{lang["log.create_user"]} </label>
                                                            <input type="text" class="form-control" value={logDetail.create_user} readOnly />
                                                            <label>{lang["log.create_at"]} </label>
                                                            <input type="text" class="form-control" value={logDetail.create_at} readOnly />
                                                            <label>IP: </label>

                                                            {
                                                                (() => {
                                                                    if (logDetail.ip) {
                                                                        let ipString = logDetail.ip;
                                                                        let ipParts = ipString.split("::ffff:");
                                                                        let ipAddress = ipParts.length > 1 ? ipParts[1] : ipParts[0];

                                                                        return (
                                                                            <div>
                                                                                <input type="text" className="form-control" value={ipAddress} readOnly />
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null; // Hoặc bạn có thể trả về một giá trị mặc định hoặc một thành phần khác tại đây
                                                                })()
                                                            }
                                                        </div> */}

                                        <div class="form-group col-lg-12">

                                            <label><b>{lang["log.listtitle"]}</b></label>
                                            <span className="d-block">
                                                {logDetail.event_title} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["description"]}</b> </label>
                                            <span className="d-block">{logDetail.event_description} </span >
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["log.create_user"]} </b></label>
                                            <span className="d-block">{logDetail.create_user} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>{lang["log.create_at"]}</b> </label>
                                            <span className="d-block">{logDetail.create_at} </span>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>IP:</b></label>

                                            {
                                                (() => {
                                                    if (logDetail.ip) {
                                                        let ipString = logDetail.ip;
                                                        let ipParts = ipString.split("::ffff:");
                                                        let ipAddress = ipParts.length > 1 ? ipParts[1] : ipParts[0];

                                                        return (

                                                            <span className="d-block">{ipAddress}</span>

                                                        );
                                                    }
                                                    return null; // Hoặc bạn có thể trả về một giá trị mặc định hoặc một thành phần khác tại đây
                                                })()
                                            }
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" onClick={handleCloseModal} data-dismiss="modal" class="btn btn-danger">{lang["btn.close"]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >
    )
}

