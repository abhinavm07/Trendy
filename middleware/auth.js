const CustomAPIError = require("../errors/custom-error");

const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startWith("Bearer ")) {
  //   console.log("Here");
  //   throw new CustomAPIError("No token available!", 401);
  // }
  try {
    //takes the second component after the split here being token
    const token = authHeader.split(" ")[1];
    console.log(token);
    //verifies token and replies with data
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const { id, username } = decoded;
    req.user = { id, username };
    console.log(decoded);
    next();
  } catch (error) {
    console.log({ msg: error });
  }
};

module.exports = authMiddleware;
