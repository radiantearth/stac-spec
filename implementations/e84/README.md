# e84-api-impl

An implementation of the Catalog API in Clojure overtop of the NASA EOSDIS Common Metadata Repository API. Currently hard coded to limit it to data in USGS EROS.

## Prerequisites

* Java
* Leiningen

## Building

`lein uberjar`

## Running

`java -cp target/e84-api-impl-0.1.0-SNAPSHOT-standalone.jar e84_api_impl.main`

## Usage

It supports the following API endpoints

* http://localhost:3000/collections
  - Implements a feature style API across collections. This is off-standard. Follow the "granules" link within a collection to get to features just in that collection
* http://localhost:3000/features
  - Query for features
  - params
    - bbox
    - time
    - limit
* http://localhost:3000/features/:id
  - Returns one feature by id.

## License

Copyright © 2017 Element 84

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
