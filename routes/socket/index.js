const socketController = (socket) => {
    socket.on("new-connected", (payload) => {
        console.log(payload)
        socket.emit("new-connected", { payload })
    })

    socket.on('project/notify', ( payload ) => {
        const { targets, actor, context, note = {} } = payload;        
        let vi, en;
        let url = ""
        /**
         * 
         * note {
         *  project_name,
         *  period_name,
         *  project_id,
         *  period_id,
         *  task_id,
         *  child_task_id,
         * }
         * 
         * 
         */

        switch( context ){
            case "project/add-member":
                vi = `[${actor.fullname}] đã thêm bạn vào dự án [${note.project_name}]`;
                en = `[${actor.fullname}] has added you to [${note.project_name}]`;
                url = `/projects/detail/${note.project_id}`
                break;
            
            case "project/remove-member":
                vi = `[${actor.fullname}] đã xóa bạn khỏi dự án [${note.project_name}]`
                en = `[${actor.fullname}] has removed you from project [${note.project_name}]`
                break;
            
            case "project/change-privilege":
                vi = `[${actor.fullname}] đã thay đổi phân quyền của bạn trong dự án [${note.project_name}]`
                en = `[${actor.fullname}] has changed your project privileges in [${note.project_name}]`
                url = `/projects/detail/${note.project_id}`
                break;
                
            case "project/add-period-member":
                vi = `[${actor.fullname}] đã thêm bạn vào giai đoạn [${note.period_name}] của dự án [${note.project_name}]`
                en = `[${actor.fullname}] has added you to phase [${note.period_name}] of project [${note.project_name}]`
                url = `/projects/detail/task/${note.project_id}?period=${note.period_id}`
                break;
            case "project/add-task-member":
                vi = `[${actor.fullname}] đã thêm bạn vào một công việc mới`
                en = `[${actor.fullname}] has added you to a new task`
                url= `/projects/detail/task/${note.project_id}?period=${note.period_id}&task_id=${note.task_id}`
                break;
            case "project/add-child-task-member":
                vi = `[${actor.fullname}] đã thêm bạn vào một công việc mới`
                en = `[${actor.fullname}] has added you to a new task`
                url= `/projects/detail/task/${note.project_id}?period=${note.period_id}&task_id=${note.task_id}&child_task_id=${note.child_task_id}`
                break;
        }

        const translatedContext = {
            vi, en
        }

        socket.broadcast.emit("project/notify", { targets, actor, content: translatedContext, url  })
    })
}

module.exports = socketController