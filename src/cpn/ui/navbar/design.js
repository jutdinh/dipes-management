import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCalendarDays, faChartBar, faChartColumn, faFont, faLink, faList, faRectangleAd, faRectangleList, faSpoon, faSquare, faSquarePen, faStop, faTable, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons"

import { useDispatch, useSelector } from 'react-redux'

import $ from 'jquery';
import { useEffect } from 'react';

export default () => {
    const dispatch = useDispatch()
    const { functions, blockTypes, floating } = useSelector( state => state )
    const FloatingBoxTrigger = (e, icon, text, type) => {
        const { pageX, pageY } = e;
        
        dispatch({
            branch: "floating-boxes",
            type: "setDesignBlockCoordinateAndIcon",
            payload: {  
                type,              
                icon: {
                    icon,
                    text
                }
            }
        })

        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger",
            payload: {
                offset:{
                    top: pageY,
                    left: pageX
                },
            }        
        })
        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "designBlock"
            }
        })

        dispatch({
            branch: "design-ui",
            type: "setGridSystemState",
            payload: {
                status: true
            }            
        })

        functions.minimizeFloatingBG()


        $('*').on('mousemove', (e) => {
            const { pageX, pageY } = e;
            // console.log( { pageX, pageY } )
            dispatch({
                branch: "floating-boxes",
                type: "setOffset",
                payload: {
                    offset:{
                        top: pageY,
                        left: pageX
                    },
                }
            })                        
        })

        
        
        $('*').on('mouseup', (e) => {                   
            if( e.target.id == "playground" || e.target.id == "playground-bg" ){
                AddTrigger()
            }else{
                // UnboundBlock()
            }

            $('*').off('mousemove')
            $('*').off("mouseup")

            dispatch({
                branch: "floating-boxes",
                type: "floatingTrigger"                    
            })

            functions.restoreFloatingBG()

            dispatch({
                branch: "design-ui",
                type: "setGridSystemState",
                payload: {
                    status: false
                }            
            })            
        })
        
    }

    const AddTrigger = () => {
        const block = floating.block 
        
        if( block ){
            dispatch({
                branch: "design-ui",
                type: "addComponent",
                payload: {
                    block
                }
            })
        }
    }

    useEffect(() => {
        $('.design').on('mouseup', () => {
            UnboundBlock()
        })
    })

    const UnboundBlock = () => {
        dispatch({
            branch: "design-ui",
            type: "UnboundBlock",
        })
    }


    return(
        <div className="design">
            <div className="design-blocks">
                <span className="block-type">NỘI DUNG</span>
                <div className="blocks">

                    <div className="block" onMouseDown={ (e) => { FloatingBoxTrigger(e, faFont, "Văn bản", blockTypes.text) } }>
                        <div className="block-icon">
                            <FontAwesomeIcon icon={ faFont }/>
                        </div>
                        <span className="block-name">Văn bản</span>
                    </div>                   
                </div>


                <span className="block-type">HIỂN THỊ DỮ LIỆU</span>
                <div className="blocks">                   

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faTable, "Bảng", blockTypes.table ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faTable }/>
                        </div>
                        <span className="block-name">Bảng</span>
                    </div>

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faSpoon, "Bảng 1", blockTypes.table_param ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faSpoon }/>
                        </div>
                        <span className="block-name">Bảng 1</span>
                    </div>

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faLink, "Nút chuyển", blockTypes.redirect_button ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faLink }/>
                        </div>
                        <span className="block-name">Nút chuyển</span>
                    </div>

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faList, "Xuất khóa ngoại", blockTypes.table_export_button ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faList }/>
                        </div>
                        <span className="block-name">Xuất khóa ngoại</span>
                    </div>
                </div>

                {/* <span className="block-type">KHỐI LAYOUT</span>
                <div className="blocks">                   
                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faTableCellsLarge, "Block", blockTypes.block ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faTableCellsLarge }/>
                        </div>
                        <span className="block-name">Block</span>
                    </div>
                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faTableCellsLarge, "Flex Box", blockTypes.flex ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faTableCellsLarge }/>
                        </div>
                        <span className="block-name">Flex</span>
                    </div>
                </div> */}

                <span className="block-type">KHỐI BIỂU MẪU</span>
                <div className="blocks">                   
                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faRectangleList, "Form", blockTypes.form ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faRectangleList }/>
                        </div>
                        <span className="block-name">Form</span>
                    </div>
                </div>

                <span className="block-type">KHỐI NHẬP DỮ LIỆU</span>
                <div className="blocks">   

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faSquarePen, "Entry", blockTypes.entry ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faSquarePen }/>
                        </div>
                        <span className="block-name">Entry</span>
                    </div>

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faSquare, "Button", blockTypes.button ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faSquare }/>
                        </div>
                        <span className="block-name">Button</span>
                    </div>
                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faCalendarDays, "Datetime", blockTypes.datetime ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faCalendarDays }/>
                        </div>
                        <span className="block-name">Datetime</span>
                    </div>

                    {/* <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faStop, "Api Data Selection", blockTypes.apiCombo ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faStop }/>
                        </div>
                        <span className="block-name">Api Combo</span>
                    </div> */}

                </div>

                <span className="block-type">KHỐI BIỂU ĐỒ</span>

                <div className="blocks">   

                    <div className="block table" onMouseDown={ (e) => { FloatingBoxTrigger(e, faChartBar, "Chart bar", blockTypes.chart_1 ) } }>
                        <div className="block-icon" >
                            <FontAwesomeIcon icon={ faChartBar }/>
                        </div>
                        <span className="block-name">Chart bar</span>
                    </div>               

                </div>

            </div>
        </div>
    )
}