// middleware functions
const userAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const isAdmin = function (req, res, next) {
    if (req.user.role === 'admin') return next();
    else res.sendStatus(403);
}

module.exports = {
    isAdmin,
    userAuthenticated
};