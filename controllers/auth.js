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
  console.log(req.body, "req.body"); // Log the request body
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
        console.log('user.profile', user.profile)
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
function updateAccount(req, res) {
  User.findById(req.user._id)
    .then(user => {
      if (!user) return res.status(401).json({ err: 'User not found' })
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.save()
        .then(() => {
          const token = createJWT(user)
          res.status(200).json({ token })
        })
    })
}

function index(req, res) {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        throw new Error('User not found')
      }
      res.status(200).json(user)
    })
    .catch(err => {
      console.error("Error: ", err)
      res.status(500).json(err)
    })
}

function changePassword(req, res) {
  const { current_password, new_password, confirm_new_password } = req.body;

  console.log('req.body in change pw: ', req.body); // Log the request body
  if (!current_password || !new_password || !confirm_new_password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (new_password != confirm_new_password) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  User.findById(req.user._id)
    .then(user => {
      if (!user) return res.status(401).json({ err: 'User not found' })
      // console.log('user in changePassword: ', user); // Log the user
      // console.log('req.body.current_password: ', req.body.current_password); // Log the current password
      // console.log('user.password', user.password)  // Log the user's password
      res.locals.data.user = user
      return user.comparePassword(req.body.current_password)
    })
    // isMatch is undefined // 
    .then((isMatch) => {
      // console.log('Compared passwords in changePW: ', isMatch); // Log the result of the password comparison
      // console.log('req.body.current_password in changePW: ', req.body.current_password) // Log the current password
      if (isMatch) {
        const user = res.locals.data.user
        user.password = req.body.new_password
        user.save()
          .then(() => {
            const token = createJWT(user)
            res.json({ message: 'Password changed successfully' });
          })
      } else {
        res.status(401).json({ err: 'Incorrect password' })
      }
    })
    .catch(err => {
      console.error("Error in User.findById or comparePassword: ", err);
      res.status(500).json(err)
    })

  // console.log('user in changePassword: ', user); // Log the user
  // console.log('user.password in changePassword: ', user.password); // Log the user's password

}

function apiCtrl(req, res) {
  res.json(res.locals.data.token)
}


/* --== Helper Functions ==-- */

function createJWT(user) {
  console.log('user in createJWT: ', { user }); // Log the user
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '5m' })
}

export { signup, login, index, updateAccount, changePassword, apiCtrl }