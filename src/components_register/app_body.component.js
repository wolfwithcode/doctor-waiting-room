// @register body content component
// @author: Le Duc Anh

// Import components
require(['components_register/welcome_title.component',
'components_register/card.component']);

define(['knockout'],function(ko){
    ko.components.register('app-body',{
        template: { require: 'text!view/components/app_body.html' }
    });
});