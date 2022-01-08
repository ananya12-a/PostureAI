const app = require('express').Router();
const { get_submissionTable_entry, getSubTimestamp, verifyLogin, getUserId, create_userTable_entry, verifyToken, get_userTable_entry, createOneTimeToken, update_userTable_entry, create_submissionTable_entry, get_exerciseTable_entry } = require('./database/redis-db.js');

app.post('/get-submission-list/number/:start/:end', async (req,res) => {
    console.log(req.body.user_id , req.body.username , req.params.start , req.params.end)
    if (req.body.user_id && req.body.username && req.params.start && req.params.end){
        const subs = (await get_userTable_entry(req.body.user_id, ['submissions'])).submissions
        const timestamps = []
        for (let i=0; i<subs.length; i++){
            let x = await getSubTimestamp(req.body.user_id, subs[i])
            timestamps.push(x)
        }

        if (await verifyToken(req.body.user_id, req.body.token)) {
            return res.json({
                submissions: subs.slice(req.params.start, req.params.end),
                timestamps: timestamps.slice(req.params.start, req.params.end)
            })
        } else {
            return res.status(403).json({
                invalidToken: true,
            })
        }
        
        
    }
    else res.status(403).send()
})

app.post('/get-submission-list/date/:start/:end', async (req,res) => {
    
    if (req.body.user_id && req.body.username && req.params.start && req.params.end){
        const subs = (await get_userTable_entry(req.body.user_id, ['submissions'])).submissions
        const timestamps = []
        const start_date = new Date(parseInt(req.params.start))
        const end_date =  new Date(parseInt(req.params.end))
        console.log("date", start_date, end_date)
        let start=0
        let end=0
        for (let i=0; i<subs.length; i++){
            let x = await getSubTimestamp(req.body.user_id, subs[i])
            timestamps.push(x)
            if (timestamps[i]<=start_date) start=i
            if (timestamps[i]<=end_date) end=i
        }
        console.log(start, end)
        //put into redis /1000 and to take it out *1000
        if (await verifyToken(req.body.user_id, req.body.token)) {
            return res.json({
                submissions: subs.slice(start, end),
                timestamps: timestamps.slice(start, end),
            })
        } else {
            return res.status(403).json({
                invalidToken: true,
            })
        }
        
    }
    else res.status(403).send()
})

app.post('/get-submission-data', async (req,res) => {
    if (req.body.submissionID){
        const data = await get_submissionTable_entry(req.body.submissionID, req.body.user_id, ['exercise_id', 'orientation', 'keypoints', 'seconds_analysed','overall_score', 'difficulty', 'timestamp'])
        data['exercise'] = (await get_exerciseTable_entry(data['exercise_id'], ['name'])).name
        delete data['exercise_id']
        data['invalidToken'] = await verifyToken(req.body.user_id, req.body.token)
        
        if (await verifyToken(req.body.user_id, req.body.token)) {
            return res.json(data)
        } else {
            return res.status(403).json({
                invalidToken: true,
            })
        }
    }
    else res.status(403).send()
})

module.exports = app;