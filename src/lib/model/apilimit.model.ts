import mongoose from "mongoose";

const limitSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Limit =
  mongoose.models.ApiLimit || mongoose.model("ApiLimit", limitSchema);
export default Limit;
