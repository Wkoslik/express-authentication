module.exports = (req, res, next) =>{
    // if(req.user) {
    //     next()
    // } else{
    //     console.log('You cannot be here');
    //     res.redirect('/');
    // }
    if (!req.user) {
        console.log('you cannnot be here');
        res.redirect('/auth/login')
    }else{
        next();
    }
}