const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");


router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      req.session.username = saved.username; // <<<<<<<<<<<<<<
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username; // << good: add properties to existing session object
        // req.session = { username: user.username } // bad panda: don't override the session object
        res.status(200).json({
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res
          .status(500)
          .json({
            message:
              "you can check out any time you like, but you can never leave..."
          });
      } else {
        res.status(200).json({ message: "logged out successfully" });
      }
    });
  } else {
    res.status(200).json({ message: "by felicia" });
  }
});

module.exports = router;


// const router = require('express').Router();
// const express = require('express');
// const Users = require('./users-model');
// const bcrypt = require('bcryptjs');


// router.get('/', (req, res) => {	
// 	Users.find()	
// 		.then((data) => {	
// 			res.status(201).json(data);	
// 		})	
// 		.catch((err) => {	
// 			res.status(500).json(err);	
// 		});	
// });


// router.post('/register', (req, res, next) => {	
// 	let user = req.body; 


// 	if (!user.username || !user.password) {	
// 		res.status(404).json({ message: 'Please enter your username and password' });	
// 	}	

// 	const hash = bcrypt.hashSync(user.password, 12); 	
// 	user.password = hash; 
// 	Users.add(user)	
// 		.then((saved) => {	
// 			res.status(201).json(saved);	
// 		})	
// 		.catch((err) => {	
// 			res.status(500).json(err);	
// 		});	
// });	

// router.post('/login', (req, res) => {	
// 	let { username, password } = req.body;	

// 	if (!username || !password) {	
// 		res.status(401).json({ message: 'Invalid username or password' });	
// 	}	

// 	Users.findBy({ username })	
// 		.first()	
// 		.then((user) => {	
// 			if (username && bcrypt.compareSync(password, user.password)) {	
// 				res.status(201).json({ message: 'Logged in', token: user.id });	
// 			} else {	
// 				res.status(404).json({ message: 'You shall not pass!' });	
// 			}	
// 		})	
// 		.catch((err) => {	
//             console.log(err)
// 			res.status(500).json(err);	
// 		});	
// });	

// function authorize(req, res, next) {	

// 	const username = req.body['username'];	
// 	const password = req.body['password'];	

// 	if (!username || !password) {	
// 		res.status(401).json({ message: 'Invalid username or password' });	
// 	}	

// 	Users.findBy({ username })	
// 		.first()	
// 		.then((user) => {	
// 			if (username && bcrypt.compareSync(password, user.password)) {	
// 				next();	
// 			} else {	
// 				res.status(404).json({ message: 'No a!' });	
// 			}	
// 		})	
// 		.catch((err) => {	
// 			res.status(500).json(err);	
// 		});	
// }	


// module.exports = router;