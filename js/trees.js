(function() {
    # this is a public access token
    L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
    var map = L.mapbox.map('map')
        .setView([46.85, -71.29], 11)
        .addLayer(L.mapbox.tileLayer("xmunoz.m6ne5bbl"));

    var overlays = L.layerGroup().addTo(map);
    var treeLayers;
    var districtLayers;

    L.mapbox.featureLayer()
        .loadURL('/prkng/data/districts.geojson')
        .on('ready', function(e) {
            districtLayers = e.target;
        })
        .addTo(map);

    L.mapbox.featureLayer()
        .loadURL('/prkng/data/trees.geojson')
        .on('ready', function(e) {
            treeLayers = e.target;
            showTrees();
        });

    var type_filters = $("#filters .form-group [name='type']");
    var diameter_filters = $("#filters .form-group [name='diameter']");
    var district_filters = $("#filters .form-group [name='district']");

    function getCheckedFilters() {
        var list = {};
        list.location = []
        list.diameter_ranges = []
        list.districts = []

        for (var i = 0; i < type_filters.length; i++)
            if (type_filters[i].checked) list.location.push(type_filters[i].value);

        for (var i = 0; i < diameter_filters.length; i++) {
            if (diameter_filters[i].checked) {
                // if diameter is unavailable, add null
                if (diameter_filters[i].value == "na") {
                    list.diameter_ranges.push("na");
                }
                else {
                    var limits = diameter_filters[i].value.split("-")
                    list.diameter_ranges.push(limits);
                }
            }
        }

        // get selected districts
        var districts = [];
        for (var i = 0; i < district_filters.length; i++) {
            if (district_filters[i].checked) districts.push(district_filters[i].value);
        }
        // add selected district layers to list.districts
        districtLayers.eachLayer(function(dLayer) {
            if (districts.indexOf(dLayer.feature.properties.abbr) !== -1) list.districts.push(dLayer);
        });

        return list;
    }

    function districtFilter(districts, tree) {
        for (var i = 0; i < districts.length; i++) {
            if (turf.inside(tree.feature, districts[i].feature)) return true;
        }
        return false;
    }

    function locationTypeFilter(location, tree) {
        return location.indexOf(tree.feature.properties.location_type) !== -1;
    }

    function diameterFilter(diameter_ranges, tree) {
        return diameterSelected(diameter_ranges, tree.feature.properties.diameter);
    }

    function showTrees() {
        var list = getCheckedFilters();
        overlays.clearLayers();
        var clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
        treeLayers.eachLayer(function(layer) {
            var passesAllFilters = locationTypeFilter(list.location, layer)
                                    && diameterFilter(list.diameter_ranges, layer)
                                    && districtFilter(list.districts, layer);

            if (passesAllFilters) {
                var content = '<p>' + layer.feature.properties.latin_name + '<br \/>' +
                        '<p>Location: ' + layer.feature.properties.district+ '<br \/>' +
                        '<p>Diameter: ' + layer.feature.properties.diameter + '<br \/>';
                layer.bindPopup(content);
                clusterGroup.addLayer(layer);
            }
        });
    }

    function diameterSelected(ranges, diameter) {
        var null_index = ranges.indexOf("na");

        // first test null
        if (Number(diameter) !== diameter) {
            if (null_index != -1)
                return true;
            return false;
        }

        // then test actual ranges
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i].length == 2 && diameter >= ranges[i][0] && diameter <= ranges[i][1]) {
                return true;
            }
        }
        return false;
    }

    $("input[type=checkbox]" ).click(function() {
        showTrees();
    });

})();
