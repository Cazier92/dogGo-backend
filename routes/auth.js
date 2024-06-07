import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as authCtrl from '../controllers/auth.js'

const router = Router()

router.use(decodeUserFromToken)
/*---------- Public Routes ----------*/
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login, checkAuth)

/*---------- Protected Routes ----------*/
router.get('/account', checkAuth, authCtrl.index)
router.post('/account', checkAuth, authCtrl.updateAccount)
router.post('/account/change-password', checkAuth, authCtrl.changePassword)

export { router }
