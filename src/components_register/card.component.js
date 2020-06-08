// @register card component
// @author: Le Duc Anh

// Import components
require(['components_register/card_title.component',
'components_register/card_content.component']);

// @register card component 
// @author: Le Duc Anh
define(['knockout'],function(ko){
    ko.components.register('card',{
        viewModel: { require: 'view_model/components/card' },
        template: { require: 'text!view/components/card.html' }
    });
});