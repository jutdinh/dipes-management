
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
 
    const siteMapData = [
        {
          title: 'Trang chủ',
          url: '/',
          children: [
            {
              title: 'Về chúng tôi',
              url: '/about',
            },
            {
              title: 'Sản phẩm',
              url: '/products',
              children: [
                {
                  title: 'Sản phẩm A',
                  url: '/products/a',
                },
                {
                  title: 'Sản phẩm B',
                  url: '/products/b',
                  children: [
                    {
                      title: 'Sản phẩm B.1',
                      url: '/products/b/1',
                    },
                    {
                      title: 'Sản phẩm B.2',
                      url: '/products/b/2',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Liên hệ',
              url: '/contact',
            },
          ],
        },
      ];
      const PageItem = ({ title, url, children, level }) => {
        const itemStyle = {
          marginLeft: `${level * 20}px`,
        };
      
        let prefix = '';
        if (level === 0) {
          prefix = '🔹'; // Ký hiệu trang cha
        } else if (level === 1) {
          prefix = '🔸'; // Ký hiệu trang con
        } else {
          prefix = '◽️'; // Ký hiệu trang cháu
        }
      
        return (
          <li style={itemStyle}>
            {prefix} <a href={url}>{title}</a>
            {children && children.length > 0 && <ul>{children}</ul>}
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

                                     <SiteMap data={siteMapData} />
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

