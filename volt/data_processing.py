from hashlib import sha256
import redis_main as r


hash = lambda password: sha256(password.rstrip()).hexdigest()

verify_username = lambda username: r.getUserId(username) is not None

def verify_pass(username, password):
    return password == r.get_userTable_entry(r.getUserId(username), params=["password"])['password']



#enc(plaintext) => server => hashed => db