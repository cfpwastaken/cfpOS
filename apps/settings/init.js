function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.start = async (status, finish, error) => {
  // status("Please wait");
  // await sleep(2000);
  // status("Just one moment");
  // await sleep(2000);
  status("Pretending like im doing something...");
  await sleep(1000);
  finish();
}

module.exports.icon = "https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png";
module.exports.name = "Settings";