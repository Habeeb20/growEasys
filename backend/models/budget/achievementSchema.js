import mongoose from "mongoose";


const AchievementSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  earnedAt: { type: Date, default: Date.now },
});


export default mongoose.model('Achievement', AchievementSchema);