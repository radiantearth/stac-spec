## Contributing

Pull Requests are the primary method of contributing to the spec itself, and everyone is welcome to submit 
changes. Suggestions for changes to the core will be taken with higher priority if a clear implementation 
of STAC has been built that can highlight the problem. If the changes can be done as an [extension](extensions/) 
instead of modifying the core files then that route is recommended first, and once there is uptake for the 
extension it will be considered for core.

We consider everyone using the specification to catalog their data to be a 'contributor', as STAC is
really about the end result of more interoperable data, not just creating a spec for the sake of it.
So if you want to help then the best thing you can do is make new catalogs or build software that uses
the spec. And please do give us feedback. The best place to do so is on our 
[gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby). If you are interested in helping
but aren't sure where to, then see the [stac-ecosystem](https://github.com/stac-utils/stac-ecosystem) repo
for ideas on projects to advance STAC. The next phase of STAC's evolution will be mostly focused on
this broader ecosystem, while keeping the core spec as stable as we can.

### Submitting Pull Requests

Any proposed changes to the specification should be done as pull requests. Please make these
requests against the [dev](https://github.com/radiantearth/stac-spec/tree/dev) branch (this will
require you to switch from the default of 'master', which we keep so it displays first). 

Creating a Pull Request will show our PR template, which includes checkbox reminders for a number
of things.

* Adding an entry the [CHANGELOG](CHANGELOG.md). If the change is more editorial and minor then this 
is not required, but any change to the actual specification should definitely have one.
* Base the PR against dev, as mentioned above - even if the branch was made off of dev this reminds
you to change the base in GitHub's PR creation page.
* Make a ticket in the STAC API repo if anything here affects there.
* Highlight if the PR makes breaking changes to the specification (in beta there can still be
select breaking changes, but after 1.0 this will change)

All pull requests should submit clean markdown, which is checked by the continuous integration
system. Please use `npm run check` locally, as described in the [next section](#check-files), 
to ensure that the checks on the pull request succeed. If it does not then you can look at the
mistakes online, which are the same as running `npm run check` locally would surface.

All pull requests that modify or create JSON schema files or examples should use [JSON formatter](https://jsonformatter.org/) to keep files consistent across the repo. 

All pull requests additionally require a review of two STAC core team members. Releases are cut
from dev to master (and require 3 approvals), see the [process](process.md) document for more details.

### Check files

The same check-markdown and check-examples programs that runs as a check on PR's is part of the repo and can be run locally. 
To install you'll need npm, which is a standard part of any [node.js installation](https://nodejs.org/en/download/). Alternatively, you can also use [yarn](https://yarnpkg.com/) instead of npm. In this case replace all occurrences of `npm` with `yarn` below.

First you'll need to install everything with npm once. Just navigate to the root of the stac-spec repo and on 
your command line run:

```bash
npm install
```

Then to do the check for markdown and examples you run:

```bash
npm run check
```

This will spit out the same texts that you see online, and you can then go and fix your markdown or examples.

To just check the markdown run:

```bash
npm run check-markdown
```

To just check the examples run:

```bash
npm run check-examples
```

To automatically format / pretty-print the examples run:

```bash
npm run format-examples
```
