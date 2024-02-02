const { intValidate, floatValidate } = require('../functions/validator');
const { Controller } = require('../config/controllers');
const { Projects, ProjectsRecord } = require("../models/Projects");
const { Database } = require('../config/models/database');
class PreImportTable extends Controller {
    constructor() {
        super();
    }

    generalCheck = async (req, version_id = 0) => {
        const verified = await this.verifyToken(req)
        const context = {
            success: false,
            status: "0x4501190",
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
                context.status = "0x4501186"
            }
        }
        return context
    }

    parseType = (field, value) => {

        /**
         * @desc Ép kiểu dữ liệu từ dữ liệu thô thành dữ liệu tương ứng của nó với cấu hình của trường
         * 
         * @params [
         *      field <Object> => Xem models.fields
         *      value <Any>
         * ]
         * 
         * @detail
         * 
         * (1)      Với kiểu dữ liệu thuộc dòng kiểu nguyên [ INT, INT UNSIGNED, BIGINT, BIGINT UNSIGNED ]
         * 
         * (1.1)    Với số nguyên và dữ liệu không tự động tăng ( !AUTO_INC ) 
         *          Xác thực kiểu dữ liệu là số nguyên hợp lệ và ép sang kiểu nguyên.
         *              a. Với số nguyên hợp lệ
         *                  - Nếu giá trị của số nguyên vừa được ép nằm trong giới hạn MIN - MAX thì kể như hợp lệ
         *              và trả về { valid: true,  result: parseInt( value ) }
         *                  - Nếu không, trả về { valid: false, reason: "Giá trị không thuộc giới hạn cho phép" }
         *              b. Với số nguyên không hợp lệ, trả về { valid: false, reason: "Dữ liệu của trường số nguyên & NO_AUTO phải là kiểu int" }
         * 
         * (1.2)    Với số nguyên và dữ liệu tự động tăng  
         *              a. Nếu giá trị là một số nguyên hợp lệ => { valid: true, result: parseInt(value) };              
         *              b. Nếu không => return { valid: true, result: value };
         *              @note Trường hợp này có thể xãy ra lỗi
         * 
         * 
         * 
         * 
         * (2)      Với kiểu dữ liệu thuộc dòng số thực [ DECIMAL, DECIMAL UNSIGNED ]
         *          Kiểm tra tính hợp lệ của dữ liệu.
         * 
         * (2.1)    Nếu dữ liệu hợp lệ 
         *              - Và trong giới hạn MIN - MAX => { valid: true, result: parseFloat(fixedValue) }
         *              - Nếu không => { valid: false, reason: "Giá trị không thuộc giới hạn cho phép" }
         * (2.2)    Nếu không => { valid: false, reason: "Dữ liệu của trường số thực phải là một số thực" }
         * 
         * 
         * 
         * 
         * 
         * (3)      Với dữ liệu thuộc dòng Boolean, dử dụng typeof để xác định kiểu và trả về kết quả
         * 
         * 
         * 
         * (4)      Với dữ liệu thuộc dòng thời gian [ Date, Datetime ]
         *          Tạo một thực thể kiểu Date() bằng giá trị của value, 
         *              - Nếu kết quả trả về là NaN => { valid: false, reason: "Ngày giờ không hợp lệ" }
         *              - Nếu không => { valid: true, result: date }
         * 
         * 
         * (5)      Với dữ liệu kiểu TEXT
         *          Ép dữ liệu sang dạng chuỗi và đo độ dài, 
         *              - Nếu độ dài trong khoảng cho phép => { valid: true, result: value.toString() }
         *              - Nếu không => { valid: false, reason: "Chuỗi có độ dài lớn hơn giới hạn cho phép" }
         * 
         * 
         * (6)      Với kiểu CHAR 
         *          Tương tự TEXT, tuy nhiên giới hạn độ dài của kiểu CHAR luôn là 1
         * 
         * 
         * (7)      Với dữ liệu thuộc nhóm PHONE || EMAIL => luôn trả về { valid: true, result: value }
         * 
         * 
         * (8)      Nếu không tìm thấy kiểu dữ liệu => { valid: false }
         * 
         * 
         * 
         */


        const type = field.DATATYPE

        if (value !== undefined && value !== "") {
            const { MAX, MIN } = field;
            switch (type) {
        /*(1)*/ case "INT":
                case "INT UNSIGNED":
                case "BIGINT":
                case "BIGINT UNSIGNED":
                    const { AUTO_INCREMENT } = field;
        /*(1.1)*/    if (!AUTO_INCREMENT) {
                        const validateInt = intValidate(value);
                        if (validateInt) {
                            const intValue = parseInt(value)
                            if (intValue >= MIN && intValue <= MAX) {
                                return { valid: true, result: intValue };
                            } else {
                                return { valid: false, reason: "Giá trị không thuộc giới hạn cho phép" };
                            }
                        } else {
                            return { valid: false, reason: "Dữ liệu của trường số nguyên & NO_AUTO phải là kiểu int" }
                        }
                        /*(1.2)*/
                    } else {
                        // if (intValidate(value)) {
                        //     return { valid: true, result: parseInt(value) };
                        // } else {
                        //     return { valid: true, result: value };
                        // }
                        return { valid: true, result: value };
                    }
        /*(2)*/ case "DECIMAL":
                case "DECIMAL UNSIGNED":
                    const validateDouble = floatValidate(value);
        /*(2.1)*/   if (validateDouble) {
                        const { DECIMAL_PLACE } = field;
                        const floatNumber = parseFloat(value)

                        const fixedValue = floatNumber.toFixed(DECIMAL_PLACE ? DECIMAL_PLACE : 0)
                        if (floatNumber >= parseFloat(MIN) && floatNumber <= parseFloat(MAX)) {
                            return { valid: true, result: parseFloat(fixedValue) }
                        } else {
                            return { valid: false, reason: "Giá trị khum nằm trong giới hạn cho phép" }
                        }

                        /*(2.2)*/
                    } else {
                        return { valid: false, reason: "Dữ liệu của trường số thực phải là một số thực" }
                    }
        /*(3)*/ case "BOOL":
                    const typeBool = typeof (value);
                    if (typeBool == 'boolean') {
                        return { valid: true, result: value }
                    }
                    else {
                        return { valid: false, reason: "Dữ liệu của trường BOOL phải là giá trị trong ENUM [ true, false ]" }
                    }
        /*(4)*/ case "DATE":
                case "DATETIME":
                    const date = new Date(value);
                    if (!isNaN(date)) {
                        return { valid: true, result: date }
                    } else {
                        return { valid: false, reason: "Ngày giờ hông hợp lệ" }
                    }
        /*(5)*/ case "TEXT":
                    const stringifiedValue = value ? value.toString() : "";
                    const { LENGTH } = field;
                    if (LENGTH && LENGTH > 0 && stringifiedValue.length <= LENGTH) {
                        return { valid: true, result: stringifiedValue }
                    } else {
                        return { valid: false, reason: "Chuỗi có độ dài lớn hơn giới hạn cho phép" }
                    }
        /*(6)*/ case "CHAR":
                    const charifiedValue = value.toString()
                    if (charifiedValue.length == 1) {
                        return { valid: true, result: charifiedValue }
                    } return { valid: false, reason: "Kiểu char yêu cầu dữ liệu với độ dài bằng 1" }
        /*(7)*/ case "PHONE":
                case "EMAIL":
                    return { valid: true, result: value }
        /*(8)*/ default:
                    return { valid: false }
            }
        } else {
            const { NULL } = field;
            if (NULL) {
                return { valid: true, result: null }
            } else {
                return { valid: false, reason: "Dữ liệu rỗng" }
            }
        }
    }


    makeAutoIncreament = async (table_alias, pattern, distance = 0) => {
        // // console.log(table_alias)
        const auto_id = await Database.getAutoIncrementId(`${table_alias}-id`)
        const number = auto_id + distance
        let result = pattern
        if (!pattern) {
            result = "[N]"
        }
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        result = result.replaceAll("[DD]", date);
        result = result.replaceAll("[MM]", month);
        result = result.replaceAll("[YYYY]", year);
        const numberPlaces = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i] === '[') {
                var temp = ""
                for (let j = i + 1; j < result.length; j++) {
                    if (result[j] === 'N' && result[j] !== ']') {
                        temp += result[j];
                    } else {
                        if (result[j] === ']') {
                            numberPlaces.push(temp);
                            i = j;
                            temp = ""
                        }
                    }
                }
            }
        }

        if (numberPlaces.length == 0) {
            result += "[N]"
            numberPlaces.push("N")
        }
        const places = numberPlaces.map(place => {
            const placeLength = place.length;
            let numberLength = number.toString().length;
            let header = "";
            for (let i = 0; i < placeLength; i++) {
                header += "0";
            }
            const result = header.slice(0, placeLength - numberLength) + number.toString();
            return { place, value: result };
        })
        for (let i = 0; i < places.length; i++) {
            const { place, value } = places[i];
            result = result.replace(`[${place}]`, value)
        }
        return result;
    }

    get = async (req, res) => {


        /**
         * 
         * HEADER: {
         *      Authorization: <Token>
         * }
         * 
         * PARAMS: {
         *      version_id: <INT>,
         *      table_id: <Int>,         
         * }
         * 
         */

        this.writeReq(req)

        const { version_id } = req.params
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context

        if (success) {

            const { version } = objects;
            const { table_id } = req.params;
            const table = version.tables[`${table_id}`]

            if (table) {
                const { table_alias } = table;
                const data = await Database.selectAllWithProjection(table_alias, {}, { _id: 0, id: 0 })
                context.content = "Successfully retrieve data"
                context.data = data
                context.fields = Object.values(table.fields)
            } else {
                context.content = "Table does not exist"
            }
        }

        delete context.objects
        res.status(200).send(context)
    }

    post = async (req, res) => {

        /**
         * 
         * HEADER: {
         *      Authorization: <Token>
         * }
         * 
         * BODY: {
         *      version_id: <Int>,
         *      table_id: <Int>,
         *      data: <Dynamic JSON>
         * }
         * 
         * 
         * 
         */
        this.writeReq(req)


        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context

        if (success) {
            context.success = false
            const { Project, user, version } = objects
            const project = Project.getData();

            const { table_id, data } = req.body;

            const table = version.tables[`${table_id}`]

            if (table && table.pre_import) {
                const fields = Object.values(table.fields)

                const clone = {}
                let typeErrors = []

                for (let i = 0; i < fields.length; i++) {
                    const { fomular_alias, props, field_name } = fields[i]

                    const { AUTO_INCREMENT, DATATYPE, PATTERN } = props;

                    if (Projects.intFamily.indexOf(DATATYPE) != -1 && AUTO_INCREMENT) {
                        clone[fomular_alias] = await this.makeAutoIncreament(table.table_alias, PATTERN)
                    } else {
                        const { valid, result, reason } = this.parseType({ ...fields[i], ...props }, data[fomular_alias])
                        if (valid) {
                            clone[fomular_alias] = result;
                        } else {
                            typeErrors.push({ field_name, value: clone[fomular_alias], reason })
                        }
                    }
                }

                if (typeErrors.length > 0) {
                    context.content = "Datatype error"
                    context.errors = typeErrors
                } else {

                    const { primary_key } = table;

                    const primary_field = table.fields[`${primary_key[0]}`]

                    const key = { [primary_field.fomular_alias]: clone[primary_field.fomular_alias] }
                    const dataExisted = await Database.selectAll(table.table_alias, key)

                    if (dataExisted.length > 0) {
                        context.content = "Primary key conflicts"
                    } else {
                        Database.insert(table.table_alias, clone)
                        context.content = "Successfully added new record"
                        context.data = clone
                        context.success = true
                    }
                }
            } else {
                if (!table) {
                    context.content = "Table does not exist!"
                } else {
                    context.content = "Cannot insert data on non-pre-import table"
                }
            }
        }

        delete context.objects
        res.status(200).send(context)

    }


    put = async () => {
      /**
       * HEADER: {
       *      Authorization: <Token>
       * }
       * 
       * BODY: {
       *      version_id: <Int>,
       *      table_id: <Int>,
       *      data: <Dynamic JSON>
       * }
       * 
       */

        this.writeReq(req)


        const { version_id } = req.body
        const context = await this.generalCheck(req, version_id)

        const { success, objects } = context

        if( success ){
            context.success = false
            const { Project, user, version } = objects
            const project = Project.getData();

            const { table_id, data } = req.body;

            const table = version.tables[`${table_id}`]

            if (table && table.pre_import) {
                const fields = Object.values(table.fields)

                const clone = {}
                let typeErrors = []

                // filter trường trừ khóa rồi nhét dữ liệu vào clone xong cập nhật

                

                for (let i = 0; i < fields.length; i++) {
                    const { fomular_alias, props, field_name } = fields[i]

                    const { AUTO_INCREMENT, DATATYPE, PATTERN } = props;

                    if (Projects.intFamily.indexOf(DATATYPE) != -1 && AUTO_INCREMENT) {
                        clone[fomular_alias] = await this.makeAutoIncreament(table.table_alias, PATTERN)
                    } else {
                        const { valid, result, reason } = this.parseType({ ...fields[i], ...props }, data[fomular_alias])
                        if (valid) {
                            clone[fomular_alias] = result;
                        } else {
                            typeErrors.push({ field_name, value: clone[fomular_alias], reason })
                        }
                    }
                }
               
            } else {
                if (!table) {
                    context.content = "Table does not exist!"
                } else {
                    context.content = "Cannot insert data on non-pre-import table"
                }
            }
        }
        delete context.objects
        res.status(200).send(context)
    }

    delete = async () => {

    }
}
module.exports = PreImportTable

