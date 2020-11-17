var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var DrawingSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  body: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

DrawingSchema.plugin(uniqueValidator, {message: 'is already taken'});

DrawingSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

DrawingSchema.methods.slugify = function() {
    console.log("this", this)
  this.slug = slug(this.drawing.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

DrawingSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Drawing', DrawingSchema);