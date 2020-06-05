// @register main-page component
// @author: Le Duc Anh

define(['knockout'], function(ko){
    ko.components.register('main-page',{
        template: { require: 'text!view/pages/main_page.html' }
    });
});