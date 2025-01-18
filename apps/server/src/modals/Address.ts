import mongoose, { Document, Schema } from 'mongoose'

export interface IAddress extends Document {
  address: string
  timestamp: Date
}

const addressSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
  },
  sig: {
    type: String,
    unique: true,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const Address = mongoose.model<IAddress>('Address', addressSchema)

export default Address
