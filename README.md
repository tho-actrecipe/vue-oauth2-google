# vue-oauth2-google
Handling Google sign-in for Vue.js applications.
Forked from vue-google-oauth2 (https://www.npmjs.com/package/vue-google-oauth2).

## Installation
### Installation with npm
```
npm install vue-oauth2-google
```

### Installation with yarn
```
yarn add vue-oauth2-google
```

## Initialization
```javascript
//src/main.js
import GAuth from 'vue-oauth2-google'
const gauthOption = {
  clientId: 'CLIENT_ID.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/drive',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

```
Please don't use `plus.login` scope. [It will be deprecated.](https://developers.google.com/identity/sign-in/web/quick-migration-guide)

### Initialization for Nuxt
1. Creates the plug-in file for nuxt

	```javascript
	// plugins/vue-oauth2-google.js
	// file name can be changed to whatever you want
	import Vue from 'vue'
	import GAuth from 'vue-oauth2-google'

	const gauthOption = {
	  clientId: 'CLIENT_ID.apps.googleusercontent.com',
	  scope: 'https://www.googleapis.com/auth/drive',
	  prompt: 'consent'
	}
	Vue.use(GAuth, gauthOption)

	```

2. Adds plugin to nuxt config file
	```javascript
	...
	plugins: [
	  ...
      './plugins/vue-oauth2-google'
	],

	...

	```

## Options
| Property     | Type     | Required        | Description     |
|--------------|----------|-----------------|-----------------|
| clientId     | String   | Required.       | The app's client ID, found and created in the Google Developers Console. |
| scope        | String   | Optional.       | [Full list of scopes](https://developers.google.com/identity/protocols/googlescopes). |
| prompt       | String   | Optional.       | This value using for [authCode.](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2offlineaccessoptions) The possible values are `select_account` or `consent`. Default value is `consent`. To get refresh token from auth code, use `consent`.|
| fetch_basic_profile       | Boolean   | Optional.       | If set to true, `email profile openid` will [be automatically added as scope](https://developers.google.com/identity/sign-in/web/sign-in). Default value is `true`. |

## Methods
| Property     			| Description        | Type     |
|-----------------------|--------------------|----------|
| GoogleAuth   			| return of [gapi.auth2.getAuthInstance()](https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse)   | Object |
| isAuthorized 			| Whether or not you have auth | Boolean  |
| isInit       			| Whether or not api init | Boolean  |
| isLoaded     			| Whether or not api init. will be deprecated. | Function  |
| signIn       			| function for sign-in | Function  |
| getAuthCode  			| function for getting authCode | Function  |
| getAuthCodeWithOption	| function for getting authCode from another account | Function  |
| signOut      			| function for sign-out | Function  |


## Usages
### Getting authorization code
The `authCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access_token and refresh_token.

The `access_token` and `refresh_token` can be saved in backend storage for reuse and refresh. In this way, you can avoid exposing your api key or secret key whenever you need to use various google APIs.

```javascript
const authCode = await this.$gAuth.getAuthCode()
const response = await this.$http.post('http://your-backend-server-api-to-use-authcode', { code: authCode, redirect_uri: 'postmessage' })
```

### Sign-in: Directly get back the `access_token` and `id_token`

```javascript
const googleUser = await this.$gAuth.signIn()
// googleUser.getId() : Get the user's unique ID string.
// googleUser.getBasicProfile() : Get the user's basic profile information.
// googleUser.getAuthResponse() : Get the response object from the user's auth session. access_token and so on
this.isSignIn = this.$gAuth.isAuthorized

```

refer to [google signIn reference : GoogleUser](https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid)


### Sign-out
Handling Google sign-out
```javascript
const response = await this.$gAuth.signOut()
```

## Extra - Directly get `access_token` and `refresh_token` on Server-side
To get `access_token` and `refresh_token` in server side, the data for `redirect_uri` should be `postmessage`. `postmessage` is magic value for `redirect_uri` to get credentials without the actual redirect uri.

### Curl
```
curl -d "client_id=YOUR_CLIENT_ID&\
  client_secret=YOUR_CLIENT_SECRET&\
  redirect_uri=postmessage&\
  grant_type=authorization_code&\
  code=YOUR_AUTH_CODE" https://accounts.google.com/o/oauth2/token
```
