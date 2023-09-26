## STAC Development & Release Process

### Development Process

The SpatioTemporal Asset Catalog specification is under active development. The goal is to get to a small, flexible stable
release that can be extended in a variety of ways. The core development team aims to release early and often, which generally
has meant a new release between two and four months since the previous one.

The `main` branch is a place of active development,
where a new change in one part of the spec might not yet be fully updated everywhere else. 
Tags, such as `v1.0.0`, aim to always be stable, meaning that all the pieces of the specification
are consistent and well-explained, and all the examples are consistent with the specification. The
latest tag will also has a branch associated with it that is set to the default, e.g.,
`release/v1.0.0`.

The team uses the 
[stac-spec issue tracker](https://github.com/radiantearth/stac-spec/issues) to identify and track all that will be done for 
a release. Once all the major issues are resolved the core team makes sure everything is consistent across the spec and
examples.

Any changes to the spec must be made as pull requests to the `dev` branch. Anyone is welcome and encouraged to bring ideas
and improvements, to the issue tracker or (ideally) as pull requests. To merge a new pull request the work must be reviewed
by at least two members of the STAC spec 'core team' (who have write access to the main repository). It also must pass the
Continuous Integration (CI) testing, which checks all markdown and example files for proper formatting, and also validates all
examples against JSON schema. For more information about making pull requests see [CONTRIBUTING.md](CONTRIBUTING.md), 
and there is also information on how to [run the CI checks locally](CONTRIBUTING.md#check-files).

#### Core STAC Team

The current list of people who are part of the 'core STAC team', and can approve pull requests.

- [Alex Kaminsky](https://github.com/alkamin)
- [Alexandra Kirk](https://github.com/anayeaye)
- [Chris Holmes](http://github.com/cholmes)
- [Emmanuel Mathot](https://github.com/emmanuelmathot)
- [Michael Smith](https://github.com/hgs-msmith)
- [James Banting](https://github.com/jbants)
- [James Santucci](https://github.com/jisantuc)
- [Josh Fix](https://github.com/joshfix)
- [Rob Emanuele](https://github.com/lossyrob)
- [Matthias Mohr](https://github.com/m-mohr)
- [Matt Hanson](https://github.com/matthewhanson)
- [Phil Varner](https://github.com/philvarner)

Anyone can be nominated to the core STAC team, and that generally happens after contributing a few pull requests
and/or helping review other PR's. Nominations are reviewed by the [PSC](#project-steering-committee), and must receive
3 positive votes and no negatives.

### Release Process

To release a new version of the STAC spec the following list of tasks must be done. 

- **Update Issue Tracker**: Each release has a [milestone](https://github.com/radiantearth/stac-spec/milestones) in the github 
issue tracker, and before a release is done all open issues that are filed against it should be reviewed. All issues do not 
need to be completed, but the core release team should all review the issues to make sure that the critical ones for the 
release have been addressed. Issues that aren't seen as essential should be moved to future releases, so that there are no
open issues against the milestone.
- **Agreement from the Project Steering Committee**: The PSC should meet (on phone or on gitter) and decided that the release is ready.
This should include review of the issues, as well as looking at the spec holistically, to make sure the new changes keep
with a coherent whole.
- **Final Spec Read Through**: There should be a final read through of the core specification to make sure it makes sense
and there are no typos, errors, etc.
- **Update the version numbers**: There are several places in the spec that use the version number or a branch name in text
or a link. These include the markdown files and the JSON schemas. Right now the best thing to do is just a search & replace
for the last version number and `https://schemas.stacspec.org/dev/` with `https://schemas.stacspec.org/<release-version>/`
(in JSON Schemas, don't replace it here). `<release-version>` must correspond with the tag on GitHub, usually including a leading `v`.
Hopefully in the future there will be scripts to do this. 
- **Update the Changelog**: The [changelog](CHANGELOG.md) should be reviewed to make sure it includes all major improvements
in the release. And anything in 'unreleased' section should move to the version of the spec to be released.
- **Merge dev to master**: As there is no 'build' process, since the specification *is* the markdown files in the github
repository, the key step in a release is to merge the `dev` branch into `master`, as `master` is the current stable state 
of the spec.
- **Release on Github**: The final step to create the release is to add a new 'release' on 
<https://github.com/radiantearth/stac-spec/releases>. This should use a tag like the others, with a 'v' prefix and then the 
release number, like v0.5.2. The changelog should be copied over to be the release notes, and then also include a link to 
the full milestone of everything closed in the issue tracker.
- **Promote the release**: A blog post and tweet should be composed and sent out, and then inform those in the gitter channel
to post / promote it.

#### Release Candidates

Before any release that has *major* changes (made as a judgement call by the core contributors) there should be a 'release 
candidate' to ensure the wider community of implementors can try it out
and catch any errors *before* a full release. It is only through actual implementations that we can be sure the new spec
version is good, so this step is essential if there are major changes. The release should proceed as normal, but called
vX.Y.Z-rc.1. The core STAC community should be told and encouraged to update their implementations. At least 2 implementations
should be updated to the new specification before there is a real release. And ideally a client like STAC Browser is also 
updated. This provides the core sanity check. If there are changes or fixes to the spec or 
schemas needed from their feedback then make fixes and do rc.2. If it is just fixes to the examples or tooling then no 
additional RC is needed. After there is no more changes to spec or schemas then the release process should be done on master,
with no changes to the spec - just updating the version numbers.

### Governance 

The vast majority of decisions on STAC are made by the [Core STAC Team](#core-stac-team) reaching consensus in
discussions in pull requests and issues. Any change to the specification must have two positive reviews and no negative
reviews. 

#### Project Steering Committee

For the rare case where a decision cannot be reached by consensus, there is a Project Steering Committee that has ultimate
decision making authority. This consists of individuals who are intended to represent the various communities which have a 
stake in the specification and surrounding ecosystem. An odd number is chosen to facilitate the voting process and help prevent ties.
This committee also handles the allocation of any funds that are raised for the project.

Turnover is allowed and expected to accommodate people only able to become active on the project in intervals.
A PSC member may step down at any time.

#### Current Project Steering Committee

- [Matthias Mohr](https://github.com/m-mohr) - University of Muenster, [OpenEO](https://openeo.org/) and [Radiant Earth](https://www.radiant.earth/)
- [Matt Hanson](https://github.com/matthewhanson) - [Element 84](https://www.element84.com/)
- [James Banting](https://github.com/jbants) - [SparkGeo](https://sparkgeo.com/)
- [Rob Emanuele](https://github.com/lossyrob) - [Microsoft](https://microsoft.com/)
- [Chris Holmes](https://github.com/cholmes) - [Planet](https://planet.com) and [Radiant Earth](https://www.radiant.earth/)

#### PSC Membership

A new PSC member can be nominated at any time. Voting for a new PSC is done by current active PSC members. PSC nominations are 
generally given in recognition to very significant contributions to the specification or the broader ecosystem. PSC members
are not expected to be technical, and we hope to recognized contributions in documentation, outreach and evangelism. 

Nominated PSC members must receive a majority of +1 vote’s from the PSC, and no -1’s.

The initial PSC was selected by Chris Holmes, who was deemed the 'Benevolent Dictator for Life' for the bootstrapping phase.
