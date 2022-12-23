const express = require('express')
const app = express()
const { db, query6,query7 } = require('./dbpg')

let PORT = 3000;
const SERVER_RECONNECT_TIMES = 6;
const SERVER_RECONNECT_COOL_TIME = 1000; // MLS

app.get('/', async  (req, res) =>{
    res.setHeader(
        "ngrok-skip-browser-warning", "69420"
    )
    let response
    try {
        const {rows} = await db.query(query7)
        console.log("-->",rows)
        res.send(rows)
        // res.send('hello world')
    } catch (err) {
        console.log(err.message)
        res.send(err)
    }
})

let counter = 0;

app.listen(PORT, () => console.log(`listening to port:${PORT}`))

process.on('exit', code => {
    console.log(`Process exited with code: ${code}`)
})
