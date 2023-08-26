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
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    if (!isPro) await increaseApiLimit();

    const insertedResponse: any = await Response.create({
      responseMessage: response?.audio,
    });

    await Message.create({
      userId: userId,
      question: prompt,
      toolName: "Music",
      response: insertedResponse._id,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log("Music error: ", error);
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
      $and: [{ userId: userId }, { toolName: "Music" }],
    }).populate("response");

    return NextResponse.json(response);
  } catch (error) {
    console.log("conversation error: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
