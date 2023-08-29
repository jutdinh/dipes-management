const { Controller } = require('../config/controllers');
const { Apis, ApisRecord } = require('../models/Apis');
const { Fields } = require('../models/Fields');
const { Tables } = require('../models/Tables');
const  Model  = require('../config/models/model');
const { intValidate, floatValidate } = require('../functions/validator');
const { removeDuplicate } = require('../functions/modulars');

class ConsumeApi extends Controller {
    #__apis = new Apis();
    #__tables = new Tables();
    #__fields = new Fields();

    constructor(){
        super();
        this.url = ""
        this.req = undefined
        this.res = undefined
        this.API = undefined
    }

    consume = async ( req, res, api_id ) => {
        this.writeReq(req)
        const { url, method } = req;
        this.url = url;

        const api = await this.#__apis.find({ api_id })
        if( api && api.api_method == method.toLowerCase() && api.status ){           
            const Api = new ApisRecord( api )
            this.API = Api;
            this.req = req;
            this.res = res;

            switch( api.api_method ){
                case "get":
                    await this.GET()
                    break; 
                
                case "post":
                    await this.POST()
                    break;
                case "put":
                    await this.PUT()
                    break;
                case "delete":
                    await this.DELETE()
                    break;
                default:
                    this.res.status(200).send("Not found nè")
                    break;
                    
            }
        }else{
            res.status(404).send("Not found")
        }
    }

    tearTablesAndFieldsToObjects = async () => {

        /**
         * This method queries ALL tables from API and tears them to seperated objects with the structure below:
         * {
         *     id: 27,
         *     table_alias: '785C0C9C5B5243108C5CFBD9ACFFE13F',
         *     table_name: 'NHÂN ZIÊN',
         *     version_id: 11,
         *     primary_key: [ 77 ],
         *     foreign_keys: [],
         *     create_by: 'ad1',
         *     create_at: 2023-06-19T02:25:10.394Z,
         *     fields: [],
         *     body: [],
         *     params: []
            },
         * 
         * 
         */

        const tableIds  = this.API.tables.value()
        const rawFields = this.API.fields.valueOrNot()        
        const fieldIds  = rawFields.map( field => field.id )
        const bodyIds   = this.API.body.valueOrNot()
        const paramIds  = this.API.params.valueOrNot()

        const tables        = await this.#__tables.findAll({ id: { $in: tableIds } })
        const fields        = await this.#__fields.findAll({ id: { $in: fieldIds } })
        const bodyFields    = await this.#__fields.findAll({ id: { $in: bodyIds } })
        const paramFields   = await this.#__fields.findAll({ id: { $in: paramIds } })

        const objects = tables.map( table => {
            const fieldsBelongToThisTable = fields.filter( field => field.table_id == table.id )
            const paramsBelongToThisTable = paramFields.filter( field => field.table_id == table.id )
            const bodyBeLongToThisTable   = bodyFields.filter( field => field.table_id == table.id )
            return { 
                ...table, 
                fields: fieldsBelongToThisTable,
                body: bodyBeLongToThisTable,
                params: paramsBelongToThisTable 
            }
        })
        return objects
    }

    getFieldsByTableId = async ( tableId ) => {
        const fields = await this.#__fields.findAll({ table_id: tableId })
        return fields;
    } 

    getFields = async ( fieldIds ) => {
        const fields = await this.#__fields.findAll({ id: { $in: fieldIds } })
        return fields ? fields : [];
    }

    getField = async ( fieldId ) => {
        const field = await this.#__fields.find({ id: fieldId })
        return field;
    }

    getTable = async ( tableId ) => {
        const table = await this.#__tables.find({ id: tableId })
        return table;
    }

    parseType = (field, value) => {
        const type = field.DATATYPE        
        /**
         * This method parses data to its valid type and return an object with the structures below:
         * 
         * In case of success: { valid: true  , result: <CorrespondingValueAfterParsing> }
         * In case of failure: { valid: false , reason: <String> }
         */
        if( value !== undefined ){
            const { MAX, MIN } = field;
            switch( type ){
                case "INT":
                case "INT UNSIGNED":
                case "BIGINT":
                case "BIGINT UNSIGNED":
                    const { AUTO_INCREMENT } = field;
                    if( !AUTO_INCREMENT ){
                        const validateInt = intValidate( value );
                        if( validateInt ){
                            const intValue = parseInt( value )
                            if( intValue >= MIN && intValue <= MAX ){
                                return {  valid: true, result: intValue };
                            }else{
                                return {  valid: false, reason: "Giá chị khum nằm chong zới hẹn cho phép" };
                            }
                        }else{
                            return { valid: false, reason: "Dữ liệu của trường số nguyên & NO_AUTO phải là kiểu int" }
                        }
                    }else{
                        if(intValidate(value)){
                            return {  valid: true, result: parseInt(value) };
                        }else{
                            return {  valid: true, result: value };
                        }                        
                    }
                case "DECIMAL":
                case "DECIMAL UNSIGNED":
                    const validateDouble = floatValidate(value );
                    if( validateDouble ){
                        const { DECIMAL_PLACE } = field;
                        const floatNumber = parseFloat( value )
                        
                        const fixedValue = floatNumber.toFixed(DECIMAL_PLACE ? DECIMAL_PLACE : 0)
                        if( floatNumber >= parseFloat(MIN) && floatNumber <= parseFloat(MAX) ){
                            return { valid: true, result: parseFloat( fixedValue ) }
                        }else{
                            return { valid: false, reason: "Giá trị khum nằm trong giới hạn cho phép" }
                        }
                        
                    }else{
                        return { valid: false, reason: "Dữ liệu của trường số thực phải là một số thực" }
                    }
                case "BOOL":
                    const typeBool = typeof(value);
                    if( typeBool == 'boolean' ){
                        return { valid: true, result: value }
                    }
                    else{
                        return { valid: false, reason: "Dữ liệu của trường BOOL phải là giá trị trong ENUM [ true, false ]" }
                    }
                case "DATE":
                case "DATETIME":
                    const date = new Date(value);
                    if( !isNaN( date ) ){
                        return { valid: true, result: date }
                    }else{
                        return { valid: false, reason: "Ngày giờ khum hợp lệ" }
                    }
                case "TEXT":
                    const stringifiedValue = value.toString();
                    const { LENGTH } = field;
                    if( LENGTH && LENGTH > 0 && stringifiedValue.length <= LENGTH){
                        return { valid: true, result: stringifiedValue }    
                    }else{
                        return { valid: false, reason: "Dài quá dài z rồi ai chơi má" }    
                    }
                case "CHAR":
                    const charifiedValue = value.toString()
                    if( charifiedValue.length == 1 ){
                        return { valid: true, result: charifiedValue }
                    }return { valid: false, reason: "Kiểu char yêu cầu dữ liệu với độ dài bằng 1" }                                      
                case "PHONE":
                case "EMAIL":
                    return { valid: true, result: value }
                default: 
                    return { valid: false }
            }
        }else{
            const { NULL } = field;
            if( NULL ){
                return { valid: true, result: null }
            }else{
                return { valid: false, reason: "Dữ liệu rỗng" }
            }
        }
    }
    
    GET = async () => {              
        const tables = await this.tearTablesAndFieldsToObjects()
        const params = await this.getFields( this.API.params.valueOrNot() )
        let paramQueries = [];

        if( params.length > 0 ){
            const formatedUrl = this.req.url.replaceAll('//', '/')
            const splittedURL = formatedUrl.split('/')
            const paramValues = splittedURL.slice(3) /* The 3 number is the first index of params located in url, this can be changed to flexible with url format */
    
            let paramsValid = true;
            paramQueries = params.map( (param, index) => {
                const query = {}
                query[ param.fomular_alias ] = paramValues[index];
                if( paramValues[index] == '' ){
                    paramsValid = false;
                }
                return { table_id: param.table_id, query }
            })
            if( paramValues.length < params.length || !paramsValid ){
                this.res.status(200).send({
                    msg: "INVALID PARAMS SET", 
                    data: []
                })
                return 
            }
        }

        const primaryKeys = {}
        const foreignKeys = {}
        

        const rawAPIFields = this.API.fields.valueOrNot()
        const apiFields = await this.getFields( rawAPIFields.map( field => field.id ) );        
        const dbFields = await this.#__fields.findAll({ table_id: { $in: tables.map( tb => tb.id ) } }) 
        for( let i = 0 ; i < tables.length; i++ ){
            const { primary_key, foreign_keys, table_alias } = tables[i]            
            primaryKeys[ table_alias ] = primary_key ? primary_key : []
            foreignKeys[ table_alias ] = foreign_keys ? foreign_keys : []            
        }  

        const rawData = []
        for( let i = 0; i < tables.length; i++ ){
            const table = tables[i];
            const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.id );
            
            let query = {}
            for( let j = 0; j < queriesDataFromParams.length; j++ ){
                query = { ...query, ...queriesDataFromParams[j].query }
            }           

            const { id, table_alias, table_name, primary_key, foreign_keys } = table;
            const model = new Model( table_alias );
            const Table = model.getModel();
            const data = await Table.__findAll__(query);                 
            rawData.push({ table_id: id, table_alias, table_name, primary_key, foreign_keys, data })
        }

        rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )
        let mergedRawData = rawData[0].data;

        for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
            const newMergedData = [];
            const currentData = rawData[i].data;
            for( let j = 0; j < mergedRawData.length; j++ ){
                for( let h = 0; h < currentData.length; h++ ){
                    const record = { ...mergedRawData[j], ...currentData[h] }
                    delete record._id
                    newMergedData.push( record )
                }
            }
            mergedRawData = newMergedData
        }

        let filteringData = removeDuplicate( mergedRawData );

        for( let i = 0; i < rawData.length; i++ ){
            const { foreign_keys, table_name } = rawData[i];
            for( let j = 0; j < foreign_keys.length; j++ ){
                const key = foreign_keys[j];
                const { field_id, table_id, ref_field_id } = key;
                const thisField = dbFields.find( field => field.id == field_id );
                const thatField = dbFields.find( field => field.id == ref_field_id );
                if( thisField && thatField ){
                    filteringData = filteringData.filter( record => record[ thisField.fomular_alias ] == record[ thatField.fomular_alias ] )
                }                     
            }
        }

        let filtedData = filteringData;
        const calculates = this.API.calculates.valueOrNot();
        if( calculates.length > 0 ){
            filtedData = filtedData.map( record => {
                const calculateValue = {};
                const keys = Object.keys( record )
                keys.sort( (key_1, key_2) => key_1.length > key_2.length ? 1: -1 );
                for( let i = 0 ; i < calculates.length; i++ ){
                    const { fomular_alias, fomular } = calculates[i]
                    let result = fomular;
                    keys.map( key => {
                        /* replace the goddamn fomular with its coresponding value in record values */
                        result = result.replaceAll( key, record[key] )
                    })                    
                    try{
                        calculateValue[ fomular_alias ] = eval( result )
                    }catch{
                        calculateValue[ fomular_alias ] = `Phép tính lỗi`;
                    }
                }
                return { ...record, ...calculateValue }
            })
        }
        
        const statistic = this.API.statistic.valueOrNot()
        const statisticResult = statistic.map( statis => {
            const { fomular_alias, fomular, field, display_name } = statis;
            let result;
            switch( fomular ){
                case "SUM":
                    let sum = 0;
                    for( let i = 0; i < filtedData.length; i++ ){
                        const value = filtedData[i][field];
                        if(  value != undefined  ){
                            sum += value;
                        }
                    }
                    result = sum;
                    break;
                case "COUNT":
                    result = filtedData.length;
                    break;
                case "AVERAGE":
                    let upper = 0;
                    for( let i = 0; i < filtedData.length; i++ ){
                        const value = filtedData[i][field];
                        if(  value != undefined  ){
                            sum += value;
                        }
                    }
                    let lower = filtedData.length;
                    if( lower > 0 ){
                        let raw_result = upper / lower;
                        result = parseFloat((raw_result.toFixed(2) ))
                    }else{
                        result = 0;
                    }
                    break;
                default:
                    result = undefined;
                    break;
                }
                return { display_name, fomular_alias, result }
        })
        const rawDisplayFields = this.API.fields.valueOrNot();
     
        const displayFields = rawDisplayFields.map( field => {
            const { id, display_name } = field;            
            const corespondingField = apiFields.find( f => f.id == id );
            const { fomular_alias } = corespondingField
            return { fomular_alias, display_name }
        })   
        
        const calculateDisplay = calculates.map( field => {
            const { fomular_alias, display_name } = field;
            return { fomular_alias, display_name }
        })        

        this.res.status(200).send({
            msg: "GET nè", 
            fields: [ ...displayFields, ...calculateDisplay ], 
            data: filtedData, 
            statistic: {  
                fields: {}, 
                values: statisticResult 
            } 
        })
    }

    POST = async () => {
        const tables = await this.tearTablesAndFieldsToObjects()
        const tearedBody  = []
        const primaryKeys = {}
        const foreignKeys = {}
        
        /**
         *  Tearing the fucking body to seperate objects that contain only their fields alone
         * 
         *  After these lines of code, we've got a goddamn object called "tearedBody" which is a list of objects with the structure below
         *  {
         *      table_alias: "NSDKGFK6JLKANFSJFK1D6A4",
         *      data: {
         *          "fomular_alias": "coresponding_value",
         *          ... 
         *      }
         *  }
         * 
         *  And two objects called primaryKeys & foreignKeys, they contain every key exists in tables set.
         *  
         */

        for( let i = 0 ; i < tables.length; i++ ){
            const { primary_key, foreign_keys, table_alias, body, id, fields } = tables[i]
            const tearedObject = { table_id: id, table_alias, data: {} }

            primaryKeys[ table_alias ] = primary_key ? primary_key : []
            foreignKeys[ table_alias ] = foreign_keys ? foreign_keys : []

            for( let j = 0; j < body.length; j++ ){
                const field = body[j]                
                const { fomular_alias } = field;
                const { DATATYPE, AUTO_INCREMENT, PATTERN, id } = field;
                if( this.req.body[ fomular_alias ] != undefined ){
                    const primaryKey = primaryKeys[ table_alias ].find( key => key == id )
                    if( primaryKey ){                  
                        const foreignKey = foreignKeys[ table_alias ].find( key => key.field_id == id ) 
                        if( foreignKey ){
                            tearedObject.data[fomular_alias] = this.req.body[ fomular_alias ]
                        }else{
                            tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( table_alias, PATTERN )
                        }
                    }else{
                        tearedObject.data[fomular_alias] = this.req.body[ fomular_alias ]
                    }
                }else{
                    if( Fields.isIntFamily(DATATYPE) && AUTO_INCREMENT){
                        const foreignKey = foreignKeys[ table_alias ].find( key => key.field_id == id )
                        if( foreignKey ){
                            const foreignField = await this.getField( foreignKey.ref_field_id );
                            const foreignTable = await this.getTable( foreignField.table_id );
                            tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( foreignTable.table_alias, PATTERN )
                        }else{
                            tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( table_alias, PATTERN )
                        }
                    }
                }
            }
            tearedBody.push( tearedObject )
        }        

        for( let i = 0 ; i < tearedBody.length; i++ ){
            const object = tearedBody[i]
            const { table_id, table_alias, data } = object;
            const primary_key = primaryKeys[table_alias]
            const foreign_keys = foreignKeys[table_alias]
            // console.log( `\n${ table_id } - ${ table_alias }` )
            // console.log(data)
            // console.log( primary_key )
            // console.log( foreign_keys )
            
            const foreignFields = await this.getFields( foreign_keys.map(  key => key.field_id ) )
            const primaryFields = await this.getFields( primary_key );
            tearedBody[i]["key_fields"] = { foreignFields, primaryFields }

            for( let j = 0; j < primaryFields.length; j++ ){
                const { fomular_alias, id } = primaryFields[j]
                // console.log(`${fomular_alias}: ${ data[fomular_alias] }`)
                if( data[fomular_alias] != undefined ){
                    for( let h = 0; h < tables.length; h++ ){
                        const { table_alias } = tables[h]
                        const fk = foreignKeys[ table_alias ]
                        const key = fk.find( k => k.ref_field_id == id )
                        if( key ){
                            const { field_id, table_id, ref_field_id } = key;
                            const field = await this.getField( field_id );
                            const table = await this.getTable( field.table_id );
                            const foreignTable = tearedBody.find( tb => tb.table_alias == table.table_alias )
                            
                            if( foreignTable ){
                                const { table_alias } = foreignTable
                                const foreignTearedObject = tearedBody.find( tb => tb.table_alias == table_alias );
                                const index = tearedBody.indexOf( foreignTearedObject );
                                tearedBody[index].data[ field.fomular_alias ] = data[ fomular_alias ]
                            }
                        }
                    }
                }
            }

            for( let j = 0 ; j < foreignFields.length; j++  ){
                const { id, fomular_alias } = foreignFields[j]                
                                   
                const key = foreign_keys.find( k => k.field_id == id );
                if( data[fomular_alias] != undefined ){
                    if( key ){
                        const { field_id, table_id, ref_field_id } = key;
                        const field = await this.getField( ref_field_id );
                        const table = await this.getTable( field.table_id );
                        const foreignTable = tearedBody.find( tb => tb.table_alias == table.table_alias )
                        if( foreignTable ){
                            const { table_alias } = foreignTable
                            const foreignTearedObject = tearedBody.find( tb => tb.table_alias == table_alias );
                            const index = tearedBody.indexOf( foreignTearedObject );
                            tearedBody[index].data[ field.fomular_alias ] = data[ fomular_alias ]                                                      
                                
                        }
                    }                
                }
            }            
        }

    

        let typeError = false;
        let primaryConflict = false;
        let foreignConflict = false;

        for( let i = 0 ; i < tearedBody.length; i++ ){
            const object = tearedBody[i]
            const { table_id, table_alias, data } = object;
            const fields = await this.getFieldsByTableId ( table_id )
            tearedBody[i].errorFields = [];

            for( let j = 0; j < fields.length; j++ ){
                const { fomular_alias } = fields[j]
                const validate = this.parseType( fields[j], data[fomular_alias] ) 
                const { valid, result, reason } = validate;
                if( valid ){
                    tearedBody[i].data[ fomular_alias ] = result
                }else{
                    tearedBody[i].errorFields.push({  field: fields[j], value: data[ fomular_alias ], reason })
                    typeError = true;
                }
            }
        }

        if( !typeError ){

            for( let i = 0; i < tearedBody.length; i++ ){
                const { table_id, table_alias, data, key_fields } = tearedBody[i]
                const model = new Model( table_alias )
                const Table = model.getModel()
                const primaryQuery = {}
                const { primaryFields, foreignFields } = key_fields;
                primaryFields.map( field => { primaryQuery[ field.fomular_alias ] = data[ field.fomular_alias ] } )
                const existedData = await Table.__findAll__( primaryQuery )
                if( existedData.length > 0 ){
                    primaryConflict = true
                }
            }
            if( !primaryConflict ){
    
                for( let i = 0; i < tearedBody.length; i++ ){
                    const { table_id, table_alias, data, key_fields } = tearedBody[i]
                    const foreign_keys = foreignKeys[table_alias]
                    const { foreignFields } = key_fields;
                    for( let j = 0 ; j < foreign_keys.length; j++ ){
                        const foreignKey = foreign_keys[j]
                        const foreignField = foreignFields.find( field => field.id == foreignKey.field_id );
                        const foreignTable = await this.getTable( foreignKey.table_id )
                        const primaryField = await this.getField( foreignKey.ref_field_id )
                        const query = {}
                        query[ primaryField.fomular_alias ] = data[ foreignField.fomular_alias ]
                        
                        const model = new Model( foreignTable.table_alias )
                        const Table = model.getModel()    
                        const foreignData = await Table.__findAll__(query);
                        
                        if( foreignData.length == 0 ){
                            foreignConflict = true
                        }
                        const hotForeignTable = tearedBody.find( tb => tb.table_id == foreignKey.table_id );
                        if( hotForeignTable ){
                            const primaryTableData = hotForeignTable.data;
                            const primaryData = primaryTableData[ primaryField.fomular_alias ];
                            
                            if( primaryData == data[ foreignField.fomular_alias ] ){                                
                                foreignConflict = false; // not tested
                            }
                        }
                    }
                }
    
                if( !foreignConflict ){
                    for( let i = 0; i < tearedBody.length; i++ ){
                        const { table_alias, data } = tearedBody[i]                    
                        const model = new Model( table_alias )
                        const Table = model.getModel()
                        
                        await Table.__insertRawObject__(data) 
                    }
                }
            }
        }
        /**
         * Response JSON remains
         */
        this.res.status(200).send({msg: "POST nè", primaryConflict, foreignConflict, typeError, tearedBody })
    }

    PUT = async () => {
        const tables = await this.tearTablesAndFieldsToObjects()
        const params = await this.getFields( this.API.params.valueOrNot() )
        let paramQueries = [];

        if( params.length > 0 ){
            const formatedUrl = this.req.url.replaceAll('//', '/')
            const splittedURL = formatedUrl.split('/')
            const paramValues = splittedURL.slice(3) /* The 3 number is the first index of params located in url, this can be changed to flexible with url format */
    
            let paramsValid = true;
            paramQueries = params.map( (param, index) => {
                const query = {}
                const parsedValue = this.parseType(param, paramValues[index])
                query[ param.fomular_alias ] = parsedValue.result;    
                           
                if( paramValues[index] == '' ){
                    paramsValid = false;
                }
                return { table_id: param.table_id, query }
            })
            if( paramValues.length < params.length || !paramsValid ){
                this.res.status(200).send({
                    msg: "INVALID PARAMS SET", 
                    data: []
                })
                return 
            }
        }
        

        const primaryKeys = {}
        const foreignKeys = {}
        

        const rawAPIFields = this.API.fields.valueOrNot()
        const apiFields = await this.getFields( rawAPIFields.map( field => field.id ) );        
        const dbFields = await this.#__fields.findAll({ table_id: { $in: tables.map( tb => tb.id ) } }) 
        for( let i = 0 ; i < tables.length; i++ ){
            const { primary_key, foreign_keys, table_alias } = tables[i]            
            primaryKeys[ table_alias ] = primary_key ? primary_key : []
            foreignKeys[ table_alias ] = foreign_keys ? foreign_keys : []            
        }  

        const rawData = []
        for( let i = 0; i < tables.length; i++ ){
            const table = tables[i];
            const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.id );
            
            let query = {}
            for( let j = 0; j < queriesDataFromParams.length; j++ ){
                query = { ...query, ...queriesDataFromParams[j].query }
            }           

            const { id, table_alias, table_name, primary_key, foreign_keys } = table;
            const model = new Model( table_alias );
            const Table = model.getModel();
            const data = await Table.__findAll__(query);                 
            rawData.push({ table_id: id, table_alias, table_name, primary_key, foreign_keys, data })
        }

        rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )
        let mergedRawData = rawData[0].data;

        for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
            const newMergedData = [];
            const currentData = rawData[i].data;
            for( let j = 0; j < mergedRawData.length; j++ ){
                for( let h = 0; h < currentData.length; h++ ){
                    const record = { ...mergedRawData[j], ...currentData[h] }
                    delete record._id
                    newMergedData.push( record )
                }
            }
            mergedRawData = newMergedData
        }

        let filteringData = removeDuplicate( mergedRawData );

        
        if( filteringData.length > 0 ){

            const tearedBody  = []
            const primaryKeys = {}
            const foreignKeys = {}

            for( let i = 0 ; i < tables.length; i++ ){
                const { primary_key, foreign_keys, table_alias, body, id, fields } = tables[i]
                const tearedObject = { table_id: id, table_alias, data: {} }
    
                primaryKeys[ table_alias ] = primary_key ? primary_key : []
                foreignKeys[ table_alias ] = foreign_keys ? foreign_keys : []
    
                for( let j = 0; j < body.length; j++ ){
                    const field = body[j]                
                    const { fomular_alias } = field;
                    const { DATATYPE, AUTO_INCREMENT, PATTERN, id } = field;
                    if( this.req.body[ fomular_alias ] ){
                        const primaryKey = primaryKeys[ table_alias ].find( key => key == id )
                        if( primaryKey ){                  
                            const foreignKey = foreignKeys[ table_alias ].find( key => key.field_id == id ) 
                            if( foreignKey ){
                                tearedObject.data[fomular_alias] = this.req.body[ fomular_alias ]
                            }else{
                                tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( table_alias, PATTERN )
                            }
                        }else{
                            tearedObject.data[fomular_alias] = this.req.body[ fomular_alias ]
                        }
                    }else{
                        if( Fields.isIntFamily(DATATYPE) && AUTO_INCREMENT){
                            const foreignKey = foreignKeys[ table_alias ].find( key => key.field_id == id )
                            if( foreignKey ){
                                const foreignField = await this.getField( foreignKey.ref_field_id );
                                const foreignTable = await this.getTable( foreignField.table_id );
                                tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( foreignTable.table_alias, PATTERN )
                            }else{
                                tearedObject.data[fomular_alias] = await Fields.makeAutoIncreament( table_alias, PATTERN )
                            }
                        }
                    }
                }
                tearedBody.push( tearedObject )
            }        
    
            for( let i = 0 ; i < tearedBody.length; i++ ){
                const object = tearedBody[i]
                const { table_id, table_alias, data } = object;
                const primary_key = primaryKeys[table_alias]
                const foreign_keys = foreignKeys[table_alias]
                // console.log( `\n${ table_id } - ${ table_alias }` )
                // console.log(data)
                // console.log( primary_key )
                // console.log( foreign_keys )
                
                const foreignFields = await this.getFields( foreign_keys.map(  key => key.field_id ) )
                const primaryFields = await this.getFields( primary_key );
                tearedBody[i]["key_fields"] = { foreignFields, primaryFields }
    
                for( let j = 0; j < primaryFields.length; j++ ){
                    const { fomular_alias, id } = primaryFields[j]
                    // console.log(`${fomular_alias}: ${ data[fomular_alias] }`)
                    if( data[fomular_alias] ){
                        for( let h = 0; h < tables.length; h++ ){
                            const { table_alias } = tables[h]
                            const fk = foreignKeys[ table_alias ]
                            const key = fk.find( k => k.ref_field_id == id )
                            if( key ){
                                const { field_id, table_id, ref_field_id } = key;
                                const field = await this.getField( field_id );
                                const table = await this.getTable( field.table_id );
                                const foreignTable = tearedBody.find( tb => tb.table_alias == table.table_alias )
                                
                                if( foreignTable ){
                                    const { table_alias } = foreignTable
                                    const foreignTearedObject = tearedBody.find( tb => tb.table_alias == table_alias );
                                    const index = tearedBody.indexOf( foreignTearedObject );
                                    tearedBody[index].data[ field.fomular_alias ] = data[ fomular_alias ]
                                }
                            }
                        }
                    }
                }
    
                for( let j = 0 ; j < foreignFields.length; j++  ){
                    const { id, fomular_alias } = foreignFields[j]                
                                       
                    const key = foreign_keys.find( k => k.field_id == id );
                    if( data[fomular_alias] ){
                        if( key ){
                            const { field_id, table_id, ref_field_id } = key;
                            const field = await this.getField( ref_field_id );
                            const table = await this.getTable( field.table_id );
                            const foreignTable = tearedBody.find( tb => tb.table_alias == table.table_alias )
                            if( foreignTable ){
                                const { table_alias } = foreignTable
                                const foreignTearedObject = tearedBody.find( tb => tb.table_alias == table_alias );
                                const index = tearedBody.indexOf( foreignTearedObject );
                                tearedBody[index].data[ field.fomular_alias ] = data[ fomular_alias ]                                                      
                                    
                            }
                        }                
                    }
                }            
            }

                 
 
            for( let j = 0 ; j < paramQueries.length ; j++ ){
                const { query } = paramQueries[j]

                for( let h = 0 ; h < tearedBody.length ; h++ ){
                    tearedBody[h].data = { ...tearedBody[h].data, ...query }
                }
            }            
            

            let typeError = false;
            let foreignConflict = false;

            for( let i = 0 ; i < tearedBody.length; i++ ){
                const object = tearedBody[i]
                const { table_id, data } = object;
                const fields = await this.getFieldsByTableId ( table_id )
                tearedBody[i].errorFields = [];

                for( let j = 0; j < fields.length; j++ ){
                    const { fomular_alias } = fields[j]
                    const validate = this.parseType( fields[j], data[fomular_alias] ) 
                    const { valid, result, reason } = validate;
                    if( valid ){
                        tearedBody[i].data[ fomular_alias ] = result
                    }else{
                        tearedBody[i].errorFields.push({  field: fields[j], value: data[ fomular_alias ], reason })
                        typeError = true;
                    }
                }
            }            

            for( let i = 0; i < tearedBody.length; i++ ){
                const { table_id, table_alias, data, key_fields } = tearedBody[i]
                const foreign_keys = foreignKeys[table_alias]
                const { foreignFields } = key_fields;
                for( let j = 0 ; j < foreign_keys.length; j++ ){
                    const foreignKey = foreign_keys[j]
                    const foreignField = foreignFields.find( field => field.id == foreignKey.field_id );
                    const foreignTable = await this.getTable( foreignKey.table_id )
                    const primaryField = await this.getField( foreignKey.ref_field_id )
                    const query = {}
                    query[ primaryField.fomular_alias ] = data[ foreignField.fomular_alias ]
                    if( query[ primaryField.fomular_alias ] != undefined ){
                        const model = new Model( foreignTable.table_alias )
                        const Table = model.getModel()    
                        const foreignData = await Table.__findAll__(query);
                        
                        if( foreignData.length == 0 ){
                            foreignConflict = true
                        }
                        const hotForeignTable = tearedBody.find( tb => tb.table_id == foreignKey.table_id );
                        if( hotForeignTable ){
                            const primaryTableData = hotForeignTable.data;
                            const primaryData = primaryTableData[ primaryField.fomular_alias ];
                            
                            if( primaryData == data[ foreignField.fomular_alias ] ){                                
                                foreignConflict = false; // not tested
                            }
                        }
                    }
                }
            }
            

            let newUpdateValues = []
            
            if( !foreignConflict ){                
                for( let j = 0; j < tearedBody.length; j++ ){
                    const { data, key_fields, table_id } = tearedBody[j]
                    const table = tables.find( tb => tb.id == table_id )
                    const { body, params, table_alias }  = table

                    const model = new Model( table_alias )
                    const Table = model.getModel()  
                    
                    const { primaryFields } = key_fields
                    let updateData = {}
                    let updateCriteria = {}
                    body.map( field => {
                        const query = {}
                        if( data[ field.fomular_alias ] != undefined ){
                            query[ field.fomular_alias ] = data[ field.fomular_alias ];
                        }
                        updateData = { ...updateData, ...query }
                    })

                    params.map( field => {
                        const query = {}
                        if( data[ field.fomular_alias ] != undefined ){
                            query[ field.fomular_alias ] = data[ field.fomular_alias ];
                        }
                        updateCriteria = { ...updateCriteria, ...query }
                    })
                    await Table.__manualUpdate__( updateCriteria, updateData )                    
                }
            }            

            this.res.status(200).send({ paramQueries, filteringData, typeError, foreignConflict, tearedBody, newUpdateValues })

        }else{
            this.res.status(200).send({filteringData})
        }

    }

    DELETE = async () => {
        const tables = await this.tearTablesAndFieldsToObjects()
        const params = await this.getFields( this.API.params.valueOrNot() )
        let paramQueries = [];

        if( params.length > 0 ){
            const formatedUrl = this.req.url.replaceAll('//', '/')
            const splittedURL = formatedUrl.split('/')
            const paramValues = splittedURL.slice(3) 
    
            let paramsValid = true;
            paramQueries = params.map( (param, index) => {
                const query = {}
                query[ param.fomular_alias ] = paramValues[index];
                if( paramValues[index] == '' ){
                    paramsValid = false;
                }
                return { table_id: param.table_id, query }
            })
            if( paramValues.length < params.length || !paramsValid ){
                this.res.status(200).send({
                    msg: "INVALID PARAMS SET", 
                    data: []
                })
                return 
            }
        }

        const primaryKeys = {}
        const foreignKeys = {}      
        
        const dbFields = await this.#__fields.findAll({ table_id: { $in: tables.map( tb => tb.id ) } }) 
        for( let i = 0 ; i < tables.length; i++ ){
            const { primary_key, foreign_keys, table_alias } = tables[i]            
            primaryKeys[ table_alias ] = primary_key ? primary_key : []
            foreignKeys[ table_alias ] = foreign_keys ? foreign_keys : []            
        }  

        const rawData = []
        for( let i = 0; i < tables.length; i++ ){
            const table = tables[i];
            const queriesDataFromParams = paramQueries.filter( tb => tb.table_id == table.id );
            
            let query = {}
            for( let j = 0; j < queriesDataFromParams.length; j++ ){
                query = { ...query, ...queriesDataFromParams[j].query }
            }           

            const { id, table_alias, table_name, primary_key, foreign_keys } = table;
            const model = new Model( table_alias );
            const Table = model.getModel();
            const data = await Table.__findAll__(query);                 
            rawData.push({ table_id: id, table_alias, table_name, primary_key, foreign_keys, data })
        }

        rawData.sort( (a, b) => a.data.length > b.data.length ? 1 : -1 )
        let mergedRawData = rawData[0].data;

        for( let i = 1; i < rawData.length; i++ ){ /* Loop over the whole raw data collection */
            const newMergedData = [];
            const currentData = rawData[i].data;
            for( let j = 0; j < mergedRawData.length; j++ ){
                for( let h = 0; h < currentData.length; h++ ){
                    const record = { ...mergedRawData[j], ...currentData[h] }
                    delete record._id
                    newMergedData.push( record )
                }
            }
            mergedRawData = newMergedData
        }

        let filteringData = removeDuplicate( mergedRawData );

        for( let i = 0; i < rawData.length; i++ ){
            const { foreign_keys, table_name } = rawData[i];
            for( let j = 0; j < foreign_keys.length; j++ ){
                const key = foreign_keys[j];
                const { field_id, table_id, ref_field_id } = key;
                const thisField = dbFields.find( field => field.id == field_id );
                const thatField = dbFields.find( field => field.id == ref_field_id );
                if( thisField && thatField ){
                    filteringData = filteringData.filter( record => record[ thisField.fomular_alias ] == record[ thatField.fomular_alias ] )
                }                     
            }
        }

        let filtedData = filteringData;

        for( let i = 0 ; i < tables.length; i++){
            const table = tables[i]
            const { primary_key } = table;
            const primaryFields = await this.getFields( primary_key )
            const model = new Model( table.table_alias )
            const Table = model.getModel()

            for( let h = 0; h < filtedData.length; h++ ){
                const record = filtedData[h];
                const query = {}
                for( let j = 0; j < primaryFields.length; j++ ){
                    const field = primaryFields[j]
                    query[ field.fomular_alias ] = record[ field.fomular_alias ]
                }
                await Table.__deleteObjects__(query)
            }
        }        
        this.res.status(200).send({filtedData})
    }
}
module.exports = ConsumeApi

    