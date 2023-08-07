import { initClient } from "messagebird";
const messagebird = initClient(process.env.MSGBIRD_KEY);

async function handler(req, res) {
  if (req.method === "POST") {
    const { token, id } = req.body;

    messagebird.verify.verify(id, token, function (err, response) {
      if (err) {
        return res.status(404).json(err);
      }
      return res.status(200).json(response);
    });
  }
}

export default handler;
