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
            self.stylePage = new StylePage(ko.observable('index'));
       } else if (location.href.split("/").slice(-1)[0] == 'patient_waiting.html') {
            self.stylePage = new StylePage(ko.observable('patient_waiting'));
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
        //Declare and initialize processing_room, can be null or 1 patient at a time
        //Processing_room contains 2 properties which are value and time start the consultation
        //Value is a booleen, true when there is a patient in waiting room, false when no patient.
        self.processing_room = ko.observable({
            active: ko.observable(false), 
            vsee_id: ko.observable(""),
            new_open_time: new Date()
        });

        //Declare and initialize patient waiting status. Can be in progress or busy.
        // If doctor call the patient to the progressing room. The status will be progress
        // If doctor call patient but another person is in progressing room, the patient status will be busy.
        self.patient_status = ko.observable("");

        //===============Pubnub Config=============================
        self.pubnub = new PubNub({
            publishKey : 'pub-c-20a698d6-25e0-4ec1-b2fb-82dd60180c11', 
            subscribeKey : 'sub-c-1e90958c-a4b7-11ea-9dab-228a91b64ea0'
        });
       
        //========Save data to session storage when reload page====
        window.onload = function(){    
            if(sessionStorage.getItem('vsee_id')!=null){
                self.data.vsee_id = sessionStorage.getItem('vsee_id');
                self.data.patient_name = sessionStorage.getItem('patient_name');
                self.data.description = sessionStorage.getItem('description');
                self.patient_status = sessionStorage.getItem('patient_status');
                self.new_open_time = sessionStorage.getItem('new_open_time');
            }        
        }

        // Before refreshing the page, save the form data and patient status to sessionStorage
        window.onbeforeunload = function() {
            if(vm.data.vsee_id!=null){
                sessionStorage.setItem("vsee_id", vm.data.vsee_id);
                sessionStorage.setItem("patient_name", vm.data.patient_name);
                sessionStorage.setItem("description", vm.data.description);  
                sessionStorage.setItem("patient_status", vm.patient_status);
                // if(vm.new_open_time == null ) vm.new_open_time = new Date();
                // sessionStorage.setItem("new_open_time", vm.new_open_time);
            }
        }
    }
    vm = new AppViewModel();

    // Bind view model to the view
    ko.applyBindings(vm);
})        