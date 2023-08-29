const Crypto = require('../Crypto')


const { Controller } = require('../../config/controllers');
const { Versions, VersionsRecord } = require('../../models/Versions');
const { ProjectMembers, ProjectMembersRecord } = require('../../models/ProjectMembers');
const { Accounts } = require('../../models/Accounts');
const { Projects } = require('../../models/Projects');
const { intValidate } = require('../../functions/validator');

const { Tables, TablesRecord } = require('../../models/Tables');
const { Fields, FieldsRecord } = require('../../models/Fields');
const { Apis, ApisRecord } = require('../../models/Apis');

const { Activation } = require('../../models/Activation');

class VersionsController extends Controller {
    #__versions = undefined;
    #__projectMembers = undefined;
    #__accounts = undefined;    

    #__tables = new Tables();
    #__fields = new Fields();
    #__apis = new Apis();    
    #__projects = new Projects()
    #__keys = new Activation();


    constructor(){
        super();
        this.#__versions = new Versions()
        this.#__projectMembers = new ProjectMembers();
        this.#__accounts = new Accounts()
        this.#__projects = new Projects()
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

    getVersions = async ( req, res ) => {
        /* SCOPE: PROJECT */
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * 
         * Request Params {
         *      project_id
         * } 
         * 
         */
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }       

        const verified = await this.verifyToken( req );

        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") );
            const { username } = decodedToken;
            const account = await this.#__accounts.find({ username });
            if( account ){
                
                const rawProjectId = req.params.project_id;
                if( intValidate( rawProjectId ) ){
                    const project_id = parseInt( rawProjectId );
                    const project = await this.#__projects.find({ project_id })
                    if( project ){  
                        const versions = await this.#__versions.getAllProjectVersions( project_id ); 
                        context.content = "Thành công"
                        context.success = true;
                        context.status = "0x4501166" 
                        context.data = versions;
                    }else{
                        // not found
                        context.content = "Khum tìm thấy dự án"
                        context.status = "0x4501167"
                    }
                }else{
                    // bad request
                    context.content = "Request header khum hợp lệ"
                    context.status = "0x4501168"
                }
            }else{
                // accoun un avail able
                context.content = "Tài khoản của bạn khum khả dụng hoặc đã bị xóa"
                context.status = "0x4501169"
            }
        }else{
            context.content = "Token khum hợp lệ"
            context.status = "0x4501170"
        }
        res.status(200).send(context);
    }

    getOneVersion = async ( req, res ) => {
        /* SCOPE: PROJECT */
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * 
         * Request Params {
         *      version_id
         * } 
         * 
         */
        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }       

        const verified = await this.verifyToken( req );

        if( verified ){
            const decodedToken = this.decodeToken( req.header("Authorization") );
            const { username } = decodedToken;
            const account = await this.#__accounts.find({ username });
            if( account ){                
                const Version = await this.getVersion( req.params.version_id )
                if( Version ){
                    const permission = await this.getProjectPrivilege( Version.project_id.value(), account.username )
                    if( permission ){                        
                        context.success = true
                        context.data = {
                            version: await Version.get()
                        }
                        context.status = "0x4501171"
                    }else{
                        context.content = "Bạn khum thuộc dự án này"
                        context.status = "0x4501172"
                    }
                }else{
                    // bad request
                    context.content = "Request header khum hợp lệ"
                    context.status = "0x4501173"
                }
            }else{
                // accoun un avail able
                context.content = "Tài khoản của bạn khum khả dụng hoặc đã bị xóa"
                context.status = "0x4501174"
            }
        }else{
            context.content = "Token khum hợp lệ"
            context.status = "0x4501175"
        }
        res.status(200).send(context);
    }

    duplicateVersion = async (req, res, privileges = ["ad", "pm"]) => {
        /* SCOPE: PROJECT */
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     project_id <Int>,
         *     version_id <Int>             
         *      
         * }
         * 
         */
    }

    updateVersion = async (req, res, privileges = ["ad", "pm"]) => {
        /* SCOPE: PROJECT */
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * Request Body {
         *     project_id <Int>,
         *     version: {
         *         version_id <Int>,
         *         version_name <String>,
         *         version_description <String>
         *     }
         *      
         * }
         * 
         */

        const verified = await this.verifyToken(req);

        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }        
           
        res.status(200).send(context);
    }
    
    removeVersion = async ( req, res, privileges = ["ad"] ) => {
        /**
         *  Request Headers: {
         *      Authorization <Token>
         *  }
         * 
         *  Request Body {         
         *      version_id <Int>
         *  }
         */

        const verified = await this.verifyToken( req );

        const context = {
            success: false,
            content: "Sample response",
            data: [],
            status: 200
        }

        if( verified ){
            /* No need to deploy this time */
        }else{
            context.content = "Token khum hợp lệ"
            context.status = "0x4501182"
        }
        res.status(200).send(context);
    }


    getProjectIDFromKey = ( key ) => {
        const { ACTIVATION_KEY } = key;
        const splittedKey = ACTIVATION_KEY.split('\n');
        const encryptRawProjectID = splittedKey[2];
        const encryptProjectID = encryptRawProjectID.replaceAll("-", "")
        console.log(encryptProjectID)
        
        const Decipher = new Crypto()
        
        const rawProjectId = Decipher.decrypt( encryptProjectID )
        const isInt = intValidate( rawProjectId )
        if( isInt ){
            return parseInt( rawProjectId )
        }else{
            return undefined
        }
    }

    importDatabase = async ( req, res ) => {
        const { data } = req.body;

        const checkNull = this.notNullCheck( data, ["database"] )
        if( checkNull.valid ){
            const Decipher = new Crypto();
            const decryptedData =  Decipher.decrypt( data.database )
            const { database } = JSON.parse( decryptedData )
            const keys = await this.#__keys.findAll()
            const key = keys[0]

            if( key ){
                // const project_id = this.getProjectIDFromKey( key )
                // if( project_id != undefined ){
                    
                    if( database ){
                        const { project, tables, fields } = database;
                        // console.log(project_id)
                        console.log(project)
                        // if( project_id == project.project_id ){
                            const newFields = fields.map( field => {
                                const tearedField =  {  ...field, ...field.props }
                                delete tearedField.props;
                                return tearedField
                            })
                            await this.#__tables.deleteAll();
                            await this.#__fields.deleteAll();
                            await this.#__projects.deleteAll()
                    
                            await this.#__tables.insertMany( tables );
                            await this.#__fields.insertMany( newFields );   
                            await this.#__projects.insertMany( [ project ] )            
                            res.status(200).send({ success: true })
                        // }
                        // else{
                        //     res.status(200).send({ success: false, content: " Project khác với khóa " })    
                        // }
                    }else{
                        res.status(200).send({ success: false, content: "Khum tìm thấy dữ liệu" })
                    }
                // }
                // else{
                //     res.status(200).send({ success: false, content: "Khum tìm thấy project id trong khóa" })    
                // }
            }else{
                res.status(200).send({ success: false, content: "Chưa kích hoạt khóa mấy má oi" })
            }
        }else{
            res.status(200).send({ success: false , content: "Body bị null nhe má"})
        }
    }

    
    importAPI = async ( req, res ) => {
        const { data } = req.body;
        
        const checkNull = this.notNullCheck( data, ["apis"] )
        if( checkNull.valid ){

            const Decipher = new Crypto();
            const decryptedData =  Decipher.decrypt( data.apis )
            const { apis } = JSON.parse( decryptedData )
            if( apis ){
                await this.#__apis.deleteAll()
                await this.#__apis.insertMany(apis)
                res.status(200).send({ success: true })
            }else{
                res.status(200).send({ success: false })
            }
        }else{
            res.status(200).send({ success: false })
        }
    }
}
module.exports = VersionsController

    