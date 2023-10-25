import mongoose from 'mongoose'

const Schema = mongoose.Schema

const timeSchema = new Schema({
  time: String
})

const walkingSchema = new Schema({
  frequency: Number,
  walkTimes: {type: [timeSchema], required: true}
})

const dogSchema = new Schema({
  name: {type: String, required: true},
  photo: String,
  age: Number,
  breed: String,
  walking: {type: [walkingSchema], required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'Profile'}
},{
  timestamps: true,
})

const Dog = mongoose.model('Dog', dogSchema)

export { Dog }
