function errorHandler (err, req, res, next) {
    
    // token expired
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: "Session expired, try to log in again"})
    }

    // validation error
    if (err.name === 'ValidationError') {
        return res.status(401).json({message: err})
    }
    
    // default case error
    return res.status(500).json({message: "illeagl address"})
}

export default errorHandler