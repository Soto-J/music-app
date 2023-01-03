const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require('../middlewares/authentication');
const { Rating } = db;

// This is a simple example for providing basic CRUD routes for
// a resource/model. It provides the following:
//    GET    /api/rating
//    POST   /api/rating
//    GET    /api/ratings/:id
//    PUT    /api/ratings/:id
//    DELETE /api/ratings/:id
//
// The full URL's for these routes are composed by combining the
// prefixes used to load the controller files.
//    /api comes from the file ../app.js
//    /ratings comes from the file ./api/controllers/index.js

router.get("/", (req, res) => {
  Rating.findAll({}).then((allPosts) => res.json(allPosts));
});

router.post("/", passport.isAuthenticated(), (req, res) => {
  Rating.create({
    rating: req.body.rating,
    UserId: req.body.UserId,
    SongId: req.body.SongId,
  })
    .then((newPost) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Rating.findByPk(id).then((mpost) => {
    if (!mpost) {
      return res.sendStatus(404);
    }

    res.json(mpost);
  });
});

router.get("/song/:songID/:userID", (req, res) => {
  const { songID, userID } = req.params;
  Rating.findOne({
    where: {
      SongId: songID,
      UserId: userID,
    },
  }).then((mpost) => {
    if (!mpost) {
      return res.sendStatus(404);
    }

    res.json(mpost);
  });
});

router.get("/song/:songID", (req, res) => {
  const { songID } = req.params;
  Rating.findAll({
    where: {
      SongId: songID,
    },
  }).then((mpost) => {
    if (!mpost) {
      return res.sendStatus(404);
    }

    res.json(mpost);
  });
});

// update rating if matching rating exists, if not create one
router.put("/song/:songID/:userID", passport.isAuthenticated(), (req, res) => {
  const { songID, userID } = req.params;
  Rating.findOne({
    where: {
      SongId: songID,
      UserId: userID,
    },
  }).then((mpost) => {
    if (!mpost) {
      Rating.create({
        rating: req.body.rating,
        UserId: userID,
        SongId: songID,
      })
        .then((newPost) => {
          res.status(201).json(newPost);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    } else {
      mpost.rating = req.body.rating;

      mpost
        .save()
        .then((updatedPost) => {
          res.json(updatedPost);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
});

router.delete(
  "/song/:songID/:userID",
  passport.isAuthenticated(),
  (req, res) => {
    const { songID, userID } = req.params;
    Rating.findOne({
      where: {
        SongId: songID,
        UserId: userID,
      },
    }).then((mpost) => {
      if (!mpost) {
        return res.sendStatus(404);
      }

      mpost.destroy();
      res.sendStatus(204);
    });
  }
);

module.exports = router;