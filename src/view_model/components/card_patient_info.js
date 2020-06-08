// @view-model for card-patient-info components
// @display list patients are waiting
// @receive patient info in real time, call the patient 
// @track time in minutes for each patient.
// @author: Le Duc Anh 

define(['knockout'], function(ko){
    //Reset tickets list
    vm.tickets.length = 0;

    function CardPatientInfoViewModel(){    

        var message_ids = {};
        var deleted_ids = {};
        var message_list = {};

        // ===============================Start fetch messages=====================================================

        function fetchMessagesFromPubnub(){

            let listTicketsInHistory = [];
        
            return vm.pubnub.history({
                channel: 'doctor_realtime',
                reverse: false, // Setting to true will traverse the time line in reverse starting with the oldest message first.
                count: 100, // how many items to fetch
                stringifiedTimeToken: true // false is the default
            }).then((response) => { 
                // Loop from lastest message first 
                for(let i=response.messages.length-1; i>=0; i--){
                    let message = response.messages[i];
                    const ticket = JSON.parse( message.entry.ticketJSON);
                    //Check if patient not empty or ticket valid or not
                    // if not push to temporary list 
                    const patient = ticket.patient;
                    const deleted = message.entry.deleted;
                    if(Object.keys(patient).length !== 0){
                        listTicketsInHistory.push({ticket, deleted});
                    }
                    
                }
                
                const result = filterTicketsToday(listTicketsInHistory);
                return new Promise((resolve) => {
                    resolve(result);
                })
            }).catch((error) => { 
                console.log(error) 
            });        
        }

        //Function to filter ticket by date which date is today.
        //return list of tickets today.
        function filterTicketsToday(listInfoTicket){
            const today = new Date().toLocaleDateString("en-US");
            
            //Filter tickets today
            const listTicketsToday = listInfoTicket.filter( infoTicket => {
                const ticket = infoTicket.ticket;
                const createdDate = new Date(ticket.date).toLocaleDateString("en-US");
                return createdDate === today;
            });

            //Filter tickets by ID, get the latest ticket of the ID
            const listVseeId = [];
            const validInfoTickets = [];
            listTicketsToday.forEach( infoTicket => {
                const ticket = infoTicket.ticket;
                if( !listVseeId.includes(ticket.patient.vsee_id) ){
                    listVseeId.push(ticket.patient.vsee_id);
                    validInfoTickets.push(infoTicket);
                }
            });

            //Filter tickets which is currently active which message.deleted is false
            const validTickets = [];
            validInfoTickets.forEach(infoTicket => {
                const ticket = infoTicket.ticket;
                if(!infoTicket.deleted)  validTickets.push(ticket);
            })
            return validTickets.reverse();
        }
        
        async function asyncCall(){
            console.log("test 2")
            // Fetch tickets from pubnud and wait until finished
            const tickets = await fetchMessagesFromPubnub();
            // Update  tickets for data binding
            vm.tickets(tickets);
            
        }
        asyncCall();
        
        // ===============================End fetch messages=====================================================
         
        //==========================Start get status of the processing room after reload====================
        //Processing time is 15mins. Set false after 15 mins. 
        const currentTime = new Date().getTime();
        const new_open_time = sessionStorage.getItem('new_open_time');
        const diff = new_open_time - currentTime;
        if( diff > 0){
            const minutes = Math.floor((diff/1000)/60);
            console.log("minutes ", minutes);
            setTimeout(function(){
                vm.processing_room.active=false;
                // Sending announcement to end the consultation time for patient in realtime
                vm.pubnub.publish({
                    channel: ['progressing_announcement'],
                    message: {
                        notice: "end_consultation",
                        message_id: vm.data.vsee_id 
                    }                     
                }).then((msg)=> {
                    console.log("Progressing")
                }).catch((err) => {
                    console.log('There are some errors to submit your information. Please retry! ' + err)
                });    
            }, minutes);
        }
        //==========================End get status of the processing room after reload====================
         
        //=====================Start Update, delele pubnub messages in doctor realtime channel=================
        function display_messages(msg, channel) {
            var parsed = JSON.parse(msg.message.ticketJSON);
            const deleted = msg.message.deleted;
            message_id = msg.message.message_id;
            (typeof message_list[channel] === 'undefined' ? message_list[channel] = {} : typeof message_list[channel] === 'undefined');
            (typeof message_ids[channel] === 'undefined' ? message_ids[channel] = [] : typeof message_ids[channel] === 'undefined');
            (typeof deleted_ids[channel] === 'undefined' ? deleted_ids[channel] = [] : typeof deleted_ids[channel] === 'undefined');
            
            // if new message, add to list
            if (message_ids[channel].indexOf(message_id) < 0) {
                
                message_ids[channel].push(message_id);
                
                console.log("add new message: ", parsed)
                message_list[channel][message_id] = msg.message;
                if(!deleted) vm.tickets.push(parsed)
                else{
                    let index=-1;
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
            }
            else {
                if (msg.message.deleted) {
                    
                    deleted_ids[channel].push(message_id);
         
                    // delete from message list
                    delete message_list[channel][message_id];
                    console.log("test deleted message: ", parsed)
                    // update UI, remove ticket from the list queue                  
                    let index=-1;
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
        
        // Subscribe to doctor_realtime channel to receive ticket/patient information.
        vm.pubnub.addListener({
            message: function(msg) {
                display_messages(msg, msg.subscribedChannel);
            }
        });
         
        vm.pubnub.subscribe({
            channels: ["doctor_realtime"]
        });
        //========================End Update, delele pubnub messages=================================
        
        // Function run when provider click call patient.
        this.call_patient = (ticket) => {
            console.log("Ticket view: ", ticket)
            // Check if there is any patient in consultation room
            // Case when there is no patient in processing room, calling patient to the room 
            // and broadcast progress announcement to the patient.
            const currentTime = new Date().getTime();
            const new_open_time = sessionStorage.getItem('new_open_time');
            const diff = new_open_time - currentTime;
            if(!vm.processing_room.active && diff < 0) {

                //Set processing room status active to true
                vm.processing_room.active = true;
                // var d = new Date(); d.setMinutes(d.getMinutes() + 30);
                let currentDate = new Date();
                
                const new_open_time = currentDate.setMinutes(currentDate.getMinutes()+15);
                sessionStorage.setItem("new_open_time", new_open_time);
                //Processing time is 15mins. Set false after 15 mins. 
                vm.data.vsee_id = ticket.patient.vsee_id;
                setTimeout(function(){
                    vm.processing_room.active=false;
                    // Sending announcement to end the consultation time for patient in realtime
                    vm.pubnub.publish({
                        channel: ['progressing_announcement'],
                        message: {
                            notice: "end_consultation",
                            message_id: ticket.patient.vsee_id 
                        }                     
                    }).then((msg)=> {
                        console.log("Progressing")
                    }).catch((err) => {
                        console.log('There are some errors to submit your information. Please retry! ' + err)
                    });    
                }, 900000);
                console.log("status: ", vm.processing_room.active)
                vm.processing_room.vsee_id = ticket.patient.vsee_id;
                window.location.href = 'vsee:' + vm.processing_room.vsee_id + '@vsee.com';  
                
                // Sending announcement to patient in realtime
                // Call the patient to consultation room
                vm.pubnub.publish({
                    channel: ['progressing_announcement'],
                    message: {
                        notice: "progress",
                        message_id: ticket.patient.vsee_id 
                    }                     
                }).then((msg)=> {
                   
                }).catch((err) => {
                    console.log('There are some errors to submit your information. Please retry! ' + err)
                });

                //Closed the ticket 
                ticketJSON = ko.toJSON(ticket);
                vm.pubnub.publish({          
                    channel: ['doctor_realtime'],    
                    message: {
                        ticketJSON: ticketJSON,                    
                        message_id: ticket.patient.vsee_id,
                        deleted: true,

                    }
                }).then((msg)=> {
                    console.log(msg.message)
                }).catch((err) => {
                    console.log('There are some errors to submit your information. Please retry! ' + err)
                })    
               
            } 
            // Case when processing room is currently serving a patient.
            // Broadcast busy announcement to the patient.
            else {
                // Sending announcement to patient in realtime
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
                $(document).ready(function(){
                    const currentDate = Date.now();
                    minsBetwwen = Math.floor((currentDate-ticket.date)/msMinute); 
                    document.getElementsByClassName(ticket.patient.vsee_id)[0].innerText = minsBetwwen;
                    return minsBetwwen;
                })
                setInterval(() => {                       
                    $(document).ready(function(){
                        const currentDate = Date.now();
                        minsBetwwen = Math.floor((currentDate-ticket.date)/msMinute); 
                        document.getElementsByClassName(ticket.patient.vsee_id)[0].innerText = minsBetwwen;
                        return minsBetwwen;
                    })
                }, 60000);              
            }
        }
    }

    return CardPatientInfoViewModel;
})