

(function() {
    var w = 800;
    var h = 180;
    var h2 = 15;
    var barPadding = 20;

    var svg = d3.select("#week-summary")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var svg2 = d3.select('#week-summary')
        .append('svg')
        .attr("width", w)
        .attr("height", h2)
        .attr("x", parseInt(svg.attr('x'), 10));

    $.getJSON($SCRIPT_ROOT + '/get_time_series', function(data) {
        var stepsWeek = data.steps_week['activities-steps'];
        var caloriesWeek = data.calories_week['activities-calories'];
        var stepsMonth = data.steps_month['activities-steps'];
        var caloriesMonth = data.calories_month['activities-calories'];

        console.log(stepsWeek);

        svg.selectAll("rect")
           .data(stepsWeek)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {
                return i * (w / stepsWeek.length);
           })
           .attr("y", function(d) {
                return h - (parseInt(d.value, 10) / 100.0);
           })
           .attr("width", w / stepsWeek.length - barPadding)
           .attr("height", function(d) {
                return parseInt(d.value, 10) / 100.0;
           })
           .attr("fill", "#0099cc");

        svg.selectAll("text")
           .data(stepsWeek)
           .enter()
           .append("text")
           .text(function(d) {
                return d.value;
           })
           .attr({
                "text-anchor": "middle",
                x: function(d, i) {
                    return i * (w / stepsWeek.length) + (w / stepsWeek.length - barPadding) / 2;
                },
                y: function(d) {
                    return h - (parseInt(d.value, 10) / 100.0) + 14;
                },
                "font-family": "sans-serif",
                "font-size": "11px",
                fill: "white"
            });

        svg2.selectAll("text")
           .data(stepsWeek)
           .enter()
           .append("text")
           .text(function(d) {
                return d.dateTime;
           })
           .attr({
                "text-anchor": "middle",
                x: function(d, i) {
                    return i * (w / stepsWeek.length) + (w / stepsWeek.length - barPadding) / 2;
                },
                y: function(d) {
                    return h2;
                },
                "font-family": "sans-serif",
                "font-size": "11px",
                fill: "black"
            });
    })
})();

