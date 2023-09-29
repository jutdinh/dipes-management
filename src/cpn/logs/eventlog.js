
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CheckList from '../common/checkList';
import FloatingTextBox from '../common/floatingTextBox';
import { formatDate } from '../../redux/configs/format-date';
import Swal from 'sweetalert2';
export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const { removeVietnameseTones } = functions
    const _token = localStorage.getItem("_token");
    const langItem = localStorage.getItem("lang") ? localStorage.getItem("lang") : "Vi";

    const MAX_RECORDS_PER_SHEET = 13;
    const MOVE_STEP = 3


    const [logs, setLogs] = useState([]);
    const [display, setDisplay] = useState([])
    const [filter, setFilter] = useState({});
    const [logDetail, setLogDetail] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [tableFilter, setTableFilter] = useState({
        event_type: false,
        event_title: false,
        event_description: false,
    })

    const [hotFilter, sethotFilter] = useState({
        event_type: [],
        event_title: [],
        event_description: ""
    })



    const languages = langItem.toLowerCase();


    const eventType = {}
    eventType[lang["log.information"]] = { id: 0, label: lang["log.information"], value: 1, color: "#3029F7", icon: "fa fa-info-circle size-24 " }
    eventType[lang["log.warning"]] = { id: 1, label: lang["log.warning"], value: 2, color: "#f3632e", icon: "fa fa-warning size-24 " }
    eventType[lang["log.error"]] = { id: 2, label: lang["log.error"], value: 3, color: "#FF0000", icon: "fa fa-times-circle size-24 " }



    const typeFilterOptions = [
        { id: 0, label: lang["log.information"], value: lang["log.information"] },
        { id: 1, label: lang["log.warning"], value: lang["log.warning"] },
        { id: 2, label: lang["log.error"], value: lang["log.error"] },
    ]
    const [titleOptions, setTitleOptions] = useState([])



    const addOrRemoveEventType = (item) => {
        const { value } = item;
        let primalValue = value ? value : " "
        if (typeof (value) != "string") {
            primalValue = primalValue.toString()
        }
        const formatedItem = { ...item, formated_value: removeVietnameseTones(primalValue.toLowerCase()) }
        const { event_type } = hotFilter;
        let newEventTypes = []
        const setDataFunction = event_type.find(filter => filter.id == formatedItem.id);
        if (setDataFunction) {
            newEventTypes = event_type.filter(filter => filter.id != formatedItem.id);
        } else {
            newEventTypes = [...event_type, formatedItem]
        }
        // hotFilter.event_type = newEventTypes
        sethotFilter({ ...hotFilter, event_type: newEventTypes })
    }

    const addOrRemoveEventTitle = (item) => {
        const { value } = item;
        let primalValue = value ? value : " "
        if (typeof (value) != "string") {
            primalValue = primalValue.toString()
        }
        const formatedItem = { ...item, formated_value: removeVietnameseTones(primalValue.toLowerCase()) }
        const { event_title } = hotFilter;
        let newEventTitles = []
        const setDataFunction = event_title.find(filter => filter.id == formatedItem.id);
        if (setDataFunction) {
            newEventTitles = event_title.filter(filter => filter.id != formatedItem.id);
        } else {
            newEventTitles = [...event_title, formatedItem]
        }

        sethotFilter({ ...hotFilter, event_title: newEventTitles })
    }

    const setDescriptionFilter = (e) => {
        sethotFilter({ ...hotFilter, event_description: e.target.value })
    }

    useEffect(() => {
        const { event_type, event_title, event_description } = hotFilter;
        // console.log( hotFilter )
        if (event_type.length > 0 || event_title.length > 0 || event_description.length > 0) {
            const types = event_type.map(type => type.value);
            const titles = event_title.map(title => title.value)
            const formatedDescription = removeVietnameseTones(event_description.toLowerCase())
            const newData = logs.filter(log => {
                if (types.length > 0) {
                    return types.indexOf(log.event_type) != -1
                } else {
                    return true
                }
            }).filter(log => {
                if (titles.length > 0) {
                    return titles.indexOf(log.event_title) != -1
                } else {
                    return true
                }
            }).filter(log => {
                if (event_description.length > 0) {
                    const removeTones = removeVietnameseTones(log.event_description?.toLowerCase())
                    return removeTones.includes(formatedDescription)
                } else {
                    return true
                }
            })
            setDisplay(newData)
            setTotalPages(Math.ceil(newData.length / MAX_RECORDS_PER_SHEET))
            setCurrentPage(1)
        } else {
            setDisplay(logs)
            setTotalPages(Math.ceil(logs.length / MAX_RECORDS_PER_SHEET))
            setCurrentPage(1)
        }
    }, [hotFilter])

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {

        fetch(`${proxy}/logs/${languages}`, {
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
                        const formatedData = data.map(log => {
                            return { ...log, icon: eventType[log.event_type] }
                        })
                        setLogs(formatedData);
                        setDisplay(formatedData)
                        const total = Math.ceil(formatedData.length / MAX_RECORDS_PER_SHEET)
                        setTotalPages(total)
                    }
                } else {
                    window.location = "/login"
                }
            })
    }, [])
    // console.log(view)

    useEffect(() => {
        if (logs.length > 0) {
            const titles = logs.map(log => log.event_title);
            const filtedTitles = titles.filter((item, index) => {
                return titles.indexOf(item) == index;
            })
            const formatedTitleOptions = filtedTitles.map((item, index) => {
                return { id: index, value: item, label: item }
            })
            setTitleOptions(formatedTitleOptions)
        }
    }, [logs])

    const detailLogs = async (logid) => {
        // console.log(logid)
        setLogDetail(logid)
    };

    const cancelSearchUI = () => {
        setDisplay(logs)
        const total = Math.ceil(logs.length / MAX_RECORDS_PER_SHEET)
        setTotalPages(total)
    }

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
                    // console.log(resp)
                    if (success) {

                        // setShowModal(false);
                        const formatedData = data.map(log => {
                            return { ...log, icon: eventType[log.event_type] }
                        })

                        setDisplay([...formatedData])
                        setCurrentPage(1)
                        const total = Math.ceil(formatedData.length / MAX_RECORDS_PER_SHEET)
                        setTotalPages(total)
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


    const getPageData = (pageIndex) => {
        const firstItemIndex = (pageIndex - 1) * MAX_RECORDS_PER_SHEET
        const data = display.slice(firstItemIndex, firstItemIndex + MAX_RECORDS_PER_SHEET)
        return data ? data : []
    }

    const getRelativeIndex = (currentPage, step = 2) => {
        const indices = []
        for (let i = currentPage - step; i < currentPage + step; i++) {
            if (i > 0 && i <= totalPages) {
                indices.push(i)
            }
        }
        return indices
    }
    // console.log(logDetail.ip);

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

                                                    <option value={undefined}>{lang["choose"]}</option>
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
                                                    cancelSearchUI()
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
                        <div class="white_shd full">
                            <div class="full graph_head">
                                <div class="heading1 margin_0">
                                    <h5>{lang["log.listlog"]}</h5>
                                </div>
                            </div>
                            <div class="table_section padding_infor_info">
                                <div class="table-responsive" style={{ minHeight: "50vh" }}>
                                    {/* table */}
                                    <table class="table table">
                                        <thead>
                                            <tr class="color-tr">
                                                <th scope="col">{lang["log.no"]}</th>
                                                <th scope="col" class="align-center pointer">
                                                    <div className="d-flex align-items-center"
                                                        onClick={() => { setTableFilter({ event_type: !tableFilter.event_type }) }}
                                                    >{lang["log.type"]} <i className="fa fa-filter block ml-auto" /></div>
                                                    {tableFilter.event_type && <div className="position-relative">
                                                        <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "150px" }}>
                                                            <CheckList
                                                                title={lang["log.type"]}
                                                                initialData={hotFilter.event_type}
                                                                setDataFunction={addOrRemoveEventType}
                                                                data={typeFilterOptions}
                                                                destructFunction={() => { setTableFilter({ ...tableFilter, event_type: false }) }}
                                                            />
                                                        </div>
                                                    </div>}
                                                </th>


                                                <th scope="col" class="align-center pointer">
                                                    <div className="d-flex align-items-center"
                                                        onClick={() => { setTableFilter({ event_title: !tableFilter.event_title }) }}

                                                    >{lang["log.listtitle"]} <i className="fa fa-filter icon-view block ml-auto" /></div>
                                                    {tableFilter.event_title && <div className="position-relative">
                                                        <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "150px" }}>
                                                            <CheckList
                                                                title={lang["log.listtitle"]}
                                                                initialData={hotFilter.event_title}
                                                                setDataFunction={addOrRemoveEventTitle}
                                                                data={titleOptions}
                                                                destructFunction={() => { setTableFilter({ ...tableFilter, event_title: false }) }}
                                                            />
                                                        </div>
                                                    </div>}
                                                </th>

                                                <th scope="col" class="pointer">

                                                    <div className="d-flex align-items-center"
                                                        onClick={() => { setTableFilter({ event_description: !tableFilter.event_description }) }}

                                                    >{lang["description"]} <i className="fa fa-filter icon-view block ml-auto" /></div>
                                                    {tableFilter.event_description && <div className="position-relative">
                                                        <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "150px" }}>
                                                            <FloatingTextBox
                                                                title={lang["description"]}
                                                                initialData={hotFilter.event_description}
                                                                setDataFunction={setDescriptionFilter}
                                                                destructFunction={() => { setTableFilter({ ...tableFilter, event_description: false }) }}
                                                            />
                                                        </div>
                                                    </div>}
                                                </th>
                                                <th scope="col">
                                                    {lang["log.dayupdate"]}
                                                </th>
                                                <th scope="col" class="align-center">{lang["log.action"]}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getPageData(currentPage).map((log, index) =>
                                                <tr key={index}>
                                                    <td scope="row">{index + 1}</td>
                                                    <td class="align-center">

                                                        <i class={`${log.icon?.icon}`} style={{ color: log.icon?.color }} title={log.icon?.label}></i>

                                                    </td>
                                                    <td>{log.event_title}</td>
                                                    <td>{log.event_description.slice(0, 100)}{log.event_description.length > 100 ? "..." : ""}</td>
                                                    <td>{formatDate(log.create_at)}</td>
                                                    <td class="align-center">
                                                        <i class="fa fa-eye size-24 pointer icon-margin icon-view" onClick={() => detailLogs(log)} data-toggle="modal" data-target="#viewLog" style={{ color: "green" }} title={lang["btn.viewdetail"]}></i>

                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                                <div className="d-flex justify-content-between align-items-center">

                                    <p>{lang["show"]} {(currentPage - 1) * MAX_RECORDS_PER_SHEET + 1} - {(currentPage - 1) * MAX_RECORDS_PER_SHEET + getPageData(currentPage).length}  {lang["of"]} {display.length} {lang["results"]}</p>

                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => { setCurrentPage(1) }}>
                                                    &#8810;
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => { setCurrentPage(currentPage - 1) }}>
                                                    &laquo;
                                                </button>
                                            </li>

                                            {getRelativeIndex(currentPage, MOVE_STEP).map(page =>
                                                <li key={page} className={`page-item ${page == currentPage ? "active" : ""}`}>
                                                    <button className={`page-link ${page == currentPage ? "bg-primary text-white" : ""}`} onClick={() => { setCurrentPage(page) }}>
                                                        {page}
                                                    </button>
                                                </li>
                                            )}


                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => { setCurrentPage(currentPage + 1) }}>
                                                    &raquo;
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => { setCurrentPage(totalPages) }}>
                                                    &#8811;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            <label><b>{lang["date execution"]}</b> </label>
                                            <span className="d-block">{formatDate(logDetail?.create_at) || ""} </span>

                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label><b>IP:</b></label>

                                            {
                                                (() => {
                                                    if (logDetail.user_ip) {
                                                        let ipString = logDetail.user_ip;
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

