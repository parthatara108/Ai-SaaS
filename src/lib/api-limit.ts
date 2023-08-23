import { auth } from "@clerk/nextjs";
import { connectToDB } from "./db";
import { MAX_FREE_COUNTS } from "./constants";
import Limit from "./model/apilimit.model";

export const increaseApiLimit = async () => {
  connectToDB();
  const { userId } = auth();

  if (!userId) return;

  const userApiLimit = await Limit.findOne({ userId: userId });

  if (userApiLimit) {
    await Limit.findOneAndUpdate(
      { userId: userId },
      { $set: { count: userApiLimit.count + 1 } },
      { new: true }
    );
  } else {
    await Limit.create({
      userId: userId,
      count: 1,
    });
  }
};

export const checkApiLimit = async () => {
  connectToDB();
  const { userId } = auth();

  if (!userId) return false;

  const userApiLimit = await Limit.findOne({ userId: userId });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  connectToDB();

  const { userId } = auth();
  if (!userId) return 0;

  const apiLimitCount = await Limit.findOne({
    userId: userId,
  });

  if (!apiLimitCount) return 0;

  return apiLimitCount.count;
};
