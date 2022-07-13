(function() {
    const margin = {top: 40, right: 10, bottom: 10, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const treemap = d3.treemap().size([width, height]);

    const div = d3.select("body").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

    d3.json("budget.json", function(error, data) {
        if (error) throw error;

        const root = d3.hierarchy({ 'children': data.pct.filter(entry => entry.year === "1945") })
        .sum((d) => d.size);

        const tree = treemap(root);

        const mousemove = function(d) {
            var xPosition = d3.event.pageX - 390;
            var yPosition = d3.event.pageY - 90;
            console.log(xPosition, "POSITION")
            
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");
            d3.select("#tooltip #heading")
                .text(`${d.data.department.split("_").slice(0, -1).join(" ")}`);
            d3.select("#tooltip #revenue")
                .text(`${d.data.size}%`);
            d3.select("#tooltip").classed("hidden", false);
        };

        const mouseout = function() {
            d3.select("#tooltip").classed("hidden", true);
        };

        const node = div.datum(root).selectAll(".node")
            .data(tree.leaves())
            .enter().append("div")
            .attr("class", "node")
            .style("left", (d) => d.x0 + "px")
            .style("top", (d) => d.y0 + "px")
            .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
            .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
            .style("background", (d) => color(d.data.department))
            .text((d) => d.data.department.split("_").slice(0, -1).join(" "))
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        d3.selectAll("#year").on("change", function change() {

            document.getElementById('textInput').innerHTML = this.value; 

            const newRoot = d3.hierarchy({ 'children' : data.pct.filter(entry => entry.year === this.value) }).sum((d) => d.size);

            node.data(treemap(newRoot).leaves())
            .transition()
                .duration(1500)
                .style("left", (d) => d.x0 + "px")
                .style("top", (d) => d.y0 + "px")
                .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                .style("background", (d) => color(d.data.department))
                .text((d) => d.data.department.split("_").slice(0, -1).join(" "))
        });
    });

})()