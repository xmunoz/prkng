import csv
import sys
import os.path
import inspect
import json
from collections import Counter

DATA_DIR= os.path.join(os.path.dirname(os.path.dirname(
        os.path.abspath(inspect.getfile(inspect.currentframe())))), "data")

def write_to_geojson(infile, outfile="trees.geojson"):
    data = {}
    data["type"] = "FeatureCollection"
    data["features"] = []
    count = 0
    with open(infile, "rb") as csvfile:
        reader = csv.DictReader(csvfile, delimiter="|")
        for row in reader:
            long = float(row["LONGITUDE"].replace(",", "."))
            lat = float(row["LATITUDE"].replace(",", "."))
            new_row = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [long, lat],
                },
                "properties": {
                    "location_type": row["\xef\xbb\xbfTYPE_LIEU"],
                    "latin_name": row["NOM_LAT"],
                    "common_name": row["NOM_FR"],
                    "tree_type": row["TYPE_ARBRE"],
                    "diameter": int(row["DIAMETRE"]) if row["DIAMETRE"] != "" else None,
                    "size": row["POS_MESURE"],
                    "multi": row["MULTI_TRONC"],
                    "place_type": row["TYPE_PROP"],
                    "district": row["SPECIFIQUE"],
                    "marker-color": "#3ca0d3",
                    "marker-size": "large",
                    "marker-symbol": "park"
                }
            }
            count += 1
            if count < 1000 or new_row["properties"]["diameter"] == None or new_row["properties"]["location_type"] == "Non disponible":
                data["features"].append(new_row)

    outfile = os.path.join(DATA_DIR, outfile)
    with open(outfile, "w") as geojson:
        geojson.write(json.dumps(data))


def write_to_json(infile, outfile="trees.json"):
    data = []
    types = Counter()
    diameter = Counter()
    with open(infile, "rb") as csvfile:
        reader = csv.DictReader(csvfile, delimiter="|")
        for row in reader:
            long = row["LONGITUDE"].replace(",", ".")
            lat = row["LATITUDE"].replace(",", ".")
            new_row = [float(lat), float(long), row["DIAMETRE"]]
            data.append(new_row)
            # get possible values
            types[row["\xef\xbb\xbfTYPE_LIEU"]] += 1
            diameter[int(row["DIAMETRE"]) if row["DIAMETRE"] != "" else 999] += 1

    outfile = os.path.join(DATA_DIR, outfile)
    with open(outfile, "w") as jsn:
        jsn.write(json.dumps(data))

    print "type: %s" % types
    print "diameter: %s" % sorted(diameter.items())

def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: %s <filename>" % sys.argv[0])
        sys.exit(1)

    if not os.path.exists(sys.argv[1]):
        sys.stderr.write("File %s doesn't exist" % sys.argv[1])
        sys.exit(1)
    
    write_to_geojson(sys.argv[1])
    #write_to_json(sys.argv[1])


if __name__ == "__main__":
    main()
