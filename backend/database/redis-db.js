//import { v4 as uuidv4 } from 'uuid';
const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient();
//console.log(client);
var uuid = require('uuid').v4;

const promisified = ["set", "get", "hget", "sismember", "smembers", "exists", "sadd", "zrangebyscore", "hset", "expire", "hgetall", "hexists", "zrank", "zadd", "zscore", "zrange"];
for(let i = 0; i  < promisified.length; i++) {
  client["_" + promisified[i]] = client[promisified[i]];
  client[promisified[i]] = promisify(client["_" + promisified[i]]).bind(client);
}

client.on('connect', function() {
  console.log('Connected!');
});

function intersection(setA, setB) {
  let _intersection = new Set()
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem)
      }
  }
  return _intersection
}

async function create_userTable_entry(username, id="", password="", email="", streaks=0, daysActive = 0, friends_ids=[], filespaceUsed = 0, usertype = 0, submissions = [], timestamp=parseInt(Date.now()/1000)){
  if (id===""){
    id = uuid()
  }
  await client.hset("user_ids", username, id)
  await client.hset("user_ids_email", email, id)
  await client.hset("user_table:"+id, "username", username)
  await client.hset("user_table:"+id, "password", password)
  await client.hset("user_table:"+id, "timestamp", timestamp.toString())
  await client.hset("user_table:"+id, "email", email)
  await client.hset("user_table:"+id, "streaks", streaks)
  await client.hset("user_table:"+id, "days_active", daysActive)
  await client.hset("user_table:"+id, "fileSpace_used", filespaceUsed)
  await client.hset("user_table:"+id, "type", usertype)
  /*for (let i=0; i<submissions.length;i++){
    if (await client.hexists("submission_table:"+submissions[i], 'timestamp')){
      await client.sadd('user_table:'+id+':submissions', submissions[i])
    }
  }*/
  for (let i=0; i<friends_ids.length;i++){
    if (await client.hexists(`user_table:${friends_ids[i]}`, 'username') === 1){
      await client.sadd('user_table:'+id+':friends', friends_ids[i])
    }
    else {
      console.log("Error, friend "+friends_ids[i]+" doesn't exist")
    }
  }
}

async function update_userTable_entry (id, kwargs){
  if (await client.hexists ("user_table:"+id, "username")){
      let mutableUserTableColumns = new Set()
      mutableUserTableColumns.add('username').add( 'password').add('email').add('streaks').add('daysActive').add('filespaceUsed').add('usertype').add('friend_ids')
      let keys = new Set()
      for (let i =0; i<Object.keys(kwargs).length;i++){
        keys.add(Object.keys(kwargs)[i])
      }
      
      validHSetCols =  intersection(keys, mutableUserTableColumns)//set(kwargs.keys()).intersection(mutableUserTableColumns)
      if (validHSetCols.has('friend_ids')){ //friend_ids is the list of all friends not just additions/deletions
        if (await client.exists("user_table:"+id+":friends")) await client.delete("user_table:"+id+":friends")
          for (let i=0; i<kwargs.friend_ids.length; i++){
              if (await client.hexists ("user_table:"+kwargs.friend_ids[i], "username")) await client.sadd('user_table:'+id+':friends', kwargs.friend_ids[i])
              else console.log("Error, friend "+kwargs.friend_ids[i]+" doesn't exist")
            }
      }
      /*if (Object.keys(kwargs).includes('submissions')){ //submissions is a list of new submissions
        for (let i=0; i<kwargs.submissions.length;i++){
          await client.sadd("user_table:"+id+":submissions", kwargs.submissions[i])
        }
      }*/
      for(let col of validHSetCols){
        if (col!='submissions' && col!='friend_ids') await client.hset('user_table:'+id, col, kwargs[col])
        if (col==='email') {
          old_email = await get_userTable_entry(id, ['email']).email
          await client.hdel("user_ids_email", old_email)
          await client.hset("user_ids_email", kwargs[col], id)
        }
        if (col==='username') {
          old_username = await get_userTable_entry(id, ['username']).username
          await client.hdel("user_ids", old_username)
          await client.hset("user_ids", kwargs[col], id)
        }
      }
  }
  else console.log("Error, user doesn't exist")
}

async function get_userTable_entry (id, params=[]){
  //console.log(`user_table:${id}`)
  if (await client.hexists (`user_table:${id}`, "username")){
    
    let functions = {
      ///in python we had lambda function for these await calls
      'username' : await client.hget(`user_table:${id}`, "username"),
      'password' : await client.hget(`user_table:${id}`, "password"),
      'timestamp' : await client.hget(`user_table:${id}`, "timestamp"),
      'email' : await client.hget(`user_table:${id}`, "email"),
      'streaks' : await client.hget(`user_table:${id}`, "streaks"),
      'days_active' : await client.hget(`user_table:${id}`, "days_active"),
      'fileSpace_used' : await client.hget(`user_table:${id}`, "fileSpace_used"),
      'type' : await client.hget(`user_table:${id}`, "type"),
      'submissions' : await client.zrange(`user_table:${id}:submissions`, 0, -1),
      //in python we made a map and then made that a set
      'friends' : await client.smembers(`user_table:${id}:friends`),
    }
    let keys = intersection(new Set(Object.keys(functions)),new Set(params))
    if (params===undefined){
      keys = new Set(Object.keys(functions))
    }
    let ret = {}
    for (let i of keys) {
      if (i==='submission' || i==='friends'){
        ret[i] = Array.from(functions[i])
      }
      else ret[i] = functions[i]
    }
    for (let i=0; i<Object.keys(ret).length;i++) {
      if (ret[Object.keys(ret)[i]] ===undefined || ret[Object.keys(ret)[i]]===null ){
        ret[Object.keys(ret)[i]] = '' 
      } else ret[Object.keys(ret)[i]]
    }
    return ret
  }
  else console.log ("Error, user doesn't exist")
}

async function getUserId(username){
  let x = await client.hget("user_ids", username)
  //if (x) return decodeURIComponent(x)
  return x
}

async function create_exerciseTable_entry(name, id = "", difficulty = 0, avg_score = 0, seconds_analysed=0, num_perf = 0, usersActive = []){
  if (id===""){
      id = uuid()
  }
  await client.hset("exercise_ids", name, id)
  await client.hset("exercise_table:" + id, "name", name)
  await client.hset("exercise_table:" + id, "difficulty", difficulty)
  await client.hset("exercise_table:" + id, "avg_score", avg_score)
  await client.hset("exercise_table:" + id, "seconds_analysed", seconds_analysed)
  await client.hset("exercise_table:" + id, "num_perf", num_perf)
  await client.zadd("ranking_exercise_difficulty", difficulty, id)
  await client.zadd("ranking_exercise_avgScore", avg_score, id)
  for (let i=0; i<usersActive.length; i++){
    if (await client.hexists("user_table:"+usersActive[i], "username")){
      await client.sadd("exercise_table:"+id+":users_active", usersActive[i])
    }
    else console.log("Error, user "+usersActive[i]+" doesn't exist")
  }
      
}

async function update_exerciseTable_entry (id, kwargs){
  if (await client.hexists("exercise_table:"+id, "name") === 1){
      let mutableExerciseTableColumns = new Set()  
      mutableExerciseTableColumns.add('name').add('difficulty').add('avg_score').add('seconds_analysed').add('num_perf')
      validHSetCols =  intersection(new Set(Object.keys(kwargs)), mutableExerciseTableColumns)
      for(let col of validHSetCols){
        await client.hset(`exercise_table:${id}`, col, kwargs[col])
        if (col === 'difficulty') await client.zadd("ranking_exercise_difficulty", kwargs.difficulty, id)
        if (col ==='avg_score') await client.zadd("ranking_exercise_avgScore", kwargs.avg_score, id)
      }
  
      if (Object.keys(kwargs).includes('activeUsers')){ //activeUsers is a list of the ids of ALL active users  
        if (await client.exists(`exercise_table:${id}:users_active`)) await client.delete(`exercise_table:${id}:users_active`)
          for (let i=0; i<kwargs['activeUsers'].length;i++){
              if (await client.hexists(`user_table:${kwargs.activeUsers[i]}`, "username")) client.sadd(`exercise_table:${id}:users_active`, kwargs.activeUsers[i])
              else console.log(`Error, user ${kwargs.activeUsers[i]} doesn't exist`)
          }
      }
    }
  else console.log("Error, exercise doesn't exist")
}

async function get_exerciseTable_entry (id, params=[]){
  if (client.hexists (`exercise_table:${id}`, "name")){
    functions = {
      'name': await client.hget(`exercise_table:${id}`, "name"),
      'difficulty' : await client.hget(`exercise_table:${id}`, "difficulty"),
      'avg_score' : await client.hget(`exercise_table:${id}`, "avg_score"),
      'seconds_analysed' : await client.hget(`exercise_table:${id}`, "seconds_analysed"),
      'num_perf' : await client.hget(`exercise_table:${id}`, "num_perf"),
      'ranking_difficulty' : await client.zrank("ranking_exercise_difficulty", id),
      'ranking_avgScore' : await client.zrank("ranking_exercise_avgScore", id),
      'users_active' : await client.smembers(`exercise_table:${id}:users_active`)
    }
    keys = intersection(new Set(Object.keys(functions)),new Set(params))
    ret = {}
    for (let i of keys) {
      if (i==='submission' || i==='friends'){
        ret[i] = Array.from(functions[i])
      }
      else ret[i] = functions[i]
    }
    for (let i=0; i<Object.keys(ret).length; i++) {
      if (ret[Object.keys(ret)[i]] === undefined){
        ret[Object.keys(ret)[i]] = ''
      }
      else{
        ret[Object.keys(ret)[i]] = ret[Object.keys(ret)[i]]
      }
    }
    return ret
  }
  else console.log("Error, exercise doesn't exist")
}

async function getExerciseId(id){
  let x = await client.hget("exercise_ids", id)
  if (x) return decodeURIComponent(x)
  return x
}

async function create_submissionTable_entry (exercise_name, username, id="", timestamp = parseInt(Date.now()/1000), orientation = "", keypoints = "", seconds_analysed=0, overall_score = 0, difficulty = 0){ //keypoints will be the path to a file with keypoints
  if (id===""){
    id = uuid()
  }
  if (client.hexists("user_ids", username) && client.hexists("exercise_ids", exercise_name)){
      u_id = await getUserId(username)
      e_id = await getExerciseId(exercise_name)
      console.log(u_id, e_id)
      //seconds_analysed = toString(seconds_analysed)
      await client.zadd(`user_table:${u_id}:submissions`, timestamp, id)
      await client.hset(`user_table:${u_id}:submission:${id}`, "u_id", u_id)
      await client.hset(`user_table:${u_id}:submission:${id}`, "e_id", e_id)
      await client.hset(`user_table:${u_id}:submission:${id}`, "timestamp", timestamp.toString())
      await client.hset(`user_table:${u_id}:submission:${id}`, "orientation", orientation)
      await client.hset(`user_table:${u_id}:submission:${id}`, "keypoints", keypoints)
      await client.hset(`user_table:${u_id}:submission:${id}`, "seconds_analysed", seconds_analysed)
      await client.hset(`user_table:${u_id}:submission:${id}`, "overall_score", overall_score)
      await client.hset(`user_table:${u_id}:submission:${id}`, "difficulty", difficulty)
  }
  else console.log("Error, either username or exercise doesn't exist.")
}

async function getSubmissionsId(u_id, timestamp){
  return await client.zrangebyscore(`user_table:${u_id}:submissions`, timestamp, timestamp)
  //return await client.zscore(`user_table:${u_id}:submissions`, timestamp)
}

async function getSubTimestamp(u_id, subID){
  return (await client.zscore(`user_table:${u_id}:submissions`, subID))*1000
}

async function update_submissionTable_entry (id, u_id, kwargs){
    if (await client.hexists(`user_table:${u_id}:submission:${id}`, "u_id")){
        let mutableSubmissionTableColumns = new Set()
        mutableSubmissionTableColumns.add('orientation').add('keypoints').add('overall_score').add('seconds_analysed').add('difficulty')
        validHSetCols =  intersection(new Set(Object.keys(kwargs)), mutableSubmissionTableColumns)
        for(let col of validHSetCols){
          await client.hset(`user_table:${u_id}:submission:${id}`, col, kwargs[col])
        }
    }
    else console.log("Error, submission doesn't exist")
}

async function get_submissionTable_entry (id, u_id, params=[]){ 
  if (client.hexists (`submission_table:${id}`, "u_id")){
      functions = {
        //'u_id': await client.hget(`submission_table:${id}`, "u_id"),
        'exercise_id': await client.hget(`user_table:${u_id}:submission:${id}`, "e_id"),
        'timestamp': await client.hget(`user_table:${u_id}:submission:${id}`, "timestamp"),
        'orientation': await client.hget(`user_table:${u_id}:submission:${id}`, "orientation"),
        'keypoints': await client.hget(`user_table:${u_id}:submission:${id}`, "keypoints"),
        'seconds_analysed': await client.hget(`user_table:${u_id}:submission:${id}`, "seconds_analysed"),
        'overall_score': await client.hget(`user_table:${u_id}:submission:${id}`, "overall_score"),
        'difficulty': await client.hget(`user_table:${u_id}:submission:${id}`, "difficulty")
      }
      if (params.length === 0) keys = new Set(Object.keys(functions))
      else keys = Array.from(intersection(new Set(params), new Set(Object.keys(functions))))
      ret = {}
      for (let i=0 ;i<keys.length; i++){
        ret[keys[i]] = functions[keys[i]]
      }
      for (let i=0; i<Object.keys(ret).length; i++){
        if (ret[Object.keys(ret)[i]] === undefined){
          ret[Object.keys(ret)[i]] = ''
        }
      }
      return ret
  }
  else console.log ("Error, submission doesn't exist.")
}

async function verifyLogin(username, password) {
  if (username === "" || password === "" || username === null || password === null || username === undefined || password === undefined) {
    return false;
  }
  const userId = await getUserId(username)
  if (!userId) return false;
  const real_password = (await get_userTable_entry(userId, ['password']))['password']
  if (real_password === password) {
    return createToken(userId)
  }
  return false;
};

async function createToken(userId){
  const token = uuid();
  //console.log(token);
  await client.set(`tokens:${userId}`, token);
  await client.expire(`tokens:${userId}`, 15 * 60 * 60);
  return token;
}

async function verifyToken(userId, token){
  return (client.exists(`tokens:${userId}`, token))
}

async function createOneTimeToken(userId){
  const token = uuid();
  //console.log(token);
  await client.set(`tokens:${userId}`, token);
  await client.expire(`tokens:${userId}`, 24 * 60 * 60);
  return token;
}

async function usernameExists(username){
  //console.log(await client.hexists("user_ids", username))
  return await client.hexists("user_ids", username)
  
}

async function emailExists(email){
  //console.log(await client.hexists("user_ids_email", email))
  return await client.hexists("user_ids_email", email)
}


module.exports = {
  emailExists,
  usernameExists,
  getSubTimestamp,
  createOneTimeToken,
  createToken,
  verifyToken,
  verifyLogin,
  update_userTable_entry,
  create_exerciseTable_entry,
  create_userTable_entry,
  create_submissionTable_entry,
  update_exerciseTable_entry,
  update_submissionTable_entry,
  getUserId,
  getExerciseId,
  getSubmissionsId,
  get_exerciseTable_entry,
  get_userTable_entry,
  get_submissionTable_entry
}
