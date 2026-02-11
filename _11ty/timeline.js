const chronos = require("chronos-timeline-md")

module.exports = function(markdown, timelineStart, timelineEnd) {
    const data = chronos.parseChronos(markdown);
    console.log()
    console.log(data.items)
    let htmlList = "";
    data.items.forEach(i => {
        let startYear = i.start.getUTCFullYear();
        console.log(i.start)
        console.log(startYear)
        let endYear = undefined;
        let years = startYear
        if (i.end) {
            endYear = i.end.getUTCFullYear();
            years = `${startYear}-${endYear}`
        }
        else {
            endYear = startYear;
        }
        let htmlListItem = `<li style="--start: ${startYear}; --end: ${endYear}" class="timeline-group-${i.group}">
        ${years}: 
        ${i.content}
        </li>`
        htmlList = htmlList + htmlListItem;
    });
    const html = `
        <link
        href="/assets/css/timeline.css"
        rel="stylesheet"
        type="text/css"
        >
        <div class="timeline-container">
        <ul class="timeline" style="--timeline-start: ${timelineStart}; --timeline-end: ${timelineEnd}">
            ${htmlList}
        </ul></div>
        `;
    return html
}