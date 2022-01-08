const app = require('express').Router();
const { get_submissionTable_entry, verifyLogin, getUserId, create_userTable_entry, verifyToken, get_userTable_entry, createOneTimeToken, update_userTable_entry } = require('./database/redis-db.js');

app.post('/get-friends-list', async (req,res) => {
    console.log(req.body.user_id, req.body.token)
    if (req.body.user_id){
        const userID = req.body.user_id
        const friends = (await get_userTable_entry(userID, ['friends'])).friends
        for (let i=0; i<friends.length; i++){
            friends[i] = (await get_userTable_entry(friends[i], ['username'])).username
        }
        res.json({
            friends: friends,
            invalidToken: await verifyToken(req.body.user_id, req.body.token)
        });
    }
    else res.status(403).send()
})

app.post('/get-public-info', async (req, res) => {
    
    if (req.body.user_id){
        if (req.body.friendusername || req.body.friendID){
            if (!req.body.friendID) friendID = await getUserId(req.body.friendusername)
            else friendID = req.body.friendID
            const public_data = ['username', 'timestamp', 'streaks','days_active', 'type']
            if (req.body.filter) filteredArray = public_data.filter(value => req.body.filter.includes(value));
            else filteredArray = public_data
            const data = await get_userTable_entry(friendID, filteredArray)
            data ['invalidToken']= await verifyToken(req.body.user_id, req.body.token)
            res.json(data)
        }
        else res.send(401)
    }
    else res.status(403).send()
})

module.exports = app;