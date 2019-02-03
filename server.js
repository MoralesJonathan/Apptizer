const server = require('express')(),
  port = process.env.PORT || 8080,
  environment = server.get('env'),
  spawn = require('child_process').spawn,
  bodyParser = require('body-parser'),
  fs = require('fs');


server
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .post('/', function (req, res) {
    let expoStartProcess;
    const gitCloneProcess = spawn('git', ['clone', 'git@github.com:jonmorazav/Mangohacks2019.git']);
    gitCloneProcess.on('close', (code) => {
      console.log(`gitCloneProcess exited with code ${code}`);
      if (code == 0) {
        const appStateWrite = new Promise((resolve, reject) => {
          fs.readFile('Mangohacks2019/client/App.js', 'utf8', function (err, data) {
            if (err) {
              console.log("ERROR READING APP JS")
              reject(err);
            } else {
              const appWithState = data.replace(/this.state = {\n(\s|\w|:|'|,)+}/gm, "this.state = " + JSON.stringify(req.body.state));
              fs.writeFile('Mangohacks2019/client/App.js', appWithState, 'utf8', function (err) {
                if (err) {
                  console.log("ERROR WRITING APP JS")
                  reject(err);
                }
                else {
                  resolve();
                }
              });
            }
          })
        });

        const appEndpointWrite = new Promise((resolve, reject) => {
          fs.readFile('Mangohacks2019/client/keys.js', 'utf8', function (err, data) {
            if (err) {
              reject(err);
              console.log("ERROR READING KEYS JS")
            } else {
              const keysWithKeys = data.replace(/APIENDPOINT/g, req.body.apiEndpoint);
              fs.writeFile('Mangohacks2019/client/keys.js', keysWithKeys, 'utf8', function (err) {
                if (err) {
                  console.log("ERROR WRITING KEYS JS")
                  reject();
                }
                else resolve();
              });
            }
          })
        });

        const appJsonConfig = new Promise((resolve, reject) => {
          fs.readFile('Mangohacks2019/client/app.json', 'utf8', function (err, data) {
            if (err) {
              reject(err);
              console.log("ERROR READING APP JSON")
            } else {
              let jsonWithIdentifier = data.replace(/com.company.appname/g, req.body.appIdentifier);
              jsonWithIdentifierAndNames = data.replace(/("name"|"slug"): "(\w+)",/g, `$1: "${req.body.appName}",`);
              fs.writeFile('Mangohacks2019/client/app.json', jsonWithIdentifierAndNames, 'utf8', function (err) {
                if (err) {
                  console.log("ERROR WRITING KEYS JS")
                  reject();
                }
                else resolve();
              });
            }
          })
        });

        const yarnInstall = new Promise((resolve, reject) => {
          const yarnInstallProcess = spawn('cd MangoHacks2019 && cd client && yarn install', { shell: true });
          yarnInstallProcess.stderr.on('data', function (data) {
            console.log("STDERR:", data.toString());
          });
          yarnInstallProcess.stdout.on('data', function (data) {
            console.log("STDOUT:", data.toString());
          });
          yarnInstallProcess.on('exit', function (exitCode) {
            console.log(`yarnInstallProcess exited with code ${code}`);
            if (exitCode == 0) {
              console.log("YARN INSTALL DONE GOOD")
              resolve();
            } else {
              console.log("YARN INSTALL faaaaiil")
              reject();
            }
          });
        });

        Promise.all([appStateWrite, appEndpointWrite, appJsonConfig, yarnInstall]).then(results => {
          console.log("ALL PROMISES DONE. BEGINING EXPO START")
          expoStartProcess = spawn('cd MangoHacks2019 && cd client && expo start --no-dev', { shell: true });
          expoStartProcess.stderr.on('data', function (data) {
            console.log("STDERR:", data.toString());
          });
          expoStartProcess.stdout.on('data', function (data) {
            data.toString().includes("Your app is running at") ? publishApp() : console.log("STDOUT: ", data.toString());
          });
          expoStartProcess.on('exit', function (exitCode) {
            console.log("Child exited with code: " + exitCode);
          });
        }).catch(e => res.sendStatus(500));

        publishApp = () => {
          console.log("EXPO START DONE. BEGINING EXPO PUBLISH")
          const expoPublishProcess = spawn('cd MangoHacks2019 && cd client && expo publish', { shell: true });
          expoPublishProcess.stderr.on('data', function (data) {
            console.log("STDERR:", data.toString());
          });
          expoPublishProcess.stdout.on('data', function (data) {
            console.log("STDOUT:", data.toString());
          });
          expoPublishProcess.on('exit', function (exitCode) {
            console.log(`expoPublishProcess exited with code ${code}`);
            if (exitCode == 0) {
              console.log("EXPO PUBLISH DONE")
              buildApp();
            } else {
              console.log("EXPO PUBLISH faaaaiil")
            }
          });
        }

        buildApp = () => {
          console.log("EXPO PUBLISH DONE. BEGINING EXPO BUILD")
          const buildAndroid = new Promise((resolve, reject) => {
            const buildAndroidProcess = spawn('cd MangoHacks2019 && cd client && expo build:android', { shell: true });
            buildAndroidProcess.stderr.on('data', function (data) {
              // console.log("STDERR:", data.toString()); //too much crap
            });
            buildAndroidProcess.stdout.on('data', function (data) {
              console.log("STDOUT:", data.toString());
              data.toString().includes("Successfully built standalone app:") ? (res.send(data.toString().substring(47)), purgeApp() ): console.log("STDOUT: ", data.toString());
            });
            buildAndroidProcess.on('exit', function (exitCode) {
              console.log(`buildAndroidProcess exited with code ${code}`);
            });
          });

          // const buildIos = new Promise((resolve, reject) => {
          //   const buildIosProcess = spawn('cd MangoHacks2019 && cd client && expo build:ios', { shell: true });
          //   buildIosProcess.stderr.on('data', function (data) {
          //     console.log("STDERR:", data.toString());
          //   });
          //   buildIosProcess.stdout.on('data', function (data) {
          //     console.log("STDOUT:", data.toString());
          //   });
          //   buildIosProcess.on('exit', function (exitCode) {
          //     console.log(`yarnInstallProcess exited with code ${code}`);
          //   });
          // });

          // Promise.all(['buildAndroid', 'buildIos']).then(results => {
          //     //send back two files as downloads then purgeApp
          // }) 
        }

        purgeApp = () => {
          console.log("APK DEPLOYED REMOVING FILES");
          expoStartProcess.kill('SIGINT');
          const purgeAppProcess = spawn('rm', ['-r', 'MangoHacks2019']);
          purgeAppProcess.stderr.on('data', function (data) {
              console.log("STDERR:", data.toString()); 
            });
            purgeAppProcess.stdout.on('data', function (data) {
              console.log("STDOUT:", data.toString());
            });
            purgeAppProcess.on('exit', function (exitCode) {
              console.log(`purgeAppProcess exited with code ${code}`);
            });
        }
      } else {
        res.sendStatus(500);
      }
    });
  })

  .listen(port, () => {
    console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
  });
