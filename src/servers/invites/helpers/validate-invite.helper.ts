import { Invite } from '../schemas/invite.schema';

export const validateInvite = (invite: Invite | null) => {
  if (!invite) {
    return false;
  }

  if (invite.maxAge === 0) {
    return true;
  }

  const createdDate = new Date(invite.createdAt).getTime();

  return invite.maxAge + createdDate >= Date.now();
};
