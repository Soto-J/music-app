const router   = require('express').Router();
const { User } = require('../models');
const passport = require('../middlewares/authentication');

// /api/auth/signup
router.post('/signup', (req, res) => {
    console.log('Post body: ', req.body);
    //will create user based on info given on signup form
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })
    .then((user) => {
        req.login(user, () => res.status(201).json(user));
    })
    .catch((err) => {
        res.status(400).json({msg: 'Failed Signup', err}); //err should be taken out once site is ready for development
    });
});

router.post('/login', 
passport.authenticate('local'),
(req,res) => {
    //if this function gets called, authentication was successful
    // 'req.user' contains the authenticated user
    res.json(req.user);
});

router.get('/login', (req, res) => {
    if(req.user) {
        res.json(req.user)
    } else {
        res.sendStatus(401);
    }
});

router.get("/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.sendStatus(404);
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: "Failed to get user", err });
    });
});

router.post('/logout', (req, res, next) => {
    req.logout(req.user, err => {
        if(err) return next(err);
    });
    res.status(200).json({ message: 'logout successful' });
});

module.exports = router;