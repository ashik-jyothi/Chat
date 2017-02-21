'use strict';

var passport = require('./config/passport');

module.exports = function(app,passport) {
    app.post('/signin', function(req, res, next) {
        console.log("POST REQ",req);
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/')
            };
            if (user) {
                req.login(user, function(err) {
                    return res.redirect('/');
                })
            }
        })(req, res, next);
    })
    app.get('/logout', function(req, res, next) {
        req.session.destroy(function() {
            return res.redirect('/');
        })
    })
    app.get('/', function(req, res, next) {
        if (req.isAuthenticated()) {
            res.render('main', {
                user: JSON.stringify(req.user)
            })
        } else {
            // console.log('here2')
            res.render('main', {
                user: 'null'
            })
        }
    })
}