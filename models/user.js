import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 6
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: String,
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
}, {
  timestamps: true,
})

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password
    return ret
  }
})

// userSchema.pre('save', async function (next) {
//   const user = this
//   if (!user.isModified('password')) return next()

//   try {
//     const hash = await bcrypt.hash(user.password, saltRounds)
//     user.password = hash
//     next()
//   } catch (err) {
//     next(err)
//   }
// })

userSchema.pre('save', async function (next) {
  // 'this' is user doc
  if (!this.isModified('password')) return next()
  // update the password with the computed hash
  this.password = await bcrypt.hash(this.password, saltRounds)
  return next()
})

userSchema.methods.comparePassword = async function (tryPassword) {
  console.log('Trying to compare password: ', tryPassword); // Log the input password
  const isMatch = await bcrypt.compare(tryPassword, this.password)
  console.log('Comparison result: ', isMatch); // Log the comparison result
  return isMatch
}

const User = mongoose.model('User', userSchema)

export { User }


// name: {type: String, required: true},
// email: { type: String, required: true, lowercase: true },
// password: {
//   type: String,
//   trim: true,
//   minLength: 6,
//   required: true
// },
// profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
// }, {
//   timestamps: true,