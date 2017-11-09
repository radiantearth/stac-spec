# Static Catalog

A static catalog is an implementation of the STAC specification that is simply a set of files on a web server.  The main purpose of the static catalog is to be crawled by various clients.

* The files of the static catalog will be JSON representations of a [STAC catalog feature](https://github.com/radiantearth/stac-spec/blob/dev/spec/spec.yaml#/definitions/Feature).
These JSON features will conform to are GEOJSON features that further conform to the [spatiotemporial_feature](https://github.com/TDG-Platform/stac-spec/blob/proposed_static_spec/static-catalog/json-schema/spatiotemporal_feature.json) JSON schema
