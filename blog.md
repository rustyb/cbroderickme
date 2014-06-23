---
layout: default1
title: "Blog"
permalink: /blog/
---
<div class="dark grey" style="padding: 30px 0 30px 0;">
	<div class="row">
		<div class="small-12 small-centered columns">
			<h2 class="text-center title-section-1">{{page.title | upcase}}</h2>
			<h3 class="text-center title-section-s "><small><a class=" quiet" href="{{ "/feed.xml" | prepend: site.baseurl }}">Subscribe</a></small></h3>
		</div>
	</div>
</div>
{% for post in site.categories.blog limit: 10 %}
<div class="row">  	  
	  <div class="small-centered small-12 large-8 columns end">
	    <article class="post-content">
		<h3 class="text-center"><a href="{{post.url | prepend: site.baseurl }}">{{post.title}}</a></h3>
	    	{{post.excerpt}}
			<img src="{{post.cover_img}}" />
	    </article>
		<hr />
	  </div>
</div>
{% endfor %}