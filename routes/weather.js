import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as weatherCtrl from '../controllers/weather.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/

router.use(decodeUserFromToken)
router.get('/', checkAuth, weatherCtrl.index)
