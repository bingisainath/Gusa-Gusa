// const mongoose = require('mongoose')

// const userSchema =  new mongoose.Schema({
//     name : {
//         type : String,
//         required : [true, "provide name"]
//     },
//     email : {
//         type : String,
//         required : [true,"provide email"],
//         unique : true
//     },
//     password : {
//         type : String,
//         required : [true, "provide password"]
//     },
//     profile_pic : {
//         type : String,
//         default : ""
//     }
// },{
//     timestamps : true
// })

// const UserModel = mongoose.model('User',userSchema)

// module.exports = UserModel

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide name"],
    },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s-]{10,}$/, "provide a valid phone number"],
    },
    DOB: {
      type: Date,
    },
    address: {
      type: String,
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
