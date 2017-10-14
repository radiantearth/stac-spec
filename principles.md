This project will be governed by a set of informal core principles. These principles are not set in stone, and indeed they should evolve in the same manner that all specifications worked on should - proposed and reviewed in pull requests, approved by consensus. The goal of the principles is to help avoid [bikeshedding](http://bikeshed.org/) - lay down some meta-rules so we can focus on creating useful core geospatial standards.

* **Creation and evolution of specs in Github**, using Open Source principles (please read [Producing OSS](http://producingoss.com/) if that phrase doesn't immediately make sense to you). The collaboration facilities of Github should be used to their full extent. All proposed improvements and changes should come in the form of pull requests, using code review functionality to discuss changes.

* **JSON + REST + HTTP at the core.** JSON has won over XML, and REST over SOAP. We embrace them and are not considering legacy options. Forward looking protocols can be considered as extensions, but the default specifications should be in JSON, following best REST practices. HTTP caching and error codes should be leveraged at the core. GeoJSON has already defined the core geospatial JSON response, so it should also be core. [JSON API](http://jsonapi.org/) should be used as basis of decisions where possible.

* **Small Reusable Pieces Loosely Coupled** - Each specification should be as focused as possible, defining one core concept and refraining from describing lots of options. Additional options can be made as separate specifications that build on the core. But the core specs should be small and easily understandble, with clear defaults for any choice. Handling complex cases should be possible by combining discrete pieces. Implementors should not be forced to implement lots of options just for basic compliance - they should be able to pick and choose which pieces are relevant to the problems they are trying to solve.

* **Specify in OpenAPI 3.0 (formerly known as Swagger) specification.** All web interfaces should be specified in [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md). This enables generation of live documentation, client libraries and test engines, and makes the spec less ambiguous. Accompanying human readable specifications should be available in github and auto-built in to html (likely using [asciidoc](http://asciidoc.org/) as it handles specifications (headings, reorganization, etc) better than markdown).

* **Focus on the developer**. Specifications should aim for implementability - any explanation or design choice should be considered with a developer audience. And specifications should be accessible to developers who do not have geospatial background. A developer should not need to understand 'projections' to implement a simple feature access service. But we should think through the spec extensions they could use in the future when their client asks for data in a different projection.

* **Working code required.** Proposed changes should be accompanied by working code (ideally with a link to an online service running the code). A reference implementation should be available online to power the interactive documentation. Fully accepted specifications should have at least 3 implementations that cover the entire specification.

* **Design for scale.** The design should work great with more data than can be imagined right now. Ideally implementations are built with large test data sets to validate that they will work. Everything should be compatible with content distribution network (CDN) caching.

## Resources

* Open Source Principles - [Producing Open Source Software](http://producingoss.org) by Karl Fogel.
* Best Practices JSON API Design - [JSON API](http://jsonapi.org/) best practices for making API's with JSON
* Pragmatic REST - [Web API Design: Crafting interfaces that developers love](https://pages.apigee.com/rs/apigee/images/api-design-ebook-2012-03.pdf)
* Open API Initiative - [OpenAPIs.org](https://openapis.org/)
