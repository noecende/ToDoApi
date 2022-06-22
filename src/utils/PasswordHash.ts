import bcrypt from 'bcrypt'
export async function hashPassword(password: string) {
    let salt = await bcrypt.genSalt(6)
    return await bcrypt.hash(password, salt)
}