{
    name: "some-dg-id",
    description: "DG Scene xxx",

    // SPDX license identifier
    license: "PDDL-1.0",

    assets: [
        {
            uri: "https://example.com/foo",
            properties: { // externally declared properties/metadata for this asset; this is a copy of the sidecar with the addition of uri
                // core metadata properties

                uri: "" // actual data file
            }
        },
        {
            uri: "https://example.com/bar", // metadata sidecar URI (optional)
        }
    ],
    links: [
        { // Optionally completely embeddable (node json)
          // with inclusion of URI.
            uri: "https://host/path/to/list.json"
            properties: { // Can resolve into itself
                // Node JSON/subset, optional
                name: "",
                formats: [ "cogs" ]
            }
        }
    ],

    // Optional Fields

    // http://schema.org/Person
    contact: {
        name: "Pat Exampleperson",
        email: "pat@example.com",
        phone: "555-555-5555",
        url: "https://example.com/people/pate"
    },

    // Enumeration of sidecar schemas that defines
    // the format of the asset and the schema of the
    // sidecar json.
    formats: [ "geotiff" ], // ??? Optional

    // This represents the geometry of the assets only,
    // and does not describe the assets contained by
    // linked nodes. Geometry GeoJSON.
    geometry: { "type": "Polygon", coords: [[0.0 ... ]] },

    // ISO_8601 Time intervals
    startDate: "",
    endDate: "",
    date: "",

    // SEO keywords
    keywords: ["raster", "drone"], // optional

    // Homepage for human-presentable view into the data.
    // E.g. file list with thumbnails and links to linked
    // nodes
    homepage: "http://wherever" // Optional
}
