import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { auth } from "@clerk/nextjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import Message from "@/lib/model/Message.model";
import Response from "@/lib/model/Response.model";
import { connectToDB } from "@/lib/db";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new NextResponse("Free Trail Expired", { status: 403 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    if (!isPro) await increaseApiLimit();

    const insertedResponse = await Response.create({
      responseMessage: response.data.choices[0].message?.content,
    });

    await Message.create({
      userId: userId,
      question: messages[0].content,
      toolName: "Conversation",
      response: insertedResponse._id,
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("conversation error: ", error);
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
      $and: [{ userId: userId }, { toolName: "Conversation" }],
    }).populate("response");

    return NextResponse.json(response);
  } catch (error) {
    console.log("conversation error: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
