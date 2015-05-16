import csv
import sys
import os.path
import json

def write_to_geojson(infile, outfile="trees.geojson"):
    data = []
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
                }
            }
            data.append(new_row)
            
    with open(outfile, "w") as geojson:
        geojson.write(json.dumps(data))


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: %s <filename>" % sys.argv[0])
        sys.exit(1)

    if not os.path.exists(sys.argv[1]):
        sys.stderr.write("File %s doesn't exist" % sys.argv[1])
        sys.exit(1)
    
    write_to_geojson(sys.argv[1])    


if __name__ == "__main__":
    main()
