const { Model } = require('../config/models');
const langs = require('../functions/langs');
class EventLogs extends Model{
    constructor(){
        super("eventlogs");
        this.__addProperty__( "event_id", Model.types.int, { auto: true } )
        this.__addProperty__( "event_type", Model.types.enum, { values: [ "info", "warn", "error" ] })
        this.__addProperty__( "event_title", Model.types.string )
        this.__addProperty__( "event_description", Model.types.string, { maxLength: Number.MAX_SAFE_INTEGER } )
        this.__addProperty__( "user_ip", Model.types.string)
        this.__addProperty__( "create_user", Model.types.string , { required: true })
        this.__addProperty__( "create_at", Model.types.datetime )

        this.__addPrimaryKey__( ["id"] )        
    }

    allLogs = async (language) => {
        const logs = await this.findAll()        
        const result = []
        for( let i = 0 ; i < logs.length; i++ ){
            const Log = new EventLogsRecord( logs[i] )
            result.push( Log.translate( language ) )
        }
        return result.reverse();
    }

    search = async ( language, type, start, end ) => {
        const allLogs = await this.allLogs( language )
        const typeFilted = this.searchToType( type, allLogs )        
        const startDateFilted = this.searchToStartDate( start,typeFilted )
        const endDateFilted = this.searchToEndDate( end, startDateFilted )
        return endDateFilted;
    }

    searchToType = (type, logs) => {        
        if( type != undefined ){
            const filted = logs.filter( log => log.raw_type == type );
            return filted
        }
        return logs;
    }

    searchToStartDate = ( date, logs ) => {
        if( date ){
            const filted = logs.filter( log => {
                
                return log.raw_date.getTime() >= date.getTime()
            });
            return filted;
        }
        return logs
    }
    searchToEndDate = ( date, logs ) => {
        if( date ){
            const filted = logs.filter( log => log.raw_date <= date );
            return filted;
        }
        return logs
    }
}   
class EventLogsRecord extends EventLogs {
    constructor( { id, event_id, event_type, event_title, event_description, create_user, create_at, user_ip } ){
        super();
        this.setDefaultValue( { id, event_id, event_type, event_title, event_description, create_user, create_at, user_ip } )        
    }
    get = () => {
        const data = this.getData()
        return {
            ...data,
            raw_type: data.event_type,
            raw_date: data.create_at            
        }
    }

    translate = (lg) => {        
        const lang = langs[lg]
        const log = this.get();
        log.event_type = lang[ log.event_type ];        
        const keys = Object.keys( lang );
        for( let i = 0; i < keys.length; i++ ){
            const key = keys[i]
            log.event_title = this.__dotDecode__(log.event_title.replaceAll( key, lang[key] ))
            log.event_description = this.__dotDecode__(log.event_description.replaceAll( key, lang[key] ))
        }
        return log;
    }
}
module.exports = { EventLogs, EventLogsRecord }
    