import auth0 from 'auth0-js'


class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: "sirk.auth0.com",
            audience: 'https://sirk.auth0.com/userinfo',
            clientID: '2Lq20Gd0FgASA4LwjWFPS74AYBqmcvJL',
            redirectUri: 'http://localhost:3000/callback',
            responseType: 'token id_token',
            scope: 'openid profile'
        })
        // this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
     
    }
    getProfile() {
        return this.profile
    }
    getIdToken() {
        return this.idToken;
      }
    
      isAuthenticated() {
        return new Date().getTime() < this.expiresAt;
      }
    
      signIn() {
        this.auth0.authorize();
      }
    
      handleAuthentication() {
        return new Promise((resolve, reject) => {
          this.auth0.parseHash((err, authResult) => {
            if (err) return reject(err);
            if (!authResult || !authResult.idToken) {
              return reject(err);
            }
            this.setSession(authResult)
            resolve();
          });
        })
      }

      setSession(authResult) {
        this.idToken = authResult.idToken;
        console.log('this.idToken', this.idToken);
        this.profile = authResult.idTokenPayload;
        console.log('this.profile', this.profile);
        this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
            
      }
    
      signOut() {
        this.auth0.logout({
          returnTo: 'http://localhost:3000',
          clientID: '2Lq20Gd0FgASA4LwjWFPS74AYBqmcvJL'
        })
        // clear id token, profile, and expiration
        // this.idToken = null;
        // this.profile = null;
        // this.expiresAt = null;
      }

      silentAuth() {
        return new Promise (( resolve, reject) => {
          this.auth0.checkSession({}, (err, authResult) => {
            if(err) return reject(err)
            this.setSession(authResult)
            resolve()
          })
        })
      }
    }
    
    const auth0Client = new Auth();
    
    export default auth0Client;
