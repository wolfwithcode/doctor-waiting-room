// @Ticket data object 
// @Ticket will be created in real-time with the patient enter waiting room 
// @Each ticket will hold patient object and time patient enter waiting room.
// @author: Le Duc Anh 


define(['knockout', 'model/patient'], function(ko, Patient){
    function Ticket(data) {
        this.patient = new Patient(data);
        this.date = Date.now();
        this.ticket_id = "";
    }
    return Ticket;
})