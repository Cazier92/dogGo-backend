import mongoose, { Types } from 'mongoose'

const Schema = mongoose.Schema

const settingsSchema = new Schema({
  walkReminder: {type: Boolean, default: true},
  airQualityReminder: {type: Boolean, default: true},
  rainReminder: {type: Boolean, default: true},
  snowReminder: {type: Boolean, default: true},
  thunderReminder: {type: Boolean, default: true},
  heatReminder: {type: Boolean, default: true}
})

const profileSchema = new Schema({
  photo: String,
  location: String,
  dogs: [{type: Schema.Types.ObjectId, ref: 'Dog'}],
  settings: [settingsSchema],
  paidSub: {type: Boolean, default: false}
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
