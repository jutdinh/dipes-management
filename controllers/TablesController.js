const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { intValidate, objectComparator } = require('../functions/validator');

class TablesController extends Controller {
    constructor(){
        super();
    }

    generalCheck = async ( req, version_id = 0 ) => {
        const verified = await this.verifyToken(req)
        const context = {
            success: false,
            status: "0x4501190",
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
                context.status  = "0x4501186"
            }
        }
        return context
    }

    getTables = async (req, res) => {
        const { version_id } = req.params;
        const context = await this.generalCheck( req, version_id )
        const { success, objects } = context

        if( success ){
            const { Projects, Project, user, version } = objects 
            const project = Project.getData();

            const tables = Object.values(version.tables);
            tables.map( table => {
                table.foreign_keys = Object.values( table.foreign_keys )
                table.fields = Object.values( table.fields )
            })

            context.data = { tables }            
        }
        delete context.objects;
        res.status(200).send( context )
    }
    getTablesAndFields = async (req, res) => {
        const { version_id } = req.params;
        const context = await this.generalCheck( req, version_id )
        const { success, objects } = context

        if( success ){
            const { Projects, Project, user, version } = objects 
            const project = Project.getData();

            const tables = Object.values(version.tables);
            const fields = []
            tables.map( table => {
                const tableFields = Object.values( table.fields )
                if( tableFields && tableFields.length > 0 ){
                    tableFields.map( field => {
                        field.field_alias = field.fomular_alias;
                        field.table_id = table.id                       
                    })
                }
                table.foreign_keys = Object.values( table.foreign_keys )
                
                fields.push(...tableFields)
                // delete table.fields;
                table.fields = tableFields.map( field => {
                    return { ...field, ...field.props }
                })
            })
            const formatedFields = fields.map( field => {
                return { ...field, ...field.props }
            })
            context.data = { tables, fields: formatedFields }
        }
        delete context.objects;
        res.status(200).send( context )
    }
    getFields = async (req, res) => {
        const { version_id, table_id } = req.params;
        const context = await this.generalCheck( req, version_id )
        const { success, objects } = context

        if( success ){
            const { version } = objects            

            const table = version.tables[`${ table_id }`]
            if( table ){
                const fields = Object.values( table.fields )
                context.data = fields 
            }
        }
        delete context.objects;
        res.status(200).send( context )
    }
    getTable = async (req, res) => {
        const { version_id, table_id } = req.params;
        const context = await this.generalCheck( req, version_id )
        const { success, objects } = context

        if( success ){
            const { version } = objects            

            const table = version.tables[`${ table_id }`]
            if( table ){
                table.fields = Object.values( table.fields )
                table.foreign_keys = Object.values( table.foreign_keys )
                context.data = table 
            }else{
                context.success = false 
                context.content = "Bảng không tồn tại"
                context.status = "0x"
            }
        }
        delete context.objects;
        res.status(200).send( context )
    }

    createTable = async ( req, res ) => {
        const { table, version_id } = req.body;
        const context = await this.generalCheck( req, version_id )
        const { success, objects } = context
        if( success ){
            const { Projects, Project, user, version } = objects 
            const project = Project.getData();
            let tb = table
            if( table == undefined ){
                tb = { table_name: "Bảng mới" }
            }
            const newTable = await Project.createTable( tb, user )
            
            version.tables = { ...version.tables, ...newTable }

            project.versions[`${ version_id }`] = version;

            Project.setData( project )
            await Project.save()
            context.data = { table: Object.values(newTable)[0] }
            context.status = "0x4501191"

            this.saveLog("info", req.ip, "__createtable", `__projectname ${ project.project_name } | __versionname ${ version.version_name } | __tablename: ${ tb.table_name }`, user.username )
        }
        delete context.objects
        res.status(200).send(context)
    }

    deleteTable = async ( req, res ) => {
        const { version_id, table_id } = req.body
        const context = await this.generalCheck(req, version_id);
        const { success, objects } = context 
        
        if( success ){
            const { Project, version, user } = objects;
            
            if( version.tables[`${ table_id }`] ){
                /**
                 * Remove slave tables and slave fields
                 */
                const { primary_key } = version.tables[`${ table_id }`]
                for( let i = 0 ; i< primary_key.length; i++ ){
                    this.removeSlaveRelation( Project, version, primary_key[i] )
                }
            }
            const project = Project.getData()
            const table = version.tables[`${ table_id }`]
            delete version.tables[`${ table_id }`]
            project.versions[`${ version_id }`] = version;

            Project.__modifyAndSaveChange__(`versions.${version_id}`, version)
            context.status = "0x4501203"
            this.saveLog("info", req.ip, "__removetable", `__projectname ${ project.project_name } | __versionname ${ version.version_name } | __tablename: ${ table.table_name  }`, user.username )
        }

        delete context.objects
        res.status(200).send(context)
    }

    

    addFields = async ( req, res ) => {
        const { version_id, table_id, fields } = req.body
        const context = await this.generalCheck(req, version_id);

        const { success, objects } = context 
        
        if( success ){
            const { Project, version, user } = objects
            const serializedFields = await Project.createFields( fields, user )
            const project = Project.getData();
            const table = version.tables[`${ table_id }`]

            const oldFields = Object.values(table.fields)

            if( table ){
                const { primary_key } = table

                let newFields = table.fields ? table.fields : {}
                for( let i = 0 ; i < fields.length; i++ ){
                    const field = fields[i]
                    if( newFields[ `${field.id}` ] != undefined && !this.isForeignKey( table, field.id )){
                        field.props = { ...field }
                        newFields[ `${field.id}` ] = field;                        

                        /**
                         * If the field is a primary one, check and modify its slaves
                         */
                        if( primary_key.indexOf( field.id ) != -1 ){
                            this.modifySlave( Project, version, field )
                        }
                    }
                }

                const startIndex = Object.values( newFields ).length
                serializedFields.map( field => {                    
                    const newField = fields.find( f => f.id == field.id && f.id != undefined )
                    if( newField != undefined ){
                        newFields[ `${newField.id}` ] = newField
                    }else{
                        newFields = { ...newFields, ...field }
                    }                    
                })            
                version.tables[`${ table_id }`].fields = newFields;
                project.versions[`${ version_id }`] = version;            
                Project.setData( project )
                await Project.save()                
                context.data = Object.values( newFields ).map( (field, index) => {
                    return {...field, index: fields[index - startIndex]?.index }
                })
                context.content = "Thêm trường thành công"
                context.status = "0x4501205"

                const arraizedNewFields = Object.values(newFields)
                for( let i = 0 ; i < arraizedNewFields.length ; i++ ){
                    const corespondingField = arraizedNewFields[i]
                    
                    const field = oldFields.find( f => f.id == corespondingField.id )
                    if( !field ){
                        /**
                         * New field
                         */                        
                        this.saveLog("info", req.ip, "__createField", `__projectname ${ project.project_name} | __versionname: ${ version.version_name } | __tablename: ${ table.table_name } | __fieldname: ${ corespondingField.field_name } | __datatype: ${ corespondingField.props.DATATYPE }`, user.username)
                    }else{                        
                        const areTheseFieldsEqual = objectComparator( field, corespondingField )
                        if( !areTheseFieldsEqual ){
                            /**
                             * Update fields
                             */

                            this.saveLog("info", req.ip, "__modifyField", `__projectname ${ project.project_name} | __versionname: ${ version.version_name } | __tablename: ${ table.table_name } | __fieldname: ${ field.field_name } => ${ corespondingField.field_name }  | __datatype: ${ field.props.DATATYPE } => ${ corespondingField.props.DATATYPE } | NULL ${ field.props.NULL } => ${ corespondingField.props.NULL } | LENGTH ${ field.props.LENGTH } => ${ corespondingField.props.LENGTH } | AUTO_INCREMENT ${ field.props.AUTO_INCREMENT } => ${ corespondingField.props.AUTO_INCREMENT } | MIN ${ field.props.MIN } => ${ corespondingField.props.MIN } | MAX ${ field.props.MAX } => ${ corespondingField.props.MAX } | FORMAT ${ field.props.FORMAT } => ${ corespondingField.props.FORMAT } | DECIMAL_PLACE ${ field.props.DECIMAL_PLACE } => ${ corespondingField.props.DECIMAL_PLACE } | DEFAULT ${ field.props.DEFAULT } => ${ corespondingField.props.DEFAULT } | DEFAULT_TRUE ${ field.props.DEFAULT_TRUE } => ${ corespondingField.props.DEFAULT_TRUE } | DEFAULT_FALSE ${ field.props.DEFAULT_FALSE } => ${ corespondingField.props.DEFAULT_FALSE }`, user.username)
                        }else{
                            /**
                             * No change found
                             */
                        }
                    }
                }
                /**
                 * 
                 * Khúc này sau khi xong design tool sẽ xóa tại nó bị thừa, 
                 * 
                 * note: Khúc này hỏi xong cái bị chửi ngang luôn má ơi, 6 / 11 vote quit
                 * 
                 */
                const uis  = Object.values(version.uis)
                const changedAPIs = []

                const updatedTable = version.tables[`${ table_id }`]
                const newfields = Object.values( updatedTable.fields );
                
                const serializedNewFields = {}
                newfields.map( (field, index) => {
                    const { id, fomular_alias } = field;
                    
                    serializedNewFields[`${ index }`] = {
                        id, fomular_alias, 
                        display_name: field.field_name,    
                    }
                })

                const newFieldsID = newfields.map( field => field.id )

                uis.map( ui => {
                    const components = Object.values( ui.components );
                    const tableComponent = components.find( cpn => cpn.table_id == updatedTable.id )
                    if( tableComponent ){
                        const keys = Object.keys( tableComponent ).filter( key => key.includes("api_") )
                        for( let i = 0 ; i < keys.length; i++ ){
                            changedAPIs.push( tableComponent[keys[i]] )
                        }
                    }
                })
                
                const apis = Object.values(version.apis)
                for( let i = 0 ; i < apis.length; i++ ){
                    const api = apis[i]                    
                    
                    if( changedAPIs.indexOf(api.url) != -1 ){
                        if( ["post", "put"].indexOf(api.api_method) != -1 ){
                            api.body   = newFieldsID
                        }
                        if( ["get"].indexOf(api.api_method) != -1 ){
                            api.fields = serializedNewFields
                        }
                    }
                    version.apis[`${ api.id }`] = api
                }
                
                await Project.__modifyAndSaveChange__(`versions.${ version_id }`, version)
                
            }else{
                context.success = false;
                context.content = "Bảng khum tồn tại"                
                context.status = "0x4501206A"
            }
        }
        delete context.objects;
        res.status(200).send(context)
    }

    isForeignKey = ( table, field_id ) => {
        let isKey = false;
        if( field_id != undefined && table != undefined ){
            const rawForeignKey = table.foreign_keys
            const foreign_keys = Object.values( rawForeignKey );

            const key = foreign_keys.find( fk => fk.field_id == field_id );
            if( key != undefined ){
                isKey = true
            }
        }
        return isKey
    }

    tableHasField = ( table, field_id ) => {
        return table.fields[`${ field_id }`]
    }

    versionHasField = ( version, field_id ) => {        
        const tables = Object.values(version.tables)
        let exists = undefined;
        
        if( tables && tables.length > 0 ){
            for( let i = 0; i < tables.length; i++ ){
                const table = tables[i];
                const fields = table.fields;
                if( fields != undefined && fields[`${ field_id }`] != undefined ){
                    exists = fields[`${ field_id }`]
                }
            }
        }
        return exists
    }

    modifySlave = ( Project, version, field ) => {
        const { id, props } = field
        delete props.props;        
        const tables = Object.values(version.tables)
        let exists = undefined;
        
        if( tables && tables.length > 0 ){
            for( let i = 0; i < tables.length; i++ ){
                const table = tables[i];
                const foreign_keys = Object.values(table.foreign_keys)

                const key = foreign_keys.find( fk => fk.ref_field_id.toString() == id.toString() )

                if( key ){
                    table.fields[`${ key.field_id }`].props = props
                    version.tables[`${ table.id }`] = table
                    Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)
                }
            }
        }
        return exists
    }

    fieldCompare = ( field_1, field_2 ) => {
        const props_1 = field_1.props
        const props_2 = field_2.props 

        return objectComparator( props_1, props_2 )
    }

    removeSlaveRelation = ( Project, version, master_id ) => {                
        const tables = Object.values(version.tables)

        for( let i = 0 ; i < tables.length; i++ ){
            const table = tables[i]
            const foreign_keys = Object.values( table.foreign_keys )        
            const newForeignKey = foreign_keys.filter( key => key.ref_field_id.toString() != master_id.toString() )

            if( foreign_keys.length != newForeignKey ){
                version.tables[`${ table.id }`].foreign_keys = newForeignKey                    
            }
        }
        Project.__modifyAndSaveChange__(`versions.${ version.version_id }`, version)
    }

    keyManipulation = async ( req, res ) => {
        this.writeReq(req)
        const { version_id, table_id, primary_key, foreign_keys } = req.body
        const context = await this.generalCheck(req, version_id);        
        const { success, objects } = context 

        if( success ){
            const { Project, version, user } = objects;
            const project = Project.getData()
            const table = version.tables[`${ table_id }`]
            const oldPrimaryKey = table.primary_key

            if( table ){

                if( primary_key && Array.isArray(primary_key) ){                    
                    let valid = true;
                    
                    for( let i = 0 ; i < primary_key.length; i++ ){
                        const field = this.tableHasField( table, primary_key[i] )
                        if( !field ){
                            valid = false
                            console.log( "FIELD DOES NOT EXIST" )
                        }else{
                            if( field.props.NULL ){
                                valid = false
                                console.log( "FIELD DOES NULL" )
                            }
                            if( Projects.validPrimaryTypes.indexOf(field.props.DATATYPE) == -1 ){
                                valid = false
                                console.log( "FIELD DOES NOT HAS VALID TYPE" )
                            }
                        }
                    }
                    if( valid ){                                                
                        table.primary_key = primary_key.map( key => parseInt(key) );                        
                        /**
                         * Successfully updated primary keys
                         */

                        const purgedPrimaryKey = oldPrimaryKey.filter( key => primary_key.indexOf( key ) == -1 )
                        for( let i = 0 ; i < purgedPrimaryKey.length ; i++ ){
                            this.removeSlaveRelation(Project, version, purgedPrimaryKey[i])
                        }

                        context.primary_key = { success: true, content: "Cập nhật khóa chính thành công", status: "0x" }
                        this.saveLog("warn", req.ip, "__changekeyprimary", `__projectname ${ project.project_name } | __versionname: ${version.version_name} | __tablename: ${ table.table_name }`, user.username)

                        
                        const uis  = Object.values(version.uis)
                        const changedAPIs = []

                        const updatedTable = version.tables[`${ table_id }`]
                        const newfields = Object.values( updatedTable.fields );
                        
                        const serializedNewFields = {}
                        newfields.map( (field, index) => {
                            const { id, fomular_alias } = field;
                            
                            serializedNewFields[`${ index }`] = {
                                id, fomular_alias, 
                                display_name: field.field_name,    
                            }
                        })

                        const newFieldsID = newfields.map( field => field.id )

                        uis.map( ui => {
                            const components = Object.values( ui.components );
                            const tableComponent = components.find( cpn => cpn.table_id == updatedTable.id )
                            if( tableComponent ){
                                const keys = Object.keys( tableComponent ).filter( key => key.includes("api_") )
                                for( let i = 0 ; i < keys.length; i++ ){
                                    changedAPIs.push( tableComponent[keys[i]] )
                                }
                            }
                        })

                        const apis = Object.values(version.apis)
                        for( let i = 0 ; i < apis.length; i++ ){
                            const api = apis[i]                    
                            const { api_method, url } = api

                            if( changedAPIs.indexOf( url ) != -1 ){                                
                                
                                if( api_method == "get" ){
                                    api.params = table.primary_key;
                                }

                                if( api_method == "put"){
                                    api.params = table.primary_key;                                    
                                    api.body = newfields.filter( f => table.primary_key.indexOf(f.id) == -1 ).map( field => field.id )
                                }

                                if( api_method == "delete" ){
                                    api.params = table.primary_key;
                                }
                            }
                            version.apis[`${ api.id }`] = api
                        }

                    }else{
                        /**
                         * Some fields are missing
                         */

                        context.primary_key = { success: false, content: "Có vài trường hoặc bị bắt cóc, hoặc có thể bị rỗng, hoặc có kiểu khum đúng", status: "0x" }
                    }
                }else{
                    /**
                     *  Primary key is not exist or has wrong type format 
                     */
                    context.primary_key = { success: false, content: "Khóa chính khum tồn tại hoặc sai kiểu", status: "0x" }
                }

                if( foreign_keys && Array.isArray(foreign_keys) ){
                    let valid = true;

                    for( let i = 0 ; i < foreign_keys.length; i++ ){
                        const { field_id, table_id, ref_field_id, cascade } = foreign_keys[i]
                        /* Maybe table_id will be used someday */
                        const field = this.tableHasField( table, field_id )
                        const foreignField = this.versionHasField( version, ref_field_id )

                        if( field && foreignField ){                            
                            const isEquivalent = this.fieldCompare( field, foreignField )

                            if( !field.props.NULL && !foreignField.props.NULL ){

                                if( !isEquivalent ){                                    
                                    valid = false;  
                                    console.log("KHUM CÙNG KIỂU")                                  
                                }
                            }else{
                                valid = false;                                   
                                console.log("TRƯỜNG NÀY NULLABLE")                                  
                            }
                        }else{
                            valid = false;                      
                            console.log("MỘT TRONG HAI KHUM TỒN TẠI")                                        
                        }
                    }

                    if( valid ){
                        table.foreign_keys = foreign_keys.map( key => {
                            const { field_id, table_id, ref_field_id, cascade } = key;
                            return {
                                field_id: parseInt(field_id), 
                                table_id: parseInt(table_id), 
                                ref_field_id: parseInt(ref_field_id),
                                cascade
                            }
                        })
                        context.foreign_keys = { success: true, content: "Cập nhật khóa ngoại thành công", status: "0x" }
                        this.saveLog("warn", req.ip, "__changekeyforeign", `__projectname ${ project.project_name } | __versionname: ${version.version_name} | __tablename: ${ table.table_name }`, user.username)
                    }else{
                        context.foreign_keys = { success: false, content: "Ít nhất có một khóa ngoại không hợp lệ", status: "0x" }
                    }
                }else{
                    /**
                     *  Foreign keys are not exist or have wrong type format 
                     */
                    context.foreign_keys = { success: false, content: "Khóa ngoại không tồn tại hoặc sai kiểu", status: "0x" }
                }


                version.tables[`${ table_id }`] = table;
                project.versions[`${ version_id }`] = version;
                Project.__modifyAndSaveChange__( `versions.${ version_id }`, version )

                context.status = "0x4501202"
            }else{
                /**
                 * Table does not exist
                 */
                context.success = false;
                context.content = "Bảng khum tồn tại"                
                context.status = "0x4501206A"
            }
        }
        delete context.objects;
        res.status(200).send(context)
    }

    updateTable = async ( req, res ) => {
        this.writeReq(req)
        const { version_id, table_id, table_name } = req.body
        const context = await this.generalCheck(req, version_id);        
        const { success, objects } = context 

        if( success ){
            const { Project, version, user } = objects;
            version.tables[`${ table_id }`].table_name = table_name
            Project.__modifyAndSaveChange__( `versions.${ version_id }`, version )
        }

        delete context.objects; 
        res.status(200).send(context)
    }

    deleteFields = async ( req, res ) => {
        this.writeReq(req)
        const { version_id, table_id, field_ids } = req.body
        const context = await this.generalCheck(req, version_id);        
        const { success, objects } = context 

        if( success ){
            const { Project, version, user } = objects;
            const table = version.tables[`${ table_id }`];
            if( table ){
                const { primary_key, foreign_keys } = table;


                const uis  = Object.values(version.uis)
                const changedAPIs = []

                const updatedTable = version.tables[`${ table_id }`]              

                uis.map( ui => {
                    const components = Object.values( ui.components );
                    const tableComponent = components.find( cpn => cpn.table_id == updatedTable.id )
                    if( tableComponent ){
                        const keys = Object.keys( tableComponent ).filter( key => key.includes("api_") )
                        for( let i = 0 ; i < keys.length; i++ ){
                            changedAPIs.push( tableComponent[keys[i]] )
                        }
                    }
                })
                
                const apis = Object.values(version.apis)

                for( let i = 0 ; i < field_ids.length; i++ ){
                    const field_id = field_ids[i]
                    const field = {...table.fields[`${ field_id }`]}
                    delete table.fields[`${ field_id }`]
                    
                    const currentFKs = Object.values(table.foreign_keys)
                    table.foreign_keys = currentFKs.filter( key => key.field_id  != field_id )

                    /**
                     * If it's primary field => remove slaves' relationship
                     */
                    if( primary_key.indexOf( field_id ) != -1 ){
                        this.removeSlaveRelation(Project, version, field_id)      
                        table.primary_key = table.primary_key.filter( key => key != field_id )              
                    }

                    for( let j = 0 ; j < apis.length; j++ ){
                        const api = apis[i] 
                        
                        if( changedAPIs.indexOf(api.url) != -1 ){
                            if( ["post", "put"].indexOf(api.api_method) != -1 ){
                                api.body   = api.body.filter( f => f != field_id )
                            }
                            if( ["get"].indexOf(api.api_method) != -1 ){                                
                                const arraizedFields = Object.values( api.fields )
                                const newApiFields = arraizedFields.filter( field => field.field_id != field_id )
                                
                                const serializedNewFields = {}
                                newApiFields.map( (field, index) => {
                                    const { id, fomular_alias } = field;
                                    
                                    serializedNewFields[`${ index }`] = {
                                        id, fomular_alias, 
                                        display_name: field.field_name,    
                                    }
                                })

                                api.fields = serializedNewFields
                            }
                        }
                        version.apis[`${ api.id }`] = api
                    }

                    this.saveLog('info', req.ip, '__removeField', `__projectname: ${ Project.getData().project_name }| __versionname: ${ version.version_name } | __tablename: ${ table.table_name } | __fieldfomularalias: ${ field.fomular_alias } | __fieldname: ${ field.field_name }`, user.username)
                }

                
                version.tables[`${ table_id }`] = table;
                Project.__modifyAndSaveChange__(`versions.${ version_id }`, version)
                context.data = { failFields: [] }

                context.content = "Xóa trường thành công"
                context.status = "0x4501210"
            }else{
                context.success = false;
                context.content = "Bảng khum tồn tại"                
                context.status = "0x4501206A"
            }
        }

        delete context.objects; 
        res.status(200).send(context)
    }


}
module.exports = TablesController

    