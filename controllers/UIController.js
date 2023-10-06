const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { translateUnicodeToBlanText } = require('../functions/auto_value');
class UIController extends Controller {

    constructor(){
        super();
    }

    generalCheck = async ( req, version_id = 0 ) => {
        const verified = await this.verifyToken(req)
        const context = {
            success: false,
            status: "0x4501216",
            content: "Token khum hợp lệ"
        }
        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") )
            const ProjectsModel = new Projects()
            const query = {}
            query[`versions.${ version_id }`] = { $ne: undefined }
            const project = await ProjectsModel.find(query, false)            
            if( project ){
                const Project = new ProjectsRecord( project )
                context.success = true;
                context.content = "Thành công nhe mấy má"                
                context.objects = {                                  
                    Project,
                    user: decodedToken,
                    version: Project.getData().versions[`${version_id}`]
                }
            }else{
                context.content = "Dự án khum tồn tại"
                context.status  = "0x4501213"
            }
        }
        return context
    }


    getUIs =  async (req, res) => {
        const { version_id } = req.params;
        const context = await this.generalCheck( req, version_id )

        const { success, objects } = context;

        if( success ){
            const { Project, version } = objects;
            const apis = Object.values(version.apis) 

            const serializedApis = {}
            apis.map( api => {
                serializedApis[api.api_id] = api
            })

            const uis = Object.values(version.uis)
            const tables = Object.values(version.tables)
            let serializedFields = {}

            tables.map( table => {
                serializedFields = { ...serializedFields, ...table.fields }
            })

            uis.map( ui => {
                const components = Object.values(ui.components);
                
                components.map( cpn => {
                    const { api_get } = cpn;
                    if( api_get ){
                        const api_id = api_get.split('/')[2]
                        const api = serializedApis[ api_id ]
                        
                        if( api ){
                            const { fields, calculates } = api;
                            
                            cpn.fields = Object.values({...fields, ...calculates})
                        }
                    }
                })
                ui.components = components
            })

            context.data = { uis }
            context.content = ""
            context.status = "0x"
        }

        delete context.objects
        res.status(200).send(context)
    }

    getUI =  async (req, res) => {
        const { version_id, ui_id } = req.params;
        const context = await this.generalCheck( req, version_id )

        const { success, objects } = context;

        if( success ){
            const { Project, version } = objects;
            const uis = Object.values(version.uis)

            const ui = uis.find( u => u.ui_id.toString() == ui_id.toString() )
            context.data = { ui }
        }

        delete context.objects
        res.status(200).send(context)
    }

    findUI = (version, URL) => {
        const uis = Object.values( version.uis )
        const targetUi = uis.find( ui => ui.url == URL )
        return targetUi ? targetUi : false;
    }

    fieldsAndKeysSeperator = (table) => {
        const { primary_key, fields } = table;
        const parsedFields = Object.values( fields )        

        const primaryFields = parsedFields.filter( field => primary_key.indexOf( field.id ) != -1 )
        const normalFields = parsedFields.filter( field => primary_key.indexOf( field.id ) == -1 )

        return { keyFields: primaryFields, normalFields }
    }
    
    createUI =  async ( req, res ) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)
        console.log(req.body.widget)
        const { success, objects } = context;
        
        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()
            const bodyNullCheck = this.notNullCheck(req.body, ["ui", "widget"]);    
            if( bodyNullCheck.valid ){
                const { ui, widget } = req.body;
                const uiNullCheck = this.notNullCheck( ui, ['title', 'status'] )
                
                if( uiNullCheck.valid ){
                    const rawURL = translateUnicodeToBlanText( ui.title.toLowerCase() );
                    const URL = `/` + rawURL.replaceAll(" ", '-');                    
                    const existedURL = this.findUI(version, URL)

                    if( !existedURL ){
                        const table = version.tables[`${ widget.table_id }`]

                        if( table ){

                            const { keyFields, normalFields } = this.fieldsAndKeysSeperator( table )
                            
                            if( keyFields.length > 0 ){

                                if( normalFields.length != 0 ){

                                    const fields = Object.values( table.fields )
                                    const apiPrefix = "HIDDEN GET API FOR UI "
                                    const apiDescription = "This api was automatically created for UI purpose, DO NOT manipulating this for any reason!"
                                    const GET   = {
                                        api_name:  "Hidden GET API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        body: [],
                                        params: [],
                                        tables: [ table.id ],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "get",
                                        api_scope: "private"
                                    }
                                    const POST  = {
                                        api_name:  "Hidden POST API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [ table.id ],   
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }
                                    const PUT   = {
                                        api_name:  "Hidden PUT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        body: normalFields.map( field => field.id ),
                                        params: table.primary_key,
                                        tables: [ table.id ],                                        
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "put",
                                        api_scope: "private"                       
                                    }
                                    const DELETE = {
                                        api_name:  "Hidden DELETE API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,   
                                        params: table.primary_key,                     
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: 'delete',
                                        api_scope: "private"
                                    }

                                    const SEARCH  = {
                                        api_name:  "Hidden SEARCH API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [ table.id ],                            
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }

                                    const EXPORT = {
                                        api_name:  "Hidden EXPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: fields.map(field => field.id),
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        params: [], 
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [ table.id ],                           
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }

                                    const IMPORT = {
                                        api_name:  "Hidden IMPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [ table.id ], 
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,                           
                                        api_method: "post",
                                        api_scope: "private"   
                                    }

                                    const rawApis = [ 
                                        { type: "ui", api: GET }, 
                                        { type: "ui", api: POST}, 
                                        { type: "ui", api: PUT}, 
                                        { type: "ui", api: DELETE}, 
                                        { type: "search", api: SEARCH}, 
                                        { type: "export", api: EXPORT},
                                        { type: "import", api: IMPORT},                                        
                                    ]                        
                                    /* ADD 6 APIS TO UI  */
                                    const APIS = []
            
                                    for( let i = 0 ; i < rawApis.length; i++ ){                                        
                                        APIS[i] = await Project.createUIAPI( rawApis[i] )
                                    }
            
                                    widget.apis = APIS
            
                                    APIS.map( api => {
                                        version.apis[`${ api.id }`] = api
                                    })
            
                                    const newUi = await Project.createUI( ui, widget, URL, user )
                                    version.uis[`${ newUi.ui_id }`] = newUi
                                    
                                    Project.__modifyAndSaveChange__( `versions.${ version.version_id }`, version )
            
                                    context.content = "Tạo UI thành công"
                                    context.status = "0x4501231"

                                    this.saveLog("info", req.ip, "__createUI", `__projectname: ${ project.project_name } | __versionname ${version.version_name} | __uititle: ${ newUi.title } __uiurl:  ${ newUi.url }`, user.username)
                                }else{
                                    context.content = "Bảng không có trường nào khác ngoài khóa chính"
                                    context.status = "0x4501227"
                                }
                            }else{
                                context.content = "Bảng không có khóa chính"
                                context.status = "0x4501226"
                            }
                        }else{
                            context.content = "Bảng không tồn tại"
                            context.status = "0x4501228"   
                        }
                    }else{
                        context.content = "URL này đã tồn tại"
                        context.status = "0x4501229"
                    }
                }
            }
        }

        delete context.objects;
        res.status(200).send(context)
    }

    createAPIandUI = async ( req, res ) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)
        
        const { success, objects } = context;
        
        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()           

            const nullCheck = this.notNullCheck( req.body, ["widget", "ui"] )
            if( nullCheck.valid ){

                const { ui, widget } = req.body

                const rawURL = translateUnicodeToBlanText( ui.title.toLowerCase() );
                const URL = `/` + rawURL.replaceAll(" ", '-');                    
                const existedURL = this.findUI(version, URL)

                if( !existedURL ){

                    const uiTables = widget.tables;
                    const uiFields = widget.fields;
    
                    const mainTable = uiTables[0]
                    const {  tables } = version;

                    const table = tables[`${ mainTable }`]

                    if( table ){
                        
                        const atLeastOneSideTableDoesNotExist = uiTables.find( tb => tables[`${tb}`] == undefined )
                        if( !atLeastOneSideTableDoesNotExist ){

                            const { keyFields, normalFields } = this.fieldsAndKeysSeperator( table )

                            if( keyFields.length > 0 ){

                                if( normalFields.length != 0 ){
                                    const allFields = []
                                    widget.tables.map( _table_id => {
                                        const _table = tables[`${ _table_id }`];
                                        allFields.push( ...Object.values(_table.fields) )
                                    })

                                    const displayFields = uiFields.map( _field_id => {
                                        return allFields.find( field => field.id == _field_id )
                                    }).filter( f => f != undefined )

                                    const mainTableFields = Object.values( table.fields )
                                    const apiPrefix = "HIDDEN GET API FOR UI "
                                    const apiDescription = "This api was automatically created for UI purpose, DO NOT manipulating this for any reason!"
                                    const GET   = {
                                        api_name:  "Hidden GET API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        fields: displayFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        body: [],
                                        params: [],
                                        tables: [ ...widget.tables ],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "get",
                                        api_scope: "private"
                                    }


                                    const POST  = {
                                        api_name:  "Hidden POST API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: mainTableFields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [ table.id ],   
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }
                                    const PUT   = {
                                        api_name:  "Hidden PUT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        fields: mainTableFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        body: normalFields.map( field => field.id ),
                                        params: table.primary_key,
                                        tables: [ table.id ],                                        
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "put",
                                        api_scope: "private"                       
                                    }
                                    const DELETE = {
                                        api_name:  "Hidden DELETE API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,   
                                        params: table.primary_key,                     
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: 'delete',
                                        api_scope: "private"
                                    }

                                    const SEARCH  = {
                                        api_name:  "Hidden SEARCH API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: mainTableFields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [ ...widget.tables ],                            
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }

                                    const EXPORT = {
                                        api_name:  "Hidden EXPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: mainTableFields.map(field => field.id),
                                        fields: mainTableFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias , display_name: field.field_name }   
                                        }),
                                        params: [], 
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [ table.id ],                           
                                        api_method: "post",
                                        api_scope: "private"                       
                                    }

                                    const IMPORT = {
                                        api_name:  "Hidden IMPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,                        
                                        body: mainTableFields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [ table.id ], 
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,                           
                                        api_method: "post",
                                        api_scope: "private"   
                                    }

                                    // console.log(GET.statistic)

                                    const rawApis = [ 
                                        { type: "api", api: GET }, 
                                        { type: "ui", api: POST}, 
                                        { type: "ui", api: PUT}, 
                                        { type: "ui", api: DELETE}, 
                                        { type: "search", api: SEARCH}, 
                                        { type: "export", api: EXPORT},
                                        { type: "import", api: IMPORT},                                        
                                    ]                        
                                    /* ADD 6 APIS TO UI  */
                                    const APIS = []
            
                                    for( let i = 0 ; i < rawApis.length; i++ ){                                        
                                        APIS[i] = await Project.createUIAPI( rawApis[i] )
                                    }
            
                                    widget.apis = APIS
            
                                    APIS.map( api => {
                                        version.apis[`${ api.id }`] = api
                                    })
            
                                    const newUi = await Project.createUI( ui, widget, URL, user )
                                    version.uis[`${ newUi.ui_id }`] = newUi
                                    
                                    Project.__modifyAndSaveChange__( `versions.${ version.version_id }`, version )
            
                                    context.content = "Tạo UI thành công"
                                    context.status = "0x4501231"

                                    context.data = { ui }

                                    this.saveLog("info", req.ip, "__createUI", `__projectname: ${ project.project_name } | __versionname ${version.version_name} | __uititle: ${ newUi.title } __uiurl:  ${ newUi.url }`, user.username)
                                }else{
                                    context.content = "Bảng không có trường nào khác ngoài khóa chính"
                                    context.status = "0x4501227"
                                }
                            }else{
                                context.content = "Bảng không có khóa chính"
                                context.status = "0x4501226"
                            }   

                        }else{
                            console.log("At least one table does not exist")
                            context.content = "Ít nhất một bảng không tồn tại hoặc đã bị xóa"
                            context.status = "0x"
                        }
                    }else{
                        // main tables does not exist
                        console.log("Main tables does not exist")
                        context.content = "Bảng chính không tồn tại hoặc đã bị xóa"
                        context.status = "0x"
                    }                    
                    
                }else{
                    // ui already existed
                    context.content = "UI này đã tồn tại"
                    context.status = "0x"
                }                

            }else{
                // request body khum hop le
                context.content = "Tham số không hợp lệ"
                context.status = "0x"
            }            
        }

        delete context.objects;
        res.status(200).send(context)
    }
    
    updateUIStatus =  async (req, res) => {
        const { version_id, ui_id, status } = req.body;
        const context = await this.generalCheck( req, version_id )

        const { success, objects } = context;

        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()
            
            if( version.uis[`${ ui_id }`] ){
                const ui = version.uis[`${ ui_id }`]
                version.uis[`${ ui_id }`].status = status;            
                Project.__modifyAndSaveChange__( `versions.${ version_id }`, version )
                
                context.status = "0x4501232"

                this.saveLog("info", req.ip, "__updateUIstatus", `__projectname: ${ project.project_name } | __versionname ${version.version_name} | __uititle: ${ ui.title } __uiurl: ${ ui.url } | __uistatus: ${ ui.status } => ${ status }`, user.username)
            }else{
                context.status = "0x4501233"
            }
        }



        delete context.objects
        res.status(200).send(context)
    }

    removeUI = async (req, res) => {
        const { version_id, ui_id } = req.body
        this.writeReq(req);
        const context = await this.generalCheck( req, version_id )

        const { success, objects } = context;
        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()
            const ui = {...version.uis[`${ ui_id }`]}
            
            delete version.uis[`${ ui_id }`]
            const toBeRemovedAPIs = []
            
            const components = Object.values( ui.components );
            for( let i = 0 ; i < components.length; i++ ){
                const cpn = components[i];
                const keys = Object.keys( cpn ).filter( key => key.includes("api_") )
                
                for( let j = 0 ; j < keys.length; j++ ){
                    toBeRemovedAPIs.push( cpn[keys[j]] )
                }
            }

            const apis = {...version.apis};
            const arraizedAPIs = Object.values( apis )

            const corespondingAPIS = arraizedAPIs.filter( api => toBeRemovedAPIs.indexOf(api.url) != -1 )
            for( let i = 0 ; i < corespondingAPIS.length; i++ ){
                delete apis[`${ corespondingAPIS[i].id }`]
            }

            version.apis = apis;

            Project.__modifyAndSaveChange__( `versions.${ version_id }`, version )

            this.saveLog("info", req.ip, "__removeUI", `__projectname: ${ project.project_name } | __versionname ${version.version_name} | __uititle: ${ ui.title } __uiurl: ${ ui.url }`, user.username)
        }
        context.status = "0x4501234"

        delete context.objects
        res.status(200).send(context)
    }

    createAPIView = async ( req, res ) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;
        
        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()
            
            const bodyNullCheck = this.notNullCheck(req.body, ["ui", "widget"]);    
            if( bodyNullCheck.valid ){
                const { ui, widget } = req.body;
                const uiNullCheck = this.notNullCheck( ui, ['title', 'status'] )
                
                if( uiNullCheck.valid ){
                    const rawURL = translateUnicodeToBlanText( ui.title.toLowerCase() );
                    const URL = `/` + rawURL.replaceAll(" ", '-');                    
                    const existedURL = this.findUI(version, URL)

                    if( !existedURL ){
                        
                        const { api_id, layout_id } = widget;
                        const apis = Object.values(version.apis)
                        const api = apis.find( a => a.api_id == api_id )                        

                        if( api.api_method == "get" ){
                            const view = await Project.createAPIView( ui.title, layout_id, api, URL, user )
                            version.uis[`${view.ui_id}`] = view 
                            Project.__modifyAndSaveChange__( `versions.${ version.version_id }`, version )
                            context.content = "Tạo UI thành công"
                            context.status = "0x4501231"
                        }else{
                            context.content = "Chỉ API GET mới được dùng để tạo View"
                            context.status = "0x4501229"
                        }
                    }else{
                        context.content = "URL này đã tồn tại"
                        context.status = "0x4501229"
                    }
                }
            }
        }
        delete context.objects
        res.send(context)
    }

}
module.exports = UIController

    