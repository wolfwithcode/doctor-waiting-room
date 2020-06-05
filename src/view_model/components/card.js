// @view-model for card-title components
// @author: Le Duc Anh 

define(['knockout'], function(ko){
    function CardViewModel(){};

    CardViewModel.prototype.cardTypeFunc = ko.pureComputed(() => {   
        let card_type = vm.stylePage.card_type();

        if(card_type=='waiting') {
            return "col-xl-8";
        } else {
            return "col-xl-11";
        }
    });
    
    return CardViewModel;
})