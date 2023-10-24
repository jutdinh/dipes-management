
import { useParams } from "react-router-dom";
import Header from "../../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport, faDownload, faSquarePlus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';
import MyPieChart from "../chart/pie";
import { Tables } from "..";
export default (props) => {
    const { lang, proxy, auth, pages, functions, socket } = useSelector(state => state);
    const { openTab, renderDateTimeByFormat } = functions
    const { project_id, version_id, url } = useParams();
    const _token = localStorage.getItem("_token");
    const { formatNumber } = functions
    const stringifiedUser = localStorage.getItem("user");
    const _user = JSON.parse(stringifiedUser) || {}
    const username = _user.username === "administrator" ? "" : _user.username;
    const page = props.page
    const title = props.title
    const [isActivated, setIsActivated] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [enableNext, setEnableNext] = useState(false)
    const [enable, setEnable] = useState(false)
    const [dataKey, setDatKey] = useState({})
    const [apiDataName, setApiDataName] = useState([])
    const [data, setData] = useState({});
    const [dataFile, setDataFile] = useState({})
    console.log(props)
    const [reason, setReason] = useState("")
    const isEmptyObject = (obj) => Object.keys(obj).length === 0;


    const handleReStep = (e) => {
        setCurrentStep(1);
    }

    const handleNextStep = (e) => {
        e.preventDefault();
        setCurrentStep(3);

        const requestBody = {
            ...dataFile,
            reason: reason,
            customer: username,
        }
        console.log(requestBody)
        fetch(`${proxy()}${page?.components?.[0]?.api_post}`, {
            method: "POST",
            headers: {
                Authorization: _token,
                "content-type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then(res => {

                const { keyLicense, success } = res;
                console.log(res)
                if (success) {
                    Swal.fire({
                        title: lang["success"],
                        text: lang["success create key"],
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setDatKey(keyLicense)
                }

                // socket.emit("/dipe-production-new-data-added", dataSubmit);
            })
            .catch(error => {

            });
    };

    console.log(dataKey)

    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        }

        if (file) {
            // Kiểm tra phần mở rộng của tệp
            if (file.name.split('.').pop() !== 'txt') {
                setFileError(`${lang["error.file"]}`);
                return;
            } else {
                setFileError('')
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const fileContent = e.target.result;
                let parsedContent;
                try {
                    parsedContent = JSON.parse(fileContent);
                } catch (error) {

                    setFileError(`${lang["correct format"]}`);
                    return;
                }

                if (
                    !parsedContent.controller ||
                    typeof parsedContent.controller.key !== 'string' ||
                    typeof parsedContent.controller.serialNumber !== 'string' ||
                    !Array.isArray(parsedContent.printhead) ||
                    !parsedContent.printhead.every(printhead =>
                        typeof printhead.key === 'string' &&
                        typeof printhead.serialNumber === 'string')
                ) {
                    setFileError(`${lang["correct format"]}`);
                    return;
                }
                const transformedData = {
                    data: parsedContent
                };
                setDataFile(transformedData);
                setEnableNext(true)
            };
            reader.readAsText(file);

        }
    };

    useEffect(() => {
        if (page && page.components) {
            // const id_str = page.components?.[0]?.api_post.split('/')[2];
            const id_str = page.components?.[0]?.api_get.split('/')[2];
            // console.log(id_str)
            fetch(`${proxy()}/apis/api/${id_str}/input_info`, {
                headers: {
                    Authorization: _token
                }
            })
                .then(res => res.json())
                .then(res => {
                    const { data, success, content } = res;
                    console.log(res)
                    if (success) {

                        setApiDataName(data.fields)
                        // setDataTableID(data.tables[0].id)
                        // setDataFields(data.body)
                        // setLoaded(true)
                    }
                })
        }
    }, [page])

    const submit = () => {
        setCurrentStep(2);
    };

    const renderData = (field, data) => {
        if (data) {
            switch (field.DATATYPE) {
                case "DATE":
                case "DATETIME":
                    // console.log(renderDateTimeByFormat(data[field.fomular_alias], field.FORMAT))
                    // return renderDateTimeByFormat(data[field.fomular_alias], field.FORMAT);
                    return data[field.fomular_alias];
                case "DECIMAL":
                case "DECIMAL UNSIGNED":
                    const { DECIMAL_PLACE } = field;
                    const decimalNumber = parseFloat(data[field.fomular_alias]);
                    return decimalNumber.toFixed(DECIMAL_PLACE)
                case "BOOL":
                    return renderBoolData(data[field.fomular_alias], field)
                default:
                    return data[field.fomular_alias];
            }
        } else {
            return "Invalid value"
        }
    };

    const renderBoolData = (data, field) => {
        const IF_TRUE = field.DEFAULT_TRUE;
        const IF_FALSE = field.DEFAULT_FALSE
        if (data != undefined) {
            if (data) {
                return IF_TRUE ? IF_TRUE : "true"
            }
            return IF_FALSE ? IF_FALSE : "false"
        } else {
            return IF_FALSE ? IF_FALSE : "false"
        }
    }
    const current = data.printhead


    const getCurrentFormattedDate = () => {
        const date = new Date();
        const year = String(date.getFullYear()).slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const exportLicense = () => {
        const blob = new Blob([dataKey], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `${getCurrentFormattedDate()}_License.lic`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // const colorIndices = display.map((header) => headers.indexOf(header));

    return (
        <>


            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <h4 style={{ marginLeft: "-30px" }}>Layout Import</h4>
                        </div>
                    </div>
                </div>
                {/* List table */}
                <div class="row">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="tab_style2">
                                <div class="tabbar">
                                    <nav>
                                        <div className="nav nav-tabs" style={{ borderBottomStyle: "0px" }} id="nav-tab" role="tablist">
                                            <div class="full graph_head_cus d-flex">
                                                <div class="heading1_cus margin_0 nav-item nav-link ">
                                                    <h5>{title || lang["ui.table"]}</h5>
                                                    
                                                </div>
                                            </div>
                                            <div class="table_section padding_infor_info_245">
                                                <div class="row column1">
                                                    <div class="col-md-12 col-lg-12">
                                                        <div class="table_section padding_infor_info_layout2 ">
                                                            <div class="tab-content">
                                                                <div className=" justify-content-center mt-34">
                                                                    <div className="step-indicator mlr-5 mt-2">
                                                                        <ul className="step-list mt-2">

                                                                            <li className={`step-item ${currentStep === 1 ? "step-active" : ""} step-arrow-right`}>
                                                                                <a className="step-link">Step 1</a>
                                                                            </li>

                                                                            <li className={`step-item ${currentStep === 2 ? "step-active" : ""} step-arrow-both`}>
                                                                                <a className="step-link">Step 2</a>
                                                                            </li>

                                                                            <li className={`step-item ${currentStep === 3 ? "step-active" : ""} step-arrow-left-flat-right`}>
                                                                                <a className="step-link">Step 3</a>
                                                                            </li>

                                                                        </ul>
                                                                    </div>
                                                                    {currentStep === 1 && (
                                                                        <div class="row justify-content-center mt-3">

                                                                            <div class="col-md-12 p-20">
                                                                                <div id="step1">

                                                                                    <div className="form-group mt-4">
                                                                                        <div className="upload-container">
                                                                                            <input type="" className="input-file" accept=".txt" />
                                                                                            <div className="icon">
                                                                                                📄
                                                                                            </div>
                                                                                            <button className="upload-button">
                                                                                                Upload File
                                                                                            </button>
                                                                                            <label class="mt-2" style={{ minHeight: "20px" }}>

                                                                                            </label>

                                                                                        </div>
                                                                                    </div>

                                                                                    {/* <div class="form-group">
                                                        <label for="serialNumber">Reason</label>
                                                        <input
                                                            type="text"
                                                            class="form-control"
                                                            placeholder=""
                                                           
                                                           
                                                        />
                                                    </div> */}

                                                                                    <div className="button-group d-flex">
                                                                                        {/* <button onClick={submit} style={{ minWidth: "100px" }} className="btn btn-primary ml-auto" >{lang["next"]}</button> */}
                                                                                        <button style={{ minWidth: "100px" }} disabled className="btn btn-primary ml-auto" >{lang["next"]}</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {currentStep === 2 && (
                                                                        <>
                                                                            <div class="row justify-content-center mt-3">
                                                                                <div class="col-md-12 p-20">
                                                                                    <div class="table-responsive">
                                                                                        <>
                                                                                            <div style={{ overflowX: 'auto' }}>
                                                                                                <table className={"table"} style={{ marginBottom: "10px", width: '100%' }}>
                                                                                                    <thead>
                                                                                                        <tr className="color-tr">
                                                                                                            <th className="font-weight-bold" style={{ width: "50px" }} scope="col">Key</th>
                                                                                                            <th className="font-weight-bold align-center" style={{ width: "100px" }} scope="col">Value</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                    <tbody>

                                                                                                        <tr>
                                                                                                            <td>1</td>
                                                                                                            <td>2</td>
                                                                                                        </tr>

                                                                                                    </tbody>
                                                                                                </table>


                                                                                            </div>
                                                                                        </>

                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-md-12 p-20">
                                                                                    <div className="button-group">
                                                                                        <button onClick={handleReStep} style={{ minWidth: "100px" }} className="btn btn-info mr-2">{lang["back"]}</button>
                                                                                        {enable && (

                                                                                            <button onClick={handleNextStep} style={{ minWidth: "100px" }} className="btn btn-primary" disabled={isEmptyObject(data.controller)}>{lang["create key"]}</button>

                                                                                        )
                                                                                        }
                                                                                    </div>


                                                                                </div>



                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    {currentStep === 3 && (
                                                                        <>
                                                                            <div class="row justify-content-center mt-3">

                                                                                <div class="col-md-12 p-20">
                                                                                    <div id="step1">


                                                                                        <div className="form-group">
                                                                                            <label class="font-weight-bold">Key License</label>
                                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                <input
                                                                                                    type="text"

                                                                                                    className="form-control cell-key"
                                                                                                    value={!isEmptyObject(dataKey) ? dataKey : ''}
                                                                                                    style={{ marginRight: '10px' }}
                                                                                                    readOnly
                                                                                                />
                                                                                                <button className="btn btn-primary" style={{ minWidth: "100px" }} onClick={exportLicense}>
                                                                                                    <i class="fa fa-download mr-2 size-18 pointer" aria-hidden="true"></i>
                                                                                                    Export
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

