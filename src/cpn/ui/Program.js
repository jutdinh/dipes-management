import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Navbar, Sidebar } from './navbar'
import { App } from './app/index'
import { FloatingBoxes } from './floating';
import { useParams } from 'react-router-dom';

export default () => {

    const dispatch = useDispatch()
    const pages = useSelector( state => state.pages )
    const proxy = useSelector( state => state.proxy )
    const params = useParams()

    const token = localStorage.getItem('_token')

    useEffect(() => {          

        fetch(`${ proxy }/uis/${ params.version_id }/savedui`, {
            headers: {
                "Authorization": token
            },            
        }).then((res) => res.json()).then(res => {
            const { ui } = res.data;
            const { last_modified_by, last_modified_at, pages } = ui
            
            dispatch({
                branch: "design-ui",
                type: "initState",
                payload: {
                    pages
                }
            })
        })


        fetch(`${ proxy }/apis/v/${ params.version_id }`, {
            headers: {
                "Authorization": token
            }
        }).then( res => res.json() ).then( res => {
            const { apis } = res.data;
            dispatch({
                branch: "default",
                type: "setAPIList",
                payload: { apis }
            })
        })

        fetch(`${ proxy }/db/tables/v/${ params.version_id }/tables/fields`, {
            headers: {
                "Authorization": token
            }
        }).then( res => res.json() ).then( res => {
            const { tables, fields } = res.data;            
            
            dispatch({
                branch: "default",
                type: "setDatabase",
                payload: { tables, fields }
            })

        })

    }, [])

    return (
        <div className="main-page">            
            <Navbar />      
            <Sidebar/>
            <App/>      
            <FloatingBoxes/>
        </div>
    );
}


