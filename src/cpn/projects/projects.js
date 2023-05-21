import { useSelector } from "react-redux"

import { Header, SearchBar, Dropdown } from "../common"

export default () => {
    const { lang } = useSelector( state => state );

    const sortOptions = [
        { id: 0, label: "Mới nhất", value: "latest" },
        { id: 1, label: "Cũ nhất", value: "oldest" },
    ]

    const projects = [
        
    ]

    const sortProjects = () => {

    }

    return(
        <div className="container">
            <Header title={ lang["projects.title"] } desc={ lang["projects.desc"] }/> 
            <div className="mt-2">
                <SearchBar />
                <div className="d-flex flex-nowrap mt-2">
                    <div>
                        <span>24 { lang["results"] }</span>
                    </div>
                    <div className="ml-auto d-flex flex-nowrap">
                        <Dropdown options={ sortOptions } func={ sortProjects } defaultValue={ sortOptions[0] } bg={"bg-light"}/>
                    </div>
                </div>


            </div>           
        </div>
    )
}