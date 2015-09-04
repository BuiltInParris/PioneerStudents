var m_width = $("#map").width(), width = $("body").width(), height = $("body").height(), country, state;
var projection = d3.geo.mercator().scale(180).translate([width / 2, height / 1.5]);
var path = d3.geo.path().projection(projection);
var cityImg = "";
var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);
svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", country_clicked);

var scriptran = 0;

var g = svg.append("g");
d3.json("/json/countries.topo.json", function(error, us) {
        g.append("g")
		.attr("id", "countries")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.countries).features)
		.enter()
		.append("path")
		.attr("id", function(d) { return d.id; })
		.attr("d", path)
		.on("click", country_clicked);
});

function zoom(xyz) {
        g.transition()
		.duration(750)
		.attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
		.selectAll(["#countries", "#states", "#cities"])
		.style("stroke-width", 1.0 / xyz[2] + "px")
		.selectAll(".city")
		.attr("d", path.pointRadius(50 / xyz[2]));
}

function get_xyz(d) {
        var bounds = path.bounds(d);
        var w_scale = (bounds[1][0] - bounds[0][0]) / width;
        var h_scale = (bounds[1][1] - bounds[0][1]) / height;
        var z = .96 / Math.max(w_scale, h_scale);
        var x = (bounds[1][0] + bounds[0][0]) / 2;
        var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
        return [x, y, z];
}

lastCountry = "";
function country_clicked(d) {
        g.selectAll(["#states", "#cities"]).remove();
        state = null;
	if (country) {
		g.selectAll("#" + country.id).style('display', null);
        } else{
	}
        if (d && country !== d) {
		var xyz = get_xyz(d);
		country = d;
		if (d.id == 'US' || d.id =='JPN') {
			d3.json("/json/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
				console.log(us);
				g.append("g")
					.attr("id", "states")
					.selectAll("path")
					.data(topojson.feature(us, us.objects.states).features)
					.enter()
					.append("path")
					.attr("id", function(d) { return d.id; })
					.attr("class", "active")
					.attr("d", path)
					.on("click", state_clicked);
					zoom(xyz);
					g.selectAll("#" + d.id).style('display', 'none');
			});
		} else {
			zoom(xyz);
		}
        } else {
		var xyz = [width / 2, height / 1.5, 1];
		country = null;
		zoom(xyz);
	}
	if(country == null)
                curCountry = ""
        else
                curCountry = country.id;

        if("" != curCountry){
       		$('#searchdiv').attr("style", "display:none");
		$('#logo').attr("style", "display:none");
		if($("#searchbox1").attr("class") == 'searchbox1')
		{
			$("#searchbox1").attr("class","hiddensearchbox1");
			$("#searchbox2").attr("class","hiddensearchbox2");
			$("#searchdiv1").attr("class","searchdiv slideUp");
			$("#searchdiv2").attr("class","searchdiv slideUp");
			$(".textholder").remove();
              		$('div :input').fancyInput();
		}
        } else {
		$('#logo').attr('style', "");
        	$('#searchdiv').attr('style', "");
 	}
        lastCountry = curCountry;	
}

function state_clicked(d) {
        g.selectAll("#cities").remove();
        city = null
	if (d && state !== d) {
		var xyz = get_xyz(d);
		state = d;
		country_code = state.id.substring(0, 3).toLowerCase();
		state_name = state.properties.name;
		if(country_code == "usa")
		{
			country_code = "us";
		}
		d3.json("/json/cities_" + country_code + ".topo.json", function(error, us) {
			cities = topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; });
				$(".cityclass").remove();

				var holdG = g.append("g")
					.attr("id", "cities")
					.selectAll("path")
					.data(cities)
					.enter()
					.append("path")
					.attr("class", "city")
					.attr("d", path.pointRadius(50 / xyz[2]))
					.attr("style", "fill:url(#cityholder)")
					.on('click', city_clicked);
				for(var i=0; i < cities.length; i++){
				g.append("defs")
					.append("pattern")
					.attr('preserveAspectRatio', 'xMidYMid meet')
					.attr('patternContentUnits', 'objectBoundingBox')
					.attr('height', '1')
					.attr('width', '1')
					.attr('x', '0')
					.attr('y', '0')
					.attr('class', "cityclass")
					.append("image")
					.attr('height', '1')
					.attr('width', '1')
					.attr('class', 'dotimgs')
					.attr('x', '0')
                                	.attr('y', '0')
					.attr("xlink:href", "/images/null");
				}
				
				k = 0;
				$(".city").each(function(){
					$(this).attr("id", cities[k].properties.username);
					$(this).css("fill", "url(#" + cities[k].properties.username + ")");
					k++;
				});
				k=0;
				$(".cityclass").each(function(){
                                        $(this).attr("id", cities[k].properties.username);
                                        k++;
                                });

				k = 0;
                                $(".dotimgs").each(function(){
                                        $(this).attr("href", "/images/" + cities[k].properties.image);
					k++;
                                });
			zoom(xyz);
		});
	} else {
		state = null;
		country_clicked(country);
        }
}

function city_clicked(d) {
        if (d && city !== d) {
                var xyz = get_xyz(d);
                city = d;
		$('#userModal').modal();
		$('#fullName').text(d.properties.name);
		$('#university').text(d.properties.university);
		$('#description').text(d.properties.description);
		$('#blog_link').attr("href", "/" + d.properties.username);
		$('#userImage').attr("src", "./images/" + d.properties.image);
		$("#userImage").css({width:"100%"});
        } else {
                city = null;
                state_clicked(state);
        }
}



$(window).resize(function() {
        var w = $("#map").width();
        svg.attr("width", w);
        svg.attr("height", w * height / width);
});
