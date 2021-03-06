module.exports = Result;
var Writable = require("stream").Writable;
var util = require("util");

function Result(csvParser) {
  Writable.call(this);
  this.parser = csvParser;
  this.buffer = "["+csvParser.getEol();
  this.started = false;
  var self = this;
  this.parser.on("end", function() {
    self.buffer += self.parser.getEol() + "]";
  });
}
util.inherits(Result, Writable);
Result.prototype._write = function(data, encoding, cb) {
  if (encoding == "buffer") {
    encoding = "utf8";
  }
  if (this.started) {
    this.buffer += "," + this.parser.getEol();
  } else {
    this.started = true;
  }
  this.buffer += data.toString(encoding);
  cb();
}

Result.prototype.getBuffer = function() {
  return JSON.parse(this.buffer);
}

Result.prototype.disableConstruct = function() {
  this._write = function(d, e, cb) {
    cb(); //do nothing just dropit
  }
}
