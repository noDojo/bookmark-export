const fs = require('fs');

const BOOKMARK_PATH = `${process.env.HOME}/Library/Application Support/Google/Chrome/Default/Bookmarks`;
const BOOKMARK_FOLDER = 'google'; // define bookmark folder name here
const OUTPUT_FILE = 'testoutput.json'; // define output filename here
const output = [];

function newItem(name, url) {
  return { name, url };
}

const json = JSON.parse(fs.readFileSync(BOOKMARK_PATH));
const items = json.roots.bookmark_bar.children.find(
  (obj) => obj.name === BOOKMARK_FOLDER
).children;

// todo: can use type property to identify folders 👇🏻
// note: type values: folder, url
if (json.roots.bookmark_bar.children) {
  console.log('bookmark_bar.children');
  console.dir(json.roots.bookmark_bar.children);

  // get bookmarks in folders (one level down)
  if (json.roots.bookmark_bar.children.children) {
    console.log('bookmark_bar.children.children');

    console.dir(json.roots.bookmark_bar.children.children);
  }
}
// todo: can use type property to identify folders 👆🏻

// output file already exists
if (fs.existsSync(OUTPUT_FILE)) {
  const existingItems = JSON.parse(fs.readFileSync(OUTPUT_FILE));

  // do not include items which have been deleted from bookmarks
  existingItems.forEach((existingItem) => {
    const match = items.find((el) => el.name === existingItem.name);
    if (match) {
      output.push(existingItem);
    }
  });

  // add new items which have been added to bookmarks
  items.forEach((item) => {
    const match = output.find((el) => el.name === item.name);
    if (!match) {
      output.push(newItem(item.name, item.url));
    }
  });
}
// output file does not exist yet
else {
  items.forEach((item) => output.push(newItem(item.name, item.url)));
}

const outputJson = JSON.stringify(output, null, 2);

fs.writeFile(OUTPUT_FILE, outputJson, (err) => {
  if (err) {
    throw err;
  }
  console.log('File written.');
});
