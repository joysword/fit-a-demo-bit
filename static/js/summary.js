

(function() {
    var width = window.innerWidth;
    console.log('width:', width);
    var w = width*0.4;
    var w2 = width*0.8;
    var h = 200;
    var h2 = 15;
    var h3 = 100; // for monthly calories
    var barPaddingWeek = 15;
    var barPaddingMonth = 6;

    var svg = d3.select("#weekly-steps")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var svg2 = d3.select("#weekly-steps")
        .append("svg")
        .attr("width", w)
        .attr("height", h2);

    var svg3 = d3.select("#weekly-calories")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var svg4 = d3.select("#weekly-calories")
        .append("svg")
        .attr("width", w)
        .attr("height", h2);

    var svg5 = d3.select("#monthly-steps")
       .append("svg")
       .attr("width", w2)
       .attr("height", h);

    var svg6 = d3.select("#monthly-steps")
       .append("svg")
       .attr("width", w2)
       .attr("height", h2);

    var svg7 = d3.select("#monthly-calories")
       .append("svg")
       .attr("width", w2)
       .attr("height", h3);

    var svg8 = d3.select("#monthly-calories")
       .append("svg")
       .attr("width", w2)
       .attr("height", h2);

    $.getJSON($SCRIPT_ROOT + '/get_time_series', function(data) {
        var stepsWeek = data.steps_week['activities-steps'];
        var caloriesWeek = data.calories_week['activities-calories'];
        var stepsMonth = data.steps_month['activities-steps'];
        var caloriesMonth = data.calories_month['activities-calories'];

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
           .attr("width", w / stepsWeek.length - barPaddingWeek)
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
                    return i * (w / stepsWeek.length) + (w / stepsWeek.length - barPaddingWeek) / 2;
                },
                y: function(d) {
                    return Math.max(h - (parseInt(d.value, 10) / 100.0) + 14, 14);
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
                return d.dateTime.replace("2016-", "");
           })
           .attr({
                "text-anchor": "middle",
                x: function(d, i) {
                    return i * (w / stepsWeek.length) + (w / stepsWeek.length - barPaddingWeek) / 2;
                },
                y: function(d) {
                    return h2;
                },
                "font-family": "sans-serif",
                "font-size": "11px",
                fill: "black"
            });

        svg3.selectAll("rect")
          .data(caloriesWeek)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {
               return i * (w / caloriesWeek.length);
          })
          .attr("y", function(d) {
               return h - (parseInt(d.value, 10) / 100.0);
          })
          .attr("width", w / caloriesWeek.length - barPaddingWeek)
          .attr("height", function(d) {
               return parseInt(d.value, 10) / 100.0;
          })
          .attr("fill", "#0099cc");

        svg3.selectAll("text")
          .data(caloriesWeek)
          .enter()
          .append("text")
          .text(function(d) {
               return d.value;
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w / caloriesWeek.length) + (w / caloriesWeek.length - barPaddingWeek) / 2;
               },
               y: function(d) {
                   return Math.max(h - (parseInt(d.value, 10) / 100.0) + 14, 14);
               },
               "font-family": "sans-serif",
               "font-size": "11px",
               fill: "white"
           });

        svg4.selectAll("text")
          .data(caloriesWeek)
          .enter()
          .append("text")
          .text(function(d) {
               return d.dateTime.replace("2016-", "");
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w / caloriesWeek.length) + (w / caloriesWeek.length - barPaddingWeek) / 2;
               },
               y: function(d) {
                   return h2;
               },
               "font-family": "sans-serif",
               "font-size": "11px",
               fill: "black"
           });

        svg5.selectAll("rect")
          .data(stepsMonth)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {
               return i * (w2 / stepsMonth.length);
          })
          .attr("y", function(d) {
               return h - (parseInt(d.value, 10) / 100.0);
          })
          .attr("width", w2 / stepsMonth.length - barPaddingMonth)
          .attr("height", function(d) {
               return parseInt(d.value, 10) / 100.0;
          })
          .attr("fill", "#0099cc");

        svg5.selectAll("text")
          .data(stepsMonth)
          .enter()
          .append("text")
          .text(function(d) {
               return d.value;
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w2 / stepsMonth.length) + (w2 / stepsMonth.length - barPaddingMonth) / 2;
               },
               y: function(d) {
                   return Math.max(h - (parseInt(d.value, 10) / 100.0) + 14, 14);
               },
               "font-family": "sans-serif",
               "font-size": "11px",
               fill: "white"
           });

        svg6.selectAll("text")
          .data(stepsMonth)
          .enter()
          .append("text")
          .text(function(d) {
               return d.dateTime.replace("2016-", "");
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w2 / stepsMonth.length) + (w2 / stepsMonth.length - barPaddingMonth) / 2;
               },
               y: function(d) {
                   return h2;
               },
               "font-family": "sans-serif",
               "font-size": "11px",
               fill: "black"
           });

        svg7.selectAll("rect")
          .data(caloriesMonth)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {
               return i * (w2 / caloriesMonth.length);
          })
          .attr("y", function(d) {
               return h3 - (parseInt(d.value, 10) / 100.0);
          })
          .attr("width", w2 / caloriesMonth.length - barPaddingMonth)
          .attr("height", function(d) {
               return parseInt(d.value, 10) / 100.0;
          })
          .attr("fill", "#0099cc");

        svg7.selectAll("text")
          .data(caloriesMonth)
          .enter()
          .append("text")
          .text(function(d) {
               return d.value;
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w2 / caloriesMonth.length) + (w2 / caloriesMonth.length - barPaddingMonth) / 2;
               },
               y: function(d) {
                   return Math.max(h3 - (parseInt(d.value, 10) / 100.0) + 14, 14);
               },
               "font-family": "sans-serif",
               "font-size": "11px",
               fill: "white"
           });

        svg8.selectAll("text")
          .data(caloriesMonth)
          .enter()
          .append("text")
          .text(function(d) {
               return d.dateTime.replace("2016-", "");
          })
          .attr({
               "text-anchor": "middle",
               x: function(d, i) {
                   return i * (w2 / caloriesMonth.length) + (w2 / caloriesMonth.length - barPaddingMonth) / 2;
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

