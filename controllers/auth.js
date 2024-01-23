// import jwt from 'jsonwebtoken'

// import { User } from '../models/user.js'
// import { Profile } from '../models/profile.js'

// async function signup(req, res) {
//   try {
//     if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
//     if (!process.env.CLOUDINARY_URL) {
//       throw new Error('no CLOUDINARY_URL in back-end .env file')
//     }

//     const user = await User.findOne({ email: req.body.email })
//     if (user) throw new Error('Account already exists')

//     const newProfile = await Profile.create(req.body)
//     req.body.profile = newProfile._id
//     const newUser = await User.create(req.body)

//     const token = createJWT(newUser)
//     res.status(200).json({ token })
//   } catch (err) {
//     console.log(err)
//     try {
//       if (req.body.profile) {
//         await Profile.findByIdAndDelete(req.body.profile)
//       }
//     } catch (err) {
//       console.log(err)
//       return res.status(500).json({ err: err.message })
//     }
//     res.status(500).json({ err: err.message })
//   }
// }

// async function login(req, res) {
//   try {
//     if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
//     if (!process.env.CLOUDINARY_URL) {
//       throw new Error('no CLOUDINARY_URL in back-end .env')
//     }

//     const user = await User.findOne({ email: req.body.email })
//     if (!user) throw new Error('User not found')

//     const isMatch = await user.comparePassword(req.body.password)
//     if (!isMatch) throw new Error('Incorrect password')

//     const token = createJWT(user)
//     res.json({ token })
//   } catch (err) {
//     handleAuthError(err, res)
//   }
// }

// async function changePassword(req, res) {
//   try {
//     const user = await User.findById(req.user._id)
//     if (!user) throw new Error('User not found')

//     const isMatch = user.comparePassword(req.body.password)
//     if (!isMatch) throw new Error('Incorrect password')

//     user.password = req.body.newPassword
//     await user.save()

//     const token = createJWT(user)
//     res.json({ token })

//   } catch (err) {
//     handleAuthError(err, res)
//   }
// }

// /* --== Helper Functions ==-- */

// function handleAuthError(err, res) {
//   console.log(err)
//   const { message } = err
//   if (message === 'User not found' || message === 'Incorrect password') {
//     res.status(401).json({ err: message })
//   } else {
//     res.status(500).json({ err: message })
//   }
// }

// function createJWT(user) {
//   return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' })
// }

// export { signup, login, changePassword }

import { User } from '../models/user.js'
import { Profile } from '../models/profile.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


function signup(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        throw new Error('Account already exists')
      } else if (!process.env.SECRET) {
        throw new Error('no SECRET in .env file')
      } else {
        Profile.create(req.body)
          .then(newProfile => {
            req.body.profile = newProfile._id
            User.create(req.body)
              .then(user => {
                const token = createJWT(user)
                res.status(200).json({ token })
              })
              .catch(err => {
                Profile.findByIdAndDelete(req.body.profile)
                res.status(500).json({ err: err.errmsg })
              })
          })
      }
    })
    .catch(err => {
      res.status(500).json({ err: err.message })
    })
}

// function login(req, res) {
//   User.findOne({ email: req.body.email })
//   .then(user => {
//     if (!user) {
//       // return res.status(401).json({ err: 'User not found' })
//       if (!req.body.pw || !user.password) return res.status(400).json({ err: 'Missing password' })
//       throw new Error('User not found')
//     } else {
//       user.comparePassword(req.body.pw, (err, isMatch) => {
//         // const isMatch = bcrypt.compare(req.body.pw, user.password)
//         if (isMatch) {
//           const token = createJWT(user)
//           res.json({ token })
//           res.status(200).json({ token })
//         } else {
//           res.status(401).json({ err: 'Incorrect password' })
//         }
//       })
//       // const isMatch = await bcrypt.compare(req.body.pw, user.password)
//       // if (!isMatch) throw new Error('Incorrect password')
//     }
//   })
//   .catch(err => {
//     console.error(err)
//     res.status(500).json(err)
//   })
// }


// function login(req, res) {
//   console.log(req.body)
//   User.findOne({ email: req.body.email })
//     .then(user => {
//       if (!user) return res.status(401).json({ err: 'User not found' })
//       if (!req.body.password || !user.password) return res.status(400).json({ err: 'Missing password' })
//       // const tryPassword = req.body.password
//       user.comparePassword(req.body.password, (err, isMatch) => {
//         if (isMatch == true) {
//           const token = createJWT(user)
//           res.json({ token })
//         } else {
//           res.status(401).json({ err: 'Incorrect password' })
//         }
//       })
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json(err)
//     })
// }

function login(req, res) {
  console.log(req.body); // Log the request body
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log('Found user: ', user); // Log the user
      if (!user) return res.status(401).json({ err: 'User not found' })
      if (!req.body.password || !user.password) return res.status(400).json({ err: 'Missing password' })
      return user.comparePassword(req.body.password)
    })
    .then((isMatch, user) => {
      console.log('Compared passwords: ', isMatch); // Log the result of the password comparison
      if (isMatch) {
        const token = createJWT(user)
        res.json({ token })
      } else {
        res.status(401).json({ err: 'Incorrect password' })
      }
    })
    .catch(err => {
      console.error("Error in User.findOne or comparePassword: ", err);
      res.status(500).json(err)
    })
}

function changePassword(req, res) {
  User.findById(req.user._id)
    .then(user => {
      if (!user) return res.status(401).json({ err: 'User not found' })
      user.comparePassword(req.body.pw, (err, isMatch) => {
        if (isMatch) {
          user.password = req.body.newPw
          user.save()
            .then(() => {
              const token = createJWT(user)
              res.json({ token })
            })
        } else {
          res.status(401).json({ err: 'Incorrect password' })
        }
      })
    })
}

function apiCtrl(req, res) {
  res.json(res.locals.data.token)
}


/* --== Helper Functions ==-- */

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' })
}

export { signup, login, changePassword, apiCtrl }