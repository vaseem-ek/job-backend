import { Webhook } from "svix";
import user from "../models/user.js";

export const clerkWebhook = async (req, res) => {
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify headers
        const payload = req.body;
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        whook.verify(JSON.stringify(payload), headers); // Ensure JSON format is correct

        // Getting data from request body
        const { data, type } = payload;

        // Switch case for different event types
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                    resume: "",
                };

                await user.create(userData);
                return res.json({ success: true });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };

                await user.findByIdAndUpdate(data.id, userData, { new: true });
                return res.json({ success: true });
            }

            case "user.deleted": {
                await user.findOneAndDelete({ _id: data.id });
                return res.json({ success: true });
            }

            default:
                return res.json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(400).json({ success: false, message: "Webhook Error" });
    }
};
