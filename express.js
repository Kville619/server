const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { name, price } = req.body;

  const amount = price * 100; // Convert to cents

  const stripeSecretKey = "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"; // Replace with your Stripe secret key

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "success_url": "https://example.com/success", // Replace with your success URL
        "cancel_url": "https://example.com/cancel", // Replace with your cancel URL
        "payment_method_types[]": "card",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": name,
        "line_items[0][price_data][unit_amount]": amount.toString(),
        "line_items[0][quantity]": "1",
        "mode": "payment",
      }),
    });

    const data = await response.json();

    res.json({ url: data.url });
  } catch (error) {
    console.error("Error initiating Stripe Checkout:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
