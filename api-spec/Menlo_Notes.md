__Topics__
* Query Language
  * Filters
  * Sorting
  * Projections
* STAC Browser
/stac endpoint
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
* Collection integration?
