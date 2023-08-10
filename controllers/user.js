
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/features.js";



export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });



        if (user) {
            return next(new Errorhandler("The email already exists.", 404))
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name, email, password: hashedPassword
        })

        sendCookie(user, res, "Registered successfully.", 201)


    } catch (error) {
        next(error);
    }



}

export const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new Errorhandler("Invalid Email or password.", 404))
        }

        const isMatch = await bcrypt.compare(password, user.password);


        if (!isMatch) {
            return next(new Errorhandler("Invalid Email or password.", 404))
        }

        sendCookie(user, res, `Welcome back, ${user.name} `, 200)
    } catch (error) {
        next(error);
    }
}




export const getMyProfile = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const logout = (req, res) => {
    res.status(200).cookie('token', "", {
        expires: new Date(Date.now()),
        samesite: process.env.NODE_ENV === 'DEVELOPMENT' ? "lax" : none,
        secure: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true
    }).json({
        success: true,
        user: req.user

    })

}

// export const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     res.json({
//         success: true,
//         message: "Updated",
//     })
// }

// export const deleteUser = async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     await user.remove();
//     res.json({
//         success: true,
//         message: "Deleted",
//     })
// }