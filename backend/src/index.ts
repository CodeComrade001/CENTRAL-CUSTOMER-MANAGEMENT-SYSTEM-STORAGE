import AppBootstrap from "./app";
import { logger } from "./utils/logger";


const bootstrap = new AppBootstrap();
const app = bootstrap.getApp();

const PORT = Number(process.env.CEN_CMS_API_PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`API running on port ${PORT}`);
});
