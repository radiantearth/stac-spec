const klaw = require('klaw-sync');
const path = require('path');
const fs = require('fs');
const ghpages = require('gh-pages');

function filterFn (item) {
	const basename = path.basename(item.path);
	return basename === '.' || basename === 'node_modules' || basename[0] !== '.';
}

let args = process.argv.slice(2);
let tag = 'dev';
if (args.length && args[0].trim().length > 0) {
	tag = args[0];
}

var folder = '.';
var jsonSchemaFolderPattern = path.sep + 'json-schema' + path.sep;
for (let file of klaw(folder, {filter: filterFn})) {
	if (file.path.includes(jsonSchemaFolderPattern) && path.extname(file.path) === '.json') {
		let source = file.path;
		let target = 'schemas' + path.sep + tag + path.sep + path.relative(folder, file.path);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.copyFileSync(source, target);
		console.log(target);
	}
}

ghpages.publish('schemas/' + tag, {
	src: '**',
	dest: tag,
	message: 'Publish JSON Schemas [ci skip]',
	user: {
	  name: 'STAC CI',
	  email: 'ci@stacspec.org'
	}
}, error => {
	console.error(error ? error : 'Deployed to gh-pages');
	process.exit(error ? 1 : 0);
});