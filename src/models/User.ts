import mongoose, { Document, Schema } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IUser {
    name: string | null
    avatar: string | null
    birthday: string | null
    gender: string | null
    phone: string | null
    email: string | null
    password: string | null
    nationalId: string | null
    role: string | null
    status: string | null
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        id: { type: String, default: () => nanoid(6) },
        name: { type: String, required: true, trim: true },
        avatar: { type: String, required: true, trim: true },
        birthday: { type: Date, default: null },
        gender: { type: String, default: 'male' },
        phone: { type: String, default: null },
        email: { type: String, default: null, trim: true },
        password: { type: String, default: null, trim: true },
        nationalId: { type: String, default: null, trim: true },
        role: {
            type: String,
            enum: ['employer', 'admin', 'manager'],
            default: 'employer'
        },
        status: { type: String, default: 'active', enum: ['active', 'inactive'] }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

UserSchema.index({ name: 'text', email: 'text', phone: 'text' })

export default mongoose.model<IUserModel>('User', UserSchema)
