import { useSelector } from "react-redux"

export default () => {

    const { lang } = useSelector( state => state );

    const submit = (e) => {
        e.preventDefault()
    }

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
                            <div className="login_form">
                                <form>
                                    <fieldset>
                                    <div className="field">
                                        <label className="label_field">{ lang["account"] }</label>
                                        <input type="email" name="email" placeholder={ lang["account"] } />
                                    </div>
                                    <div className="field">
                                        <label className="label_field">{ lang["password"] }</label>
                                        <input type="password" name="password" placeholder={ lang["password"] } />
                                    </div>
                                    <div className="field">
                                        <label className="label_field hidden">hidden label</label>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input"/>{ lang["remember me"] }</label>
                                        <a className="forgot" href="">{ lang["forgot password"] }</a>
                                    </div>
                                    <div className="field margin_0">
                                        <label className="label_field hidden">hidden label</label>
                                        <button onClick={ submit } className="main_bt">{ lang["signin"] }</button>
                                    </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}