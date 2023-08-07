async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { email, fname, lname, company_name, phone } = data;

    if (!email || !email.includes("@")) {
      res.status(422).json({
        message: "please check your email",
      });
      return;
    }
    if (!fname || !lname || !company_name || !phone) {
      res.status(422).json({
        message: "missing data in one of the fields",
      });
      return;
    }

    try {
      console.log("trying to send to server");
      const registerCall = await fetch(
        `${process.env.NEXT_PUBLIC_REST}/passwordless/send-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            phone: phone,
            fname: fname,
            lname: lname,
            company_name: company_name,
            keepParams: ["company_name", "fname", "lname", "phone"],
          }),
        }
      );
      const registerResponse = await registerCall.json();
      console.log(registerResponse);
      console.log("sending to server success");
      res
        .status(201)
        .json({
          message: "Success",
          isAlreadyregisteredBefore: registerResponse.isAlreadyregisteredBefore,
        });
    } catch (error) {
      res.status(500).json(error.message);
      console.log("there was some error");
    }
  } else {
    return;
  }
}

export default handler;
