// Construct a bounding box for this map that the user cannot
// move out of
var southWest = L.latLng(-11.82434, 93.03223),
    northEast = L.latLng(8.66792, 140.97656),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
	maxBounds: bounds,
    maxZoom: 17,
    minZoom: 4.5
}).setView([-0.74705, 117.68555], 5);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

// console.log(statesData.features[5].properties);

// Batas zoom map
var mapZoom = 6;
var mapZoomProvince = 5;
var mapZoomKec = 7;

// Color for Jokowi and Prabowo
var JKcolor = '#ff0000';
var PBcolor = '#ffcc00';

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
// 	maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
// 		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
// 		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
// 	id: 'mapbox.light'
// }).addTo(map);

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
});

var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        pane: 'labels'
}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	if(map.getZoom() >= mapZoom) {
		this._div.innerHTML = '<h4>Provinsi</h4>' +  (props ?
			'<b>' + props.NAME_1 + '<br />' + (props.NAME_2.startsWith('Kota') ? '' : 'Kota/Kabupaten ') + props.NAME_2 + '</b>' + '<br /> Prabowo-Hatta: ' + numberWithCommas(props.PRABOWO) + ', Jokowi-JK: ' + numberWithCommas(props.JOKOWI)
			: 'Arahkan Kursor ke Kota/Kabupaten');
	}
	else {
		this._div.innerHTML = '<h4>Provinsi</h4>' +  (props ?
			'<b>' + props.NAME_1 + '<br /></b> Prabowo-Hatta: ' + numberWithCommas(props.PRABOWO) + ', Jokowi-JK: ' + numberWithCommas(props.JOKOWI)
			: 'Arahkan Kursor ke Provinsi');
	}
};

info.addTo(map);

// generate bar chart
map.on('zoomend', function() {
	if(map.getZoom() == mapZoomProvince) {
		// Zoom level: provinsi
		var zoomLevel = 1;
		createBarChart('', 1, zoomLevel); // utk prabowo
		createBarChart('', 2, zoomLevel); // utk jokowi
		// $('#tree-container').hide('slow');
		// var treeContainer = document.getElementById("tree-container");
		// treeContainer.style.display = 'none';
	}
});
var suaraJK = 70997607, suaraPB = 62576585;
createStackedBar(suaraJK, suaraPB);
createBarChart('', 1, 1); // utk prabowo
createBarChart('', 2, 1); // utk jokowi

// get color depending on population density value
function getColor(d) {
	var scale = chroma.scale([PBcolor, 'white',JKcolor])
		// .domain([0.019383697813121274,0.5,0.9934597646748043]);
		// .domain([0.26627515,0.5,0.907369037]);
		.domain([0.19383697813121274,0.5,0.7934597646748043]);
		return (scale(d).hex());
}

function getColor2(d) {
	return d > 1000 ? '#800026' :
	       d > 500  ? '#BD0026' :
	       d > 200  ? '#E31A1C' :
	       d > 100  ? '#FC4E2A' :
	       d > 50   ? '#FD8D3C' :
	       d > 20   ? '#FEB24C' :
	       d > 10   ? '#FED976' :
	                  '#FFEDA0';
}

function style(feature) {
	var percentage = ((feature.properties.JOKOWI) / (feature.properties.JOKOWI + feature.properties.PRABOWO));
	return {
		weight: 1,
		opacity: 1,
		color: 'grey',
		dashArray: '3',
		fillOpacity: 0.8,
		fillColor: getColor(percentage)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#404040',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);

	createPie(layer.feature.properties);
	// console.log(layer.feature.properties);
}

var geojsonProvinsi, geojsonKabupaten;

function resetHighlight(e) {
	geojsonKabupaten.resetStyle(e.target);
	geojsonProvinsi.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
	checkIsKec(e);
	generateBarChart(e, 1); // prabowo
	generateBarChart(e, 2); // jokowi
}

function checkIsKec(e) {
	if(map.getZoom() >= mapZoom) {
		var layer = e.target;
		createTreeMap(layer.feature.properties);
		// console.log(layer.feature.properties);
	}
}

function generateBarChart(e, type) {
	// type == 1 utk Prabowo, 2 utk Jokowi
	var layer = e.target;

	// if(map.getZoom() >= mapZoomKec) {
	// 	// Zoom level: kecamatan
	// 	var zoomLevel = 3;
	// }
	
	// else if(map.getZoom() >= mapZoom) {

	map.on('zoomend', function() {
		if(map.getZoom() >= mapZoom) {
			// Zoom level: kabupaten
			var zoomLevel = 2;
		}
		else if(map.getZoom() >= mapZoomProvince) {
			// Zoom level: provinsi
			var zoomLevel = 1;
		}

		createBarChart(layer.feature.properties, type, zoomLevel);
	});
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

function createTreeMap(data) {
	// console.log(data);
	var provinceName = data.NAME_1;
	var cityName = data.NAME_2;

	// var dataKecamatan --> data kec disimpan dalam array
	var found = false;
	var arrLen = dataKecamatan.length;
	var i = 0;

	// var objKec = dataKecamatan[0];
	// console.log(objKec);

	var listKec = [];

	while ((!found) && (i<arrLen)) {
		var objKab = dataKecamatan[i];
		if (objKab["Kota/Kabupaten"] == cityName) {
			var percentage = objKab["Jokowi-JK"] / (objKab["Jokowi-JK"] + objKab["Prabowo-Hatta"]) * 100;
			var objKec = {
				name: objKab["Tempat"],
				value: Math.floor(percentage * 100) / 100,
				colorValue: percentage
			}
			listKec.push(objKec);
		}
		i++;
	}
	// console.log(listKec);
	// console.log("panjang list kec:" + listKec.length);

	treeChart = new Highcharts.Chart({
		chart: {
            renderTo: 'tree-container'
        },
        colorAxis: {
            minColor: PBcolor,
            maxColor: JKcolor
            // maxColor: Highcharts.getOptions().colors[0]
        },
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: listKec
        }],
        title: {
            text: 'Perolehan Suara di Kecamatan untuk Provinsi ' + provinceName
        }
	});

	// $('#tree-container').show('slow');
	// var treeContainer = document.getElementById("tree-container");
	// treeContainer.style.display = 'block';
}

function createPie(data) {
	var percentageJK = ((data.JOKOWI) / (data.JOKOWI + data.PRABOWO)) * 100;
	var percentagePB = ((data.PRABOWO) / (data.JOKOWI + data.PRABOWO)) * 100;

	if(map.getZoom() >= mapZoom) {
		// Zoom level: kabupaten
		var text = 'Perolehan Suara di ' + data.NAME_2;
	}
	else if(map.getZoom() >= mapZoomProvince) {
		// Zoom level: provinsi
		var text = 'Perolehan Suara di ' + data.NAME_1;
	}
	
	var the_data = [];
	the_data.push(['Jokowi-JK',percentageJK]);
	the_data.push(['Prabowo-Hatta',percentagePB]);

	var color = [JKcolor, PBcolor];

	$('#container').highcharts({
		colors: color,
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: text
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            // pointFormat: '{series.name}: <b></b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                },
                showInLegend: true
            }
        },
        series: [{
        	name: 'Persentase',
            // colorByPoint: true,
            data: the_data,
            dataLabels: {
			    color:'black',
			    distance: -40,
			    formatter: function () {
			        if(this.percentage!=0)  return Math.round(this.percentage)  + '%';
			    }
			}
	    }],
	});
	// }).setOptions({colors: ['red','yellow']});
}

function createStackedBar(suaraJK, suaraPB) {
	stackedBar = new Highcharts.Chart({
        chart: {
            renderTo: 'stackedBar',
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [''],
            lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			labels: {
				enabled: false
			},
			minorTickLength: 0,
			tickLength: 0
        },
        yAxis: {
            min: 0,
            gridLineColor: 'transparent',
            title: {
				text: ''
            },
            labels: {
				enabled: false
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
        	bar: {
				dataLabels: {
					enabled: true,
					formatter: function ()  {      
						if (this.y > suaraPB)
							return "Koalisi Indonesia Hebat " + ((this.y/(suaraJK+suaraPB))*100).toFixed(2) + '%';
						else
							return "Koalisi Merah Putih " + ((this.y/(suaraJK+suaraPB))*100).toFixed(2) + '%';
					},
					color: '#FFFFFF',
 					style: {
				        fontSize: '13px',
				        fontFamily: 'Montserrat, sans-serif'
			    	}
				}
			},
            series: {
                stacking: 'normal'
            }
        },
        exporting: { 
        	enabled: false 
        },
        credits: {
            enabled: false
        },
        tooltip : {
	        formatter: function() {
	            var tooltip = '<b>Total Suara Diperoleh: </b>' + numberWithCommas(this.y) + ' suara';
	            return tooltip;
	        }
	    },
        series: [{
            name: 'Jokowi-JK',
            data: [suaraJK],
            showInLegend: false,
            color: JKcolor
        },{
            name: 'Prabowo-Hatta',
            data: [suaraPB],
            showInLegend: false,
            color: PBcolor
        }]
    });
}

function createBarChart(data, type, zoomLevel) {
	// type == 1 utk Prabowo, 2 utk Jokowi
	// zoomLevel == 1 utk province level, 2 utk kabupaten, 3 utk kecamatan
	if (type == 1) {
		var container = 'bar-pb';
		var title = 'Prabowo-Hatta';
		var color = PBcolor;
	}
	else if (type == 2) {
		var container = 'bar-jk';
		var title = 'Jokowi-JK';
		var color = JKcolor;
	}

	if (zoomLevel == 1) {
		var tingkat = 'Provinsi';
		var arrLen = statesData.features.length;
	}
	else if (zoomLevel == 2) {
		var tingkat = 'Kota/Kabupaten untuk Provinsi ' + data.NAME_1;
		var arrLen = dataKabupaten.features.length;
		var provinceName = data.NAME_1;
		var cityName = data.NAME_2;
	}
	else if (zoomLevel == 3) {
		var tingkat = 'Kecamatan';
		var arrLen = dataKecamatan.length;
		var cityName = data.NAME_2;
		// var kecamatanName = data.NAME_2;
	}

	var listCategory = [];
	var listValue = [];
	
	for (var i=0; i<arrLen; i++) {
		if (zoomLevel == 1) {
			var objKab = statesData.features[i].properties;
			if (type == 1) {
				if (objKab["PRABOWO"] > objKab["JOKOWI"]) {
					var percentage = (objKab["PRABOWO"] / (objKab["JOKOWI"] + objKab["PRABOWO"])) * 100;
					listCategory.push(objKab["NAME_1"]);
					var objRes = {
						y: Math.round(percentage * 100) / 100,
						color: color
					}
					listValue.push(objRes);
				}
			}
			else if (type == 2) {
				if (objKab["JOKOWI"] > objKab["PRABOWO"]) {
					var percentage = (objKab["JOKOWI"] / (objKab["JOKOWI"] + objKab["PRABOWO"])) * 100;
					listCategory.push(objKab["NAME_1"]);
					var objRes = {
						y: Math.round(percentage * 100) / 100,
						color: color
					}
					listValue.push(objRes);
				}
			}
		}

		else if (zoomLevel == 2) {
			var objKab = dataKabupaten.features[i].properties;
			if (objKab["NAME_1"] == provinceName) {
				if (type == 1) {
					if (objKab["PRABOWO"] > objKab["JOKOWI"]) {
						var percentage = (objKab["PRABOWO"] / (objKab["JOKOWI"] + objKab["PRABOWO"])) * 100;
						listCategory.push(objKab["NAME_2"]);
						var objRes = {
							// name: objKab["NAME_2"],
							y: Math.round(percentage * 100) / 100,
							color: color
						}
						listValue.push(objRes);
					}
				}
				else if (type == 2) {
					if (objKab["JOKOWI"] > objKab["PRABOWO"]) {
						var percentage = (objKab["JOKOWI"] / (objKab["JOKOWI"] + objKab["PRABOWO"])) * 100;
						listCategory.push(objKab["NAME_2"]);
						var objRes = {
							// name: objKab["NAME_2"],
							y: Math.round(percentage * 100) / 100,
							color: color
						}
						listValue.push(objRes);
					}
				}
			}
		}
		// else if (zoomLevel == 3) {
		// 	var objKab = dataKecamatan[i];
		// 	if (objKab["Kota/Kabupaten"] == cityName) {

		// 	}
		// }
	}

	// Sorting listValue dan listCategory mengikuti order listValue
	for (var i=0; i<listValue.length-1; ++i) {
		for (var j=i+1; j<listValue.length; ++j) {
			if (listValue[i].y < listValue[j].y) {
				var tempValue = listValue[i];
				listValue[i] = listValue[j];
				listValue[j] = tempValue;
				var tempCategory = listCategory[i];
				listCategory[i] = listCategory[j];
				listCategory[j] = tempCategory;
			}
		}
	}

    barChart = new Highcharts.Chart({
        chart: {
            type: 'bar',
            height: 130 + 25 * listCategory.length,
            renderTo: container
        },
        title: {
            text: 'Dominasi Perolehan Suara untuk ' + title
        },
        subtitle: {
            text: 'Tingkat ' + tingkat
        },
        xAxis: {
            categories: listCategory,
            title: {
                text: null
            }
        },
        yAxis: {
        	min: 0,
        	max: 100,
            title: {
                text: '%',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' %'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'top',
        //     x: -40,
        //     y: 80,
        //     floating: true,
        //     borderWidth: 1,
        //     backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        //     shadow: true
        // },
        credits: {
            enabled: false
        },
        series: [{
        	showInLegend: false,
        	name: 'Persentase Perolehan Suara',
        	data: listValue,
        	color: color
    	}]
    });
}

map.on('zoomend', function() {
	// alert(map.getZoom());
	if(map.getZoom() >= mapZoom){
		geojsonKabupaten.addTo(map);
		map.removeLayer(geojsonProvinsi);
	}else{
		geojsonProvinsi.addTo(map);
		map.removeLayer(geojsonKabupaten);
	}
});

geojsonProvinsi = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);


geojsonKabupaten = L.geoJson(dataKabupaten, {
	style: style,
	onEachFeature: onEachFeature
})

// var areas = L.layerGroup([geojsonProvinsi,geojsonKabupaten]);

// alert(map);
// geojsonProvinsi.addTo(map);

var overlayMaps = {
    "Provinsi": geojsonProvinsi,
    "Kabupaten":geojsonKabupaten
};

// L.control.layers( overlayMaps).addTo(map);

// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

// legend.addTo(map);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
