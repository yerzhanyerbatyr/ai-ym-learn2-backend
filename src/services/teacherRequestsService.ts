import TeacherAttributes from "../models/teacherAttributesModel";
import User from "../models/userModel";

export const sendRequestService = async ({ userId, motivation, coursePlan, certificates, cv, teachingExperience, signingDuration, signingDurationDescription }) => {
  const user = await User.findOne({ userId: userId });
  if (!user || user.role !== 'student') {
    throw new Error("Only students can send teacher requests.");
  }

  const previousRequests = await TeacherAttributes.find({ userId });

  const hasPending = previousRequests.some(req => req.status === 'pending');
  const isAlreadyTeacher = user.role === 'teacher' || previousRequests.some(req => req.status === 'approved');

  if (hasPending) {
    throw new Error("Request already pending.");
  }

  if (isAlreadyTeacher) {
    throw new Error("Already a teacher.");
  }

  const newRequest = await TeacherAttributes.create({
    userId,
    motivation,
    coursePlan,
    certificates,
    coursesToCreate: [],
    cv,
    teachingExperience,
    signingDuration,
    signingDurationDescription,
    status: 'pending',
  });

  return newRequest;
};

export const getPendingRequestsService = async () => {
  return TeacherAttributes.find({ status: 'pending' }).populate("userId");
};

export const approveRequestService = async (requestId) => {
  const request = await TeacherAttributes.findById(requestId);
  if (!request || request.status !== 'pending') {
    throw new Error("Request not found or already processed.");
  }

  const user = await User.findOne({userId: request.userId});
  if (!user) throw new Error("User not found.");

  user.role = 'teacher';
  await user.save();

  request.status = 'approved';
  await request.save();

  return request;
};

export const rejectRequestService = async (requestId) => {
  const request = await TeacherAttributes.findById(requestId);
  if (!request || request.status !== 'pending') {
    throw new Error("Request not found or already processed.");
  }

  request.status = 'rejected';
  await request.save();
  return true;
};
