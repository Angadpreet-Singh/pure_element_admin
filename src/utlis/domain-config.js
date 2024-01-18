import fs from "fs";
const { exec } = require("child_process");
const Path = require('path');
const FSP = require('fs').promises;
const Sequelize = require("sequelize");
const configure = require("../config/database");
const mysql = require("mysql2/promise");

async function copyDir(src,dest) {
    const entries = await FSP.readdir(src, {withFileTypes: true});
    await FSP.mkdir(dest);
    for(let entry of entries) {
        const srcPath = Path.join(src, entry.name);
        const destPath = Path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await FSP.copyFile(srcPath, destPath);
        }
    }
}

const restartPM2 = () => {
  exec("pm2 save", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

export const generateServerConfigFile = (ServerName) => {
  return new Promise((resolve, reject) => {
    const content =
      `
        <VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com
        
        ServerAdmin webmaster@localhost
        ServerName ${ServerName}
        DocumentRoot /var/www/juststart/vallox/tags/current
        
        <Directory />
        Options FollowSymLinks
        AllowOverride None
        </Directory>
        
        <Directory /var/www/juststart/vallox/tags/current>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        Allow from all
        </Directory>
        
        <Directory /usr/lib/cgi-bin>
        AllowOverride None
        Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Order allow,deny
        Allow from all
        </Directory>
        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn
        
        ErrorLog ` +
      "${APACHE_LOG_DIR}" +
      `/${ServerName}-error.log
        LogLevel warn
        CustomLog ` +
      "${APACHE_LOG_DIR}" +
      `/${ServerName}x-access.log combined
        
        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
        RewriteEngine on
        RewriteCond %{SERVER_NAME} =${ServerName}
        RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
        </VirtualHost>
        `;
    fs.appendFile(`000-default.conf`, content, (err) => {
      if (err) return reject(err);
      restartPM2();
      resolve();
    });
  });
};


export const createTenentDashboard = async (serverName) => {

  const projectDir = './dist'
  const tenentDir = `./../${serverName}`
  // Copy new project
  await copyDir(projectDir, tenentDir);
  
  // Append server config to configration file
  return await generateServerConfigFile(serverName);
}
// >>>>>>>>>>>>>>>>>> Database Creation>>>>>>>>>>>>>>>>>>>>>>>>

// export async function createDatabase(serverName) {
//     try {
//       await Sequelize.query(
//         'CREATE DATABASE databasename2;',
//         { raw: true },
//       );

//   } catch (error) {
//     console.log(error);
//   }
// }
// >>>>>>>>>>>>>>>Connect DB>>>>>>>>

export async function connectDb(serverName) {
  try {
    const { host, username, password, database } = configure
    const connection = await mysql.createConnection({
      host,
      username,
      password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    const sequelize = new Sequelize(database, username, {
      dialect: "mysql",
    });
    // init models and add them to the exported db object
    // db.User = require("../users/user.model")(sequelize);
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }
}
