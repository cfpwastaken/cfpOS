function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.start = async (status, finish, error) => {
  await sleep(500);
  error();
}

module.exports.icon = "https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png";
module.exports.name = "About";