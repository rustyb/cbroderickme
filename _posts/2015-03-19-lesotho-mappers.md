---
layout: post
title:  "The Lesotho Mappers"
date:   2015-03-19 17:00:00
categories: blog
tags: lesotho
cover_img: /media/lesotho_construct.png
---

So today I decided I would dig into the details of the number of changesets committed by each user to OSM in covering Lesotho. I was reading an interesting post over on the development seed blog on a new command line tool they had developed called osm-meta-tool [to extract information from the OSM minutely changeset files](http://developmentseed.org/blog/2015/02/19/tapping-into-osm-metadata/). 

So I promptly went off and downloaded there code from Github [(osm-meta-util)](https://github.com/osmlab/osm-meta-util) to see could I repurpose it to process the [daily diff files for Lesotho provided by geofabrik](http://download.geofabrik.de/africa/lesotho-updates/). I have forked the osm-meta-util project and modified it for use with the Lesotho data. You can get hold of the source at [github.com/rustyb/osm-meta-util](https://github.com/rustyb/osm-meta-util).

*I should point out i got blocked from the geofabrik server for too many requests like an idiot, make sure you set a suitable time delay between requests.* 

Anyway enough about my sillyness. What tools are we going to use today?

- [osm-meta-util](https://github.com/rustyb/osm-meta-util) + [jq](https://stedolan.github.io/jq/)
- [Python Pandas](http://pandas.pydata.org/) - for the analysis
- [D3.js Punch Card](https://github.com/joshcarr/d3.punchcard/blob/master/index.html)

Ok so the first thing was to decide for what days to prepare the simple punchcard. GeoFabrik have been creating daily diffs for Lesotho since the 30th of January this year. I want to have all the days we have so far. To do this we can go to our ```osm-meta-util``` folder and run the ```cmd.js``` example with some switches:

```bash
node examples/cmd.js 1 49 10000 | jq -c '{user:.user, changeset: .changeset, version: .version, timestamp: .timestamp}' > lesotho.json
```
 
![]({{site.baseurl}}/media/les/les_osc.png)

This query will then go and stream all the .osc.gz files starting with ```001.osc.gz``` (30/01/15) and finishing with ```049.osc.gz``` (19/03/15). It will wait 10 second between each file request so we do not overload the server and get blocked as I did.

The contents of a .osc.gz file look like the following. Between create, modify and delete tags are the nodes or ways which have been created, modified or deleted. In some cases as with the one below tag information will be present between the ```<node></node>``` tags. I am only interested in getting the username, the timestamp and the changeset number.

```xml
<modify>
  <node id="2946016397" version="2" timestamp="2015-03-16T21:56:17Z" uid="1932826" user="DeBigC" changeset="29528496" lat="-30.481495" lon="27.6335444">
    <tag k="ford" v="yes"/>
</node>
```

What happens when we run the previous command is that each XML file is read all the lines which represent a ```node``` or ```way``` are then extracted and converted into JSON and piped to jq where the attributes we want are extracted.

We now have a the JSON file ```lesotho.json``` which contains all of our JSON objects. However you'll notice that this is not valid json as our objects need to be contained in a JSON array. 

```json
{"user":"bjoernchr74","changeset":"6837525","version":"1","timestamp":"2015-02-14T01:35:09Z"}
{"user":"tshedy","changeset":"28823174","version":"2","timestamp":"2015-02-13T15:10:28Z"}
{"user":"tshedy","changeset":"28823174","version":"2","timestamp":"2015-02-13T15:10:28Z"}
{"user":"tshedy","changeset":"28823174","version":"2","timestamp":"2015-02-13T15:10:28Z"}
{"user":"Moseme","changeset":"8785233","version":"1","timestamp":"2015-02-14T01:35:09Z"}
```

To fix this we will first use ```awk``` to add commas to the end of all our lines.

```bash
awk '{print $0","}' lesotho.json > lesotho.json
```

Next wew need to open the file and add a ```[``` to the first line of the file. 

Then at the last line we can delete the very last ```,``` and then add at ```]``` to close our array. I really must find a more programatic way of doing this. Suggestions welcome!

