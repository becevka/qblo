/*
 * POST authorization.
 */

var crypto = require('crypto');

exports.login = function (req, res) {
    var user = req.session.user;
    if (user) {
        res.redirect('/');
    } else {
        getUser(req, function (err, user) {
            if (err) {
                res.render('index', {title: 'qblo', error: err });
            } else {
                req.session.user = user;
                res.redirect('/');
            }
        });
    }
};

exports.auth = function (req, res) {
    getUser(req, function (err, user) {
        if (err) {
            res.json({error: err });
        } else {
            req.session.user = user;
            res.json(user);
        }
    });
};

exports.logout = function (req, res) {
    req.session = null;
    res.redirect('/');
};

/*
 * GET dashboard.
 */
exports.dashboard = function (req, res) {
    res.send({name: req.body.user, pass: req.body.pass});
};


getUser = function (req, callback) {
    var email = req.param('email', null);
    var pass = req.param('pass', null);
    if (email == null || pass == null) {
        callback('email and password must be not empty!', null);
    } else {
        req.users.findOne({email: email}, {email: 1, password: 1, name: 1}, function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                var password = hash(pass);
                if (found) {
                    if (password != found.password) {
                        callback('password was incorrect', null);
                    } else {
                        callback(null, found);
                    }
                } else {
                    req.users.insert({email: email, password: password, name: name(email)}, function (err, inserted) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, inserted[0]);
                        }
                    });
                }
            }

        });
    }

};


name = function (email) {
    return email.split("@")[0];
};

hash = function (password) {
    return crypto.createHash('sha512').update('_%#qbloS*A*L*T', 'binary').update(password, 'utf8').digest()
};
