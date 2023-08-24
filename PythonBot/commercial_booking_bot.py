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
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import requests
import time
from bs4 import BeautifulSoup
import pandas as pd




def link_graper_function():
    options = Options()
    options.add_argument('--headless')
    
    driver = webdriver.Chrome(options=options)
    
    url = "https://missionpaintingkc-commercial.youcanbook.me/"
    driver.get(url)

    try:
        accept_button = driver.find_element(By.CLASS_NAME, 'cookie-button')
        accept_button.click()
        print("Cookies accepted!")
    except NoSuchElementException:
        print("Could not find or click the accept button.")

    return driver




def scraping_available_dates(driver):
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

# drivers = link_graper_function()
# scraping_available_dates(driver=drivers)


def selecting_date_shifting_url(driver, dayinput, dateinput, timeinput):
    print(driver.current_url)

    day = dayinput
    date = dateinput

    class_name_pat = f"gridDay gridDay{day}  {date}"
    print(class_name_pat)

    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f".//div[contains(@class, '{class_name_pat}')]"))
        )
    except NoSuchElementException:
        print("Date element not found.")
        return driver

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

    print(driver.current_url)
    return driver



def selecting_check_box_by_value(driver, checkboxvalue):
    try:
        checkboxvalue_Int = WebDriverWait(driver, 400).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[4]/div[2]/div[1]/input"))
        )
        checkboxvalue_ext = WebDriverWait(driver, 400).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[4]/div[2]/div[2]/input"))
        )
        checkboxvalue_oth = WebDriverWait(driver, 400).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[3]/form/div[4]/div[2]/div[3]/input"))
        )

        if checkboxvalue == "Interior Painting":
            checkboxvalue_Int.click()
        elif checkboxvalue == "Exterior Painting":
            checkboxvalue_ext.click()
        else:
            checkboxvalue_oth.click()
    except:
        print("Error selecting checkbox value")



def click_submit_button(driver, First_Name, Last_Name, checkbox_value_to_select, Email_address, Mobile_Number, Other_Phone_Number, Address, City, State, ZipCode, HeardAbout, ProjectDescription):

    try:
        action_chains = ActionChains(driver)

        try:

            FirstName = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field2"))
            )
            action_chains.click(FirstName).send_keys(First_Name).perform()
        except:
            print("Error entering First Name")

        try:

            last_name_input = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field3"))
            )
            action_chains.click(last_name_input).send_keys(Last_Name).perform()
            print("attemped")
        except:
            print("Error entering Last Name")

        try:
            selecting_check_box_by_value(driver, checkbox_value_to_select)
            print("attemped")
        except:
            print("Error selecting checkbox value")

        try:
        
            email_tag = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field5"))
            )

            action_chains.click(email_tag).send_keys(Email_address).perform()
            print("attemped")
        except:
            print("Error entering Email address")
        
        try:
            m1 =  WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field6"))
            )
            action_chains.click(m1).send_keys(Mobile_Number).perform()
            print("attemped")
        except:
            print("Error entering Mobile")


        try:

            m2 =  WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field7"))
            )
            action_chains.click(m2).send_keys(Other_Phone_Number).perform()
            print("attemped")
        except:
            print("Error entering Mobile Number 2")

        try:

            addrr = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field8"))
            )
            action_chains.click(addrr).send_keys(Address).perform()
            print("attemped")
        except:
            print("Error Entering Address ")


        try:

            city_addrr = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field9"))
            )
            action_chains.click(city_addrr).send_keys(City).perform()
            print("attemped")
        except:
            print("Eroor Entering City")


        try:

            kansas_radio_button = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field10-4"))
            )
            missouri_radio_button = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field10-5"))
            )

            if State == "Kansas":
                ActionChains(driver).click(missouri_radio_button).perform()
                print("attemped")
            else:
                ActionChains(driver).click(kansas_radio_button).perform()
                print("attemped")
        except:
            print("Error selecting radio button")

        try:

            zipcode_input = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field11"))
            )
            action_chains.click(zipcode_input).send_keys(ZipCode).perform()
            print("attemped")
        except:
            print("Error entering Zip Code")

        try:

            challenge_select_element = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field12"))
            )
            challenge_select = Select(challenge_select_element)
            challenge_select.select_by_visible_text(HeardAbout)
            print("attemped")
        except:
            print("Error selecting option from dropdown")



        try:

            project_description_textarea = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "field13"))
            )
            action_chains.click(project_description_textarea).send_keys(ProjectDescription).perform()
            print("attemped")
        except:
            print("Error entering Project Description")

        try:
            submit_button = WebDriverWait(driver, 400).until(
                EC.presence_of_element_located((By.ID, "submitButton"))
            )
            action_chains.click(submit_button).perform()
            print("Button Click Attempted")

            WebDriverWait(driver, 15).until(EC.url_changes(driver.current_url))  # Wait for URL change
            print("Button Click Successful. URL changed:", driver.current_url)
        except Exception as e:
            print(driver.current_url)
            print("Button Click Failed", e)
    except:
        print("Driver not found")
