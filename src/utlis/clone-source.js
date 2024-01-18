import fs from "fs";
const {
  sequelize,
  Subscriptions,
  SubscriptionActivities,
} = require("../models");
const { exec } = require("child_process");
const Path = require("path");
const FSP = require("fs").promises;

async function copyDir(src, dest) {
  const entries = await FSP.readdir(src, { withFileTypes: true });
  await FSP.mkdir(dest, { recursive: true }); 
  for (let entry of entries) {
    const srcPath = Path.join(src, entry.name);
    const destPath = Path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await FSP.copyFile(srcPath, destPath);
    }
  }
}

export const copyingSourceFile = async (serverName) => {
  try {
    const sourcePath = Path.resolve(
      __dirname,
      "../../source"
    );
    const projectDir = sourcePath;
    const tenentDir = `/var/www/public_html/${serverName}`;
    // Copy new project
    await copyDir(projectDir, tenentDir);

  } catch (error) {
    // Save activity to database if copying files Failed
    const activityData = {
      subDomain: serverName,
      message: `Failed to copying all files to ${serverName}`,
      activityStatus: "failed",
      apiLevel: 1,
      errorMessage: error.message,
    };
    await SubscriptionActivities.create(activityData);
    throw error.message;
  }
};

export const cloneSourceFile = async (ServerName) => {
  const apiLevel = 1;
  return new Promise( async (resolve, reject) => {
    exec(`git clone git@bitbucket.org:spirehub-softwares/pureelement-client-api.git${ServerName}`, {cwd: `/var/www/public_html`}, async (error, stdout, stderr) => {
      if (error) {
        // Save activity to database On generate Change Directory Failed
        const activityData = {
          subDomain: ServerName,
          message: `Failed to clone project.`,
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
          message: `Failed to clone project.`,
          apiLevel,
          activityStatus: "failed",
          errorMessage: `Error Message file Path: - /log/${ServerName}-npm-error.txt`,
        };

        fs.writeFile(`/log/${ServerName}-npm-error.txt`, error.message, (err) => {
          console.log(err);
        })

        await SubscriptionActivities.create(activityData);
        return reject(stderr);
      }

      resolve(stdout);
    });
  });
};
