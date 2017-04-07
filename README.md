#SC-SlideShow

SC-SlideShow is a script will display image, play music from soundcloud and display a waveform. It will also fire event on change image.
If you don't drag n drop image, it wil fire event by himself on time.

Demo : http://med.planet-d.net/demo/web/sc-slideshow/

GitHub : https://github.com/funkymed/webservicesjs

##How to use:

HTML:
~~~
<div id="videos">
    <div id="slideshow" class="dragdealer">
        <div class="handle">
        </div>
    </div>
</div>

<div id="video_controllers">
    <div id="wf"></div>
</div>
~~~

You have to add a file named data.json next to your page structured like this :

time : time in milliseconde

slug : slug to be use url

~~~
[
  {
    "time": 0,
    "slug": "robert-miles",
    "image": "images\/image1.jpeg"
  },
  {
    "time": 100000,
    "slug": "robert-mike",
    "image": "images\/image2.jpeg"
  },
  {
    "time": 200000,
    "slug": "robert-marc",
    "image": "images\/image3.jpg"
  },
  {
    "time": 300000,
    "slug": "robert-park",
    "image": "images\/image4.jpg"
  },
  {
    "time": 400000,
    "slug": "robert-flack",
    "image": "images\/image5.jpg"
  },
  {
    "time": 500000,
    "slug": "robert-bass",
    "image": "images\/image6.jpg"
  },
  {
    "time": 600000,
    "slug": "robert-palmer",
    "image": "images\/image7.jpg"
  }
]
~~~

To start the player and slideshow just do this :
~~~
new SCSlideshow("/tracks/123456");
~~~

#Options

callback : will be use after an image slide

showmakers : will display you the marker on the waveform

~~~
function myCallback(imageoffset)
{

}

var options = {
  showmarkers:true,
  callback:myCallback
};

new SCSlideshow("/tracks/123456", options);
~~~
