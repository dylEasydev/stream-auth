import sequelizeConnect from '../config';
import { UserTemp} from '../../db';
import { UserTempServiceInterface } from './interface';
import { Op } from 'sequelize';
import codeVerifService from './codeVerif.service';
import { UserBaseInterface, UserTempInterface } from '../interface';

class UserTempService implements UserTempServiceInterface{

    saveUser(user: UserTempInterface){
        return new Promise<UserBaseInterface>((resolve, reject) => {
            user.savePerm().then(userPerm=>{
                user.destroy({force:true}).catch(error=>reject(error));
                resolve(userPerm);
            }).catch(error=>{
                reject(error);
            })
        })
    }

    findUserById(id: number){
        return new Promise<UserTemp|null>(async(resolve, reject) => {
            try {
                const userFind = await sequelizeConnect.transaction(async t=>{
                    return await UserTemp.findByPk(id,{
                        attributes:{
                            include:[
                                [
                                    sequelizeConnect.literal(
                                        sequelizeConnect.getDialect()!=='postgres'?
                                        `(
                                        SELECT codeverif FROM codeVerif as code
                                        WHERE 
                                            code.foreignId = UserTemp.id
                                            AND
                                            code.nameTable = "userTemp"
                                        LIMIT 1
                                    )`:  `(
                                        SELECT "codeverif" FROM "codeVerif"
                                        WHERE 
                                            "foreignId" = "UserTemp"."id"
                                            AND
                                            "nameTable" = 'userTemp'
                                        LIMIT 1
                                    )`),`codeVerif`
                                ]
                            ]
                        }
                    });
                });
                resolve(userFind);                
            } catch (error) {
                reject(error);
            }
        })
    }

    findUserByName(userName?: string, mail?:string){
        return new Promise<UserTemp|null>(async(resolve, reject) => {
            try {
                const name = userName? userName:' ';
                const email = mail? mail:' ';
                const userFind = await sequelizeConnect.transaction(async t=>{
                    return await UserTemp.findOne({
                        where:{
                            [Op.or]:{
                                userName:name,
                                addressMail:email
                            } 
                        },
                        attributes:{
                            include:[
                                [
                                    sequelizeConnect.literal(
                                        sequelizeConnect.getDialect()!=='postgres'?
                                        `(
                                        SELECT codeverif FROM codeVerif as code
                                        WHERE 
                                            code.foreignId = UserTemp.id
                                            AND
                                            code.nameTable = "userTemp"
                                        LIMIT 1
                                    )`:  `(
                                        SELECT "codeverif" FROM "codeVerif"
                                        WHERE 
                                            "foreignId" = "UserTemp"."id"
                                            AND
                                            "nameTable" = 'userTemp'
                                        LIMIT 1
                                    )`),`codeVerif`
                                ]
                            ]
                        }
                    });
                });
                resolve(userFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    createUser<T extends { 
        userName: string; adressMail: string; password: string; 
    }>(user: T){
        return new Promise<UserTemp>(async(resolve, reject) => {
            try {
                const userFind = await this.findUserByName(user.userName,user.adressMail);
                if(userFind !== null){
                    const userUpdate = await sequelizeConnect.transaction(async t=>{
                        return await userFind.update({
                            userName:user.userName,
                            addressMail:user.adressMail,
                            password:user.password
                        })
                    })
                    userUpdate.set('codeVerif',userFind.get('codeVerif'));
                    await codeVerifService.updateCodeVerif(userUpdate);
                    resolve(userUpdate)   ;
                }else{
                    const userTemp = await sequelizeConnect.transaction(async t=>{
                        return await UserTemp.create({
                            userName:user.userName,
                            addressMail:user.adressMail,
                            password:user.password
                        });
                    });
                    resolve(userTemp);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new UserTempService();