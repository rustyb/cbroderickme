---
layout: post
title:  "Working with open route service - removing roads from the graph"
categories: blog
tags: graphs, openrouteservice, graphhopper
published: true
---

Recently a friend of mine approached me with an interesting idea. Could we develop a 
directions API that would allow for legal routing of e-scooter journies using OSM data?

Enter the routing egines built on top of openstreetmap data -> openrouteservice, graphhopper, valhalla, etc.

So I settled on trying to modify the bike profiles of [openrouteservice](https://maps.openrouteservice.org/#/) for our usecase

## Note to future self - removing road from graph

Add the following to [CommonBikeFlagEncoder.java](https://github.com/GIScience/openrouteservice/blob/a4ebc951003291e71b1eb632ef25798bddfc1519/openrouteservice/src/main/java/org/heigit/ors/routing/graphhopper/extensions/flagencoders/bike/CommonBikeFlagEncoder.java) to remove `primary` and `primary_link` tagged highways from the generated routing graph for bikes.

```java
...
// setHighwaySpeed("primary", 18);
// setHighwaySpeed("primary_link", 18);        
....        
avoidHighwayTags.add("primary");
avoidHighwayTags.add("primary_link");
```

More to come as I learn more.
