var authContext = null;
var user = null;
var token = null;
var version = "1.0.0";
var tenant = "<[TODO]: Replace with your tenant>";
var clientId = "<[TODO]: Replace with your client id>";

(function () {
    window.config = {
        instance: 'https://login.microsoftonline.com/',
        tenant: tenant,
        clientId: clientId,
        postLogoutRedirectUri: window.location.origin,
        cacheLocation: 'localStorage',
        endpoints: {
            apiUrl: "<[TODO]: Replace with api endpoint>"
        }
    };

    authContext = new AuthenticationContext(config);
    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }
    user = authContext.getCachedUser();
    if (!user) {
        authContext.login();
    }

    authContext.acquireToken(config.endpoints.apiUrl, function (error, token) {
        if (error || !token) {
            console.log("ADAL error occurred: " + error);
            authContext.login();
            return;
        }
        else {
            console.log("ADAL logged in");
            window.accessToken = token;
        }
    });

}());

window.blazorDemoInterop = {
    confirmDelete: function (title) {
        $('#bookTitleField').text(title);
        $('#myModal').modal('show');

        return true;
    },
    hideDeleteDialog: function () {
        $('#myModal').modal('hide');

        return true;
    },
    getAppVersion: function () {
        if (version === null) {
            return '';
        }

        return version;
    },
    getUserName: function () {
        if (user === null) {
            return '';
        }

        return user.profile.name;
    },
    getUserMail: function () {
        if (user === null) {
            return '';
        }

        return user.profile.unique_name;
    },
    getToken: function () {
        if (!user) {
            authContext.login();
        }
        else if (window.accessToken) {
            return window.accessToken;
        }
        else {
            authContext.acquireToken(config.endpoints.apiUrl, function (error, token) {
                if (error || !token) {
                    console.log("ADAL error occurred: " + error);
                    return;
                }
                else {
                    window.accessToken = token;
                    return window.accessToken;
                }
            });
        }
    },
    getNotificationToken: function () {
        if (window.localStorage.getItem('notificationToken'))
        {
            return window.localStorage.getItem('notificationToken');
        }
        return null;
    },
    sendMessage(request) {
        $.ajax({
            url: "https://fcm.googleapis.com/fcm/send",
            type: "POST",
            data: request,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=<[TODO]: Replace with Firebase Server key>"
            },
            success: (res) => {
                return true;
            },
            error: (err) => {
                return false;
            }
        });
    },
    logout: function () {
        if (authContext !== null) {
            authContext.logOut();
            return true;
        }
        return false;
    },
    executeWithToken: function (action) {
        authContext.acquireToken(authContext.config.clientId, function (error, token) {
            let tokenString = Blazor.platform.toDotNetString(token);

            const assemblyName = 'BlazorDemo.AdalClient';
            const namespace = 'BlazorDemo.AdalClient';
            const typeName = 'AdalHelper';
            const methodName = 'RunAction';

            const runActionMethod = Blazor.platform.findMethod(
                assemblyName,
                namespace,
                typeName,
                methodName
            );

            Blazor.platform.callMethod(runActionMethod, null, [
                action, tokenString
            ]);

        });

        return true;
    }
};