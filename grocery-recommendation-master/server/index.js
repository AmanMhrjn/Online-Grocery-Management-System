require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');
const path = require("path");
const keys = require('./config/keys');
const routes = require('./routes');
const setupDB = require('./utils/db');

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

setupDB();
require('./config/passport')(app);
app.use(routes);
// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.use("/images", express.static(path.join(__dirname, "./public")));
const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});


