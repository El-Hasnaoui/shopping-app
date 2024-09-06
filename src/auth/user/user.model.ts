import mongoose from "mongoose";
import {
  AuthentificationService,
  userDoc,
  userModel,
} from "@shopp-app-hsn/common";
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

schema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = await AuthentificationService.pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPwd);
  }
  done();
});

export const User = mongoose.model<userDoc, userModel>("User", schema);
