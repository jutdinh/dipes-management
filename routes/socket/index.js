const socketController = (socket) => {
    socket.on("new-connected", (payload) => {
        console.log(payload)
    })
}

module.exports = socketController