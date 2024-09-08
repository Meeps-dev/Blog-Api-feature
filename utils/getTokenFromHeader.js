// const getTokenFromHeader = (req) => {
//   //get token from header

//   const headerObj = req.headers;

//   const token = headerObj["authorization"].split(" ")[1];

//   if (token !== undefined) {
//     return token;
//   } else {
//     return false;
//   }
// };

const getTokenFromHeader = (req) => {
  // Get token from header
  const headerObj = req.headers;

  // Check if the authorization header exists and is a string
  if (
    headerObj["authorization"] &&
    typeof headerObj["authorization"] === "string"
  ) {
    const parts = headerObj["authorization"].split(" ");

    // Check if the header is in the expected "Bearer <token>" format
    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];

      // Check if the token is defined and not an empty string
      if (token) {
        return token;
      }
    }
  }

  // Return false if the token is not found or the header is malformed
  return false;
};

module.exports = getTokenFromHeader;
