import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReminder extends Document {
  customerId: Types.ObjectId;
  jobId: Types.ObjectId;
  dueDate: Date;
  status: "Pending" | "Sent" | "Snoozed" | "Cancelled" | "Completed";
  channel: "email";
  lastSentAt?: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Sent", "Snoozed", "Cancelled", "Completed"],
      default: "Pending",
    },
    channel: { type: String, enum: ["email"], default: "email" },
    lastSentAt: Date,
  },
  { timestamps: true }
);

export const Reminder: Model<IReminder> =
  mongoose.models.Reminder || mongoose.model<IReminder>("Reminder", ReminderSchema);
