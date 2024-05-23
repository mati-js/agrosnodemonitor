import { Router } from "express";
import { fetchNodeStatus } from '../controllers/node.controller.js';

const nodeRouter = Router();

nodeRouter.get('/status', fetchNodeStatus);

export default nodeRouter;