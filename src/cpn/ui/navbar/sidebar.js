import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Properties from './properties'
import Design from './design'
import Themes from './themes'


export default () => {
    const { preview } = useSelector( state => state )
    const [ active, setActive ] = useState(0)    
    const widthes = [ 80, 85, 70 ]
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            branch: "design-ui",
            type: "helloworld"
        })
    }, [])

    const renderSidebarSection = () => {        
        switch(active){
            case 0:
                return <Design />
            case 1:
                return <Properties />
            case 2:
                return <Themes />
            default:
                return <span>Vì em là người thổn thức canh dài vì thương anh</span>
        }
    }

    return (
       <div className="sidebar" style={{ display: preview ? "none": "flex" }}>
            <div className="sidebar-container">                

                <div className="tabbed">
                    <div className="tab" onClick={() => { setActive(0) }}>
                        <span><b>Thiết kế</b></span>
                    </div>

                    <div className="tab" id="property-trigger" onClick={() => { setActive(1) }}>
                        <span><b>Thuộc tính</b></span>
                    </div>

                    <div className="tab" onClick={() => { setActive(2) }}>
                        <span><b>Chủ đề</b></span>
                    </div>
                    
                    <span className="pivot" style={{ left: `${ (( 115 - widthes[active]) / 2) + active * 115 }px`, width: widthes[active] }}/>
                </div>

                <div className="sidebar-util">
                    { renderSidebarSection() }
                </div>


            </div>
       </div>
    )
}