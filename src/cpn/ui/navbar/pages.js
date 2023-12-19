import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faCog, faHome, faRocket, faSeedling, faStar } from "@fortawesome/free-solid-svg-icons"

import Page from './page'

import $ from 'jquery';

export default () => {
    const { pages, page } = useSelector(state => state)
    const dispatch = useDispatch()
    useEffect(() => {

    }, [])

    const createPage = () => {
        dispatch({
            branch: "design-ui",
            type: "createPage"
        })
    }

    const pageSettingTrigger = (e, page) => {

        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger",
            payload: {
                offset: $(e.target).offset()
            }
        })

        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "pageModify"
            }
        })

        dispatch({
            branch: "floating-boxes",
            type: "setCache",
            payload: {
                name: "page",
                value: page
            }
        })
    }

    

    const RenderPagesTree = (page) => {
        if (page.children.length > 0) {
            return (
                <div>
                    <Page page={page} pageSettingTrigger={ pageSettingTrigger }/>
                    <div className="child-pages">
                        {page.children.map(child =>
                             RenderPagesTree(child)
                        )}
                    </div>
                </div>
            )
        } else {
            return (
               <Page page={ page } pageSettingTrigger={ pageSettingTrigger }/>
            )
        }
    }

    return (
        <div className="pages">
            <div className="pages-container">
                {pages.map(p => 
                    RenderPagesTree(p)
                )}
            </div>

            <div className="add-icon" onClick={createPage}>
                <FontAwesomeIcon icon={faAdd} />
            </div>
        </div>
    )
}