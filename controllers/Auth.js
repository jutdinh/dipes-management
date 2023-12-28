const sharp = require('sharp');
const fs = require('fs');
const sizeOf = require('image-size');

const { Controller } = require('../config/controllers');
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { EventLogsRecord } = require( '../models/EventLogs' );

const Crypto = require('./Crypto');
const { Projects, ProjectsRecord } = require('../models/Projects');

class Auth extends Controller {
    #__accounts = undefined
    #__default = Accounts.__defaultAccount;
    #__projects = new Projects()
    constructor(){
        super();        
        this.#__accounts = new Accounts();        
    }

    generalCheck = async ( req ) => {
        const verified = await this.verifyToken( req )
        const context = {
            success: false,
            content: "token khum hop le",
            status: "0x4501002"
        }
        if(verified){
            context.success = true;
            context.content = ""

            context.objects = { 
                decodedToken: this.decodeToken(req.header("Authorization"))
            }
        }
        return context
    }

    cropAva = async ( image, username ) => {
        const base64 = image.split(';base64,')[1];
        const buffer = Buffer.from(base64, "base64");
        fs.writeFileSync(`public/temp/${username}.png`, buffer, { encoding: "base64" })

        const sizes = await new Promise( (resolve, reject) => {
            sizeOf(`public/temp/${username}.png`, (error, size ) => {
                resolve( size );
            })
        })
        if( sizes ){
            const { width, height } = sizes;
            const aspect = { width: width, height: height, left: 0, top: 0 }
            if( height > width ){
                const top = Math.round((height-width)/2);
                aspect.top = top;
                aspect.height = width;
            }
            if( width > height ){
                const left = Math.round((width - height)/2);
                aspect.left = left;
                aspect.width = height;
            }
            const destinationFile = `public/image/avatar/${ username }.png`;
            if(fs.existsSync( destinationFile )){
                fs.unlinkSync( destinationFile )
            }
            await new Promise( (resolve, reject) => {
                sharp(`public/temp/${username}.png`).extract( aspect ).toFile(destinationFile, ( error, infor ) => {
                    resolve( { error, infor } )
                })
            })
            fs.unlinkSync(`public/temp/${username}.png`)

            return destinationFile
        }else{
            return false;
        }
    }

    tokenCheck = async ( req, res ) =>{
        const verified = await this.verifyToken(req)
        res.status(200).send({ success: verified })
    }

    getAllUserInfor = async ( req, res, privileges = [] ) => {
        this.writeReq(req)
        const context = {
            success: false,
            content: "",
            data: {},
            status: 200
        }
        const verified = await this.verifyToken(req);
        if( verified ){
            const decodedToken = this.decodeToken( req.header('Authorization') );
            if( privileges.indexOf( decodedToken.role ) != -1 ){
                const users = await this.#__accounts.getAllAccounts()

                
                context.content = "Thành công!";
                context.data = users
                context.success = true;
                context.status = "0x4501000"
            }else{
                context.content = "Bạn không có quyền truy cập api này!"
                context.status = "0x4501001"
            }
        }else{
            context.content = "Token không hợp lệ"
            context.status = "0x4501002"
        }
        res.status(200).send(context)
    }

    getUserInfor = async (req, res, privileges = []) => {        

        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request param: [ username ]
         * 
         */

        this.writeReq(req)
        const context = {
            success: false,
            content: "",
            data: {},
            status: 200
        }
        const verified = await this.verifyToken(req);
        if( verified ){
            const decodedToken = this.decodeToken( req.header('Authorization') );
            if( privileges.indexOf( decodedToken.role ) != -1 ){
                const { username } = req.params;
                        
                const account = await this.#__accounts.find({ username });
                if( account ){
                    const Account = new AccountsRecord( account );
                    context.success = true;
                    context.content = "Gọi dữ liệu thành công!"
                    context.data = Account.get();
                    context.status = "0x4501003"
                }else{
                    if( username == this.#__default.username && decodedToken.role == "uad"){                        
                        context.data = { ...this.#__default, password: "" }
                        context.content = "Gọi dữ liệu thành công!"
                        context.status = "0x4501003"
                        context.success = true;
                    }else{
                        context.content = "Người dùng không tồn tại!"
                        context.status = "0x4501004"
                    }                    
                }
            }else{
                context.content = "Bạn không có quyền truy cập api này!"
                context.status = "0x4501005"
            }
        }else{
            context.content = "Token không hợp lệ"
            context.status = "0x4501002"
        }

        res.status(200).send(context)
    }


    login = async ( req, res ) => {

        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      account: { username, password }
         *  }
         * 
         */

        this.writeReq(req)        
        const { username, password } = req.body.account;  
        const checkNULL = this.notNullCheck( req.body.account, ["username", "password" ] )

        if( checkNULL.valid ){            

            if( username.toLowerCase() == this.#__default.username && password == this.#__default.password ){
                const data = { ...this.#__default, password: undefined }                
                const token = this.makeToken(data);                    
    
                res.status(200).send({ success: true, content: "Đăng nhập thành công", data: { token, data }  })
                this.saveLog("info", req.ip, "__login", `__username ${ this.#__default.username }`,  this.#__default.username )
            }else{
                const Cipher = new Crypto()
                const encryptedPassword = Cipher.encrypt(password)

                const user = await this.#__accounts.find({ username: username.toLowerCase(), password: encryptedPassword })
                
                if( user != undefined){
                    const Account = new AccountsRecord(user);
                    const data = Account.get();
                    console.log(data)
                    const token = this.makeToken( data );    
        
                    this.saveLog("info", req.ip, "__login", `__username ${ Account.username.value() }`, Account.username.value() )
        
                    res.status(200).send({ success: true, content: "Đăng nhập thành công", data: { token, data }  })
                }else{                
                    res.status(200).send({ success: false, content: "Thông tin đăng nhập không chính xác" })
                }
            }

        }else{
            res.status(200).send({ success: false, content: "Một số trường có dữ liệu không hợp lệ" })
        }        
    }

    signup = async ( req, res, privileges = [] ) => {
        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      account: { username, fullname, role, email, phone, address, note }
         *  }
         * 
         */       

        const { username, password, fullname, role, email, phone, address, note } = req.body.account;

        const verified = await this.verifyToken(req);        
        let context = {
            success: false,
            content: "",
            data: {},
            status: 200
        }
        if( !verified ){
            context = {
                success: false,
                content: "Không tìm thấy token hoặc token khum hợp lệ", 
                status: "0x4501007"
            }
        }else{
            const decodedToken = this.decodeToken( req.header('Authorization') );
            
            const checkNULL = this.notNullCheck( req.body.account, ["username", "password", "fullname", "role" ] )
            if( checkNULL.valid ){               
                
                const Cipher = new Crypto()
                const encryptedPassword = Cipher.encrypt(password)

                if( this.checkPrivilege(decodedToken.role, role) ){
                    const create_by = decodedToken.username;
                    const create_at = new Date()
                    const existedAccount = await this.#__accounts.find({ username });   
                    
                    if( existedAccount ){                
                        context.content = `Tài khoản ${ username } đã tồn tại`;
                        context.status = "0x4501008"
                    }else{
                        const rawAccountData = { username: username.toLowerCase(), password: encryptedPassword, fullname, role, email, phone, address, note, create_by: decodedToken, create_at }
                        if( rawAccountData.username != this.#__default.username ){
                            rawAccountData.avatar = `/image/avatar/${ username }.png`
                            const Account = new AccountsRecord(rawAccountData)
                            
                            Account.makeFirstAva();
                            await Account.save();
                            
                            await this.saveLog(
                                "info", 
                                req.ip,
                                "__createuser", 
                                `__username: ${ Account.username.value() } | __permission __${ Account.role.value() }`, 
                                decodedToken.username 
                            )
                            context.success = true; context.content = "Tạo tài khoản thành công!"; context.data = Account.get(); context.status = "0x4501011";
                        }else{
                            context.content = `Tài khoản ${ username } đã tồn tại`;
                            context.status = "0x4501008"
                        }
                    }
                }else{
                    context.content = `Bạn không có quyền để thực thi thao tác này!`
                    context.status = "0x4501009"
                    await this.saveLog("error", req.ip,  "__createuser", `__noright`, decodedToken.username )
                }   

            }else{
                context.content = `Không được bỏ trống các trường: ${ checkNULL.nullFields.toString() }`
                context.status = "0x4501010"
            }
        }

        
        res.status(200).send( context )
    }

    removeUser = async (req, res) => {
        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      account: { username }
         *  }
         * 
         */

        
        const verified = await this.verifyToken(req);  

        const context = {
            success: false,
            content: "",
            data: {},
            status: 200
        }

        if( verified ){
            if( !req.body.account || !req.body.account.username ){
                context.content =  "Request body không hợp lệ";
                context.status = "0x4501012"
            }else{
                const { username } = req.body.account;
                
                const decodedToken = this.decodeToken( req.header('Authorization') );
                const account = await this.#__accounts.find({ username })
                if( !account ){
                    context.success = true;
                    context.content = "Người dùng không tồn tại!"
                    context.status = "0x4501013"
                }else{
                    const Account = new AccountsRecord(account);
                    const AccountData = Account.getData()
                    const validPrivilege = this.checkPrivilege(decodedToken.role, AccountData.role);
                    if( !validPrivilege ){
                        context.content = "Bạn không có quyền thực hiện thao tác này";
                        context.status = "0x4501014"
                        await this.saveLog(
                            "error", req.ip,
                            "__deleteuser", 
                            `__noright`, 
                            decodedToken.username 
                        )  
                    }else{
                        context.success = true;
                        context.content = "Xóa thành công!";
                        context.status = "0x4501015"
                        
                        await this.saveLog(
                            "info", req.ip,
                            "__deleteuser", 
                            `__username ${ Account.username.value() } | __permission __${ Account.role.value() }`, 
                            decodedToken.username 
                        )                            
                        await Account.destroy()                        
                    }
                    const projects = await this.#__projects.findAll();
                    for( let i = 0 ; i < projects.length; i++ ){
                        const Project = new ProjectsRecord(projects[i])
                        const project = Project.getData()
                        
                        delete project.supervisors[ this.dotEncode(username) ]
                        delete project.deployers[ this.dotEncode(username) ]

                        if( this.dotEncode(project.manager.username) == this.dotEncode( username )){
                            project.manager = {}
                        }
                        const tasks = this.deleteUserFromTasks(project, username)

                        
                        await Project.__modifyAndSaveChange__("manager", project.manager)
                        await Project.__modifyAndSaveChange__("supervisors", project.supervisors)
                        await Project.__modifyAndSaveChange__("deployers", project.deployers)
                        await Project.__modifyAndSaveChange__("tasks", tasks)
                    }
                }
            }
        }else{
            context.content =  "Không tìm thấy token hoặc token khum hợp lệ";
            context.status = "0x4501016"
        }

        res.status(200).send(context)
    }

    

    updateUser = async ( req, res, privileges = [] ) => {

         /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      account: { username, fullname, role, email, phone, address, note }
         *  }
         * 
         */
        
                
        const context = await this.generalCheck(req); 
        const { success, objects } = context;
        if( success ){            
            context.success = false;
            const { account } = req.body;            
            const { decodedToken } = objects;
            const nullCheck = this.notNullCheck( account, ["username"] )
            if( nullCheck.valid ){
                const { username } = account;
                const oldAccount = await this.#__accounts.find({ username })
                if( oldAccount ){
                    if( this.checkPrivilege( decodedToken.role, account.role ) ){
                        const Account = new AccountsRecord(oldAccount)                    
                        Account.setInfo( account )                        
                        await Account.save()

                        this.updateAllProject( account )

                        context.success = true;
                        context.content = "Thành công"
                        context.status = "0x4501017"
                    }else{
                        context.content = "Khum thể cập nhật phân quyền lớn hơn mình"
                        context.status = "0x4501019"            
                    }
                }else{
                    context.content = "Account khum tồn tại"
                    context.status = "0x4501013"        
                }
            }else{
                context.content = "Body khum hợp lệ"
                context.status = "0x4501022"    
            }
        }else{
            context.content = "Token không hợp lệ!"
            context.status = "0x4501023"
        }
        res.status(200).send(context )
    }

    selfUpdate = async ( req, res ) => {

         /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      account: { username, fullname, role, email, phone, address, note }
         *  }
         * 
         */
        
                
        const context = await this.generalCheck(req); 
        const { success, objects } = context;
        if( success ){            
            context.success = false;
            const { account } = req.body;            
            const { decodedToken } = objects;
            const nullCheck = this.notNullCheck( account, ["username"] )
            if( nullCheck.valid ){
                const { username } = account;
                const oldAccount = await this.#__accounts.find({ username })
                if( oldAccount ){
                    if( this.checkPrivilege( decodedToken.role, account.role ) ){
                        const Account = new AccountsRecord(oldAccount)                    
                        Account.setInfo( account )    
                        console.log( Account.getData() )                    
                        await Account.save()
                        
                        this.updateAllProject( account )

                        context.success = true;
                        context.content = "Thành công"
                        context.status = "0x4501017"
                    }else{
                        context.content = "Khum thể cập nhật phân quyền lớn hơn mình"
                        context.status = "0x4501019"            
                    }
                }else{
                    context.content = "Account khum tồn tại"
                    context.status = "0x4501013"        
                }
            }else{
                context.content = "Body khum hợp lệ"
                context.status = "0x4501022"    
            }
        }else{
            context.content = "Token không hợp lệ!"
            context.status = "0x4501023"
        }
        res.status(200).send(context )
    }

    updateAllProject = async ( account ) => {
        const projects = await this.#__projects.findAll()
        const encodedUsername = this.dotEncode( account.username )

        for( let i = 0 ; i < projects.length; i++ ){
            const Project = new ProjectsRecord( projects[i] )

            const project = Project.getData()

            if( project.supervisors[encodedUsername] != undefined){
                project.supervisors[encodedUsername] = account
            }

            if( project.deployers[encodedUsername] != undefined ){
                project.deployers[encodedUsername] = account
            }

            if( this.dotEncode(project.manager.username) == encodedUsername ){
                project.manager = account
            }
            project.tasks = this.updateUserOnAllTasks(project, account)

            Project.setData(project)
            await Project.save()
        }
    }

    changeAva = async ( req, res, privileges = [] ) => {
        const verified = this.verifyToken( req );
        const decodedToken = this.decodeToken( req.header("Authorization") );
        const context = {
            success: false,
            content: "",
            data: {},
            status: 200
        }

        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {
         *      username: <String>
         *      image: <Base64>
         *  }
         * 
         */
        if( verified ){
            if( privileges.indexOf( decodedToken.role ) != -1 ){
                const { username, image } = req.body;               
                if( username && image ){
                    const user = await this.#__accounts.find({ username })
                    if( user != undefined ){
                        const Account = new AccountsRecord( user );
                        if( this.checkPrivilege( decodedToken.role, Account.role.value() ) ){
                            const cropResult = await this.cropAva( image, username )
                            if( cropResult ){
                                context.success = true; 
                                context.content = "Thay đổi thành công"
                                context.status = "0x4501029"
                                await this.saveLog( "info", req.ip, "__changeAva", "", decodedToken.username );
                            }else{
                                context.content = "Tệp lỗi!"; 
                                context.status = "0x4501030"       
                            }
                        }else{
                            context.content = "Bạn không có quyền thực hiện thao tác này"; 
                            context.status = "0x4501031"
                        }
                    }else{
                        context.content = "Tài khoản không tồn tại";
                        context.status = "0x4501032"
                    }
                }else{
                    context.content = "Request body không hợp lệ!"
                    context.status = "0x4501033"
                }
            }else{
                context.content = "Bạn không có quyền để truy cập API này!"    
                context.status = "0x4501034"
            }
        }else{
            context.content = "Token không hợp lệ"
            context.status = "0x4501035"
        }
        res.status(200).send(context)
    }

    selfChangeAva = async (req, res) => {

        /**
         *  Request headers: {
         *      Authorization: <Token>
         *  }
         *  Request body: {         
         *      image: <Base64>
         *  }
         * 
         */

        const verified = await this.verifyToken(req);  

        const context = {
            success: false,
            content: "",
            data: {},
            status: 200

        }
        const decodedToken = this.decodeToken( req.header("Authorization") );
        if( verified ){
            const { image } = req.body; 
            
            if( image != undefined ){
                const { username } = decodedToken;
                if( username != undefined ){
                    const account = await this.#__accounts.find({ username })
                    const destinationFile = `public/image/avatar/${ username }.png`;
                    if( account ){                                                                           
                        this.cropAva( image, username )
                        context.content = "Cập nhật thành công!"
                        context.success = true;
                        context.status = "0x4501036"   
                        await this.saveLog( "info", req.ip, "__changeAva", `__path: ${ destinationFile }` , decodedToken.username );      
                    }else{
                        
                        if( username == this.#__default.username && decodedToken.role == "uad"){                        
                            this.cropAva( image, username )
                            context.success = true;
                            context.content = "Cập nhật thành công!"
                            context.status = "0x4501036"

                            await this.saveLog( "info", req.ip, "__changeAva", `__path: ${ destinationFile }` , decodedToken.username );
                        }else{
                            context.content = "Người dùng không tồn tại!"
                            context.status = "0x4501037"
                        } 
                    }
                }else{
                    context.content = "Token không hợp lệ"
                    context.status = "0x4501038"
                }
            }else{
                context.content = "Request body không hợp lệ"
                context.status = "0x4501039"
            }
        }else{
            context.content = "Token không hợp lệ"
            context.status = "0x4501040"
        }
        res.status(200).send(context)
    }


    changePassword = async (req, res) => {

        const context = await this.generalCheck(req); 
        const { success, objects } = context;
        if( success ){            
            context.success = false;
            const { account } = req.body;            
            const { decodedToken } = objects;
            const nullCheck = this.notNullCheck( account, ["username", "newpassword"] )
            if( nullCheck.valid ){
                const { username } = account;
                const oldAccount = await this.#__accounts.find({ username })
                if( oldAccount ){
                    const AccountObject = new AccountsRecord(oldAccount)

                    const Cipher = new Crypto()
                    const encryptedPassword = Cipher.encrypt(account.newpassword)
                    
                    AccountObject.__modifyAndSaveChange__("password", encryptedPassword)

                    context.account = AccountObject.getData()
                    context.success = true
                    context.content = "Success"
                }else{
                    context.content = "Account khum tồn tại"
                    context.status = "0x4501013"        
                }
            }else{
                context.content = "Body khum hợp lệ"
                context.status = "0x4501022"    
            }
        }else{
            context.content = "Token không hợp lệ!"
            context.status = "0x4501023"
        }
        delete context.objects
        res.status(200).send(context )
    }

    retrievePassword = async ( req, res ) => {
        const context = await this.generalCheck(req); 
        const { success, objects } = context;
        if( success ){            
            context.success = false;
            const acc = req.body.account;            
            const { decodedToken } = objects;
            const nullCheck = this.notNullCheck( acc, ["username"] )
            if( nullCheck.valid ){
                const { username } = acc;
                const account = await this.#__accounts.find({ username })
                if( account  ){
                    const Cipher = new Crypto()                    

                    const decryptedPassword = Cipher.decrypt(account.password)                   

                    context.password = decryptedPassword
                    context.success = true
                    context.content = "Success"

                }else{
                    context.content = "Account khum tồn tại"
                    context.status = "0x4501013"        
                }
            }else{
                context.content = "Body khum hợp lệ"
                context.status = "0x4501022"    
            }
        }else{
            context.content = "Token không hợp lệ!"
            context.status = "0x4501023"
        }
        delete context.objects
        res.status(200).send(context )
    }


}




module.exports = Auth

    