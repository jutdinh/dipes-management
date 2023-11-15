const socketController = (socket) => {
    socket.on("new-connected", (payload) => {
        console.log(payload)
        socket.emit("new-connected", { payload })
    })

    socket.on('project/notify', (payload) => {
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

        switch (context) {
            case "project/add-member":                
                en = `[${actor.fullname}] __has_added_you_to [${note.project_name}]`;
                url = `/projects/detail/${note.project_id}`
                break;

            case "project/remove-member":                
                en = `[${actor.fullname}] __has_removed_you_from_project [${note.project_name}]`
                break;

            case "project/change-privilege":                
                en = `[${actor.fullname}] __has_changed_your_project_privileges_in [${note.project_name}]`
                url = `/projects/detail/${note.project_id}`
                break;

            case "project/add-period-member":                
                en = `[${actor.fullname}] __has_added_you_to_phase [${note.period_name}] __of_project [${note.project_name}]`
                url = `/projects/detail/task/${note.project_id}?period=${note.period_id}`
                break;

            case "project/remove-period-member":                
                en = `[${actor.fullname}] __has_removed_you_from_phase [${note.period_name}] __of_project [${note.project_name}]`
                url = `/projects/detail/task/${note.project_id}?period=${note.period_id}`
                break;

            case "project/add-task-member":                
                en = `[${actor.fullname}] __has_added_you_to_a_new_task`
                url = `/projects/detail/task/${note.project_id}?period=${note.period_id}&task_id=${note.task_id}`
                break;
            case "project/add-child-task-member":                
                en = `[${actor.fullname}] __has_added_you_to_a_new_task`
                url = `/projects/detail/task/${note.project_id}?period=${note.period_id}&task_id=${note.task_id}&child_task_id=${note.child_task_id}`
                break;
        }
        const translatedContext = en

        socket.broadcast.emit("project/notify", { targets, actor, content: translatedContext, url })
    })
}

module.exports = socketController