const router = require('express').Router();
const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/card');
const { validateCard, validateCardID } = require('../middlewares/celebrations');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardID, deleteCard);
router.put('/:cardId/likes', validateCardID, putLike);
router.delete('/:cardId/likes', validateCardID, deleteLike);

module.exports = router;
