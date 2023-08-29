const { intValidate } = require('../../../functions/validator');
const Field = require('./field');

class Serialized extends Field{
    #__fields = []    
    constructor( name, value, props ){
        super( name, "json", value );   
    }

    static getType = () => {
        return "json"
    }

    __addProperty__ = ( propertyName, dataType, properties ) => {
        this.#__fields.push( new dataType( propertyName, undefined, properties ) )
        this[ propertyName ] = new dataType( propertyName, undefined, properties )
        this[ propertyName ].__parent = this
    }

    __getName__ = () => {
        return this.__getNameRecursive__(this)
    }

    __getNameRecursive__ = ( thisObject ) => {
        if( thisObject.__parent != undefined ){
            return this.__getNameRecursive__( thisObject.__parent ) + `.${ thisObject.__fieldName ? thisObject.__fieldName : thisObject.__modelName }`
        }else{
            return thisObject.__fieldName ? thisObject.__fieldName : thisObject.__modelName
        }
    }



    value = ( val = undefined ) => {
        /**
            @name: phương thức value;
            @desc: Nếu giá trị truyền vào rỗng thì trả về giá trị hiện tại,
            nếu không thì đặt giá trị hiện tại bằng giá trị truyền vào và trả về nó
            @params: val <Any>
            @auth: Linguistic
        **/

        if( val != undefined ){            
            if( typeof(val) =="object" ){
                this.__value = val;
            }else{
                throw Error ('Giá trị truyền vào không tương thích với kiểu dữ liệu OBJECT')
            }
        }
        else{
            return this.__value
        }
    }
}

module.exports = Serialized
