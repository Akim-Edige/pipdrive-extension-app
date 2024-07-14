document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById("submitBtn").textContent = "Request is Sent"
    document.getElementById('submitBtn').classList.add('redButton')

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    var email = document.getElementById('email').value;
    var jobType = document.getElementById('jobType').selectedIndex;
    var jobSource = document.getElementById('jobSource').selectedIndex;
    var jobDescription = document.getElementById('jobDescription').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var zipCode = document.getElementById('zipCode').value;
    var date = document.getElementById('date').value;
    var startTime = document.getElementById('startTime').value;
    var endTime = document.getElementById('endTime').value;
    var technician = document.getElementById('technician').value;
    var area = document.getElementById('area').selectedIndex;

    jobType+=26
    jobSource+=29
    area+=31


    // Finding user ID by name 
    let personId;

    async function findInfo(){
        personId = await findPersonId();
        userID = await findUserId();
        console.log(personId, userID);
        const response = await sendData(personId, userID);
        console.log(response);
        setTimeout(function() {
            window.location.href = 'result.html';
          }, 3000);
    }

    findInfo();

    async function findPersonId(){
        let personID;
        url = 'https://edige-sandbox.pipedrive.com/api/v1/persons/search?api_token=89aead4f620c2467e84c129702be5cae5932863a&term='.concat(firstName).concat(' ').concat(lastName)
    
        personID = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // or .text() if the data is plain text
        })
        .then(data => {
            if (data['data']['items'].length==0){
                console.log("Not Found");
                return ''
    
            }else{
                console.log("Found");
                let person_id = data['data']['items'][0]['item']['id'];
                return person_id;
            }
            
        }) 
        .catch(error => console.error('Error:', error)); 

        if (personID == ''){
            personID = await createUser();
            return personID;
        }else{
            return personID;
        }
    }


    async function createUser(){
        let personID = await fetch('https://edige-sandbox.pipedrive.com/api/v1/persons?api_token=89aead4f620c2467e84c129702be5cae5932863a', {
                    method: 'POST', // Specifying the method
                    headers: {
                        'Content-Type': 'application/json' // Specifying the content type
                    },
                    body: JSON.stringify({
                        name: firstName.concat(' ').concat(lastName),
                        email: email,
                        phone: phoneNumber,
                        visible_to: 1,
                    })
                })
                .then(response =>response.json()) 
                .then(data =>{
                    person_id = data['data']['id']
                    console.log(person_id);
                    return person_id;
                }) 
        return personID;
    }
    
    
    async function findUserId(){
        let userID
        url = 'https://edige-sandbox.pipedrive.com/api/v1/users/find?api_token=89aead4f620c2467e84c129702be5cae5932863a&term='.concat(technician)
        userID = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // or .text() if the data is plain text
        })
        .then(data => {
            userID = data['data'][0]['id'] // Handling the parsed data
            console.log(userID)
            return userID
        }) 
        .catch(error => console.error('Error:', error)); // Handling errors
        return userID;
    
    }
    
    
    
    job_link = "b142a6a722776bd64d800df794218dc17795b15b" // any text
    
    async function sendData(personID, userID){
        let response = await fetch('https://edige-sandbox.pipedrive.com/api/v1/deals?api_token=89aead4f620c2467e84c129702be5cae5932863a', {
            method: 'POST', // Specifying the method
            headers: {
                'Content-Type': 'application/json' // Specifying the content type
            },
            body: JSON.stringify({
                title: 'Design',
                value: 10000,
                currency: 'USD',
                user_id: null,
                person_id: null,
                org_id: 1,
                stage_id: 1,
                status: 'open',
                probability: 60,
                lost_reason: null,
                visible_to: 1,
                'fa1eae66534bb6e610d1e74cd10e4ece6e919e5f':address,
                'ef68035d4b2ddaa032f2836ed286ab0a3e8bd51b':city,
                'bd3a818f046d1afc2b6a04c5ffe612eff1616f16':state,
                '03a9cdb564a1b862d82044f9040b134489a0b8e1':zipCode,  
                '151fd5fcc650dcc62f5e1d6a0a5406ae30a5e647':jobType,
                '50a6936779b57f49c9e4e39f169af3d3ee4c6288':jobSource,
                '9714a622ef6ae50defa8fb5f472ec530d7d38f9f':date,
                '6b98ef0948d2b495afa63f4ca4421d309021744d':startTime,
                'c53bb22920dcd8b6448e26362d02365062346f67':endTime,
                'ee6c9ab7d700b91a708abd02a4c3dfbe922a700e':userID,
                'd856d97ab36a87f9e48ceb9bfb0a025c54dc7e15':area,
                '0a329bbc9b9f776361bc15d8cc0887bbc44822b1':jobDescription,
                '204461fea610c016bd4eb712c53f16f207208989':'123RANDOM',
                'b142a6a722776bd64d800df794218dc17795b15b':'https://example.com'
            })
        })
        .then(response =>response.json()) // Parsing the JSON response
        .then(data =>{
             console.log(data)
             console.log(data['data']['id'])

             localStorage.setItem('link', 'https://edige-sandbox.pipedrive.com/deal/'.concat(data['data']['id']));

                const posturl = 'https://edige-sandbox.pipedrive.com/api/v1/deals/'+data['data']['id']+'?api_token=89aead4f620c2467e84c129702be5cae5932863a'
                fetch(posturl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json' // Set the content type of the request
                    },
                    body: JSON.stringify({'ee6c9ab7d700b91a708abd02a4c3dfbe922a700e': userID, person_id:personID, title:'Job # '.concat(data['data']['id'])})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }

                    console.log(response)
                    return response.json();
                })
                .then(data => {
                    return 'Success';
                })
                .catch(error => {
                    return 'Failed'
                });
            }) // Handling the parsed data
    
        .catch(error => console.error('Error:', error)); // Handling errors
    
        return response
    }

});