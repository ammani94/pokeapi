from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import os
import datetime
import time

def create_directory():
    path = "/app/img/"
    try:
        os.mkdir(path)
    except FileExistsError:
        print(f"Directory '{path}' already exists.")
    except PermissionError:
        print(f"Permission denied: Unable to create '{path}'.")
    except Exception as e:
        print(f"An error occurred: {e}")


def test_selenium():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    
    driver = webdriver.Firefox(options=options)

    try:
        driver.get("http://frontend:5173/")

        create_directory()
        email = driver.find_element(By.ID, "email")
        password = driver.find_element(By.ID, "password")
        submit = driver.find_element(By.ID, "submit")
        email.send_keys('test')
        password.send_keys('test')
        submit.click()

        date = datetime.datetime.now()
        screenshot_path = "/app/img/screenshot_" + date.strftime('%m_%d_%Y') + ".png"
        driver.save_screenshot(screenshot_path)
        print(f" Capture d'écran enregistrée : {screenshot_path}")

    except Exception as e:
        print(f" Erreur : {e}")
        raise e
    finally:
        driver.quit()
        print("🔚 Test terminé.")

if __name__ == "__main__":
    test_selenium()