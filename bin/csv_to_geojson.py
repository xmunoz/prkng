import csv
import sys
import os.path
import json

def write_to_geojson(infile, outfile="trees.geojson"):
    data = {}
    data["type"] = "FeatureCollection"
    data["features"] = []
    with open(infile, "rb") as csvfile:
        reader = csv.DictReader(csvfile, delimiter="|")
        for row in reader:
            new_row = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row["LONGITUDE"], row["LATITUDE"]],
                },
                "properties": {
                    "latin_name": row["NOM_LAT"],
                    "common_name": row["NOM_FR"],
                    "tree_type": row["TYPE_ARBRE"],
                    "diameter": row["DIAMETRE"],
                    "size": row["POS_MESURE"],
                    "place_type": row["TYPE_PROP"],
                    "district": row["SPECIFIQUE"],
                    "marker-color": "#3ca0d3",
                    "marker-size": "large",
                    "marker-symbol": "park"
                }
            }
            data["features"].append(new_row)
            
    with open(outfile, "w") as geojson:
        geojson.write(json.dumps(data))


def write_to_json(infile, outfile="trees.json"):
    data = []
    with open(infile, "rb") as csvfile:
        reader = csv.DictReader(csvfile, delimiter="|")
        for row in reader:
            long = row["LONGITUDE"].replace(",", ".")
            lat = row["LATITUDE"].replace(",", ".")
            new_row = [float(lat), float(long), row["DIAMETRE"]]
            data.append(new_row)

    with open(outfile, "w") as jsn:
        jsn.write(json.dumps(data))

def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: %s <filename>" % sys.argv[0])
        sys.exit(1)

    if not os.path.exists(sys.argv[1]):
        sys.stderr.write("File %s doesn't exist" % sys.argv[1])
        sys.exit(1)
    
    #write_to_geojson(sys.argv[1])    
    write_to_json(sys.argv[1])    


if __name__ == "__main__":
    main()
