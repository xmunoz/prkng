(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
    var map = L.mapbox.map('map')
        .setView([46.85, -71.29], 10)
        .addLayer(L.mapbox.tileLayer("xmunoz.m6ne5bbl"));

    var overlays = L.layerGroup().addTo(map);
    var layers;

    L.mapbox.featureLayer()
        .loadURL('/prkng/data/trees.geojson')
        .on('ready', function(e) {
            layers = e.target;
            showTrees();
        });

    var type_filters = $("#filters .form-group [name='type']");
    var diameter_filters = $("#filters .form-group [name='diameter']");
    var district_filters = $("#filters .form-group [name='district']");

    function getCheckedFilters() {
        var list = {};
        list.location = []
        list.diameter_ranges = []
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
        for (var i = 0; i < district_filters.length; i++) {
            //pass
        }

        return list;
    }

    function showTrees() {
        var list = getCheckedFilters();
        overlays.clearLayers();
        var clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
        layers.eachLayer(function(layer) {
            // location type filter
            if (list.location.indexOf(layer.feature.properties.location_type) !== -1) {
                // diameter filter
                if (diameterSelected(list.diameter_ranges, layer.feature.properties.diameter)) {
                    var content = '<p>' + layer.feature.properties.latin_name + '<br \/>' +
                            '<p>Location: ' + layer.feature.properties.district+ '<br \/>' +
                            '<p>Diameter: ' + layer.feature.properties.diameter + '<br \/>';
                    layer.bindPopup(content);
                    clusterGroup.addLayer(layer);
                }
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
