import redis
from uuid import uuid4 as uuid
import time

print(redis)
r = redis.Redis(host='localhost', port=6379, db=0)

def create_exerciseTable_entry (name, id = "", difficulty = 0, avg_score = 0, seconds_analysed=0, num_perf = 0, usersActive = []):
    id = id if id else uuid()
    r.hset("exercise_ids", name, str(id))
    r.hset(f"exercise_table:{id}", "name", name)
    r.hset(f"exercise_table:{id}", "difficulty", difficulty)
    r.hset(f"exercise_table:{id}", "avg_score", avg_score)
    r.hset(f"exercise_table:{id}", "seconds_analysed", seconds_analysed)
    r.hset(f"exercise_table:{id}", "num_perf", num_perf)
    r.zadd("ranking_exercise_difficulty", {str(id): difficulty})
    r.zadd("ranking_exercise_avgScore", {str(id): avg_score})
    for i in usersActive:
        if r.hexists (f"user_table:{i}", username): 
            r.sadd(f"exercise_table:{id}:users_active", i)
        else:
            print (f"Error, user {i} doesn't exist")

def create_userTable_entry (username, id="", password="", timestamp=time.time(), email="", streaks=0, daysActive = 0, friends_ids=[], filespaceUsed = 0, usertype = 0, submissions = []):
    id = id if id else uuid()
    r.hset("user_ids", username, str(id))
    r.hset(f"user_table:{id}", "username", username)
    r.hset(f"user_table:{id}", "password", password)
    r.hset(f"user_table:{id}", "timestamp", timestamp)
    r.hset(f"user_table:{id}", "email", email)
    r.hset(f"user_table:{id}", "streaks", streaks)
    r.hset(f"user_table:{id}", "days_active", daysActive)
    r.hset(f"user_table:{id}", "fileSpace_used", filespaceUsed)
    r.hset(f"user_table:{id}", "type", usertype)
    for i in submissions:
        if r.hexists(f"submission_table:{i}", timestamp):
            r.sadd(f'user_table:{id}:submissions', i)
    #r.zadd(f'user_table:{id}:rankings_per_excercise', {'temp': 0})
    #r.zrem(f'user_table:{id}:rankings_per_excercise', 'temp')
    for i in friends_ids:
        if r.hexists (f"user_table:{i}", username): 
            r.sadd(f'user_table:{id}:friends', i)
        else:
            print (f"Error, friend {i} doesn't exist")

def create_submissionTable_entry (exercise_name, username, id="", timestamp = time.time(), orientation = "", keypoints = "", seconds_analysed=0, overall_score = 0, difficulty = 0): #keypoints will be the path to a file with keypoints
    id = id if id else uuid()
    if r.hexists("user_ids", username) and r.hexists("exercise_ids", exercise_name):
        r.hset(f"submission_table:{id}", "u_id", r.hget("user_ids", username))
        u_id = r.hget("user_ids", username)
        r.hset(f"submission_table:{id}", "e_id", r.hget("exercise_ids", exercise_name))
        r.hset(f"submission_table:{id}", "timestamp", timestamp)
        r.hset(f"submission_table:{id}", "orientation", orientation)
        r.hset(f"submission_table:{id}", "keypoints", keypoints)
        r.hset(f"submission_table:{id}", "seconds_analysed", seconds_analysed)
        r.hset(f"submission_table:{id}", "overall_score", overall_score)
        r.hset(f"submission_table:{id}", "difficulty", difficulty)
        update_userTable_entry(u_id.decode('utf-8'), submissions=[id])
    else:
        print ("Error, either username or exercise doesn't exist.")


def update_userTable_entry (id, **kwargs):
    if r.hexists (f"user_table:{id}", "username"):
        mutableUserTableColumns = set({'username', 'password', 'email', 'streaks', 'daysActive', 'filespaceUsed', 'usertype'})
        validHSetCols =  set(kwargs.keys()).intersection(mutableUserTableColumns)
        if 'friends_ids' in kwargs.keys(): #friends_ids is the list of all friends not just additions/deletions
            if r.exists(f"user_table:{id}:friends"):
                r.delete(f"user_table:{id}:friends")
            for i in kwargs['friends_ids']:
                print (i)
                if r.hexists (f"user_table:{i}", "username"): 
                    r.sadd(f'user_table:{id}:friends', i)
                else:
                    print (f"Error, friend {i} doesn't exist")
        if 'submissions' in kwargs.keys(): #submissions is a list of new submissions
            for i in kwargs['submissions']:
                #print (i)
                r.sadd(f'user_table:{id}:submissions', str(i))
        for i in validHSetCols:
            r.hset(f'user_table:{id}', i, kwargs.get(i))
            #r.hset(f'user_table:{id}', [i, kwargs.get(i) for i in validHSetCols])
    else:
        print ("Error, user doesn't exist")

def update_exerciseTable_entry (id, **kwargs):
    if r.hexists(f"exercise_table:{id}", "name"):
        mutableExerciseTableColumns = set({'name', 'difficulty', 'avg_score', 'seconds_analysed', 'num_perf'})
        validHSetCols =  set(kwargs.keys()).intersection(mutableExerciseTableColumns)
        for i in validHSetCols:
            r.hset(f'exercise_table:{id}', i, kwargs.get(i))
            if i == 'difficulty':
                r.zadd("ranking_exercise_difficulty", {str(id): kwargs.get('difficulty')})
            if i=='avg_score':
                r.zadd("ranking_exercise_avgScore", {str(id): kwargs.get('avg_score')})
            #r.hset(f'exercise_table:{id}', [i, kwargs.get(i) for i in validHSetCols])
        if 'activeUsers' in kwargs.keys(): #activeUsers is a list of the ids of ALL active users
            if r.exists(f"exercise_table:{id}:users_active"):
                r.delete(f"exercise_table:{id}:users_active")
            for i in kwargs['activeUsers']:
                if r.hexists (f"user_table:{i}", "username"): 
                    r.sadd(f'exercise_table:{id}:users_active', i)
                else:
                    print (f"Error, user {i} doesn't exist")
    else:
        print ("Error, exercise doesn't exist")

def update_submissionTable_entry (id, **kwargs):
    if r.hexists(f"submission_table:{id}", "u_id"):
        mutableSubmissionTableColumns = set({'orientation', 'keypoints', 'overall_score', 'seconds_analysed', 'difficulty'})
        validHSetCols =  set(kwargs.keys()).intersection(mutableSubmissionTableColumns)
        for i in validHSetCols:
            r.hset(f'submission_table:{id}', i, kwargs.get(i))
            #r.hset(f'submission_table:{id}', [i, kwargs.get(i) for i in validHSetCols])
    else:
        print ("Error, submission doesn't exist")

def getUserId(username):
    x = r.hget("user_ids", username)
    if x:
        return x.decode('utf-8')

def get_exerciseTable_entry (id, param=[]):
    if r.hexists (f"exercise_table:{id}", "name"):
        functions = {
            'name': lambda: r.hget(f"exercise_table:{id}", "name", name).decode('utf-8'),
            'difficulty' : lambda: r.hget(f"exercise_table:{id}", "difficulty", difficulty).decode('utf-8'),
            'avg_score' : lambda: r.hget(f"exercise_table:{id}", "avg_score", avg_score).decode('utf-8'),
            'seconds_analysed' : lambda: r.hget(f"exercise_table:{id}", "seconds_analysed", seconds_analysed).decode('utf-8'),
            'num_perf' : lambda: r.hget(f"exercise_table:{id}", "num_perf", num_perf).decode('utf-8'),
            'ranking_difficulty' : lambda: r.zrank("ranking_exercise_difficulty", str(id)).decode('utf-8'),
            'ranking_avgScore' : lambda: r.zrank("ranking_exercise_avgScore", str(id)).decode('utf-8'),
            'users_active' : lambda: set(map(lambda x: x.decode('utf-8'), r.smembers(f"exercise_table:{id}:users_active")))
        }
        keys = set(params).intersection(set(functions.keys()))
        ret = {}
        for i in keys:
            ret[i] = functions[i]()
        for i in ret.keys():
            ret[i] = '' if ret[i] is None else ret[i]
        return ret
    else:
        print ("Error, exercise doesn't exist")

def get_submissionTable_entry (id, params=[]): 
    if r.hexists (f"submission_table:{id}", "u_id"):
        functions = {
            'u_id': lambda: r.hget(f"submission_table:{id}", "u_id").decode('utf-8'),
            'exercise_id': lambda: r.hget(f"submission_table:{id}", "e_id").decode('utf-8'),
            'timestamp': lambda: r.hget(f"submission_table:{id}", "timestamp").decode('utf-8'),
            'orientation': lambda: r.hget(f"submission_table:{id}", "orientation").decode('utf-8'),
            'keypoints': lambda: r.hget(f"submission_table:{id}", "keypoints").decode('utf-8'),
            'seconds_analysed': lambda: r.hget(f"submission_table:{id}", "seconds_analysed").decode('utf-8'),
            'overall_score': lambda: r.hget(f"submission_table:{id}", "overall_score").decode('utf-8'),
            'difficulty': lambda: r.hget(f"submission_table:{id}", "difficulty").decode('utf-8')
        }
        keys = set(params).intersection(set(functions.keys()))
        keys = set(functions.keys()) if params is None else keys
        ret = {}
        for i in keys:
            ret[i] = functions[i]()
        for i in ret.keys():
            ret[i] = '' if ret[i] is None else ret[i]
        return ret
    else:
        print ("Error, submission doesn't exist.")

def get_userTable_entry (id, params=[]):
    if r.hexists (f"user_table:{id}", "username"):
        functions = {
            'username' : lambda: r.hget(f"user_table:{id}", "username").decode('utf-8'),
            'password' : lambda: r.hget(f"user_table:{id}", "password").decode('utf-8'),
            'timmp' : lambda: r.hget(f"user_table:{id}", "timestamp").decode('utf-8'),
            'email' : lambda: r.hget(f"user_table:{id}", "email").decode('utf-8'),
            'streaks' : lambda: r.hget(f"user_table:{id}", "streaks").decode('utf-8'),
            'days_active' : lambda: r.hget(f"user_table:{id}", "days_active").decode('utf-8'),
            'fileSpace_used' : lambda: r.hget(f"user_table:{id}", "fileSpace_used").decode('utf-8'),
            'type' : lambda: r.hget(f"user_te:{id}", "type").decode('utf-8'),
            'submission' : lambda: set(map(lambda x: x.decode('utf-8'), r.smembers(f'user_table:{id}:submissions'))),
            'friends' : lambda: set(map(lambda x: x.decode('utf-8'), r.smembers(f'user_table:{id}:friends'))),
        }
        keys = set(params).intersection(set(functions.keys()))
        keys = set(functions.keys()) if params is None else keys
        ret = {}
        for i in keys:
            ret[i] = functions[i]()
        for i in ret.keys():
            ret[i] = '' if ret[i] is None else ret[i]
        return ret
    else:
        print ("Error, user doesn't exist")
    

#create_userTable_entry("a")
print (getUserId("a"))
print(get_userTable_entry(getUserId("a")))
print(get_userTable_entry(getUserId("b"), params = ["username", "email", "password"]))
#create_userTable_entry("b")
#create_userTable_entry("c")
#update_userTable_entry(getUserId("a"), friends_ids = [getUserId("b"), getUserId("c")])
#create_exerciseTable_entry("lunge")
#create_exerciseTable_entry("squat")
#create_submissionTable_entry ("lunge", "a")
#create_submissionTable_entry ("squat", "b")
#update_userTable_entry("80df6627-c7ec-404e-bddf-adcd896ff05b", password="abcdef", daysActive = 7, friends_ids = ["8a9689a9-6931-40c8-887d-45690f751d0a"])
#update_exerciseTable_entry("df250230-f06d-4698-b3fb-6d92163c27a9", difficulty = 7, activeUsers = ["80df6627-c7ec-404e-bddf-adcd896ff05b"])
#update_submissionTable_entry("00bcf97e-4b0c-46ec-9786-c1149c175334", overall_score = 8, difficulty = 4)