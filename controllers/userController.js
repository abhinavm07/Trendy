const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {sign} = require("jsonwebtoken");
const User = require("../model/userModel");
const crypto = require("crypto");
const {sendEmail} = require("./emailWrapper");
const fs = require("fs");

// Genrate Token

const genrateToken = (id) => {
    return sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc Register a new user
// @route /api/users
// access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Include all fileds");
    }

    // Find if user already Exists

    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: genrateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc Login a user
// @route /api/users/login
// access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    //check user and password match
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: genrateToken(user._id),
        });
    } else {
        return res.status(401).send('Invalid Credentials');
    }
});

// @desc Get current user
// @route /api/users/me
// access Private
const getMe = asyncHandler(async (req, res) => {
    const user = {id: req.user._id, email: req.user.email, name: req.user.name};
    res.status(200).json(user);
});

const geolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            console.log(lat, long);
        });
    }
};

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    //check in db if user exists
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({msg: "User Does Not Exists", status: 'error'});
    }
    const randomBytes = crypto.randomBytes(8);
    const hash = crypto.createHash('sha256').update(randomBytes).digest('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hash, salt);
    const resetUser = await User.findOneAndUpdate(
        {email},
        {password: hashedPassword}
    );
    //send email
    const subject = 'Reset Password';
    const messageData = {
        user_name: resetUser.name,
        password: hash
    };
    const message = getMessageTemplate('reset_password', messageData);

    const response = await sendEmail(email, subject, message);
    res.status(200).json({msg: "Email sent with a new password. Please check the inbox.", status: 'success', response});
};

function getMessageTemplate(type = '', data = {}) {
    try {
        const dirLocation = __dirname;
        const html = fs.readFileSync(`${dirLocation}/../templates/${type}.html`, 'utf8');

        // Replace variables in HTML with corresponding values from data object
        let modifiedHTML = html;
        Object.entries(data).forEach(([key, value]) => {
            const variable = `{{${key}}}`;
            modifiedHTML = modifiedHTML.replace(new RegExp(variable, 'g'), value);
        });

        return modifiedHTML;
    } catch (error) {
        console.error('Error reading HTML file:', error);
        return null;
    }
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    geolocation,
    forgotPassword
};
