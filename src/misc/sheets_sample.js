const { google } = require('googleapis');

const client = google.sheets({version: 'v4', auth: process.env.GOOGLE_API_KEY});

client.spreadsheets.values.get({
  spreadsheetId: '1rJqTqH-QpFGlHWdyXhRX1Oe5_5NI9Dts5uESzQk7r7I',
  range: 'E3:E500',
}, (err, res) => {
  if (err) {
    return console.log('The API returned an error: ' + err)
  };

  res.data.values.map((row) => {
    if (row[0]) {
      console.log(`${row[0]}`);
    }
  });
});
