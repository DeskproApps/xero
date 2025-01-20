import { Context } from "@deskpro/app-sdk";
import { UserData } from "../types/settings";

const isUser = (context: Context|null): context is Context<UserData> => {
  return Boolean(context?.data?.user?.id);
};

export { isUser };
