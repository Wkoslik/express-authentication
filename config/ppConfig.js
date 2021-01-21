//requirements
const passport = require('passport'); //allows us to manage authentication
const LocalStrategy = require('passport-local').Strategy //one of the 500 ways to manage authentication
const db = require('../models');

//passport will serialize obects; converts the user to an identifier (id)

passport.serializeUser((user, cb) =>{
    cb(null, user.id); //unique identifier of the user
});

//passport deserializing an object; finds user in DB via serialized identifier (id)
passport.deserializeUser((id, cb) =>{
    db.user.findByPk(id).then(user =>{
        cb(null, user);
    }).catch(err =>{
        cb(err, null);
    });
})

//passport using its strategy to provide local auth (not reaching somewhere else to do the authorization)
//need to give local strategy the following info:

//configuration: an object of data to identify our auth fields (username, password)

//callback function: a function that is called to log the user in, we can pass the email and password to a db query and retur the appropriate information in the call back (login(error, user) {do stuff})
    //provide 'null' if no error or "false" if there is no user

passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb)=>{
    //look for a user and cb accordingly
    db.user.findOne({
        where: {
            email: email // can also just be written { email } since the key and value are the same
        }
    }).then (user =>{
        //If there is no user OR the user has na invalid password
        if(user && user.validPassword(password)){
            //cb(null, user) 
            cb(null, user)
        } else {    
        //cb(null, false) no error, false user
        cb(null, false);
        }
    }).catch(cb);
}));

//export the configured passwort

module.exports = passport;