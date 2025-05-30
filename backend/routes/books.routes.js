const router = require("express").Router();
const booksController = require('../controllers/books.controller');

router.get('/books', booksController.getBooksExceptUser);
router.get('/allBooks', booksController.getAllBooks);
router.get('/myBooks', booksController.getMyBooks);
router.post('/addBooks', booksController.addBooks);
router.delete('/books/:id', booksController.deleteBook);
router.delete('/deleteBooks', booksController.deleteBooks);
router.patch("/books/:id/offer", booksController.offerBook);
router.patch("/books/:id/unoffer", booksController.unofferBook);
module.exports = router;