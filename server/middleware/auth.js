const jwt = require("jsonwebtoken");
const { users } = require("../models");

const verifyToken = async (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (!token) throw 403;

		token = token.split(' ')[1];
		const decoded = jwt.verify(token, process.env.LOGIN_KEY);
		
		req.user = await users.findById(decoded.username, '_id').lean();
		if (!req.user) throw 401;

		req.user.username = req.user._id; delete req.user._id;
		next();
	} catch (e) {
		let code = 401, message = "Invalid Token";
		if (e == 403) { code = e, message = "Not logged in" }
		if (e == 401) code = e;
		res.status(code).send({ message });
	}
};

module.exports = verifyToken;