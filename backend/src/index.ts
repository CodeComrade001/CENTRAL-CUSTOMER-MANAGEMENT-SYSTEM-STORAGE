// src/index.ts
import AppBootstrap from "./app";

const bootstrap = new AppBootstrap();
const app = bootstrap.getApp();

const port = process.env.CEN_CMS_API_PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
