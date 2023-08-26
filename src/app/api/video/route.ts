import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { connectToDB } from "@/lib/db";
import Message from "@/lib/model/Message.model";
import Response from "@/lib/model/Response.model";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new NextResponse("Free Trail Expired", { status: 403 });
    }

    const response: any = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
        },
      }
    );

    if (!isPro) await increaseApiLimit();

    const insertedResponse: any = await Response.create({
      responseMessage: response[0],
    });

    await Message.create({
      userId: userId,
      question: prompt,
      toolName: "Video",
      response: insertedResponse._id,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log("Video error: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await Message.find({
      $and: [{ userId: userId }, { toolName: "Video" }],
    }).populate("response");

    return NextResponse.json(response);
  } catch (error) {
    console.log("conversation error: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
