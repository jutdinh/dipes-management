import { useSelector } from "react-redux"

import Navbar from "./cpn/navbar"
import Topbar from "./cpn/topbar"
import Playground from "./cpn/playground"
import PreviewTopbar from "./cpn/preview-topbar"
export default () => {

    const { page, preview } = useSelector(state => state )

    return(
        <div className="app" style={ preview ? { width: "100%"  } : {}}>
            <div className="app-container" >
                
                <Topbar />

                {preview ? <PreviewTopbar /> : null}


                <Navbar />


                {
                    page ?  <Playground /> :  
                    <div style={{ height: 12000 }} >                      
                    </div>
                }
                
                
            </div>
        </div>
    )
}