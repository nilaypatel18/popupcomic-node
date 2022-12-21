const User = require("../models/user-model");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
//for authentication
const jwt = require("jsonwebtoken");

createUser = async (req, res) => {
  const body = req.body;
  const errors = validationResult(body);
  console.log(errors)

  if (!errors.isEmpty()) {
    const valid_error = errors.mapped();
    const validation_error = generateValidationError(valid_error);

    return res.status(400).json({
      message: validation_error,
    });
  }

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a movie",
    });
  }
  const { email, password } = req.body;
  let checkuser = await User.findOne({
    email,
  });
  if (checkuser) {
    return res
      .status(400)
      .json({ success: false, message: "Email address is already used" });
  }
  const user = new User(body);

  if (!user) {
    return res.status(400).json({ success: false, error: err });
  }

  user
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: user._id,
        message: "user is successfully created.",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        success: false,
        error: error,
        message: "There is an error while creating a user.",
      });
    });
};
signIn = async (req, res) => {
  const body = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const valid_error = errors.mapped();

    const validation_error = generateValidationError(valid_error);
    return res.status(400).json({
      success: false,
      message: valid_error,
    });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User Not Exist",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Incorrect Password !",
      });

    const payload = {
      user: {
        id: user.id,
      },
    };

    //old code
    let token = jwt.sign(payload, "popupcomics");
    user.token = token;
    user.password = password;

    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          data: user,
          message: "Login successfully",
        });
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          error: error.code,
          message: "login failed",
        });
      });
    /* jwt.sign(
            payload,
            "popupcomics",
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    user,
                    token
                });
            }
        ); */
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
signOut = async (req, res) => {
  let user_id = req.user_id;
  let token = req.token;
  let user = await User.findOne({
    token,
  });
  console.log(user);
  user.update({ $unset: { token: "" } }, function (err, user) {
    if (err) return res.status(400).send(err);
    res.status(200).json({ message: "successfully logout" });
  });
};
module.exports = { createUser, signIn, signOut };
/* module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovies,
    getMovieById,
} */
