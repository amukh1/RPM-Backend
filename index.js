const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config()

const User = require('./schemas/user');
const Package = require('./schemas/package');

const app = express();

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_TOKEN)
  .then((result) => { console.log('Connected to Mongo!') })
  .catch((error) => { console.log('Error connecting to Mongo:', error) });


function newUser(name, password, packages) {
    let user = new User({
      UserName: name,
      Password: password,
      Packages: [],
    })
  
    user.save()
      .then((result) => {
        console.log(result)
        // null
      }).catch((error) => {
        console.log(error)
      });
  
  
}

function newPackage(name, downloads, downloadsl, rm) {
    let package = new Package({
      Name: name,
      Downloads: downloads,
      DownloadsL: downloadsl,
      Readme: rm,
    })
  
    package.save()
      .then((result) => {
        console.log(result)
        // null
      }).catch((error) => {
        console.log(error)
      });
  
  
}

// newUser('test', 'test', ['http', 'discord.rit'])
// newPackage('http', 0, 0, '# Hello world')

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/newUser', (req, res) => {
    newUser(req.query.name, req.query.password)
    res.send('User Created!');
});

app.post('/newPackage', (req, res) => {
    {requestBody: req.body}
    console.log(req.body)
    newPackage(req.query.name, 0, 0, req.body.files['readme.md'])
fs.mkdirSync(`./packages/${req.query.name}`)
// fs.writeFileSync(`./packages/${req.query.name}/README.md`, req.query.rm)
// req.body.files = object that contains the file name & file contents
Object.keys(req.body.files).forEach(function(key) {
    let fileName = key;
    let fileContent = req.body.files[key];
    fs.writeFileSync(`./packages/${req.query.name}/${fileName}`, fileContent)
});
User.findOne({ UserName: req.query.author }, (err,user)=> {
    user.Packages.push(req.query.name);
    user.save();
});
res.send('Package Created!');
});

app.get('/getUser', (req, res) => {
    User.findOne({ UserName: req.query.name })
        .then((result) => {
            res.send(result);
        }).catch((error) => {
            res.send(error);
        });
});

app.get('/userAuth', (req, res) => {
    User.findOne({ UserName: req.query.Name})
        .then((result) => {
            if (result.Password === req.query.Password) {
                res.send(result);
            } else {
                res.send('Incorrect Password');
            }
        }).catch((error) => {
            res.send(error);
        });
});

app.get('/getPackageData', (req, res) => {
    Package.findOne({ Name: req.query.name })
        .then((result) => {
            res.send(result);
        }).catch((error) => {
            res.send(error);
        });
});

app.get('/getPackage', (req, res) => {
    let resp = [];
    fs.readdir(`./packages/${req.query.name}`, (err, files) => {
        if (err) {
            console.log(err)
        } else {
            // console.log('ello')
            // console.log(files)
            files.forEach(file => {
                fs.readFile(`./packages/${req.query.name}/${file}`, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(data)
                        resp.push({
                            [file]: data,
                        })
                        // console.log(resp)
                        if(resp.length == files.length){
                            res.send(resp)
                        }
                    }
                })
            // res.send(files);
        })
        

 } 
})
});


app.get('/newPackageDownload', (req,res) => {
    Package.findOne({ Name: req.query.name }, (err,package)=> {
        package.Downloads += 1;
        package.save();
    })
    res.send('Package Download Added!');
});

app.get('/monthlyDownloads', (req,res) => {
    Package.find({}, (err,packages)=> {
        packages.forEach(package => {
            package.DownloadsL = package.Downloads;
            package.save();
        });
    })
    res.send('Monthly Downloads Updated!');
});

app.get('/addPackage', (req,res) => {
    User.findOne({ UserName: req.query.name }, (err,user)=> {
        user.Packages.push(req.query.package);
        user.save();
        res.send('Package Added!');
    });
});

app.listen(80, () => {
    console.log('Server is running on port 80!');
});