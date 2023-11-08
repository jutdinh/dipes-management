const fs = require('fs')
const { Model } = require('../config/models');
class Accounts extends Model{    

    
    static __defaultAccount = {
        "username": "administrator", 
        "password": "dipes@admin", 
        "fullname": "Administrator", 
        "role": "uad", 
        "email": "admin.dipes@mylangroup.com", 
        "phone": "0368474601",
        "avatar": "/image/avatar/su.png"
    }

    constructor(){
        super("accounts");
        this.__addProperty__( "username", Model.types.string, { required: true } )
        this.__addProperty__( "password", Model.types.string, { required: true } )
        this.__addProperty__( "fullname", Model.types.string, { required: true } )
        this.__addProperty__( "role", Model.types.enum, { required: true, values: ["uad", "ad", "pm", "pd", "ps"] })
        this.__addProperty__( "email", Model.types.string)
        this.__addProperty__( "phone", Model.types.string)
        this.__addProperty__( "address", Model.types.string)
        this.__addProperty__( "avatar", Model.types.string)
        this.__addProperty__( "note", Model.types.string)
        this.__addProperty__( "create_at", Model.types.datetime, { format: "DD-MM-YYYY lúc hh:mm" } ); 
        this.__addProperty__( "create_by", Model.types.json );
        this.create_by.__addProperty__("username", Model.types.string)
        this.create_by.__addProperty__("fullname", Model.types.string)
        this.create_by.__addProperty__("avatar", Model.types.string)

        
        this.__addPrimaryKey__("username")
        this.__addIndexing__(["username", "password"])
        this.__addIndexing__(["username"])
        
        this.__traversal__()
    }

    getAllAccounts = async () => {
        const accounts = await this.findAll();
        if( accounts ){
            const result = accounts.map( account => {
                const Account = new AccountsRecord( account );
                const infor = Account.get()
                return {...infor, create_by: infor.create_by ? infor.create_by.username: "###"}
            })
            return result
        }else{
            return []
        }
    }
}   
class AccountsRecord extends Accounts {
    constructor( data ){
        super();
        this.setDefaultValue( data )        
    }

    get = () => {
        return this.getData()
    }

    makeFirstAva = () => {
        const baseDir = `public/image/avatar`;
        const src = `${ baseDir }/default-ava.png`;
        const dest = `${ baseDir }/${ this.getData().username }.png`;

        if( !fs.existsSync( dest ) ){
            fs.copyFileSync( src, dest )            
        }
    }

    setInfo = ( infors ) => {
        const { fullname, role, email, phone, note, address } = infors 
        this.__modifyChildren__("fullname", fullname)
        this.__modifyChildren__("role", role)
        this.__modifyChildren__("email", email)
        this.__modifyChildren__("phone", phone)
        this.__modifyChildren__("note", note)
        this.__modifyChildren__("address", address)
    }
    
    destroy = () => {
        this.remove()
    }


    
}
module.exports = { Accounts, AccountsRecord }
    