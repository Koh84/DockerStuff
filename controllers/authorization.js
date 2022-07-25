const redisClient = require('./signin').redisClient;

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).json('Unauthorized');
    }
    
    const value = await redisClient.get(authorization);
    if(value) {
        console.log('token is valid in redisClient');
        return next();
    } else {
        console.log('error in redisClient.get');
        return res.status(401).json('Unauthorized');
    }
}

module.exports = {
    requireAuth: requireAuth
}