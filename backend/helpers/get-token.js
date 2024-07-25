// get token from headers
const getToken = (req) => {
    const authHeader = req.headers["authorization"];
    // when have " " (a space) make a array
    const token = authHeader && authHeader.split(" ")[1];
  
    return token;
  };
  
  module.exports = getToken;