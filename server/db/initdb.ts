import {
    User , CodeVerif , Client , Token,
    AuthPermission , AuthorizationCode,
    Image,Scope , Role ,InfoClient ,UserTemp
} from '../db';
import sequelizeConnect from './config';
import { scopeApp } from './hooks';
import { userService } from './service';

async function initData(){
    return new Promise<void>(async (resolve, reject) => {
        try {
            await sequelizeConnect.transaction(async t=>{
                await Promise.all((await scopeApp).map(async s=>{
                    await Scope.findOrCreate({
                        where:{scopeName:s.scopeName},
                        defaults:{
                            scopeDescript:s.scopeDescript,
                            scopeName:s.scopeName
                        },
                        transaction:t
                    })
                }))
            })
            let adminFind= await User.findOne({where:{userName:process.env.ADMIN_NAME as string}});
            if(adminFind === null){
                adminFind= await userService.createUser({
                    userName:process.env.ADMIN_NAME as string,
                    adressMail:process.env.COMPANING_MAIl as string,
                    password:process.env. ADMIN_PASS as string
                });
            }
            await Client.findOrCreate({
                where:{clientId:"16639376"},
                defaults:{
                    clientId:"16639376",
                    clientSecret:"gheiqhekdlendhevjleh56783",
                    userId:adminFind.id,
                    grants:[
                        'authorization_code',
                        'client_credentials', 
                        'password',
                        'refresh_token'
                    ],
                    redirectUris:[`https://127.0.0.1:3000/docs`]
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export function initDb(){
    return new Promise<void>(async(resolve, reject) => {
        const test = process.env.NODE_ENV === 'developemnent';
        try {
            await sequelizeConnect.authenticate();
            await User.sync({alter:test});
            await CodeVerif.sync({alter:test});
            await Client.sync({alter:test});
            await Token.sync({alter:test});
            await Role.sync({alter:test});
            await Scope.sync({alter:test});
            await AuthPermission.sync({alter:test});
            await AuthorizationCode.sync({alter:test});
            await Image.sync({alter:test});
            await UserTemp.sync({alter:test});
            await InfoClient.sync({alter:test});
            await initData();
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}
