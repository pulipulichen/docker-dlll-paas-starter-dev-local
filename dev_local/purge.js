const fs = require('fs');
const path = require('path');
const ShellSpawn = require('./scripts/lib/ShellSpawn.js')

const directory = path.join(__dirname, '../tmp/dev_local/pvc/');

fs.readdir(directory, (err, dirs) => {
  if (err) throw err;

  for (const dir of dirs) {
    fs.readdir(path.join(directory, dir), (err, files) => {
      if (err) throw err;

      for (const file of files) {
        if (file === '.gitignore') {
          continue
        }

        //console.log(path.join(directory, dir, file))
        fs.rmSync(path.join(directory, dir, file), { recursive: true, force: true });
      }
    });
  }
});

// ShellSpawn(['docker', 'system', 'prune', '--volumes', '-f'])