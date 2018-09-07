const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/usuarios');
//REGISTRO
router.post('/signup', function(req, res) {
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash    
         });
      user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'Nuevo usuario creado'
            });
         }).catch(error => {
            res.status(500).json({
               error: err
            });
         });
      }
   });
});
//LOGIN
router.post('/signin', function(req, res){
    User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
       bcrypt.compare(req.body.password, user.password, function(err, result){
          if(err) {
             return res.status(401).json({
                failed: 'No tiene autorizacion'
             });
          }
          if(result) {
             return res.status(200).json({
                success: 'Bienvenido'
             });
          }
          return res.status(401).json({
             failed: 'Sin autorizacion'
          });
       });
    })
    .catch(error => {
       res.status(500).json({
          error: error
       });
    });;
 });

module.exports = router;