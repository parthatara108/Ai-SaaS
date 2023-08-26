import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    question: { type: String, required: true },
    toolName: { type: String, required: true },
    response: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
      required: true,
    },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
