import express from 'express';
import dotenv from 'dotenv';
import nodeRouter from './routers/node.router.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(nodeRouter);

app.listen(port, () => {
  console.log(`> Server listening in port ${port}`);
});