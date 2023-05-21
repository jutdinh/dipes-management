import { useSelector } from "react-redux"

export default () => {
    const { proxy, lang } = useSelector(state => state)
    return(
            <nav id="sidebar">
               <div class="sidebar_blog_1">
                  <div class="sidebar-header">
                     <div class="logo_section">
                        <a href="/"><img class="logo_icon img-responsive" src="images/logo/logo_icon.png" alt="#" /></a>
                     </div>
                  </div>
                  <div class="sidebar_user_info">
                     <div class="icon_setting"></div>
                     <div class="user_profle_side">
                        <div class="user_img"><img class="img-responsive" src={proxy + "/image/avatar/moc.png"} alt="#" /></div>
                        <div class="user_info">
                           <h6>Mốc Nè</h6>
                           <p><span class="online_animation"></span> { lang["online"] } </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="sidebar_blog_2">
                  <h4>{ lang["general"] }</h4>
                  <ul class="list-unstyled components">
                     <li class="active">
                        <a href="#dashboard" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-dashboard yellow_color"></i> <span>{ lang["dashboard"] }</span></a>
                        <ul class="collapse list-unstyled" id="dashboard">
                           <li>
                              <a href="/projects"> <span>{ lang["projects manager"] }</span></a>
                           </li>
                           <li>
                              <a href="/accounts"> <span>{ lang["accounts manager"] }</span></a>
                           </li>
                        </ul>
                     </li>
                     <li><a href="/tasks"><i class="fa fa-clock-o orange_color"></i> <span>{ lang["tasks"] }</span></a></li>
                     {/* <li>
                        <a href="#element" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-diamond purple_color"></i> <span>Elements</span></a>
                        <ul class="collapse list-unstyled" id="element">
                           <li><a > <span>General Elements</span></a></li>
                           <li><a > <span>Media Gallery</span></a></li>
                           <li><a > <span>Icons</span></a></li>
                           <li><a > <span>Invoice</span></a></li>
                        </ul>
                     </li> */}
                     <li><a href="/statistic"><i class="fa fa-bar-chart-o purple_color2"></i> <span>{ lang["statistic"] }</span></a></li>
                     {/* <li>
                        <a href="#apps" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-object-group blue2_color"></i> <span>Apps</span></a>
                        <ul class="collapse list-unstyled" id="apps">
                           <li><a > <span>Email</span></a></li>
                           <li><a> <span>Calendar</span></a></li>
                           <li><a > <span>Media Gallery</span></a></li>
                        </ul>
                     </li>
                     <li><a href="price.html"><i class="fa fa-briefcase blue1_color"></i> <span>Pricing Tables</span></a></li> */}
                     <li>
                        <a href="/contacts">
                        <i class="fa fa-paper-plane red_color"></i> <span>{ lang["contacts"] }</span></a>
                     </li>
                    
                     <li><a href="/about"><i class="fa fa-info purple_color2"></i> <span>{ lang["about us"] }</span></a></li>
                    
                     <li><a href="/settings"><i class="fa fa-cog yellow_color"></i> <span>{ lang["settings"] }</span></a></li>
                  </ul>
               </div>
            </nav>
    )
}