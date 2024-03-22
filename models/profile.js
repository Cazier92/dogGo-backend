import mongoose, { Types } from 'mongoose'

const Schema = mongoose.Schema

const settingsSchema = new Schema({
  walkReminder: Boolean,
  airQualityReminder: Boolean,
  rainReminder: Boolean,
  snowReminder: Boolean,
  thunderReminder: Boolean,
  heatReminder: Boolean,
})

const profileSchema = new Schema({
  userName: { type: String, required: true, lowercase: true, unique: true },
  photo: String,
  location: String,
  dogs: [{type: Schema.Types.ObjectId, ref: 'Dog'}],
  settings: {type: [settingsSchema]},
  paidSub: Boolean,
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
