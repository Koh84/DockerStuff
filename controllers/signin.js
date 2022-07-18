const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URI,
    //legacyMode: true,
});

redisClient.connect();

const handleSignin = (db, bcrypt, req, res) =>{
    const { email, password } = req.body;
    if(!email || !password) {
        return Promise.reject('incorrect form submission');
    }

    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => user[0])
            .catch(err => Promise.reject('unable to get user'))
        } else {
            Promise.reject('wrong credentials');
        }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = () => {
    console.log('auth ok');
}

const signToken = (email) => {
    //replace JWT-SECRET with process environment variable in the future
    const jwtPayload = { email };
    return jwt.sign({ jwtPayload }, 'JWT-SECRET', { expiresIn:'2 days' });
}

const setToken = async (key, value) => {
    return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
    //create JWT token and return user data
    const { email, id } = user;
    const token = signToken(email);
    //return {success: 'true', userId: id, token: token} 
    return setToken(token, id)
    .then(() => { 
        return {success: 'true', userId: id, token: token} 
    })
    .catch(console.log);
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId() : 
        handleSignin(db, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ? createSessions(data) : Promise.reject(data);
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err));
}

module.exports = {
    signinAuthentication: signinAuthentication
}