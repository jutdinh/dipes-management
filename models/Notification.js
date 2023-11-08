const { Model } = require('../config/models');

class Notification extends Model{
    constructor(){
        super("notification");
        this.__addProperty__( "notify_id", Model.types.int, { auto: true } )
        this.__addProperty__( "image_url", Model.types.string )
        this.__addProperty__( "url", Model.types.string )
        this.__addProperty__( "content", Model.types.json )
        this.__addProperty__( "read", Model.types.bool, { default: false })

        this.content.__addProperty__("vi", Model.types.string )
        this.content.__addProperty__("en", Model.types.string )

        this.__addProperty__("notify_at", Model.types.datetime, { default: new Date() } )
        this.__addProperty__("username", Model.types.string )
        this.__addPrimaryKey__( ["notify_id"] )
        

        
        this.__addIndexing__(["notify_id"])
        this.__addIndexing__(["username"])
        this.__traversal__()
    }

    changeSeenState = async (notify_id) => {
        const model = this.getModel()
        await model.__manualUpdate__({ notify_id: parseInt(notify_id) }, { read: true } )
    }

    removeNotifies = async (username = "") => {
        
        const model = this.getModel()
        await model.__deleteObjects__({username: this.__dotEncode__(username)})
    }
}   
class NotificationRecord extends Notification {
    constructor( data ){
        super();
        this.setDefaultValue( data )        
    }

}
module.exports = { Notification, NotificationRecord }
    