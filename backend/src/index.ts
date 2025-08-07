import dotenv from 'dotenv';
dotenv.config();
import AppBootstrap from "./app";


const bootstrap = new AppBootstrap();
const app = bootstrap.getApp();

const port = process.env.CEN_CMS_API_PORT || 3000;
console.log("Turbo Log  ~ port:", port);
console.log("Turbo Log  ~ process.env.CEN_CMS_API_PORT:", process.env.CEN_CMS_API_PORT);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
