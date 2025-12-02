import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({message: "User already exists"});

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hashPassword });

    res.status(201).json({ message: "User Registered Successfully", user});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found "});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: err.message });  
  }
};