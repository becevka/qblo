/*
 * POST authorization.
 */

var crypto = require('crypto');

exports.user = function (req, res) {
    res.json(req.session.user);
};

exports.auth = function (req, res) {
    getUser(req, function (err, user) {
        if (err) {
            console.error(err.stack);
            res.json(500, {error: err.message });
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
    var user = req.session.user;
    if (!user) {
        res.json([]);
    } else {
        req.users.findOne({email: user.email}, {password: 0}, function (err, found) {
            if (err) {
                console.error(err.stack);
                res.json(500, {error: err.message});
            } else {
                if (!found) {
                    res.json(500, {error: 'session user not found'});
                } else {
                    var arr = found.boards;
                    if (!arr) {
                        arr = [];
                    }
                    req.boards.find({'name': {'$in': arr}}, {draws: 0}).toArray(function (err, items) {
                        if (err) {
                            console.error(err.stack);
                            res.json(500, {error: err.message});
                        } else {
                            res.json(items);
                        }
                    });
                }
            }
        });
    }
};

function getUser(req, callback) {
    var email = req.param('email', null),
        pass = req.param('pass', null);
    if (!email || !pass) {
        callback(new Error('email and password must be not empty!'), null);
    } else {
        req.users.findOne({email: email}, {email: 1, password: 1, name: 1}, function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                var password = getHash(pass);
                if (found) {
                    if (password !== found.password) {
                        callback(new Error('password was incorrect'), null);
                    } else {
                        callback(null, found);
                    }
                } else {
                    var user = {email: email, password: password, name: getName(email), boards: []};
                    req.users.insert(user, function (err, inserted) {
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

}


function getName(email) {
    return email.split("@")[0];
}

function getHash(password) {
    return crypto.createHash('sha512').update('_%#qbloS*A*L*T', 'binary').update(password, 'utf8').digest();
}
