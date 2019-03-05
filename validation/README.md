# STAC Schema Validation

Any JSON Schema validation tool can be used, just run the JSON data to test
against the various STAC schema, and be sure to include any remote schema
like the geojson.json schema in the testing.

This directory includes installation instructions for a Python validator and
a JavaScript validator. The python validator is more complete and the
recommnded tool for validation. The Javascript validator has been deprecated
and will be removed in the next release.

## Python Validator

Install the validator from the
[stac-validator](https://github.com/sparkgeo/stac-validator) repository and
follow the instructions.

The validator can be run as a command line tool and will report on nested
catalogs as well as single items. There is no need to specifically identify
individual catalogs or items.

### Usage

```
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
```

E.g.

```bash
$ stac_validator.py https://earth-stac.s3.amazonaws.com/eo/landsat-8-l1/catalog.json -v latest
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