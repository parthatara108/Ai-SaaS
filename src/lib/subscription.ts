import { auth } from "@clerk/nextjs";
import { connectToDB } from "./db";
import Subscription from "./model/UserSubscription.model";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  connectToDB();
  const { userId } = auth();

  if (!userId) return false;

  const userSubscription = await Subscription.findOne({
    userId: userId,
  });

  if (!userSubscription) return false;

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
