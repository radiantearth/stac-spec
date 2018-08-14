__Topics__
* Query Language
  * Filters
  * Sorting	
  * Projections
* STAC Browser
Add a new /stac endpoint to return catalog.json
```
{
    "name": "NAIP",
    "description": "Catalog of NAIP Imagery - 30087",

    "links": [
        { "rel": "self", "href": "https://mycatalog/stac" },
        { "rel": "child", "href": "stac?page=2"},
        { "rel": "item", "href": "../collections/NAIP/items/m_3008718_sw_16_1_20130805" },
        { "rel": "item", "href": "../collections/NAIP/items/m_3008718_sw_16_1_20130806" },
        ...
    ]
}
```

So the STAC Dynamic API will consist of 
* `/stac` (catalog endpoint described above which is compatible with Static STAC)
* `/stac/search` (existing search endpoint that we know and love)


* Collection integration

	* Search endpoint should be able to return a denormalized metadata model. Queries should use property names that would be expected in the denormalized metadata structure.
	* The returned items do not need to be denormalized by default. The "projection" argument would be used to control the returned properties.

