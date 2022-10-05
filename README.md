# vue-oauth2-google
- Using the Google Identity Services authorization code model a popup dialog for user consent and callback handler to receive the authorization code from Google.
  https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gis-popup-ux
- Support Vue.js 2.x

## Installation
### Installation with npm
```
npm install vue-oauth2-google
```

## Initialization
```javascript
import GAuth from 'vue-oauth2-google'

methods: {
	successCallback (code) {
		this.$http.post('YOUR_AUTHORIZATION_CODE_ENDPOINT_URI', { code: code }).then(response => {
			console.log(response)
		})
	},
	errorCallback (error) {
		console.log(error)
	}
},
mounted () {
	const gauthOption = {
		clientId: this.getGoogleClientId,
		scope: 'profile email',
		successCallback: this.successCallback,
		errorCallback: this.errorCallback
	}
	Vue.use(GAuth, gauthOption)
}

```
