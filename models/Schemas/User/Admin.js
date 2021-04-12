const mongoose=require("mongoose")
const adminSchema= new mongoose.Schema(
    {
        instituteID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institute',
            required: true
        },
        isAssigned:{
            type: Boolean,
            default: false
        }
    }
)
module.exports=adminSchema