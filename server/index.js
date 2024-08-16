const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/classroom', require('./routes/classroom'));

(async () => {
	try {
		console.log("[+] Connecting to MongoDB Atlas...");
		await mongoose.connect(process.env.DB_URL);
		console.log("[+] Connection Successful");
		const port = process.env.PORT || 3000;
		app.listen(port, () => { console.log('[+] Server running on port ' + port) });
	} catch (e) {
		console.log("[-] Connection Failed");
	}
})();