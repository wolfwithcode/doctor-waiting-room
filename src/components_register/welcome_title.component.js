// @register welcome or site main title component
// @author: Le Duc Anh
    
define(['knockout'], function(ko){
    ko.components.register('welcome-title',{
        template: { require: 'text!view/components/welcome_title.html' }
    });
});