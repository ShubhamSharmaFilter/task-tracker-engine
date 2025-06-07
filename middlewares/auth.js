import jwt from "jsonwebtoken";
import { secretKey } from "../config/index.js";



export const generateToken = (userId, email) => {
    const secret =
      process.env.JWT_SECRET || "68432731-d458-8006-8929-e75eea16a4d5";
    return jwt.sign({ id: userId, email }, secret, {
      expiresIn: "1d",
    });
  };


// export const generateAccessToken = (id, email) => {
//   const token = jwt.sign({ id, email }, secretKey, {
//     expiresIn: "8h",
//   });
//   return token;
// };
// export const generateRefreshToken = (id, email) => {
//   const token = jwt.sign({ id, email }, secretKey, {
//     expiresIn: "30d",
//   });
//   return token;
// };

// export const generateUserLoginToken = (id, email) => {
//   const token = jwt.sign({ id, email }, secretKey, {
//     expiresIn: "8h",
//   });
//   return token;
// };

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("token", token);
  if (!token) {
    return res.status(201).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded", decoded);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

// export const generateAppToken = (vendorId, vendorObjId, permissions) => {
//   const payload = {
//     vendorId,
//     vendorObjId,
//     permissions,
//   };
//   const token = jwt.sign(payload, secretKey);
//   return token;
// };

// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token) {
//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.send({
//           success: false,
//           message: "Invalid token",
//         });
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.send({
//       success: false,
//       message: "No token provided",
//     });
//   }
// };

// export const generateVendorApiToken = (vendorId) => {
//   return jwt.sign({ vendorId }, secretKey, { expiresIn: "1d" });
// };

// export const verifyApiTokenAndLimit = async (req, res, next) => {
//   const token = req.header("X-Mock-Api-Token"); // Token passed in header
//   const apiType = req.apiType; // API type to track hits

//   if (!token) return res.status(403).json({ error: "Access denied" });

//   try {
//     // Verify the token
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({ email: verified.email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Check overall API hit limit
//     if (user.currentHits >= user.apiHitLimit) {
//       return res.status(403).json({ error: "Total API hit limit reached" });
//     }

//     // Initialize the API hit count if not present
//     if (!user.apiHits[apiType]) {
//       user.apiHits[apiType] = 0; // Set initial hit count to 0
//     }

//     // Check if the user has exceeded the hit limit for the specific API type
//     if (user.apiHits[apiType] >= user.apiHitLimit) {
//       return res
//         .status(403)
//         .json({ error: `API hit limit reached for ${apiType}` });
//     }

//     // Increment the overall hit count and the API-specific hit count
//     user.currentHits += 1;
//     user.apiHits[apiType] += 1;

//     // Explicitly mark `apiHits` as modified so Mongoose saves the changes
//     user.markModified("apiHits");

//     // Save the updated user data
//     await user.save();

//     // Attach user info to request object for further processing
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// export const setApiType = (apiType) => {
//   return (req, res, next) => {
//     req.apiType = apiType;
//     next();
//   };
// };

// export const masterAuthenticater = async (req, res, next) => {
//   try {
//     const UserId = new mongoose.Types.ObjectId(req.user.id);
//     const user = await User.findOne({ _id: UserId });

//     if (user && user.userType === "master") {
//       console.log("Master authenticated");
//       next();
//     } else {
//       return res.status(404).json({ message: "Master not authenticated" });
//     }
//   } catch (error) {
//     console.error("Error during authentication:", error);
//     res.status(401).json({ error: "Invalid User" });
//   }
// };
