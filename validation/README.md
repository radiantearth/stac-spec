# STAC Schema Validation


Any JSON Schema validation tool can be used, just run the JSON data to test against the various STAC schema, and be sure to include any remote schema like the geojson.json schema in the testing. 

This directory includes installation instructions for a Python validator and a JavaScript validator. The python validator is more complete and the recommnded tool for validation.

## Python Validator
Install the validator from the [stac-validator](https://github.com/sparkgeo/stac-validator) repository and follow the instructions.

The validator can be run as a command line tool and will report on nested catalogs as well as single items.

```
stac_validator.py --help

Description: Validate a STAC item or catalog against the STAC specification.

Usage:
    stac_validator.py <stac_file> [-version] [--verbose] [--timer]

Arguments:
    stac_file  Fully qualified path or url to a STAC file.

Options:
    -v, --version STAC_VERSION   Version to validate against. [default: master]
    -h, --help                   Show this screen.
    --verbose                    Verbose output. [default: False]
    --timer                      Reports time to validate the STAC (seconds)


stac_validator.py https://earth-stac.s3.amazonaws.com/eo/landsat-8-l1/catalog.json -v latest

{
    "catalogs": {
        "valid": 1,
        "invalid": 0
    },
    "collections": {
        "valid": 0,
        "invalid": 0
    },
    "items": {
        "valid": 0,
        "invalid": 0
    }
}
```

## JavaScript Validator
### Initialization

In this directory run:

```bash
npm install
```

This installs node.js validation modules, in a node_modules directory created in this directory.

### Validation

In the following chapter there are commands to run a validation of any STAC against the JSON Schema.

**Warning:** Not all validation is fully complete. For items, the validator does not yet check for `self` 
links. The `href` checking is probably too loose right now, it just checks for a string, see the 
'relative vs absolute links' section  in the [Item spec](../item-spec/item-spec.md#relative-vs-absolute-links) for reasons why. 

### Catalogs

To run the validation for a catalog file:

```bash
npm run validate_catalog -- -d ../catalog-spec/examples/catalog.json
```

### Collections

To run the validation for a collection file:

```bash
npm run validate_collection -- -d ../collection-spec/examples/sentinel2.json
```

### Extensions

To run the validation for an extension:

```bash
npm run validate_extension -- -s ../extensions/scientific/schema.json -d ../extensions/scientific/example-merraclim.json
```

This example runs the validation for the scientific extension, please change the `-s` (schema file) and `-d` (data file) accordingly.

### Items

To run the validation for an item file:

```bash
npm run validate_item -- -d ../item-spec/examples/sample.json
```
