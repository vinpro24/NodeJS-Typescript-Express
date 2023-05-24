import mongoose, { Document, Schema } from 'mongoose'

export interface IRefreshToken {
    userId: string
    token: string
}

export interface IRefreshTokenModel extends IRefreshToken, Document {}

const RefreshTokenSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        token: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model<IRefreshTokenModel>('RefreshToken', RefreshTokenSchema)
