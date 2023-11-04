const multer = require("multer");

function generateFilter(props) {
  let { allowedMimeTypes } = props;
  return multer({
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error(
          `Only ${allowedMimeTypes.join(", ")} allowed to upload!`
        );
        return cb(err, false);
      }
      cb(null, true);
    },
    onError: (err, next) => {
      next(err);
    },
  });
}

module.exports = {
  image: generateFilter({
    allowedMimeTypes: ["image/png", "image/jpeg"],
  }),
};
