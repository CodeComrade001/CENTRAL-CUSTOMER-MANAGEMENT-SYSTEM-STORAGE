import express, { Request, Response } from 'express';

const app = express();
const port = 3300;
const message = "thsi is suppose to show in terminal";
console.log("Turbo Log  ~ message:", message);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript! and nodemon test');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});