## About

This repository aims to standardize API components to search for remotely-sensed imagery. A number of software and data providers have been creating RESTful JSON-based image catalogs. These end up all looking fairly similar, but are still different enough that each needs custom-coded client libraries. A set of standardized API's should increase interoperability, enabling more catalog clients and cross-catalog searching. 

## Contributing

Anyone building software that catalogs imagery is welcome to collaborate. Our goal is to be a collaboration of developers, not [architecture astronauts](http://www.joelonsoftware.com/articles/fog0000000018.html). The first step to join the collaboration is to add a folder to the 'implementations' folder with an [OpenAPI Spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) (v2.0) of your implementation, along with markdown document describing your implementation.

A first meeting (ideally in person) among those with implementations who are interested in standardizing will kick off a first version of specification, with each group iterating on their version of that common standard. From there the spec(s) will evolve according to open source principles, using github as the primary tooling (pull requests and reviews for all changes, etc).


## In this repo

This repository contains the core [Principles](principles.md) that govern the collaboration....
