import { useSelector } from "react-redux"

export default () => {

    const { lang } = useSelector( state => state );

    return(
        <div classNameName="inner_page login">
            <div className="full_container">
                <div className="container">
                    <div className="center verticle_center full_height">
                        <div className="login_section">
                            <div className="logo_login">
                                <div className="center">
                                    <img width="210" src="images/logo/logo.png" alt="#" />
                                </div>
                            </div>
                            <div className="login_form d-flex flex-wrap">
                                <h1 className="block w-100 text-center display-1">404</h1>
                                <h6 className="block w-100 text-center display-4">{ lang["404"] }</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}