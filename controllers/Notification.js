
const { Controller } = require('../config/controllers');
const { Notification, NotificationRecord } = require('../models/Notification');

const langs = require('../functions/langs/index')

class NotificationController extends Controller {
    #__notify = new Notification()

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

    getNotifies = async ( req, res ) => {
        const verified = await this.verifyToken(req)
        const context = {
            success: false,
            content: "Invalid token",
            data: []
        }
        if( verified ){
            const decodedToken = this.decodeToken(req.header( "Authorization" ))
            const { username } = decodedToken;
            const langAbbr = req.header("lang")
            const lang = langs[langAbbr] ? langs[langAbbr] : langs.vi            
            const keys = Object.keys( lang )           

            const notifies = await this.#__notify.findAll({ username })
            
            notifies.map( notify => {
                for( let i = 0 ; i < keys.length; i++ ){
                    const key = keys[i]
                    notify.content = notify.content.replace( key, lang[key] )
                }
            })

            context.success = true;
            context.content = "Successfully retrieve data"
            context.data = notifies.map( noti => {
                const Notify = new NotificationRecord(noti)
                return {...Notify.getData(), id: undefined}
            })
        }
        res.status(200).send(context)
    }

    updateSeenState = async ( req, res ) => {

        /**
         *  desc: Thay đổi trạng thấy [chưa xem]/[đã xem] của thông báo bằng thay đổi giá trị của read false => true
         *  method: PUT
         *  headers: {
         *      Authorization: <Token>
         *  }
         * 
         *  body: {
         *      notify_id: <Int>
         *  }
         */

        const verified = await this.verifyToken(req)

        const context = {
            success: false,
            content: "Invalid token",
            data: []
        }

        if( verified ){
            const { notify_id } = req.body;

            await this.#__notify.changeSeenState( notify_id )
            
            context.success = true;
            context.content = "Successfully updated data"            
        }
        res.status(200).send(context)
    }

    removeNotifies = async ( req, res ) => {

        /**
         *  desc: Thay đổi trạng thấy [chưa xem]/[đã xem] của thông báo bằng thay đổi giá trị của read false => true
         *  method: DELETE
         *  headers: {
         *      Authorization: <Token>
         *  }
         * 
         */

        const verified = await this.verifyToken(req)

        const context = {
            success: false,
            content: "Invalid token",
            data: []
        }

        if( verified ){
            const decodedToken = this.decodeToken(req.header( "Authorization" ))
            const { username } = decodedToken;

            await this.#__notify.removeNotifies( username )
            
            context.success = true;
            context.content = "Successfully deleted data"            
        }
        res.status(200).send(context)
    }

}
module.exports = NotificationController

    