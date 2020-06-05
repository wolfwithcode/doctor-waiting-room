// @register waiting room form component 
// @author: Le Duc Anh

define(['knockout'],function(ko){
    ko.components.register('card-form',{
        viewModel: { require: 'view_model/components/card_form' },
        template: { require: 'text!view/components/card_form.html' }
    });
});