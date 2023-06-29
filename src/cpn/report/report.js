
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
    const { lang, proxy, auth } = useSelector(state => state);
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
    const [task_modify, setTasksModify] = useState([]);
    useEffect(() => {
        fetch(`${proxy}/projects/report/data`, {
            headers: {
                Authorization: _token
            }
        })
            .then(res => res.json())
            .then(resp => {
                const { success, data, status, content } = resp;
                console.log(resp)
                if (success) {

                    setProjects(data.projects);
                    dispatch({
                        branch: "default",
                        type: "setProjects",
                        payload: {
                            projects: data
                        }
                    })

                } else {
                    window.location = "/404-not-found"
                }
            })
    }, [])
    // console.log(projects.tasks.hitory)
    const exportToExcel = (dataExport) => {
        console.log(dataExport)
        const projectTasks = dataExport.tasks.filter((task) => task.project_id === dataExport.project_id);

        console.log(projectTasks)


        // if (!projectTasks || projectTasks.length === 0) {
        //     console.error(`No tasks found for project ID: ${projectId}`);
        //     return;
        // }

        const projectName = projects.find((project) => project.project_id === dataExport.project_id)?.project_name || 'Unknown Project';
        const projectMaster = projects.find((project) => project.project_id === dataExport.project_id)?.create_by;
        const header = [
            "STT",
            "Yêu cầu",
            "Người thực hiện",
            "Trạng thái",
            "Ngày cập nhật (dd/MM/yyyy)",
            "Ghi chú"
        ];
        const data = projectTasks.map((task, index) => {

            let changedAt = task.changed_at ? new Date(task.changed_at).toLocaleDateString("vi-VN") : '';
            // let status = statusTaskView.find((s) => s.value === task.task_status) || "Trạng thái không xác định";
            let status = statusMapping[task.task_status] || "Trạng thái không xác định";
            let joinedNames = "";
            if (task.members) {
                joinedNames = task.members.map(mem => mem.fullname).join(', ');
            }
            return [
                index + 1,
                task.task_name,
                joinedNames || "Chưa có người thực hiện",
                status,
                changedAt,
                task.task_description
            ];
        });



        const now = new Date();
        const date = now.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const ws = XLSX.utils.aoa_to_sheet([
            [`BÁO CÁO DỰ ÁN ${projectName}`, , , , ,],
            [`Trưởng dự án: ${projectMaster}`, "", "", "", `Nhân viên xuất: ${auth.fullname}`, ""],
            [`Ngày (dd/MM/yyyy): ${date}`, "", "", "", "", ""],
            header,
            ...data
        ]);

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
            font: { name: "UTM Avo", sz: 11, bold: true, color: { rgb: "FF000000" } },
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
            fill: { fgColor: { rgb: "a9d08f" } }, // Nền màu xanh lá
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: borderStyle
        };

        ws["!cols"] = [{ width: 6 }, { width: 45 }, { width: 20 }, { width: 35 }, { width: 20 }, { width: 40 }];
        ws["!rows"] = [{ height: 40 }, { height: 30 }, { height: 30 }, { height: 40 }];
        ws["A1"].s = titleStyle;
        ws["A2"].s = athurStyle;
        ws["B2"].s = athurStyle;
        ws["E2"].s = athurStyle;
        ws["F2"].s = athurStyle;
        ws["A3"].s = athurStyle;
        ws["B3"].s = athurStyle;
        ws["C2"].s = athurStyle;
        ws["C3"].s = athurStyle;
        ws["D2"].s = athurStyle;
        ws["D3"].s = athurStyle;
        ws["E3"].s = athurStyle;
        ws["F3"].s = athurStyle;
        ws["A4"].s = headerStyle;
        ws["B4"].s = headerStyle;
        ws["C4"].s = headerStyle;
        ws["D4"].s = headerStyle;
        ws["E4"].s = headerStyle;
        ws["F4"].s = headerStyle;

        const bodyStyle = {
            font: { name: "UTM Avo", sz: 11, color: { rgb: "FF000000" } },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: borderStyle
        };

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                const cellAddress = `${String.fromCharCode(65 + j)}${5 + i}`;

                // Kiểm tra nếu ô không tồn tại, tạo mới
                if (!ws[cellAddress]) {
                    ws[cellAddress] = { t: 's', v: "" };
                }

                // Sau khi đảm bảo ô tồn tại, thiết lập style cho nó
                if (j === 0) {
                    ws[cellAddress].s = centerStyle;
                } else {
                    ws[cellAddress].s = bodyStyle;
                }
            }
        }


        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
            { s: { r: 1, c: 4 }, e: { r: 1, c: 5 } }
        ];
        const wb = XLSX.utils.book_new();
        const projectCode = projects.find((project) => project.project_id === dataExport.project_id).project_code;
        XLSX.utils.book_append_sheet(wb, ws, `Project-${dataExport.project_id}`);
        XLSX.writeFile(wb, `Project-${projectCode}-${projectName}-${(new Date()).getTime()}.xlsx`);
    };
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
                        <div class="white_shd full margin_bottom_30">
                          
                            <div class="full price_table padding_infor_info">
                                <div class="container-fluid">
                                    {projects.map((project) => (
                                        <div key={project.project_id} class="row group">
                                            <div class="col-md-12 col-lg-12">
                                                <p >Tên dự án: <b class="font-weight-bold">{project.project_name}</b></p>
                                                <p >Mã dự án: {project.project_code} </p>
                                                <p >Ngày tạo: {formatDate(project.create_at)}</p>

                                                <p>Trạng thái:
                                                    <span className="status-label d-inline-block ml-1" style={{
                                                        backgroundColor: (statusProject.find((s) => s.value === project.project_status) || {}).color,
                                                        whiteSpace: "nowrap",

                                                    }}>
                                                        {lang[`${(statusProject.find((s) => s.value === project.project_status) || {}).label || 'Trạng thái không xác định'}`]}
                                                    </span>
                                                </p>

                                                <button type="button" style={{ width: "90px" }} class="btn btn-primary mt-3" onClick={() => exportToExcel(project)}>
                                                    Xuất
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

