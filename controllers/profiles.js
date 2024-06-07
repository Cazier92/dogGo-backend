import { Profile } from '../models/profile.js'
import { User } from '../models/user.js'
import { v2 as cloudinary } from 'cloudinary'

/* ------------------ PROFILE ------------------ */

//* Get/Show Functions

async function show(req, res) {
  Profile.findById(req.user.profile)
    .then(profile => {
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
  show,
  update,
  addPhoto,
  updateLocation
}
