// @view-model for card components
// @display full col-xl-11 for card if in the doctor dashboard page 
// @and col-xl-8 for index and patient_waiting page
// @author: Le Duc Anh 

define(['knockout'], function(ko){
    function CardViewModel(){};

    CardViewModel.prototype.cardTypeFunc = ko.pureComputed(() => {   
        let card_type = vm.stylePage.card_type();

        //Update view by the page type
        if(card_type=='index' || card_type=='patient_waiting') {
            return "col-xl-8";
        } else {
            return "col-xl-11";
        }
    });
    
    return CardViewModel;
})