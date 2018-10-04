#!/usr/bin/env python3

import sys
import json
import os


data = sys.stdin.read()
#with open('ak.json','rb') as d:
#    data = d.read()

j = json.loads(data)

def capture_date(pdalinfo):
    import datetime
    year = pdalinfo['metadata']['creation_year']
    day = pdalinfo['metadata']['creation_doy']
    date = datetime.datetime(int(year), 1, 1) + datetime.timedelta(int(day) - 1)
    return date.isoformat('T')

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



output = {}

try:
    output['geometry'] = convertGeometry(j['boundary']['boundary_json'],j['metadata']['comp_spatialreference'])
except KeyError:
    output['geometry'] = j['stats']['bbox']['EPSG:4326']['boundary']

output['bbox'] = j['stats']['bbox']['EPSG:4326']['bbox']
output['id'] = os.path.basename(j['filename'])
output['type'] = 'Feature'

assets = {}
#assets['thumbnail'] =
properties = {}

properties['pc:schema'] = j['schema']['dimensions']
properties['pc:statistics'] = j['stats']['statistic']
properties['c:id'] = os.path.basename(j['filename'])
properties['c:description'] = "USGS 3DEP LiDAR"
properties['provider'] = "USGS"
properties['license'] = 'LICENSE'
properties['pc:type'] = 'lidar' # eopc, lidar, radar, sonar
properties['pc:density'] = j['boundary']['avg_pt_per_sq_unit']
properties['pc:count'] = j['metadata']['count']

properties['pc:encoding'] = 'LASzip' if bool(j['metadata']['compressed']) else 'None'

properties['datetime'] = capture_date(j)

output['properties'] = properties
output['assets'] = assets

sys.stdout.write(json.dumps(output,sort_keys=True,
                  indent=2, separators=(',', ': ')))
