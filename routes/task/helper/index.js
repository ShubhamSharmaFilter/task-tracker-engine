import Ticket from "../model/index.js";

export const generateTicketId = async () => {
  const tenant = await Ticket.findOne().sort({ id: -1 });

  if (tenant) {
    return parseInt(tenant?.id) + 1;
  }
  return 100001;
};
