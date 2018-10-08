# About

This document represents a number of ideas for options and requirements that are under discussion.
Some will likely evolve in to requirements, or at least documented specification extensions. But there
is not yet enough consensus on how to represent them.

### Metadata Linking

In general STAC aims to be oriented around **search**, centered on the core fields that users will want to search on to find imagery.
The core is space and time, but there are often other metadata attributes that are useful. While the specification is flexible enough that
providers can fill it with tens or even hundreds of fields of metadata that is not recommended. If providers have lots of metadata then 
that should be linked to in an 'asset', indeed even a new json asset that is potentially easier to parse. There is a lot of metadata that
is only of relevance to advanced processing algorithms, and while that is important it should not be in the core STAC items.


### Prefixes

A spatiotemporal asset catalog item can combine schema information from several different sources - the core STAC item information, 
an earth observation community extension, and a vendor specific provider. It can be difficult to distinguish exactly where each definition
came from, and to pull out the most relevant information, especially when vendors often will dump in all the metadata they have in to the
STAC definition. 

So one idea is to have prefixes to differentiate specific vendors (like dg: for DigitalGlobe), and for communities of practice (like eo: for Earth 
Observation). These wouldn't be full namespacing, though an extension for like JSON-LD could potentially evolve to make fully resolved namespacing
an option. 

An example of this can be seen in a Landsat example:

```json

  "properties": {
    "start_datetime": "2014-06-02T2014-06-02",
    "end_datetime": "2014-06-02T2014-06-02",
    "provider": "LANDSAT_8",
    "license": "PDDL-1.0",

    "eo:off_nadir_angle" : -0.001,
    "eo:cloud_cover" : 10.31,
    "eo:sun_azimuth" : 149.01607154,
    "eo:sun_elevation" : 59.21424700,
    "eo:resolution" : 30,

    "l8:data_type": "L1T",
    "l8:wrs_path": 153,
    "l8:wrs_row": 25,
    "l8:earth_sun_distance": 1.0141560,
    "l8:ground_control_points_verify": 114,
    "l8:geometric_rmse_model": 7.562,
    "l8:image_quality_tirs": 9,
    "l8:ground_control_points_model": 313,
    "l8:geometric_rmse_model_x": 5.96,
    "l8:geometric_rmse_model_y": 4.654,
    "l8:geometric_rmse_verify": 5.364,
    "l8:image_quality_oli": 9

  },

```



### Asset definition

**Note: 0.6.0 defines Media types for assets, to provide more information about what is download, but there is likely
more work to be done to fully define the asset, so this section is left in for discussion**


It is of top priority to provide definitions of assets, so clients can know get some information as to 
what is actually contained in the data they are downloading. Assets should contain the metadata that is 
specific to the format of the asset. The asset must have some way to state its format. 

While assets in Catalog APIs can easily represent files that are generated on demand, a static
catalog should only list assets that already exist online. This increases the reliability and speed
of the catalog and makes it easier to fully duplicate or back-up a static catalog.


 There are a couple of ideas on how to define metadata for assets:

#### Inline Asset Definition

In this scenario assets would include a number of optional metadata fields that would provide additional
definition for clients. See for example DigitalGlobe's definition:

```json

   {	
      "href": "https://digitalglobe.com/catalog-spec/L1B/15NOV09180446-M1BS-056823192010_01_P002.TIF",
      "metadata": {
        "filetype": "geotif",
        "content": "image",
        "processing": {
          "RadiometricallyCorrected": true
        }
    },

 ```

 They then define the bands for the product directly within the 'properties'.

#### Linking to common definitions

In this scenario, an `Asset` must have some field that specifies a uri to a JSON file that has the additional metadata.

This would make sense at a Catalog or Dataset level, though more work is needed to define exactly how it would look. It
could be a generic Asset Definition JSON set of fields, that could be added at the dataset level or could be used 
independently. Ideally each Asset would have a way to link directly to its definition.

See for example a sample landsat definition:

```json

    {
      "href": "LC81530252014153LGN00_B4.TIF",
      "product" : "http://landsat-pds.s3.amazonaws.com/L8/landsat8_product-band-4.json",
    },

```

All the needed metadata for a client would be in the product level definition, which would mean a lot less
repeating of fields. But clients would have to be a bit smarter to actually follow the links. Though ideally
clients would be able to cache and reuse product definitions, and hopefully there would be a small number
of canonical product definitions online, that all static catalogs using a particular provider would be
able to reference.



