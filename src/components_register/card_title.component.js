// @register card-title component
// @author: Le Duc Anh

define(['knockout'],function(ko){
    ko.components.register('card-title',{
        template: { require: 'text!view/components/card_title.html' }
    });
});