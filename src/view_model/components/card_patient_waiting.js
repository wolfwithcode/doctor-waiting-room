// @view-model for patient-waiting components
// @display announcement messages. 
// @cancel the ticket if click exit waiting room.
// @author: Le Duc Anh 

define(['knockout', 'model/Ticket'], function(ko, Ticket){
    function PatientWaitingViewModel(){};
        this.ticket = new Ticket(vm.data);
        this.ticketJSON = ko.toJSON(ticket);

        //Subscribe doctor_realtime channel to receive announcement from doctor
        this.receiveTicketRealtime = (ticket) =>{
            vm.pubnub.subscribe({channels: ['progressing_announcement']});
            vm.pubnub.addListener({message: function(msg) { 
                //Get vsee_id from message
                progressing_vsee_id = msg.message.message_id;
                if(msg.message.notice == "progress"){
                    if(msg.message.message_id==ticket.patient.vsee_id){
                        vm.patient_status = "progress";
                        // Update view to display message: "The visit is in progress"
                        document.getElementById('progressing_announce').style.display  = 'block';
                        document.getElementById('progressing_announce').innerText  = 'The visit is in progress';
                        document.getElementById('announcement').style.display  = 'none';
                        document.getElementById('exist_btn').style.display = "none";
                    }
                } else if(msg.message.notice == "busy"){
                    if(msg.message.message_id==ticket.patient.vsee_id){
                        vm.patient_status = "busy";
                        // Update view to display message: "Doctor is currently busy and will attend to you soon"
                        document.getElementById('progressing_announce').style.display  = 'block';
                        document.getElementById('progressing_announce').innerText  = 'Doctor is currently busy and will attend to you soon';
                        document.getElementById('announcement').style.display  = 'none';
                        document.getElementById('exist_btn').style.display = "block";
                    }
                } else if(msg.message.notice == "end_consultation"){
                    if(msg.message.message_id==ticket.patient.vsee_id){
                        //Clear session storage and return to index page.
                        vm.data = {};
                        vm.patient_status=='';
                        sessionStorage.clear();
                        window.open("index.html","_self");   
                    }
                }            
            }});     
        }

        //Receive announcement from doctor
        this.receiveTicketRealtime(this.ticket);

        //Get back data after reloading page.  
        $(document).ready(function(){
            if(vm.data.vsee_id!=null){            
                if(vm.patient_status=='progress'){
                    // Update view to display message: "The visit is in progress"
                    document.getElementById('progressing_announce').style.display  = 'block';
                    document.getElementById('progressing_announce').innerText  = 'The visit is in progress';
                    document.getElementById('announcement').style.display  = 'none';
                    document.getElementById('exist_btn').style.display = "none";
                }
                else if (vm.patient_status=='busy') {
                     // Update view to display message: "Doctor is currently busy and will attend to you soon"
                     document.getElementById('progressing_announce').style.display  = 'block';
                     document.getElementById('progressing_announce').innerText  = 'Doctor is currently busy and will attend to you soon';
                     document.getElementById('announcement').style.display  = 'none';
                     document.getElementById('exist_btn').style.display = "block";
                }           
            } 
        })         
        

        //Reconnect the call if closed by mistake
        this.callDoctor = () => {   
            window.location.href = 'vsee:' + this.ticket.patient.vsee_id + '@vsee.com';  
        }

        
        //Exist the consultation room and remove from pubnub history
        this.leaveWaitingRoom = () => {
            console.log("data3: ", this.ticket.patient.vsee_id)
            vm.pubnub.publish({          
                channel: ['doctor_realtime'],    
                message: {
                    ticketJSON: this.ticketJSON,                    
                    message_id: this.ticket.patient.vsee_id,
                    deleted: true
                }
            }).then((msg)=> {
                //Clear session storage and return to index page.
                vm.data = {};
                vm.patient_status=='';
                sessionStorage.clear();
                window.open("index.html","_self");
            }).catch((err) => {
                console.log('There are some errors to submit your information. Please retry! ' + err)
            })        
        }

    return PatientWaitingViewModel;
})