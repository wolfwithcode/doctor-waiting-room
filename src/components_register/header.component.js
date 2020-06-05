// @register header component
// @author: Le Duc Anh
    
define(['knockout'], function(ko){
    ko.components.register('app-header',{
        template: { require: 'text!view/components/header.html' }
    });
});