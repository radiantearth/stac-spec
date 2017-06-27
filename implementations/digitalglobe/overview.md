# Caveat

This introduction is from the perspective of someone not involved with creating the various DigitalGlobe catalogs, but who has gotten to look behind the curtain during the last several months.  The perspective is also from DigitalGlobe's platform division which is somewhat different than the perspective of folks in the imagery division.

# Interface Experiences

The current leading catalog interfaces in DigitalGlobe platform are known as Catalog V2 and VectorServices, which are both powered by the same underlying datastore (VectorServices).  Catalog V2 and VectorServices are documented [here](https://gbdxdocs.digitalglobe.com/docs/catalog-v2-course) and [here](https://gbdxdocs.digitalglobe.com/docs/read-vector-services-overview), respectively.

The REST interface to Catalog V2 allows direct lookup of a JSON record based on it's unique identifier.  Each record also contains a list of types that (informally) specify which fields are available in the properties section of the record.  Types are freeform text conventions used to identify things like particular satellite sources, data levels, and sensor types.  It also implements a JSON REST API that requires querying by location (specified as WKT) and allows for querying by date and type via top-level JSON fields.  The JSON query payload also includes a general "filters" request that implements a custom? query language for filtering on other parameters.  It returns this data as a JSON result set that includes result data as well as result count statistics.  This is in contrast to VectorServices which returns GeoJSON results.

Despite the creation of a custom query language, the Catalog V2 query interface is generally considered usable at DigitalGlobe.  VectorServices' more standard GeoJSON response is, however, preferred to the Catalog V2 response.  In Platform, the most common imagery starting point are raw pre-orthorectified radiances presented as scaled, integer-quantized radiance values. These are provided along with a full set of metadata suitable for processing the data into higher level products such as orthorectified surface reflectance products or DEMs.  As such, the baseline imagery metadata elements that are returned by queries is another point of discussion that arises.  Beyond this, most catalog discussion has focused on the experiences achieved by a variety of different implementation strategies.  

# Implementation Background

DigitalGlobe has built a variety of different catalog systems in the past, with varying degrees of success.  Internally, groups have not been completely happy with any implementation in particular, and are therefore reluctant to recommend any one wholesale to the community.  One major challenge in standardizing within DigitalGlobe seems to be that imagery producers have very different requirements than the various types of consumers of who, in turn, can have very different requirements from each other.  As a result, there has been pressure to overgeneralize the structure of data stored in the catalog, the query interfaces used to access it, and the resulting output structures.  This has hampered the efforts of all implementation strategies that have been attempted.  

Four classes of catalogs have been attempted at DigitalGlobe: traditional (relational), graph-based, document-based, and flat-file-based.  In all but the memory case, a RESTish API is placed in front of the actual data store to facilitate access.  The majority of folks at DigitalGlobe Platform seem to agree that catalog REST APIs should return GeoJSON (which is not reflected in Catalog V2).  This reflects a world view in which imagery consists of localized collections, and that location is the primary factor in determining utility, which has been generally true in the past, but may be challenged by the work of Planet and others developing high-revisit, global datasets.  

The presence of a REST API for querying immediately requires specification of what parameters are available to be queried, which, naturally, is a point of contention.  While the basics like acquisitionDate, footprint, and cloudCover are easy, attributes like offNadirAngle are of particular use to people developing DEMs or atmospheric compensation techniques.  Detailed metadata about spacecraft attitude, conditions, and acquisition parameters, while crucial for those responsible for creating imagery products, are often irrelevant to consumers of higher level products.  At DigitalGlobe both groups exist and are influential.

## Traditional Catalogs

Traditional catalogs based on spatially-enabled relational databases exist and are used in certain groups at DigitalGlobe.  These groups go as far as to bypass REST APIs, preferring instead to query these based on SQL.  One such catalog enables the creation of DigitalGlobe Maps API global mosaics.  Unfortunately, the flexible SQL approach cannot be shared across the organization and a REST API on top of that ends up being too limited for most people's uses.

## Graph-based Catalogs

While they may seem completely ridiculous at first, graph-based catalogs are actually based in reason.  The logic is that as an imagery producer, DigitalGlobe exposes a variety of imagery products based on the same underlying imagery.  These products are related by a series of processing steps used to derive them from one (or more) source products.  The logic is that indexing them into a graph database maintains provenance through the full set of standard products as well as potentially any derivitive products that are produced and indexed.  This would be all well and good except that typical usage patterns don't really care about that view, graph queries are unfamiliar to most people, and compatibility layers are slow and limited.

## Document-based Catalogs

The current GBDX Catalog V2 API is a compatibility layer on top of a general vector store based on elasticsearch.  The result is that while the REST interface to the catalog is limited, the underlying datastore can accomodate querying nearly any metadata structure via nearly any query strategy.  The cost of this, aside from performance (which is surmountable) is that people querying the underlying data store need to be intimately familiar with the specific data they are querying, since it's structure can be anything.

## Flat-File-based Catalogs

In certain situations it's convenient to be able to just download a full index and query it client side.  The index can be just thrown up on S3 or similar for clients to download.  
