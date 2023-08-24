from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import time
from bs4 import BeautifulSoup
import pandas as pd

def Residential_graper_function():


    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    url = "https://missionpaintingkcresidentialclone.youcanbook.me/"

    driver = webdriver.Chrome(options=options)
    
    driver.get(url)

    response = requests.get(url=url)
    status_codes = response.status_code

    print(status_codes)

    return driver

def scraping_residential_dates(driver):
    gridelement = driver.find_element(By.CLASS_NAME, 'gridDays')

    html_content = gridelement.get_attribute('innerHTML')
    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all div elements that have the desired class but exclude "dayNoFree" class
    desired_class = "gridDay gridDay"  # Replace this with the starting part of your class name
    desired_divs = soup.find_all('div', class_=lambda c: c and c.startswith(desired_class) and "dayNoFree" not in c)
    # Print the desired div elements


    divs_list = []
    # Lists to store the extracted data
    dates_list = []
    times_list = []
    days_list = []  


    # Loop through each 'div' day and extract the date, day, and times
    for div in desired_divs:
        # Extract date from the 'gridHeaderDate' class
        date = div.find('span', class_='gridHeaderDate').text.strip()
        
        # Extract day from the 'gridHeaderDayName' class
        day = div.find('span', class_='gridHeaderDayName').text.strip()
        
        # Extract times from 'gridFree' and 'gridBusy' classes
        free_times = div.find_all('div', class_='gridFree')

        # Append the date and day to the list for each time found in this day
        num_times = len(free_times)
        dates_list.extend([date] * num_times)
        days_list.extend([day] * num_times)
        
        # Extract time from 'a' elements for 'gridFree' times
        free_times_data = [time.find('a').text.strip() for time in free_times]
        
        
        # Append the free and busy times to the list
        times_list.extend(free_times_data)

    # Create a pandas DataFrame from the extracted data
    df = pd.DataFrame({'Date': dates_list, 'Day': days_list, 'Time': times_list})

    return df

def page_clicking_module(driver, services):


    full_exterior_consultation = driver.find_element(By.XPATH, '/html/body/div/div[2]/form/div/div[2]/h2/a')

    full_exterior_text = full_exterior_consultation.get_attribute('innerHTML')

    large_interior_consultation = driver.find_element(By.XPATH, '/html/body/div/div[2]/form/div/div[3]/h2/a')

    large_interior_text = large_interior_consultation.get_attribute('innerHTML')

    small_interior = driver.find_element(By.XPATH, '/html/body/div/div[2]/form/div/div[4]/h2/a')

    small_interior_text = small_interior.get_attribute('innerHTML')

    if services == "Full Exterior Consultation":
        full_exterior_consultation.click()
    elif services == "Full or Large *Interior Consultation":
        large_interior_consultation.click()

    elif services == "Small Interior (3-4 rooms) Consultation":
        small_interior.click()

    else:
        print("Service not found")

    return driver


def selectingCity(driver, city):

    print(driver.current_url)


    kansas_city_option = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[3]/div[2]/h2/a')

    missouri_option = driver.find_element(By.XPATH, "/html/body/div/div[2]/div[3]/div[3]/h2/a")


    if city == "Kansas":
        kansas_city_option.click()

    elif city == "Missouri":
        missouri_option.click()

    else:
        print("No City Found")

    

    city_clicking_url = driver.current_url
    print(city_clicking_url)

    return driver



def selecting_date_shifting_res(driver, dayinput, dateinput, timeinput):
    print(driver.current_url)

    day = dayinput
    date = dateinput

    #class_name_pat = f"gridDay gridDay{day}  {date}"

    class_name_pat = f"gridDay gridDay{day}  {date}"
    print(class_name_pat)

    element = driver.find_element(By.XPATH, f".//div[contains(@class, '{class_name_pat}')]")

    time_text_aTag = element.find_elements(By.TAG_NAME, "a")

    time_clicked = False  # Flag to track if a time was clicked
    for tags in time_text_aTag:
        if timeinput == tags.text:
            print(timeinput)
            matched_tag = tags
            print(matched_tag.get_attribute('innerHTML'))
            try:
                print("---Scrolling to the element---")
                driver.execute_script("arguments[0].scrollIntoView();", matched_tag)
                time.sleep(1)  # Add a short delay before clicking
                print("---Clicking on the link------")
                matched_tag.click()
                time_clicked = True
                print(driver.current_url)
                break  # Exit the loop if a time was clicked successfully
            except Exception as e:
                print("Could not perform clicking on this tag:", e)
    else:
        if not time_clicked:
            print("Desired time not found")
    print("Same Function")
    print(driver.current_url)
    return driver





def serviceSelection(driver, checkboxvalue):
    try:
        checkboxvalue_Int = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[7]/div[2]/div[1]/input"))
        )
        checkboxvalue_ext = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[7]/div[2]/div[2]/input"))
        )
        checkboxvalue_wod = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[7]/div[2]/div[3]/input"))
        )
        checkboxvalue_oth = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[7]/div[2]/div[4]/input"))
        )
        if checkboxvalue == "Interior Painting":
            checkboxvalue_Int.click()
        elif checkboxvalue == "Exterior Painting":
            checkboxvalue_ext.click()
        elif checkboxvalue_wod == "Wood Repair":
            checkboxvalue_wod.click()
        else:
            checkboxvalue_oth.click()
    except:
        print("Error selecting checkbox value")






def Residential_Form(driver, FirstName, LastNem, spouse, Spouse_num, spouse_addr, service_desired, email_add, cell_phone, home_phone, Str_addres, city, state, zipcode, channel, Description):

    try:
        print("ResidentialForm is initialize")
        print(driver.current_url)

        actions_chains = ActionChains(driver)

        try:
            firstname = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[2]/div[2]/input"))
            )
            actions_chains.click(firstname).send_keys(FirstName).perform()
            print("First Name Entered")
        except:
            print("Error Entering First Name")


        try:

            lastname = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[3]/div[2]/input"))
            )
            actions_chains.click(lastname).send_keys(LastNem).perform()
            print("Last Name Entered")
        except:
            print("Error Entering last name")



        try:
            spousename = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[4]/div[2]/input"))
            )
            actions_chains.click(spousename).send_keys(spouse).perform()
            print("Spouse Name Entered")
        except:
            print("Error Entering Spouse name")


        try:

            spousenum = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[5]/div[2]/div/input[2]"))
            )
            actions_chains.click(spousenum).send_keys(Spouse_num).perform()
            print("Spouse Num Entered")
        except:
            print("Error Entering Spouse Num")


        try:

            spousemail = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[6]/div[2]/input"))
            )
            actions_chains.click(spousemail).send_keys(spouse_addr).perform()
            print("Spouse Email Entered")
        except:
            print("Error Entering Spouse Num")



        try:

            serviceSelection(driver, service_desired)
            print(f"{service_desired} has been selected")
        except:
            print(f"Error Entering {service_desired}")

        try:

            email = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[8]/div[2]/input"))
            )
            actions_chains.click(email).send_keys(email_add).perform()
            print("Email Entered")
        except:
            print("Error Entering Email")

        try:

            phonenum = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[9]/div[2]/div[1]/input[2]"))
            )
            actions_chains.click(phonenum).send_keys(cell_phone).perform()
            print("Home Phone Entered")
        except:
            print("Error Entering Spouse Num")


        try:

            cell_phone = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[10]/div[2]/div/input[2]"))
            )
            actions_chains.click(cell_phone).send_keys(home_phone).perform()
            print("Second Num Entered")
        except:
            print("Error Entering Second Num")



        try:

            st_address = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[11]/div[2]/input"))
            )
            actions_chains.click(st_address).send_keys(Str_addres).perform()
            print("Street Address Entered")
        except:
            print("Error Entering Street Address")



        try:

            city_input = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[12]/div[2]/input"))
            )
            actions_chains.click(city_input).send_keys(city).perform()
            print("City Entered")
        except:
            print("Error Entering City")



        try:

            kansas_radio_button = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[13]/div[2]/div[1]/input"))
            )
            missouri_radio_button = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[13]/div[2]/div[2]/input"))
            )

            if state == "Kansas":
                ActionChains(driver).click(missouri_radio_button).perform()
                print(f"{state} Entered")
            else:
                ActionChains(driver).click(kansas_radio_button).perform()
                print(f"{state} Entered!")
        except:
            print("Error selecting State")



        try:

            zipcode_input = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[14]/div[2]/input"))
            )
            actions_chains.click(zipcode_input).send_keys(zipcode).perform()
            print("Zip Code Entered")
        except:
            print("Error entering Zip Code")




        try:

            challenge_select_element = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[15]/div[2]/select"))
            )
            challenge_select = Select(challenge_select_element)
            challenge_select.select_by_visible_text(channel)
            print(f"{channel} is selected")
        except:
            print("Error selecting option from dropdown")



        try:

            project_description_textarea = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[16]/div[2]/textarea"))
            )
            actions_chains.click(project_description_textarea).send_keys(Description).perform()
            print("Description has been Added")
        except:
            print("Error entering Project Description")




            #Submit Button and Form

        try:
            submit_button = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[20]/div[2]/button[1]"))
            )
            actions_chains.click(submit_button).perform()
            print("Button Click Attempted")

            WebDriverWait(driver, 15).until(EC.url_changes(driver.current_url))  # Wait for URL change
            print("Button Click Successful. URL changed:", driver.current_url)
        except:
            print(driver.current_url)
            print("Button Click Failed")

    except Exception as e:
        print("Driver not found", e)




# if __name__ == "__main__":
#     drivers = link_graper_function()
#     Service = "Small Interior (3-4 rooms) Consultation"
#     state = "Kansas"
#     FirstName = "John"
#     LastNem = "Residential Testing"
#     spouse = "John's Spous"
#     Spouse_num = "03035973419"
#     spouse_addr = "hasanzafariqbal@gmail.com"
#     service_desired = "Wood Repair"
#     email_add = "hasanzafariqbal@gmail.com"
#     cell_phone = "03035973419"
#     home_phone = "03035973419"
#     Str_addres = "123 New York"
#     city = "NYC"
#     state = "Kansas"
#     zipcode = "13213"
#     channel = "Google"
#     Description = "This is description for residential booking"
#     cp_code = "1322"
#     service_mod = page_clicking_module(drivers, Service)
#     citydriver = selectingCity(service_mod, state)  
#     date_source = selecting_date_shifting_url(citydriver, day, date, time)
#     RS = Residential_Form(date_source)



