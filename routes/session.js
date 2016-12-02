// Création des constantes
const router = require('express').Router()
const cookieParser = require('cookie-parser')
const User = require('../models/user.js')
const Session = require('../models/session')

router.get("/",(req,res) => {
	res.render("login/index");
})
router.post("/", (req, res) => {
	if(req.body.login){
			User.getByEmail(req).then((user) => {
		if(req.body.password == user.password){
			Session.insert(user.rowid).then(() => {
				res.cookie('login', 'OK', { maxAge: 900000, httpOnly: true });
				res.redirect("/users");
			})
		} else {
			res.redirect("/users");
		}

	}).catch((e) => {
		console.log(e);
	})
	} else {
		res.redirect("/users/add");
	}

})

module.exports = router
