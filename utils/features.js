import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCodoe = 200) => {
    const token = jwt.sign({
        _id: user._id,
    }, process.env.JWT_SECRET);

    res.status(statusCodoe).cookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        samesite: process.env.NODE_ENV === 'DEVELOPMENT' ? "lax" : none,
        secure: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true
    }).json({
        success: true, message
    })
}
