import mongoose from 'mongoose'

const Schema = mongoose.Schema

const timeSchema = new Schema({
  time: String
})

const walkingSchema = new Schema({
  frequency: Number,
  walkTimes: [timeSchema]
})

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photoUrl: String,
})

const dogSchema = new Schema({
  name: {type: String, required: true},
  photo: String,
  age: Number,
  breed: String,
  birthday: Date,
  gender: {
    type: String,
    emun: [
      "Male", "Female"
    ]
  },
  walking: [walkingSchema],
  owner: [{type: Schema.Types.ObjectId, ref: 'Profile'}]
},{
  timestamps: true,
})

const Dog = mongoose.model('Dog', dogSchema)

export { Dog }
