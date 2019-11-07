#!/usr/bin/env python

# Read 'pdal info --all' output and emit a STAC pc object
# conda create -n pdal-stac -c conda-forge pdal
# conda activate pdal-stac
# pdal info --all ~/dev/git/pdal/test/data/autzen/autzen-full.laz |./pdal-to-stac.py

import sys
import json
import os


data = sys.stdin.read()

j = json.loads(data)

def capture_date(pdalinfo):
    import datetime
    year = pdalinfo['metadata']['creation_year']
    day = pdalinfo['metadata']['creation_doy']
    date = datetime.datetime(int(year), 1, 1) + datetime.timedelta(int(day) - 1)
    return date.astimezone().isoformat()+'Z'

def convertGeometry(geom, srs):
    import ogr
    import osr
    in_ref = osr.SpatialReference()
    in_ref.SetFromUserInput(srs)
    out_ref = osr.SpatialReference()
    out_ref.SetFromUserInput('EPSG:4326')

    g = ogr.CreateGeometryFromJson(json.dumps(geom))
    g.AssignSpatialReference(in_ref)
    g.TransformTo(out_ref)
    return json.loads(g.ExportToJson())


def convertBBox(obj):
    output = []
    output.append(float(obj['minx']))
    output.append(float(obj['miny']))
    output.append(float(obj['minz']))
    output.append(float(obj['maxx']))
    output.append(float(obj['maxy']))
    output.append(float(obj['maxz']))
    return output


output = {}

try:
    output['geometry'] = convertGeometry(j['boundary']['boundary_json'],j['metadata']['comp_spatialreference'])
except KeyError:
    output['geometry'] = j['stats']['bbox']['EPSG:4326']['boundary']

output['bbox'] = convertBBox(j['stats']['bbox']['EPSG:4326']['bbox'])
output['id'] = os.path.basename(j['filename'])
output['type'] = 'Feature'

assets = {}
#assets['thumbnail'] =
properties = {}

properties['pc:schemas'] = j['schema']['dimensions']
properties['pc:statistics'] = j['stats']['statistic']
properties['title'] = "USGS 3DEP LiDAR"
properties['item:provider'] = "USGS"
properties['item:license'] = 'LICENSE'
properties['pc:type'] = 'lidar' # eopc, lidar, radar, sonar
try:
    properties['pc:density'] = j['boundary']['avg_pt_per_sq_unit']
except KeyError:
    properties['pc:density'] = 0
properties['pc:count'] = j['metadata']['count']

properties['pc:encoding'] = 'LASzip' if bool(j['metadata']['compressed']) else 'None'

properties['datetime'] = capture_date(j)

output['properties'] = properties
output['assets'] = assets

link = {'rel':'self',"href":j['filename']}
output['links'] = [link]

sys.stdout.write(json.dumps(output,sort_keys=True,
                  indent=2, separators=(',', ': ')))
