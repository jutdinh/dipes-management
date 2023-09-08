const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { intValidate, objectComparator } = require('../functions/validator');

const { Database } = require('../config/models/database');
const { translateUnicodeToBlanText } = require('../functions/auto_value');

class ProjectsController extends Controller {

    constructor() {
        super();
    }

    generalCheck = async (req, privileges = []) => {
        const context = {
            success: false,
            content: "Invalid token",
            objects: {},
            status: "0x4501045"
        }
        const verified = await this.verifyToken(req)
        if (verified) {
            const decodedToken = this.decodeToken(req.header("Authorization"))
            context.objects = { decodedToken }
            context.success = true;

            if (privileges.length > 0) {
                if (privileges.indexOf(decodedToken.role) == - 1) {
                    context.success = false;
                    context.content = "Khum có quyền truy cập api"
                    context.status = "0x4501043"
                }
            }
        }
        return context
    }


    validateProjectAndManager = async (project_id, username) => {
        const ProjectsModel = new Projects()
        const project = await ProjectsModel.find({ project_id: parseInt(project_id) })
        const validators = {
            success: false,
            permission: undefined,
            project: {}
        }
        if (project) {
            validators.project = project;
            const { manager } = project
            validators.success = true

            if (manager.username == username) {
                validators.permission = Controller.permission.mgr
            } else {
                const { members } = project
                if (members && members[username] != undefined) {
                    const member = members[username]
                    validators.permission = member.permission
                }
            }
        }
        return validators
    }

    getAllProjectBuOnLyGeneralInfo = async () => {
        const projects = await Database.selectFields("projects", {}, [ "project_id", "project_name", "project_code", "project_status", "project_description", "project_type", "proxy_server", "create_at", "manager", "members", "create_by"])            
        return projects
    }

    projectGeneralCheck = async (req, project_id, privileges = []) => {
        const context = {
            success: false,
            content: "Invalid token",
            objects: {},
            status: "0x4501047"
        }
        const verified = await this.verifyToken(req)
        if (verified) {
            const decodedToken = this.decodeToken(req.header("Authorization"))
            context.objects = { decodedToken }
            context.success = true;

            const projectAndManagerValiator = async () => {
                const validate = await this.validateProjectAndManager(project_id, decodedToken.username)
                const { success, project, permission } = validate;
                context.success = success
                context.permission = permission                
                if ( !objectComparator(project, {}) ) {
                    const Project = new ProjectsRecord(project)
                    context.objects["Project"] = Project
                } else {
                    context.success = false
                    context.content = "Dự án khum tồn tại"
                    context.status = "0x4501072"
                }                
            }

            if (privileges.length > 0) {
                if (privileges.indexOf(decodedToken.role) != - 1) {
                    await projectAndManagerValiator()
                } else {
                    context.success = false;
                    context.content = "Khum có quyền truy cập api"
                    context.status = "0x4501060"
                }
            } else {
                await projectAndManagerValiator()
            }
        }        
        return context
    }


    getFullProjectsData = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context
        if (success) {
            const ProjectsModel = new Projects()
            const start = new Date()
            const projects = await ProjectsModel.findAll()
            const end = new Date()
            // console.log(45, `PROCCESSING TIME: ${end - start}`)
            context.data = projects.map(project => {
                const Project = new ProjectsRecord(project)
                return Project.getProjectAndManager()
            })

            context.status = "0x4501041"
        }        
        delete context.objects
        res.status(200).send(context)
    }


    get = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context
        if (success) {
            const ProjectsModel = new Projects()
            const start = new Date()        
            const projects = await this.getAllProjectBuOnLyGeneralInfo()
            const end = new Date()
            console.log(45, `PROCCESSING TIME: ${end - start}`)
            context.data = projects.map(project => {
                const Project = new ProjectsRecord(project)
                return Project.getProjectAndManager()
            })

            context.status = "0x4501041"
        }        
        delete context.objects
        res.status(200).send(context)
    }


    getProjectsForReport = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context
        if (success) {
            const ProjectsModel = new Projects()
            const start = new Date()
            const projects = await this.getAllProjectBuOnLyGeneralInfo()
            const end = new Date()

            context.data = { projects: projects.map(project => {
                const Project = new ProjectsRecord(project)
                return Project.getProjectAndManager()
            }) }

            console.log(45, `PROCCESSING TIME: ${end - start}`)
            context.status = "0x4501041"
        }
        delete context.objects
        res.status(200).send(context)
    }

    getProjectForReport = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context
        if (success) {
            const ProjectsModel = new Projects()
            const { project_id } = req.params;
            const start = new Date()
            const project = await ProjectsModel.find( { project_id: parseInt(project_id) } )

            if( project ){

                project.tasks = Object.values( project.tasks ? project.tasks : {} )

                project.tasks.map( task => {
                    const task_modified = Object.values( task.task_modified ? task.task_modified : {})
                    if( task_modified.length > 0 ){
                        const lastModified = task_modified[ task_modified.length - 1 ]
                        task.changed_at = lastModified.modified_at
                    }

                    if( !task.changed_at ){
                        task.changed_at = task.create_at
                    }

                    task.task_modified = task_modified
                    task.members = Object.values( task.members )

                    task.create_by = task.create_by.fullname
                })

                project.manager = project.manager.fullname

                context.data = { project }
                const end = new Date()
                console.log(45, `PROCCESSING TIME: ${end - start}`)
                context.status = "0x4501041"
            }else{
                context.success = false;
                context.status = "0x4501072"
            }
        }
        delete context.objects
        res.status(200).send(context)
    }

    getOne = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context;

        if (success) {
            const ProjectsModel = new Projects()
            const { project_id } = req.params;
            if (intValidate(project_id)) {

                const project = await ProjectsModel.find({ project_id: parseInt(project_id) })

                if (project) {
                    const Project = new ProjectsRecord(project)
                    context.data = Project.getFullProjectData( false )
                    context.success = true
                    context.status = "0x4501041"
                } else {
                    context.success = false
                    context.status = "0x4501049"
                }
            } else {
                context.content = "Mã dự án khum hợp lệ"
                context.status = "0x4501050"
            }
        }
        delete context.objects;
        res.status(200).send(context)
    }

    create = async (req, res, privileges = []) => {
        this.writeReq(req)
        const start = new Date()
        const context = await this.generalCheck(req, privileges)
        const { success, objects } = context;

        if (success) {
            const nullCheck = this.notNullCheck(req.body, ["project", "manager"])

            if (nullCheck.valid) {
                const AccountsModel = new Accounts()
                const { project, manager } = req.body;
                const { decodedToken } = objects
                const managerAccount = await AccountsModel.find({ username: manager.username })

                if( managerAccount ){
                    project.manager = managerAccount;
                    project.create_by = decodedToken;
                    const today = new Date()
                    project.create_at = today
                    const Project = new ProjectsRecord(project)
                    await Project.createVersion(decodedToken)
                    await Project.createPeriod({
                        period_name: "Giai đoạn một",
                        start: today,
                        end: new Date(`${ today.getFullYear() }-${ today.getMonth() + 1 + 1 }-${ today.getDate() }`)
                    })
                    await Project.save()
                    context.data = Project.getData()
    
                    const finishedData = Project.getData()
    
                    context.content = "Tạo thành công"
                    context.status = "0x4501054"
    
                    this.saveLog( "info", req.ip, "__createproject", `__projectname ${ finishedData.project_name } |__manager ${ managerAccount?.fullname } | __projectType: ${ finishedData.project_type} | __projectProxy: ${ finishedData.proxy_server }`, decodedToken.username )
                }else{
                    context.success = false
                    context.content = "Người quản lý khum tồn tại hoặc bị bỏ trống"
                    context.status = "0x4501245"
                }                                           
            } else {
                context.success = false
                context.content = "Tham số khum hợp lệ"
                context.status = "0x4501059"
            }

        }
        const end = new Date()
        console.log("TOTAL TIME: ", end - start)

        delete context.objects;
        res.status(200).send(context)
    }

    update = async (req, res) => {
        this.writeReq(req)
        const start = new Date()
        const context = await this.generalCheck(req)
        const { success, objects } = context;

        if (success) {
            const { project } = req.body;
            if (project != undefined) {
                const { project_id } = project
                const ProjectsModel = new Projects()
                const oldProject = await ProjectsModel.find({ project_id })

                const Project = new ProjectsRecord(oldProject)
                Project.setUpdateInfor(project)
                Project.save()
                context.status = "0x4501071"
            } else {
                context.content = "Body khum hợp lệ"
                context.success = false
                context.status = "0x4501059"
            }
        }

        delete context.objects;
        res.status(200).send(context)
    }

    delete = async (req, res) => {
        this.writeReq(req)
        const start = new Date()
        const context = await this.generalCheck(req)
        const { success, objects } = context;
        if (success) {
            const { decodedToken } = objects
            const nullCheck = this.notNullCheck(req.body, ["project"])
            if (nullCheck.valid) {
                const { project_id } = req.body.project;

                if (project_id != undefined) {
                    const ProjectsModel = new Projects()
                    const project = await ProjectsModel.find({ project_id })

                    if (project != undefined) {
                        const Project = new ProjectsRecord(project)
                        Project.remove()        
                        
                        await this.saveLog( "warn", req.ip, "__purgeproject", `__projectname ${ project.project_name }`, decodedToken.username )
                        
                        context.status = "0x4501079"
                    }else{
                        context.success = true
                        context.status = "0x4501080"
                    }
                }else{
                    context.success = false
                    context.status = "0x4501082"
                }
            }else{
                context.success = false
                context.status = "0x4501082"
            }
        }

        delete context.objects;
        res.status(200).send(context)
    }


    statisProjectsBasedOnStatusOfAllTime = async (req, res) => {
        this.writeReq(req)
        const context = {
            success: true,
            statistic: {}
        }

        const verified = await this.verifyToken(req);       

        if (verified) {            
            const projects = await this.getAllProjectBuOnLyGeneralInfo()
            const total = projects.length;

            if (total > 0) {
                Projects.validStatus.map(status => {
                    const count = projects.filter(project => project.project_status == status).length;
                    const record = {}
                    record.total = count;
                    const percentage = (count * 100) / total
                    record.percentage = `${percentage.toFixed(2)}%`
                    context.statistic[status.toString()] = record;

                })
            }
        }

        res.status(200).send(context)
    }

    statisProjectsBasedOnManagers = async (req, res) => {
        const context = {
            success: true,
            statistic: []
        }
        const verified = await this.verifyToken(req);
        if (verified) {
            
            const AccountsModel = new Accounts()

            const projects = await this.getAllProjectBuOnLyGeneralInfo()
            const managers = await AccountsModel.findAll()

            const total = projects ? projects.length : 0;
            if (managers.length > 0 && projects.length > 0) {
                const statistic = []
                for (let i = 0; i < managers.length; i++) {
                    const account = managers[i]
                    const { username } = account;

                    const projectIn = projects.filter(p => p.manager.username == username)

                    if (projectIn.length > 0) {

                        const manager = { total: 0, percentage: "0%" };
                        manager.fullname = account.fullname
                        manager.username = account.username
                        manager.avatar = this.dotDecode(account.avatar)
                        if (projectIn != undefined) {
                            manager.total = projectIn.length
                            const percentage = manager.total * 100 / total
                            manager.percentage = `${percentage.toFixed(2)}%`
                        }
                        statistic.push(manager)
                    }
                }

                context.statistic = statistic
            }
        }

        res.status(200).send(context)
    }

    statisProjects = async (req, res) => {
        /**
         * Request Headers {
         *      Authorization: <Token>    
         * }
         * 
         */
        const context = {
            success: false,
        }
        const verified = await this.verifyToken(req);

        if (verified) {            
            const projects = await this.getAllProjectBuOnLyGeneralInfo()

            let annualStatistic = []
            if (projects) {
                for (let i = 0; i < projects.length; i++) {
                    const project = projects[i]
                    const { project_status, create_at } = project;
                    const stringifyProjectStatus = project_status ? project_status.toString() : "unknown_status";
                    const date = new Date(create_at);
                    const year = date.getFullYear()
                    const yearExisted = annualStatistic.find(record => record.year == year)
                    if (!yearExisted) {
                        const newYear = {
                            year
                        }
                        newYear[stringifyProjectStatus] = 1
                        annualStatistic.push(newYear)
                    } else {
                        annualStatistic = annualStatistic.map(statis => {
                            if (statis.year == year) {
                                if (statis[stringifyProjectStatus]) {
                                    statis[stringifyProjectStatus] = statis[stringifyProjectStatus] + 1
                                } else {
                                    statis[stringifyProjectStatus] = 1
                                }
                            }
                            return statis
                        })
                    }
                }
                annualStatistic.sort((preYear, nextYear) => preYear.year < nextYear.year ? -1 : 1)
            }
            context.content = "Thành công nè"
            context.success = true;
            context.data = {
                annualStatistic
            }
        } else {
            context.content = "Token khum hợp lệ"
            context.status = "0x4501114"
        }

        res.status(200).send(context)
    }


    addMembers = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.generalCheck(req)
        const { success, objects } = context;
        const start = new Date()
        if (success) {
            const { decodedToken } = objects

            if (this.notNullCheck(req.body, ["project_id", "usernames"]).valid) {
                const { project_id, usernames } = req.body;
                const ProjectsModel = new Projects()                
                const queryStart = new Date()
                const project = await ProjectsModel.find({ project_id: parseInt(project_id) })
                const queryEnd = new Date()
                console.log(`QUERY PROJECT PROCESSING TIME: ${queryEnd - queryStart}`)

                if (project) {
                    const AccountsModel = new Accounts()
                    const Project = new ProjectsRecord(project)

                    const usernamesArray = usernames.map(({ username }) => username )
                    const queryStart = new Date()
                    const users = await AccountsModel.findAll({ username: { $in: usernamesArray } })                    
                    const queryEnd = new Date()
                    console.log(`QUERY USER PROCESSING TIME: ${queryEnd - queryStart}`)

                    const members = usernames.map(({ username, permission, role }) => Project.createMember(users, username, permission || role)).filter(result => result != undefined)
                    Project.updateMembers(members)                    
                    this.saveLog( "info", req.ip,"__addmembertoproject", `__projectname ${ project.project_name }| __username ${ members.filter(mem => mem.permission != undefined).map( mem => `${mem.username}-${ mem.fullname }( ${ mem.permission } )` ).join(", ") }`, decodedToken.username )
                    
                    Project.__modifyAndSaveChange__("members", Project.getData().members)                   
                    context.success = true;
                    context.content = "Thêm thành viên thành công"
                    context.status = "0x4501062"
                } else {
                    context.content = "Khum tìm thấy dự án"
                    context.success = false
                    context.status = "0x4501066"
                }
            } else {
                context.content = "Body khum hợp lệ"
                context.success = false
                context.status = "0x4501069"
            }
        }

        const end = new Date()
        console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)
    }

    removeMember = async (req, res, privileges = []) => {
        this.writeReq(req)
        const context = await this.projectGeneralCheck(req, req.body.project_id)
        const { success, objects, permission } = context;
        const start = new Date()

        if (success) {

            const { Project, decodedToken } = objects
            const project = Project.getData()
            const username  = this.dotEncode(req.body.username);
            if (
                permission == Controller.permission.manager ||
                this.isAdmin(decodedToken) ||
                this.checkPrivilege(permission, project.members[username].permission)
            ) {
                delete project.members[username]

                const Project = new ProjectsRecord(project)
                await Project.__modifyAndSaveChange__("members", project.members)

                await this.saveLog("info", req.ip,
                "__removeprojectmember",
                `__projectname ${ project.project_name } | __username ${ username }`,
                decodedToken.username)

                context.status = "0x4501107"
            } else {
                context.success = false
                context.content = "Khum thể xóa người dùng có quyền cao hơn mình khỏi dự án"
                context.status = "0x4501108"
            }
            
            const end = new Date()
            console.log(`PROCCESSING TIME: ${end - start}`)
            delete context.objects;
            res.status(200).send(context)
        }
    }

    changeMemberPrivilege = async (req, res) => {
        this.writeReq(req)
        const context = await this.projectGeneralCheck(req, req.body.project_id)
        const { success, objects, permission } = context;
        const start = new Date()

        if (success) {
            const username  = this.dotEncode(req.body.username);
            const targetPermission = req.body.permission

            const { Project, decodedToken } = objects
            const project = Project.getData()
            if (
                permission == Controller.permission.manager ||
                this.isAdmin(decodedToken) ||
                this.checkPrivilege(permission, project.members[username].permission)
            ) {
                if (this.isAdmin(decodedToken) || this.checkPrivilege(permission, targetPermission)) {
                    const oldPer = project.members[username].permission
                    project.members[username].permission = targetPermission
                    Project.setData(project)
                    Project.save()
                    context.success = true
                    context.content = "Thay đổi thành công"
                    context.status = "0x4501094"

                    await this.saveLog("warn", req.ip, "__modifypermission",
                    `__projectname ${ project.project_name } | __username ${ username } | __permission __${ oldPer } => __${ targetPermission } `,
                    decodedToken.username)
                } else {
                    context.content = "Khum thể thay đổi quyền lớn hơn quyền của người thực hiện"
                    context.status = "0x4501095"
                    context.success = false
                }
            } else {
                context.content = "Khum thể thay đổi quyền của người dùng có quyền cao hơn người thực hiện"
                context.status = "0x4501096"
                context.success = false
            }
        }

        const end = new Date()
        console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)
    }

    getTaskPeriods = async (req, res) => {
        this.writeReq(req)
        const { project_id } = req.params         
        const context = await this.projectGeneralCheck(req, project_id)        
        const { success, objects } = context;
        
        if( success ){

            const { Project, decodeToken } = objects        
            const project  = Project.getData()
    
            const { tasks } = project
            const periods = Object.values( tasks )
            
            periods.map( period => {
                period.tasks = Object.values( period.tasks )
                period.period_members = Object.values( period.period_members )
                period.tasks.map( task => {
                    task.members = Object.values( task.members )
                    task.child_tasks = Object.values( task.child_tasks )

                    task.child_tasks.map( c_task => {
                        c_task.members = Object.values(c_task.members)
                    })
                })
            })

            context.data = periods
            context.status = "0x4501254"
            context.content = "Lấy thông tin các giai đoạn thành công"
        }

        delete context.objects        
        res.status(200).send(context)
    }  


    getTaskPeriod = async (req, res) => {
        this.writeReq(req)
        const { project_id, period_id } = req.params         
        const context = await this.projectGeneralCheck(req, project_id)        
        const { success, objects } = context;
        
        if( success ){

            const { Project, decodeToken } = objects        
            const project  = Project.getData()
    
            const { tasks } = project
            const period = tasks?.[`${period_id}`]
            
            if( period ){
                period.tasks = Object.values( period.tasks )
                period.period_members = Object.values( period.period_members )
                period.tasks.map( task => {
                    task.members = Object.values( task.members )
                    task.child_tasks = Object.values( task.child_tasks )

                    task.child_tasks.map( c_task => {
                        c_task.members = Object.values(c_task.members)
                    })
                })
                
                context.data = period
                context.status = "0x4501256"
                context.content = "Lấy thông tin giai đoạn thành công"
            }else{
                context.content = "Giai đoạn khum tồn tại"
                context.status = "0x4501255"
                context.success = false
            }
        }

        delete context.objects        
        res.status(200).send(context)
    } 

    createTaskPeriod = async ( req, res ) => {
        this.writeReq(req)
        const { period, project_id } = req.body                 
        
        const context = await this.projectGeneralCheck(req, project_id)        
        const { success, objects } = context;

        if( success ){

            const bodyNullCheck = this.notNullCheck( req.body, ["period"] )
            if(bodyNullCheck.valid){
                const { Project, decodedToken } = objects;            
                const nullCheck = this.notNullCheck( period, ["period_name", "start", "end"] )           
    
                if( nullCheck.valid ){
                    const { start, end, members } = period
                    const startDate = new Date( start )
                    const endDate = new Date( end )

                    if( endDate && startDate && endDate - startDate >= 0 ){

                        if( members && Array.isArray(members)){
                            const AccountsModel = new Accounts()
                            const users = await AccountsModel.findAll({ username: { $in: members } })
                            const serializedUsers = {}
                            users.map(user => {
                                serializedUsers[user.username] = user
                            })    
                            period.period_members = serializedUsers
                        }


                        await Project.createPeriod( period )
                        await Project.save()

                        context.content = "Tạo giai đoạn thành công"    
                        context.success = true 
                        context.status = "0x4501253"
                    }else{                       
                        context.content = "Ngày kết thúc phải lớn hơn ngày bắt đầu"    
                        context.success = true 
                        context.status = "0x4501252"
                    }  
    
    
                }else{
                    if( !period.period_name ){
                        context.content = "Tên giai đoạn không hợp lệ hoặc rỗng"
                        context.status = "0x4501248"
                    }
                    if( !period.start ){
                        context.content = "Ngày bắt đầu không hợp lệ hoặc rỗng"
                        context.status = "0x4501250"                
                    }
                    if( !period.end ){
                        context.content = "Ngày kết thúc không hợp lệ hoặc rỗng"
                        context.status = "0x4501251" 
                    }               
                    context.success = false            
                }
            } else{
                context.content = "Thông tin giai đoạn không hợp lệ hoặc rỗng"
                context.status = "0x4501249" 
                context.success = false     
            }
        }

        delete context.objects
        res.status(200).send( context )
    } 

    updateTaskPeriod = async ( req, res ) => {
        this.writeReq(req)

        const { project_id, period_id } = req.params
        const { period} = req.body                 
                
        const context = await this.projectGeneralCheck(req, project_id)        
        const { success, objects } = context;
        
        if( success ){
            const { Project } = objects;
            const project  = Project.getData()
    
            const { tasks } = project
            const oldPeriod = tasks?.[`${period_id}`]

            if( oldPeriod ){

                const bodyNullCheck = this.notNullCheck( req.body, ["period"] )
                if(bodyNullCheck.valid){

                    const nullCheck = this.notNullCheck( period, ["period_name", "start", "end"] )           
        
                    if( nullCheck.valid ){
                        const { start, end, members } = period
                        const startDate = new Date( start )
                        const endDate = new Date( end )
    
                        if( endDate && startDate && endDate - startDate >= 0 ){
    
                            if( members && Array.isArray(members)){
                                const AccountsModel = new Accounts()
                                const users = await AccountsModel.findAll({ username: { $in: members } })
                                const serializedUsers = {}
                                users.map(user => {
                                    serializedUsers[user.username] = user
                                })    
                                period.period_members = serializedUsers
                            }

                            const newPeriod = {...oldPeriod, ...period}
                            
                            delete newPeriod.members // this may cause error

                            await Project.__modifyAndSaveChange__(`tasks.${ period_id }`, newPeriod)
    
                            context.content = "Cập nhật giai đoạn thành công"    
                            context.success = true 
                            context.status = "0x4501257"                            
                        }else{                       
                            context.content = "Ngày kết thúc phải lớn hơn ngày bắt đầu"    
                            context.success = true 
                            context.status = "0x4501252"
                        }  
        
        
                    }else{
                        if( !period.period_name ){
                            context.content = "Tên giai đoạn không hợp lệ hoặc rỗng"
                            context.status = "0x4501248"
                        }
                        if( !period.start ){
                            context.content = "Ngày bắt đầu không hợp lệ hoặc rỗng"
                            context.status = "0x4501250"                
                        }
                        if( !period.end ){
                            context.content = "Ngày kết thúc không hợp lệ hoặc rỗng"
                            context.status = "0x4501251" 
                        }               
                        context.success = false            
                    }
                } else{
                    context.content = "Thông tin giai đoạn không hợp lệ hoặc rỗng"
                    context.status = "0x4501249" 
                    context.success = false     
                }
            }else{
                context.content = "Giai đoạn khum tồn tại"
                context.status = "0x4501255"
                context.success = false
            }
        }

        delete context.objects        
        res.status(200).send(context)
    }

    removeTaskPeriod = async ( req, res ) => {
        this.writeReq(req)

        const { project_id, period_id } = req.params                
                
        const context = await this.projectGeneralCheck(req, project_id)        
        const { success, objects } = context;

        if( success ){
            const { Project } = objects;
            const project  = Project.getData()
    
            const { tasks } = project
            if( tasks ){
                delete tasks[`${ period_id }`]
                await Project.__modifyAndSaveChange__( "tasks", tasks )
            }
            context.status = "0x4501258"
            context.content = "Xóa giai đoạn thành công"
        }
        delete context.objects        
        res.status(200).send(context)
    }

    createTask = async (req, res) => {
        this.writeReq(req)
        const { project_id } = req.params

        const context = await this.projectGeneralCheck(req, project_id)
        const { success, objects, permission } = context;
        const start = new Date()
        if (success) {
            const { Project, decodedToken } = objects;
            const { task, period_id } = req.body;
            
            const project = Project.getData()
            const period = project.tasks?.[`${period_id}`];
            if( period ){

                const { start, end } = task
                const startDate = new Date( start )
                const endDate = new Date( end )
                if( startDate && endDate && endDate >= startDate ){
                    const nullCheck = this.notNullCheck(task, ["task_name", "task_description"])
                    task.create_by = decodedToken
                    task.create_at = new Date()
                    if (nullCheck.valid) {
                        const members = task.members ? task.members : []
                        const AccountsModel = new Accounts()
                        const users = await AccountsModel.findAll({ username: { $in: members } })
                        const serializedUsers = {}
                        users.map(user => {
                            serializedUsers[user.username] = user
                        })
                        task.members = serializedUsers;
                        await Project.addTask(period_id, task)
                        await Project.save()
                        const project = Project.getData()
        
                        this.saveLog("info", req.ip, "__createtask", `__projectname: ${ project.project_name }| __taskname: ${ task.task_name } | __taskdescription: ${ task.task_description } | __taskpriority ${task.task_priority } | __taskmembers: ${ users.map( u => `${u.username}(${ u.fullname })` ).join(", ") }`, decodedToken.username)
                        
                        context.content = "Thêm thành công"
                        context.status = "0x4501119"
                        context.success = true
                        context.tasks = Object.values(project.tasks)
        
                    } else {
                        context.content = "Body khum hợp lệ"
                        context.status = "0x4501122"
                        context.success = false
                    }
                }else{
                    context.content = "Ngày kết thúc phải lớn hơn ngày bắt đầu"    
                    context.success = true 
                    context.status = "0x4501252"
                }                
            }else{
                context.content = "Giai đoạn khum tồn tại"
                context.status = "0x4501255"
                context.success = false
            }
        }

        const end = new Date()
        console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)
    }

    createChildTask = async (req, res) => {
        this.writeReq(req)
        const { project_id, period_id, task_id } = req.params
        
        const context = await this.projectGeneralCheck(req, project_id)
        const { success, objects, permission } = context;
        const start = new Date()
        
        if( success ){            
            const { Project, decodedToken } = objects;
            const project = Project.getData()
            const periods = project.tasks ? project.tasks : {} ;

            const period = periods[`${period_id}`]
            if( period ){
                const task = period.tasks?.[`${task_id}`]
                if( task ){                    
                    const childTask = req.body.child_task;
                    childTask.create_by = decodedToken;

                    const nullCheck = this.notNullCheck(childTask, ["child_task_name", "child_task_description", "child_task_status"])
                    if( nullCheck.valid ){



                        const members = childTask.members ? childTask.members : []
                        const AccountsModel = new Accounts()
                        const users = await AccountsModel.findAll({ username: { $in: members } })
                        const serializedUsers = {}
                        users.map(user => {
                            serializedUsers[user.username] = user
                        })
                        childTask.members = serializedUsers;
                        await Project.addChildTask(period_id, task_id, childTask)
                        await Project.save()
                        
                        context.content = "Thêm thành công"
                        context.status = "0x4501119"                        
                    }else{
                        context.content = "Body khum hợp lệ"
                        context.status = "0x4501122"
                        context.success = false
                    }
                }else{  
                    context.content = "Yêu cầu khum tồn tại"
                    context.status = "0x4501259"
                    context.success = false
                }
            }else{
                context.content = "Giai đoạn khum tồn tại"
                context.status = "0x4501255"
                context.success = false
            }
        }
        
        delete context.objects;
        res.status(200).send(context) 
    }

    getTasks = async (req, res) => {
        this.writeReq(req)

        const { project_id } = req.params

        const context = await this.projectGeneralCheck(req, project_id)
        // const { success, objects, permission } = context;
        // const start = new Date()
        // const { Project, decodedToken } = objects;

        // if (success) {
        //     const project = Project.getData({ formated: false })
        //     const tasks = Object.values(project.tasks)
        //     context.data = tasks.map( task => {
        //         return { 
        //             ...task, 
        //             history: Object.values(task.task_modified), 
        //             task_modified: [],
        //             members: Object.values(task.members)
        //         }
        //     })

        //     context.status = ""
        // }


        // const end = new Date()
        // console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)
    }

    updateTask = async (req, res, type = "infor") => {

        /* Privilege fix required but not now */
        this.writeReq(req)

        const { project_id, task_id } = req.body

        const context = await this.projectGeneralCheck(req, project_id)
        const { success, objects, permission } = context;
        const start = new Date()
        const { Project, decodedToken } = objects;

        if (success) {
            const project = Project.getData()
            const task = project.tasks[`${task_id}`]
            if (task != undefined) {
                const { create_by } = task
                if (permission == Controller.permission.mgr || this.isAdmin(decodedToken) || decodedToken.username == create_by.username) {                    
                    const newTask = { ...task, ...req.body }
                    let newModified = {}   
                    const inforFields = [ "task_name", "task_description", "task_priority", "start", "timeline", "end", "task_progress" ]                 
                    switch (type) {
                        case "infor":                            
                            newModified = await Project.makeModified( 
                                type, 
                                decodedToken, 
                                this.stringifyObject(task, inforFields),
                                this.stringifyObject(newTask, inforFields)
                            )  
                            
                            this.saveLog("info", req.ip, "__modifytaskinfor", `__projectname: ${ project.project_name }| __taskname ${ task.task_name } | __taskpriority: ${ task.task_priority } => ${ newTask.task_priority } |  __taskname ${ task.task_name } => ${ newTask.task_name } | __taskdescription: ${ task.task_description } => ${ newTask.task_description }`, decodedToken.username )
                            break;
                            
                        case "status":
                            newModified = await Project.makeModified( 
                                type, 
                                decodedToken, 
                                task.task_status, 
                                newTask.task_status
                            )   
                            const oldStatus = task.task_status;
                            this.saveLog("info", req.ip, "__modifytaskstatus", `__projectname: ${ project.project_name }| __taskname ${ task.task_name } | __taskstatus ${ Projects.getTaskStatusName(oldStatus) } => ${ Projects.getTaskStatusName(newTask.task_status) }`, decodedToken.username )
                            break;

                        case "approve":
                            newModified = await Project.makeModified( 
                                type, 
                                decodedToken, 
                                task.task_approve, 
                                newTask.task_approve                             
                            )   
                            this.saveLog("info", req.ip, "__taskapprove", `__projectname: ${ project.project_name }| __taskname ${ task.task_name } | ${ task.task_approve ? "__approved": "__unapproved" } => ${ newTask.task_approve ? "__approved": "__unapproved" }`, decodedToken.username)
                            break;                        
                        default:
                            newModified = await Project.makeModified( 
                                type, 
                                decodedToken, 
                                this.stringifyObject(task), 
                                this.stringifyObject(newTask) 
                            )   
                            break;
                    }
                    newTask.task_modified = { ...task.task_modified, ...newModified }
                    project.tasks[`${task_id}`] = newTask
                    Project.setData(project)
                    context.newTask = Project.getData()


                    await Project.save()
                    context.status = "0x4501133"
                } else {
                    context.content = "Khum có quyền thực hiện thao tác này"
                    context.status = "0x4501137"
                    context.success = false
                }
            } else {
                context.content = "Yêu cầu khum tồn tại"
                context.status = "0x4501137"
                context.success = false
            }
        }

        const end = new Date()
        console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)

    }

    removeTask = async (req, res) => {
        this.writeReq(req)

        const { project_id } = req.body

        const context = await this.projectGeneralCheck(req, project_id)
        const { success, objects, permission } = context;
        const start = new Date()
        const { Project, decodedToken } = objects;

        if (success) {
            if (permission == Controller.permission.mgr || this.isAdmin(decodedToken)) {
                const { task_id } = req.body
                const project = Project.getData()
                const { tasks } = project;
                const task = { ...tasks[`${task_id}`] }
                delete tasks[`${task_id}`]
                await Project.__modifyAndSaveChange__("tasks", tasks)

                context.content = "Xóa yêu cầu thành công"
                context.status = "0x4501161"
                context.success = true
                
                this.saveLog("info", req.ip, "__purgetask", `__taskname ${ task.task_name }`, decodedToken.username )
            } else {
                context.content = "Khum có quyền thực hiện thao tác này"
                context.status = "0x4501162"
                context.success = false
            }
        }

        const end = new Date()
        console.log(`PROCCESSING TIME: ${end - start}`)
        delete context.objects;
        res.status(200).send(context)
    }

    translateCriteriaToStatusIfAvailable = ( criteria ) => {
        const loweredCase = translateUnicodeToBlanText(criteria.toLowerCase());
        const translator = {
            "initialization":   1,
            "khoi tao":         1,  
            "implement":        2,
            "thuc hien":        2, 
            "deploy":           3,
            "trien khai":       3,    
            "complete":         4,
            "hoan thanh":       4,    
            "pause":            5,
            "tam dung":         5,  
        }
        return translator[loweredCase]
    }

    isProjectMatched = ( project, criteria ) => {
        const { project_id, project_name, project_code, project_status, project_description, project_type, proxy_server, create_at, manager, members, create_by } = project
        const corespondingStatusID = this.translateCriteriaToStatusIfAvailable( criteria ) 

        let valid = false;
        if( project_id && project_id.toString() == criteria ){
            valid = true;
        }
        if( project_name && project_name.includes(criteria) ){
            valid = true
        }
        if( project_code && project_code.includes( criteria ) ){
            valid = true
        }
        if( project_status && project_status.toString() == criteria || project_status == corespondingStatusID ){
            valid = true;
        }
        if( project_description && project_description.includes(criteria) ){
            valid = true;
        }

        if( project_type && project_type == criteria.toLowerCase() ){
            valid = true
        }
        if( proxy_server && proxy_server.includes( criteria ) ){
            valid = true;
        }
        if( create_at != undefined){
            const dateOfCreateAt = new Date( create_at )
            const dateOfCriteria = new Date( criteria )
            if( dateOfCreateAt == dateOfCriteria ){
                valid = true
            }
        }
        if( manager ){
            const { fullname, username } = manager;
            if( fullname && fullname.includes( criteria ) ){
                valid = true
            } 
            if( username && username.includes( criteria ) ){
                valid = true;
            }
        }

        if( create_by ){
            const { fullname, username } = create_by;
            if( fullname && fullname.includes( criteria ) ){
                valid = true
            } 
            if( username && username.includes( criteria ) ){
                valid = true;
            }
        }
        if( members ){
            const arraiedMembers = Object.values( members )
            for( let i = 0 ; i < arraiedMembers.length; i++ ){
                const { fullname, username } = arraiedMembers[i];
                if( fullname && fullname.includes( criteria ) ){
                    valid = true
                } 
                if( username && username.includes( criteria ) ){
                    valid = true;
                }
            }
        }
        return valid;
    }


    searchProjects = async (req, res) => {
        const ProjectsModel = new Projects()
        const { criteria } = req.body;
        const context = await this.generalCheck(req)
        const { success, objects } = context;
        if( success ){
            if( criteria ){
                const projects = await this.getAllProjectBuOnLyGeneralInfo()
                const matchedProjects = projects.filter( project => this.isProjectMatched( project, criteria ) )                
                res.send( { success: true, projects: matchedProjects } )
            }else{
                this.get(req, res);
            }
        }else{
            res.status(200).send(context)
        }
    }
}
module.exports = ProjectsController

