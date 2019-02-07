const express = require('express'),
  server = express();
  port = process.env.PORT || 8080,
  environment = server.get('env'),
  spawn = require('child_process').spawn,
  bodyParser = require('body-parser'),
  fs = require('fs'),
  mongoClient = require('mongodb').MongoClient;


server
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(express.static('../../'))

  .post('/api/deploy/android', (req, res) => {
    let expoStartProcess;
    const cloneBoilerplateApp = () => {
      console.log("DUPLICATING BOILERPLATE APP")
            
      const cloneProcess = spawn('rsync', ['-a', './MangoHacks2019/.', './boilerplateApp/', '--exclude', '.git']);
      cloneProcess.stderr.on('data', function (data) {
        console.log("STDERR:", data.toString());
      });
      cloneProcess.stdout.on('data', function (data) {
        console.log("STDOUT:", data.toString());
      });
      cloneProcess.on('exit', function (code) {
        console.log(`cloneProcess exited with code ${code}`);
        if (code == 0) {
          modifyFileProperties();
        } else {
          console.log("Duplication failed");
          res.sendStatus(500);
        }
      });
    }
    const modifyFileProperties = () => {
      const appStateWrite = new Promise((resolve, reject) => {
        fs.readFile('boilerplateApp/client/App.js', 'utf8', function (err, data) {
          if (err) {
            console.log("ERROR READING APP JS")
            reject(err);
          } else {
            const appWithState = data.replace(/this.state = {\n(\s|\w|:|'|,)+}/gm, "this.state = " + JSON.stringify(req.body.body.state));
            fs.writeFile('boilerplateApp/client/App.js', appWithState, 'utf8', function (err) {
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

      const appRestName = new Promise((resolve, reject) => {
        fs.readFile('boilerplateApp/client/components/TabBar.js', 'utf8', function (err, data) {
          if (err) {
            console.log("ERROR READING TABBAR JS")
            reject(err);
          } else {
            const appWithName = data.replace(/Example Restaurant/g, JSON.stringify(req.body.body.state.restaurantName));
            fs.writeFile('boilerplateApp/client/components/TabBar.js', appWithName, 'utf8', function (err) {
              if (err) {
                console.log("ERROR WRITING TABBAR JS")
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
        fs.readFile('boilerplateApp/client/keys.js', 'utf8', function (err, data) {
          if (err) {
            reject(err);
            console.log("ERROR READING KEYS JS")
          } else {
            const keysWithKeys = data.replace(/APIENDPOINT/g, req.body.body.apiEndpoint);
            fs.writeFile('boilerplateApp/client/keys.js', keysWithKeys, 'utf8', function (err) {
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
        fs.readFile('boilerplateApp/client/app.json', 'utf8', function (err, data) {
          if (err) {
            reject(err);
            console.log("ERROR READING APP JSON")
          } else {
            let jsonWithIdentifier = data.replace(/com.company.appname/g, req.body.body.appIdentifier);
            jsonWithIdentifierAndNames = data.replace(/("name"|"slug"): "(\w+)",/g, `$1: "${(req.body.body.appName).replace(' ','-')}",`);
            fs.writeFile('boilerplateApp/client/app.json', jsonWithIdentifierAndNames, 'utf8', function (err) {
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
        const yarnInstallProcess = spawn('cd boilerplateApp && cd client && yarn install', { shell: true });
        yarnInstallProcess.stderr.on('data', function (data) {
          console.log("STDERR:", data.toString());
        });
        yarnInstallProcess.stdout.on('data', function (data) {
          console.log("STDOUT:", data.toString());
        });
        yarnInstallProcess.on('exit', function (code) {
          console.log(`yarnInstallProcess exited with code ${code}`);
          if (code == 0) {
            console.log("YARN INSTALL DONE GOOD")
            resolve();
          } else {
            console.log("YARN INSTALL faaaaiil")
            reject();
          }
        });
      });

      Promise.all([appStateWrite, appEndpointWrite, appJsonConfig, yarnInstall, appRestName]).then(results => {
        expoCommands();
      }).catch(e => res.sendStatus(500));

    }
    const expoCommands = () => {
      console.log("ALL PROMISES DONE. BEGINING EXPO START");
      const startExpo = () => {
        expoStartProcess = spawn('cd boilerplateApp && cd client && expo start --no-dev', { shell: true });
        expoStartProcess.stderr.on('data', function (data) {
          console.log("STDERR:", data.toString());
        });
        expoStartProcess.stdout.on('data', function (data) {
          data.toString().includes("Your app is running at") ? publishApp() : console.log("STDOUT: ", data.toString());
        });
        expoStartProcess.on('exit', function (code) {
          console.log("Child exited with code: " + code);
        });
      }
      const publishApp = () => {
        console.log("EXPO START DONE. BEGINING EXPO PUBLISH")
        const expoPublishProcess = spawn('cd boilerplateApp && cd client && expo publish', { shell: true });
        expoPublishProcess.stderr.on('data', function (data) {
          console.log("STDERR:", data.toString());
        });
        expoPublishProcess.stdout.on('data', function (data) {
          console.log("STDOUT:", data.toString());
        });
        expoPublishProcess.on('exit', function (code) {
          console.log(`expoPublishProcess exited with code ${code}`);
          if (code == 0) {
            console.log("EXPO PUBLISH DONE")
            buildApp();
          } else {
            console.log("EXPO PUBLISH faaaaiil")
          }
        });
      }
      const buildApp = () => {
        console.log("EXPO PUBLISH DONE. BEGINING EXPO BUILD")
        const buildAndroid = new Promise((resolve, reject) => {
          const buildAndroidProcess = spawn('cd boilerplateApp && cd client && expo build:android', { shell: true });
          buildAndroidProcess.stderr.on('data', function (data) {
            // console.log("STDERR:", data.toString()); //too much crap
          });
          buildAndroidProcess.stdout.on('data', function (data) {
            console.log("STDOUT:", data.toString());
            data.toString().includes("Successfully built standalone app:") ? (res.send(data.toString().substring(47)), purgeApp()) : console.log("STDOUT: ", data.toString());
          });
          buildAndroidProcess.on('exit', function (code) {
            console.log(`buildAndroidProcess exited with code ${code}`);
          });
        });
        // const buildIos = new Promise((resolve, reject) => {
        //   const buildIosProcess = spawn('cd boilerplateApp && cd client && expo build:ios', { shell: true });
        //   buildIosProcess.stderr.on('data', function (data) {
        //     console.log("STDERR:", data.toString());
        //   });
        //   buildIosProcess.stdout.on('data', function (data) {
        //     console.log("STDOUT:", data.toString());
        //   });
        //   buildIosProcess.on('exit', function (code) {
        //     console.log(`yarnInstallProcess exited with code ${code}`);
        //   });
        // });

        // Promise.all(['buildAndroid', 'buildIos']).then(results => {
        //     //send back two files as downloads then App
        // }) 
      }
      startExpo();
    }
    const purgeApp = () => {
      console.log("APK DEPLOYED REMOVING FILES");
      expoStartProcess.kill('SIGINT');
      const purgeAppProcess = spawn('rm', ['-rf', 'boilerplateApp/*']);
      purgeAppProcess.stderr.on('data', function (data) {
        console.log("STDERR:", data.toString());
      });
      purgeAppProcess.stdout.on('data', function (data) {
        console.log("STDOUT:", data.toString());
      });
      purgeAppProcess.on('exit', function (code) {
        console.log(`purgeAppProcess exited with code ${code}`);
      });
    }
    const gitPullProcess = spawn('cd MangoHacks2019 && git pull', { shell: true });
    gitPullProcess.on('close', (code) => {
      console.log(`gitPullProcess exited with code ${code}`);
      if (code == 0) {
        cloneBoilerplateApp();
      } else {
        res.sendStatus(500);
      }
    });
  })
  .post('/api/saveToDb', (req, res) =>{ 
    console.log(req.body.data)
    var mongourl = "mongodb://mango:password1@ds119765.mlab.com:19765/mangohacks"
    mongoClient.connect(mongourl, (error, client) => {
      if (!error) {
        let db = client.db('mangohacks')
        console.log("Connected successfully to MongoDB server");
        db.collection('appConfig').updateOne({"appID":"123456"}, {$set: req.body.body}, (err, result) => {
          res.send(result)
          client.close()
        })
      } else {
        console.log(error);
        client.close()
      }
    });
  })

  .get('/api/loadAppConfig', (req,res)=> {
    var mongourl = "mongodb://mango:password1@ds119765.mlab.com:19765/mangohacks"
    mongoClient.connect(mongourl, (error, client) => {
      if (!error) {
        let db = client.db('mangohacks')
        console.log("Connected successfully to MongoDB server");
        db.collection('appConfig').findOne({"appID":"123456"}, (err, result) => {
          res.send(result)
          client.close()
        })
      } else {
        console.log(error);
        client.close()
      }
    });
  })

  .listen(port, () => {
    console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
  });
