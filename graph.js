(function() {
    const margin = {top: 10, right: 10, bottom: 40, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const div = d3.select("#graph").append("div")
      .style("position", "relative")
      .style("width", (width + margin.left + margin.right) + "px")
      .style("height", (height + margin.top + margin.bottom) + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

    const treemap = d3.treemap().size([width, height]);

    const find_percentiles = (data) => {
        const all_years = []
        data.forEach((entry) => {
            if (!all_years.includes(entry.year)) {
                all_years.push(entry.year)
            }
        })

        for (const year of all_years) {
            const annualData = data.filter(entry => entry.year === year)
            const totalSize = annualData.reduce((currentVal, entry) => currentVal + parseInt(entry['size'].replace(',', '')), 0)
            annualData.forEach((entry) => {
                entry.size = (entry['size'].replace(/,/g, '') / totalSize * 100).toFixed(2)
            })
        }
    
    }

    const range = document.getElementById('year')
    const rangeV = document.getElementById('rangeV')
    const setValue = ()=>{
        const
        newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
        newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span>${range.value}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
    };
    
    range.addEventListener('input', setValue);

    const draw = (data, departmentSplit) => {
        d3.selectAll(".node").remove()
    
        const currentYear = document.getElementById('year').value; 
        const root = d3.hierarchy({ 'children': data.filter(entry => entry.year === currentYear) })
        .sum((d) => d.size);

        const tree = treemap(root);

        const mousemove = function(d) {
            var xPosition = d3.event.pageX - 390;
            var yPosition = d3.event.pageY - 80;
            
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");
            d3.select("#tooltip #heading")
                .text(`${departmentSplit ? d.data.department.split("_").slice(0, -1).join(" ") : d.data.department}`);
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
        
        node.on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .transition()
            .duration(1000)
            .attr("class", "node")
            .style("left", (d) => d.x0 + "px")
            .style("top", (d) => d.y0 + "px")
            .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
            .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
            .style("background", (d) => color(d.data.department))
            .text((d) => `${departmentSplit ? d.data.department.split("_").slice(0, -1).join(" ") : d.data.department}`)
            .style("font-size", "12px")
            .style("font-weight", "bold");

        d3.selectAll("#year").on("change", function change() {
            console.log(document.getElementById('textYear'))
            document.getElementById('textYear').textContent = this.value; 

            const newRoot = d3.hierarchy({ 'children' : data.filter(entry => entry.year === this.value) }).sum((d) => d.size);

            node.data(treemap(newRoot).leaves())
            .transition()
                .duration(1500)
                .style("left", (d) => d.x0 + "px")
                .style("top", (d) => d.y0 + "px")
                .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                .style("background", (d) => color(d.data.department))
                .text((d) => `${departmentSplit ? d.data.department.split("_").slice(0, -1).join(" ") : d.data.department}`)
        });
    }

    const drawOverall = () => {
        d3.json("data/budget.json", function(error, data) {
            if (error) throw error;

            draw(data.pct, true)

            const yearValue = document.getElementById('year').value;

            document.getElementById('textInput').innerHTML = `<span id='textYear'>${yearValue}</span> - United States Overall Budget`; 
        });
    }

    const drawHumanResources = () => {
        d3.json("data/human_resources.json", function(error, data) {
            if (error) throw error;

            find_percentiles(data.total)

            draw(data.total, false)

            const yearValue = document.getElementById('year').value;

            document.getElementById('textInput').innerHTML = `<span id='textYear'>${yearValue}</span> - United States Human Resources Budget`; 
        });
    }

    const drawPhysicalResources = () => {
        d3.json("data/physical_resources.json", function(error, data) {
            if (error) throw error;

            find_percentiles(data.total);

            draw(data.total, false)

            const yearValue = document.getElementById('year').value;

            document.getElementById('textInput').innerHTML = `<span id='textYear'>${yearValue}</span> - United States Physical Resources Budget`; 
        })
    }

    const drawOtherFunctions = () => {
        d3.json("data/other_functions.json", function(error, data) {
            if (error) throw error;

            find_percentiles(data.total);

            draw(data.total, false)

            const yearValue = document.getElementById('year').value;

            document.getElementById('textInput').innerHTML = `<span id='textYear'>${yearValue}</span> - United States Other Functions Budget`; 
        })
    }

    d3.selectAll("button").on("click", function() {
        if (this.id === "overall") {
            drawOverall();
        } else if (this.id === "human_resources") {
            drawHumanResources();
        } else if (this.id === "physical_resources") {
            drawPhysicalResources();
        } else if (this.id === "other_functions") {
            drawOtherFunctions();
        }
    })

    drawOverall();

    setValue();
})()