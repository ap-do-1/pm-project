const allowedOrigins = require("./allowed_origins");

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin); // Log the origin
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
