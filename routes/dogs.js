import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

import * as dogsCtrl from '../controllers/dogs.js'
import * as photosCtrl from '../controllers/photos.js'

const router = Router()

/*---------- Public Routes ----------*/
//! Remove before Deployment!!!
router.get('/', dogsCtrl.index)
router.get('/:id', dogsCtrl.show)


//! ^^^ Remove/Move to protected routes prior to deployment! ^^^


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

router.post('/', checkAuth, dogsCtrl.create)
router.post('/:id/walk', checkAuth, dogsCtrl.createWalk)

router.put('/:id', checkAuth, dogsCtrl.update)
router.put('/:id/add-photo', upload.single('photo'), checkAuth, photosCtrl.create)
router.put(':id/walk/:walkId', checkAuth, dogsCtrl.updateWalk)

router.delete('/:id', checkAuth, dogsCtrl.deleteDogProfile)
router.delete(':id/walk/:walkId', checkAuth, dogsCtrl.deleteWalk)

export { router }