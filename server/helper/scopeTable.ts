import readScope from './readScope';

export class TableScope{
    /**definition de clé pour la reconnaissance typescript */
    static [key:string]:(
        ()=>Promise<string[]>
    )|any

    /** methodes static de lectures des permissions des administrateur */
    static admin = async()=>{
        try {
            return (await readScope.readScopeApp('scopeAdmin')).map(data=>{
                return data.scopeName;
            });
        } catch (error) {
            Promise.reject(error);
        }
    } 

    /** mathodes static de lectures des permissions des étudiants */
    static user =async()=>{
        try {
            return (await readScope.readScopeApp('scopeUser')).map(data=>{
                return data.scopeName;
            });
        } catch (error) {
            Promise.reject(error);
        }
    } 
}