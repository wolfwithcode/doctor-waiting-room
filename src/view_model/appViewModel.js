// @view-model for app component 
// @activate binding, declare all the global variables 
// @connect model and view. 
// @author: Le Duc Anh 

define(['knockout', 'pubnub', 'model/ticket'],function(ko, PubNub, Ticket){
    //Class to indentify page.
    function StylePage(card_type){
        var self = this;
        self.card_type = card_type;
    }

    function AppViewModel() {
        var self = this;

        //===============View global variables================================
        //Declare and initialize stylePage object which can be waiting, consultation or doctor.  
        //Each value will refer to a specify page. 
       if(location.href.split("/").slice(-1)[0] == 'doctor_dashboard.html'){
            self.stylePage = new StylePage(ko.observable('doctor'));
       } else if (location.href.split("/").slice(-1)[0] == 'index.html') {
            self.stylePage = new StylePage(ko.observable('waiting'));
       }

        // ==============Model global variables===============================
        //Declare and initialize list of tickets, other words list of patients in the queue
        self.tickets = ko.observableArray([]);
        //Declare and initialize patient data
        self.data = ko.observable({
            vsee_id: ko.observable(""),
            patient_name: ko.observable(""),
            description: ko.observable("")
        });
        //Declare and initialize processing patient can be null or 1 patient at a time
        //Processing_room contains 2 properties which are value and time start the consultation
        //Value is a booleen, true when there is a patient in waiting room, false when no patient.
        self.processing_room = ko.observable({
            active: ko.observable(false), 
            vsee_id: ko.observable("")
        });
         

        //===============Pubnub Config=============================
        self.pubnub = new PubNub({
            publishKey : 'pub-c-20a698d6-25e0-4ec1-b2fb-82dd60180c11', 
            subscribeKey : 'sub-c-1e90958c-a4b7-11ea-9dab-228a91b64ea0'
        });

        // window.open("doctor_dashboard.html")

    }
    vm = new AppViewModel();

    // Bind view model to the view
    ko.applyBindings(vm);
})        