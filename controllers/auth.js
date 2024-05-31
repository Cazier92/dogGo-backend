import { User } from '../models/user.js'
import { Profile } from '../models/profile.js'
import jwt from 'jsonwebtoken'


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
              // const token = createJWT(user)
              res.locals.data.user = user
              // res.locals.data.token = token
              res.locals.data.token = createJWT(user)
              const token = res.locals.data.token
              console.log('Created token in signup: ', token); // Log the token
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


function login(req, res) {
  console.log(req.body); // Log the request body
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log('Found user: ', user); // Log the user
      if (!user) return res.status(401).json({ err: 'User not found' })
        res.locals.data.user = user
      if (!req.body.password || !user.password) return res.status(400).json({ err: 'Missing password' })
      return user.comparePassword(req.body.password)
    })
    .then((isMatch) => {
      console.log('Compared passwords: ', isMatch); // Log the result of the password comparison
      if (isMatch) {
        const user = res.locals.data.user
        console.log('user in login: ', user); // Log the user
        let token = createJWT(user)
        console.log('Created token: ', token); // Log the token
        res.status(200).json({ token })
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
      user.comparePassword(eq.body.password, (err, isMatch) => {
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
  console.log('user in createJWT: ', { user }); // Log the user
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '5m' })
}

export { signup, login, changePassword, apiCtrl }