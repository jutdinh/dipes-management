const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { intValidate } = require('../functions/validator');


class Tasks extends Controller {
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
                if (project) {
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

    statisticTask = async (req, res) => {
        /**
         * Request Headers {
         *      Authorization: <Token>
         * }
         * Request Params {
         *      project_id <Int>
         * }
         *
         */

        this.writeReq(req)
        const { project_id } = req.params
        
        const context =  await this.projectGeneralCheck( req, project_id )
        const { success, objects } = context;
        if( success){

            const { Project } = objects;
            const project = Project.getData()
            const periods = Object.values(project.tasks);
            const primaltasks = []

            periods.map( period => {
                primaltasks.push( ...Object.values(period.tasks) )
            })
            const total = primaltasks.length;
            const statis = {
                completed: {
                    percentage: 0,
                    amount: 0
                },
                inProgress: {
                    percentage: 0,
                    amount: 0
                },
                expired: {
                    percentage: 0,
                    amount: 0
                }
            }
            if( total > 0 ){
                const today = new Date()
                let tasks = primaltasks
                const completed = tasks.filter( task => task.task_approve == true )
                statis.completed.amount = completed.length;
                statis.completed.percentage = Math.ceil( completed.length * 100 / total )

                tasks = tasks.filter( task => completed.indexOf( task ) == - 1 )

                const expired = tasks.filter( task => {
                    const { end } = task

                    const eDate = new Date( end )

                    return eDate - today <= 0
                })
                statis.expired.amount = expired.length;
                statis.expired.percentage = Math.ceil( expired.length * 100 / total )


                const inProgress = tasks.filter( task => expired.indexOf( task ) == - 1 )

                statis.inProgress.amount = inProgress.length;
                statis.inProgress.percentage = Math.ceil( inProgress.length * 100 / total )
            }

            context.statistic = statis
            context.tasks = primaltasks
        }
        delete context.objects;
        res.status(200).send( context )
    }

}
module.exports = Tasks

    