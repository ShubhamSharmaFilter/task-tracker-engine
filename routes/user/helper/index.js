import User from "../model/index.js";

export const generateUserId = async () => {
  const user = await User.findOne().sort({ id: -1 });

  if (user) {
    return parseInt(user?.id) + 1;
  }
  return 1000001;
};