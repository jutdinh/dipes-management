import { useSelector } from "react-redux";

export default () => {
    const { proxy, lang } = useSelector( state => state );

    return(
        <div class="topbar">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="full d-flex flex-row">
                    <button type="button" id="sidebarCollapse" class="sidebar_toggle"><i class="fa fa-bars"></i></button>
                    <div class="logo_section">
                       <a href="index.html"><img class="img-responsive" src="images/logo/logo.png" alt="#" /></a>
                    </div>
                    <div class="right_topbar ml-auto">
                       <div class="icon_info">
                          <ul>
                                <li><a href="#"><i class="fa fa-bell-o"></i><span class="badge">2</span></a></li>
                                {/* <li><a href="#"><i class="fa fa-question-circle"></i></a></li> */}
                                <li><a href="#"><i class="fa fa-envelope-o"></i><span class="badge">0</span></a></li>
                            </ul>
                            <ul class="user_profile_dd">
                                <li>
                                    <a class="dropdown-toggle" data-toggle="dropdown">
                                        <img class="img-responsive rounded-circle" src={proxy + "/image/avatar/moc.png"} alt="#" />
                                        <span class="name_user">Mốc Nè</span>
                                    </a>
                                    <div class="dropdown-menu">
                                       <a class="dropdown-item" href="profile.html">{ lang["my profile"] }</a>
                                       <a class="dropdown-item" href="settings.html">{ lang["settings"] }</a>
                                       <a class="dropdown-item" href="help.html">{ lang["help"] }</a>
                                       <a class="dropdown-item" href="#"><span>{ lang["signout"] }</span> <i class="fa fa-sign-out"></i></a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}