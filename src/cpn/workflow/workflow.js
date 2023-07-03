
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
  const [projects, setProjects] = useState([]); // Now projects is an array

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
          const projectsData = data.map(project => {
            let projectChildren = [
              {
                title: "Chi tiết",
                url: `/projects/detail/${project.project_id}`,
                children: [
                  {
                    title: "Cập nhật thông tin",
                    url: `/projects/detail/${project.project_id}`,
                    
                  },
                  {
                    title: "Quản lý",
                    url: `/projects/detail/${project.project_id}`,
                    children: [
                      {
                        title: 'Quản lý bảng',
                        url: `/projects/${project.project_id}/tables`,
              
                      },
                      {
                        title: 'Quản lý API',
                        url: `/projects/${project.project_id}/apis`,
              
                      },
                      {
                        title: 'Quản lý UI',
                        url: `/projects/${project.project_id}/uis`,
              
                      }
              
              
                    ],
                  },
                  {
                    title: "Xuất dự án",
                    url: `/projects/detail/${project.project_id}`
                  },
                  
                ],
              },
            ];

            return {
              title: project.project_name,
              url: `/projects/${project.project_id}`,
              children: projectChildren,
            };
          });

          // Now projectsInfo is a new object that contains the projects data
          const projectsInfo = {
            title: 'Quản lý dự án',
            url: '/projects',
            children: projectsData,
          };

          console.log(projectsInfo)
          // setProjects will update the projects state variable with the new projects data
          setProjects(prevProjects => [...prevProjects, projectsInfo]);
        } else {
          // window.location = "/404-not-found"
        }
      })
  }, [])

  const siteMapData = [
    {
      title: 'Trang chủ',
      url: '/',
      children: [],
    },
    ...projects,
    {
      title: 'Quản lý người dùng',
      url: '/users',
    },
    {
      title: 'Thống kê',
      url: '/statis',
    },
    {
      title: 'Báo cáo',
      url: '/report',
    },
    {
      title: 'Site map',
      url: '/sitemap',
    },
    {
      title: 'Giới thiệu',
      url: '/about',
    },
  ];
  // const siteMapData = [
  //   {
  //     title: 'Trang chủ',
  //     url: '/',
  //     children: [],
  //   },
  //   ...projects,
  //   {
  //     title: 'Quản lý người dùng',
  //     url: '/users',
  //     children: [
  //       {
  //         title: 'á',
  //         url: '/',

  //       }


  //     ],
  //   },
  // ];



  const PageItem = ({ title, url, children, level }) => {
    const itemStyle = {
      marginLeft: `${level * 20}px`,
    };
  
    const [isExpanded, setIsExpanded] = useState(true);
  
    let itemClass = "";
    switch(level) {
      case 0: 
        itemClass = "level-0";
        break;
      case 1: 
        itemClass = "level-1";
        break;
      case 2: 
        itemClass = "level-2";
        break;
      default:
        itemClass = "";
    }
  
    return (
      <li className={itemClass} style={itemStyle}>
        {children && children.length > 0 && (
          <button class="btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '-' : '+'}
          </button>
        )}
        <a href={url}>{title}</a>
        {isExpanded && children && children.length > 0 && <ul>{children}</ul>}
      </li>
    );
  };
  

  const renderPageItems = (items, level = 0) => {
    return items.map((item) => (
      <PageItem key={item.url} title={item.title} url={item.url} level={level}>
        {item.children &&
          item.children.length > 0 &&
          renderPageItems(item.children, level + 1)}
      </PageItem>
    ));
  };

  const SiteMap = ({ data }) => {
    return <ul>{renderPageItems(data)}</ul>;
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

                  <div class="siteMap">
                    <SiteMap data={siteMapData} />
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

