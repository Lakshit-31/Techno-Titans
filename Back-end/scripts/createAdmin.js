require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/usermodel");

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password || password.length < 8) {
  console.error("Usage: node scripts/createAdmin.js <name> <email> <password-min-8-chars>");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email: email.toLowerCase() }, { name, email: email.toLowerCase(), password: hashedPassword, role: "admin" }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log("Admin account ready");
  await mongoose.disconnect();
}).catch((error) => { console.error(error.message); process.exit(1); });
