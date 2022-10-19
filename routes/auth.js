import { Router } from "express";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { registerValidation, signinValidation } from "../dataValidate.js";
import authenticate from "../middleware/authenticate.js";
const router = Router();

router.post("/register", async (req, res) => {
  //validating registeration details
  const { error } = await registerValidation(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  //checking if email already exist
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.send(`${req.body.email} already present`).status(422);

  if (req.body.password !== req.body.cpassword)
    return res
      .status(422)
      .send("Your password and confirmation password do not match.");
  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPasswd = await bcrypt.hash(req.body.password, salt);
  const hashedCPasswd = await bcrypt.hash(req.body.cpassword, salt);
  //creating new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    work: req.body.work,
    password: hashedPasswd,
    cpassword: hashedCPasswd,
  });
  console.log("new user created");

  //saving user
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser._id);
    console.log("user details saved");
  } catch (err) {
    res.status(400).send(err);
    console.log("err");
  }
});

router.post("/signin", async (req, res) => {
  //validating login details
  const { error } = await signinValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if email doesn't exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("Invalid credentials").status(400);

  //validating password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid credentials");

  //token
  const token = await user.generateAuthToken();
  res
    .cookie("jwtoken", token, {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: false,
    })
    .send({ message: "Successfully Signed-in" })
    .status(200);
  console.log("Logged-in");
});

router.get("/about", authenticate, async (req, res) => {
  res.send(req.rootUser);
});

router.get("/getdata", authenticate, async (req, res) => {
  res.send(req.rootUser);
});

router.post("/contactus", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contact form");
      res.json({ error: "error in contact form" });
    }
    const user = await User.findOne({ _id: req.userId });

    if (user) {
      const userMessage = await user.addMessage(name, email, phone, message);
      await user.save();
      res.status(201).send("Successful");
    }
  } catch (err) {
    console.log("error");
  }
});

router.get("/logout", authenticate, async (req, res) => {
  res.clearCookie('jwtoken',{path:'/'});
  res.status(200).send("Logged Out");
});

export default router;
