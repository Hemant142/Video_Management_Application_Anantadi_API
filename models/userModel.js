const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
    });


    const UserModel = mongoose.model("user",userSchema)
    module.exports={
        UserModel
    }