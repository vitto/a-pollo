const fs = require('fs')


function collect (cb, matches) {
  var file, path, fileData, files, i
  console.log(`Collecting data from '${matches.length}' file/s`)

  for (i = 0; i < matches.length; i += 1) {
    path = matches[i]
    file = fs.readFileSync(path, 'utf8')
    console.log(path);
    // fileData = parser.format(file, path)
    // if (fileData.length > 0) {
    //     files.push(fileData)
    // }
  }
  cb(files)
}
