---
layout: post
title:  "OSM changeset powered slack notifications"
date:   2016-08-20 19:00:00
categories: blog
tags: MapLesotho, slack, OSM
published: false
---

*It's been quite a while since I fired up a post on the blog. So here it goes my attempt to get back into it full swing.*

For the last 2 weeks i've been running an analysis competition for MapLesotho. It's been going well, we've started to use slack for coordinating the teams (there's 3 of them) to enable everyone to share code snippets and learning in the one spot. It's been cool, but challenging, more about that another time.

Using slack and reading about it's various webhook servies and bots, it got me thinking why don't we have a notification service for new changesets in Lesohto. Given that we already track these to compile the user contributions.

My tool of choice is Development Seed's [planet-stream](https://github.com/developmentseed/planet-stream), think of it like twitter's firehouse, it reads the minutely diffs and using the augmented diffs to gather the elements (geography) of changesets.

For each changeset we know's it's bounding box through it's min_lat, max_lon, max_lot, min_lon values, so we do a simple check to see if these are with in the bounds of Lesotho and part of South Africa. If the changeset passes this test it is then passed to a function which posts a webhook to our slack channel.

[Imgur - slackbot in action](http://i.imgur.com/0rltXC2.png)

The result being that my phone is constantly buzzing off the table as the changes ring in, particularly at odd hours of the night.

### Notes -> not all plane sailing
I had some trouble getting version 0.4.0 of planet-stream to work correctly, particularly where when a queue job completed it did not out put to the logs as per previous versions. However it is there in redis, so most likely something stupid I changed. Have opened a pull request so hopefully someone over ad development seed will see it.

[Get hold of the simple code](https://github.com/rustyb/slack-changesets) - Will be updating the repo to be more resuable, aka adding the ability to specifiy a polygon area.
