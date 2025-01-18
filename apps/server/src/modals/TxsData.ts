import mongoose, { Document, Schema } from 'mongoose'
import { RawData } from '../utils/rawTx'

export interface ITxsData extends Document {
  address: string
  txs: Array<RawData>
  roi: number
  timestamp: Date
}

const txsData: Schema = new Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
  txs: {
    type: Array<RawData>,
  },
  roi: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const TxsData = mongoose.model<ITxsData>('TxsData', txsData)

export default TxsData
