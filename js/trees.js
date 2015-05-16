(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoieG11bm96IiwiYSI6IkN5MzZ1Y3MifQ.7lRhW5rm5NNZrt7zlIyoJQ';
    $.get("/prkng/data/trees.json", function(data) {
        var map = L.mapbox.map('map', 'xmunoz.m6ne5bbl').setView([46.85, -71.29], 10);
        var markers = new L.MarkerClusterGroup({ showCoverageOnHover: false });

        for (var i = 0; i < data.length; i++) {
            var a = data[i];
            var title = a[2];
            var marker = L.marker(new L.LatLng(a[0], a[1]), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'park', 'marker-size': 'large', 'marker-color': '7ec9b1'}),
              title: title
            });
            marker.bindPopup("tree");
            markers.addLayer(marker);
        }
        map.addLayer(markers);
    });
    //var map = L.mapbox.map('map', 'xmunoz.m6ne5bbl', {'worldCopyJump': true}).setView([49, -75], 6);
    //var featureLayer = L.mapbox.featureLayer().addTo(map);
    //featureLayer.loadURL('trees1.geojson');
})();
