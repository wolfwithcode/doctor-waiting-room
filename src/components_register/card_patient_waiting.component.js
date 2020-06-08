// @register patient waiting room announcement component 
// @author: Le Duc Anh

define(['knockout'],function(ko){
    ko.components.register('patient-waiting',{
        viewModel: { require: 'view_model/components/card_patient_waiting' },        
        template: { require: 'text!view/components/card_patient_waiting.html' }
    });
});