import fs from "fs";
const {
  sequelize,
  Subscriptions,
  SubscriptionActivities,
  Users
} = require("../models");
const { exec } = require("child_process");
const Path = require("path");
const FSP = require("fs").promises;

const gotoDir = (dir, ServerName, apiLevel) => {
  return new Promise((resolve, reject) => {
    exec(`cd ${dir}`, async (error, stdout, stderr) => {
      if (error) {
        // Save activity to database On generate Change Directory Failed
        // const activityData = {
        //   subDomain: ServerName,
        //   message: `Failed to change directory.`,
        //   activityStatus: "failed",
        //   apiLevel,
        //   errorMessage: error.message,
        // };

        // await SubscriptionActivities.create(activityData);
        console.log(error.message);
        return reject(error.message);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // Save activity to database On generate Change Directory Failed
        const activityData = {
          subDomain: ServerName,
          message: `Failed to change directory.`,
          activityStatus: "failed",
          apiLevel,
          errorMessage: JSON.stringify(stderr),
        };

        await SubscriptionActivities.create(activityData);
        return reject(stderr);
      }
      
      resolve(stdout);
    });
  });
};

export const packagesInstall = (ServerName) => {
    const apiLevel = 3;
  return new Promise( async (resolve, reject) => {
    exec(`npm i`, {cwd: `/var/www/public_html/${ServerName}`}, async (error, stdout, stderr) => {
      if (error) {
        // Save activity to database On generate Change Directory Failed
        const activityData = {
          subDomain: ServerName,
          message: `Failed to install node modules.`,
          activityStatus: "failed",
          apiLevel,
          errorMessage: `Error Message file Path: - /log/${ServerName}-npm-error.txt`,
        };

        fs.writeFile(`/log/${ServerName}-npm-error.txt`, error.message, (err) => {
          console.log(err);
        })
        await SubscriptionActivities.create(activityData);
        return reject(error.message);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // Save activity to database On generate Change Directory Failed
        const activityData = {
          subDomain: ServerName,
          message: `Warning messages on install node modules.`,
          apiLevel,
          activityStatus: "warning",
          errorMessage: `Warning Message file Path: - /log/${ServerName}-npm-warning.txt`,
        };

        fs.writeFile(`/log/${ServerName}-npm-warning.txt`, stderr, (err) => {
          console.log(err);
        })

        await SubscriptionActivities.create(activityData);
        return resolve(stderr);
      }

      resolve(stdout);
    });
  });
};


export const createFrontendBuild = (ServerName) => {
    const apiLevel = 4;
    return new Promise( async (resolve, reject) => {
      exec(`npm run compile:frontend`, {cwd: `/var/www/public_html/${ServerName}`}, async (error, stdout, stderr) => {
        if (error) {
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to create build.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: `Error Message file Path: - /log/${ServerName}-build-error.txt`,
          };
  
          fs.writeFile(`/log/${ServerName}-build-error.txt`, error.message, (err) => {
            console.log(err);
          })
  
          await SubscriptionActivities.create(activityData);
          return reject(error);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Warning messages on create build.`,
            activityStatus: "warning",
            apiLevel,
            errorMessage: `Warning Message file Path: - /log/${ServerName}-build-warning.txt`,
          };
  
          fs.writeFile(`/log/${ServerName}-build-warning.txt`, stderr, (err) => {
            console.log(err);
          })
  
          await SubscriptionActivities.create(activityData);
          return resolve(stderr);
        }

        resolve(stdout);
      });
    });
  };

  export const createSuperAdmin = (ServerName) => {
    const apiLevel = 6;
    return new Promise( async (resolve, reject) => {
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
      query["include"] = [
        {
          model: Users,
          as: "user",
          attributes: [
            "id",
            "user_id",
            "first_name",
            "last_name",
            "email_address",
            "phone_number",
          ],
        },
      ];
      const subscriptionData = await Subscriptions.findOne(query);

      exec(`node setup.js -fName ${subscriptionData.user.first_name} -lName ${subscriptionData.user.last_name} -e ${subscriptionData.user.email_address} -p 123456`, {cwd: `/var/www/public_html/${ServerName}`}, async (error, stdout, stderr) => {
        if (error) {
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to create admin user.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: `Error Message file Path: - /log/${ServerName}-admin-setup-error.txt`,
          };
  
          fs.writeFile(`/log/${ServerName}-admin-setup-error.txt`, error.message, (err) => {
            console.log(err);
          })
  
          await SubscriptionActivities.create(activityData);
          return reject(error);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Warning messages on admin user.`,
            activityStatus: "warning",
            apiLevel,
            errorMessage: `Warning Message file Path: - /log/${ServerName}-admin-setup-warning.txt`,
          };
  
          fs.writeFile(`/log/${ServerName}-admin-setup-warning.txt`, stderr, (err) => {
            console.log(err);
          })
  
          await SubscriptionActivities.create(activityData);
          return resolve(stderr);
        }

        resolve(stdout);
      });
    });
  };

  export const updateConfigFile = (ServerName) => {
    const apiLevel = 7;

    return new Promise( async (resolve, reject) => {
      exec(`ln -sf /etc/nginx/sites-available/${ServerName}.conf /etc/nginx/sites-enabled/`, async (error, stdout, stderr) => {
        if (error) {
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to update nginx config file.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: error.message,
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(error.message);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to update nginx config file.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: JSON.stringify(stderr),
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  };


  export const startExpressServer = (ServerName) => {
    const apiLevel = 5;

    return new Promise( async (resolve, reject) => {
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
    
      exec(`pm2 start dist/server/ --name ${ServerName} -- --prod --port ${subscriptionData.apiPort}`, {cwd: `/var/www/public_html/${ServerName}`}, async (error, stdout, stderr) => {
        if (error) {
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to start express server.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: error.message,
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(error.message);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to start express server.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: JSON.stringify(stderr),
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  };

  export const checkNginxServerConfigration = (ServerName) => {
    const apiLevel = 7;

    return new Promise( async (resolve, reject) => {
      exec(`sudo /sbin/nginx -t`, async (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to run command sudo /sbin/nginx -t`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: error.message,
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(error.message);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const stdMessage = JSON.stringify(stderr);
          const activityData = {
            subDomain: ServerName,
            message: `Failed to run command sudo /sbin/nginx -t.`,
            apiLevel,
            activityStatus: "failed",
            errorMessage: stdMessage,
          };
  
          if(stdMessage.includes("successful")){
            return resolve(stderr);
          }
          await SubscriptionActivities.create(activityData);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  };

  export const startNginxServer = (ServerName) => {
    const apiLevel = 7;

    return new Promise( async (resolve, reject) => {
      exec(`sudo /bin/systemctl restart nginx.service`, async (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to start nginx server.`,
            activityStatus: "failed",
            apiLevel,
            errorMessage: error.message,
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(error.message);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          // Save activity to database On generate Change Directory Failed
          const activityData = {
            subDomain: ServerName,
            message: `Failed to start nginx server.`,
            apiLevel,
            activityStatus: "failed",
            errorMessage: JSON.stringify(stderr),
          };
  
          await SubscriptionActivities.create(activityData);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  };

  export const testCommand = (path, command) => {
    return new Promise( async (resolve, reject) => {
      exec(command, {cwd: path}, async (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
}