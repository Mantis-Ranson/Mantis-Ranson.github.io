var data = [
{year:"2010",value:5},
{year:"2011",value:35},
{year:"2012",value:41},
{year:"2013",value:50},
{year:"2014",value:100},
{year:"2015",value:25},
{year:"2016",value:88},
{year:"2017",value:90}
];

var color = {
zero_fifteen:"#d84d4e",
sixteen_twenty:"#cd845a",
twentyone_twentyfive:"#e8a53d",
twentysix_thirtyfive:"#a5a438",
thirtyfive_fifty:"#87a966",
fiftyone_sixty:"#88abae",
sixtyone_eighty:"#4db3d3",
eighty_onehundred:"#6ac6ff"
};

var svg = d3.select("#bar-graph"),
    margin = {top: 50, right: 20, bottom: 70, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.3),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map(function(d) { return d.year; }));
y.domain([0,100]);

function getColor(value){
	if(value < 51){
		if(value <= 16) return color.zero_fifteen;
		if(value < 25) return color.sixteen_twenty;
		if(value < 35) return color.twentyone_twentyfive;
		if(value < 45) return color.twentysix_thirtyfive;
		return color.thirtyfive_fifty
	} else {
		if(value < 61) return color.fiftyone_sixty;
		if(value < 71) return color.sixtyone_eighty;
		return color.eighty_onehundred;
	}
}
// d3.max(data, function(d) { return d.value; }) 

  g.append("g") 
      .attr("class", "axis axis--x") 
      .attr("transform", "translate(0," + (height+40) + ")") 
      .call(d3.axisBottom(x)) 

  var halfbandwidth = x.bandwidth()/2;

   g.selectAll(".fake-tops")
    .data(data)
    .enter().append("circle")
      .attr("class", "fake-tops")
      .attr("cx", function(d) { return x(d.year)+halfbandwidth;})
      .attr("cy", function(d) { return 0})
      .attr("r",halfbandwidth)
      .attr("fill",function(d,i){
      	return "#3e3c3e";
      });

   g.selectAll(".bar2")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return 0; })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height; })
      .attr("fill",function(d,i){
      	return "#3e3c3e";
      });
	
	var linePadding = height/4;
    for(var i=0;i<4;i=i+1){
   		g.append("line")
	      .attr("class","balck-line")
	      .attr("x1", 0)
	      .attr("y1", i*linePadding)
	      .attr("x2", width)
	      .attr("y2", i*linePadding)
	      .style("stroke-width","2px")
	      .style("stroke", "#333");
    }

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill",function(d,i){
      	return getColor(d.value);
      });

  g.append("line")
  	  .attr("class","bottom-line")
      .attr("x1", function(d){
      	var dotStart = data[0].year;
      	return x(dotStart)+halfbandwidth
      })
      .attr("y1", height+25)
      .attr("x2", function(d){
      	var datlength = data.length;
      	var dotStart = data[datlength-1].year;
      	return x(dotStart)+halfbandwidth
      })
      .attr("y2", height+25)
      .style("stroke-dasharray","2,5")
      .style("stroke-width","3px")
      .style("stroke", "gray");


  g.selectAll(".dots")
    .data(data)
    .enter().append("circle")
      .attr("class", "dots")
      .attr("cx", function(d) { return x(d.year)+halfbandwidth;})
      .attr("cy", function(d) { return height+25; })
      .attr("r","8")
      .attr("fill",function(d,i){
      	return getColor(d.value);
      });

    
var pi = Math.PI;
    
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(function(d){
    	return x.bandwidth()/2;
    })
    .startAngle(-90 * (pi/180)) 
    .endAngle(90 * (pi/180))
    
   g.selectAll("g.toparc")
    .data(data)
    .enter()
    .append("path")
    .attr("class","toparc")
    .attr("d", arc)
    .attr("fill", function(d){
    	return getColor(d.value)
    })
    .attr("transform", function(d){
    		var tx = x(d.year)+halfbandwidth;
    		var ty = y(d.value);
    		return "translate("+tx+","+ty+")";
    })

    g.selectAll(".value_text")
    .data(data)
    .enter()
    .append("text")
    .attr("class","value_text")
    .text(function(d){
    	return d.value+"%";
    })
    .attr("x", function(d) { return x(d.year)+halfbandwidth;})
    .attr("y", function(d) { return y(d.value);})

    g.selectAll(".bottom-curve-L")	
    	.data(data)
    	.enter()
    	.append("path")
    	.attr("class","bottom-curve-L")
    	.attr("d",function(d){
    		var newWidth = width/data.length;
    		newWidth = (newWidth-x.bandwidth())/2-4;
    		this.newWidth = newWidth;
    		return "M0 "+-newWidth+" C 0 "+-newWidth+", 0 10, "+newWidth+" "+newWidth+" L 0 "+newWidth;
    	})
    	.attr("stroke-width","1")
    	.attr("transform", function(d,i){
    		var tx = x(d.year)+x.bandwidth();
    		var ty = height-this.newWidth;
    		return "translate("+(tx)+","+ty+")";
    	})
    	.attr("fill",function(d,i){
    		if((i+1)==data.length) return "#333";
    		return getColor(d.value)
    	}) 

    g.selectAll(".bottom-curve-R")	
    	.data(data)
    	.enter()
    	.append("path")
    	.attr("class","bottom-curve-R")
    	.attr("d",function(d){
    		var newWidth = width/data.length;
    		newWidth = (newWidth-x.bandwidth())/2-4;
    		this.newWidth = newWidth;
    		return "M0 "+-newWidth+" C 0 "+-newWidth+", 0 10, "+-newWidth+" "+newWidth+" L 0 "+newWidth;
    	})
    	.attr("stroke-width","1")
    	.attr("transform", function(d,i){
    		var tx = x(d.year);
    		var ty = height-this.newWidth;
    		return "translate("+(tx)+","+ty+")";
    	})
    	.attr("fill",function(d,i){
    		if(i==0) return "#333";
    		return getColor(d.value)
    	}) 