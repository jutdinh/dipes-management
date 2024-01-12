import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from "@fortawesome/free-solid-svg-icons"
import $ from 'jquery';

export default (props) => {
    const { cache, gridState, preview } = useSelector(state => state)
    const { id, zIndex, insertComponent,
        renderFrontLiner,
        renderBackLiner,
        parent
    } = props

    const dispatch = useDispatch()

    const isActive = () => {

        /**
         * Nếu nhỏ này là có id là activeComponent hay hoverComponent thì kể như đang active
         */

        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
            return true
        }
        return false
    }

    const SwitchingState = () => {

        /**
         *  Chuyển đổi trạng thái active cho nhỏ này
         */

        const { activeComponent } = cache;
        if (activeComponent != id) {
            dispatch({
                branch: "design-ui",
                type: "setActiveComponent",
                payload: {
                    id
                }
            })
            $('#property-trigger').click()
        }

    }

    const ComponentHover = () => {

        /**
         *  Chuyển đổi trạng thái hover cho nhỏ này
         */

        dispatch({
            branch: "design-ui",
            type: "setHoverComponent",
            payload: {
                id
            }
        })
    }


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            {renderFrontLiner(id, parent)}
            <div
                className={`design-zone text-design ${isActive() ? "design-zone-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ zIndex }}
            >

            </div>
            {renderBackLiner(id, parent)}
        </div>
    )
}