const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Accounts, AccountsRecord } = require('../models/Accounts');
const { translateUnicodeToBlanText } = require('../functions/auto_value');

class UIController extends Controller {

    constructor() {
        super();
    }

    generalCheck = async (req, version_id = 0) => {
        const verified = await this.verifyToken(req)
        const context = {
            success: false,
            status: "0x4501216",
            content: "Token khum hợp lệ"
        }
        if (verified) {
            const decodedToken = this.decodeToken(req.header("Authorization"))
            const ProjectsModel = new Projects()
            const query = {}
            query[`versions.${version_id}`] = { $ne: undefined }
            const project = await ProjectsModel.find(query, false)
            if (project) {
                const Project = new ProjectsRecord(project)
                context.success = true;
                context.content = "Thành công nhe mấy má"
                context.objects = {
                    Project,
                    user: decodedToken,
                    version: Project.getData().versions[`${version_id}`]
                }
            } else {
                context.content = "Dự án khum tồn tại"
                context.status = "0x4501213"
            }
        }
        return context
    }


    getUIs = async (req, res) => {
        const { version_id } = req.params;
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;

        if (success) {
            const { Project, version } = objects;
            const apis = Object.values(version.apis)

            const serializedApis = {}
            apis.map(api => {
                serializedApis[api.api_id] = api
            })

            const uis = Object.values(version.uis)
            const tables = Object.values(version.tables)
            let serializedFields = {}

            tables.map(table => {
                serializedFields = { ...serializedFields, ...table.fields }
            })

            uis.map(ui => {
                const components = Object.values(ui.components);

                components.map(cpn => {
                    const { api_get } = cpn;
                    if (api_get) {
                        const api_id = api_get.split('/')[2]
                        const api = serializedApis[api_id]

                        if (api) {
                            const { fields, calculates } = api;

                            cpn.fields = Object.values({ ...fields, ...calculates })
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

    getUI = async (req, res) => {
        const { version_id, ui_id } = req.params;
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;

        if (success) {
            const { Project, version } = objects;
            const uis = Object.values(version.uis)

            const ui = uis.find(u => u.ui_id.toString() == ui_id.toString())
            context.data = { ui }
        }

        delete context.objects
        res.status(200).send(context)
    }

    findUI = (version, URL) => {
        const uis = Object.values(version.uis)
        const targetUi = uis.find(ui => ui.url == URL)
        return targetUi ? targetUi : false;
    }

    fieldsAndKeysSeperator = (table) => {
        const { primary_key, fields } = table;
        const parsedFields = Object.values(fields)

        const primaryFields = parsedFields.filter(field => primary_key.indexOf(field.id) != -1)
        const normalFields = parsedFields.filter(field => primary_key.indexOf(field.id) == -1)

        return { keyFields: primaryFields, normalFields }
    }

    createUI = async (req, res) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)
        console.log(req.body.widget)
        const { success, objects } = context;

        if (success) {
            const { Project, version, user } = objects;
            const project = Project.getData()
            const bodyNullCheck = this.notNullCheck(req.body, ["ui", "widget"]);
            if (bodyNullCheck.valid) {
                const { ui, widget } = req.body;
                const uiNullCheck = this.notNullCheck(ui, ['title', 'status'])

                if (uiNullCheck.valid) {
                    const rawURL = translateUnicodeToBlanText(ui.title.toLowerCase());
                    const URL = `/` + rawURL.replaceAll(" ", '-');
                    const existedURL = this.findUI(version, URL)

                    if (!existedURL) {
                        const table = version.tables[`${widget.table_id}`]

                        if (table) {

                            const { keyFields, normalFields } = this.fieldsAndKeysSeperator(table)

                            if (keyFields.length > 0) {

                                if (normalFields.length != 0) {

                                    const fields = Object.values(table.fields)
                                    const apiPrefix = "HIDDEN GET API FOR UI "
                                    const apiDescription = "This api was automatically created for UI purpose, DO NOT manipulating this for any reason!"
                                    const GET = {
                                        api_name: "Hidden GET API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        body: [],
                                        params: [],
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "get",
                                        api_scope: "private"
                                    }
                                    const POST = {
                                        api_name: "Hidden POST API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"
                                    }
                                    const PUT = {
                                        api_name: "Hidden PUT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        body: normalFields.map(field => field.id),
                                        params: table.primary_key,
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "put",
                                        api_scope: "private"
                                    }
                                    const DELETE = {
                                        api_name: "Hidden DELETE API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        params: table.primary_key,
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: 'delete',
                                        api_scope: "private"
                                    }

                                    const SEARCH = {
                                        api_name: "Hidden SEARCH API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [table.id],
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    const EXPORT = {
                                        api_name: "Hidden EXPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: fields.map(field => field.id),
                                        fields: fields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [table.id],
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    const IMPORT = {
                                        api_name: "Hidden IMPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: fields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    const rawApis = [
                                        { type: "ui", api: GET },
                                        { type: "ui", api: POST },
                                        { type: "ui", api: PUT },
                                        { type: "ui", api: DELETE },
                                        { type: "search", api: SEARCH },
                                        { type: "export", api: EXPORT },
                                        { type: "import", api: IMPORT },
                                    ]
                                    /* ADD 6 APIS TO UI  */
                                    const APIS = []

                                    for (let i = 0; i < rawApis.length; i++) {
                                        APIS[i] = await Project.createUIAPI(rawApis[i])
                                    }

                                    widget.apis = APIS

                                    APIS.map(api => {
                                        version.apis[`${api.id}`] = api
                                    })

                                    const newUi = await Project.createUI(ui, widget, URL, user)
                                    version.uis[`${newUi.ui_id}`] = newUi

                                    Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)

                                    context.content = "Tạo UI thành công"
                                    context.status = "0x4501231"

                                    this.saveLog("info", req.ip, "__createUI", `__projectname: ${project.project_name} | __versionname ${version.version_name} | __uititle: ${newUi.title} __uiurl:  ${newUi.url}`, user.username)
                                } else {
                                    context.content = "Bảng không có trường nào khác ngoài khóa chính"
                                    context.status = "0x4501227"
                                }
                            } else {
                                context.content = "Bảng không có khóa chính"
                                context.status = "0x4501226"
                            }
                        } else {
                            context.content = "Bảng không tồn tại"
                            context.status = "0x4501228"
                        }
                    } else {
                        context.content = "URL này đã tồn tại"
                        context.status = "0x4501229"
                    }
                }
            }
        }

        delete context.objects;
        res.status(200).send(context)
    }

    createAPIandUI = async (req, res) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;

        if (success) {
            const { Project, version, user } = objects;
            const project = Project.getData()

            const nullCheck = this.notNullCheck(req.body, ["widget", "ui"])
            if (nullCheck.valid) {

                const { ui, widget } = req.body

                const rawURL = translateUnicodeToBlanText(ui.title.toLowerCase());
                const URL = `/` + rawURL.replaceAll(" ", '-');
                const existedURL = this.findUI(version, URL)

                if (!existedURL) {

                    const uiTables = widget.tables;
                    const uiFields = widget.fields;

                    const mainTable = uiTables[0]
                    const { tables } = version;

                    const table = tables[`${mainTable}`]

                    if (table) {

                        const atLeastOneSideTableDoesNotExist = uiTables.find(tb => tables[`${tb}`] == undefined)
                        if (!atLeastOneSideTableDoesNotExist) {

                            const { keyFields, normalFields } = this.fieldsAndKeysSeperator(table)

                            if (keyFields.length > 0) {

                                if (normalFields.length != 0) {
                                    const allFields = []
                                    widget.tables.map(_table_id => {
                                        const _table = tables[`${_table_id}`];
                                        allFields.push(...Object.values(_table.fields))
                                    })

                                    const displayFields = uiFields.map(_field_id => {
                                        return allFields.find(field => field.id == _field_id)
                                    }).filter(f => f != undefined)

                                    const mainTableFields = Object.values(table.fields)
                                    const apiPrefix = "HIDDEN GET API FOR UI "
                                    const apiDescription = "This api was automatically created for UI purpose, DO NOT manipulating this for any reason!"
                                    const GET = {
                                        api_name: "Hidden GET API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        fields: displayFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        body: [],
                                        params: [],
                                        tables: [...widget.tables],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "get",
                                        api_scope: "private"
                                    }


                                    const POST = {
                                        api_name: "Hidden POST API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: mainTableFields.map(field => field.id),
                                        fields: displayFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        params: [],
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"
                                    }
                                    const PUT = {
                                        api_name: "Hidden PUT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        fields: mainTableFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        body: normalFields.map(field => field.id),
                                        params: table.primary_key,
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "put",
                                        api_scope: "private"
                                    }
                                    const DELETE = {
                                        api_name: "Hidden DELETE API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        params: table.primary_key,
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: 'delete',
                                        api_scope: "private"
                                    }

                                    const SEARCH = {
                                        api_name: "Hidden SEARCH API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: mainTableFields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [...widget.tables],
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    const EXPORT = {
                                        api_name: "Hidden EXPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: mainTableFields.map(field => field.id),
                                        fields: mainTableFields.map(field => {
                                            return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                        }),
                                        params: [],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        tables: [table.id],
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    const IMPORT = {
                                        api_name: "Hidden IMPORT API for UI " + ui.title,
                                        status: true,
                                        description: apiDescription,
                                        body: mainTableFields.map(field => field.id),
                                        fields: [],
                                        params: [],
                                        tables: [table.id],
                                        calculates: widget.calculates,
                                        statistic: widget.statistic,
                                        api_method: "post",
                                        api_scope: "private"
                                    }

                                    // console.log(GET.statistic)
                                    const DETAIL = { ...PUT }
                                    DETAIL.fields = GET.fields
                                    DETAIL.api_name = "Hidden GET DETAIL API for UI " + ui.title
                                    DETAIL.api_method = "get"
                                    DETAIL.params = ui.params

                                    const rawApis = [
                                        { type: "api", api: GET },
                                        { type: "ui", api: POST },
                                        { type: "ui", api: PUT },
                                        { type: "ui", api: DELETE },
                                        { type: "search", api: SEARCH },
                                        { type: "export", api: EXPORT },
                                        { type: "import", api: IMPORT },
                                        { type: "d", api: DETAIL },
                                    ]
                                    /* ADD 6 APIS TO UI  */
                                    const APIS = []

                                    for (let i = 0; i < rawApis.length; i++) {
                                        APIS[i] = await Project.createUIAPI(rawApis[i])
                                    }

                                    widget.apis = APIS

                                    APIS.map(api => {
                                        version.apis[`${api.id}`] = api
                                    })

                                    const newUi = await Project.createUI(ui, widget, URL, user)
                                    version.uis[`${newUi.ui_id}`] = newUi

                                    Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)

                                    context.content = "Tạo UI thành công"
                                    context.status = "0x4501231"

                                    context.data = { ui }

                                    this.saveLog("info", req.ip, "__createUI", `__projectname: ${project.project_name} | __versionname ${version.version_name} | __uititle: ${newUi.title} __uiurl:  ${newUi.url}`, user.username)
                                } else {
                                    context.content = "Bảng không có trường nào khác ngoài khóa chính"
                                    context.status = "0x4501227"
                                }
                            } else {
                                context.content = "Bảng không có khóa chính"
                                context.status = "0x4501226"
                            }

                        } else {
                            console.log("At least one table does not exist")
                            context.content = "Ít nhất một bảng không tồn tại hoặc đã bị xóa"
                            context.status = "0x4501229"
                        }
                    } else {
                        // main tables does not exist
                        console.log("Main tables does not exist")
                        context.content = "Bảng chính không tồn tại hoặc đã bị xóa"
                        context.status = "0x4501228"
                    }

                } else {
                    // ui already existed
                    context.content = "UI này đã tồn tại"
                    context.status = "0x4501229"
                }

            } else {
                // request body khum hop le
                context.content = "Tham số không hợp lệ"
                context.status = "0x4501230"
            }
        }

        delete context.objects;
        res.status(200).send(context)
    }

    updateUIStatus = async (req, res) => {
        const { version_id, ui_id, status } = req.body;
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;

        if (success) {
            const { Project, version, user } = objects;
            const project = Project.getData()

            if (version.uis[`${ui_id}`]) {
                const ui = version.uis[`${ui_id}`]
                version.uis[`${ui_id}`].status = status;
                Project.__modifyAndSaveChange__(`versions.${version_id}`, version)

                context.status = "0x4501232"

                this.saveLog("info", req.ip, "__updateUIstatus", `__projectname: ${project.project_name} | __versionname ${version.version_name} | __uititle: ${ui.title} __uiurl: ${ui.url} | __uistatus: ${ui.status} => ${status}`, user.username)
            } else {
                context.status = "0x4501233"
            }
        }

        delete context.objects
        res.status(200).send(context)
    }

    removeUI = async (req, res) => {
        const { version_id, ui_id } = req.body
        this.writeReq(req);
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;
        if (success) {
            const { Project, version, user } = objects;
            const project = Project.getData()
            const ui = { ...version.uis[`${ui_id}`] }

            delete version.uis[`${ui_id}`]
            const toBeRemovedAPIs = []

            const components = Object.values(ui.components);
            for (let i = 0; i < components.length; i++) {
                const cpn = components[i];
                const keys = Object.keys(cpn).filter(key => key.includes("api_"))

                for (let j = 0; j < keys.length; j++) {
                    toBeRemovedAPIs.push(cpn[keys[j]])
                }
            }

            const apis = { ...version.apis };
            const arraizedAPIs = Object.values(apis)

            const corespondingAPIS = arraizedAPIs.filter(api => toBeRemovedAPIs.indexOf(api.url) != -1)
            for (let i = 0; i < corespondingAPIS.length; i++) {
                delete apis[`${corespondingAPIS[i].id}`]
            }

            version.apis = apis;

            Project.__modifyAndSaveChange__(`versions.${version_id}`, version)

            this.saveLog("info", req.ip, "__removeUI", `__projectname: ${project.project_name} | __versionname ${version.version_name} | __uititle: ${ui.title} __uiurl: ${ui.url}`, user.username)
        }
        context.status = "0x4501234"

        delete context.objects
        res.status(200).send(context)
    }

    createAPIView = async (req, res) => {
        this.writeReq(req)
        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;

        if (success) {
            const { Project, version, user } = objects;
            const project = Project.getData()

            const bodyNullCheck = this.notNullCheck(req.body, ["ui", "widget"]);
            if (bodyNullCheck.valid) {
                const { ui, widget } = req.body;
                const uiNullCheck = this.notNullCheck(ui, ['title', 'status'])

                if (uiNullCheck.valid) {
                    const rawURL = translateUnicodeToBlanText(ui.title.toLowerCase());
                    const URL = `/` + rawURL.replaceAll(" ", '-');
                    const existedURL = this.findUI(version, URL)

                    if (!existedURL) {

                        const { api_id, layout_id } = widget;
                        const apis = Object.values(version.apis)
                        const api = apis.find(a => a.api_id == api_id)

                        if (api.api_method == "get") {
                            const view = await Project.createAPIView(ui.title, layout_id, api, URL, user)
                            version.uis[`${view.ui_id}`] = view
                            Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)
                            context.content = "Tạo UI thành công"
                            context.status = "0x4501231"
                        } else {
                            context.content = "Chỉ API GET mới được dùng để tạo View"
                            context.status = "0x4501229"
                        }
                    } else {
                        context.content = "URL này đã tồn tại"
                        context.status = "0x4501229"
                    }
                }
            }
        }
        delete context.objects
        res.send(context)
    }



    flatteningComponents = (components) => {
        const cpns = []
        for (let i = 0; i < components.length; i++) {
            const { children } = components[i]
            cpns.push({ ...components[i] })
            if (children) {
                cpns.push(...this.flatteningComponents(children))
            }
        }
        return cpns
    }


    updateChildComponent = (components, target_id, values) => {

        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]
            const { id, children } = cpn;
            if (id == target_id) {
                components[i].props = { ...components[i].props, ...values }
            } else {
                if (children) {
                    components[i].children = this.updateChildComponent(components[i].children, target_id, values)
                }
            }
        }
        return components
    }

    createApiSetOnTable = (table, version) => {
        const { props } = table
        const { source, name, buttons } = props;

        const { tables } = version
        const mainTableId = source.tables[0].id
        const mainTable = tables[`${mainTableId}`]
        const mainTableFields = Object.values(mainTable.fields)


        const GET = {
            api_name: "GET API for table " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            fields: source.fields.map(field => {
                return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
            }),
            body: [],
            params: [],
            tables: source.tables.map(tb => tb.id),
            calculates: source.calculates,
            statistic: [],
            api_method: "get",
            api_scope: "private"
        }



        const bodyId = mainTableFields.map(f => f.id)
        const POST = {
            api_name: "POST API for table " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            fields: source.fields.map(field => {
                return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
            }),
            body: bodyId,
            params: [],
            tables: [source.tables[0].id],
            calculates: source.calculates,
            statistic: [],
            api_method: "post",
            api_scope: "private"
        }

        const { primary_key } = source.tables[0]

        const params = source.fields.filter(f => primary_key.indexOf(f.id) != -1)
        const paramsId = params.map(p => p.id)
        const normalFields = source.fields.filter(f => paramsId.indexOf(f.id) == -1)
        
        const fieldsWithoutParams = bodyId.filter( field => paramsId.indexOf( field ) == -1 )

        const PUT = {
            api_name: "PUT API for table " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            fields: source.fields.map(field => {
                return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
            }),
            body: fieldsWithoutParams,
            params: paramsId,
            tables: [source.tables[0].id],
            calculates: source.calculates,
            statistic: [],
            api_method: "put",
            api_scope: "private"
        }

        const DELETE = {
            api_name: "DELETE API for table " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            fields: source.fields.map(field => {
                return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
            }),
            body: normalFields.map(f => f.id),
            params: paramsId,
            tables: [source.tables[0].id],
            calculates: source.calculates,
            statistic: [],
            api_method: "delete",
            api_scope: "private"
        }

        const SEARCH = {
            api_name: "SEARCH API for UI " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            body: source.fields.map(field => field.id),
            fields: [],
            params: [],
            calculates: source.calculates,
            statistic: [],
            tables: [source.tables[0].id],
            api_method: "post",
            api_scope: "private"
        }

        const EXPORT = {
            api_name: "EXPORT API for UI " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            body: [],
            fields: [],
            params: [],
            calculates: source.calculates,
            statistic: [],
            tables: [source.tables[0].id],
            api_method: "post",
            api_scope: "private"
        }

        const IMPORT = {
            api_name: "IMPORT API for UI " + name,
            status: true,
            description: "Hidden API for UI only, do not modify for any reason",
            body: bodyId,
            fields: [],
            params: [],
            tables: [source.tables[0].id],
            calculates: source.calculates,
            statistic: [],
            api_method: "post",
            api_scope: "private"
        }

        const DETAIL = { ...PUT }
        DETAIL.fields = GET.fields
        DETAIL.api_name = "GET DETAIL API for UI " + name
        DETAIL.api_method = "get"


        const rawApis = [
            { name: "GET", type: "api", api: GET },
            { name: "POST", type: "ui", api: POST },
            { name: "PUT", type: "ui", api: PUT },
            { name: "DELETE", type: "ui", api: DELETE },
            { name: "SEARCH", type: "search", api: SEARCH },
            { name: "EXPORT", type: "export", api: EXPORT },
            { name: "IMPORT", type: "import", api: IMPORT },
            { name: "DETAIL", type: "d", api: DETAIL },
        ]


        if (buttons.approve.state) {

            const approveTable = source.tables.find(tb => tb.id == buttons.approve.field.table_id)
            if( approveTable ){

                const APPROVE = {
                    api_name: "APPROVE API for table " + name,
                    status: true,
                    description: "Hidden API for UI only, do not modify for any reason",
                    fields: source.fields.map(field => {
                        return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                    }),
                    body: [buttons.approve.field],
                    params: paramsId,
                    tables: [approveTable.id],
                    calculates: [],
                    statistic: [],
                    api_method: "put",
                    api_scope: "private"
                }
    
                rawApis.push({ name: "APPROVE", type: "ui", api: APPROVE })
            }
        }

        if (buttons.unapprove.state) {

            const unapproveTable = source.tables.find(tb => tb.id == buttons.unapprove.field.table_id)
            if( unapproveTable ){

                const UNAPPROVE = {
                    api_name: "UNAPPROVE API for table " + name,
                    status: true,
                    description: "Hidden API for UI only, do not modify for any reason",
                    fields: source.fields.map(field => {
                        return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                    }),
                    body: [buttons.unapprove.field],
                    params: paramsId,
                    tables: [unapproveTable.id],
                    calculates: [],
                    statistic: [],
                    api_method: "put",
                    api_scope: "private"
                }
    
                rawApis.push({ name: "UNAPPROVE", type: "ui", api: UNAPPROVE })
            }
        }
        return rawApis;
    }

    mapApiToUIRecursive = (pages, target_id, page) => {
        for (let i = 0; i < pages.length; i++) {
            const { page_id, children } = pages[i]
            if (page_id == target_id) {
                pages[i] = { ...pages[i], ...page, children }
                delete pages[i].page
            } else {
                if (children) {
                    pages[i].children = this.mapApiToUIRecursive(pages[i].children, target_id, page)
                }
            }
        }
        return pages
    }


    saveUI = async (req, res) => {
        const { version_id } = req.body;
        let ui = req.body.ui;


        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context;


        if (success) {
            const { Project, user } = objects;
            
            const flattenPages = this.flatteningComponents(ui)

            for (let i = 0; i < flattenPages.length; i++) {
                const page = flattenPages[i]
                const flattenComponents = this.flatteningComponents(page.component)

                for (let j = 0; j < flattenComponents.length; j++) {
                    const cpn = flattenComponents[j]
                    const { name, props } = cpn;
                    const currentProjectData = Project.getData()
                    const version = currentProjectData.versions[`${ version_id }`]

                    // console.log("\nBefore", Object.values(version.apis).length)

                    if (name == "table" && props && props.source.tables.length > 0 ) {
                        const apiSet = this.createApiSetOnTable(cpn, version)
                        const APIS = {}                        

                        for (let k = 0; k < apiSet.length; k++) {
                            APIS[apiSet[k].name] = await Project.createUIAPI(apiSet[k])
                        }
                        delete version.apis[`${props?.source?.get?.id}`]; delete version.apis[`${props?.source?.search?.id}`]; delete version.apis[`${props?.buttons?.add?.api?.id}`]; delete version.apis[`${props?.buttons?.import?.api?.id}`]; delete version.apis[`${props?.buttons?.export?.api?.id}`]; delete version.apis[`${props?.buttons?.update?.api?.id}`]; delete version.apis[`${props?.buttons?.delete?.api?.id}`]; delete version.apis[`${props?.buttons?.detail?.api?.id}`]; delete version.apis[`${props?.buttons?.approve?.api?.id}`]; delete version.apis[`${props?.buttons?.unapprove?.api?.id}`]

                        // console.log( `${props?.source?.get?.id}`,
                        // `${props?.source?.search?.id}`,
                        // `${props?.buttons?.add?.api?.id}`,
                        // `${props?.buttons?.import?.api?.id}`,
                        // `${props?.buttons?.export?.api?.id}`,
                        // `${props?.buttons?.update?.api?.id}`,
                        // `${props?.buttons?.delete?.api?.id}`,
                        // `${props?.buttons?.detail?.api?.id}`,
                        // `${props?.buttons?.approve?.api?.id}`,
                        // `${props?.buttons?.unapprove?.api?.id}`, )

                        /**
                         * Con bug qq mãi k fix đc nên thôi dẹp mẹ luôn đi
                         */

                        props.source.get = APIS["GET"]
                        props.source.search = { ...props.source.search, ...APIS["SEARCH"] }

                        props.buttons.add.api = APIS["POST"]
                        props.buttons.import.api = APIS["IMPORT"]
                        props.buttons.export.api = APIS["EXPORT"]

                        props.buttons.update.api = APIS["PUT"]
                        props.buttons.delete.api = APIS["DELETE"]
                        props.buttons.detail.api = APIS["DETAIL"]

                        props.buttons.approve.api = APIS["APPROVE"]
                        props.buttons.unapprove.api = APIS["UNAPPROVE"]

                        page.component = this.updateChildComponent(page.component, cpn.id, props)

                        const serializedApis = Object.values(APIS)

                        serializedApis.map(api => {
                            version.apis[`${api.id}`] = api
                        })      
                        
                        

                        // console.log("Afetre", Object.values(version.apis).length)

                        const data = Project.getData()
                        data.versions[`${ version_id }`] = version
                        Project.setData( data )
                        // console.log(Object.keys(data.versions[`${version_id}`].apis))                        
                        await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)                        
                    }

                    if (name == "table_param" && props && props.source.tables.length > 0 ) {
                        const { params } = props
                        const apiSet = this.createApiSetOnTable( cpn, version, params )
                        const APIS = {}                        

                        for (let k = 0; k < apiSet.length; k++) {
                            APIS[apiSet[k].name] = await Project.createUIAPI(apiSet[k])
                        }
                        delete version.apis[`${props?.source?.get?.id}`]; delete version.apis[`${props?.source?.search?.id}`]; delete version.apis[`${props?.buttons?.add?.api?.id}`]; delete version.apis[`${props?.buttons?.import?.api?.id}`]; delete version.apis[`${props?.buttons?.export?.api?.id}`]; delete version.apis[`${props?.buttons?.update?.api?.id}`]; delete version.apis[`${props?.buttons?.delete?.api?.id}`]; delete version.apis[`${props?.buttons?.detail?.api?.id}`]; delete version.apis[`${props?.buttons?.approve?.api?.id}`]; delete version.apis[`${props?.buttons?.unapprove?.api?.id}`]

                        // console.log( `${props?.source?.get?.id}`,
                        // `${props?.source?.search?.id}`,
                        // `${props?.buttons?.add?.api?.id}`,
                        // `${props?.buttons?.import?.api?.id}`,
                        // `${props?.buttons?.export?.api?.id}`,
                        // `${props?.buttons?.update?.api?.id}`,
                        // `${props?.buttons?.delete?.api?.id}`,
                        // `${props?.buttons?.detail?.api?.id}`,
                        // `${props?.buttons?.approve?.api?.id}`,
                        // `${props?.buttons?.unapprove?.api?.id}`, )

                        /**
                         * Con bug qq mãi k fix đc nên thôi dẹp mẹ luôn đi
                         */

                        props.source.get = APIS["GET"]
                        props.source.search = { ...props.source.search, ...APIS["SEARCH"] }

                        props.buttons.add.api = APIS["POST"]
                        props.buttons.import.api = APIS["IMPORT"]
                        props.buttons.export.api = APIS["EXPORT"]

                        props.buttons.update.api = APIS["PUT"]
                        props.buttons.delete.api = APIS["DELETE"]
                        props.buttons.detail.api = APIS["DETAIL"]

                        props.buttons.approve.api = APIS["APPROVE"]
                        props.buttons.unapprove.api = APIS["UNAPPROVE"]

                        page.component = this.updateChildComponent(page.component, cpn.id, props)

                        const serializedApis = Object.values(APIS)

                        serializedApis.map(api => {
                            version.apis[`${api.id}`] = api
                        })      
                        
                        

                        // console.log("Afetre", Object.values(version.apis).length)

                        const data = Project.getData()
                        data.versions[`${ version_id }`] = version
                        Project.setData( data )
                        // console.log(Object.keys(data.versions[`${version_id}`].apis))                        
                        await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)                        
                    }

                    if (name == "form") {
                        const {  id, props } = cpn
                        const { table, fields } = props;                        

                        let valid = true;

                        if( table && fields ){
                            for (let i = 0; i < fields.length; i++) {
                                const { table_id } = fields[i]
                                if (table_id != table.id) {
                                    valid = false;
                                }
                            }
                        }else{                            
                            valid = false
                        }

                        if (valid) {
                            const FORM_API = {
                                api_name: "POST API for FORM ",
                                status: true,
                                description: "Hidden API for UI only, do not modify for any reason",
                                fields: fields.map(field => {
                                    return { id: field.id, fomular_alias: field.fomular_alias, display_name: field.field_name }
                                }),
                                body: fields.map( f => f.id ),
                                params: [],
                                tables: [ table.id ],
                                calculates: [],
                                statistic: [],
                                api_method: "post",
                                api_scope: "private"
                            }
                            
                            const api = await Project.createAPI( FORM_API )
                            version.apis[`${ api.api_id }`] = api 
                            /** CONTINUE TO CREATE API */
                            await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)               


                            props.api = api;
                            page.component = this.updateChildComponent( page.component, cpn.id, props )
                        }
                    }

                    if( name == "chart_1" ){
                        const { tables, field, fomular, criterias, fields, group_by } = props
                        
                        const STATIS_API = {
                            api_name: "STATIS API for " + cpn.name,
                            status: true,
                            description: "Hidden API for UI only, do not modify for any reason",
                            fields: [],
                            field,                            
                            body: [],
                            params: [],
                            tables: tables.map( table => table.id ),
                            fomular,
                            group_by,
                            criterias,
                            calculates: [],
                            statistic: [],
                            api_method: "post",
                            api_scope: "private"
                        }


                        
                        const apiObject = { api: STATIS_API, type: "statis" }

                        const api = await Project.createUIAPI(apiObject)
                        // console.log(api)

                        version.apis[`${ api.id }`] = api 
                        await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)      
                        
                        props.api = api 
                        page.component = this.updateChildComponent( page.component, cpn.id, props )
                    }

                    if( name == "c_chart" ){
                        const { tables, field, fomular, criterias, fields, group_by } = props
                        
                        const STATIS_API = {
                            api_name: "CRITERIA STATIS API for " + cpn.name,
                            status: true,
                            description: "Hidden API for UI only, do not modify for any reason",
                            fields: [],
                            field,                            
                            body: [],
                            params: [],
                            tables: tables.map( table => table.id ),
                            fomular,
                            group_by,
                            criterias,
                            calculates: [],
                            statistic: [],
                            api_method: "post",
                            api_scope: "private"
                        }
                        

                        
                        const apiObject = { api: STATIS_API, type: "statis" }

                        const api = await Project.createUIAPI(apiObject)
                        // console.log(api)

                        version.apis[`${ api.id }`] = api 
                        await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)      
                        
                        props.api = api 
                        page.component = this.updateChildComponent( page.component, cpn.id, props )
                    }

                    if( name == "table_export_button" ){
                        const { slave, fields } = props 


                        const EXPORT_API = {
                            api_name: "Export API for " + cpn.name,
                            status: true,
                            description: "Hidden API for UI only, do not modify for any reason",
                            fields: [],                            
                            body: [],
                            params: [],
                            tables: [ slave.id ],                            
                            
                            calculates: [],
                            statistic: [],
                            api_method: "post",
                            api_scope: "private"
                        }

                        const PREVIEW_API = {
                            api_name: "PREVIEW DATA API for UI " + name,
                            status: true,
                            description: "Hidden API for UI only, do not modify for any reason",
                            body: fields.map( field => field.id ),
                            fields: [],
                            params: [],
                            calculates: [],
                            statistic: [],
                            tables: [slave.id],
                            api_method: "post",
                            api_scope: "private"
                        }

                        const apiObject = { api: EXPORT_API, type: "export" }
                        const apiSearchObject = { api: PREVIEW_API, type: "search" }

                        const api = await Project.createUIAPI(apiObject)
                        const searchApi = await Project.createUIAPI(apiSearchObject)

                        version.apis[`${ api.id }`] = api 
                        version.apis[`${ searchApi.id }`] = searchApi 
                        await Project.__modifyAndSaveChange__(`versions.${version.version_id}`, version)      
                        
                        props.api = api 
                        props.preview_api = searchApi
                        page.component = this.updateChildComponent( page.component, cpn.id, props )
                    }

                }
                flattenPages[i] = page
                ui = this.mapApiToUIRecursive(ui, page.page_id, page)
            }

            const UI = {
                pages: ui,
                last_modified_by: user,
                last_modified_at: new Date()
            }

            await Project.__modifyAndSaveChange__(`versions.${version_id}.ui`, UI)
        }
        context.ui = ui
        delete context.objects
        res.send(context)
    }

    getSavedUI = async (req, res) => {
        const { version_id } = req.params;
        const context = await this.generalCheck(req, version_id)
        const { success, objects } = context;

        if (success) {
            const { version } = objects;
            const { ui } = version
            context.data = { ui }
        }
        delete context.objects
        res.send(context)
    }

}
module.exports = UIController

