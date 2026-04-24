// const app = require("./app");
// const { port } = require("./config/env");
// app.listen(port, "0.0.0.0", () =>
//   console.log(`API running on http://localhost:${port}`),
// );


const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});