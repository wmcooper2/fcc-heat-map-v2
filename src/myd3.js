import * as d3 from "d3";

const dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const allColors = [
  "#a50026",
  "#fba35f",
  "#fed88a",
  "#f6f9cc",
  "#c3e4ee",
  "#7bb1d3",
  "#4d7ab7",
  "#313695",
];

d3.json(dataURL, (data) => {
  //check the data
  // const dataKeys = Object.keys(data);
  // console.log("data keys: ", dataKeys);
  // console.log("base temp: ", data.baseTemperature); // only 1
  // console.log("example data object: ", data.monthlyVariance[0]);

  //extract data objects and boundaries
  const dataPoints = data.monthlyVariance;
  // console.log(dataPoints.length); //3153
  // console.log(dataPoints[100]);
  const yearMin = d3.min(dataPoints, (d) => d.year);
  const yearMax = d3.max(dataPoints, (d) => d.year);
  const mthMin = d3.min(dataPoints, (d) => d.month);
  const mthMax = d3.max(dataPoints, (d) => d.month);
  const varMin = d3.min(dataPoints, (d) => d.variance);
  const varMax = d3.max(dataPoints, (d) => d.variance);
  // console.log("years: ", yearMin, yearMax);
  // console.log("mths: ", mthMin, mthMax);
  // console.log("variance: ", varMin, varMax);

  //chart svg
  const chartH = 300;
  const chartW = 900;
  const chartPad = 30;

  //Scales
  const xScale = d3
    .scaleTime()
    .domain([new Date(yearMin, 0), new Date(yearMax, 0)])
    .range([0, chartW]);
  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((d) => new Date(0, d))) //off by 1
    .range([chartH, 0]);
  const colors = d3.schemeRdYlBu;
  const colorScale = d3
    .scaleSequential(d3.interpolateRdYlBu)
    .domain([varMax, varMin]);
  const legendScale = d3
    .scaleThreshold()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([0, 100]);

  //test output of scales
  // console.log("xScale", xScale(new Date(1800, 0)));
  // console.log("color out: ", colorScale(1.3));

  //Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  //chart
  const chart = d3
    .select("#graph")
    .append("svg")
    .attr("width", chartW + "px")
    .attr("height", chartH + "px");

  //attach axes
  chart
    .append("g")
    .attr("transform", "translate(0, " + chartH + ")")
    .attr("id", "x-axis")
    .call(xAxis);
  chart
    .append("g")
    .attr("transform", "translate(-4,0)")
    .attr("id", "y-axis")
    .call(yAxis);

  //convenience
  const numYears = yearMax - yearMin;
  // console.log(numYears);

  //tooltip
  const toolH = 100;
  const toolW = 200;
  const tooltip = d3
    .select("#graph")
    .append("div")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("id", "tooltip")
    .attr("opacity", 0)
    .style("position", "absolute");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = (m) => {
    return months[m];
  };
  // console.log("month", months[0]);

  //data points
  chart
    .selectAll("rect")
    .data(dataPoints)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .attr("x", (d) => xScale(new Date(d.year, 0)) + "px")
    .attr("y", (d) => yScale(new Date(0, d.month - 1)) + "px")
    .attr("width", chartW / numYears + "px")
    .attr("height", chartH / 12 + "px")
    .attr("fill", (d) => colorScale(d.variance))
    .on("mouseover", (d) => {
      tooltip
        .transition()
        .duration(0)
        .attr("data-year", d.year)
        .style("opacity", 1)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - toolH / 2 + "px")
        .style("width", toolW + "px")
        .style("height", toolH + "px");
      tooltip.html(
        "Temp: " +
          d.Place +
          "<br />" +
          "Variance: " +
          d.variance +
          "<br />" +
          monthName(d.month - 1) +
          " " +
          d.year +
          " <br />"
      );
    })
    .on("mouseout", (d) => {
      tooltip
        .transition()
        .duration(0)
        .style("opacity", 0)
        .style("width", "0px")
        .style("height", "0px");
    });

  //legend
  const legendX = chartW / 2 - 80;
  const legendY = chartH - 10;
  const legendW = 180;
  const legendH = 40;
  const legCircleX = 150;
  const legCircleY = 20;
  const legTextX = 20;
  const legTextY = 20;

  const legend = chart
    .append("svg")
    .attr("id", "legend")
    .attr("x", "20px")
    .attr("y", chartH + 20 + "px")
    .attr("width", legendW + "px")
    .attr("height", legendH + "px");

  legend
    .append("text")
    .text("Temp Variance")
    .attr("x", "0px")
    .attr("y", "0px")
    .attr("transform", "translate(0,20)");
  legend
    .append("text")
    .text("-")
    .attr("x", "0px")
    .attr("y", "15px")
    .attr("transform", "translate(0,20)");
  legend
    .append("text")
    .text("+")
    .attr("x", "90px")
    .attr("y", "15px")
    .attr("transform", "translate(0,20)");
  const legendColors = [
    "#a50026",
    "#fba35f",
    "#fed88a",
    "#f6f9cc",
    "#c3e4ee",
    "#7bb1d3",
    "#4d7ab7",
    "#313695",
  ].reverse();

  legend
    .selectAll("g")
    .data(legendColors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 10 + 8 + "px")
    .attr("y", legendH / 2 + 6 + "px")
    .attr("width", "10px")
    .attr("height", "10px")
    .style("fill", (d) => d);
});
