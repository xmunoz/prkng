(function() {
    $.ajax({
        'url' : 'trees1.geojson',
        'type' : 'GET',
        'success' : function(data) {
            mapTrees(data);
        },
        'error' : function(x, t, m) {
            console.log(t);
        }
    });

    function mapTrees(geojson) {
        var Mapbox = {};
        Mapbox.viewport = "map";
        Mapbox.$viewport = $('#' + Mapbox.viewport);
        Mapbox.load = function () {
            // API pub key
            window.L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
            // Create a map in the div #map
            window.L.mapbox.map(
                Mapbox.viewport,
                'xmunoz.hgclk828',
                {
                    'worldCopyJump': true
                }
            )
            .featureLayer.setGeoJSON(this.geoJSON);
        };
        Mapbox.init = function (geoJSON) {
            this.setGeoJSON(geoJSON);
            Mapbox.$viewport.ready(this.load.bind(this));
        };
        Mapbox.setGeoJSON = function (geoJSON) {
            geoJSON.forEach(function(item) {
                item.type = "Feature";
                item.geometry.type = "Point";
                item.properties['marker-color'] = "#fc4353";
                item.properties['marker-size'] = "medium";
                item.properties['marker-symbol'] = "swimming";
            });

            this.geoJSON = geoJSON;
        };

        Mapbox.init(geojson);
    }

})();
