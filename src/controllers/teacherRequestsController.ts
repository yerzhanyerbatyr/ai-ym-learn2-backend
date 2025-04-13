import {
    sendRequestService,
    getPendingRequestsService,
    approveRequestService,
    rejectRequestService,
  } from "../services/teacherRequestsService";
  
  export const sendRequest = async (req, res) => {
    try {
      const request = await sendRequestService(req.body);
      res.status(200).json(request);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
  };
  
  export const seePendingRequests = async (req, res) => {
    try {
      const requests = await getPendingRequestsService();
      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
  };
  
  export const approveRequest = async (req, res) => {
    try {
      const request = await approveRequestService(req.params.requestId);
      res.status(200).json({ message: "Request approved", request });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
  };
  
  export const rejectRequest = async (req, res) => {
    try {
      await rejectRequestService(req.params.requestId);
      res.status(200).json({ message: "Request rejected" });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
  };
  