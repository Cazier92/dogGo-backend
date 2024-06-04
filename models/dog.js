import mongoose from 'mongoose'

const Schema = mongoose.Schema

// const timeSchema = new Schema({
//   time: String
// })

// const medicalSchema = new Schema({
//   vet: String,
//   vaccines: String,
//   treatment: String,
//   medicine: String,
//   notes: String,
// })


// const photoSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   photoUrl: String,
// })

const dogSchema = new Schema({
  name: {type: String, required: true},
  photo: String,
  breed: String,
  birthday: Date,
  gender: {
    type: String,
    emun: [
      "Male", "Female"
    ]
  },
  walking: [String],
  owner: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
  // medicalRecords: {type: [medicalSchema]},
},{
  timestamps: true,
})

const Dog = mongoose.model('Dog', dogSchema)

export { Dog }
