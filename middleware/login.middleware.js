const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(400).json({message: "Please, log in again."});
    }
}

module.exports = isLoggedIn;