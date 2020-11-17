var router = require('express').Router();
var mongoose = require('mongoose');
var Drawing = mongoose.model('Drawing');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload drawing objects on routes with ':drawing'
router.param('drawing', function(req, res, next, slug) {
    Drawing.findOne({ slug: slug})
    .populate('author')
    .then(function (article) {
      if (!article) { return res.sendStatus(404); }

      req.drawing = drawing;

      return next();
    }).catch(next);
});

router.post('/', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
      if (!user) { return res.sendStatus(401); }
  
      var drawing = new Drawing(req.body.drawing);
  
      drawing.author = user;
  
      return drawing.save().then(function(){
        console.log(drawing.author);
        return res.json({drawing: drawing.toJSONFor(user)});
      });
    }).catch(next);
  });

  module.exports = router;