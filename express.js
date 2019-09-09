const express = require('express')
const app = express()
const port = 3000;
const inputFilePath = './data/sp500.csv';
const cors = require('cors')
const csv = require('csv-parser');
const fs = require('fs');

// fs.createReadStream(inputFilePath)
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });


app.use(cors())

function readFile(path) {
    var fileContent;

    return new Promise(function(resolve) {
        fileContent = fs.readFileSync(path, {encoding: 'utf8'});
        return resolve(fileContent);
    });
}

app.use('/static', express.static('public'))
app.get('/csv', (req, res) => {
    res.set('Content-type', 'text/plain')
    console.log(readFile(inputFilePath))
    readFile(inputFilePath)
        .then(data => res.send(data))
    // res.send(readFile(inputFilePath))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))