// @view-model for card-form components
// @data binding with user input information.
// @author: Le Duc Anh 

define(['knockout', 'model/ticket'], function(ko, Ticket){
    function CardFormViewModel(){
        console.log("test card form")

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
                
                // Update view display announcement
                document.getElementById("card-waiting-title").style.display = "none";
                document.getElementById("card-announcement-title").style.display = "block";
                document.getElementById("card-form").style.display = "none";
                document.getElementById("card-announcement").style.display = "block";
            }).catch((err) => {
                console.log('There are some errors to submit your information. Please retry! ' + err)
            });
        }

        //Subscribe doctor_realtime channel to receive announcement from doctor
        this.receiveTicketRealtime = (ticket) =>{
            vm.pubnub.subscribe({channels: ['progressing_announcement']});
            vm.pubnub.addListener({message: function(msg) { 
                //Get vsee_id from message
                progressing_vsee_id = msg.message.message_id;
                if(msg.message.notice == "progress"){
                    if(msg.message.message_id==ticket.patient.vsee_id){
                        // Update view to display message: "The visit is in progress"
                        document.getElementById('progressing_announce').style.display  = 'block';
                        document.getElementById('progressing_announce').innerText  = 'The visit is in progress';
                        document.getElementById('announcement').style.display  = 'none';
                        document.getElementById('exist_btn').style.display = "none";
                    }
                } else if(msg.message.notice == "busy"){
                    if(msg.message.message_id==ticket.patient.vsee_id){
                        // Update view to display message: "Doctor is currently busy and will attend to you soon"
                        document.getElementById('progressing_announce').style.display  = 'block';
                        document.getElementById('progressing_announce').innerText  = 'Doctor is currently busy and will attend to you soon';
                        document.getElementById('announcement').style.display  = 'none';
                        document.getElementById('exist_btn').style.display = "block";
                    }
                } 
                
            }});     
        }

        //Trigger a new ticket and add to list tickets.
        this.addTicket = () => {
            //Push ticket to global tickets list.
            ticket = new Ticket(vm.data);
            vm.tickets.push(ticket);

            //Send ticket - patient information
            this.sendTicketRealtime(ticket);   
            
            //Receive announcement from doctor
            this.receiveTicketRealtime(ticket);

            document.getElementById('submit-form').reset();
        }

        //Reconnect the call if closed by mistake
        this.callDoctor = () => {            
            ticket = new Ticket(vm.data);
            window.location.href = 'vsee:' + vm.data.vsee_id + '@vsee.com';  
        }
        
        //Exist the consultation room and unsubcribe channel
        this.leaveWaitingRoom = () => {
            console.log("data3: ", vm.data.vsee_id)
            vm.pubnub.publish({          
                channel: ['doctor_realtime'],    
                message: {
                    ticketJSON: ticketJSON,                    
                    message_id: vm.data.vsee_id,
                    deleted: true
                }
            }).then((msg)=> {

                window.open("index.html","_self");
            }).catch((err) => {
                console.log('There are some errors to submit your information. Please retry! ' + err)
            })
        
        }
    }

    return CardFormViewModel;
})