import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTrash, faCaretDown } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState, floating, apis, initialStates, functions } = useSelector(state => state)
    const { id, zIndex,
        insertComponent, appendChildComponent, removeComponent,
        children, leaves, parent,
        renderFrontLiner,
        renderBackLiner,
        api,
        submit_trigger,


        PropsSwitching,
        modifyChildren
    } = props

    const dispatch = useDispatch()

    const [drop, setDrop] = useState(false)
    const [drops, setDrops] = useState({
        api: false,
        btn: false,
        source: false
    })

    const targetApis = [
        { id: 1, name: "Project", value: "project" },
        { id: 2, name: "API bên thứ 3", value: "foreign" },
    ]

    const dropSwitch = (section) => {
        const sec = drops[section]
        return setDrops({ ...drops, [section]: !sec })
    }

    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
            return true
        }
        return false
    }

    const atLeastOneChildIsNotUndefined = () => {
        const filtedChildren = children.filter(c => c != undefined)
        return filtedChildren.length
    }

    const SwitchingState = () => {
        const { activeComponent } = cache;
        
        if (activeComponent != id) {
            dispatch({
                branch: "design-ui",
                type: "setActiveComponent",
                payload: {
                    id
                }
            })
        }
    }

    const ComponentHover = () => {
        dispatch({
            branch: "design-ui",
            type: "setHoverComponent",
            payload: {
                id
            }
        })
    }

    const FormAppendsChild = () => {
        appendChildComponent(id)
    }


    const DropSwitch = () => {
        setDrop(!drop)
    }

    const changeTargetType = (target) => {

        const newApi = { ...api }
        newApi.api_type = target.value

        PropsSwitching(id, "api", newApi)
        dropSwitch("source")
    }

    const getApiTargetName = () => {
        const corespond = targetApis.find(target => target.value == api.api_type)
        return corespond ? corespond.name : "Unknown"
    }

    const getDecsButtonRecursive = (components) => {
        const buttons = []
        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]
            const { name } = cpn
            if (name == "button") {
                buttons.push(cpn)
            } else {
                const { children } = cpn;
                if (children) {
                    const descButtons = getDecsButtonRecursive(children)
                    buttons.push(...descButtons)
                }
            }
        }
        return buttons
    }

    const getAllDescButtons = () => {
        return getDecsButtonRecursive(leaves)

    }

    const changeApi = (targetAPI) => {

        const { body_detail, api_id, url } = targetAPI;

        const formated_body = body_detail.map(field => {
            const { fomular_alias, field_name, props } = field;
            return {
                fomular_alias,
                field_name,
                data_type: props.DATATYPE,
                required: !props.NULL,
            }
        })

        const newApi = { ...api }
        newApi.api = api_id
        newApi.api_name = targetAPI.api_name
        newApi.url = url
        newApi.body = formated_body

        const formatedChildren = []

        for (let i = 0; i < formated_body.length; i++) {
            const field = formated_body[i]
            const entry = { ...initialStates["entry"], id: functions.getFormatedUUID() }
            const props = {
                title: {
                    content: field.field_name,
                    visible: true
                },
                placeholder: {
                    content: "",
                    visible: true
                },
                variable_name: field.fomular_alias,
                required: field.required
            }
            formatedChildren.push({ ...entry, props })
        }



        const title = { ...initialStates["text"], id: functions.getFormatedUUID() }
        title.props.content = newApi.api_name;

        const submit = { ...initialStates["button"], id: functions.getFormatedUUID() }
        submit.props.content = "Submit"

        formatedChildren.unshift(title)
        formatedChildren.push(submit)

        modifyChildren(id, formatedChildren)

        PropsSwitching(id, "api", newApi)
        dropSwitch("api")
    }

    const changeForeignApiURL = (e) => {
        const url = e.target.value;
        const newApi = { ...api }

        newApi.url = url
        PropsSwitching(id, "api", newApi)
    }

    const findButtonByID = (components, id) => {
        const buttons = []
        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]

            if (cpn.id == id) {
                buttons.push(cpn)
            } else {
                const { children } = cpn;
                if (children) {
                    const descButtons = findButtonByID(children, id)
                    buttons.push(descButtons)
                }
            }
        }
        return buttons[0]
    }

    const getButtonTrigger = () => {
        const button = findButtonByID(leaves, submit_trigger)
        return button
    }

    const changeTriggerButton = (button) => {

        PropsSwitching(id, "submit_trigger", button.id)

        dropSwitch("trigger")
    }


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            {renderFrontLiner(id, parent)}
            <div
                className={`design-zone form-design  ${isActive() ? "design-zone-active form-design-active" : ""}`}
                onMouseEnter={ComponentHover}
                style={{ zIndex }}
                onMouseUp={FormAppendsChild}
            >
                {/* {
                    drop && <div className="configs">
                        <div className="title">
                            <span>Cấu hình</span>
                        </div>

                        <div className="source-config">

                            <div className="source">
                                <div className="source-title">
                                    <span>Loại API</span>
                                </div>
                                <div className="type-selection">
                                    <div className="type">
                                        <div className="type-name">
                                            <span>{getApiTargetName(api.api_type)}</span>
                                        </div>
                                        <div className="type-icon" onClick={() => { dropSwitch("source") }}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </div>
                                    <div className="options-container" style={{ display: `${drops.source ? "block" : "none"}`, zIndex: 100 }}>
                                        <div className="options">
                                            {
                                                targetApis.map(src =>
                                                    <div className="option" key={src.id} onClick={() => { changeTargetType(src) }}>
                                                        <span>{src.name}</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>




                            {
                                api.api_type == "project" && <div className="source-config">

                                    <div className="source">
                                        <div className="source-title">
                                            <span>API</span>
                                        </div>
                                        <div className="type-selection" style={{ width: 335 }}>
                                            <div className="type">
                                                <div className="type-name">
                                                    <span>{api.api_name}</span>
                                                </div>
                                                <div className="type-icon" onClick={() => { dropSwitch("api") }}>
                                                    <FontAwesomeIcon icon={faCaretDown} />
                                                </div>
                                            </div>
                                            <div className="options-container" style={{ display: `${drops.api ? "block" : "none"}`, zIndex: 99 }}>
                                                <div className="options">
                                                    {
                                                        apis.map(src =>
                                                            <div className="option" key={src.api_id} onClick={() => { changeApi(src) }}>
                                                                <span>{src.api_name}</span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }


                            {
                                api.api_type == "foreign" && <div className="source-config">

                                    <div className="source">
                                        <div className="source-title">
                                            <span>URL</span>
                                        </div>
                                        <div className="type-selection" style={{ width: 335 }}>
                                            <div className="type">
                                                <input className="type-name" value={api.url} placeholder="API URL" onChange={changeForeignApiURL} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }


                            <div className="source">
                                <div className="source-title">
                                    <span>Nút kích hoạt biểu mẫu</span>
                                </div>
                                <div className="type-selection">
                                    <div className="type">
                                        <div className="type-name">
                                            <span>{getButtonTrigger() ? getButtonTrigger().props.title : ""}</span>
                                        </div>
                                        <div className="type-icon" onClick={() => { dropSwitch("trigger") }}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </div>
                                    <div className="options-container" style={{ display: `${drops.trigger ? "block" : "none"}`, zIndex: 98 }}>
                                        <div className="options">
                                            {
                                                getAllDescButtons().map(src =>
                                                    <div className="option" key={src.id} onClick={() => { changeTriggerButton(src) }}>
                                                        <span>{src.props.title}</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                } */}


                {atLeastOneChildIsNotUndefined() ?
                    children
                    :
                    <div className={`placeholder ${gridState ? "grid-active" : ""}`}>
                        <span className="default-text">FORM</span>
                    </div>
                }
                {/* {isActive() && <div className="flex-utilities">
                    <div className="style-group">
                        <div className="icon-ne">
                            <FontAwesomeIcon icon={faCog} onClick={() => { DropSwitch() }} />
                        </div>
                    </div>
                    <div className="style-group">
                        <div className="icon-ne">
                            <FontAwesomeIcon icon={faTrash} onClick={() => { removeComponent(id) }} />
                        </div>
                    </div>
                </div>} */}



                <div className="trigger-bg" onClick={SwitchingState} ></div>

            </div>


            {renderBackLiner(id, parent)}
        </div>
    )
}

