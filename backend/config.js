
const app = require('express').Router()
var redis = require('./database/redis-db.js');
const { get_submissionTable_entry } = require('./database/redis-db.js');

/*app.get('/:type/:id', (req, res) => {
    if (req.params.type==="html")
    res.send(`Hello World!<br>${req.params.id}`)
    else if (req.params.type==="json")
    res.json({test: true, try: 1, id: req.params.id})
    else 
    res.send("<h3>Error: Could not parse the type of request.</h3> <p>Use html or json.</p>").status(404)
})*/
//req.body, x-www-form-urlencoded

async function redis_stuff (req, res){
    console.log("[POST] /redis Requested Redis")
    //res.json(['a', 'b', 'c'])

    //test create, get, update user
    await redis.create_userTable_entry(req.body.username1, undefined, req.body.userpswd1, req.body.email1, req.body.streak1, req.body.daysActive1, undefined, req.body.filespace1, req.body.usertype1, undefined)
    let u_id1 = await redis.getUserId(req.body.username1)
    await redis.create_userTable_entry(req.body.username2,undefined, req.body.userpswd2, req.body.email2, req.body.streak2, req.body.daysActive2, [u_id1], req.body.filespace2, req.body.usertype2, undefined, undefined)
    let u_id2 = await redis.getUserId(req.body.username2)
    let u_info1 = await redis.get_userTable_entry(u_id1, ["username", "password", "timestamp", "email", "streaks", "days_active", "fileSpace_used", "type", "submission", "friends"])
    let u_info2 = await redis.get_userTable_entry(u_id2, ["username", "password", "timestamp", "email", "streaks", "days_active", "fileSpace_used", "type", "submission", "friends"])
    //redis.update_userTable_entry(u_id1, {'password': 'abcde', 'email':'abc@gmail.com', 'streaks':90, 'friend_ids': [u_id2]})
    //u_info1 = await redis.get_userTable_entry(u_id1, ["username", "password", "timestamp", "email", "streaks", "days_active", "fileSpace_used", "type", "submission", "friends"])
    //redis.update_userTable_entry(u_id2, {'password': 'abcde', 'email':'abc@gmail.com', 'streaks':90})
    //u_info2 = await redis.get_userTable_entry(u_id2, ["username", "password", "timestamp", "email", "streaks", "days_active", "fileSpace_used", "type", "submission", "friends"])
    
    
    await redis.create_exerciseTable_entry(req.body.ex_name1, undefined, req.body.ex_diff1, req.body.ex_avg1, req.body.ex_sec1, req.body.ex_perf1, [u_id1, u_id2])
    let ex_id1 = await redis.getExerciseId(req.body.ex_name1)
    let ex_info1 = await redis.get_exerciseTable_entry(ex_id1, ['name', 'difficulty', 'avg_score', 'seconds_analysed','num_perf', 'ranking_difficulty', 'ranking_avgScore','users_active'])
    
    time1 = parseInt(Date.now()/1000)
    await redis.create_submissionTable_entry (req.body.ex_name1, req.body.username1, undefined, time1, req.body.sub_ori1, req.body.sub_kp1, req.body.sub_secs1, req.body.sub_score1, req.body.sub_diff1)
    let ex_u_id1 = await redis.getSubmissionsId(u_id1, time1)
    let ex_u_info1 = await redis.get_submissionTable_entry(ex_u_id1, u_id1, ['u_id', 'exercise_id', 'orientation', 'keypoints', 'seconds_analysed', 'overall_score', 'difficulty'])
    await redis.update_submissionTable_entry(ex_u_id1, u_id1, {'orientation': req.body.sub_ori2})
    ex_u_info1 = await redis.get_submissionTable_entry(ex_u_id1, u_id1, ['u_id', 'exercise_id', 'orientation', 'keypoints', 'seconds_analysed', 'overall_score', 'difficulty'])
    //res.status(200).send()
    //u_info1 = await redis.get_userTable_entry(u_id1, ["submission", "friends"])
    res.json({'user1 id': u_id1, 'user2 id': u_id2, 'user1 info': u_info1, 'user2 info': u_info2, "exercise1 id": ex_id1, "exercise1 info": ex_info1, "submission id": ex_u_id1, "submission info": ex_u_info1})
} 

app.post('/redis', redis_stuff)


module.exports = app