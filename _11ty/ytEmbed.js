module.exports = function(i, w, h, t, c) {
    return  `<div><lite-youtube videoid="${i}" style="background-image: url('https://i.ytimg.com/vi/${i}/hqdefault.jpg');" class="${c}" title="${t}">
    </lite-youtube><p class="lite-yt-fallback"><a href="https://www.youtube.com/watch?v=${i}">View video on YouTube</a></p></div>`
  };