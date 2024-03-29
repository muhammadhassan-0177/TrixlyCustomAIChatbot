const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
let typingTimeout; // Variable to store the typing timeout
let createButtonsTimeout;
let isAskAnythingActive = true;
// Set the flag to indicate that AskAnything is temporarily inactive
isAskAnythingActive = false;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">perm_identity</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}




function resetCreateButtonsTimer() {
    createNewButtons();
}


function AskAnything() {
    console.log("Ask Anything Function is being called")
    takeuserresponse().then(response => {
        chatbox.appendChild(createChatLi(response, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        // Now you can send the user's response to the server
        sendUserResponseToServer(response);
    });


}

let isUserResponseActive = true; // Flag to indicate if user response collection is active

const takeuserresponse = () => {
    console.log("Function is Initiated Take user response");
    return new Promise((resolve) => {
        const userInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.getElementById("send-btn");

        const handleEnterKey = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleUserResponse();
            }
        };

        const handleSendClick = () => {
            handleUserResponse();
        };

        const handleUserResponse = () => {
            if (!isUserResponseActive) {
                return; // Stop if user response collection is not active
            }
            
            const userMessage = userInput.value.trim();
            if (userMessage) {
                userInput.removeEventListener("keydown", handleEnterKey);
                sendChatBtn.removeEventListener("click", handleSendClick);
                resolve(userMessage);

                // Clear the input area after getting the response and resolving the promise
                userInput.value = "";
                AskAnything();
            }
        };

        userInput.addEventListener("keydown", handleEnterKey);
        sendChatBtn.addEventListener("click", handleSendClick);

        // Set a timeout for 30 seconds
        const timeoutId = setTimeout(() => {
            // Remove the event listener for input
            userInput.removeEventListener("input", resetCreateButtonsTimer);
            // Initiate resetCreateButtonsTimer
            resetCreateButtonsTimer();

            // Stop user response collection
            isUserResponseActive = false;
        }, 20000);

        // Add an event listener for input
        userInput.addEventListener("input", () => {
            // Clear the timeout if user takes action
            clearTimeout(timeoutId);
        });
    });
};



const sendUserResponseToServer = async (response) => {
    console.log("Function is Initiated SRTS")
    try {
        const serverResponse = await fetch('/chatbot_generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: response })
        });

        if (serverResponse.ok) {
            const responseData = await serverResponse.json();
            const chatbotResponse = responseData.response;

            chatbox.append(createChatLi(chatbotResponse, "incoming"))
            chatbox.scrollTo(0, chatbox.scrollHeight);




        } else {
            console.log("Error");
        }
    } catch (error) {
        console.log(error);
    }
};

function createNewButtons() {
    console.log("Function is Initiated CB")
    const Query = "Have I answered all of your questions? Type 'Yes' or 'No'";
    chatbox.appendChild(createChatLi(Query, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    UserResponse().then(responsenew => {

        chatbox.appendChild(createChatLi(responsenew, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);


        const trimmedResponsenew = responsenew.trim().toLowerCase();

        if (trimmedResponsenew === 'yes') {
            // Handle 'Yes' response
            BookingADemoQuestion();
        } else if (trimmedResponsenew === 'no') {
            // Handle 'No' response
            AskMore();
        } else {
            // Handle any other response
            const invalidResponse = "Invalid response. Please type 'Yes' or 'No'.";
            chatbox.appendChild(createChatLi(invalidResponse, "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    });
}

const UserResponse = () => {
    console.log("Function is Initiated user")
    return new Promise((resolve) => {
        const userInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.getElementById("send-btn");

        const handleEnterKey = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleUserResponse();
            }
        };

        const handleSendClick = () => {
            handleUserResponse();
        };

        const handleUserResponse = () => {
            const userMessage = userInput.value.trim();
            if (userMessage) {
                userInput.removeEventListener("keydown", handleEnterKey);
                sendChatBtn.removeEventListener("click", handleSendClick);
                resolve(userMessage);

                // Clear the input area after getting the response and resolving the promise
                userInput.value = "";
            }
        };

        userInput.addEventListener("keydown", handleEnterKey);
        sendChatBtn.addEventListener("click", handleSendClick);
    });
}


function WelcomeMessage() {
    const Query = "Welcome to Trixly! I am here to help you!";
    chatbox.appendChild(createChatLi(Query, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    takeuserresponse().then(response => {
        chatbox.appendChild(createChatLi(response, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        // Now you can send the user's response to the server
        sendUserResponseToServer(response);
        console.log("welcome message function initialted");
    });
}


function AskMore() {
    const Query = "Sure! Let me know How can I help you.";
    chatbox.appendChild(createChatLi(Query, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);


    takinguserresponse().then(response => {
        chatbox.appendChild(createChatLi(response, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        // Now you can send the user's response to the server
        sendUserResponseToServer(response);
    });
}

let takinguserresponsive = true;


const takinguserresponse = () => {
    console.log("Function is Initiated Taking user response");
    return new Promise((resolve) => {
        const userInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.getElementById("send-btn");

        const handleEnterKey = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleUserResponse();
            }
        };

        const handleSendClick = () => {
            handleUserResponse();
        };

        const handleUserResponse = () => {
            const userMessage = userInput.value.trim();
            if (userMessage) {
                userInput.removeEventListener("keydown", handleEnterKey);
                sendChatBtn.removeEventListener("click", handleSendClick);
                resolve(userMessage);

                // Clear the input area after getting the response and resolving the promise
                userInput.value = "";
                AskotherQuestions();
            }
        };


        userInput.addEventListener("keydown", handleEnterKey);
        sendChatBtn.addEventListener("click", handleSendClick);



                // Set a timeout for 30 seconds
        const timeoutId = setTimeout(() => {
            // Remove the event listener for input
            userInput.removeEventListener("input", resetCreateButtonsTimer);
            // Initiate resetCreateButtonsTimer
            BookingADemoQuestion();

            // Stop user response collection
            takinguserresponsive = false;
        }, 35000);

        // Add an event listener for input
        userInput.addEventListener("input", () => {
            // Clear the timeout if user takes action
            clearTimeout(timeoutId);
        });
    });
};



function AskotherQuestions() {
    takinguserresponse().then(response => {
        chatbox.appendChild(createChatLi(response, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        // Now you can send the user's response to the server
        sendUserResponseToServer(response);
    });
}



function BookingADemoQuestion() {
    const Demo = "Would you like to schedule an estimate with us for your Project? Type 'Yes' or 'No'"
    chatbox.appendChild(createChatLi(Demo, "incoming"))
    chatbox.scrollTo(0, chatbox.scrollHeight);

    

    UserResponse().then(response => {

        chatbox.appendChild(createChatLi(response, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);


        const trimmedResponse = response.trim().toLowerCase();
        if (trimmedResponse === 'yes') {
            // Handle 'Yes' response

            DemoBooking();

            // AskAnything();
        } else if (trimmedResponse === 'no') {
            // Handle 'No' response
            AskforPhone();
        } else {
            // Handle any other response
            const invalidResponse = "Invalid response. Please type 'Yes' or 'No'.";
            chatbox.appendChild(createChatLi(invalidResponse, "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    });
}

function AskforPhone() {
    const Query = "Please leave us your number so that our Representative can contact you";
    chatbox.appendChild(createChatLi(Query, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    UserResponse().then(response => {
        chatbox.appendChild(response, "outgoing");
        chatbox.scrollTo(0, chatbox.scrollHeight);
    })
}



function ThankYouMessage() {
    const Thankyou = "Thank you! Our Representative will get back to you";
    chatbox.appendChild(createChatLi(Thankyou, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
}










//Demo Booking Function
const DemoBooking = () => {
    setTimeout(() => {
        const incomingChatLi = createChatLi('Please tell us the nature of the project', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const buttonData = [
            { text: 'Commercial' },
            { text: 'Residential' },
        ];


        buttonData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'show-info-btn';
            button.onclick = function() {
                selectedOption = item.text;
                showSelectedOptionText(item.text);

                if (item.text === 'Commercial') {
                    setTimeout(() => {
                        CommercialProject();
                    }, 1000);
                } else if (item.text === "Residential") {
                    setTimeout(() => {
                        ResidentialBooking();
                    })

                }else {
                    selectedOption = item.text; // Store the selected option in the variable
                    showSelectedOptionText(item.text);
                }
                sendFormDataToServer(selectedOption)
            };

            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = item.text;
            button.appendChild(buttonText);
            creatediv.appendChild(button);
        });

        chatbox.appendChild(creatediv);

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}



const CommercialProject = () => {
    ReadFileadnCreate();
    chatbox.scrollTo(0, chatbox.scrollHeight);

}



const ResidentialDatesGetting = () => {

    setTimeout(() => {
        ReadResidentialDates();
        chatbox.scroll(0, chatbox.scrollHeight);
    }, 600)
}





const ReadResidentialDates = async () => {
    let fileContent; // Define fileContent here

    LoadingChat();

    try {
        const response = await fetch('/scraping_residential_dates');
        console.log(response)
        fileContent = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch the file URL');
        }
    } catch (error) {
        console.error(error);
    }

    console.log(fileContent);

    let datesData = fileContent;

    function convertDataToButtons(data) {
        const daysData = {};

        for (const row of data) {
            const { Date: date, Day: day, Time: time } = row;
            if (!daysData[date]) {
                daysData[date] = { date, day, times: [] };
            }
            daysData[date].times.push(time);
        }

        const incomingChatLi = createChatLi('Available Dates are', 'incoming');
        chatbox.appendChild(incomingChatLi);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        for (const [date, dateData] of Object.entries(daysData)) {
            const { day } = dateData;

            const dateButton = document.createElement('button');
            dateButton.className = 'show-info-btn';
            dateButton.textContent = `${day}, ${date}`; // Concatenate day and date

            dateButton.onclick = function () {
                const clickedDate = dateButton.textContent; // Get the date from the clicked button

                const DateObj = new Date(date);
                datehandler(clickedDate);
                console.log(clickedDate);

                setTimeout(() => {
                    getAvailableTimesByDateRes(dateData, date);
                }, 800);
            };

            creatediv.appendChild(dateButton); // Append the button directly to the creatediv
        }

        chatbox.appendChild(creatediv); // Append the creatediv once after the loop
    }

    convertDataToButtons(datesData);

    chatbox.scrollTo(0, chatbox.scrollHeight);
};




const ReadFileadnCreate = async () => {
    let fileContent; // Define fileContent here

    LoadingChat()

    try {
        const response = await fetch('/scrape_dates_api');
        fileContent = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch the file URL');

            
        }
    } catch (error) {
        console.error(error);
    }

    console.log(fileContent);

    
    let dates_data = fileContent
  
    function convertDataToButtons(data) {
        const daysData = {};
    
        for (const row of data) {
            const { Date: date, Day: day, Time: time } = row;
            if (!daysData[date]) {
                daysData[date] = { date, day, times: [] };
            }
            daysData[date].times.push(time);
        }
    
        const incomingChatLi = createChatLi('Available Dates are', 'incoming');
        chatbox.appendChild(incomingChatLi);
      
        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';
      
        for (const [date, dateData] of Object.entries(daysData)) {
            const { day } = dateData;
    
            const date_button = document.createElement('button');
            date_button.className = 'show-info-btn';
            date_button.textContent = `${day}, ${date}`; // Concatenate day and date
        
            date_button.onclick = function () {
                const clickedDate = date_button.textContent; // Get the date from the clicked button
    
                const DateObj = new Date(date);
                datehandler(clickedDate);
                console.log(clickedDate);
    
                setTimeout(() => {
                    getAvailableTimesByDate(dateData, date);
                }, 800);
            };
    
            creatediv.appendChild(date_button); // Append the button directly to the creatediv
        }
    
        chatbox.appendChild(creatediv); // Append the creatediv once after the loop
    }
    
    convertDataToButtons(dates_data);
    
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };




//Handling the selected date variable
function datehandler(option) {

    const optionText = `The selected Date is: ${option}`;
    chatbox.appendChild(createChatLi(optionText, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);
    // Making an API Cal

    fetch('/available_date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_date: option }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Selected Date is:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /available_date:', error);
    });

}


function CorrectInfo() {
    setTimeout(() => {
        const incomingChatLi = createChatLi('Is everything you entered is correct?', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const buttonData = [
            { text: 'Yes, sure' },
            {text: 'I need to change'},
        ];


        buttonData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'show-info-btn';
            button.onclick = function() {
                selectedOption = item.text;
                showSelectedOptionText(item.text);

                if (item.text === 'Yes, sure') {
                        //Call the API here
                    fetch('/data_collection_details', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    })
                    .then(response => response.text())
                    .then(responseText => {
                        console.log('Response from data_collection_details:', responseText);
                        // Handle the API response here
                        submitLeadGenerationForm();
                    })
                    .catch(error => {
                        console.error('Error communicating with /data_collection_details:', error);
                    });
                } else if (item.text === "I need to change") {
                    setTimeout(() => {
                        CommercialFormFillingData();
                    })

                }else {
                    const incomingChatLi = createChatLi('Please share your Phone number', 'outgoing');
                    chatbox.appendChild(incomingChatLi);
                    chatbox.scrollTo(0, chatbox.scrollHeight)
                }
            };

            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = item.text;
            button.appendChild(buttonText);
            creatediv.appendChild(button);
        });

        chatbox.appendChild(creatediv);

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}




function ConfirmationForFormFilling() {
    setTimeout(() => {
        const incomingChatLi = createChatLi('We need to ask for few details to go ahead for confirming your appointment', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const buttonData = [
            { text: 'Yes, sure' },
            { text: 'Any Other Time' },
            { text: 'Cannot find the desired time' },
        ];


        buttonData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'show-info-btn';
            button.onclick = function() {
                selectedOption = item.text;
                showSelectedOptionText(item.text);

                if (item.text === 'Yes, sure') {
                        //Call the API here
                    // fetch('/data_collection_details', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify({}),
                    // })
                    // .then(response => response.text())
                    // .then(responseText => {
                    //     console.log('Response from data_collection_details:', responseText);
                    //     // Handle the API response here
                    //     // ...
                    // })
                    // .catch(error => {
                    //     console.error('Error communicating with /data_collection_details:', error);
                    // });

                    setTimeout(() => {
                        CommercialFormFillingData();
                    }, 1000);
                } else if (item.text === "Any Other Time") {
                    setTimeout(() => {

                        const incomingChatLi = createChatLi('Can you share your email address please', 'outgoing');
                        chatbox.appendChild(incomingChatLi);
                        chatbox.scrollTo(0, chatbox.scrollHeight)
                    })

                }else {
                    const incomingChatLi = createChatLi('Please share your Phone number', 'outgoing');
                    chatbox.appendChild(incomingChatLi);
                    chatbox.scrollTo(0, chatbox.scrollHeight)
                }
            };

            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = item.text;
            button.appendChild(buttonText);
            creatediv.appendChild(button);
        });

        chatbox.appendChild(creatediv);

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}



function ConfirmationForFormFillingRes() {
    setTimeout(() => {
        const incomingChatLi = createChatLi('We need to ask for few details to go ahead for confirming your appointment', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const buttonData = [
            { text: 'Yes, sure' },
            { text: 'Any Other Time' },
            { text: 'Cannot find the desired time' },
        ];


        buttonData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'show-info-btn';
            button.onclick = function() {
                selectedOption = item.text;
                showSelectedOptionText(item.text);

                if (item.text === 'Yes, sure') {
                        //Call the API here
                    // fetch('/date_scraping_func', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify({}),
                    // })
                    // .then(response => response.text())
                    // .then(responseText => {
                    //     console.log('Response from data_collection_details:', responseText);
                    //     // Handle the API response here
                    //     // ...
                    // })
                    // .catch(error => {
                    //     console.error('Error communicating with /data_collection_details:', error);
                    // });

                    setTimeout(() => {
                        ResidentialBookingLeads();
                    }, 1000);
                } else if (item.text === "Any Other Time") {
                    setTimeout(() => {

                        const incomingChatLi = createChatLi('Can you share your email address please', 'outgoing');
                        chatbox.appendChild(incomingChatLi);
                        chatbox.scrollTo(0, chatbox.scrollHeight)
                    })

                }else {
                    const incomingChatLi = createChatLi('Please share your Phone number', 'outgoing');
                    chatbox.appendChild(incomingChatLi);
                    chatbox.scrollTo(0, chatbox.scrollHeight)
                }
            };

            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = item.text;
            button.appendChild(buttonText);
            creatediv.appendChild(button);
        });

        chatbox.appendChild(creatediv);

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}

function CorrectResidentialInfo() {
    setTimeout(() => {
        const incomingChatLi = createChatLi('Is everything you entered is correct?', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const buttonData = [
            { text: 'Yes, sure' },
            { text: 'No, I would like to change'},
        ];


        buttonData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'show-info-btn';
            button.onclick = function() {
                selectedOption = item.text;
                showSelectedOptionText(item.text);

                if (item.text === 'Yes, sure') {
                        //Call the API here
                    fetch('/date_scraping_func', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    })
                    .then(response => response.text())
                    .then(responseText => {
                        console.log('Response from data_collection_details:', responseText);
                        // Handle the API response here
                        // ...
                    })
                    .catch(error => {
                        console.error('Error communicating with /data_collection_details:', error);
                    });

                    setTimeout(() => {
                        submitLeadGenerationForm();
                    }, 1000);
                } else if (item.text === "No, I would like to change'") {
                    setTimeout(() => {

                        ResidentialBookingLeads()
                    })

                }else {
                    const incomingChatLi = createChatLi('Please share your Phone number', 'outgoing');
                    chatbox.appendChild(incomingChatLi);
                    chatbox.scrollTo(0, chatbox.scrollHeight)
                }
            };

            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = item.text;
            button.appendChild(buttonText);
            creatediv.appendChild(button);
        });

        chatbox.appendChild(creatediv);

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}


//fetching the available dates
function getAvailableTimesByDate(dateData, inputDate) {
    const timechatli = `Available Times for ${inputDate}`;
    const timeLiCreated = createChatLi(timechatli, 'incoming');
    chatbox.appendChild(timeLiCreated);
    chatbox.scroll(0, chatbox.scrollHeight)

    const creativeDiv = document.createElement('div');
    creativeDiv.className = 'show-info';

    // Check if the inputDate matches the date in dateData
    if (dateData.date === inputDate) {
        const availableTimes = dateData.times;

        availableTimes.forEach(time => {
            const timeButton = document.createElement('button');
            timeButton.className = 'show-info-btn';
            timeButton.textContent = time.trim(); 


            timeButton.onclick = function() {
                selectedtime = timeButton.textContent;
                timeHandler(selectedtime);
                ConfirmationForFormFilling();
            }

            const timeText = document.createElement('p');
            timeText.className = 'class-info';
            
            timeButton.appendChild(timeText);
            creativeDiv.appendChild(timeButton);
        });

        // Append the creativeDiv to the chatbox
        chatbox.appendChild(creativeDiv);
        chatbox.scroll(0, chatbox.scrollHeight);
    } else {
        // If the inputDate does not match any date in dateData, display a message indicating no data available for that date
        const noDataMessage = `No available times for ${inputDate} (${dateData.day})`;
        const incomingquestiondiv = createChatLi(noDataMessage, 'outgoing');
        chatbox.appendChild(incomingquestiondiv);
        chatbox.scroll(0, chatbox.scrollHeight);
    }

}

function getAvailableTimesByDateRes(dateData, inputDate) {
    const timechatli = `Available Times for ${inputDate}`;
    const timeLiCreated = createChatLi(timechatli, 'incoming');
    chatbox.appendChild(timeLiCreated);
    chatbox.scroll(0, chatbox.scrollHeight)

    const creativeDiv = document.createElement('div');
    creativeDiv.className = 'show-info';

    // Check if the inputDate matches the date in dateData
    if (dateData.date === inputDate) {
        const availableTimes = dateData.times;

        availableTimes.forEach(time => {
            const timeButton = document.createElement('button');
            timeButton.className = 'show-info-btn';
            timeButton.textContent = time.trim(); 


            timeButton.onclick = function() {
                selectedtime = timeButton.textContent;
                timeHandler(selectedtime);
                ConfirmationForFormFillingRes();
            }

            const timeText = document.createElement('p');
            timeText.className = 'class-info';
            
            timeButton.appendChild(timeText);
            creativeDiv.appendChild(timeButton);
        });

        // Append the creativeDiv to the chatbox
        chatbox.appendChild(creativeDiv);
        chatbox.scroll(0, chatbox.scrollHeight);
    } else {
        // If the inputDate does not match any date in dateData, display a message indicating no data available for that date
        const noDataMessage = `No available times for ${inputDate} (${dateData.day})`;
        const incomingquestiondiv = createChatLi(noDataMessage, 'outgoing');
        chatbox.appendChild(incomingquestiondiv);
        chatbox.scroll(0, chatbox.scrollHeight);
    }

}

//handling the input of the time
function timeHandler(inputtime) {
    const selectedtime = `${inputtime}`;
    const timeselectionchat = createChatLi(selectedtime, 'outgoing');
    chatbox.appendChild(timeselectionchat);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Make an API call to /get_time with the selectedtime value
    fetch('/get_time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_time: selectedtime }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Selected Time is:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_time:', error);
    });
}



//making loading chat function
function LoadingChat() {
    const LoadingStr = `Loading...`;
    const LoadingChat = createChatLi(LoadingStr, 'incoming');
    chatbox.append(LoadingChat);
    chatbox.scroll(0, chatbox.scrollHeight)
}








async function servicesRequired() {
    const incomingChatLi = createChatLi('Please tell us about the services required', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';

    const button_Data = [
        { text: 'Interior Painting' },
        { text: 'Exterior Painting' },
        { text: 'Others' },
    ];

    for (const item of button_Data) {
        const buttons = document.createElement('button');
        buttons.className = 'show-info-btn';
        buttons.onclick = async function() {
            var selected_service = item.text;
            console.log(selected_service);

            chatbox.appendChild(createChatLi(selected_service, 'outgoing')); // Show as outgoing message
            chatbox.scrollTo(0, chatbox.scrollHeight);
            emailAdress();
            try {
                const response = await fetch('/desired_service', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ service: selected_service }),
                });

                const responseText = await response.text();
                console.log('You Entered:', responseText);
                // Handle the API response here
                // ...
            } catch (error) {
                console.error('Error communicating with /desired_service:', error);
            }
        };

        const buttonText = document.createElement('p');
        buttonText.className = 'class-info';
        buttonText.textContent = item.text;
        buttons.appendChild(buttonText);
        creatediv.appendChild(buttons);
    }

    chatbox.appendChild(creatediv);
    chatbox.scrollTo(0, chatbox.scrollHeight);
}



  
const getUserResponse = () => {
    return new Promise((resolve) => {
        const userInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.getElementById("send-btn");

        const handleEnterKey = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                const userMessage = userInput.value.trim();
                if (userMessage) {
                    userInput.removeEventListener("keydown", handleEnterKey);
                    resolve(userMessage);

                    // Clear the input area after getting the response and resolving the promise
                    userInput.value = "";
                }
            }
        };

        const handleSendClick = () => {
            const userMessage = userInput.value.trim();
            if (userMessage) {
                sendChatBtn.removeEventListener("click", handleSendClick);
                resolve(userMessage);

                // Clear the input area after getting the response and resolving the promise
                userInput.value = "";
            }
        };

        userInput.addEventListener("keydown", handleEnterKey);
        sendChatBtn.addEventListener("click", handleSendClick);
    });
};


// sendChatBtn.addEventListener("click", () => {
//     getUserResponse()
//         .then(userResponse => {
//             // Do something with the user's response, e.g., send it to a chat server
//             console.log("User response:", userResponse);
//         })
//         .catch(error => {
//             // Handle any errors that might occur
//             console.error("Error:", error);
//         });
// });



  

  
// ... (Other code remains unchanged)

const simulateResponseDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};



const submitLeadGenerationForm = () => {
    const incomingChatLi = createChatLi('Your Request has been submitted', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
};

function showSelectedOptionText(option) {

    const optionText = `${selectedOption}`;
    chatbox.appendChild(createChatLi(optionText, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


}

const askJobRequirement = async () => {

    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';
  
    const JobsText = [
      { text: "Interior Painting" },
      { text: "Exterior Painting" },
      { text: "Others" }
    ];
  
    JobsText.forEach(itemData => {
      const jobs = document.createElement('button');
      jobs.className = 'show-info-btn';
      jobs.textContent = itemData.text;
  
      jobs.onclick = async function() {
        var selectedOption = itemData.text;
        showSelectedOptionText(selectedOption);
  
        // Continue with the rest of the form
        questionIndex++;
        await handleFormData();
      };
  
      creatediv.appendChild(jobs);
  
      chatbox.appendChild(creatediv);
    });
  
    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };
  


  const askJobRequirementKansasMissouri = async () => {
    const incomingChatLi = createChatLi('Please tell us about yuor state', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';
  
    const JobsText = [
      { text: "Kansas" },
      { text: "Missouri" }
    ];
  
    JobsText.forEach(itemData => {
      const jobs = document.createElement('button');
      jobs.className = 'show-info-btn';
      jobs.textContent = itemData.text;
  
      jobs.onclick = async function() {
        selected_state = itemData.text;

        chatbox.appendChild(createChatLi(selected_state, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);
        zipcode();

        fetch('/get_state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ EnteredState : selected_state }),
        })
        .then(response => response.text())
        .then(responseText => {
            console.log('You Entered:', responseText);
            // Handle the API response here
            // ...
        })
        .catch(error => {
            console.error('Error communicating with /first_name:', error);
        });
      };
  
      creatediv.appendChild(jobs);
  
      chatbox.appendChild(creatediv);
    });
  
    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };




const askJobRequirementKansasMissouriR = async () => {
    const incomingChatLi = createChatLi('Please tell us about yuor state', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';
  
    const JobsText = [
      { text: "Kansas" },
      { text: "Missouri" }
    ];
  
    JobsText.forEach(itemData => {
      const jobs = document.createElement('button');
      jobs.className = 'show-info-btn';
      jobs.textContent = itemData.text;
  
      jobs.onclick = async function() {
        selected_state = itemData.text;

        chatbox.appendChild(createChatLi(selected_state, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);
        zipcodeR();

        fetch('/get_state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ EnteredState : selected_state }),
        })
        .then(response => response.text())
        .then(responseText => {
            console.log('You Entered:', responseText);
            // Handle the API response here
            // ...
        })
        .catch(error => {
            console.error('Error communicating with /first_name:', error);
        });
      };
  
      creatediv.appendChild(jobs);
  
      chatbox.appendChild(creatediv);
    });
  
    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };


const askWhereHearAboutUs = async () => {

    const incomingChatLi = createChatLi('Please tell us where you heard about us', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';

    const sources = [
        { text: "Angie's List" },
        { text: "Google" },
        { text: "Zaarly" },
        { text: "Previous Client or Referral" },
        { text: "Yelp" },
        { text: "Yard Sign/Flyer" },
        { text: "Saw The Truck/Van" },
        { text: "BN" },
        { text: "Nextdoor" },
        { text: "Other" }
    ];

    sources.forEach(itemData => {
        const source = document.createElement('button');
        source.className = 'show-info-btn';
        source.textContent = itemData.text;

        source.onclick = async function() {
        selectedChannel = itemData.text;
        chatbox.appendChild(createChatLi(selectedChannel, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);

        ProjecDesc();


        fetch('/chennel_getter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ EnterChannel : selectedChannel }),
        })
        .then(response => response.text())
        .then(responseText => {
            console.log('You Entered:', responseText);
            // Handle the API response here
            // ...
        })
        .catch(error => {
            console.error('Error communicating with /first_name:', error);
        });
      };


        creatediv.appendChild(source);

        chatbox.appendChild(creatediv);
    });

    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
    };


    const askWhereHearAboutUsR = async () => {

        const incomingChatLi = createChatLi('Please tell us where you heard about us', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    
        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';
    
        const sources = [
            { "text": "Angie's List" },
            { "text": "Google" },
            { "text": "Google Ad" },
            { "text": "I am a Previous Client" },
            { "text": "Yard Sign/Flyer" },
            { "text": "Saw The Truck/Van" },
            { "text": "Nextdoor" },
            { "text": "Door Hanger/Door to Door Contact" },
            { "text": "Life 88.5 Radio Ad" },
            { "text": "Follow Up Call" },
            { "text": "Customer Referral (please tell us who in the 'Project Description' box below)" },
            { "text": "Paint Store Referral" },
            { "text": "Facebook ad" },
            { "text": "Other" }
        ];
        
    
        sources.forEach(itemData => {
            const source = document.createElement('button');
            source.className = 'show-info-btn';
            source.textContent = itemData.text;
    
            source.onclick = async function() {
            selectedChannel = itemData.text;
            chatbox.appendChild(createChatLi(selectedChannel, 'outgoing')); // Show as outgoing message
            chatbox.scrollTo(0, chatbox.scrollHeight);
    
            ProjecDescR();
    
    
            fetch('/chennel_getter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ EnterChannel : selectedChannel }),
            })
            .then(response => response.text())
            .then(responseText => {
                console.log('You Entered:', responseText);
                // Handle the API response here
                // ...
            })
            .catch(error => {
                console.error('Error communicating with /first_name:', error);
            });
          };
    
    
            creatediv.appendChild(source);
    
            chatbox.appendChild(creatediv);
        });
    
        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
        };

//Helper for sending form data to Server

function sendFormDataToServer(data) {
    fetch('/receive_data', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log("Response from server:", responseText);
    })
    .catch(error => {
        console.error("Error:", error);
    });
    }





const ResidentialBooking = () => {
    setTimeout(() => {
        const incomingChatLi = createChatLi('Please tell us about the services required', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const creatediv = document.createElement('div');
        creatediv.className = 'show-info';

        const button_Data = [
            { text: 'Full Exterior Consultation' },
            { text: 'Full or Large *Interior Consultation' },
            { text: 'Small Interior (3-4 rooms) Consultation' },
        ];

        button_Data.forEach(items => {
            const buttons = document.createElement('button');
            buttons.className = 'show-info-btn';
            buttons.onclick = function() {
                selectedOption_service = items.text;


                chatbox.appendChild(createChatLi(selectedOption_service, 'outgoing')); // Show as outgoing message
                chatbox.scrollTo(0, chatbox.scrollHeight);


                fetch('/residential_service', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Entered_Service : selectedOption_service }),
                })
                .then(response => response.text())
                .then(responseText => {
                    console.log('You Entered:', responseText);
                    // Handle the API response here
                    // ...
                })
                .catch(error => {
                    console.error('Error communicating with /first_name:', error);
                });
              


                askresidentialCity();

            };


            const buttonText = document.createElement('p');
            buttonText.className = 'class-info';
            buttonText.textContent = items.text;
            buttons.appendChild(buttonText);
            creatediv.appendChild(buttons);
        });

        chatbox.appendChild(creatediv);
        

        // Scroll to the bottom after adding the buttons
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);


}


const askresidentialCity = async () => {

    const incomingChatLi = createChatLi('Please select the state', 'incoming')
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);


    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';
  
    const JobsText = [
      { text: "Kansas" },
      { text: "Missouri" }
    ];
  
    JobsText.forEach(itemData => {
      const jobs = document.createElement('button');
      jobs.className = 'show-info-btn';
      jobs.textContent = itemData.text;
  
      jobs.onclick = async function() {
        selectedStateOption = itemData.text;

        chatbox.appendChild(createChatLi(selectedStateOption, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);


        fetch('/get_state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Selected_State : selectedStateOption }),
        })

        .then(response => response.text())
        .then(responseText => {
            console.log('You Entered:', responseText);
            // Handle the API response here
            // ...
        })
        .catch(error => {
            console.error('Error communicating with /first_name:', error);
        });
        ResidentialDatesGetting();
      };
  
      creatediv.appendChild(jobs);
  
      chatbox.appendChild(creatediv);
    });
  
    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };



const handleResidentialFormData = async () => {

    try {
        const response = await fetch('/scrape_dates_api');

        if (!response.ok) {
            throw new Error('Failed to fetch the file URL');
        }
        const file_URL = await response.json();

        console.log(file_URL)

        function convertDataToButtons(data) {
            const daysData = {};

            for (const row of data) {
                const { Date: date, Day: day, Time: time } = row;
                if (!daysData[date]) {
                    daysData[date] = { date, day, times: [] };
                }
                daysData[date].times.push(time);
            }
          
            const incomingChatLi = createChatLi('Available Dates are', 'incoming');
            chatbox.appendChild(incomingChatLi);
          
            const creatediv = document.createElement('div');
            creatediv.className = 'show-info';
          
            for (const [date, dateData] of Object.entries(daysData)) {
              const { day } = dateData;
          
              const date_button = document.createElement('button');
              date_button.className = 'show-info-btn';
              date_button.textContent = date;
          
              date_button.onclick = function () {
                const clickedDate = date_button.textContent; // Get the date from the clicked button
          
                const DateObj = new Date(clickedDate);
                datehandler(DateObj);
                console.log(clickedDate);
          
                setTimeout(() => {
                  getAvailableTimesByDate(dateData, clickedDate);
                }, 800);
              };
          
              const buttonDate = document.createElement('p');
              buttonDate.className = 'class-info';
              buttonDate.appendChild(date_button);
              creatediv.appendChild(buttonDate);
              chatbox.appendChild(creatediv);
            }
          }
          

        convertDataToButtons(file_URL);
    } catch (error) {
        console.error(error);
    }
};



const ResJobRequirement = async () => {

    const incomingChatLi = createChatLi('Please tell us about the services required', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const creatediv = document.createElement('div');
    creatediv.className = 'show-info';
  
    const JobsText = [
      { text: "Interior Painting" },
      { text: "Exterior Painting" },
      { text: "Wood Repair"},
      { text: "Others" }
    ];
  
    JobsText.forEach(itemData => {
      const jobs = document.createElement('button');
      jobs.className = 'show-info-btn';
      jobs.textContent = itemData.text;
  
      jobs.onclick = async function() {
        var selectedOption = itemData.text;
        chatbox.appendChild(createChatLi(selectedOption, 'outgoing')); // Show as outgoing message
        chatbox.scrollTo(0, chatbox.scrollHeight);
    

        fetch('/residential_services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ RequiredService : selectedOption }),
        })
        .then(response => response.text())
        .then(responseText => {
            console.log('You Entered:', responseText);
            // Handle the API response here
            // ...
        })
        .catch(error => {
            console.error('Error communicating with /residential_services:', error);
        });
        emailAdressR();
      };
  
      creatediv.appendChild(jobs);
      chatbox.appendChild(creatediv);
    });
  
    // Scroll to the bottom after adding the buttons
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };
  

async function CommercialFormFillingData() {
    try {
        await firstName();
        await lastName();
        await servicesRequired();

                 // ... Call other functions as needed
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// --------------------APIs for Lead Data Generation------------------------------


async function firstName() {
    const incomingChatLi = createChatLi('Please Enter your First Name', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const FirstName = await getUserResponse();
    chatbox.appendChild(createChatLi(FirstName, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/first_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_Name : FirstName }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    
}


async function lastName() {
    const incomingChatLi = createChatLi('Please Enter your Last Name', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const lastName = await getUserResponse();
    chatbox.appendChild(createChatLi(lastName, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/last_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastName : lastName }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    
}

async function emailAdress() {
    const incomingChatLi = createChatLi('Your Email Address', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const emailadd = await getUserResponse();
    chatbox.appendChild(createChatLi(emailadd, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_add : emailadd }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_email:', error);
    });
    cell_phone()
}

async function emailAdressR() {
    const incomingChatLi = createChatLi('Your Email Address', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const emailadd = await getUserResponse();
    chatbox.appendChild(createChatLi(emailadd, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_add : emailadd }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_email:', error);
    });
    cell_phoneR()
}


async function cell_phone() {
    const incomingChatLi = createChatLi('Please Enter your Cell Phone for Texting', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const call_num = await getUserResponse();
    chatbox.appendChild(createChatLi(call_num, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_cell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cell_phone_num : call_num }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_cell:', error);
    });
    cell_phone_other()
}

async function cell_phoneR() {
    const incomingChatLi = createChatLi('Please Enter your Cell Phone for Texting', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const call_num = await getUserResponse();
    chatbox.appendChild(createChatLi(call_num, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_cell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cell_phone_num : call_num }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_cell:', error);
    });
    cell_phone_otherR()
}


async function cell_phone_other() {
    const incomingChatLi = createChatLi('Please Enter your Other Cell Phone', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const call_num_oth = await getUserResponse();
    chatbox.appendChild(createChatLi(call_num_oth, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_cell_other', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cell_phone_others : call_num_oth }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    street_address();
}

async function cell_phone_otherR() {
    const incomingChatLi = createChatLi('Please Enter your Other Cell Phone', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const call_num_oth = await getUserResponse();
    chatbox.appendChild(createChatLi(call_num_oth, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_cell_other', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cell_phone_others : call_num_oth }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    street_addressR();
}

async function street_address() {
    const incomingChatLi = createChatLi('Please Provide us your Street Address', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const st_address = await getUserResponse();
    chatbox.appendChild(createChatLi(st_address, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_street_address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ street_addresses : st_address }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    city_enter();
}

async function street_addressR() {
    const incomingChatLi = createChatLi('Please Provide us your Street Address', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const st_address = await getUserResponse();
    chatbox.appendChild(createChatLi(st_address, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_street_address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ street_addresses : st_address }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    city_enterR();
}

async function city_enter() {
    const incomingChatLi = createChatLi('Your City Please', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const citys = await getUserResponse();
    chatbox.appendChild(createChatLi(citys, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_city', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ City : citys }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_city:', error);
    });
    askJobRequirementKansasMissouri();
}

async function city_enterR() {
    const incomingChatLi = createChatLi('Your City Please', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const citys = await getUserResponse();
    chatbox.appendChild(createChatLi(citys, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/get_city', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ City : citys }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /get_city:', error);
    });
    askJobRequirementKansasMissouriR();
}





async function zipcode() {
    const incomingChatLi = createChatLi('Please Enter Zip Code', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const zipcodenum = await getUserResponse();
    chatbox.appendChild(createChatLi(zipcodenum, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/entered_zip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ZipCode : zipcodenum }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /etntered_zip:', error);
    });
    askWhereHearAboutUs();
}


async function zipcodeR() {
    const incomingChatLi = createChatLi('Please Enter Zip Code', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const zipcodenum = await getUserResponse();
    chatbox.appendChild(createChatLi(zipcodenum, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/entered_zip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ZipCode : zipcodenum }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /etntered_zip:', error);
    });
    askWhereHearAboutUsR();
}

async function ProjecDesc() {
    const incomingChatLi = createChatLi('Tell us about the nature of Project', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const project_desc = await getUserResponse();
    chatbox.appendChild(createChatLi(project_desc, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/project_description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProjDesc : project_desc }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });

    CorrectInfo();
}


async function ProjecDescR() {
    const incomingChatLi = createChatLi('Tell us about the nature of Project', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const project_desc = await getUserResponse();
    chatbox.appendChild(createChatLi(project_desc, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/project_description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProjDesc : project_desc }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });

    CorrectResidentialInfo();
}






//--------------------------Residential Booking Data-----------------------------------

async function lastNameRes() {
    const incomingChatLi = createChatLi('Please Enter your Last Name', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const lastName = await getUserResponse();
    chatbox.appendChild(createChatLi(lastName, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/last_name_res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_Name : lastName }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /first_name:', error);
    });
    
}


async function DecisionMakerName() {
    const incomingChatLi = createChatLi('Please Enter the Name of Decision Maker', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const Decisionname = await getUserResponse();
    chatbox.appendChild(createChatLi(Decisionname, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/spouse_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DecionName : Decisionname }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /spouse_name:', error);
    });
    
}


async function DecisionMakerNum() {
    const incomingChatLi = createChatLi('Please Enter Phone number of Decision Maker / Spouse', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const dec_num = await getUserResponse();
    chatbox.appendChild(createChatLi(dec_num, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/spouse_phone_num', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DecisonNum : dec_num }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /spouse_phone_num:', error);
    });
    
}

async function DecisionMakerEmail() {
    const incomingChatLi = createChatLi('Please enter email of Decision Maker / Spouse', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const DecMail = await getUserResponse();
    chatbox.appendChild(createChatLi(DecMail, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/spouse_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Dec_Mails : DecMail }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /spouse_email:', error);
    });
    
}

async function EnterCoupon() {
    const incomingChatLi = createChatLi('Please enter and Type 0000 in case you have none', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const lastName = await getUserResponse();
    chatbox.appendChild(createChatLi(lastName, 'outgoing')); // Show as outgoing message
    chatbox.scrollTo(0, chatbox.scrollHeight);


    fetch('/couponcode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_Name : lastName }),
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('You Entered:', responseText);
        // Handle the API response here
        // ...
    })
    .catch(error => {
        console.error('Error communicating with /spouse_email:', error);
    });

    CorrectResidentialInfo();
    
}


async function ResidentialBookingLeads() {

    await firstName();
    await lastNameRes();
    await DecisionMakerName();
    await DecisionMakerNum();
    await DecisionMakerEmail();
    await ResJobRequirement();
}






closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
// Add this code to your JavaScript file
document.addEventListener("DOMContentLoaded", function() {
    // The DOMContentLoaded event ensures that the page has fully loaded before executing this code.
    // Call the AskAnything function when the chatbot is opened
    chatbotToggler.addEventListener("click", function() {
        // Check if the chatbot is being opened
        if (document.body.classList.contains("show-chatbot")) {
            WelcomeMessage();
        }
    });
});
