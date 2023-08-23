import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    stripeCustomerId: {
      type: String,
      unique: true,
      map: { name: "stripe_customer_id" },
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      map: { name: "stripe_subscription_id" },
    },
    stripePriceId: {
      type: String,
      map: { name: "stripe_price_id" },
    },
    stripeCurrentPeriodEnd: {
      type: Date,
      map: { name: "stripe_current_period_end" },
    },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
