import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (plainPassword: string): Promise<{hash:string, salt: string}> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err: any, salt) =>{
            if(err) reject(new Error('Salt not generated'));
    
            bcrypt.hash(plainPassword, salt, (err: any, hash) => {
                if(err) reject(new Error('Password not hashed'));
                resolve({hash, salt});
            })
        })

    })
    
}

export const compareHash = (plainPassword: string, storedPassword: string) => {
    return new Promise<boolean>((resolve, reject) =>{
        bcrypt.compare(plainPassword, storedPassword, (err: any, result) =>{
            if(err) reject(new Error('Password not match'));
            if(result) resolve(true);
        })
    })
}