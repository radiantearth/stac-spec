# STAC Catalog Best Practices

This document makes a number of recommendations for creating real world SpatioTemporal Asset Catalogs. None of them 
are required to meet the core specification, but following these practices will make life easier for client tooling
and for users. They come about from practical experience of implementors, and introduce a bit more 'constraint' for
those who are creating new catalogs or new tools to work with STAC. 

In time some of these may evolve to become part of the core specification, but while the core is still evolving to 
meet various use cases it should remain quite flexible and simple.

[Work In Progress]

## Catalog Layout

### Static Catalog Layout

(intro)

1. Root documents (catalogs / collections) should be at the root of a directory tree containing a static catalog (e.g. `/home/user/static-catalogs/sample/catalog.json`)
2. Catalogs should be named `catalog.json` (cf. `index.html`)
3. Collections that are distinct from catalogs should be named `collection.json`
4. Items should be named `<id>.json`
5. Sub-catalogs _and items_ should be stored in subdirectories of their parent (and only 1 subdirectory deeper than a document's parent) (e.g. `.../sample/sub1/catalog.json`) -- this means that each item and its assets are contained in a unique subdirectory
6. ~Items should be stored in the same directory as their parent catalog (e.g. `.../sample/sub1/item1.json` when a part of the `sub1` catalog)~
7. [Reverse relative links](https://github.com/radiantearth/stac-spec/issues/373#issuecomment-466884051) (name, implementation, necessity TBD) should not start with `../` ((5) should satisfy this)
8. Limit the number of items in a catalog or sub-catalog, grouping / partitioning as relevant to the dataset

### Dynamic Catalog Layout

Follow the same principles in the static catalog, but as url paths instead of storage in directories.

One benefit of a dynamic catalog is that it can generate various 'views' of the catalog, exposing the same Items in 
different sub-catalog organization structures. For example one catalog could divide sub-catalogs by date and another 
by providers, and users could browse down to both. The leaf Items should just be linked to in a single canonical location 
(or at least use a rel link that indicates the location of the canonical one. It is recommended that dynamic catalogs 
provide multiple 'views' to allow users to navigate in a way that makes sense to them. But the canonical 'rel' link should
be used to designate the primary location of the item to search engine crawlers.

(move the above from the main spec)

## Use of self links

The main catalog specification says that self links are not required, but are strongly recommended. This is what the
spec must say to enable the various use cases, but there is more subtlety for when it is essential to use them, and how to 
make useful catalogs that do not use them. The best practice is to use one of the below catalog types, applying the link
recommendations consistently, instead of just haphazardly applying anything the spec allows.

### Self-contained Catalogs

### Permalink Catalogs

## Inclusion of Paths From Root Documents

(possibly move this to self-contained catalog section?)

Inclusion of the path from a root document (rel=root), allows knowledge of the root document’s URI to be used to resolve 
relative links in child documents. The root document’s rel=self can be absolute or it can be provided externally, allowing 
all links in a catalog to be relative (including rel=self).

Href:from is a proposal with no prior art; HTML 4’s rev attribute comes close to describing this relationship, but isn’t 
quite right (and was dropped in HTML5). It also duplicates rel=self, potentially suggested an alternative link role (to self) 
where the href is the path from the root document. (This breaks link crawlers, as href is expected to be relative from the current document, rather than from another.)


