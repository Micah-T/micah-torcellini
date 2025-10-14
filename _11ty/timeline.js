const chronos = require("chronos-timeline-md")

module.exports = function(containerElement, markdown) {
    const data = chronos.parseChronos(markdown);
    let dataList = JSON.stringify(data.items);
    let groupsList = JSON.stringify(data.groups);
    const html = `
        <script
        type="text/javascript"
        src="/node_modules/vis-timeline/standalone/umd/vis-timeline-graph2d.min.js"
        ></script>
        <link
        href="/node_modules/vis-timeline/styles/vis-timeline-graph2d.min.css"
        rel="stylesheet"
        type="text/css"
        >
        <div id="${containerElement}">
            <noscript>This timeline requires JavaScript to view</noscript>
        </div>
        <script type="text/javascript">
            var container = document.getElementById("${containerElement}");
            var items = new vis.DataSet(
                ${dataList}
            );
            var groups = new vis.DataSet(
                ${groupsList}
            );
            var options = {};
            var timeline = new vis.Timeline(container, items, groups, options);
        </script>
        `;
    return html
}