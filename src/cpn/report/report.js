
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns'
import Swal from 'sweetalert2';
import XLSX from 'xlsx-js-style'
import { formatDate } from '../../redux/configs/format-date';
export default () => {
    const { lang, proxy, auth, functions } = useSelector(state => state);



    const _token = localStorage.getItem("_token");
    const dispatch = useDispatch()
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const stateColors = {
        'INITIALIZING': "#8884d8",
        'PROGRESS': "#82ca9d",
        'RELEASE': "#ffc658",
        'COMPLETED': "#ff8042",
        'SUSPEND': "#FF0000",
    }
    const statusProject = [
        StatusEnum.INITIALIZATION,
        StatusEnum.IMPLEMENT,
        StatusEnum.DEPLOY,
        StatusEnum.COMPLETE,
        StatusEnum.PAUSE

    ]
    const statusTaskView = [
        StatusTask.INITIALIZATION,
        StatusTask.IMPLEMENT,
        StatusTask.COMPLETE,
        StatusTask.PAUSE

    ]
    const statusMapping = {
        1: "Khởi tạo",
        2: "Thực hiện",
        3: "Hoàn thành",
        4: "Tạm dừng"
    };
    const [projects, setProjects] = useState([]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        fetch(`${proxy}/projects/report/data`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                // console.log(resp)
                if (success) {

                    setProjects(data.projects);
                    dispatch({
                        branch: "default",
                        type: "setProjects",
                        payload: data
                    })
                    setLoaded(true)
                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
    const statusPriority = [
        { id: 0, label: "high", value: 1, color: "#1ed085" },
        { id: 1, label: "medium", value: 2, color: "#8884d8" },
        { id: 2, label: "low", value: 3, color: "#ffc658" },

    ]
    // console.log(projects.tasks.hitory)
    function getTaskPriorityLabel(taskPriority) {
        const item = statusPriority.find(item => item.value === parseInt(taskPriority));
        return item ? lang[item.label] || '' : '';
    }

    const exportToExcel = (project) => {
        // console.log(project)
        const workbook = XLSX.utils.book_new();
        const projectTasks = project.tasks;
        if (projectTasks && projectTasks.length > 0) {

        }

        const dataExport = project

        const projectName = project.project_name
        const projectMaster = project.manager.fullname;
        const now = new Date();
        const date = now.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const header = ['ID', 'Tên công việc', 'Mức độ ưu tiên', '% Hoàn thành', 'Xác nhận', 'Ngày bắt đầu (dd/MM/yyyy)', 'Ngày kết thúc (dd/MM/yyyy)', 'Timeline', 'Người thực hiện'];
        projectTasks.forEach((period, periodIndex) => {
            const ws_data = [
                // Header Information
                [`DANH SÁCH CÁC CÔNG VIỆC CỦA DỰ ÁN ${projectName}`, , , ,],
                [`Trưởng dự án: ${projectMaster}`, "", "", "", "", "", `Nhân viên xuất: ${auth?.fullname}`, "", ""],
                [`Ngày xuất (dd/MM/yyyy): ${date}`, "", "", "", "", "", "", "", "", "", ""],
                [`Tên giai đoạn: ${period.period_name}`, "", "", "", "", "", "", "", "", "", ""],
                [`Thời gian thực hiện: ${functions.formatDateTask(period.start)} - ${functions.formatDateTask(period.end)}`, "", "", "", "", "", "", "", "", "", ""],
                header,
            ];



            const taskGroupings = [];
            period.tasks.forEach((task, taskIndex) => {
                const startRow = ws_data.length;
                ws_data.push([

                    // taskIndex + 1,
                    task.task_id,
                    task.task_name,
                    getTaskPriorityLabel(task.task_priority),
                    `${task.progress}%`,
                    task.task_approve ? "Đã xác nhận" : "Chưa xác nhận",
                    functions.formatDateTask(task.start),
                    functions.formatDateTask(task.end),
                    functions.formatDateTask(task.timeline),
                    task.members.map(member => member.fullname).join(', '),
                ]);

                task.child_tasks.forEach((childTask, childIndex) => {
                    ws_data.push([
                        // childIndex + 1,
                        childTask.child_task_id,
                        childTask.child_task_name,
                        getTaskPriorityLabel(childTask.priority),
                        `${childTask.progress}%`,
                        childTask.task_approve ? "Đã xác nhận" : "Chưa xác nhận",
                        functions.formatDateTask(childTask.start),
                        functions.formatDateTask(childTask.end),
                        functions.formatDateTask(childTask.timeline),
                        childTask.members.map(member => member.fullname).join(', '),

                    ]);
                });

                const endRow = ws_data.length - 1;
                if (startRow < endRow) {
                    taskGroupings.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
                }
            });

            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            const borderStyle = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            };

            const centerStyle = {
                font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: borderStyle
            };
            const rightStyle = {
                font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
                alignment: { horizontal: "right", vertical: "right", wrapText: true },
                border: borderStyle
            };

            const titleStyle = {
                font: { name: "UTM Avo", sz: 13, bold: true, color: { rgb: "FF000000" } },
                fill: { fgColor: { rgb: "70ad47" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: borderStyle
            };

            const athurStyle = {
                font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
                border: borderStyle
            };

            const headerStyle = {
                font: { name: "UTM Avo", sz: 11, bold: true, color: { rgb: "FF000000" } },
                fill: { fgColor: { rgb: "a9d08f" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: borderStyle
            };

            ws["!cols"] = [{ width: 6 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
            ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
            ws["A1"].s = titleStyle;
            ws["A2"].s = athurStyle;
            ws["A4"].s = athurStyle;
            ws["A5"].s = athurStyle;
            ws["B4"].s = athurStyle;

            ws["B2"].s = athurStyle;
            ws["C4"].s = athurStyle;
            ws["D4"].s = athurStyle;
            ws["E4"].s = athurStyle;
            ws["F4"].s = athurStyle;
            ws["G4"].s = athurStyle;
            ws["H4"].s = athurStyle;
            ws["I4"].s = athurStyle;

            ws["C5"].s = athurStyle;
            ws["D5"].s = athurStyle;
            ws["E5"].s = athurStyle;
            ws["F5"].s = athurStyle;
            ws["G5"].s = athurStyle;
            ws["H5"].s = athurStyle;
            ws["I5"].s = athurStyle;

            ws["E2"].s = athurStyle;
            ws["F2"].s = athurStyle;
            ws["A3"].s = athurStyle;
            ws["B3"].s = athurStyle;
            ws["C2"].s = athurStyle;
            ws["C3"].s = athurStyle;
            ws["D2"].s = athurStyle;
            ws["D3"].s = athurStyle;
            ws["E2"].s = athurStyle;
            ws["E3"].s = athurStyle;
            ws["F2"].s = athurStyle;
            ws["F3"].s = athurStyle;
            ws["G2"].s = athurStyle;
            ws["G3"].s = athurStyle;
            ws["H2"].s = athurStyle;
            ws["H3"].s = athurStyle;
            ws["I2"].s = athurStyle;
            ws["I3"].s = athurStyle;

            ws["A6"].s = headerStyle;
            ws["B6"].s = headerStyle;
            ws["C6"].s = headerStyle;
            ws["D6"].s = headerStyle;
            ws["E6"].s = headerStyle;
            ws["F6"].s = headerStyle;
            ws["G6"].s = headerStyle;
            ws["H6"].s = headerStyle;
            ws["I6"].s = headerStyle;


            const bodyStyle = {
                font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border: borderStyle
            };

            for (let i = 0; i < projectTasks.length; i++) {
                for (let j = 0; j < projectTasks[i].length; j++) {
                    const cellAddress = `${String.fromCharCode(65 + j)}${5 + i}`;

                    if (!ws[cellAddress]) {
                        ws[cellAddress] = { t: 's', v: projectTasks[i][j] ?? "" };
                    }

                    if (j === 0) {
                        ws[cellAddress].s = centerStyle;
                    } else {
                        ws[cellAddress].s = bodyStyle;
                    }
                }
            }

            ws["!merges"] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },//ghép từ ô tại hàng 0, cột 0 đến ô tại hàng 0, cột 11.
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
                { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
                { s: { r: 1, c: 6 }, e: { r: 1, c: 8 } },
            ];


            // XLSX.utils.book_append_sheet(workbook, ws, period.period_name.substring(0, 31));


            //Check trùng tên sheet
            function getUniqueSheetName(workbook, baseSheetName) {
                let sheetName = baseSheetName.substring(0, 31);
                let index = 1;

                while (workbook.SheetNames.includes(sheetName)) {
                    sheetName = baseSheetName.substring(0, 29) + "_" + index;
                    index += 1;
                }

                return sheetName;
            }

            let sheetName = getUniqueSheetName(workbook, period.period_name);
            XLSX.utils.book_append_sheet(workbook, ws, sheetName);


            // Thêm nhóm vào trang tính
            if (!ws['!rows']) ws['!rows'] = [];
            taskGroupings.forEach(group => {
                for (let r = group.s.r; r <= group.e.r; ++r) {
                    if (!ws['!rows'][r]) ws['!rows'][r] = {};
                    ws['!rows'][r].level = 1;
                }
            });

            ws['!outline'] = { summaryBelow: true };

        });

        // Xuất file Excel
        const projectCode = project.project_code;
        XLSX.writeFile(workbook, `Project-${projectCode}-${projectName}-${(new Date()).getTime()}.xlsx`);

    };

    const [filterStatus, setFilterStatus] = useState("");

    const handleStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1)
    }

    const onClickTrigger = (project) => {
        fetch(`${proxy}/projects/p/${project.project_id}/report/data`, {
            headers: {
                Authorization: _token
            }
        }).then(res => res.json()).then(res => {
            const { success } = res;
            // console.log(res)
            if (success) {
                const { data } = res;
                const { project } = data
                exportToExcel(project)
            }
        })
    }

    const filteredProjects = projects.filter(project => {
        // Nếu không có trạng thái nào được chọn, hiển thị tất cả dự án
        if (!filterStatus) {
            return true;
        }

        // Nếu có trạng thái được chọn, chỉ hiển thị dự án với trạng thái tương ứng
        return project.project_status == filterStatus;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 14;

    const indexOfLastReport = currentPage * rowsPerPage;
    const indexOfFirstReport = indexOfLastReport - rowsPerPage;
    const currentReport = filteredProjects.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["report"]}</h4>
                            {/* <img className="ml-auto mr-2" width={36} src="/assets/icon/viewmode/data-analytics.png" /> */}
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full ">
                            {loaded ? (
                                <><div class="full padding_infor_info">

                                    <div className="container-fluid">
                                        <div class="col-md-12">
                                            <div class=" align-items-center ml-3 mb-1">
                                                <div class="col-sm-4" style={{ maxWidth: "150", width: "200px" }}>
                                                    <select value={filterStatus} class=" form-control mt-2 mrl-15" onChange={handleStatusChange}>
                                                        <option value="">{lang["allstatus"]}</option>
                                                        {statusProject.map(status =>
                                                            <option value={status.value}>{lang[`${status.label}`]}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                {
                                                    currentReport && currentReport.length > 0 ? (
                                                        <>
                                                            <table class="table table">
                                                                <thead>
                                                                    <tr class="color-tr">
                                                                        <th class="font-weight-bold" style={{ width: "30px" }} scope="col">{lang["log.no"]}</th>
                                                                        <th class="font-weight-bold" scope="col">{lang["projectname"]}</th>
                                                                        <th class="font-weight-bold" style={{ width: "200px" }} scope="col">{lang["projectcode"]}</th>
                                                                        <th class="font-weight-bold" style={{ width: "180px" }} scope="col">{lang["log.create_at"]}</th>
                                                                        <th class="font-weight-bold align-center" style={{ width: "100px" }} scope="col">{lang["projectstatus"]}</th>
                                                                        {
                                                                            ["pm", "ad", "uad"].indexOf(auth.role) != -1 &&
                                                                            <th class="font-weight-bold align-center" style={{ width: "80px" }}>{lang["log.action"]}</th>
                                                                        }
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {currentReport.map((project, index) => (
                                                                        <tr key={index}>
                                                                            <td>{indexOfFirstReport + index + 1}</td>
                                                                            <td style={{ maxWidth: "700px" }}>
                                                                                <div style={{
                                                                                    width: "100%",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                }}>
                                                                                    {project.project_name}
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: "200px" }}>
                                                                                <div style={{
                                                                                    width: "100%",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                }}>
                                                                                    {project.project_code}
                                                                                </div>
                                                                            </td>
                                                                            <td>{formatDate(project.create_at)}</td>
                                                                            <td><span className="status-label d-inline-block align-center" style={{
                                                                                backgroundColor: (statusProject.find((s) => s.value === project.project_status) || {}).color,
                                                                                whiteSpace: "nowrap", minWidth: "100px"
                                                                            }}>
                                                                                {lang[`${(statusProject.find((s) => s.value === project.project_status) || {}).label || 'Trạng thái không xác định'}`]}
                                                                            </span></td>
                                                                            <td> <span type="button" style={{ width: "90px" }} class="btn btn-primary" onClick={() => onClickTrigger(project)}>
                                                                                {lang["export"]}
                                                                            </span></td>
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
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>
                                                    {lang["show"]} {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredProjects.length)} {lang["of"]} {filteredProjects.length} {lang["results"]}
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
                                    </div>
                                </div>
                                </>
                            ) :
                                <div class="d-flex justify-content-center align-items-center w-100 responsive-div" >
                                    {/* {lang["projects.noprojectfound"]} */}
                                    <img width={350} className="scaled-hover-target" src="/images/icon/loading.gif" ></img>

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

