from flask import Flask, render_template, request, jsonify,session
import sys
import os
import json
from datetime import datetime
import re
# Get the current directory of the script (app.py)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Add the PythonBot folder to the Python path
pythonbot_folder = os.path.join(current_dir, 'PythonBot')
sys.path.append(pythonbot_folder)


# python_chatbot_folder = os.path.join(current_dir, "ChatBotDev")
# sys.path.append(python_chatbot_folder)

from commercial_booking_bot import link_graper_function,scraping_available_dates, selecting_date_shifting_url, selecting_check_box_by_value, click_submit_button
from residential_booking_bot import Residential_graper_function, scraping_residential_dates, page_clicking_module, selectingCity, selecting_date_shifting_res,Residential_Form
import os
from dotenv import load_dotenv
import openai

#
load_dotenv()

# Access environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")


retrieve_response = openai.FineTune.retrieve(id="ft-4xstIXhZgaMTvrUqMMxgd7Ki")
retrieve_response

fine_tuned_model = retrieve_response.fine_tuned_model
fine_tuned_model



# Load the environment variables from the .env file
load_dotenv()

# Get the API key from the environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')



app = Flask(__name__)
app.secret_key = "016998ef5353a852abb1c47318fa804979509dfdbaf9a2e901599452dec254c8"





# Initialize a global dictionary to store cached responses
cached_responses = {}

def generate_response(prompt, fine_tuned_model):
    # Check if a response is already cached for the prompt
    if prompt in cached_responses:
        return cached_responses[prompt]

    try:
        response = openai.Completion.create(
            model=fine_tuned_model,
            prompt=prompt,
            max_tokens=100,  # Adjust the value as needed
            temperature=0.7  # Adjust the value as needed
        )

        generated_text = response['choices'][0]['text']
        
        # Cache the response for the prompt
        cached_responses[prompt] = generated_text
        
        return generated_text
    except Exception as e:
        print("Error:", e)
        return None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/chatbot_generator', methods=['POST'])
def chatbot_response():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        text = generate_response(prompt, fine_tuned_model=fine_tuned_model)
        print(text)
        text = text.replace("###", "").replace("$$$", "").replace("$$", "").replace("##", "").replace("?", "")
        # Remove extra whitespace and newline characters
        text = re.sub(r'\n+', '\n', text).strip()
        response = text
        print(response)
        return jsonify({'response': response})




@app.route('/button_click', methods=['POST'])
def handle_button_click():
    # Your logic to handle the button click goes here
    # You can process the data from the frontend and return a response
    print(jsonify)
    return jsonify({"message": "Button clicked!"})



@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.json  # Assuming you are sending JSON data from JavaScript
    print("Received data from JavaScript:", data)
    return data


@app.route('/scrape_dates_api', methods=['GET'])
def scraping_dates_commercial():
    try:
        driver = link_graper_function()
        data = scraping_available_dates(driver)  # You need to initialize the 'driver' variable
        data_dict_list = data.to_dict(orient='records')
        print(data_dict_list)

        return data_dict_list
    except Exception as e:
        return jsonify({'error': str(e)})





@app.route('/available_date', methods=['POST'])
def get_available_date():
    data = request.json
    session['available_date_data'] = data  # Store data in session
    response_data = {
        "message": "Data received successfully",
        "received_data": data,
        "available_date": data  # You might want to process this data before storing
    }
    print(response_data)
    return jsonify(response_data)





@app.route('/get_time', methods=['POST'])
def get_available_time():
    data = request.json
    print(data)
    session['avaliable_time_data'] = data  # Store data in session
    print(session['avaliable_time_data'])
    response_data = {
        "message": "Data received successfully",
        "received_data": data,
        "available_time": data  # You might want to process this data before storing
    }
    print(response_data)
    return jsonify(response_data)






@app.route('/data_collection_details', methods=['POST'])
def lead_generation():
    driver_link = bookingPageTransfer()
# Split the driver_link string into parts
    parts = driver_link.split(', ')

    # Extract individual components
    day = parts[0]
    date = parts[1]
    time_and_meridiem = parts[2]
    First_Name = parts[3]
    Last_Name  = parts[4]
    checkbox_value_to_select  = parts[5]
    Email_address  = parts[6]
    Mobile_Number  = parts[7]
    Other_Phone_Number  = parts[8]
    Address  = parts[9]
    City  = parts[10]
    State = parts[11]
    ZipCode  = parts[12]
    HeardAbout  = parts[13]
    ProjectDescription  = parts[14]

    
    print(HeardAbout)

    date_str = date
    formatted_date = convert_date(date_str)


    # Split the time_and_meridiem further to get time and meridiem

    print("Day:", day)
    print("Date:", date)
    print("Time:", time_and_meridiem)
    driver = link_graper_function()
    date_time_driver = selecting_date_shifting_url(driver, day, formatted_date, time_and_meridiem)
    data_entered =  click_submit_button(date_time_driver, First_Name, Last_Name, checkbox_value_to_select, Email_address, Mobile_Number, Other_Phone_Number, Address, City, State, ZipCode, HeardAbout, ProjectDescription)




    return "passed"



def bookingPageTransfer():
    # Access stored session data
    available_date_data = session.get('available_date_data', {})
    available_time_data = session.get('avaliable_time_data', {})  # Corrected variable name
    available_first_name = session.get('firstname_data', {})
    available_last_name = session.get('lastname',{})
    available_desired_service = session.get('desired_service', {})
    available_email_address = session.get('get_email', {})
    available_phone_number = session.get('get_cellphone', {})
    available_other_number = session.get('get_cell_other', {})
    available_street_addrr = session.get('st_address', {})
    available_city = session.get('city_getter', {})
    available_state = session.get('state_getter', {})
    available_zip_code = session.get('zip_code', {})
    available_channel = session.get('desired_channel', {})
    available_project = session.get('project_descrip', {})


    print("Available Date Data:", available_date_data)
    print("Available Time Data:", available_time_data)
    print("Available First Name:", available_first_name)
    # Extract the selected_time value
    selected_date_value = available_date_data.get('selected_date', '')

    # Split the selected_date_value into parts
    day, date = selected_date_value.split(', ')

    # Extract time from available_time_data
    time = available_time_data.get('selected_time', '')




    firstname = available_first_name.get('first_Name','')
    lastname = available_last_name.get('last_Name', '')
    
    service_required = available_desired_service.get('service', {})
    email_required = available_email_address.get('email_add', {})
    firstphone = available_phone_number.get('cell_phone_num', {})
    otherphone = available_other_number.get('cell_phone_others')
    streetaddr = available_street_addrr.get('street_addresses')
    city = available_city.get('City')
    state = available_state.get('selected_state')
    Zipcode = available_zip_code.get('zipcodenum')
    channel = available_channel.get('EnterChannel')
    projectdesc = available_project.get('ProjDesc')



    print("Full date:", selected_date_value)
    print("Day:", day)
    print("Date:", date)
    print("Time:", time)

    combined_value = f"{day}, {date}, {time}, {firstname}, {lastname}, {service_required}, {email_required}, {firstphone}, {otherphone}, {streetaddr}, {city}, {state}, {Zipcode}, {channel}, {projectdesc}"
    return combined_value


def convert_date(input_date_str):
    parsed_date = datetime.strptime(input_date_str, "%m/%d/%y")
    formatted_date = parsed_date.strftime("%Y-%m-%d")
    return formatted_date



@app.route('/first_name', methods=['POST'])
def first_name():
    firstname = request.json
    session['firstname_data'] = firstname
    print(firstname)
    return jsonify(success=True)

@app.route('/last_name', methods=['POST'])
def last_name():
    lastname = request.json
    session['lastname'] = lastname
    print(lastname)
    return jsonify(success=True)



@app.route('/desired_service', methods=['POST'])
def desiredService():
    desired_service = request.json
    session['desired_service'] = desired_service
    print(desired_service)
    return jsonify(success=True)


@app.route('/get_email', methods=['POST'])
def emailgetter():
    emailadd = request.json
    session['get_email'] = emailadd
    print(emailadd)
    return jsonify(success=True)


@app.route('/get_cell', methods=['POST'])
def cellgetter():
    cellphone = request.json
    session['get_cellphone'] = cellphone
    print(cellphone)
    return jsonify(success=True)


@app.route('/get_cell_other', methods=['POST'])
def othercellgtter():
    cell_other = request.json
    session['get_cell_other'] = cell_other
    print(cell_other)
    return jsonify(success=True)

@app.route('/get_street_address', methods=['POST'])
def streetadressgetter():
    street_address = request.json
    session['st_address'] = street_address
    print(street_address)
    return jsonify(success=True)


@app.route('/get_city', methods=['POST'])
def citygetter():
    get_city = request.json
    session['city_getter'] = get_city
    print(get_city)
    return jsonify(success=True)


@app.route('/get_state', methods=['POST'])
def stategetter():
    state_get = request.json
    session['state_getter'] = state_get
    print(state_get)
    return jsonify(success=True)



@app.route('/entered_zip', methods=['POST'])
def zipgetter():
    zip_code_enteed = request.json
    session['zip_code'] = zip_code_enteed
    print(zip_code_enteed)
    return jsonify(success=True)


@app.route('/chennel_getter', methods=['POST'])
def channelGetter():
    channel_entered = request.json
    session['desired_channel'] = channel_entered
    print(channel_entered)
    return jsonify(success=True)


@app.route('/project_description', methods=['POST'])
def PeojectDescription():
    Project_Description = request.json
    session['project_descrip'] = Project_Description
    print(Project_Description)
    return jsonify(success=True)




# Residential APis
@app.route('/residential_service', methods=['POST'])
def ResidentialServices():
    residential_serv = request.json
    session['resident_service'] = residential_serv
    print(residential_serv)
    return jsonify(success=True)


@app.route('/scraping_residential_dates', methods=['GET', 'POST'])
def residential_date_scraping():
    try:
        driver_ignition = ResidentialDateCollection()
        # Split the driver_link string into parts
        part = driver_ignition.split(', ')
        service = part[0]
        stateoption = part[1]






        print(stateoption)

        driver = Residential_graper_function()
        data = page_clicking_module(driver, service)
        stateshifting = selectingCity(data, stateoption)
        scraped_dates = scraping_residential_dates(stateshifting)  # You need to initialize the 'driver' variable
        data_dict_list = scraped_dates.to_dict(orient='records')
        print(data_dict_list)

        return data_dict_list
    except Exception as e:
        return jsonify({'error': str(e)})







@app.route('/date_scraping_func', methods=['POST'])
def dateclickingFunction():
    try:
        print('------------Igniting the driver------------------')
        driver_ignitions = datacollection()
        # Split the driver_link string into parts
        partss = driver_ignitions.split(', ')
        print(partss)

        driver_ignition_part = ResidentialDateCollection()
        # Split the driver_link string into parts
        other_parts = driver_ignition_part.split(', ')
        print(other_parts)
        try:
            Service, State = other_parts 
            day, date_string, time, FirstName, LastNem, spouse, Spouse_num, spouse_addr, service_desired, email_add, cell_phone, home_phone, Str_addres, city, state, zipcode, channel, Description = partss

            date = convert_date(date_string)

            print("Service:", Service)
            print("State:", state)
            print("Day:", day)
            print("Date String:", date_string)
            print("Time:", time)
            print("First Name:", FirstName)
            print("Last Name:", LastNem)
            print("Spouse:", spouse)
            print("Spouse Number:", Spouse_num)
            print("Spouse Address:", spouse_addr)
            print("Service Desired:", service_desired)
            print("Email Address:", email_add)
            print("Cell Phone:", cell_phone)
            print("Home Phone:", home_phone)
            print("Street Address:", Str_addres)
            print("City:", city)
            print("State:", state)
            print("Zipcode:", zipcode)
            print("Channel:", channel)
            print("Description:", Description)
        except Exception as e:
            print("Errors", e)
        driver = Residential_graper_function()
        data = page_clicking_module(driver, Service)
        stateshifting = selectingCity(data, state)
        date_selection = selecting_date_shifting_res(stateshifting, day, date, time)
        try:
           residetnial_leads = Residential_Form(date_selection, FirstName, LastNem, spouse, Spouse_num, spouse_addr, service_desired, email_add, cell_phone, home_phone, Str_addres, city, state, zipcode, channel, Description)
        except Exception as e:
            print("Exception was", e)
  # Printing for debugging purposes
        return "passed"
    except Exception as e:
        return jsonify({'error': str(e)})





@app.route('/last_name_res', methods = ['POST'])
def gettingreslastname():
    last_res = request.json
    session['lastnamer'] = last_res
    print(last_res)
    return jsonify(success=True)



@app.route('/spouse_name', methods = ['POST'])
def gettingSpousename():
    spouse_nam = request.json
    session['spousename'] = spouse_nam
    print(spouse_nam)
    return jsonify(success=True)


@app.route('/spouse_phone_num', methods = ['POST'])
def gettingSpousenum():
    spouse_num = request.json
    session['spousenum'] = spouse_num
    print(spouse_num)
    return jsonify(success=True)

@app.route('/spouse_email', methods = ['POST'])
def gettingSpousemail():
    spouse_mail = request.json
    session['spousemail'] = spouse_mail
    print(spouse_mail)
    return jsonify(success=True)


@app.route('/residential_services', methods = ['POST'])
def gettingrequiredservice():
    ResidentialService = request.json
    session['Resident_Service'] = ResidentialService
    print(ResidentialService)
    return jsonify(success=True)


@app.route('/couponcode', methods = ['POST'])
def coponcode():
    c_code = request.json
    session['coup_code'] = c_code
    print(c_code)
    return jsonify(success=True)





def ResidentialDateCollection():

    requiredResidentialSerivce = session.get('resident_service', {})
    desiredStateEntered = session.get('state_getter', {})
    #available_date_data = session.get('available_date_data', {})
    #available_time_data = session.get('avaliable_time_data', {})  # 

    Residential_serivce = requiredResidentialSerivce.get('Entered_Service')
    State_Desired = desiredStateEntered.get('Selected_State')
    #selected_date_value = available_date_data.get('selected_date', '')

    # Split the selected_date_value into parts
    #day, date = selected_date_value.split(', ')

    # Extract time from available_time_data
    #time = available_time_data.get('selected_time', '')

    combined_data_res = f"{Residential_serivce}, {State_Desired}"
    print(combined_data_res)
    return combined_data_res



def datacollection():
    available_date_data = session.get('available_date_data', {})
    available_time_data = session.get('avaliable_time_data', {})  # 
    available_first_name = session.get('firstname_data', {})
    available_last_name = session.get('lastnamer',{})
    available_spouse_name = session.get('spousename',{})
    available_spouse_num = session.get('spousenum',{})
    available_spouse_email = session.get('spousemail',{})
    available_desired_service = session.get('Resident_Service', {})
    available_email_address = session.get('get_email', {})
    available_phone_number = session.get('get_cellphone', {})
    available_other_number = session.get('get_cell_other', {})
    available_street_addrr = session.get('st_address', {})
    available_city = session.get('city_getter', {})
    available_state = session.get('state_getter', {})
    available_zip_code = session.get('zip_code', {})
    available_channel = session.get('desired_channel', {})
    available_project = session.get('project_descrip', {})



    # Residential_serivce = requiredResidentialSerivce.get('Entered_Service')
    # State_Desired = desiredStateEntered.get('Selected_State')
    selected_date_value = available_date_data.get('selected_date')

    #Split the selected_date_value into parts
    day, date = selected_date_value.split(', ')

    #Extract time from available_time_data
    time = available_time_data.get('selected_time')


    firstname = available_first_name.get('first_Name')
    lastname = available_last_name.get('last_Name')
    DecName = available_spouse_name.get('DecionName')
    DeciNum = available_spouse_num.get('DecisonNum')
    DecoEmail = available_spouse_email.get('Dec_Mails')
    service_required = available_desired_service.get('RequiredService')
    email_required = available_email_address.get('email_add')
    firstphone = available_phone_number.get('cell_phone_num')
    otherphone = available_other_number.get('cell_phone_others')
    streetaddr = available_street_addrr.get('street_addresses')
    city = available_city.get('City')
    state = available_state.get('EnteredState')
    Zipcode = available_zip_code.get('ZipCode')
    channel = available_channel.get('EnterChannel')
    projectdesc = available_project.get('ProjDesc')



    combined_data_Collections = f"{day}, {date}, {time}, {firstname}, {lastname}, {DecName}, {DeciNum}, {DecoEmail}, {service_required}, {email_required}, {firstphone}, {otherphone}, {streetaddr}, {city}, {state}, {Zipcode}, {channel}, {projectdesc}"
    return combined_data_Collections


@app.route('/commercial_laed_generation_date_collection')
def lead_generation_data_commercial():
    pass



if __name__ == '__main__':
    app.run(debug=True)
