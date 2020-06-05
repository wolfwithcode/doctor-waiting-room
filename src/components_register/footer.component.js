// @register footer component
// @author: Le Duc Anh
    
define(['knockout'], function(ko){
    ko.components.register('app-footer',{
        template: { require: 'text!view/components/footer.html' }
    });
});