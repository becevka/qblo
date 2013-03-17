/*
 * GET board.
 */


exports.user = function(req, res){
    res.send({name:req.body.user, pass:req.body.pass});
};
