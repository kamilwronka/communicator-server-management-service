import { Invite } from '../schemas/invite.schema';

export const checkIfValid = (invite: Invite | null) => {
  if (!invite) {
    return false;
  }

  if (invite.max_age === 0) {
    return true;
  }

  const createdDate = new Date(invite.createdAt).getTime();

  return invite.max_age + createdDate >= Date.now();
};
