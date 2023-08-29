
const { Controller } = require('../../config/controllers');
const { Projects, ProjectsRecord } = require('../../models/Projects');
const { ProjectMembers } = require('../../models/ProjectMembers');
const { Tables, TablesRecord } = require('../../models/Tables');
const { Versions, VersionsRecord } = require('../../models/Versions');
const { intValidate, objectComparator } = require('../../functions/validator');
const { Fields, FieldsRecord } = require('../../models/Fields');

class TablesController extends Controller {
    #__tables = new Tables();
    #__versions = new Versions();
    #__projects = new Projects()
    #__projectMembers = new ProjectMembers()
    #__fields = new Fields();

    constructor(){
        super();
    }

    get = async ( req, res ) => {
        this.writeReq(req)

        /* Logical code goes here */

        this.writeRes({ status: 200, message: "Sample response" })
        res.status(200).send({
            success: true,
            content: "Sample response",
            data: []
        })
    }
    
    generalCheck = async ( req, table_id, privileges = [] ) => {
        const verified = await this.verifyToken(req);

        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }

        if( verified ){        
            if( table_id && intValidate(table_id) ){
                const table = await this.#__tables.find({ id: parseInt(table_id) })
                if( table ){
                    const { version_id } = table;
                    const version = await this.#__versions.find({ version_id })
                    if( version ){
                        const Version = new VersionsRecord( version )
                        const { project_id } = version;
                        const project = await this.#__projects.find({ project_id });
                        if( project ){
                            const Project = new ProjectsRecord( project )
                            const decodedToken = this.decodeToken( req.header("Authorization") );
                            const { username } = decodedToken
                            const member = await this.#__projectMembers.find({ project_id, username })
                            if( member || this.isAdmin( decodedToken )){
                                const { permission } = member ? member : {};
                                if( privileges.length > 0 ){
                                    if( privileges.indexOf( permission ) != -1 || this.isAdmin( decodedToken )){
                                        context.success = true;
                                        context.status = "0x4501183"
                                        context.objects = {
                                            Table: new TablesRecord( table ),
                                            Project,
                                            Version                                            
                                        }
                                    }else{
                                        context.content = "Bạn khum có quyền thực thi thao tác này!"
                                        context.status = "0x4501184"
                                    }
                                }else{
                                    context.success = true;
                                    context.objects = {
                                        Table: new TablesRecord( table ),
                                        Project,
                                        Version                                            
                                    }
                                    context.status = "0x4501183"
                                }
                            }else{
                                context.content = "Bạn khum thuộc dự án này";
                                context.status  = "0x4501185"         
                            }
                        }else{
                            context.content = "Dự én khum tồn tại hoặc đã bị xóa";
                            context.status  = "0x4501186"       
                        }
                    }else{
                        context.content = "Phiên bảng khum tồn tại hoặc đã bị xóa";
                        context.status  = "0x4501187"
                    }
                }else{
                    context.content = "Bảng khum tồn tại";
                    context.status  = "0x4501188"   
                }
            }else{
                context.content = "Body khum hợp lệ";
                context.status  = "0x4501189"
            }         
        }else{            
            context.content = "Token khum hợp lệ";
            context.status  = "0x4501190"
        }
        return context;
    } 
    
    createTable = async ( req, res, privileges=[] ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     version_id <Int>
               table: {
                    table_name <String>                    
               }
         *      
         * }
         * 
         * 
         */


        const verified = await this.verifyToken( req );
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }
        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") )

            const isBodyValid = this.notNullCheck( req.body, ["version_id", "table"] )
            if( isBodyValid.valid ){
                const { table } = req.body;
                const isTableValid = this.notNullCheck( table, ["table_name"] )
                if( isTableValid.valid ){
                    const { version_id, table } = req.body;
                    const Version = await this.getVersion( version_id )
                    if( Version ){


                        const project_id = Version.project_id.value();
                        const Project = await this.getProject( project_id );

                        if( Project ){
                            const permission = await this.getProjectPrivilege( Project.project_id.value(), decodedToken.username );
                            
                            if( privileges.indexOf( permission ) != -1 || this.isAdmin(decodedToken) ){
                                const table_alias = Tables.makeTableAlias()
                                const { table_name } = table;
                                const Table = new TablesRecord({
                                    version_id: Version.version_id.value(),
                                    table_alias,
                                    table_name,                            
                                    create_by: decodedToken.username,
                                    create_at: new Date()
                                })
                                await Table.save()
                                context.content = "Tạo thành công"
                                context.success = true
                                context.data = { 
                                    table: await Table.get()
                                }
                                context.status = "0x4501191"

                                await this.saveLog("info", req.ip, "__createtable", `__projectname ${ Project.project_name.value() } | __versionname ${ Version.version_name.value() } | __tablename: ${ table_name }`, decodedToken.username )
                            }else{
                                context.content = "Bạn khum có quyền thực hiện thao tác này";
                                context.status  = "0x4501192"
                            }
                        }else{
                            context.content = "Dự án khum tồn tại hoặc đã bị xóa";
                            context.status  = "0x4501193"
                        }
                    }else{
                        context.content = "Version khum tồn tại hoặc đã bị xóa";
                        context.status  = "0x4501194"
                    }                    
                }else{
                    context.content = "Body khum hợp lệ";
                    context.status  = "0x4501195"
                }
            }else{
                context.content = "Body khum hợp lệ";
                context.status  = "0x4501195"
            }
        }else{            
            context.content = "Token khum hợp lệ";
            context.status  = "0x4501196"
        }
        res.status(200).send(context)
    }

    getTable = async ( req, res ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * 
         * Request Params{
         *      table_id <Int> 
         * }
         * 
         */


        const verified = await this.verifyToken( req );
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }
        if( verified ){            

            const decodedToken = this.decodeToken( req.header("Authorization") )
            const {  table_id } = req.params;
            if( table_id && intValidate( table_id ) ){

                const table = await this.#__tables.find( {id: parseInt( table_id )} )
                if( table ){
                    const Table = new TablesRecord( table );
                    const Version = await this.getVersion( Table.version_id.value() )
                    if( Version ){
        
                        const project_id = Version.project_id.value();
                        const Project = await this.getProject( project_id );
        
                        if( Project ){
                            const permission = await this.getProjectPrivilege( Project.project_id.value(), decodedToken.username );
                            
                            if( permission || this.isAdmin( decodedToken )){                                
        
                                context.content = "Thành công"
                                context.success = true;
                                context.status = "0x4501197"
                                context.data = await Table.get();
                                context.data.fields = await this.#__fields.allFieldsOfASingleTable({ table_id: Table.id.value() })
                            }else{
                                context.content = "Bạn khum có quyền truy cập API này";
                                context.status  = "0x4501198"
                            }
                        }else{
                            context.content = "Dự án khum tồn tại hoặc đã bị xóa";
                            context.status  = "0x4501199"
                        }
                    }else{
                        context.content = "Version khum tồn tại hoặc đã bị xóa";
                        context.status  = "0x4501200"
                    }
                }else{
                    // table khum ton tai
                }
            }else{

                // khum hop le

            }
        }else{            
            context.content = "Token khum hợp lệ";
            context.status  = "0x4501201"
        }
        res.status(200).send(context)
    } 

    getTables = async ( req, res ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Params {
         *     version_id <Int>
         *      
         * }
         * 
         * 
         */


        const verified = await this.verifyToken( req );
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }
        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") )
            const { version_id } = req.params;
            const Version = await this.getVersion( version_id )
            if( Version ){

                const project_id = Version.project_id.value();
                const Project = await this.getProject( project_id );

                if( Project ){
                    const permission = await this.getProjectPrivilege( Project.project_id.value(), decodedToken.username );
                    
                    if( permission || this.isAdmin( decodedToken )){
                        const tables = await this.#__tables.getAllTables( Version.version_id.value() )

                        context.content = "Thành công"
                        context.success = true;
                        context.status = "0x4501197"
                        context.data = { tables };
                    }else{
                        context.content = "Bạn khum có quyền truy cập API này";
                        context.status  = "0x4501198"
                    }
                }else{
                    context.content = "Dự án khum tồn tại hoặc đã bị xóa";
                    context.status  = "0x4501199"
                }
            }else{
                context.content = "Version khum tồn tại hoặc đã bị xóa";
                context.status  = "0x4501200"
            }
        }else{            
            context.content = "Token khum hợp lệ";
            context.status  = "0x4501201"
        }
        res.status(200).send(context)
    }

    getTablesAndFields = async ( req, res ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Params {
         *     version_id <Int>             
         * }
         * 
         * 
         */

        const verified = await this.verifyToken( req );
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }
        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") )
            const { version_id } = req.params;
            const Version = await this.getVersion( version_id )
            if( Version ){

                const project_id = Version.project_id.value();
                const Project = await this.getProject( project_id );

                if( Project ){
                    const permission = await this.getProjectPrivilege( Project.project_id.value(), decodedToken.username );
                    
                    if( permission || this.isAdmin( decodedToken )){
                        const tables = await this.#__tables.getAllTables( Version.version_id.value() )
                        const fields = []

                        for( let i = 0; i < tables.length ; i++ ){
                            const tableFields = await this.#__fields.allFieldsOfASingleTable( { table_id: tables[i].id } )
                            if( tableFields ){
                                fields.push(...tableFields)
                            }
                        }

                        context.content = "Thành công"
                        context.success = true;
                        context.status = "0x4501197"
                        context.data = { tables, fields };
                    }else{
                        context.content = "Bạn khum có quyền truy cập API này";
                        context.status  = "0x4501198"
                    }
                }else{
                    context.content = "Dự án khum tồn tại hoặc đã bị xóa";
                    context.status  = "0x4501199"
                }
            }else{
                context.content = "Version khum tồn tại hoặc đã bị xóa";
                context.status  = "0x4501200"
            }
        }else{            
            context.content = "Token khum hợp lệ";
            context.status  = "0x4501201"
        }
        res.status(200).send(context)
    }

    updateTable = async (req, res, privileges = ["ad", "pm", "pd"]) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     table_id <Int>
         *     table_name <String>
         * }
         * 
         * 
         */
        const { table_id, table_name } = req.body; 
        const context = await this.generalCheck(req, table_id, privileges)
        const { success, objects } = context;
        if( success ){
            const decodedToken = this.decodeToken(req.header("Authorization"))
            const { Table, Project, Version } = objects;    
            const old_table_name = Table.table_name.value();        
            Table.table_name.value( table_name )
            await Table.save()
            delete context.objects;
            context.content = "Cập nhật thành công";
            context.status = "0x4501202"
            await this.saveLog("info", req.ip, "__updatetable", `__projectname ${ Project.project_name.value() } | __versionname ${ Version.version_name.value() } | __tablename: ${ old_table_name } => ${ table_name  }`, decodedToken.username )
        }
        res.status(200).send(context);
    }

    removeTable = async (req, res, privileges = ["ad", "pm", "pd"]) => {

        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     table_id <Int>
         * }
         * 
         * 
         */

        const { table_id } = req.body; 
        const context = await this.generalCheck(req, table_id, privileges)
        const { success, objects } = context;
        if( success ){
            const decodedToken = this.decodeToken(req.header("Authorization"))
            const { Table, Project, Version } = objects;      
            
            const primary_key = Table.primary_key.valueOrNot();
            for( let i = 0; i < primary_key.length; i++ ){
                await this.removeSlaves(primary_key[i]);
            }

            await Table.destroy()

            /* Remove fields */
            await this.#__fields.removeAll( Table.id.value() )
            delete context.objects;
            context.content = "Xóa thành công";
            context.status = "0x4501203"
            await this.saveLog("info", req.ip, "__removetable", `__projectname ${ Project.project_name.value() } | __versionname ${ Version.version_name.value() } | __tablename: ${ Table.table_name.value()  }`, decodedToken.username )
        }
        res.status(200).send(context);
    }


    createFields = async ( req, res ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     table_id <Int>
         *     fields <Field>[]
         *          Field {
         *              index
         *              field_name, 
         *              DATATYPE
                        NULL
                        LENGTH
                        AUTO_INCREMENT
                        MIN
                        MAX
                        FORMAT              
                        DECIMAL_PLACE
                        DEFAULT         
                        DEFAULT_TRUE  
                        DEFAULT_FALSE 
         *          }
         * }
         */

        const { table_id } = req.body; 
        const context = await this.generalCheck(req, table_id )
        const { success, objects } = context;        
        if( success ){
            const { fields } = req.body;
            const decodedToken = this.decodeToken(req.header("Authorization"))
            const { Table, Version } = objects;            
            const data = []
            if( fields ){
                for( let i = 0; i < fields.length; i++ ){
                    const fomular_alias = await Fields.makeFomularAlias( fields[i].field_name );                   
                    
                    const field = { 
                        ...fields[i], 
                        fomular_alias, 
                        DECIMAL_PLACE: fields[i].DECIMAL_PLACE ? fields[i].DECIMAL_PLACE: 0 
                    }


                    
                    const Field = new FieldsRecord( { ...field, field_alias: Tables.makeTableAlias(), table_id: Table.id.value(), create_by: decodedToken.username, create_at: new Date() } );
                    await Field.save()   
                    const fieldInfo = await Field.get()
                    data.push( { ...fieldInfo, index: fields[i].index } )
                    await this.saveLog("info", req.ip, "__createField", `__versionname: ${ Version.version_name.value() } | __tablename: ${ Table.table_name.value() } | __fieldname: ${ Field.field_name.value() } | __datatype: ${ Field.DATATYPE.value() }`, decodedToken.username)
                }
                delete context.objects;
                context.content = "Tạo (các) trường thành công";
                context.success = true;
                context.status = "0x4501205"
                context.data = data;
            }else{
                context.content = "Khum tìm thấy trường nào trong body"
                context.status = "0x4501206"
            }
        }
        res.status(200).send(context);
    }


    getFields = async ( req, res ) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Params {
         *     table_id <Int>
         * }
         * 
         * 
         */
        const { table_id } = req.params;
        const context = await this.generalCheck(req, table_id);

        const { success, objects } = context
        if( success ){
            const { Table } = objects;
            const fields = await this.#__fields.allFieldsOfASingleTable({ table_id: Table.id.value() })
            context.data = fields;
            context.content = "Gọi dữ liệu thành công"
            context.status = ""
            delete context.objects;
        }
        res.status(200).send( context )
    }
    


    keyManipulation = async ( req, res ) => {
        /**
         *  Cái phương thức này sẽ đặt lại trực tiếp giá trị của các khóa
         * 
         *  Nếu khóa bị xóa đi là khóa chính thì tất cả khóa ngoại phụ thuộc lên nó cũng sẽ bị xóa.
         *  Đối với khóa ngoại, khóa ngoại và trường khóa chính của nó phải ít nhất có cùng kiểu dữ liệu, các thuộc tính khác có thể không giống nhau.
         * 
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Params {
         *     table_id <Int>
         *     primary_key <Int>[]
         *     foreign_keys <ForeignKey>[]
         *          ForeignKey {
         *          field_id     <Int> => là cái trường khóa ngoại
         *          table_id     <Int> => là cái bảng chứa khóa chính bên kia
         *          ref_field_id <Int> => là cái trường khóa chính trên bảng bên kia
         *     }
         * }
         * 
         * 
         */

        const { table_id } = req.body;
        const context = await this.generalCheck( req, table_id )
        const { success, objects } = context;
        if( success ){
            const decodedToken = this.decodeToken(req.header("Authorization"))

            const { Table, Version } = objects;
            const { primary_key, foreign_keys } = req.body;
            if( primary_key ){
                const validPrimayFields = []
                const validPrimayFieldsName = []
                const invalidPrimaryFields = []
                const validPrimaryTypes = Fields.validPrimaryTypes;
                for( let i = 0 ; i < primary_key.length; i++ ){
                    const isFieldIdValid = primary_key[i] && intValidate( primary_key[i] )
                    if( isFieldIdValid ){                        
                        const id = parseInt( primary_key[i] )
                        const field = await this.#__fields.find({ id, table_id: Table.id.value() })                    
                        if( field && validPrimaryTypes.indexOf(field.DATATYPE) != -1 ){
                            validPrimayFields.push( id )
                            validPrimayFieldsName.push( field.field_name )
                        }else{
                            invalidPrimaryFields.push( id )
                        }
                    }else{
                        invalidPrimaryFields.push( primary_key[i] )
                    }
                }

                if( invalidPrimaryFields.length > 0 ){
                    context.success = false;
                    context.status = ""
                    context.content = "Thêm khóa chính thất bại vì có ít nhất một trường không tồn tại hoặc không thể làm khóa chính"
                    context.data = {
                        invalidPrimaryKeys: invalidPrimaryFields
                    }
                }else{
                    const oldPrimaryKey = Table.primary_key.value() ? Table.primary_key.value() : [];
                    Table.primary_key.value( validPrimayFields ) 
                    const removedKeys = oldPrimaryKey.filter( key => validPrimayFields.indexOf(key) == -1 );                                        

                    for( let i = 0; i < removedKeys.length; i++ ){
                        await this.removeSlaves( removedKeys[i] )
                    }
                    await this.saveLog("info", req.ip,`__setprimarykey`, `__versionname: ${ Version.version_name.value() } | __tablename: ${ Table.table_name.value() } | __primarykey: (${ validPrimayFieldsName.join(', ') })`,decodedToken.username )
                    context.content = "Đặt ràng buộc khóa chính thành công. "                  
                }
            }            

            if( foreign_keys ){
                const validKeys = []
                const invalidKeys = []
                for( let i = 0; i < foreign_keys.length; i++ ){
                    const key = foreign_keys[i]
                    const nullCheck = this.notNullCheck(key, [ "field_id", "table_id", "ref_field_id" ])
                    if( nullCheck.valid ){
                        const { field_id, table_id, ref_field_id } = key;
                        if( intValidate(field_id) && intValidate(table_id) && intValidate( ref_field_id ) ){
                            const fieldId = parseInt( field_id );
                            const tableId = parseInt( table_id );
                            const refFieldId = parseInt( ref_field_id );
                            
                            const field = await this.#__fields.find({ id: fieldId, table_id: Table.id.value() })
                            const refTable = await this.#__tables.find({ id: tableId })
                            const refField = await this.#__fields.find({ id: refFieldId, table_id: tableId })

                            if( field && refTable && refField ){
                                const { primary_key } = refTable;                                
                                if( primary_key.indexOf( refFieldId ) != -1 ){

                                    if( refField.DATATYPE == field.DATATYPE ){
                                        validKeys.push({ 
                                            field_id: fieldId, 
                                            table_id: tableId, 
                                            ref_field_id: refFieldId 
                                        })
                                    }else{
                                        invalidKeys.push( { ...key, error: "Khum tương thích kiểu dữ liệu" } )    
                                    }
                                }else{                                    
                                    invalidKeys.push( { ...key, error: "Trường được chọn bên bảng bên kia khum phải là khóa chính" } )    
                                }
                            }else{                                
                                invalidKeys.push( { ...key, error: "Hoặc trường, hoặc bảng hoặc khó chính bên kia khum tồn tại" } )    
                            }
                        }else{                            
                            invalidKeys.push( { ...key, error: "Mã trường, mã bảng hoặc mã tường khóa chính khum hợp lệ" } )    
                        }
                    }else{
                        invalidKeys.push( { ...key, error: "Mã trường, mã bảng hoặc mã tường khóa chính khum hợp lệ" } )    
                    }                    
                }
                
                context.content = context.content + "Đặt ràng buộc khóa ngoại thành công."
                Table.foreign_keys.value( validKeys )                    
                context.data = { ...context.data, invalidForeignKeys: invalidKeys }
                
            }            
            await Table.save();
            delete context.objects;
        }
        res.status(200).send(context)
    }

    getSlaveFields = async (field) => {
        const { id } = field;
        const tables = await this.#__tables.findAll()
        const slaveFields = []
        tables.map( tb => {
            const { foreign_keys } = tb;
            //
            if( foreign_keys ){
                const key = foreign_keys.filter( fk => fk.ref_field_id == id )[0]
                
                if( key ){
                    slaveFields.push( key.field_id )
                }
            }             
        })
        
        const oldFields = await this.#__fields.findAll({ id: { $in: slaveFields } });
        const newFields = oldFields.map( oldField => {            
            return { 
                ...field, 
                id: oldField.id,  
                field_name: oldField.field_name,
                field_alias: oldField.field_alias,
                table_id: oldField.table_id
            }
        })
        return newFields;
    }

    removeSlaves = async ( id ) => {
        const tables = await this.#__tables.findAll()
        const slaves = []
        for( let i = 0 ; i <  tables.length; i++ ){
            const tb = tables[i];
            const { foreign_keys } = tb;
            
            if( foreign_keys ){
                const key = foreign_keys.filter( fk => fk.ref_field_id == id )[0]
                
                if( key ){
                    const newForeignKeys = foreign_keys.filter( fk => objectComparator( fk, key ) == false )
                    const Table = new TablesRecord( tb );
                    Table.foreign_keys.value( newForeignKeys )
                    await Table.save()
                }
            }             
        }               
    }


    modifyFields = async (req, res) => {

        /**
         *  Cập nhật trường chỉ áp dụng với trường khóa chính và trường không có khóa
         * 
         *  Khi trường khóa chính được cập nhật, các khóa ngoại phụ thuộc lên nó cũng sẽ được thay đổi kiểu và các thuộc tính
         * y hệt khóa chính.
         *          
         * 
         * 
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     table_id <Int>
         *     fields <Field>[]
         *          Field {
         *              field_id,
         *              field_name, 
         *              DATATYPE
                        NULL
                        LENGTH
                        AUTO_INCREMENT
                        MIN
                        MAX
                        FORMAT              
                        DECIMAL_PLACE
                        DEFAULT         
                        DEFAULT_TRUE  
                        DEFAULT_FALSE 
         *          }
         * }
         */

        const { table_id } = req.body; 
        
        const context = await this.generalCheck(req, table_id )
        const { success, objects } = context;        
        if( success ){
            const { fields } = req.body;
            console.log(fields)
            const decodedToken = this.decodeToken(req.header("Authorization"))
            const { Table, Version } = objects;            
            const data = []
            const failedFields = []
            if( fields ){
                const foreignKeys = Table.foreign_keys.value() ? Table.foreign_keys.value() : []
                const primaryKey = Table.primary_key.value() ? Table.primary_key.value() : [];

                const foreignFields = []
                const primaryFields = []
                for( let i = 0; i < fields.length; i++ ){
                    const field = fields[i];
                    const { id } = field;                    
                    const isFieldForeignKey = foreignKeys.filter( key => key.field_id == id )[0]
                    if( isFieldForeignKey ){
                        foreignFields.push(fields[i])                        
                    }
                    const isFieldPrimay = primaryKey.indexOf( id ) != -1;
                    if( isFieldPrimay ){                        
                        primaryFields.push(fields[i])
                    }                   
                }                 
                
                const newFields = fields.filter( f => foreignFields.indexOf(f) == -1 ); 
                           
                for( let i = 0 ; i < primaryFields.length; i++ ){
                    const field = primaryFields[i]
                    const slaveFields = await this.getSlaveFields( field )                                        
                    newFields.push( ...slaveFields )
                }
                
                for( let i = 0; i < newFields.length; i++ ){
                    const field = newFields[i]
                    const oldField = await this.#__fields.find({ id: field.id });
                    
                    if( oldField ){        
                                       
                        const Field = new FieldsRecord( { ...field, field_alias: oldField.field_alias, table_id: oldField.table_id, create_by: decodedToken.username, create_at: new Date() } );
                        await Field.save()   
                        const fieldInfo = await Field.get()
                        data.push( fieldInfo )
                        await this.saveLog("info", req.ip, "__modifyField", `__tablename: ${ Table.table_name.value() } | __versionname: ${ Version.version_name.value() } | __fieldname: ${ oldField.field_name } => ${ Field.field_name.value() }  | __datatype: ${ oldField.DATATYPE } => ${ Field.DATATYPE.value() } | NULL ${ oldField.NULL } => ${ Field.NULL.value() } | LENGTH ${ oldField.LENGTH } => ${ Field.LENGTH.value() } | AUTO_INCREMENT ${ oldField.AUTO_INCREMENT } => ${ Field.AUTO_INCREMENT.value() } | MIN ${ oldField.MIN } => ${ Field.MIN.value() } | MAX ${ oldField.MAX } => ${ Field.MAX.value() } | FORMAT ${ oldField.FORMAT } => ${ Field.FORMAT.value() } | DECIMAL_PLACE ${ oldField.DECIMAL_PLACE } => ${ Field.DECIMAL_PLACE.value() } | DEFAULT ${ oldField.DEFAULT } => ${ Field.DEFAULT.value() } | DEFAULT_TRUE ${ oldField.DEFAULT_TRUE } => ${ Field.DEFAULT_TRUE.value() } | DEFAULT_FALSE ${ oldField.DEFAULT_FALSE } => ${ Field.DEFAULT_FALSE.value() }`, decodedToken.username)
                    }else{
                        failedFields.push( field )
                    }

                }
                delete context.objects;
                context.data = { updatedFields: data, failedFields };
                if( failedFields.length == 0 ){
                    context.status = "0x4501208"
                    context.content = "Cập nhật (các) trường thành công";                
                }else{
                    context.status = "0x4501209"
                    context.content = "Tồn tại ít nhất một trường không hợp lệ, các trường hợp lệ vẫn sẽ được cập nhật";                
                }
            }else{
                context.content = "Khum tìm thấy trường nào trong body"
                context.status = "0x4501206"
            }
        }
        res.status(200).send(context);

    }

    removeFields = async (req, res) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request body {
         *     table_id <Int>
         *     field_ids: <Int>[]
         * }
         * 
         * 
         */

        const { table_id, field_ids } = req.body;
        const context = await this.generalCheck( req, table_id );

        const { success, objects } = context;
        if( success ){
            const decodedToken = this.decodeToken( req.header("Authorization") )
            const { Table, Version } = objects;
            if( field_ids && field_ids.length > 0 ){
                const failFields = []
                const primary_key = Table.primary_key.valueOrNot()
                const foreign_keys = Table.foreign_keys.valueOrNot()
                for( let i =0 ; i < field_ids.length ; i++ ){
                    const rawid = field_ids[i]
                    if( intValidate(rawid) ){
                        const id = parseInt( rawid )
                        if( primary_key.indexOf(id) == -1 ){
                            const key = foreign_keys.filter( fk => fk.field_id == id)[0]
                            const field = await this.#__fields.find({ id });

                            if( key ){
                                const newForeignKeys = foreign_keys.filter(fk => objectComparator(fk, key ) == false);
                                Table.foreign_keys.value( newForeignKeys );
                                await Table.save();     
                                
                                // Ghi lgg nếu bị yêu cầu, còn khum thì sủi luôn tại khum đủ dữ liệu kkk :>
                            }
                            if( field ){
                                const Field = new FieldsRecord( field );
                                await Field.remove();
                                await this.saveLog('info', req.ip, '__removeField', `__versionname: ${ Version.version_name.value() } | __tablename: ${ Table.table_name.value() } | __fieldname: ${ Field.field_name.value() }`, decodedToken.username)
                            }
                        }else{
                            failFields.push( { id, err: "Khum được xóa trường khóa chính"} )
                        }
                    }else{
                        failFields.push( { rawid, err: "Mã trường khum hợp lệ" } )
                    }                    
                }
                context.status = "0x4501210"
                context.data = {
                    failFields
                }                
                context.content = "Xóa trường thành công"
                context.success = true;                
            }else{
                context.status = "0x4501211"
                context.content = "Khum được bỏ trống danh sách id của các trường"                
            }
        }
        delete context.objects;
        res.status(200).send(context)
    }
}
module.exports = TablesController

    