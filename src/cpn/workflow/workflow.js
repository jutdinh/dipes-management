
import { useParams } from "react-router-dom";
import Header from "../common/header"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEnum, StatusTask } from '../enum/status';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import * as d3 from "d3";
export default () => {
    const { lang, proxy, auth } = useSelector(state => state);
    const _token = localStorage.getItem("_token");
    const dispatch = useDispatch()
    const { project_id, version_id } = useParams();
    let navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const [projects, setProjects] = useState([]);
    const chartTab = () => {
        setTab(!tab)
    }
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

                    setProjects(data);
                    treeChart(data)

                } else {
                    // window.location = "/404-not-found"
                }
            })
    }, [])
    console.log(projects)

    const projectDetails = (projectName) => {
        return [
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Cập nhật thông tin",
                lv4: "",
                lv5: "",
                link: "/"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Quản lý",
                lv4: "Cơ sở dữ liệu",
                lv5: "Tạo bảng",
                link: "/"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Quản lý",
                lv4: "Cơ sở dữ liệu",
                lv5: "Diagram",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Quản lý",
                lv4: "API",
                lv5: "",
                link: "http://localhost:3000/projects?action=create"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Quản lý",
                lv4: "Quản lý giao diện",
                lv5: "Tạo trang",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Quản lý",
                lv4: "Quản lý giao diện",
                lv5: "Workflow",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý dự án",
                essay: projectName,
                lv3: "Xuất dự án",
                lv4: "",
                lv5: "",
                link: "https://www.example.com"
            }
        ];
    };

    const treeChart = async (projects) => {
        let baseData = [
            {
                site: "DIPEs Management",
                category: "Workflow",
                essay: "",
                lv3: "",
                lv4: "",
                lv5: "",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Quản lý người dùng",
                essay: "Thêm mới người dùng",
                lv3: "",
                lv4: "",
                lv5: "",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Xuất báo cáo",
                essay: "",
                lv3: "",
                lv4: "",
                lv5: "",
                link: "https://www.example.com"
            },
            {
                site: "DIPEs Management",
                category: "Thống kê",
                essay: "",
                lv3: "",
                lv4: "",
                lv5: "",
                link: "https://www.example.com"
            }
        ];

        let projectData = projects.flatMap((project) =>
            projectDetails(project.project_name)
        );

        let data = baseData.concat(projectData);

        var parentsNumber = 6;

        let nestedData = d3
            .nest()
            .key((d) => d.site)
            .key((d) => d.category)
            .key((d) => d.essay)
            .key((d) => d.lv3)
            .key((d) => d.lv4)
            .key((d) => d.lv5)
            .entries(data);

        const treeData = d3.hierarchy(nestedData[0], (d) => d.values);

        var treeLayout = d3.tree().size([1700, 1250]);
        treeLayout(treeData);

        const treeNodes = d3.select("svg g.nodes");

        treeNodes
            .selectAll("circle.root")
            .data(
                treeData.descendants().filter((d) => d.depth == 0 && d.data.key !== "")
            )
            .enter()
            .append("circle")
            .attr("class", "circle2")
            .attr("transform", (d) => `translate(${d.y}, ${d.x}) `)
            .attr("r", 20);

        treeNodes
            .selectAll("rect.level1")
            .data(
                treeData.descendants().filter((d) => d.depth == 1 && d.data.key !== "")
            )
            .enter()
            .append("rect")
            .attr("class", "rect1")
            .attr("transform", (d) => `translate(${d.y},${d.x}) `)
            .attr("width", (d) => ((d.data.key + " ").length + 2) * 8)
            .attr("height", 27)
            .attr("x", -27 / 2)
            .attr("y", -27 / 2)
            .attr("rx", 5)
            .attr("ry", 5);

        treeNodes
            .selectAll("rect.level2")
            .data(
                treeData.descendants().filter((d) => d.depth == 2 && d.data.key !== "")
            )
            .enter()
            .append("rect")
            .attr("class", "rect2")
            .attr("transform", (d) => `translate(${d.y},${d.x}) `)
            .attr("width", (d) => ((d.data.key + " ").length + 1) * 7)
            .attr("height", 27)
            .attr("x", -27 / 2)
            .attr("y", -27 / 2)
            .attr("rx", 5)
            .attr("ry", 5);

        treeNodes
            .selectAll("rect.level3")
            .data(
                treeData.descendants().filter((d) => d.depth == 3 && d.data.key !== "")
            )
            .enter()
            .append("rect")
            .attr("class", "rect3")
            .attr("transform", (d) => `translate(${d.y},${d.x}) `)
            .attr("width", (d) => (d.data.key + " ").length * 9)
            .attr("height", 27)
            .attr("x", -27 / 2)
            .attr("y", -27 / 2)
            .attr("rx", 5)
            .attr("ry", 5);

        treeNodes
            .selectAll("rect.level4")
            .data(
                treeData.descendants().filter((d) => d.depth == 4 && d.data.key !== "")
            )
            .enter()
            .append("rect")
            .attr("class", "rect1")
            .attr("transform", (d) => `translate(${d.y},${d.x}) `)
            .attr("width", (d) => ((d.data.key + " ").length + 4) * 7)
            .attr("height", 27)
            .attr("x", -27 / 2)
            .attr("y", -27 / 2)
            .attr("rx", 5)
            .attr("ry", 5);

        treeNodes
            .selectAll("rect.level5")
            .data(
                treeData.descendants().filter((d) => d.depth == 5 && d.data.key !== "")
            )
            .enter()
            .append("rect")
            .attr("class", "rect5")
            .attr("transform", (d) => `translate(${d.y},${d.x}) `)
            .attr("width", (d) => ((d.data.key + " ").length + 6) * 9)
            .attr("height", 27)
            .attr("x", -27 / 2)
            .attr("y", -27 / 2)
            .attr("rx", 5)
            .attr("ry", 5);

        d3.select("svg g.links")
            .selectAll("line")
            .data(
                treeData.links().filter(
                    (d) =>
                        d.target.data.key !== "" &&
                        d.target.data.essay !== "" &&
                        d.target.data.lv3 !== "" &&
                        d.target.data.lv4 !== "" &&
                        d.target.data.lv5 !== "" &&
                        d.source.data.lv5 !== ""
                )
            )
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", function (d) {
                return (
                    "M" +
                    d.target.y +
                    "," +
                    d.target.x +
                    "C" +
                    (d.source.y + 100) +
                    "," +
                    d.target.x +
                    " " +
                    (d.source.y + 100) +
                    "," +
                    d.source.x +
                    " " +
                    d.source.y +
                    "," +
                    d.source.x
                );
            });

        treeNodes
            .selectAll("text.nodes")
            .data(treeData.descendants())
            .enter()
            .filter((d) => d.data.key !== "" && d.depth !== 5)
            .append("text")
            .attr("class", "textweight")
            .attr("transform", (d) => `translate(${d.y - (d.depth == 0 ? 65 : 5)},${d.x - (d.depth == 0 ? 50 : -5)})`)
            .text((d) => d.data.key);

        treeNodes
            .selectAll("text.nodes.depth5")
            .data(treeData.descendants().filter((d) => d.depth === 5))
            .enter()
            .append("a")
            .attr("xlink:href", function (d) {
                let link = d.data.values[0].link;
                if (d.data.values[0].lv5 === "" && d.data.values[0].lv4 !== "") {
                    link = d.data.values[0].lv4;
                } else if (
                    d.data.values[0].lv5 === "" &&
                    d.data.values[0].lv4 === "" &&
                    d.data.values[0].lv3 !== ""
                ) {
                    link = d.data.values[0].lv3;
                } else if (
                    d.data.values[0].lv5 === "" &&
                    d.data.values[0].lv4 === "" &&
                    d.data.values[0].lv3 === "" &&
                    d.data.values[0].category !== ""
                ) {
                    link = d.data.values[0].category;
                }
                return link;
            }) // kiểm tra link
            .append("text")
            .attr("class", "text")
            .attr("transform", (d) => `translate(${d.y - (d.depth == 0 ? 65 : 5)},${d.x - (d.depth == 0 ? 50 : -5)})`)
            .text((d) => d.data.key)
            .on("mouseover", MouseOverText)
            .on("mouseout", MouseOutText);

        function MouseOverText(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "rgb(248, 228, 115)")
                .style("stroke-width", "1px")
                .style("text-decoration", "underline");
        }

        function MouseOutText(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "rgb(3, 3, 3)")
                .style("stroke-width", "1px")
                .style("text-decoration", "none");
        }
    };


    return (
        <div class="midde_cont">
            <div class="container-fluid">
                <div class="row column_title">
                    <div class="col-md-12">
                        <div class="page_title d-flex align-items-center">
                            <h4>{lang["site-map"]}</h4>
                        </div>
                    </div>
                </div>
                <div class="row column1">
                    <div class="col-md-12">
                        <div class="white_shd full margin_bottom_30">
                            <div class="full price_table padding_infor_info">
                                <div class="container-fluid">

                                    
                                    <svg width="1200" height="1700">
                                        <g transform="translate (70, 1)">

                                            <g class="links"></g>

                                            <g class="nodes"></g>


                                        </g>
                                    </svg>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

