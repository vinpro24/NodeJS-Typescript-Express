import mongoose, { Document, Schema } from 'mongoose'

export interface IUserProvider {
    user: string
    kind: string
    uid: string
    password: string | null
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends IUserProvider, Document {}

const UserProviderSchema: Schema = new Schema(
    {
        user: { type: String, required: true, trim: true },
        kind: { type: String, required: true, trim: true },
        uid: { type: String, required: true, trim: true },
        password: { type: String, default: null }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model<IUserModel>('UserProvider', UserProviderSchema)
