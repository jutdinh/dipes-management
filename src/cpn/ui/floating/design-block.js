import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont, faTable } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from 'react-redux'



export default () => {
    const { floating } = useSelector( state => state )
    const { icon, offset } = floating
    

    return (
        <div className="floating-box design-block" style={{ top: offset.top, left: offset.left, transition: "unset" }}>
            <div className="block">
                <div className="block-icon">
                    { icon.icon &&
                        <FontAwesomeIcon icon={ icon.icon } />
                    }
                </div>
                <span className="block-name">{ icon.text }</span>
            </div>
        </div>
    )
}