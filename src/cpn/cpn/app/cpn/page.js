import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faHome } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

import $ from 'jquery';

export default (props) => {    
    const icons = useSelector( state => state.icons )
    const [drop, setDrop] = useState(true)
    const [ initalHeight, setInitHeight ] = useState(undefined)

    const dispatch = useDispatch()
    const { page } = props

    const ClickTrigger = () => {
        dispatch({
            branch: "design-ui",
            type: "pageSelected",
            payload: {
                page
            }
        })
    }

    const DropChildren = (e) => {
        const nearestGroup = $(e.target).closest('.page-group').find('.child-pages')[0]

        if( !initalHeight ){
            setInitHeight($(nearestGroup).height())
        }
        $(nearestGroup).css({
            height: drop ? "0px" : initalHeight
        })
        setDrop( !drop )
    }

    
    return (
        <div className={"page-container"}>
            <span className="page-front"/>
            <div className="page" key={page.page_id} onClick={ ClickTrigger }>
                <div className="icon"><FontAwesomeIcon icon={ page.is_home ? faHome : icons[ page.icon ].icon } /></div>
                <div className="name">
                    <span>{page.page_title}</span>
                </div>    
                {
                    page?.children?.length > 0 ? 
                        <div className="drop-toggle" onClick={ DropChildren }>
                            <FontAwesomeIcon icon={ faCaretDown }/>
                        </div> 
                    : null
                }
            </div>
            <span className="page-behind"/>
        </div>
    )
}