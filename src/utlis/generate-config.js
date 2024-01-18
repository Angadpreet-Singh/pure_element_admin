const {
  sequelize,
  SubscriptionActivities,
  Subscriptions,
} = require("../models");
import fs from "fs";

export const generateENVConfigFile = async (ServerName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      query["where"] = { domain: ServerName };
      query["attributes"] = [
        "id",
        "userId",
        "packageId",
        "subDomain",
        "domain",
        "apiPort",
        "databaseName",
      ];
      console.log(query);
      const subscriptionData = await Subscriptions.findOne(query);
      const content = `MONGODB_URL=mongodb://localhost:27017/${subscriptionData.databaseName}
      FRONTEND=https://${subscriptionData.domain}
      REDIS_URI=localhost
      REDIS_PORT=6379
      STORAGE=https://storage.rm.otter.productions/
      BACKEND=https://${subscriptionData.domain}
      ENV=prod
      PORT=${subscriptionData.apiPort}`;

      console.log(content);
      fs.writeFile(`/var/www/public_html/${ServerName}/.env`, content, async (err) => {
        if (err) {
          console.log("err", err);
          // Save activity to database On generate environment variables Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to generate environment.`,
            apiLevel: 2,
            activityStatus: "failed",
            errorMessage: err.message,
          };

          await SubscriptionActivities.create(activityData);
          return reject(err);
        }

        resolve();
      });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

export const generateConfigFileFrontend = async (ServerName) => {
  const query = {};
  query["where"] = { domain: ServerName };
  query["attributes"] = [
    "id",
    "userId",
    "packageId",
    "subDomain",
    "domain",
    "apiPort",
    "databaseName",
  ];
  const subscriptionData = await Subscriptions.findOne(query);

  return new Promise(async (resolve, reject) => {
    const content = `export const environment = {
            baseUrl: 'http://localhost:4200',
            production: true,
            backend: "https://${subscriptionData.domain}",
            frontend: "https://${subscriptionData.domain}",
            adminApi: "https://api.flowvision.se",
            storage: "https://storage.rm.otter.productions/",
            google_api_key: "",
            env: "prod",
            socket_options: {
                secure: true,
                rejectUnauthorized: false,
                transports: ['websocket'],
                'force new connection': true,
                autoConnect: false
            }
          };`;
    fs.writeFile(
      `/var/www/public_html/${ServerName}/src/frontend/environments/environment.prod.ts`,
      content,
      async (err) => {
        if (err) {
          // Save activity to database On generate environment variables Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to generate environment file for frontend`,
            activityStatus: "failed",
            apiLevel: 2,
            errorMessage: err.message,
          };

          await SubscriptionActivities.create(activityData);
          return reject(err);
        }

        resolve();
      }
    );
  });
};

export const generateConfigFileBackend = async (ServerName) => {
  const query = {};
  query["where"] = { domain: ServerName };
  query["attributes"] = [
    "id",
    "userId",
    "packageId",
    "subDomain",
    "domain",
    "apiPort",
    "databaseName",
  ];
  const subscriptionData = await Subscriptions.findOne(query);

  return new Promise(async (resolve, reject) => {
    const content = `export const environment = {
      frontend: "https://${subscriptionData.domain}",
      redis: {
          uri: 'localhost',
          port: 6379
      },  
      storage: "https://storage.rm.otter.productions/",
      backend: "https://${subscriptionData.domain}",
      URL:"mongodb://localhost:27017/${subscriptionData.databaseName}",
      env:"prod",
      port: ${subscriptionData.apiPort}
    };`;
    fs.writeFile(
      `/var/www/public_html/${ServerName}/src/frontend/environments/environment.prod.ts`,
      content,
      async (err) => {
        if (err) {
          // Save activity to database On generate environment variables Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to generate environment file for frontend`,
            activityStatus: "failed",
            apiLevel: 2,
            errorMessage: err.message,
          };

          await SubscriptionActivities.create(activityData);
          return reject(err);
        }

        resolve();
      }
    );
  });
};

export const generateServerConfigFile = (ServerName) => {
  return new Promise(async (resolve, reject) => {
    const query = {};
    query["where"] = { domain: ServerName };
    query["attributes"] = [
      "id",
      "userId",
      "packageId",
      "subDomain",
      "domain",
      "apiPort",
      "databaseName",
    ];
    const subscriptionData = await Subscriptions.findOne(query);
    const content = `
    server {
      server_name         ${ServerName};
      root                /var/www/public_html/${ServerName}/dist/browser/;
      # index.html fallback
      location / {
          try_files $uri $uri/ /index.html;
      }
      # reverse proxy
      location /api {
          proxy_pass https://127.0.0.1:${subscriptionData.apiPort};
          include    nginxconfig.io/proxy.conf;
       }
        listen 443 ssl; 
        ssl_certificate /etc/letsencrypt/live/flowvision.se/fullchain.pem; 
        ssl_certificate_key  /etc/letsencrypt/live/flowvision.se/privkey.pem; 
        include /etc/letsencrypt/options-ssl-nginx.conf; 
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; 

      }
      server {
            if ($host = ${ServerName}) {
              return 301 https://$host$request_uri;
            } 

            server_name         ${ServerName};
            listen 80;
            return 404; 
      }
      `;
    fs.writeFile(
      `/etc/nginx/sites-available/${ServerName}.conf`,
      content,
      async (err) => {
        if (err) {
          const activityData = {
            subDomain: ServerName,
            message: `Failed to generate server config file.`,
            apiLevel: 2,
            errorMessage: err.message,
            activityStatus: "failed",
          };
          await SubscriptionActivities.create(activityData);
          return reject(err);
        }

        resolve();
      }
    );
  });
};
