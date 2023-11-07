const socketController = (socket) => {
    socket.on("new-connected", (payload) => {
        console.log(payload)
        socket.emit("new-connected", { payload })
    })

    socket.on('project/new-members-added', ( payload ) => {

    })

    socket.on('project/removed-members', ( payload ) => {

    })

    socket.on('project/change-privilege', (payload) => {

    })

    socket.on('project/member-added-to-period-or-task', (payload) => {

    })

    socket.on('project/done-task', (payload) => {
        
    })
}

module.exports = socketController