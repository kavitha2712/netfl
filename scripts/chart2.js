var finalDataChart7 = [];
// initialise layout variables
const marginChart7 = {top: 50, right: 20, bottom: 50, left: 60};
const widthChart7 = 600;
const heightChart7 = 400;

// initialise charts
const svgChart7 = d3.select('#svg7')
    .attr('width', widthChart7 + marginChart7.left + marginChart7.right)
    .attr('height', heightChart7 + marginChart7.top + marginChart7.bottom)
    .append('g')
    .attr('transform', 'translate(' + marginChart7.left + ',' + marginChart7.top + ')')
    .attr('id', 'svg-7-parent-g');

charts.chart7 = function() {
    getDataAndDraw();
}

function getDataAndDraw() {
    const parseDateTime = d3.timeParse("%B %d, %Y");

    // get data
    const file = 'data/opioid_crisis.json';
    d3.cachedJson(file, 'chart1', function(data) {
        data.forEach(function(d) {
            d.date = d.Total_Deaths_2019;
        });
        data = data.filter(d => d.date != null);
//         data.forEach(function(d) {
//             d.year = d.date.getFullYear();
//         });

        paramsChart7.forEach(function(param) {
            if (!d3.select(param.id).property('checked')) {
                data = data.filter(d => d["State Code"] != param.statecd);
            }
        });

        const dataGroupedByRegion = Array.from(d3.group(data, d => d["State Code"]));
        finalDataChart7 = dataGroupedByRegion.map(
            function (item) {
                var sumDeaths = 0;
                item[1].forEach(d => sumDeaths += d["Total_Deaths_2019"]);
                return {
                    state: item[0],
                    numDeaths: sumDeaths 
                    
                };
            }
           ).sort()
//         ).sort((a, b) => (a.genre > b.genre) ? 1 : -1);

        drawChart7(finalDataChart7);
    });
}

function drawChart7(data) {
    d3.select('#svg-7-parent-g').selectAll('*').remove();
    svgChart7.selectAll('rect').remove();

    // X axis
    const x = d3.scaleBand()
        .range([0, widthChart7])
        .domain(data.map(function (d) {
            return d.state;
        }))
        .padding(0.2);
    svgChart7.append("g")
        .attr("transform", "translate(0," + heightChart7 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 3000])
        .range([heightChart7, 0]);
    svgChart7.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svgChart7.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.state); })
        .attr("y", function(d) { return y(d.numDeaths); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return heightChart7 - y(d.numDeaths); })
        .attr("fill", "#505996");
}

const paramsChart7 = [
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
function updateChart7Data() {
    getDataAndDraw();
}
