// Log the request body
const logReqBody = (req, res, next) => {
  console.log(req.body);
  next();
}

// Generate a random pair of students
const randomPair = (req, res, next, students) => {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  req.pair = {
    pair: [students[s1Ind], students[s2Ind]]
  };
  next();
}

module.exports = {
  logReqBody,
  randomPair
}