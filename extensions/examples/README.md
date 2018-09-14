## Landsat Example with EO and common metadata extension

The files in this directory contain a full example of Landsat data. It follows the Earth Observation
extension, and uses the 'Collection' extension to be less duplicative of information

* [landsat8-sample](landsat8-sample.json) is a core `Item` including the link to its collection information.
* [L1T-catalog](L1T-catalog.json) shows the catalog definition with common metadata that applies to all items.
* [landsat8-merged](landsat8-merged.json) is a fully expanded record, showing the result of merging of the collection data and the core `Item`. 