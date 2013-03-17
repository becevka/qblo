/*
 * GET home page.
 */
exports.index = function (req, res) {
    var user = req.session.user;
    if (user) {
        res.render('dashboard', {title:'qblo', user:user});
    } else {
        res.render('index', {title:'qblo', error:''});
    }
};