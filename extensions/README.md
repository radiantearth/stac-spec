# Extensions and Profiles

This folder contains profiles and extensions to the core SpatioTemporal Asset Catalog JSON specification. 

**Extensions** are changes in functionality, that extend the core. This can include new JSON files that are linked to from 
the core `links`, as well as new OpenAPI fragments.

**Profiles** specify additional fields outside the core STAC required items. Profiles should provide a sample `Item`, a
narrative explaining the fields and a JSON-Schema to validate compliance. Any data provider can create a profile, and 
when providers work together to share fields between them they can create a shared profile and include it in the STAC
repository.

### Earth Observation Profile

This directory includes an [Earth Observation Profile](stac-eo-spec.md). EO data is considered to be data that represents 
a snapshot of the earth for a single date and time. It could consist of multiple spectral bands in any part of the 
electromagnetic spectrum. Examples of EO data include sensors with visible, short-wave and mid-wave IR bands 
(e.g., the OLI instrument on Landsat-8), long-wave IR bands (e.g. TIRS aboard Landsat-8), as well as SAR instruments 
(e.g. Sentinel-1).

The profile provides common fields like cloud cover, off nadir, sun angle + elevation, gsd (ground sampled distance) and more.
It also defines a way to explain what bands a sensor collects, and how to specify which bands are contained in an asset

### Collection Extension

The [Collection Extension](stac-collection-spec.md) provides a way to specify data fields that are common across a 'collection'
of STAC `Items`, so that each does not need to repeat all the same information. 
