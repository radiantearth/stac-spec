__Topics__
* Query Language
  * Filters
  	GraphQL - too explicit on projections
	Custom -
		Follows industry trend of "Not Invented Here", but can by opinionated on simpifying query (no joins or aggregations). Low barrier to entry. Complicated Query language can be an additional extension
		
| eq         | compare value                                                              | object           |   |   |
|------------|----------------------------------------------------------------------------|------------------|---|---|
| gt         | Find items with a property value greater than the specified value          | number           |   |   |
| lt         | Find items with a property value less than the specified value             | number           |   |   |
| gte        | Find items with a property value greater than or equal the specified value | number           |   |   |
| lte        | Find items with a property value greater than or equal the specified value | number           |   |   |
| startsWith | Find items with a property that begins with the specified string           | string           |   |   |
| endsWith   | Find items with a property that ends with the specified string             | string           |   |   |
| contains   | Find items with a property that contains with the specified string         | string           |   |   |
| date       | search for a date in the specified range                                   | ISO8601 Duration |   |   |
		
Custom Query Example
```
{
"query": {
    "eo:cloud_cover": {
      "lt": 50
    },
    "provider": "Planet",
    "published": {
      "date": "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
    },
    "pl:item_type": {
      "startsWith": "PSScene"
    }
  }
}
```
		
  * Sorting ?
```
{
  "eo:cloud_cover": "asc", // ascending
  "provider": "desc" //descending
}
```
  * Projections  
  	include prop names and exclude prop names as separate lists
	
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

