import { Router } from 'express';
import * as teacherRequestController from '../controllers/teacherRequestsController';

const teacherRequestRouter = Router();

teacherRequestRouter.post("/sendRequest", teacherRequestController.sendRequest);
teacherRequestRouter.get("/pendingRequests", teacherRequestController.seePendingRequests);
teacherRequestRouter.put("/approveRequest/:requestId", teacherRequestController.approveRequest);
teacherRequestRouter.delete("/rejectRequest/:requestId", teacherRequestController.rejectRequest);

export default teacherRequestRouter;