 var Multierror = function(message) {
   this.err = new Error(message);
   this.err.errors = [];
 };

 Multierror.prototype.value = function() {
   return (this.err.errors.length == 0) ? null : this.err;
 }

 Multierror.prototype.add = function(error) {
   var ensure = (error instanceof Error) ? error : new Error(error);
   this.err.errors.push(ensure);
 }

 module.exports = Multierror;