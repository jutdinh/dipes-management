const { Controller } = require('../config/controllers');
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { Projects, ProjectsRecord } = require('../models/Projects');

var exec = require('child_process').exec;

class ActivationController extends Controller {

    constructor(){
        super();
    }

    getAllProjectBuOnLyKeys = async () => {
        const projects = await Database.selectFields("projects", {}, ["project_id", "project_name", "project_code", "project_status", "project_description", "project_type", "proxy_server", "create_at", "manager", "members", "create_by", "activation" ])            
        return projects
    }
    get = async ( req, res ) => {
        const projects = await this.getAllProjectBuOnLyKeys()
        const data = []

        for( let i = 0 ; i < projects.length; i++ ){
            const project = projects[i]
            const { activation } = project
            const arraizedKeys = Object.values( activation );
            const { fullname, username } = project.create_by;
            const minimizedProject = { ...project, create_by: `${ fullname }(${ username })` }
            delete minimizedProject.activation
            delete minimizedProject._id;

            for( let j = 0 ; j < arraizedKeys.length; j++ ){
                const key = arraizedKeys[j]
                const { MAC_ADDRESS, ACTIVATION_KEY, ACTIVATE_AT } = key
                const serializedKey = {
                    uuid: MAC_ADDRESS,
                    key: ACTIVATION_KEY,
                    project: minimizedProject,                    
                }
                data.push(serializedKey)
            }
        }

        res.status(200).send({ success: true, data })
    }


    generalCheck = async (req, privileges = []) => {
        const context = {
            success: false,
            content: "Invalid token",
            objects: {},
            status: "0x450002",
        }
        const verified = await this.verifyToken(req)
        if (verified) {
            const decodedToken = this.decodeToken(req.header("Authorization"))
            context.objects = { user: decodedToken }
            context.success = true;

            if (privileges.length > 0) {
                if (privileges.indexOf(decodedToken.role) == - 1) {
                    context.success = false;
                    context.content = "Khum có quyền truy cập api"
                    context.status =  "0x450001"
                }
            }
        }
        return context
    }

    generateActivationKey =  async (req, res) => {

        /**
         * Request HEADER {
         *     Authorization: <Token>
         * }
         */

        const context = await this.generalCheck(req);
        
        const { success, objects } = context;
        if( success ){
            const targetMachine = req.body.id;
            const { project_id } = req.body;
            const { user } = objects
            if( this.validMac( targetMachine ) ){         
                const ProjectsModel = new Projects()
                const rawProject = await  ProjectsModel.find({ project_id: parseInt( project_id ) })                
                if( rawProject ){
                    const Project = new ProjectsRecord( rawProject )
                    const project = Project.getData()                    

                    const activation = project.activation;
                    const keys = Object.values( activation )

                    const isKeyExisted = keys.find( key => key.MAC_ADDRESS == targetMachine )
                    
                    if( !isKeyExisted){                     
                        const key = Projects.generateActivationKey( targetMachine, project_id )
                        
                        activation[`${ targetMachine }`] = {
                            ACTIVATION_KEY: key,
                            MAC_ADDRESS: targetMachine,                              
                        };
                        project.activation = activation;
                        Project.setData(project)
                        Project.save()
                        
                        context.activation_key = key;                                  
                        context.content =  "Tạo khóa thành công"
                        context.status  = "0x4501240"   
                       
                        
                    }else{
                        context.activation_key = isKeyExisted.ACTIVATION_KEY;
                        context.content =  "Khóa kích hoạt đã tồn tại"
                        context.status = "0x4501239"
                        context.success = false
                    }
                }else{
                    context.content =  "Dự án khum tồn tại"
                    context.status = "0x4501239" // add here
                    context.success = false
                }
            }else{
                context.content =  "Khóa khum hợp lệ"
                context.status = "0x4501241"
                context.success = false
            }

        } 
        delete context.objects;
        res.status(200).send(context)
    }

    isUUID = ( uidStr ) => {
        const { uuid_format } = Projects.validator;
        const splitted = uidStr.split('-');

        if( splitted.length === uuid_format.length ){            
            let valid = true;
            for( let i = 0 ; i < uuid_format.length; i++ ){
                const splitedRecord = splitted[i]
                const uuidFormat = uuid_format[i]
                if( splitedRecord.length !== uuidFormat ){
                    valid = false
                }
            }
            return valid
        }
        return false;
    }

    validateKey = ( key ) => {
        const { 
            header,
            bodyLength,
            footer
        } = Projects.validator;
        const totalLength = bodyLength + 2;
        const splittedKey = key.split('\n')
        if( splittedKey.length === totalLength ){
            const headerPart = splittedKey[0]
            const footerPart = splittedKey[ totalLength - 1 ];

            if( headerPart == header && footerPart == footer){
                let isBodyValid = true;
                for( let i = 1; i < totalLength - 1; i++ ){
                    const valid = this.isUUID( splittedKey[i] );
                    if( !valid ){
                        isBodyValid = false
                    }
                }
                if( isBodyValid ){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false;
        }
    }

    validMac = ( mac ) => {
        if( mac ){
            return this.isUUID(mac)
        }
        return false
    }

    activateKey = async ( req, res ) => {
        
    }
}
module.exports = ActivationController

    