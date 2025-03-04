# Service d'authentification oauth2 de stream-cam

## Description  du projet
Dans l'optique de mettre sur pied une architecture **micro-service** , nous avons décidé
de réaliser la partie backend du site en plusieur service à realisation indépendante .

Le choix d'un serveur d'authentification **Oauth2** est dû à sa facilitée d'utilisation 
dans une architecture micro-service. Il permet à des clients (***dans notre cas d'autres services***) d'avoir des jeton **jwt** (json web token) , donnant accès au end-point securisé d'autres services.

Si vous voulez appronfondir sur le sujet des serveur Oauth2 veuillez vous reférez [ici](https://www.oauth.net).

## objectif du projet
L'objectif principale du projet est de mettre sur pied , une **API REST** , avec des end-point pour la création de compte utilisateur et administrateur.

D'un autre côté d'implementer les octroi **password** , **refresh_token** et **authorization_code** d'un serveur Oauth2 .

Celà étant dit beaucoup d'autres options s'ajoutent comme la generation d'un code de verification , pour valider l'adresse fourni par l'utilisateur.

Il est aussi question pour nous de populariser l'architecture **orienté objets** lors de
l'implementation d'une **API REST**.


## Prérequis
Avant de se lancer à coeur joie vers le demarage de se projet rassurez vous d'avoir:

**Node js** et **npm** installer sur votre ordinateur lien du site [ici](node.org).

**PostgreSQL** installer sur votre ordinateur [ici](postgres.org)

**git** installer sur votre ordinateur [ici](git.org)

**openssl** installer sur votre ordinateur [ici](openssl.org)

**ffmpeg** installer sur votre ordinateur [ici](ffmpe.org)

## Installation 

pour commencer effectuer un pull du depôt
>[!NOTE]
>Commande au niveau du terminale
>```
>  $ mkdir stream_camer
>   $ cd ./stream_camer
>   $ git init
>   $ git remote add origin git@github.com:dylEasydev/Streamserver.git
>   $ git branch -M main
>   $ git pull -u origin main
>```
vous pouvez effectuer un **clone** ou un **fork** à votre choix .

Installer les dependances  `npm install`

## configuration

Créer un fichier `.env` à la racine du projet puis copiez le code si dessous à l'interieur .

```js

PORT = 3000 // port du serveur 3000 c'est juste ma préferences .
DB_NAME = //nom de la base de donnée d'authentification 
DB_HOST = localhost // hôte de la base de donnée 
DB_DRIVER = //postgres , mysql ,...
DB_PASSWORD = //mots de passe de l'utilisateur(administrateur) de la BD
DB_USER = //nom de l'utilisateur de la BD
NODE_ENV = developemnent 
HOSTNAME = 127.0.0.1 //loclahost ou n'import qu'elle Ip disponible 
COMPANING_MAIl = //Email charger d'envoyer les message au utilisateur 
PASSWORD_MAIL= //password de cette Email 
PRIVATE_KEY = //clés privée pour chiffré les jetons d'accès 
ADMIN_NAME = //nom de l'admin de base
ADMIN_PASS = // mots de passe de l'admin

```

Généré les clés pour securisé le serveur HTTP/2 . Vous auriez besionde [openssl]() .
>[!NOTE]
>avec un serveur HTTP/2 vous avez l'avantages du multiplexage , compression de l'en-tête
>et l'option de push . Si votre navigateur ou client ne supporte pas le protocole HTTP/2
>le serveur repasse à un serveur HTTP/1.1 classic

```
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365  -in server.csr -signkey server.key -out server.crt
```

j'ai rencontré quelques soucis avec le fichier de declartion de types de 
la dépendances `@node-oauth/express-oauth-server` j'ai dù le modifier .
le chemin d'accès de ce fichier est : 
> `node_modules/@node-oauth/oauth2-server/index.d.ts`

réferences [ici](/config.md) pour le fichier modifier .
copiez juste ce fichier et remplacer le contenu du fichier **`node_modules/@node-oauth/oauth2-server/index.d.ts`** par celui copier .

## demarage du serveur
ouvrez le terminal et lancez la commande `npm run dev` .

pour les adepte de javascript vous pouvez compiler grâce à la commande `npm build`.
Puis lancer le serveur avec la commande `node -r dotenv/config ./dist/index.js`

## exemple d'utilisation
c'est une façon simple de faire  la création d'un étuiant .

retournez à la doc pour consulter le corps et le format de la reponse .

```js
import axios from 'axios';
const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000
});
const newStudent = axiosRequest.post('/sign/student').then((response)=>{
    return response.data;
})
```
## Documentation
la documentation est à l'adresse ``https://127.0.0.1:${process.env.PORT}/docs`` .
son fichier html [ici](/docs/index.html) à enrichir si vous voulez bien . 

## collaborateur
