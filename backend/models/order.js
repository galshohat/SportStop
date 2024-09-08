import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      product: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        image: String,
        categories: [{
          type: String,
          default: ''
        }]
      },
      quantity: { type: Number, required: true },
      size: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
        name: String,
      },
    },
  ],
  shippingAddress: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
  orderPrice: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  discount: {type: String, default: "N/A"},
  orderDate: { type: Date, default: () => new Date(Date.now() + 3 * 60 * 60 * 1000)},
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("Order", orderSchema);
