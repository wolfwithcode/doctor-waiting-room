// @register card-content or body of card component 
// @author: Le Duc Anh

// Import components
require(['components_register/card_form.component']);
require(['components_register/card_announcement.component']);
require(['components_register/card_patient_info.component']);

define(['knockout'],function(ko){
    ko.components.register('card-content',{
        template: { require: 'text!view/components/card_content.html' }
    });
});