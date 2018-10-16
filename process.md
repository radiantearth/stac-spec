## STAC Development & Release Process

### Development Process

The SpatioTemporal Asset Catalog specification is under active development. The goal is to get to a small, flexible stable 
release that can be extended in a variety of ways. The core development team aims to release early and often, which generally
has meant a new release between two and four months since the previous one. 

The `master` branch aims to always be stable, meaning that all the pieces of the specification are consistent and well
explained, and all the examples are consistent with the specification. The `dev` branch is a place of active development, 
where a new change in one part of the spec might not yet be fully updated everywhere else. The team uses the 
[stac-spec issue tracker](https://github.com/radiantearth/stac-spec/issues) to identify and track all that will be done for 
a release. Once all the major issues are resolved the core team makes sure everything is consistent across the spec and
examples.

Any changes to the spec must be made as pull requests to the `dev` branch. Anyone is welcome and encouraged to bring ideas
and improvements, to the issue tracker or (ideally) as pull requests. To merge a new pull request the work must be reviewed
by at least two members of the STAC spec core team (who have write access to the main repository). It also must pass the
Continuous Integration testing (right now it is minimal, but it will expand).

* **Note** *The development process will continue to evolve as the specification matures. 0.6.0 will also introduce Continuous
Integration, and once it is full validating everything and the spec is more mature then we will aim to have `dev` branch
always in a consistent state.

### Release Process

(todo: expand this out)

* review all open issues that have been filed against release. Move any that won't be done to the next release.
* Agreement from core team that the release is ready.
* Make sure all examples in the specification validate (after 0.6.0 this should hopefully be done automatically with CI).
* Merge dev to master (be sure to update readmes on branches to be up to date)
* Draft new release on https://github.com/radiantearth/stac-spec/releases - use tag version with v prefix, like v0.5.2
* Write up release notes, with overview of major changes / improvements and link to issue tracker
* Write blog post and tweet it out.

* Release Candidate - do a release candidate before any major release. Call it vX.Y.Z-RC1. Tell the core STAC community on 
gitter (and maybe spread a bit more widely / get in touch with those who have implementations). Wait for 2-3 implementations
to be updated to the new spec, and ideally STAC Browser is also up to date. If there are changes or fixes to the spec or 
schemas needed from their feedback then make fixes and do RC2. If it is just fixes to the examples or tooling then no additional
RC is needed. After there is no more changes to spec or schemas then do release process on master.


### Governance 

Goal is to have a Project Steering Committee of core contributors. To bootstrap Chris Holmes is the Benevolent Dictator for 
Life or until a PSC is formed, so we don't get stuck waiting for votes when there is not enough activity. 

The longer term goal is to contribute STAC spec to the Open Geospatial Consortium, and indeed to align as much as possible
with their next generation spec.
