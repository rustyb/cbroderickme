---
layout: default1
title: "Blog"
permalink: /blog/
---
<div class="dark grey" style="padding: 20px 0 20px 0;margin-bottom:50px;">
	<div class="row">
		<div class="small-12 small-centered columns">
			<h2 class="text-center title-section-1">{{page.title | upcase}}</h2>
			<!--<h3 class="text-center title-section-s "><small><a class=" quiet" href="{{ "/feed.xml" | prepend: site.baseurl }}">Subscribe</a></small></h3>-->
		</div>
	</div>
</div>
{% for post in site.categories.blog limit: 10 %}
<div class="row">  	  
	  <div class="small-centered small-12 large-8 columns end">
	    <article class="post-content text-center">
		<p class="post-meta">
			<span class="post-date h-pr">{{ post.date | date: "%b %-d, %Y" }}</span>
		</p>
		<h3 class="text-center"><a href="{{post.url | prepend: site.baseurl }}">{{post.title}}</a></h3>
	    	{{post.excerpt}}
		{% if post.cover_img %}
			<img src="{{post.cover_img | prepend: site.baseurl}}" />
		{% endif %}
		<a class="button radius" style="margin-top:40px;margin-bottom:40px;" href="{{post.url | prepend: site.baseurl }}">Read More</a>
	    </article>
		<hr />
	  </div>
</div>
{% endfor %}