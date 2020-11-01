const IssuedBook = require("./component/bookIssued.model");

module.exports = async () => {
  let now = new Date();
  // let startOfToday = `${new Date(
  //   now.getFullYear(),
  //   now.getMonth(),
  //   now.getDate()
  // ).toISOString()}.000+00.00`;
  // let endOfToday = `${new Date(
  //   now.getFullYear(),
  //   now.getMonth(),
  //   now.getDate() + 1
  // ).toISOString()}.000+00.00`;

  let startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    1,
    0,
    0
  );

  let endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    59,
    59
  );

  console.log(startOfToday);
  const res = await IssuedBook.find({
    createdAt: { $gte: startOfToday, $lt: endOfToday },
  });
  let emails = [];
  for (let { email } of res) {
    emails.push(email);
  }
  //   const res = await IssuedBook.find({
  //     $where: `this.createdAt.toJSON().slice(0, 10) == ${
  //       new Date().toISOString().split("T")[0]
  //     }`,
  //   });

  console.log("results are", emails);
};
