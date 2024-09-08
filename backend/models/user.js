import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  stopPoints: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "₪",
  },
  profilePicture: {
    type: String,
    required: true,
  },
  coupons: [
    {
      code: {
        type: String,
        default: "",
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
  ],
  LoginActivity: [
    {
      type: Date,
      default: "",
    },
  ],
  LogoutActivity: [
    {
      type: Date,
      default: "",
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      default: "",
    },
  ],
  CartActivity: [
    {
      type: Date,
      default: "",
    },
  ],
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("User", userSchema);
