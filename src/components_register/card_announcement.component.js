// @register consultation room announcement component 
// @author: Le Duc Anh

define(['knockout'],function(ko){
    ko.components.register('card-announcement',{
        viewModel: { require: 'view_model/components/card_form' },        
        template: { require: 'text!view/components/card_announcement.html' }
    });
});