import { OauthController, SignController } from '../controller';
import { BaseRouter } from './base.router';

export class SignRouter extends BaseRouter<SignController>{
    public initRoute(): void {
        this.routerServeur.post('/sign/user',this.controllerService.signUser);
        this.routerServeur.post(
            '/sign/admin',
            new OauthController().serverOauth.authenticate(),
            this.controllerService.signAdmin
        );    
    }
}

export default new SignRouter(new SignController()).routerServeur;