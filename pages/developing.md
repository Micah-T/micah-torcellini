---
title: Stuff I've Developed
permalink: /developing/
---
## Sites I've made
<ol>
{% for site in sites %}
<li><a href="{{ site.url }}">{{ site.title }}</a></li>
{% endfor %}
</ol>