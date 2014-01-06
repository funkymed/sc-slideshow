/*!
 * sc-slideshow 0.1
 *  http://www.cyrilpereira.com/sc-slideshow
 *
 * Created by Cyril Pereira (http://www.cyrilpereira.com @m__e__d)
 */
var SCSlideshow = function(urlfile,options){

  this.urlfile = urlfile;
  var slug = this.getURLParameter();
  if(slug)
  {
    this.AfterLoadSlug = slug;
  }

  if(options)
  {
    if(options.showmarker && typeof options.showmarker == 'boolean')
      this.options.showmarker = options.showmarker;
    if(options.callback && typeof options.callback == 'function')
      this.options.callback = options.callback;
  }

  $.getJSON('data.json', $.proxy(this.onDataLoad, this));

  $(window).on('resize', $.proxy(this.onResize, this));

};
SCSlideshow.prototype = {
  options:{
    showmarker:false,
    callback:null
  },
  currentArtist:null,
  currentSlug:null,
  AfterLoadSlug:null,
  segments_array:[],
  step:0,
  loaded:false,
  segments:[],
  waveform:null,
  stream:null,
  slideshow:null,
  position:0,
  duration:0,
  onDataLoad:function(r)
  {
    this.segments_array = r;


    SC.get(this.urlfile, $.proxy(this.onTrackLoad, this));

  },
  onTrackLoad:function(track)
  {

    this.waveform = new Waveform({
      container: document.getElementById("wf")
    });

    this.waveform.dataFromSoundCloudTrack(track);
    var streamOptions = this.waveform.optionsForSyncedStream();

    var scope = this;
    $(this.segments_array).each(function()
    {
      scope.segments.push(new Audiosegment(this.time,this.image, this));
    });

    var trackToLoad = (this.AfterLoadSlug) ? this.getArtistFromSlug(this.AfterLoadSlug) : false;

    streamOptions.whileplaying = function()
    {
      if(trackToLoad!=false && !scope.loaded && this.duration>=trackToLoad.time)
      {
        scope.loaded = true;
        scope.jumpToSlug(trackToLoad.slug);
      }
      scope.whileplaying(this);
    };

    SC.stream(track.uri, streamOptions, $.proxy(this.onStream, this));

    this.onResize();
    this.slideshow = new Dragdealer('slideshow',{
      steps: this.segments_array.length,
      loose: true,
      callback:function(x,y)
      {
        var step = Math.floor(x * (this.steps-1));
        if(scope.segments[step])
        {
          var time = scope.segments[step].getPosition();
          scope.stream.setPosition(time);
          for(var i = step;i<this.steps;i++)
          {
            scope.segments[i].setUnPassed();
          }
        }
      },
      animationCallback: function(x, y)
      {
      },
      onAfterStep:function(x,y)
      {
        var step = Math.floor(x * (this.steps-1));
        if(scope.segments[step])
        {
        }

        if(typeof scope.options.callback =='function')
        {
          scope.options.callback(step);
        }
      }
    });
  },
  whileplaying:function(stream)
  {
    this.waveform.redraw();
    this.position = stream.position;
    this.duration = stream.durationEstimate;
    this.drawline();
  },
  drawline:function()
  {
    var ctx = this.waveform.context;
    var _w = ctx.canvas.width;
    var _pos = Math.ceil((this.position/this.duration)*_w);

    var scope = this;
    $(this.segments).each(function(a)
    {
      var ctx = scope.waveform.context;
      var _w = ctx.canvas.width;
      var _pos = Math.ceil((this.getPosition()/scope.duration)*_w);
      if(scope.options.showmarker)
      {
        scope.draw(ctx, _pos, 0, 2, "rgba(0, 255, 0, 0.8)");
      }
      if(scope.position>this.getPosition() && this.isPassed()==false)
      {
        this.setPassed();
        scope.setUrlParameter(this.data.slug);
        scope.slideshow.setStep(a + 1);
      }
    });

    this.draw(ctx, _pos, 0, 2, "rgba(255, 0, 0, 0.8)");

  },
  draw:function(ctx,x,y,s,color)
  {
    ctx.beginPath();
    ctx.lineWidth = s;
    ctx.moveTo(x,y);
    ctx.lineTo(x,ctx.canvas.height);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
  },

  onStream:function(stream)
  {
    this.stream = stream;
    this.stream.play();
  },
  onResize:function()
  {
    $('#slideshow').width($( window ).width()).height($( window ).height());
    $('#slideshow .handle ').width($( window ).width()*this.segments_array.length).height($( window ).height());
    $('#slideshow .handle .slide').width($( window ).width()).height($( window ).height());

    //refresh waveform width
    $(this.waveform.canvas).attr('width',$( window ).width());
    this.waveform.width = parseInt(this.waveform.canvas.width, 10);
    this.waveform.setDataInterpolated(this.waveform.data);

    if(this.slideshow)
    {
      this.slideshow.setWrapperOffset();
      this.slideshow.setBounds();
      this.slideshow.update();
    }
  },
  setUrlParameter:function(slug)
  {
    document.location.hash = "#"+encodeURIComponent(slug);
  },
  getURLParameter:function () {
    return (location.href.split('#')[1]) ? location.href.split('#')[1] : '';
  },
  getArtistFromSlug:function(slug)
  {
    var founded = null;

    $(this.segments).each(function()
    {
      if(slug == this.data.slug)
      {
        founded =  this.data;
        return true;
      }
    });
    return founded;
  },
  jumpToSlug:function(slug)
  {
    var scope = this,
        _slug = slug,
        founded = false;

    $(this.segments).each(function(a)
    {
      if(!founded && _slug == this.data.slug)
      {
        scope.stream.setPosition(this.data.time);
        scope.slideshow.setStep(a + 1);
        founded = this;
      }
    });
  }
};