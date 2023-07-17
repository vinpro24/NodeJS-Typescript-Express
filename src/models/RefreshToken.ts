import mongoose, { Document, Schema } from 'mongoose'

export interface IRefreshToken {
    userId: string
    token: string
}

export interface IRefreshTokenModel extends IRefreshToken, Document {}

const RefreshTokenSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        token: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

RefreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model<IRefreshTokenModel>('RefreshToken', RefreshTokenSchema)
