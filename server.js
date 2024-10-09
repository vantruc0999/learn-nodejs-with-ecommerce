const app = require("./src/app");

const PORT = 5001

const server = app.listen(PORT, ()=>{
    console.log(`Web service start with port ${PORT}`);
})

process.on('SIGINT', ()=>{
    server.close(()=>console.log(`Exit express server`))
    // notify.send('some notification...')
})