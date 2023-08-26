import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    responseMessage: { type: String, required: true },
  },
  { timestamps: true }
);

const Response =
  mongoose.models.Response || mongoose.model("Response", responseSchema);
export default Response;
