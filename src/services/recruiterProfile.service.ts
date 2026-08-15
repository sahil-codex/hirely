import {
  getRecruiterProfileByUserId,
  createRecruiterProfile,
  updateRecruiterProfile,
  RecruiterProfileData,
} from "@/repositories/recruiterProfile.repository";

type AuthUser = {
  userId: string;
  role: string;
};

function requireRecruiter(user: AuthUser) {
  if (user.role.toUpperCase() !== "RECRUITER") {
    throw new Error(
      "Only recruiters can access recruiter profiles"
    );
  }
}

export async function getRecruiterProfileService(
  user: AuthUser
) {
  requireRecruiter(user);

  return await getRecruiterProfileByUserId(
    user.userId
  );
}

export async function saveRecruiterProfileService(
  user: AuthUser,
  data: RecruiterProfileData
) {
  requireRecruiter(user);

  const existing =
    await getRecruiterProfileByUserId(
      user.userId
    );

  if (existing) {
    return await updateRecruiterProfile(
      user.userId,
      data
    );
  }

  return await createRecruiterProfile({
    userId: user.userId,
    ...data,
  });
}