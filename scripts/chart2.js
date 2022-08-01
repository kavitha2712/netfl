var finalDataChart2 = [];
// initialise layout variables
const marginChart2 = {top: 50, right: 20, bottom: 50, left: 60};
const widthChart2 = 600;
const heightChart2 = 400;

// initialise charts
const svgChart2 = d3.select('#svg2')
    .attr('width', widthChart2 + marginChart2.left + marginChart2.right)
    .attr('height', heightChart2 + marginChart2.top + marginChart2.bottom)
    .append('g')
    .attr('transform', 'translate(' + marginChart2.left + ',' + marginChart2.top + ')')
    .attr('id', 'svg-2-parent-g');

charts.chart2 = function() {
    getDataAndDraw();
}

function getDataAndDraw() {
    const parseDateTime = d3.timeParse("%B %d, %Y");

    // get data
    const file = 'data/top_states.json';
    d3.cachedJson(file, 'chart5', function(data) {
        data.forEach(function(d) {
            d.date = d.Total_Deaths_2019;
        });
        data = data.filter(d => d.date != null);
//         data.forEach(function(d) {
//             d.year = d.date.getFullYear();
//         });

        paramsChart2.forEach(function(param) {
            if (!d3.select(param.id).property('checked')) {
                data = data.filter(d => d["State Code"] != param.statecd);
            }
        });

        const dataGroupedByRegion = Array.from(d3.group(data, d => d["Drug_type"]));
        finalDataChart2 = dataGroupedByRegion.map(
            function (item) {
                var sumDeaths = 0;
                item[1].forEach(d => sumDeaths += d["Deaths_by_drug_2019"]);
                return {
                    drug: item[0],
                    numDeaths: sumDeaths / item[1].length
                    
                };
            }
           ).sort()
//         ).sort((a, b) => (a.genre > b.genre) ? 1 : -1);

        drawChart2(finalDataChart2);
    });
}

function drawChart2(data) {
    d3.select('#svg-2-parent-g').selectAll('*').remove();
    svgChart2.selectAll('rect').remove();

    // X axis
    const x = d3.scaleBand()
        .range([0, widthChart2])
        .domain(data.map(function (d) {
            return d.drug;
        }))
        .padding(0.2);
    svgChart2.append("g")
        .attr("transform", "translate(0," + heightChart2 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 3000])
        .range([heightChart2, 0]);
    svgChart2.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svgChart2.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.drug); })
        .attr("y", function(d) { return y(d.numDeaths); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return heightChart2 - y(d.numDeaths); })
        .attr("fill", "#85182c");
}

const paramsChart2 = [
    {
        id: "#checkbox-CA",
        statecd: "CA"
    },
    {
        id: "#checkbox-FL",
        statecd: "FL"
    },
    {
        id: "#checkbox-NY",
        statecd: "NY"
    },
    {
        id: "#checkbox-PA",
        statecd: "PA"
    },
    {
        id: "#checkbox-OH",
        statecd: "OH"
    }
];
function updateChart2Data() {
    getDataAndDraw();
}
