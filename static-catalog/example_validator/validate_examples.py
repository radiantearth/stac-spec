import os
import json
from jsonschema import validate, RefResolver

# load the json schema for a feature
with open(os.path.join(os.path.dirname(__file__), '..', 'json-schema', 'spatiotemporal_feature.json')) as schema_file:
    schema = json.load(schema_file)

# setup the json schema resolver
schema_root_url = 'file:///{}/../json-schema/'.format(os.path.dirname(__file__))
resolver = RefResolver(schema_root_url, 'geojson.json')

# for each example file in the folder validate the schema
example_directory = os.path.join(os.path.dirname(__file__), '..', 'examples')
for filename in os.listdir(example_directory):
    with open(os.path.join(example_directory, filename)) as example_file:
        example = json.load(example_file)
    validate(example, schema, resolver=resolver)
    print('{} validated'.format(filename))
