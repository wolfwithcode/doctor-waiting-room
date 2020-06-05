// Main app file
// @author: Le Duc Anh
// @description: requirejs config, loading core and vendor libraries + main app flows inject to index.html

//Config requirejs, import necessary files
requirejs.config({
    baseUrl: 'src',
    paths: {
        knockout: 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.1/knockout-latest.min',
        text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min',
        bootstrap: 'config/vendor/bootstrap/bootstrap.bundle',
        fontawesome: 'config/vendor/fontawesome/fontawesome.min',
        pubnub: 'https://cdn.pubnub.com/sdk/javascript/pubnub.4.27.4'
    },
    shim: {
        'fontawesome': {
            deps: ['config/vendor/fontawesome/solid',
                   'config/vendor/fontawesome/brands',
                   'config/vendor/fontawesome/regular']
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

//Loading vendor libraries
require(['jquery', 'pubnub', 'bootstrap','fontawesome']);

// Import components and activates binding 
require(['components_register/main_page.component',
         'components_register/header.component',
         'components_register/app_body.component',
         'components_register/footer.component',
         'view_model/appViewModel']);

