import mongoose, { Schema } from "mongoose"

const UsersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "User email required"],
    },
    password: {
        type: String,
        required: function () {
            return this.googleId ? false : true
        },
    },
    // googleId: {
    //     type: String,
    //     required: function () {
    //         return this.password ? false : true
    //     },
    // },
})

export const User = mongoose.model("User", UsersSchema, "authUsers") //occhio dati non omogenei
