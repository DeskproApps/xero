import { Context } from "@deskpro/app-sdk";
import { OrganisationData } from "../types/settings";

const isOrganisation = (context: Context|null): context is Context<OrganisationData> => {
  return Boolean(context?.data?.organisation.id);
};

export { isOrganisation };
