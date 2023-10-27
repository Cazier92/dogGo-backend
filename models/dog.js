import mongoose from 'mongoose'

const Schema = mongoose.Schema

const timeSchema = new Schema({
  time: String
})

const walkingSchema = new Schema({
  frequency: Number,
  walkTimes: {type: [timeSchema]}
})

const dogSchema = new Schema({
  name: {type: String, required: true},
  photoUrl: [photoSchema],
  age: Number,
  breed: String,
  birthday: Date,
  gender: {
    type: String,
    emun: [
      "Boy", "Girl"
    ]
  },
  walking: {type: [walkingSchema]},
  owner: {type: Schema.Types.ObjectId, ref: 'Profile'}
},{
  timestamps: true,
})

const Dog = mongoose.model('Dog', dogSchema)

export { Dog }
