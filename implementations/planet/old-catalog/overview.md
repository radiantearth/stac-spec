## Introduction

This is the Catalog API that was the catalog before the current Data API. It is similar to the Data API, but has some 
nice features that didn't yet get included in the Data API. One of those is that it is more self-describing. The 'catalog v1'
swagger spec lays out the core constructs and end points. But then each catalog has a /spec call that returns a catalog specific
swagger document. In this it fully describes the metadata that can be queried, so a client (like GDAL) can know what is on offer.
An example instance is in this folder, [v1-catalog-grid-utm-25km-experimental.yaml](v1-catalog-grid-utm-25km-experimental.yaml)

The catalog instance also shows a nice GET interface for querying the catalog, instead of having to rely on posting json for 
a search. The other bit that is nice in Catalog API that is not in Data V1 is that you can go to a catalogs /items/ and actually
see the latest items listed it out, so it links all the way down to the individual items and thus is a bit more crawlable.

## Background

See the overall [Planet overview](../overview.md) for more context on this. 
 
