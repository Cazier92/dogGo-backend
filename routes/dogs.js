import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as dogsCtrl from '../controllers/dogs.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/', checkAuth, dogsCtrl.index)

router.post('/', checkAuth, dogsCtrl.create)
router.post('/:id/walk', checkAuth, dogsCtrl.createWalk)

router.put('/:id', checkAuth, dogsCtrl.update)
router.put('/:id/add-photo', checkAuth, dogsCtrl.addPhoto)
router.put(':id/walk/:walkId', checkAuth, dogsCtrl.updateWalk)

router.delete('/:id', checkAuth, dogsCtrl.delete)
router.delete(':id/walk/:walkId', checkAuth, dogsCtrl.deleteWalk)

export { router }