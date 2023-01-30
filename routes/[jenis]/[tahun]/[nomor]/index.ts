import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: (req, _ctx) => {
    return Response.redirect(req.url + "/info", 307);
  },
};
