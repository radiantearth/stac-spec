import os
import json
import ssl
from collections import ChainMap
from tempfile import TemporaryDirectory
from urllib.request import urlopen
from urllib.parse import urlparse
from urllib.error import (HTTPError, URLError)


import jsonschema
from jsonschema.validators import RefResolver

from pystac import STAC_IO
from pystac.utils import make_absolute_href
from pystac.serialization import (identify_stac_object, STACObjectType)

CORE_SCHEMAS = {
    STACObjectType.CATALOG: 'catalog-spec/json-schema/catalog.json',
    STACObjectType.COLLECTION: 'collection-spec/json-schema/collection.json',
    STACObjectType.ITEM: 'item-spec/json-schema/item.json',
    STACObjectType.ITEMCOLLECTION: 'item-spec/json-schema/itemcollection.json',
}

EXTENSION_SCHEMAS = {
    'asset': {
        STACObjectType.COLLECTION: 'extensions/asset/json-schema/asset-collection.json'
    },
    'checksum': {
        STACObjectType.ITEM: 'extensions/checksum/json-schema/checksum-item.json'
    },
    'datacube': {
        STACObjectType.ITEM: 'extensions/datacube/json-schema/datacube-item.json'
    },
    'datetime-range': {
        STACObjectType.ITEM: 'extensions/datetime-range/json-schema/datetime-range-item.json'
    },
    'eo': {
        STACObjectType.ITEM: 'extensions/eo/json-schema/eo-item.json'
    },
    'label': {
        STACObjectType.ITEM: 'extensions/label/json-schema/label-item.json'
    },
    'pointcloud': {
        STACObjectType.ITEM: 'extensions/pointcloud/json-schema/pointcloud-item.json'
    },
    'sar': {
        STACObjectType.ITEM: 'extensions/sar/json-schema/sar-item.json'
    },
    'scientific': {
        STACObjectType.ITEM: 'extensions/scientific/json-schema/scientific.json',
        STACObjectType.COLLECTION: 'extensions/scientific/json-schema/scientific.json'
    },
    'single-file-stac': {
        STACObjectType.ITEMCOLLECTION: 'extensions/single-file-stac/json-schema/single-file-stac.json'
    }
}


# Set the STAC_IO read method to read HTTP.
# Skip SSL Certification because it fails on some machines.
def unsafe_read_https_method(uri):
    parsed = urlparse(uri)
    if parsed.scheme == 'https':
        context = ssl._create_unverified_context()
        with urlopen(uri, context=context) as f:
            return f.read().decode('utf-8')
    elif parsed.scheme == 'http':
        with urlopen(uri) as f:
            return f.read().decode('utf-8')
    elif parsed.scheme != '':
        raise URLError("Can't read scheme {}".format(parsed.scheme))
    else:
        with open(uri) as f:
            return f.read()

STAC_IO.read_text_method = unsafe_read_https_method

def find_all_examples():
    root_dir = os.path.abspath('.')
    examples = []
    for root, folders, files in os.walk(root_dir):
        if 'api-spec' in root:
            continue

        if 'examples' in root:
            for f in files:
                if f.endswith('.json'):
                    examples.append(os.path.join(root, f))
    return examples

class SchemaCache:
    def __init__(self):
        self.cached_schemas = {}

    def get_schema_and_resolver(self, schema_path):
        result = self.cached_schemas.get(schema_path)
        if result is None:
            schema = STAC_IO.read_json(schema_path)
            resolver = RefResolver(base_uri='file:{}'.format(os.path.abspath(schema_path)),
                                   referrer=schema)
            result = (schema, resolver)
            self.cached_schemas[schema_path] = result

        return result

def run_validation():
    schema_cache = SchemaCache()
    examples = find_all_examples()

    for example in examples:
        print('Validating example file: {}'.format(example))

        d = STAC_IO.read_json(example)

        info = identify_stac_object(d)
        object_type = info.object_type
        extensions = info.common_extensions

        schema_paths = [CORE_SCHEMAS[object_type]]

        for extension in extensions:
            e_schemas = EXTENSION_SCHEMAS.get(extension)
            if e_schemas is None:
                # Check that this is a URI.
                # Simply make sure it ends in .json to indicate it's a schema.
                # (Not robust, but good enough for examples).
                if not extension.endswith('.json'):
                    raise Exception('Extension {} has no associated schemas'.format(extension))
            else:
                schema_path = e_schemas.get(object_type)
                if schema_path is None:
                    raise Exception('Extension {} has no associated '
                                    'schema for object type {}'.format(extension, object_type))
                schema_paths.append(schema_path)

        # Handle Collection common properties for Items
        if object_type == STACObjectType.ITEM:
            for l in d['links']:
                if l['rel'] == 'collection':
                    collection_href = make_absolute_href(l['href'], example)
                    try:
                        collection_d = STAC_IO.read_json(collection_href)
                        if 'properties' in collection_d:
                            d['properties'] = dict(ChainMap(d['properties'],
                                                            collection_d['properties']))
                    except (HTTPError, URLError):
                        # Ignore fake URLs
                        pass

        for schema_path in schema_paths:
            print('   Validating against {}'.format(schema_path))
            schema, resolver = schema_cache.get_schema_and_resolver(schema_path)

            jsonschema.validate(instance=d,
                                schema=schema,
                                resolver=resolver)

if __name__ == '__main__':
    run_validation()
