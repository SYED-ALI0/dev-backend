require("dotenv").config();
const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use("/stripe", express.raw({ type: "/" }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Node backend Api");
});

app.post("/create-payment-intent", async (req, res) => {
    try {
        // Getting data from client
        let { amount, userName } = req.body;
        // Simple validation
        if (!amount || !userName)
            return res.status(400).json({ message: "All fields are required" });
        amount = parseInt(amount);
        // Initiate payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "USD",
            payment_method_types: ["card"],
            metadata: { name: userName },
        });
        // Extracting the client secret 
        const clientSecret = paymentIntent.client_secret;
        // Sending the client secret as response
        res.json({ message: "Payment initiated", clientSecret });
    } catch (err) {
        // Catch any error and send error 500 to client
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
});
app.listen(PORT, () => console.log(Server running on port ${PORT}));