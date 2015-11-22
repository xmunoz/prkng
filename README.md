# prkng
[prkng](http://www.prk.ng/) is a Montreal-based startup that I interviewed with once upon a time. The interview problem was to map all of the trees in Quebec City with some csv data from a government website. As it turns out, Quebec City has a lot of trees, so instead, I took the first 1,000 trees and mapped those. The live demo can be found [here](http://www.xmunoz.com/prkng).

- `bin` has the data processing and reformatting script
- `data` has the raw and processed data
-  `js` is where the rendering, filtering, and display client-side javascript lives

This project relys heavily on [Mapbox](https://www.mapbox.com/), [mapbox.js](https://www.mapbox.com/mapbox.js/api/v2.1.9/) and [turf.js](http://turfjs.org/).
