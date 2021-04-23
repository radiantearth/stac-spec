(async () => {
  const repo = window.location.href.split('/').slice(-2).shift()
  const response = await fetch(`https://api.github.com/repos/radiantearth/stac-spec/git/trees/gh-pages?recursive=true`);
  const data = await response.json();
  schemas = data.tree.filter(f => {
    if (f.path.startsWith('v') && f.path.endsWith('json')) {
      return true
    }
  })
  let htmlString = `<h1>STAC Schemas</h1><ul>`;
  for (let s of schemas) {
    htmlString += `<li><a href="${s.path}">${s.path}</a></li>`;
  }

  /* initial attempt at making nicer list
  let result = [];
  let level = {result};=
  schemas.forEach(schema => {
    schema.path.split('/').reduce((r, name, i, a) => {
      if(!r[name]) {
        r[name] = {result: []};
        r.result.push({name, children: r[name].result})
      }
      return r[name];
    }, level)
  })
  console.log(result)
  */

  htmlString += '</ul>';
  document.getElementsByTagName('body')[0].innerHTML = htmlString;
})()
