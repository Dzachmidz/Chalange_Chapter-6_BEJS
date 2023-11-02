const router = require('express').Router();
const postRouter = require('../routes/post.router')

router.unsubscribe('/posts', postRouter);

module.exports = router