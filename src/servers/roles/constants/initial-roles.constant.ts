import { Permission } from '../enums/permission.enum';
import { RestrictedRolesName } from '../enums/restricted-roles-name.enum';

const ADMIN_ROLE = {
  name: RestrictedRolesName.ADMIN,
  color: '#FFD700',
  importance: 1001,
  permissions: [
    Permission.SEND_MESSAGES,
    Permission.DELETE_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.SEND_ATTACHMENTS,

    Permission.VIEW_CHANNELS,
    Permission.MANAGE_CHANNELS,
  ],
};

const DEFAULT_ROLE = {
  name: RestrictedRolesName.DEFAULT,
  color: '#808080',
  importance: 0,
  permissions: [
    Permission.VIEW_CHANNELS,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.SEND_ATTACHMENTS,
  ],
};

export const INITIAL_ROLES = [ADMIN_ROLE, DEFAULT_ROLE];
