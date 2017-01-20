var mongoose = require("mongoose")

var demoSchema = new mongoose.Schema({
  text: String,
  creatAt: {
    type: Date,
    default: Date.now()
  }
});

demoSchema.pre('save', function(next){
  if(this.isNew){
    this.creatAt = Date.now();
  }
  next()
});

var Demo = mongoose.model('Demo', demoSchema);

module.exports = Demo