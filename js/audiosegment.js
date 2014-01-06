var Audiosegment = function(start,image,data){
  this.start = start;

  this.data = data;
  $('.handle').append('<div class="slide" style="background: url(\''+image+'\') no-repeat center center;"></div>');
  this.div =$('.handle div:last-child');
};
Audiosegment.prototype = {
  start:null,
  passed:false,
  data:{},
  getPosition:function()
  {
    return this.start;
  },
  setPassed:function()
  {
    this.passed=true;
  },
  setUnPassed:function()
  {
    this.passed=false;
  },
  isPassed:function()
  {
    return this.passed;
  }
};
