# STAC Items

The core of a SpatioTemporal Asset Catalog (STAC) is a set of JSON fields defined by the 
[STAC Item spec](item-spec.md). These fields define an `Item` - the atomic units that contain 
metadata for search as plus links to the actual assets that they represent. Their main function 
is as the leaf nodes of a [Catalog](../catalog-spec/), and are also returned from the search
endpoints of a `/stac/search` endpoint.

## In this directory


**The Specification:** The main definition of the STAC Item specification is in 
*[item-spec.md](item-spec.md)*. It includes an overview and in depth explanation of the fields.

**Examples:** For samples of how STAC Items can be implemented the *[examples/](examples/)* folder 
contains a number of real world examples. See the [readme](examples/README.md) for additional 
discussion of the examples.

**Schemas:** The schemas to validate the core `Item` definition are found in the 
*[json-schema/](json-schema/)* folder. The primary one is *[stac-item.json](json-schema/stac-item.json)*, 
and it also includes the necessary *[geojson.json](json-schema/geojson.json)* schema definition, 
which is a dependency.


## Schema Validation

Instruction on schema validation for STAC Items can be found in the [validation instructions](validation/README.md).


## Item Evolution 

STAC Items are still a work in progress, and feedback is very much appreciated. The core fields 
were designed to be quite flexible, adapting to many different data organization schemes. 
Organizations are encouraged to adapt the core fields to their needs, finding any limitations that 
would need to be addressed the specification.

Implementors are encouraged to publish their implementations, ideally including them in the 
[implementations list](../implementations.md) for others to lean from.
This will enable a spreading of best practices, as organizations can see how others implemented
similar concepts and adopt them. These should eventually evolve in to extensions that are widely 
used.

There is already some first iterations of shared fields in the [extensions/](../extensions/) 
folder, which is used mostly to represent additional domain-specific information. The core STAC 
fields were made to be flexible to a variety of assets. But there is a lot of value in shared 
fields that may not apply to every STAC data type, but are shared by a certain domain. There is a 
just released 'extension' for satellite imagery, in the 'EO extension', so try to use it if you
are providing satellite imagery data. 


The evolution of the STAC Item spec will take place in this repository, primarily informed by the 
real world implementations that people create. The goal is for the core Item spec to remain
quite small and stable, with most all the evolution taking place in extensions. Once there is 
a critical mass of implementations utilizing different extensions the core Item spec will lock
down to a 1.0.





