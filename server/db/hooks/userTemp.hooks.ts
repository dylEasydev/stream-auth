import {UserTemp} from '../init';
import { CodeVerif } from '..';
import bcrypt from 'bcryptjs';
import { generateCode } from '../../helper';

UserTemp.afterValidate(userTemp =>{
    return new Promise<void>((resolve, reject) => {
        bcrypt.hash(userTemp.password , 10 ).then(passHash=>{
            userTemp.password = passHash;
            resolve();
        }).catch(error=>{
            reject(error);
        });
    });
})

UserTemp.afterCreate((userTemp , options)=>{
    return new Promise<void>((resolve, reject) => {
        const expiresAt = new Date(Date.now());
        expiresAt.setHours(expiresAt.getHours()+1);
        userTemp.createCodeVerif({
            codeverif:parseInt(generateCode.generateId(6)),
            expiresAt
        },{transaction:options.transaction,hooks:true})
        .then(code=>resolve()).catch(error=> reject(error));
    })
})

UserTemp.afterDestroy((instances,options )=>{
    return new Promise<void>((resolve, reject) => {
        CodeVerif.destroy({
            where:{
                foreignId:instances.id,
                nameTable:UserTemp.tableName
            },
            transaction:options.transaction
        }).then(()=>resolve()).catch(error => reject(error));
    })
})

export {UserTemp};