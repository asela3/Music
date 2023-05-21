import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import validator from "email-validator";
import sendEmail from "../utils.js";
import { log } from "console";

export const welcome = (req, res) => {
  res.json({
    data: "hello",
  });
};

export const preRegister = async (req, res) => {
  try {
    const { email, password, genre } = req.body;

    if (!validator.validate(email)) {
      return res.json({ error: "A valid email is required" });
    }

    if (!password) {
      return res.json({ error: "Password is required" });
    }

    if (password && password.length < 6) {
      return res.json({ error: "Password should be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ error: "Email is taken" });
    }

    const token = jwt.sign({ email, password, genre }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const activationUrl = `https://magnificent-alpaca-311c3c.netlify.app/activation/${token}`;

    await sendEmail({
      email: email,
      subject: "Activate your account",
      message: `Hello ${email}, please click the link to activate your account: ${activationUrl}`,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went Wrong. Try again." });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, genre } = await jwt.verify(
      req.body.token,
      config.JWT_SECRET
    );
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(401).json("User already exsits");
    }

    const hashedPassword = await hashPassword(password.toString());

    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
      genre,
    }).save();

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please log in again." });
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong. Try again later." });
    }
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const match = await comparePassword(password, user.password);

      if (!match) {
        return res.json({ error: "Wrong password" });
      }

      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });

      user.password = undefined;
      user.resetCode = undefined;

      return res.json({
        token,
        refreshToken,
        user,
      });
    } else {
      return res.json({ error: "User not found" });
    }
  } catch (err) {
    return res.json({ error: "Something went wrong. Try again.", err });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      const resetCode = nanoid();
      user.resetCode = resetCode;
      await user.save();

      const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
        expiresIn: "1h",
      });

      config.AWS_SES.sendEmail(
        emailTemplate(
          email,
          `<p>Please click the below link to access your account.</p>
          <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
          `,
          config.REPLY_TO,
          "Access your account"
        ),

        (err, data) => {
          if (err) {
            console.log(err);
            return res.json({ ok: false });
          } else {
            console.log(data);
            return res.json({ ok: true });
          }
        }
      );
    }
  } catch (err) {
    return res.json({ error: "Something went wrong. Try again.", err });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;

    const newUser = jwt.verify(token, config.JWT_SECRET);
    console.log(newUser);

    if (!newUser) {
      return res.status(401).json("Invalid token");
    }

    const { name, email, password } = newUser;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(401).json("User already exsits");
    }

    const user = await User.create({ name, email, password });

    sendToken(user, 201, res);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json("Token expired or Invalid");
    }

    return res.status(401).json(error);
  }
};

export const accessAccount = async (req, res) => {
  try {
    const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);
    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    return res.json({ error: "Something went wrong. Try again.", err });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);

    const user = await User.findById({ _id });

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Refresh token failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne(req.user_id);
    user.password = undefined;
    user.resetCode = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const publicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    return res.json(user);
  } catch (err) {
    return res.json({ error: "User not found" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (password && password < 6) {
      return res.json({ error: "Password should be min 6 characters" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
