import mongoose, { Schema, models } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    socials: {
  type: [
    {
      platform: String,
      url: String,
      icon: String,
    }
  ],
  default: [],
},

  },
  { timestamps: true }
);

const TeamModel = models.TeamModel || mongoose.model("TeamModel", teamSchema);
export default TeamModel;
