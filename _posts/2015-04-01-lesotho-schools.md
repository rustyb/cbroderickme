---
layout: post
title:  "What is the nearest hospital to each school in Lesotho"
date:   2015-04-01 12:30:00
categories: blog
tags: lesotho, schools
---

<iframe width="100%" height="615" src="http://bl.ocks.org/rustyb/raw/f9cda0b23a74e94e5927/" frameborder="0" allowfullscreen>
</iframe>

I have been experimenting with some simple examples from [```turf.js```](http://turfjs.org) and [```mapbox.js```](https://www.mapbox.com/guides/javascript-and-mapboxjs-fundamentals/). 

We graciously received some data from the Lesotho Ambassador to Ireland which contained the located of all schools in Lesotho. I thought it might be ideal to then go ahead and plot these on a map where we could find the nearest hospital to each school.

How do you do it? First you must zoom in so you can see the blue schools icons. Simply click one and it will highlight the nearest hospital.

Hospital data was extracted from OpenStreetMap using overpass turbo. I know for a fact some hospitals are missing. This is something we would like to map as soon as possible. If you have any information on Hospital locations in Lesotho please don't hesitate to contact the folks on [maplesotho.wordpress.com](http://maplesotho.wordpress.com) or myself or through the **#MapLesotho** hashtag.

Want to do this yourself? You can checkout the source code below or [**go directly to the gist**](https://gist.github.com/rustyb/f9cda0b23a74e94e5927#):

<script src="https://gist.github.com/rustyb/f9cda0b23a74e94e5927.js"></script>