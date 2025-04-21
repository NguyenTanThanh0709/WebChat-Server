import { Schema, model, Document } from 'mongoose';
import { IMessage } from '../interface/message.interface';

const messageSchema = new Schema<IMessage & Document>({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  is_group: { type: Boolean, required: true },
  content_type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'file', 'video', 'video_call_signal'],
  },
  timestamp: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ['sent', 'delivered', 'read'],
  },
  url_file: { type: String },
  name_file: { type: String },
  size_file: { type: Number },
  mime_type_file: { type: String },
  duration_video: { type: Number },
  text: { type: String },
  type_video_call: {
    type: String,
    enum: ['offer', 'answer', 'ice-candidate'],
  },
  sdp: { type: String },
  candidate: { type: String },
  sdpMid: { type: String },
  sdpMLineIndex: { type: Number },
});

export const MessageModel = model<IMessage & Document>('Message', messageSchema);
