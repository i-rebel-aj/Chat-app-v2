const mongoose=require("mongoose")
const studentSchema=require("./Schemas/User/Student")
const facultySchema=require("./Schemas/User/Faculty")
const adminSchema=require('./Schemas/User/Admin')
const superAdminSchema=require('./Schemas/User/SuperAdmin')
const bcrypt = require("bcrypt");
const options={discriminatorKey: 'Type'}
const userSchema=new mongoose.Schema(
    {
        //Common Entries Goes Here
        username:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        gender:{
            type: String,
            required: true
        },
        email:{
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        // Rediscuss about 2-way dependency
        // createdPrivateForums:[{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Forum'
        // }],
        joinedPrivateForums:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Forum'
        }],
    },options,{timestamps: true}
)
userSchema.pre('save', function(next) {
    let user = this;
    //Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    //generate a salt
    bcrypt.genSalt(10, (err, salt)=> {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash)=> {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
userSchema.methods = {
    authenticate: function  (plainpassword) {
      const isValidPass = bcrypt.compareSync(plainpassword, this.password);
      console.log(plainpassword)
      console.log(isValidPass)
      if(isValidPass){
        return true;
      }else{
        return false;
      }
    }
}

const User=mongoose.model('User', userSchema)
const Student=User.discriminator('Student', studentSchema)
const Faculty=User.discriminator('Faculty', facultySchema)
const Admin=User.discriminator('Admin', adminSchema)
const SuperAdmin=User.discriminator('Super Admin', superAdminSchema)

module.exports={User, Student, Faculty, Admin, SuperAdmin}