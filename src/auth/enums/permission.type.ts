import { ProfileValue } from 'src/common/utils/Enum';

let AccessProfile = {
  ADMIN: ProfileValue.ADMIN_VALUE,
  CLIENT: ProfileValue.CLIENT_VALUE,
  EMPLOYEE: ProfileValue.EMPLOYEE_VALUE,

  ADMIN_CLIENT: [ProfileValue.ADMIN_VALUE, ProfileValue.CLIENT_VALUE],
  CLIENT_EMPLOYEE: [ProfileValue.CLIENT_VALUE, ProfileValue.EMPLOYEE_VALUE],
  ADMIN_CLIENT_EMPLOYEE: [
    ProfileValue.ADMIN_VALUE,
    ProfileValue.CLIENT_VALUE,
    ProfileValue.EMPLOYEE_VALUE,
  ],
  ADMIN_EMPLOYEE: [ProfileValue.ADMIN_VALUE, ProfileValue.EMPLOYEE_VALUE],
  ADMIN_EMPLOYEE_ATTENDANT: [
    ProfileValue.ADMIN_VALUE,
    ProfileValue.EMPLOYEE_VALUE,
  ],
  ALL: [
    ProfileValue.ADMIN_VALUE,
    ProfileValue.CLIENT_VALUE,
    ProfileValue.EMPLOYEE_VALUE,
  ],
};
export default AccessProfile;
