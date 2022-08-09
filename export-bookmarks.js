const fs = require('fs');
const path = require('path');

function newItem(name, url) {
  return { name, url };
}

const bookmarkPath = path.join(
  process.env.HOME,
  '/Library/Application Support/Google/Chrome/Default/Bookmarks'
);
const json = JSON.parse(fs.readFileSync(bookmarkPath));
const items = json.roots.bookmark_bar.children.find(
  (obj) => obj.name === 'google' // define bookmark folder name here
).children;

const outputFile = 'testoutput.json'; // define output filename here
const output = [];

if (fs.existsSync(outputFile)) {
  console.log('Output file already exists...');
  const existingItems = JSON.parse(fs.readFileSync(outputFile));

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
} else {
  console.log('Output file does not exist yet...');
  items.forEach((item) => output.push(newItem(item.name, item.url)));
}

const outputJson = JSON.stringify(output, null, 2);
fs.writeFile(outputFile, outputJson, (err) => {
  if (err) {
    throw err;
  }
  console.log('File written.');
});
