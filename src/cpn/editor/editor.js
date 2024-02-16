import { useSelector } from "react-redux";
import { Dropdown } from "../common";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import $ from 'jquery';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize)

export default (props) => {
    const { value, onChange } = props
    const modules = {
        toolbar: [
            //   [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', /*'blockquote'*/],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, /*{ 'indent': '-1' }, { 'indent': '+1' }*/],
            ['link', /*'image'*/],
             ['clean'],
            [{ 'color': [] }, { 'background': [] }],
            //   [{ 'font': ['UTM Avo', 'sans-serif', 'serif'] }], // Thêm UTM Avo vào đây
            [{ /*'align': [] */}],
            
        ],
        
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }
    };


    return (
        <>
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
            />
        </>
    );
};
