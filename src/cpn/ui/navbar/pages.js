import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faCog, faEye, faEyeSlash, faHome, faRocket, faSeedling, faStar } from "@fortawesome/free-solid-svg-icons"

import Page from './page'

import $ from 'jquery';

export default () => {
    const { pages, page, preview } = useSelector(state => state)
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


        if( page.children.length == 0 ){
            dispatch({
                branch: "design-ui",
                type: "pageSelect",
                payload: {
                    page                    
                }
            })
        }
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

    const PreviewTrigger = () => {
        dispatch({
            branch: "design-ui",
            type: "PreviewTrigger"
        })
    }

    

    return (
        <div className="pages">
            <div className="pages-container">
                {pages.map(p => 
                    RenderPagesTree(p)
                )}
            </div>

            { !preview && 
                <div className="add-icon" style={{ background: "#007bff" }} onClick={  PreviewTrigger  }>
                    <FontAwesomeIcon icon={ faEye } />
                </div>
            }

            { preview && 
                <div className="add-icon" style={{ backgroundColor: "red" }} onClick={ PreviewTrigger }>
                    <FontAwesomeIcon icon={faEyeSlash} />
                </div>
            }
        </div>
    )
}