import { config } from '../constants'
import KeyToken from '../models/KeyToken'
import JWT from 'jsonwebtoken'

interface ICreateTokenPair {
    accessToken: string
    refreshToken: string
}

interface ICreateKeyToken {
    user: string
    privateKey: string
    publicKey: string
    refreshToken: string
}

class KeyTokenService {
    static createKeyToken = async ({ user, publicKey, privateKey, refreshToken }: ICreateKeyToken) => {
        try {
            const token = await KeyToken.create({
                user,
                publicKey,
                privateKey,
                refreshToken
            })
            return token ? token.publicKey : null
        } catch (error) {
            return error
        }
    }

    static createTokensPair = async (payload: any, privateKey: string): Promise<ICreateTokenPair> => {
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: config.accessTokenExpiresIn
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: config.refreshTokenExpiresIn
        })
        // JWT.verify(accessToken, publicKey, (err, decode) => {
        //     if (err) {
        //         console.error(`error verify::`, err)
        //     } else {
        //         console.log(`decode verify::`, decode)
        //     }
        // })
        return { accessToken, refreshToken }
    }
}

export default KeyTokenService
