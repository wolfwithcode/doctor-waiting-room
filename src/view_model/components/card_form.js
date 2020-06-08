// @view-model for card-form components
// @data binding with user input information.
// @send patient information to all channel subscribers.
// @author: Le Duc Anh 

define(['knockout', 'model/ticket'], function(ko, Ticket){
    function CardFormViewModel(){

        //Sending patient information in realtime with pubnub api
        this.sendTicketRealtime = (ticket) => {
            ticketJSON = ko.toJSON(ticket);
            vm.pubnub.publish({          
                channel: ['doctor_realtime'],    
                message: {
                    ticketJSON: ticketJSON,                    
                    message_id: ticket.patient.vsee_id,
                    deleted: false
                }
            }).then((msg)=> {
                window.open("patient_waiting.html","_self")
            }).catch((err) => {
                console.log('There are some errors to submit your information. Please retry! ' + err)
            });
        }

        
        //Trigger a new ticket and add to list tickets.
        this.addTicket = () => {
            //Push ticket to global tickets list.
            ticket = new Ticket(vm.data);
            vm.tickets.push(ticket);

            //Send ticket - patient information
            this.sendTicketRealtime(ticket);   

            document.getElementById('submit-form').reset();
        }        
    }

    return CardFormViewModel;
})