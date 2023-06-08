const router = require('express').Router();
const PicController = require('../controllers/user.controller');

router.get('/', PicController.findUsers);
router.get('/:id', PicController.findUser);
router.put('/:id', PicController.updateUser);
router.delete('/:id', PicController.deleteUser);

module.exports = router;
