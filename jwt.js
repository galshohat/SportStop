const {expressjwt: jwt} = require('express-jwt')

function auth() {
    const secretKey = process.env.secretKey
    const api = process.env.A
    return jwt({
        secret: secretKey,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        // no need to check for auth if we are in these routes
        path: [
            /\/api\/v1\/categories(.*)/,
            '/',
            '/api/v1/users/login',
            '/api/v1/users/signup',
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS']}
        ]
    })
}

// any authroized api url and user is not admin is rejected
async function isRevoked(req, payload, done) {
    
    if (!payload.isAdmin) {
        done(null, true)
    }

    done()
}


module.exports = auth