/*
 * GET board.
 */
exports.board = function (req, res) {
    var id = req.param('id', null);
    if (!id) {
        res.json({error: 'Id must not be empty'});
    } else {
        req.boards.findOne({_id: id}, function (err, found) {
            if (err) {
                res.json(500, {error: err.message});
            } else {
                res.json(found);
            }
        });
    }
};


/*
 * POST new board.
 */
exports.create = function (req, res) {
    var name = req.param('name', null);
    if (!name) {
        res.json(500, {error: 'Name must not be empty'});
    } else {
        req.boards.findOne({name: name}, function (err, found) {
            if (err) {
                res.json(500, {error: err.message});
            } else if (found) {
                res.json(500, {error: 'Board with name ' + name + ' already exists'});
            } else {
                var user = req.session.user,
                    board = {name: name, users: [user.name], draws: []};
                req.boards.insert(board, function (err, inserted) {
                    if (err) {
                        res.json(500, {error: err.message});
                    } else {
                        res.json(inserted);
                    }
                });
                req.users.update({email: user.email}, {'$push': {boards: name}}, function () {
                });
            }
        });
    }
};
