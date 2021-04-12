const mongoose=require("mongoose")
const studentSchema= new mongoose.Schema(
    {
        department:{
            type: String,
            required: true
        },
        enrolledDate:{
            type: Date,
            required: true
        },
        rollNumber:{
            type: String,
            required: true
        },
        course:{
            type: String,
            required: true
        },
        batch:{
            type: String,
            required: true
        },
        courseDuration:{
            type: Number,
            required: true
        },
        instituteID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institute',
            required: true
        },
        groupsEnrolled:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }]
    }
)
module.exports=studentSchema