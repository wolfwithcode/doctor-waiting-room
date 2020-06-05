// @Patient data object 
// @Each patient object will hold patient vsee id, patient name  
// @and the time trigger as soon as the patient enter waiting room
// @author: Le Duc Anh 

define(['knockout'], function(ko){

    function Patient(data){
        this.vsee_id = data.vsee_id;
        this.patient_name = data.patient_name;
        this.description = data.description;
    }
    return Patient;
})