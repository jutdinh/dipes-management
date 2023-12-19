import { useSelector } from "react-redux"

import Navbar from "./cpn/navbar"
import Topbar from "./cpn/topbar"
import Playground from "./cpn/playground"

export default () => {

    const page = useSelector(state => state.page )

    if( page ){

        return(
            <div className="app">
                <div className="app-container" >
                    
                    <Topbar />
                    <Navbar />
                    <Playground />
                    
                </div>
            </div>
        )
    }else{
        return(
            <div className="app">
                <div className="app-container" >
                    <div style={{ height: 12000 }}                
                    >                      
                    </div>
                </div>
            </div>
        )
    }
}