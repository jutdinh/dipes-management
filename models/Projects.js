const { log } = require('../functions/loggers')
const { Database } = require('../config/models/database');
const { v4: uuidv4 } = require('uuid');

const { Model } = require('../config/models');
const Crypto = require('../controllers/Crypto');

class Projects extends Model {

    static validStatus = [1, 2, 3, 4, 5];
    static validTaskStatus = [1, 2, 3, 4]
    static validTypes = [
        "INT", "INT UNSIGNED",
        "BIGINT", "BIGINT UNSIGNED",
        "BOOL",
        "DECIMAL", "DECIMAL UNSIGNED",
        "DATE", "DATETIME",
        "TEXT", "CHAR",
        "EMAIL", "PHONE"
    ]

    static validPrimaryTypes = [
        "INT", "INT UNSIGNED",
        "BIGINT", "BIGINT UNSIGNED",
        "TEXT",
        "EMAIL", "PHONE"
    ]

    static intFamily = [
        "INT", "INT UNSIGNED",
        "BIGINT", "BIGINT UNSIGNED"
    ]


    static validator = {
        header: `========MYLAN-ACTIVATION-KEY========`,
        bodyLength: 10,
        footer: `==============END-KEY===============`,
        uuid_format: [8, 4, 4, 4, 12]
    }

    constructor() {
        super("projects");

        const start = new Date()
        this.__addProperty__("project_id", Model.types.int, { auto: true })
        this.__addProperty__("project_name", Model.types.string, { required: true })
        this.__addProperty__("project_code", Model.types.string)
        this.__addProperty__("project_status", Model.types.enum, { values: Projects.validStatus })
        this.__addProperty__("project_description", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.__addProperty__("project_type", Model.types.enum, { values: ["database", "api"] })
        this.__addProperty__("proxy_server", Model.types.string, { default: "http://127.0.0.1" })
        this.__addProperty__("create_at", Model.types.datetime, { format: "DD-MM-YYYY lúc hh:mm" });

        this.__addProperty__("active_version", Model.types.string, { default: "v1" })

        this.__addProperty__("manager", Model.types.json)
        this.manager.__addProperty__("username", Model.types.string, { required: true })
        this.manager.__addProperty__("fullname", Model.types.string)
        this.manager.__addProperty__("avatar", Model.types.string)

        this.__addProperty__("members", Model.types.model)
        this.members.__addProperty__("username", Model.types.string)
        this.members.__addProperty__("fullname", Model.types.string)
        this.members.__addProperty__("avatar", Model.types.string)
        this.members.__addProperty__("permission", Model.types.enum, { required: true, values: ["manager", "supervisor", "deployer"] })

        this.__addProperty__("create_by", Model.types.json);
        this.create_by.__addProperty__("username", Model.types.string, { required: true })
        this.create_by.__addProperty__("fullname", Model.types.string)

        this.__addProperty__("versions", Model.types.model)
        this.versions.__addProperty__("version_id", Model.types.int, { auto: true })
        this.versions.__addProperty__("version_name", Model.types.string)
        this.versions.__addProperty__("create_by", Model.types.json)
        this.versions.create_by.__addProperty__("username", Model.types.string, { required: true })
        this.versions.create_by.__addProperty__("fullname", Model.types.string)

        this.versions.__addProperty__("tables", Model.types.model)
        this.versions.tables.__addProperty__("id", Model.types.int)
        this.versions.tables.__addProperty__("table_alias", Model.types.string)
        this.versions.tables.__addProperty__("table_name", Model.types.string)
        this.versions.tables.__addProperty__("primary_key", Model.types.array)
        this.versions.tables.__addProperty__("foreign_keys", Model.types.model)
        this.versions.tables.foreign_keys.__addProperty__("field_id", Model.types.int)
        this.versions.tables.foreign_keys.__addProperty__("table_id", Model.types.int)
        this.versions.tables.foreign_keys.__addProperty__("ref_field_id", Model.types.int)
        this.versions.tables.foreign_keys.__addProperty__("cascade", Model.types.bool, { default: false })

        this.versions.tables.__addProperty__("create_at", Model.types.datetime, { default: new Date(), })
        this.versions.tables.__addProperty__("create_by", Model.types.json)

        this.versions.tables.create_by.__addProperty__("username", Model.types.string, { required: true })
        this.versions.tables.create_by.__addProperty__("fullname", Model.types.string)



        this.versions.tables.__addProperty__("fields", Model.types.model)
        this.versions.tables.fields.__addProperty__("id", Model.types.int, { required: true })
        this.versions.tables.fields.__addProperty__("field_name", Model.types.string, { required: true })
        this.versions.tables.fields.__addProperty__("fomular_alias", Model.types.string, { required: true })

        this.versions.tables.fields.__addProperty__("create_by", Model.types.json);
        this.versions.tables.fields.create_by.__addProperty__("username", Model.types.string)
        this.versions.tables.fields.create_by.__addProperty__("fullname", Model.types.string)

        this.versions.tables.fields.__addProperty__("create_at", Model.types.datetime, { default: new Date() });


        this.versions.tables.fields.__addProperty__("props", Model.types.json)

        this.versions.tables.fields.props.__addProperty__("DATATYPE", Model.types.enum, { required: true, values: Projects.validTypes })
        this.versions.tables.fields.props.__addProperty__("NULL", Model.types.bool, { default: false })
        this.versions.tables.fields.props.__addProperty__("LENGTH", Model.types.int, { default: Number.MAX_SAFE_INTEGER })
        this.versions.tables.fields.props.__addProperty__("AUTO_INCREMENT", Model.types.bool, { default: false })
        this.versions.tables.fields.props.__addProperty__("MIN", Model.types.number)
        this.versions.tables.fields.props.__addProperty__("MAX", Model.types.number)
        this.versions.tables.fields.props.__addProperty__("FORMAT", Model.types.string)
        this.versions.tables.fields.props.__addProperty__("PATTERN", Model.types.string)
        this.versions.tables.fields.props.__addProperty__("DECIMAL_PLACE", Model.types.int)
        this.versions.tables.fields.props.__addProperty__("DEFAULT", Model.types.string)
        this.versions.tables.fields.props.__addProperty__("DEFAULT_TRUE", Model.types.string, { default: "TRUE" })
        this.versions.tables.fields.props.__addProperty__("DEFAULT_FALSE", Model.types.string, { default: "FALSE" })


        this.versions.__addProperty__("apis", Model.types.model)
        this.versions.apis.__addProperty__("id", Model.types.int, { auto: true })
        this.versions.apis.__addProperty__("api_id", Model.types.string)
        this.versions.apis.__addProperty__("api_name", Model.types.string)
        this.versions.apis.__addProperty__("status", Model.types.bool, { default: true })
        this.versions.apis.__addProperty__("description", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.versions.apis.__addProperty__("url", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.versions.apis.__addProperty__("remote_url", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.versions.apis.__addProperty__("api_method", Model.types.enum, { values: ["get", "post", "put", "delete"] })
        this.versions.apis.__addProperty__("api_scope", Model.types.enum, { values: ["private", "public"] })
        this.versions.apis.__addProperty__("create_at", Model.types.datetime, { default: new Date() })
        this.versions.apis.__addProperty__("create_by", Model.types.json)

        this.versions.apis.create_by.__addProperty__("username", Model.types.string)
        this.versions.apis.create_by.__addProperty__("fullname", Model.types.string)

        this.versions.apis.__addProperty__("tables", Model.types.array)
        this.versions.apis.__addProperty__("params", Model.types.array)
        this.versions.apis.__addProperty__("body", Model.types.array)
        this.versions.apis.__addProperty__("external_body", Model.types.array, { default: [] })

        this.versions.apis.__addProperty__("fields", Model.types.model)
        this.versions.apis.fields.__addProperty__("id", Model.types.int)
        this.versions.apis.fields.__addProperty__("display_name", Model.types.string)
        this.versions.apis.fields.__addProperty__("fomular_alias", Model.types.string)

        this.versions.apis.__addProperty__("calculates", Model.types.model)
        this.versions.apis.calculates.__addProperty__("display_name", Model.types.string)
        this.versions.apis.calculates.__addProperty__("fomular_alias", Model.types.string)
        this.versions.apis.calculates.__addProperty__("fomular", Model.types.string)

        this.versions.apis.__addProperty__("statistic", Model.types.model)
        this.versions.apis.statistic.__addProperty__("display_name", Model.types.string)
        this.versions.apis.statistic.__addProperty__("fomular_alias", Model.types.string)
        this.versions.apis.statistic.__addProperty__("field", Model.types.string)
        this.versions.apis.statistic.__addProperty__("group_by", Model.types.array)
        this.versions.apis.statistic.__addProperty__("fomular", Model.types.enum, { values: ["SUM", "AVERAGE", "COUNT"] })


        this.versions.__addProperty__("uis", Model.types.model)
        this.versions.uis.__addProperty__("ui_id", Model.types.int, { auto: true })
        this.versions.uis.__addProperty__("title", Model.types.string, { required: true })
        this.versions.uis.__addProperty__("url", Model.types.string, { required: true })
        this.versions.uis.__addProperty__("status", Model.types.bool, { default: true })
        this.versions.uis.__addProperty__("params", Model.types.array)
        this.versions.uis.__addProperty__("type", Model.types.string, { default: "ui" })
        this.versions.uis.__addProperty__("create_at", Model.types.datetime);

        this.versions.uis.__addProperty__("create_by", Model.types.json);
        this.versions.uis.create_by.__addProperty__("username", Model.types.string)
        this.versions.uis.create_by.__addProperty__("fullname", Model.types.string)

        this.versions.uis.__addProperty__("components", Model.types.model)
        this.versions.uis.components.__addProperty__("component_id", Model.types.int, { auto: true })
        this.versions.uis.components.__addProperty__("component_name", Model.types.string, { required: true })
        this.versions.uis.components.__addProperty__("layout_id", Model.types.int)
        this.versions.uis.components.__addProperty__("table_id", Model.types.int)
        this.versions.uis.components.__addProperty__("api_get", Model.types.string)
        this.versions.uis.components.__addProperty__("api_post", Model.types.string)
        this.versions.uis.components.__addProperty__("api_put", Model.types.string)
        this.versions.uis.components.__addProperty__("api_delete", Model.types.string)
        this.versions.uis.components.__addProperty__("api_search", Model.types.string)
        this.versions.uis.components.__addProperty__("api_export", Model.types.string)
        this.versions.uis.components.__addProperty__("api_import", Model.types.string)
        this.versions.uis.components.__addProperty__("api_detail", Model.types.string)

        /* TASK & TASK MODIFIES */

        this.__addProperty__("tasks", Model.types.model)
        this.tasks.__addProperty__("period_id", Model.types.int, { auto: true })
        this.tasks.__addProperty__("period_name", Model.types.string, { default: "Giai đoạn mới", maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.__addProperty__("period_description", Model.types.string, { default: "Giai đoạn mới", maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.__addProperty__("start", Model.types.datetime)
        this.tasks.__addProperty__("end", Model.types.datetime)
        this.tasks.__addProperty__("progress", Model.types.number, { default: 0 })

        this.tasks.__addProperty__("period_members", Model.types.model)
        this.tasks.period_members.__addProperty__("username", Model.types.string)
        this.tasks.period_members.__addProperty__("fullname", Model.types.string)
        this.tasks.period_members.__addProperty__("avatar", Model.types.string)

        this.tasks.__addProperty__("tasks", Model.types.model)
        this.tasks.tasks.__addProperty__("task_id", Model.types.int, { auto: true })
        this.tasks.tasks.__addProperty__("task_name", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.tasks.__addProperty__("task_description", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.tasks.__addProperty__("task_status", Model.types.enum, { values: Projects.validTaskStatus, default: 1 })
        this.tasks.tasks.__addProperty__("task_priority", Model.types.int, { default: 1 })
        this.tasks.tasks.__addProperty__("task_approve", Model.types.bool, { default: false })
        this.tasks.tasks.__addProperty__("start", Model.types.datetime)
        this.tasks.tasks.__addProperty__("timeline", Model.types.datetime)
        this.tasks.tasks.__addProperty__("end", Model.types.datetime)
        this.tasks.tasks.__addProperty__("progress", Model.types.number, { default: 0 })

        this.tasks.tasks.__addProperty__("child_tasks", Model.types.model)
        this.tasks.tasks.child_tasks.__addProperty__("child_task_id", Model.types.int, { auto: true })
        this.tasks.tasks.child_tasks.__addProperty__("child_task_name", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.tasks.child_tasks.__addProperty__("child_task_description", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.tasks.child_tasks.__addProperty__("child_task_status", Model.types.enum, { values: Projects.validTaskStatus, default: 1 })
        this.tasks.tasks.child_tasks.__addProperty__("approve", Model.types.bool, { default: false })
        this.tasks.tasks.child_tasks.__addProperty__("priority", Model.types.int, { default: 1 })
        this.tasks.tasks.child_tasks.__addProperty__("start", Model.types.datetime)
        this.tasks.tasks.child_tasks.__addProperty__("timeline", Model.types.datetime)
        this.tasks.tasks.child_tasks.__addProperty__("end", Model.types.datetime)
        this.tasks.tasks.child_tasks.__addProperty__("progress", Model.types.number, { default: 0 })

        this.tasks.tasks.child_tasks.__addProperty__("members", Model.types.model)
        this.tasks.tasks.child_tasks.members.__addProperty__("username", Model.types.string)
        this.tasks.tasks.child_tasks.members.__addProperty__("fullname", Model.types.string)
        this.tasks.tasks.child_tasks.members.__addProperty__("avatar", Model.types.string)

        this.tasks.tasks.child_tasks.__addProperty__("create_by", Model.types.json);
        this.tasks.tasks.child_tasks.create_by.__addProperty__("username", Model.types.string, { required: true })
        this.tasks.tasks.child_tasks.create_by.__addProperty__("fullname", Model.types.string)
        this.tasks.tasks.child_tasks.__addProperty__("create_at", Model.types.datetime, { default: new Date() })

        this.tasks.tasks.__addProperty__("members", Model.types.model)
        this.tasks.tasks.members.__addProperty__("username", Model.types.string)
        this.tasks.tasks.members.__addProperty__("fullname", Model.types.string)
        this.tasks.tasks.members.__addProperty__("avatar", Model.types.string)

        this.tasks.tasks.__addProperty__("task_modified", Model.types.model)

        this.tasks.tasks.task_modified.__addProperty__("id", Model.types.int, { auto: true })
        this.tasks.tasks.task_modified.__addProperty__("modified_by", Model.types.json)
        this.tasks.tasks.task_modified.modified_by.__addProperty__("username", Model.types.string, { required: true })
        this.tasks.tasks.task_modified.modified_by.__addProperty__("fullname", Model.types.string)
        this.tasks.tasks.task_modified.modified_by.__addProperty__("avatar", Model.types.string)

        this.tasks.tasks.task_modified.__addProperty__("modified_at", Model.types.datetime, { format: "DD-MM-YYYY lúc hh:mm" })
        this.tasks.tasks.task_modified.__addProperty__("modified_what", Model.types.enum, { values: ["infor", "status", "approve", "other"] })
        this.tasks.tasks.task_modified.__addProperty__("old_value", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })
        this.tasks.tasks.task_modified.__addProperty__("new_value", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER })

        this.tasks.tasks.__addProperty__("create_by", Model.types.json);
        this.tasks.tasks.create_by.__addProperty__("username", Model.types.string, { required: true })
        this.tasks.tasks.create_by.__addProperty__("fullname", Model.types.string)
        this.tasks.tasks.__addProperty__("create_at", Model.types.datetime, { default: new Date() })



        this.__addProperty__("activation", Model.types.model)
        this.activation.__addProperty__("ACTIVATION_KEY", Model.types.string, { required: true, maxLength: 512 })
        this.activation.__addProperty__("MAC_ADDRESS", Model.types.string)
        this.activation.__addProperty__("ACTIVATE_AT", Model.types.datetime, { default: new Date() })


        this.__addPrimaryKey__(["id"])
        this.__addIndexing__("project_id")

        this.__traversal__()
    }


    static generateProjectLine = (project_id) => {
        const Cipher = new Crypto()
        const encryptedProjectId = Cipher.encrypt(project_id.toString())
        const { uuid_format } = Projects.validator

        const sumSlice = (arr, destination) => {
            let sum = 0;
            for (let i = 0; i < destination; i++) {
                sum += arr[i]
            }
            return sum
        }

        const splitted = uuid_format.map((length, index) => {
            const previous = uuid_format[index - 1]
            if (previous != undefined) {
                const current = encryptedProjectId.slice(sumSlice(uuid_format, index), length + sumSlice(uuid_format, index))
                return current;
            } else {
                return encryptedProjectId.slice(0, length)
            }
        })

        return splitted.join('-')
    }


    static generateActivationKey = (targetKey, project_id = 0) => {
        const head = `========MYLAN-ACTIVATION-KEY========\n`
        let body = `${targetKey}\n`;
        body += `${Projects.generateProjectLine(project_id)}\n`
        // console.log(body)
        for (let i = 0; i < 8; i++) {
            const uniString = uuidv4();
            const row = uniString.toUpperCase()
            body += `${row}\n`
        }
        const tail = `==============END-KEY===============`
        return head + body + tail
    }

    static getTaskStatusName = (statusValue) => {
        const validTaskStatus = Projects.validTaskStatus;
        const corespondingName = {}
        validTaskStatus.map(status => {
            corespondingName[`${status}`] = `__status_of_${status}`
        })

        return corespondingName[`${statusValue}`]
    }
}
class ProjectsRecord extends Projects {
    constructor(data) {
        super();
        this.setDefaultValue(data)
    }

    get = () => {

    }

    calculateProjectProgress = () => {
        const project = this.getData()
        const { tasks } = project

        const periods = Object.values(tasks)

        periods.map(period => {
            period.tasks = Object.values(period.tasks)
            period.period_members = Object.values(period.period_members)
            let period_progress = 0
            period.tasks.map(task => {
                task.members = Object.values(task.members)
                task.child_tasks = Object.values(task.child_tasks)
                let task_progress = 0
                task.child_tasks.map(c_task => {
                    c_task.members = Object.values(c_task.members)
                    task_progress += c_task.progress
                })
                if (task.child_tasks.length > 0) {
                    const calculated = task_progress / task.child_tasks.length
                    task.progress = parseFloat(calculated.toFixed(2))

                    period_progress += calculated
                } else {
                    period_progress += task.progress ? task.progress : 0
                }
                task.task_modified = Object.values(task.task_modified)
            })

            if (period.tasks.length > 0) {
                const period_calculated = period_progress / period.tasks.length
                period.progress = parseFloat(period_calculated.toFixed(2))
            } else {
                period.progress = 0
            }
        })

        let sumerizedProgress = 0
        for( let i = 0 ; i < periods.length; i++ ){
            sumerizedProgress += periods[i].progress
        }
        
        if( periods.length == 0 ){
            return 0
        }else{
            const progress = sumerizedProgress  / periods.length
            return parseFloat( progress.toFixed(2) )
        }
    }

    getProjectAndManager = () => {

        const project = this.getData()
        const members = Object.values(project.members)
        const versions = Object.values(project.versions)
        project.members = members
        const currentVersion = project.versions[project.active_version] ? project.versions[project.active_version] : {}
        project.version = currentVersion
        project.versions = versions        
        
        project.progress = this.calculateProjectProgress()

        delete project.tasks;

        delete project.versions;
        return project
    }

    getFullProjectData = () => {
        const project = this.getData()
        const members = Object.values(project.members)
        const versions = Object.values(project.versions)
        project.members = members
        const currentVersion = project.versions[project.active_version] ? project.versions[project.active_version] : {}
        project.version = currentVersion
        project.versions = versions
        
        project.progress = this.calculateProjectProgress()
        return project
    }

    getGeneralData = () => {
        const project = this.getData();
        const {
            project_id,
            project_name,
            project_code,
            project_status,
            project_description,
            project_type,
            proxy_server,
            create_at
        } = project;
        return {
            project_id, project_name, project_code, project_status, project_description, project_type, proxy_server, create_at
        }
    }

    matchSearch = (criteria) => {
        console.log(criteria)
        console.log(this.getPaths())
    }

    setUpdateInfor = (newProject) => {
        const { project_name, project_code, project_status, project_description, proxy_server, project_type, manager } = newProject
        this.__modifyChildren__("project_name", project_name)
        this.__modifyChildren__("project_code", project_code)
        this.__modifyChildren__("project_status", project_status)
        this.__modifyChildren__("project_description", project_description)
        this.__modifyChildren__("proxy_server", proxy_server)
        this.__modifyChildren__("project_type", project_type)
        this.__modifyChildren__("manager", manager)
    }

    createMember = (users, username, role) => {
        const filtedUser = users.find(u => this.__dotDecode__(u.username) == username);
        if (filtedUser != undefined) {
            const { username, fullname, avatar } = filtedUser
            return { username, fullname, avatar, permission: role }
        }
        return undefined
    }

    updateMembers = (newMembers) => {
        const data = this.getData()
        const formatMembers = {}
        newMembers.map(member => {
            const { username } = member
            if (formatMembers[username] == undefined) {
                formatMembers[username] = member
            }
        })
        data.members = formatMembers
        this.setData(data)
    }

    resetMembers = async () => {
        await this.__modifyAndSaveChange__("members", {})
    }

    createVersion = async (owner) => {
        const data = this.getData()
        const model = this.getModel()
        const id = await model.__getNewId__()
        const version = {}
        version[`${id}`] = { version_id: id, version_name: "v0.0.0.1", create_by: owner }
        data.versions = { ...data.versions, ...version }
        this.setData(data)
    }

    createPeriod = async (period) => {
        const data = this.getData()
        const model = this.getModel()
        const id = await model.__getNewId__()
        period.period_id = id;

        const { tasks } = data;
        data.tasks = { ...tasks, [`${id}`]: period }
        this.setData(data)
    }

    addTask = async (period_id, task) => {
        const data = this.getData()
        const model = this.getModel()
        const id = await model.__getNewId__()
        task.task_id = id;
        task.task_progress = 0
        const serializedData = {}
        serializedData[`${id}`] = task;

        const { tasks } = data;
        const period = tasks[`${period_id}`]

        if (period) {
            if (!period.tasks) {
                period.tasks = {}
            }
            period.tasks[`${id}`] = task
            tasks[`${period_id}`] = period

            data.tasks = tasks
            this.setData(data)
        }
        return task
    }

    addChildTask = async (period_id, task_id, childTask) => {
        const data = this.getData()
        const model = this.getModel()
        const id = await model.__getNewId__()
        childTask.child_task_id = id;

        data.tasks[`${period_id}`].tasks[`${task_id}`].child_tasks[`${id}`] = childTask
        this.setData(data)
        return childTask
    }

    makeModified = async (modified_what, modified_by, old_value, new_value, modified_at = new Date()) => {
        const model = this.getModel()
        const id = await model.__getNewId__()
        const serializedData = {}
        serializedData[`${id}`] = {
            id,
            modified_what,
            modified_at,
            modified_by,
            old_value,
            new_value
        }
        return serializedData
    }

    makeAlias = async (primalName = "TÊN MỚI NÈ", format = "") => {
        const splittedName = primalName.split(" ")
        const firstChars = splittedName.map(word => {
            if (word && word[0]) {
                return word[0]
            }
            return ""
        })
        const stringifiedFirstChars = firstChars.join("").toUpperCase()
        const autoIncreID = await Database.getAutoIncrementId(stringifiedFirstChars)
        const ID = autoIncreID.toString()
        const concatID = ID + stringifiedFirstChars
        return format.slice(0, format.length - concatID.length) + concatID
    }

    createTable = async (table, creator) => {
        const { table_name } = table;
        const model = this.getModel()

        const table_id = await model.__getNewId__()
        const table_alias = await this.makeAlias(table_name)
        const newTable = {}
        newTable[`${table_id}`] = {
            id: table_id,
            table_name,
            primary_key: [],
            table_alias,
            create_by: creator,
        }
        return newTable
    }

    createField = async (field, creator) => {
        const { field_name } = field
        const model = this.getModel()
        const field_id = await model.__getNewId__()
        const field_alias = await this.makeAlias(field_name, "")
        const newField = {}
        newField[`${field_id}`] = {
            ...field,
            id: field_id,
            fomular_alias: field_alias,
            create_by: creator
        }
        return newField
    }

    formatRawFieldToFormedState = (rawField) => {
        const {
            field_name,
            DATATYPE,
            NULL, LENGTH,
            MIN, MAX,
            AUTO_INCREMENT,
            FORMAT, PATTERN, DECIMAL_PLACE,
            DEFAULT, DEFAULT_TRUE, DEFAULT_FALSE
        } = rawField;

        const field = {
            field_name,
            props: {
                DATATYPE,
                NULL, LENGTH,
                MIN, MAX,
                AUTO_INCREMENT,
                FORMAT, PATTERN, DECIMAL_PLACE,
                DEFAULT, DEFAULT_TRUE, DEFAULT_FALSE
            }
        }
        return field
    }


    createFields = async (fields, creator) => {
        const serializedFields = []
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].id == undefined) {
                const serializedField = await this.createField(this.formatRawFieldToFormedState(fields[i]), creator)
                serializedFields.push(serializedField)
            }
        }
        return serializedFields
    }

    makeApiID = () => {
        const uniString = uuidv4();
        return uniString.toUpperCase().replaceAll("-", "")
    }

    createAPI = async (api = {}, creator = {}) => {
        const model = this.getModel()
        const id = await model.__getNewId__()
        const api_id = this.makeApiID()



        const serializedApi = {
            ...api,
            url: `/api/${api_id}`,
            remote_url: `/api/${api_id}`,
            create_by: creator,
            id,
            api_id
        }
        return serializedApi
    }

    createUIAPI = async (apiObject = {}, creator = {}) => {

        const { type, api } = apiObject

        const model = this.getModel()
        const id = await model.__getNewId__()
        const api_id = this.makeApiID()



        const serializedApi = {
            ...api,
            url: `/${type}/${api_id}`,
            remote_url: `/${type}/${api_id}`,
            create_by: creator,
            id,
            api_id
        }
        return serializedApi
    }

    createUI = async (ui, widget, url, create_by) => {
        const model = this.getModel()
        const ui_id = await model.__getNewId__()
        const component_id = await model.__getNewId__()

        const components = {}
        const { table_id, layout_id, apis } = widget;

        components[`${component_id}`] = {
            component_id,
            component_name: ui.title,
            layout_id,
            table_id,
            api_get: apis[0]?.url,
            api_post: apis[1]?.url,
            api_put: apis[2]?.url,
            api_delete: apis[3]?.url,

            api_search: apis[4]?.url,
            api_export: apis[5]?.url,
            api_import: apis[6]?.url,
            api_detail: apis[7]?.url,
        }

        return {
            ui_id,
            title: ui.title,
            url,
            type: "ui",
            status: true,
            params: ui.params ? ui.params : [],
            create_at: new Date(),
            create_by,
            components
        }
    }
    createAPIView = async (title, layout_id, api, url, create_by) => {
        const model = this.getModel()
        const ui_id = await model.__getNewId__()
        const component_id = await model.__getNewId__()

        const components = {}

        components[`${component_id}`] = {
            component_id,
            component_name: api.title,
            layout_id,
            api_get: api.url
        }

        return {
            ui_id,
            title: title,
            url,
            type: "apiview",
            status: true,
            params: [],
            create_at: new Date(),
            create_by,
            components
        }
    }
}
module.exports = { Projects, ProjectsRecord }
