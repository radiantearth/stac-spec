# Fields API Extension

**Extension [Maturity Classification](../../../extensions/README.md#extension-maturity): Pilot**

The STAC search endpoint, `/stac/search`, by default returns entire Items. The fields API extension adds a new parameter, `fields` that allows the user to define fields in the items returned to be returned or excluded. If both include and exclude are specified, include takes precedence.

To return just the `id`, `geometry`, and the property `eo:cloud_cover`:
```json
{
    "fields": {
        "include": [
            "id",
            "geometry",
            "properties.eo:cloud_cover"
        ]
    }
}
```

To return the whole item without the geometry:

```json
{
    "fields": {
        "exclude": [
            "geometry"
        ]
    }
}
```
