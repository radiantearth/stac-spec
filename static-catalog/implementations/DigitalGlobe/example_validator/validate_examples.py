import os
import json
from jsonschema import validate, RefResolver

# find our schema root folder
schema_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "json-schema"))
schema_root_url = "file:///{}/".format(schema_folder.replace('\\', '/'))

# get the schema and the reference resolver
with open(os.path.join(schema_folder, 'spatiotemporal_feature.json')) as schema_file:
    schema = json.load(schema_file)
    resolver = RefResolver(schema_root_url, schema)

# for each example file in the folder validate against the schema
example_directory = os.path.join(os.path.dirname(__file__), '..', 'examples')
for filename in os.listdir(example_directory):
    with open(os.path.join(example_directory, filename)) as example_file:
        example = json.load(example_file)

    # validate against the schema
    validate(example, schema, resolver=resolver)
    print('validated {}'.format(filename))



