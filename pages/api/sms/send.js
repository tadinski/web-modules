import { initClient } from "messagebird";
const messagebird = initClient(process.env.MSGBIRD_KEY);

async function handler(req, res) {
  if (req.method === "POST") {
    const { phone } = req.body;

    const params = {
      timeout: 60,
      maxAttempts: 3,
      tokenLength: 6,
      type: "sms",
    };

    messagebird.verify.create(phone, params, function (err, response) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json(response);
    });
  }
}

export default handler;
