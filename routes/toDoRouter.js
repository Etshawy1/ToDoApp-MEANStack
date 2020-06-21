const express = require('express');
const router = express.Router();

const toDoController = require('../controllers/toDoController');
const authController = require('../controllers/authController');

// any endpoint written after the following line is protected route
router.use(authController.protect);

router
  .route('/')
  .get(toDoController.getAllToDos)
  .post(toDoController.createToDo);

router
  .route('/:id')
  .get(toDoController.getToDo)
  .patch(toDoController.updateToDo)
  .delete(toDoController.deleteToDo);

module.exports = router;
