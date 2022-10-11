const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/user');
const { validateProfile, validateUserID, validateAvatar } = require('../middlewares/celebrations');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateUserID, getUser);
router.patch('/me', validateProfile, updateProfile);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
