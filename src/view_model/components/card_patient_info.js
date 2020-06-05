// @view-model for card-patient-info components
// @receive patient info in real time, call the patient 
// @author: Le Duc Anh 

define(['knockout', 'model/ticket'], function(ko, Ticket){
    this.waiting_time = ko.observable("");

    function CardPatientInfoViewModel(){          
        // console.log("test 222")
        var message_ids = {};
        var deleted_ids = {};
        var message_list = {};
        var my_channel = "doctor_realtime";
         
        //Update, delele pubnub messages
        function display_messages(msg, channel) {
            var parsed = JSON.parse(msg.message.ticketJSON);
            message_id = msg.message.message_id;
            (typeof message_list[channel] === 'undefined' ? message_list[channel] = {} : typeof message_list[channel] === 'undefined');
            (typeof message_ids[channel] === 'undefined' ? message_ids[channel] = [] : typeof message_ids[channel] === 'undefined');
            (typeof deleted_ids[channel] === 'undefined' ? deleted_ids[channel] = [] : typeof deleted_ids[channel] === 'undefined');
            
            // if new message, add to list
            if (message_ids[channel].indexOf(message_id) < 0) {
                
                message_ids[channel].push(message_id);
                
                // console.log(parsed)
                message_list[channel][message_id] = msg.message;
                vm.tickets.push(parsed)
            }
            else {
                if (msg.message.deleted) {
                    
                    deleted_ids[channel].push(message_id);
         
                    // delete from message list
                    delete message_list[channel][message_id];

                    // update UI, remove ticket from the list queue                  
                    var index=-1;
                    console.log("test index")
                    for(let i=0; i<vm.tickets().length; i++){
                        let ticket = vm.tickets()[i];
                        if(ticket.patient.vsee_id == parsed.patient.vsee_id){
                            index = i;
                            break;
                        }
                    }
                    vm.tickets.splice(index,1);
                }
                else {
                    // replace content (same as adding new one, because of identical message_id)
                    message_list[channel][message_id] = msg.message;
               
                    // update UI, update display content
                    // var index = vm.tickets().indexOf(this.ticket)
                    
                }
            }
        }

        vm.pubnub.addListener({
            status: function(statusEvent) {
                // console.log(statusEvent);
            },
            message: function(msg) {
                display_messages(msg, msg.subscribedChannel);
            }
        });
         
        vm.pubnub.subscribe({
            channels: [my_channel]
        });


        // Function run when provider click call patient.
        this.call_patient = (ticket) => {
            console.log("Ticket view: ", ticket)
            // Check if there is any patient in consultation room
            // If yes, return announcement to patient. If no, calling patient to the room.
            if(!vm.processing_room.active) {

                //Set processing room status active to true
                vm.processing_room.active = true;
                //Processing time is 15mins. Set false after 15 mins. 
                setTimeout(function(){vm.processing_room.active=false;}, 900000);
                console.log(vm.processing_room.active)
                vm.processing_room.vsee_id = ticket.patient.vsee_id;
                window.location.href = 'vsee:' + vm.processing_room.vsee_id + '@vsee.com';  
                var index = vm.tickets().indexOf(ticket)
                vm.tickets.splice(index,1);
                
                // Sending announcement to patient in realtime
                // Call the patient to consultation room
                vm.pubnub.publish({
                    channel: ['progressing_announcement'],
                    message: {
                        notice: "progress",
                        message_id: ticket.patient.vsee_id 
                    }                     
                }).then((msg)=> {
                    console.log("Progressing")
                }).catch((err) => {
                    console.log('There are some errors to submit your information. Please retry! ' + err)
                });
                
               
            } else {
                // Sending announcement to patient in realtime
                // Announce the patient 'doctor is currently busy'
                vm.pubnub.publish({
                    channel: ['progressing_announcement'],
                    message: {
                        notice: "busy",
                        message_id: ticket.patient.vsee_id 
                    }                    
                }).then((msg)=> {
                    console.log("Busy")
                }).catch((err) => {
                    console.log('There are some errors to submit your information. Please retry! ' + err)
                });
                
            }
        }

        // Function to calculate patient waiting time, update per minute.
        this.get_waiting_time = (ticket) => {
            if(ticket){
                const msMinute = 60*1000;
                setInterval(() => {                       
                    const currentDate = Date.now();
                    let = 0;
                    minsBetwwen = Math.floor((currentDate-ticket.date)/msMinute); 
                    var index = vm.tickets().indexOf(ticket)
                    if(index>=0){
                        document.getElementsByClassName(ticket.patient.vsee_id)[0].innerText = minsBetwwen;
                    }
                    return minsBetwwen;
                }, 60000);              
            }
        }
    }

    return CardPatientInfoViewModel;
})