import { compare, hash } from 'bcrypt-nodejs'

export async function checkPassword(password: string, hashed: string): Promise<boolean> {
  return new Promise((res, rej) =>
    compare(password, hashed, (err, result) => {
      if (err) rej(err)
      else res(result)
    })
  )
}

export async function hashPassword(password: string): Promise<string> {
  return new Promise((res, rej) =>
    hash(password, null, null, (err, result) => {
      if (err) rej(err)
      else res(result)
    })
  )
}
