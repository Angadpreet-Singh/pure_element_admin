import bcrypt from 'bcrypt';
import logger from '../config/winston';

class PasswordHashing{
    
    hash(password){
        return new Promise(( resolve, reject )=>{
            this.generateSalt(async function(err, salt){
                    if(err){
                     logger.log(err.message)
                     reject(err.message)
                    } else {
                        try {
                            let hashPassword = await bcrypt.hash(password, salt);
                            resolve(hashPassword)
                        } catch (error) {
                            logger.log(error.message)
                            reject(error.message)
                        }
                }
            });
        })
    }

    generateSalt = function(callback){
        // do not change the salt, it should always be 10
        bcrypt.genSalt(10, callback);
    }

    comparePassword = function(password, dbpassword, callback = undefined){
        return bcrypt.compare(password, dbpassword, callback);
     }
}

export default new PasswordHashing();