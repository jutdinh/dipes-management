import { useSelector } from "react-redux"

import Page from './page'
import RecisePage from './recise-page';
import { useEffect, useState } from "react";
import Pages from '../../navbar/pages'

export default () => {

    const {pages, cache, preview } = useSelector( state => state ) 
    

    const RenderPagesTree = ( page ) => {
        if (page.children.length > 0) {
            return (
                <div className="page-group">
                    <Page page={page} />
                    <div className="child-pages">
                        {page.children.map(child =>
                             RenderPagesTree(child)
                        )}
                    </div>
                </div>
            )
        } else {
            return (
               <Page page={ page }/>
            )
        }
    }

    const RenderPages = ( page ) => {
        return (
            <RecisePage page={ page } />
         )
    }    
    
    // if( cache.navbar ){                                
    //     return(
    //         <div className="app-navbar">            
    //             <div className="pages">
    //                 <div className="pages-container">
    //                     {pages.map(p => 
    //                         RenderPagesTree(p)
    //                     )}
    //                 </div>          
    //             </div>
    //         </div>
    //     )
    // }
    // else{
    //     return(
    //         <div className="app-navbar" style={ {width: "36px"}}>            
    //             <div className="pages">
    //                 <div className="pages-container" >
    //                     {pages.map(p => 
    //                         RenderPages(p)
    //                     )}
    //                 </div>          
    //             </div>
    //         </div>
    //     )
    // }
    return(
        <div className="app-navbar" style={preview ? { top: "0", height: "100%" }: {}}>            
                <Pages />
            </div>
    )
}