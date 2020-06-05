// @register waiting list patients info in doctor dashboard 
// @author: Le Duc Anh

define(['knockout'],function(ko){
    ko.components.register('card-patient-info',{
        viewModel: { require: 'view_model/components/card_patient_info' },
        template: { require: 'text!view/components/card_patient_info.html' }
    });
});