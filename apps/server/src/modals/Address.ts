import mongoose, { Document, Schema } from 'mongoose'

export interface IAddress extends Document {
  address: string
  sig: string
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
})

const Address = mongoose.model<IAddress>('Address', addressSchema)

export default Address
