// @Ticket data object 
// @Ticket will be created in real-time with the patient enter waiting room 
// @Each ticket will hold patient object and time patient enter waiting room 
// @and status will be closed, active or pending.
// @author: Le Duc Anh 


define(['knockout', 'model/patient'], function(ko, Patient){
    function Ticket(data) {
        this.patient = new Patient(data);
        this.date = Date.now();
    }
    return Ticket;
})