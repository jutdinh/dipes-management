import { useDispatch, useSelector } from 'react-redux';
export default () => {
    const { proxy, lang } = useSelector(state => state)
    const tabInfors = [
        {   
            index: 0,
            icon: { icon: "fa-cube", color: " yellow_color" },
            title: lang["data"],
            content: lang["data.content"],
        },
        {   
            index: 1,
            icon: { icon: "fa-cog", color: " blue1_color" },
            title: lang["tool"],
            content: lang["tool.content"],
        },
        {   
            index: 2,
            icon: { icon: "fa-refresh", color: "green_color" },
            title: lang["fast"],
            content: lang["fast.content"],
        },
        {   
            index: 3,
            icon: { icon: "fa-puzzle-piece", color: "red_color" },
            title: lang["flexible"],
            content: lang["flexible.content"],
        },
    ]


   const staffInfors = [
      {
         media: {
            image: "/assets/image/about/mrsLinh.png"
         },
         info: {
            fullname: "Trần Thị Mai Linh",
            role: "Leader",
            description: ""
         }
      },
      {
         media: {
            image: "/assets/image/about/mrNhan.png"
         },
         info: {
            fullname: "Tô Trọng Nhân",
            role: "Frontend Engineer",
            description: ""
         }
      },
      {
         media: {
            image: "/assets/image/about/be-cong.png"
         },
         info: {
            fullname: "Huỳnh Văn Công",
            role: "Backend Engineer",
            description: ""
         }
      },
   ] 


    return(
        <div>
            <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
                <div class="col-md-5 p-lg-5 mx-auto my-5">
                    <h1 class="display-4 font-weight-normal">DIPES</h1>
                    <p class="lead font-weight-normal">DIGITAL INDUSTRIAL PLATFORM ECOSYSTEM</p>
                    <a class="btn btn-outline-secondary" href="/projects">Start now</a>
                </div>
                <div class="product-device box-shadow d-none d-md-block"></div>
                {/* <div class="product-device product-device-2 box-shadow d-none d-md-block"></div> */}
            </div>               

            <div class="midde_cont">
                <div class="container-fluid">
                    <div class="row column1">
                        { tabInfors.map( info =>                             
                        <div class="col-md-6 col-lg-3" style={{ marginTop: 16 }} >
                            <div className="counter_section" style={{ height: "100%", display: "block" }}>                            
                                <div class="full margin_bottom_30">
                                    <div class="couter_icon" style={{ width: "unset" }}>
                                        <div> 
                                            <i  class={`fa ${ info.icon.icon } ${ info.icon.color }`}></i>
                                        </div>
                                    </div>
                                    <div class="counter_no" style={{ padding: 0 }}>
                                        <div>                                            
                                            <p class="head_couter text-left">{ info.title }</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-left">{ info.content }</p>
                                </div>
                            </div>
                         </div>
                        ) }
                    
                    </div>                        
                </div>
            </div>
            
            <div class="col-md-5 mx-auto text-center _m-t-2">
               <p class="lead font-weight-normal">{lang["dev-staff"]}</p>              
            </div>
            
            <div class="row column4 graph" style={{ marginTop: 16}}>
                        
               { staffInfors.map( infor  => 
                        <div class="col-md-6 col-lg-4">
                           <div class="white_shd full margin_bottom_30">
                              <div class="full graph_head">
                                 <div class="heading1 margin_0 text-center">
                                    <img
                                       style={{ width: "50%" }}
                                       src={ infor.media.image } alt={infor.media.alt}/>
                                    <div>
                                       <span className="_text-16 _bold d-block">{ infor.info.fullname }</span>
                                       <i className="_block _text-14">{ infor.info.role }</i>
                                    </div>
                                 </div>
                              </div>
                              <div class="full progress_bar_inner">
                              </div>
                           </div>
                        </div>
                     ) }
                  
               </div>
                        

            <div className="_m-t-2">
                <div className="_rel _flex _flex-wrap _fade-in-ease _trans-dark">
                    <div className="_p-1 _white _w-50-pct _flex-wrap-child">
                        <span className="_block _text-16-px">Liên hệ </span>
                        <span className="_block _text-16-px">Email: <b>linh.tran@mylangroup.com</b></span>
                        <span className="_text-14-px _white _block _m-t-2">Mọi đóng góp và câu hỏi vui lòng gửi cho chúng tôi bất kỳ lúc nào, chúng tôi cố gắng trả lời tất cả các câu hỏi trong vòng 24 giờ vào ngày làm việc. Rất hân hạnh được trả lời câu hỏi của bạn.</span>
                    </div>
                </div>
            </div>

        </div>
    )
}