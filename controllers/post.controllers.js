const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const imagekit = require("../libs/imagekit");
const axios = require("axios");
const Sentry = require('@sentry/node');

module.exports = {
  createPost: async (req, res, next) => {
    try {
      const { title, description } = req.body;

      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "Image is required", data: null });

      const file = req.file.buffer.toString("base64");
      const originalname = req.file.originalname;

      const { url, fileId } = await imagekit.upload({
        file,
        fileName: Date.now() + path.extname(originalname),
        folder: "/challange/images",
      });

      const post = await prisma.posts.create({
        data: {
          title,
          description,
          image: {
            create: {
              image_id: fileId,
              url,
            },
          },
        },
        include: {
          image: true,
        },
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Post Successfull Created",
          data: post,
        });
    } catch (error) {
      next(error);
    }
  },

  getPosts: async (req, res, next) => {
    try {
      let { postId } = req.query;
      axios
          .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
          .then(({ data }) => {
              return res.status(200).json({
                  status: true,
                  message: 'OK',
                  err: null,
                  data: { user: req.user, data }
              });
          })
          .catch(err => {
              Sentry.captureException(err);
              return res.status(400).json({
                  status: false,
                  message: 'not found',
                  err: err.message,
                  data: null
              });
          });
      // const posts = await prisma.posts.findMany({
      //   include: {
      //     image: true,
      //   },
      // });

      // res
      //   .status(200)
      //   .json({ success: true, message: "Posts Found", data: posts, data });
    } catch (error) {
      next(error);
    }
  },

  getPost: async (req, res, next) => {
    try {
      const { id } = req.params;

      const post = await prisma.posts.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          image: true,
        },
      });

      if (!post)
        return res
          .status(404)
          .json({ success: false, message: "Post Not Found", data: null });

      res
        .status(200)
        .json({ success: true, message: "Post Found", data: post});
    } catch (error) {
      next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      // Cek apakah post ada
      const existPost = await prisma.posts.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!existPost)
        return res
          .status(404)
          .json({ success: false, message: "Post Not Found", data: null });

      // Update data post
      const updatedPost = await prisma.posts.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          description,
        },
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Post Successfull Updated",
          data: updatedPost,
        });
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existPost = await prisma.posts.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          image: true,
        },
      });

      if (!existPost)
        return res
          .status(404)
          .json({ success: false, message: "Post Not Found", data: null });

      await imagekit.deleteFile(existPost.image.image_id);

      await prisma.images.delete({
        where: {
          post_id: parseInt(id),
        },
      });

      const post = await prisma.posts.delete({
        where: {
          id: parseInt(id),
        },
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Post Successfull Deleted",
          data: post,
        });
    } catch (error) {
      next(error);
    }
  },
};
