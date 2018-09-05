## Static Catalog Examples

This directory no longer contains small samples of catalogs, as there are now several full catalogs 
available, plus a few external repositories that maintain samples. These will lag behind
the specification a little bit (as implementors aren't always able to instantly update their catalogs),
but it should be relatively easy to check the latest json portion of the spec to see what's changed.

#### Spacenet

[Spacenet](https://spacenetchallenge.github.io/) has made all their imagery available as STAC, and is 
currently at version 0.5.0 of the spec.

* Root catalog json is at https://s3.amazonaws.com/spacenet-stac/spacenet-dataset.json
* Browsable online version, powered by [stac-browser](https://github.com/radiantearth/stac-browser/) at https://vigilant-heyrovsky-0d9af8.netlify.com/
* Source code used to generate the catalog is at https://github.com/SpaceNetChallenge/stac-implementation

#### CBERS

[CBERS](https://en.wikipedia.org/wiki/China%E2%80%93Brazil_Earth_Resources_Satellite_program) is maintaining 
a full STAC Catalog, and keeping it up to date with the spec. It is currently at version 0.5.0.

* Root Catalog.json at https://cbers-stac.s3.amazonaws.com/catalog.json
* Browsable online version, powered by [stac-browser](https://github.com/radiantearth/stac-browser/) at http://cbers-stac.netlify.com/
* Source code to generate the catalog at https://github.com/fredliporace/cbers-2-stac

#### ISERV

[ISERV](https://www.nasa.gov/mission_pages/station/research/experiments/867.html) data is hosted by 
[Radiant.Earth](http://radiant.earth), created by [Azavea](http://azavea.com). It is currently at
version 0.4.1.

* Root catalog json is at https://s3-us-west-2.amazonaws.com/radiant-nasa-iserv/iserv.json
* Browsable online version, powered by [stac-browser](https://github.com/radiantearth/stac-browser/) at http://iserv-stac.netlify.com/
* Source code used to generate the catalog is https://github.com/raster-foundry/pystac

#### Planet Disaster Data

[Planet](http://planet.com) maintains a very small, hand-built catalog to serve as a reference example
of the spec. It is currently at version 0.5.0.

* Root catalog json is at https://storage.googleapis.com/pdd-stac/disasters/catalog.json
* The raw catalog files can be browsed at https://console.cloud.google.com/storage/browser/pdd-stac/disasters/hurricane-harvey/0831/
* Browsable online version, powered by [stac-browser](https://github.com/radiantearth/stac-browser/) at http://planet-stac.netlify.com/
* Repo where the stac catalog is evolved is at https://github.com/cholmes/pdd-stac/tree/master/disasters/hurricane-harvey

#### DigitalGlobe

[DigitalGlobe](http://digitalglobe.com) has a few examples of how they represent their data as STAC Items. It is currently at version
0.4.1

* Examples at https://github.com/TDG-Platform/dg-stac/tree/master/examples
