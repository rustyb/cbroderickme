---
layout: post
title:  "Wrestling with jekyll and timezones"
categories: blog
tags: jekyll, headaches
published: true
---

This post is meerly to serve as a note for anyone suffering the same issue I had yesterday! 

Currently I live in Brussels so UTC +1 OR +1000. It turns out jekyll (our favourite blogging engine) can get it's wires crossed when you create a new post and are using the date slug created by the `post_render`hook.

So given i've explained the above terribly here is the example.

I have created a new blog post in `_posts/2017-01-20-blog.md`. As expected jekyll will create a blog post at the following url `example.com/2017/01/20/blog`. **All good so far**.

Recently i've been building a new elastic search index for the site on each build. Using the [searchyll gem](https://github.com/omc/searchyll) which hooks into the post post_render hook it creates a json response of all the metadata and content associated with each post.

What I found was that in this json we would expect the slug for the blog post to be `example.com/2017/01/20/blog` when in fact it was `example.com/2017/01/19/blog` thanks to the dates being fed to the hook being UTC (2017-01-19 23:00:00) rather than UTC +1 (2017-01-20 00:00:00).

After much googling I found the answer. In your `_config.yml` you must set the timezone as follows:

```
timezone: UTC
```

So happy jekylling to anyone who happens to come across this post!

---

In case you're looking for when this came in see [jekyll v3.3.0](https://github.com/jekyll/jekyll/releases/tag/v3.3.0) release notes on github
