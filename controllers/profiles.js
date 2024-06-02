import { Profile } from '../models/profile.js'
import { User } from '../models/user.js'
import { v2 as cloudinary } from 'cloudinary'

/* ------------------ PROFILE ------------------ */
//* Get/Indexing Functions

async function index(req, res) {
  console.log(req.body, "req.body in profiles index"); // Log the request body
  try {
    const user = await User.findOne({ email: req.params.email })
    // .then(user => {
    // Profile.findOne({ user: user._id })
    // .then(profile => {
    //   console.log(profile)
    //   res.status(200).json(profile)
    console.log(user, "user")
    // console.log(res.locals.data.user, "res.locals.data.user")
    res.status(200).json(user)
    // })
    // .catch(err => {
    //   console.log(err)
    //   res.status(500).json(err)
    // })
    // })

    // res.json(profiles)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

//* Get/Show Functions

async function show(req, res) {
  Profile.findById(req.user.profile)
    .then(profile => {
      console.log(profile, "profile in show")
      if (!profile) {
        throw new Error('Profile not found')
      }
      res.status(200).json(profile)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

//* Put/Update Functions

async function update(req, res) {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    await profile.save()
    res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function addPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const profile = await Profile.findById(req.params.id)

    const image = await cloudinary.uploader.upload(
      imageFile,
      { tags: `${req.user.email}` }
    )
    profile.photo = image.url

    await profile.save()
    res.status(201).json(profile.photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function updateLocation(req, res) {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { location: req.body.location },
      { new: true }
    )
    await profile.save()
    res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  index,
  show,
  update,
  addPhoto,
  updateLocation
}
