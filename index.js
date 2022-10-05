let googleAuth = (function () {
    function Auth() {
        this.installClient = () => {
            let apiUrl = "https://accounts.google.com/gsi/client";
            return new Promise((resolve) => {
                let script = document.createElement("script");
                script.id = "gsi-client"
                script.src = apiUrl;
                script.onreadystatechange = script.onload = function () {
                    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                        setTimeout(function () {
                            resolve();
                        }, 500);
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            });
        }

        this.initClient = (config) => {
            this.config = config
            return new Promise((resolve, reject) => {
                try {
                    this.code_client = google.accounts.oauth2.initCodeClient({
                        client_id: config.clientId,
                        scope: config.scope,
                        ux_mode: 'popup',
                        callback: (response) => {
                            if (response.code) {
                                config.successCallback(response.code)
                            } else {
                                config.errorCallback(response)
                            }
                        },
                    });
                    resolve(this)
                } catch(error) {
                    reject(error)
                }
            })
        }

        if (!(this instanceof Auth)) return new Auth();

        this.load = (config) => {
            this.installClient()
                .then(() => {
                    this.initClient(config)
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        this.getAuthCode = () => {
            const focusEventHandler = () => {
                this.config.errorCallback({
                    error: 'popup_closed_by_user',
                });
                window.removeEventListener('focus', focusEventHandler);
            };
            // adding an event listener to detect if user is back to the webpage
            // if the user "focus" back to window then we shall close the current auth session
            window.addEventListener('focus', focusEventHandler);
            this.code_client.requestCode()
        };
    }
    return new Auth();
})();

function installGoogleAuthPlugin(Vue, options) {
    /* eslint-disable */
    // set config
    let GoogleAuthConfig = null;
    let GoogleAuthDefaultConfig = {
        scope: 'profile email',
    };
    if (typeof options === "object") {
        GoogleAuthConfig = Object.assign(GoogleAuthDefaultConfig, options);
        if (options.scope) GoogleAuthConfig.scope = options.scope;
        if (!options.clientId) {
            console.warn("ClientId is required.");
        }
    } else {
        console.warn("Invalid option type. Object type accepted only.");
    }

    // Install Vue plugin
    Vue.gAuth = googleAuth;
    Object.defineProperties(Vue.prototype, {
        $googleAuth: {
            get: function () {
                return Vue.gAuth;
            },
        },
    });
    Vue.gAuth.load(GoogleAuthConfig);
}

export default installGoogleAuthPlugin;
