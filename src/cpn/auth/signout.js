import { useEffect } from "react"
export default () => {
    useEffect(() => {     
        localStorage.removeItem( '_token' )

        localStorage.removeItem('expandedSubsubtasks');
        localStorage.removeItem('expandedTasks');
        // console.log( localStorage.getItem("_token") )
        window.location = "/login"
    }, [])
    return null
}