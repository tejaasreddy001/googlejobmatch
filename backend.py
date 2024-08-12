# ******Library for AI model
import PyPDF2
import re
import os
import google.generativeai as genai
import markdown2

# ******Libarary for Flask
import warnings
from nltk.corpus import stopwords
import string
from wordcloud import WordCloud
import joblib
import re
from collections import defaultdict 
from sklearn.metrics.pairwise import cosine_similarity
from confluent_kafka import Producer
import atexit
import logging
import uuid
from flask import request, jsonify
from werkzeug.utils import secure_filename
from bs4 import BeautifulSoup
import requests
import nltk
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from flask_cors import CORS

# ********************************************************* AI Model **********************************

# Configure the generative AI model
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# Function to extract text from a PDF file
def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

import re

import re

def extract_info(text1, text2, text3):

  # Extract match percentage
  match_percentage = re.search(r"(\d+-\d+)%", text1)
  match_percentage = match_percentage.group(1) if match_percentage else None
  if match_percentage == None:
      match_percentage = re.search(r"(\d+)%", text1)
      match_percentage = match_percentage.group(1) if match_percentage else None


  # Extract keywords
  strong_keywords = []
  moderate_keywords = []
  missing_keywords = []

  for text in [text2, text3]:
    for line in text.splitlines():
      if line.startswith("*"):
        keyword = line.strip("* ")
        if "Strong Matches" in text:
          strong_keywords.append(keyword)
        elif "Moderate Matches" in text:
          moderate_keywords.append(keyword)
        else:
          missing_keywords.append(keyword)

  return match_percentage, strong_keywords, moderate_keywords, missing_keywords



# Function to clean the extracted text
def clean_text(text):
    # Remove quotation marks and apostrophes using regex
    cleaned_text = re.sub(r"[\"']", "", text)
    # Replace newlines with a space to keep everything in one line
    cleaned_text = cleaned_text.replace("\n", " ")
    return cleaned_text

# Extract and clean text from the PDF
extracted_text = extract_text_from_pdf('Resume.pdf')
job_board_text = extract_text_from_pdf('job.pdf')
cleaned_text = "Use this resume to fetch the Name and skills" + clean_text(extracted_text) + "This is the job description" + job_board_text 
questions = ["Does my profile fit the role?", "Generate a cover letter to the hiring manager"]
for question in questions:
    response = model.generate_content(cleaned_text + question)
    text = markdown2.markdown(response.text)

# ********************************************************* AI Model **********************************
    
app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection string
atlas_uri = "mongodb+srv://tejasmukunda:whemAV0rpMAFkuho@cluster0.aptdng7.mongodb.net/?retryWrites=true&w=majority&ssl_ca_certs=/path/to/cafile.pem"

# Connect to the MongoDB Atlas Cluster
client = MongoClient(atlas_uri)

# Connect to the 'techtrend' database and 'techtrend_user' collection
db = client.jobmatch
collection = db.jobmatch_user

# API for creating new user
@app.route('/newuser', methods=['POST'])
def create_user():
    try:
        data = request.json
        user_name = data.get('user_name')
        password = data.get('password')
        contact_info = data.get('contact_info')
        user_data = collection.find_one({'user_name': user_name})
        if user_data:
            raise Exception("User Name already taken")
        print("here in user signup")
        print(user_name)
        if not user_name or not password or not contact_info:
            return jsonify({'message': 'Missing required fields'}), 400
        user_document = {
            'user_name': user_name,
            'password': password,
            'contact_info': contact_info,
            'questions':["Does my profile fit the role?", "Generate a cover letter to the hiring manager"]
        }
        # Insert the user document into the MongoDB collection
        user_id = collection.insert_one(user_document).inserted_id
        return jsonify({'user_id': str(user_id)}), 201
    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500
    
# API for User/Candidate login
@app.route('/users/login', methods=['POST'])
def login_user():
    try:
        # Get user_name and password from request data
        user_name = request.json.get('user_name')
        password = request.json.get('password')
        print("here in login")
        print(user_name + password)

        user_data = collection.find_one({'user_name': user_name, 'password': password})
        if user_data:
            user_data['_id'] = str(user_data['_id'])
            response_data = {
                '_id':user_data['_id'],
                'user_name':user_name
            }
            return jsonify(response_data)
        else:
            print("invalid cred")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error logging in user: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

# API for deleting the user 
@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = collection.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404   
    
# API for fetching questions
@app.route('/fetch-question', methods=['POST'])
def fetch_question():
    try:
        user_name = request.json.get('user_name')
        print("here in question fetch")
        print(user_name)

        user_data = collection.find_one({'user_name': user_name})
        if user_data:
            user_data['_id'] = str(user_data['_id'])

            questions = user_data.get('questions', [])

            response_data = {
                '_id': user_data['_id'],
                'user_name': user_name,
                'questions': questions 
            }
            return jsonify(response_data)
        else:
            print("invalid cred")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

# API for creating questions
@app.route('/create-question', methods=['POST'])
def create_question():
    try:
        user_name = request.json.get('user_name')
        question = request.json.get('question')
        print("here in question update")
        print(user_name)
        print(question)

        user_data = collection.find_one({'user_name': user_name})
        if user_data:
            user_data['_id'] = str(user_data['_id'])
            questions = user_data.get('questions', [])
            questions.append(question)

            collection.update_one(
                {'user_name': user_name},
                {'$set': {'questions': questions}}
            )

            response_data = {
                '_id': user_data['_id'],
                'user_name': user_name,
                'questions': questions  
            }
            return jsonify(response_data)
        else:
            print("Invalid credentials")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error updating questions: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500
    
# API for detleting questions
@app.route('/delete-question', methods=['POST'])
def delete_question():
    try:
        user_name = request.json.get('user_name')
        delete_index = request.json.get('delete_index')
        print("here in question update")
        print(user_name)
        print(delete_index)

        user_data = collection.find_one({'user_name': user_name})
        if user_data:
            user_data['_id'] = str(user_data['_id'])
            questions = user_data.get('questions', [])
            questions.pop(delete_index)
            collection.update_one(
                {'user_name': user_name},
                {'$set': {'questions': questions}}
            )

            response_data = {
                '_id': user_data['_id'],
                'user_name': user_name,
                'questions': questions 
            }
            return jsonify(response_data)
        else:
            print("Invalid credentials")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error updating questions: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

# API for fetching questions
@app.route('/fetch-bard', methods=['POST'])
def fetch_bard():
    try:
        # Get user_name from request data
        user_name = request.json.get('user_name')
        resume = request.json.get('resume')
        job = request.json.get('job')
        print("username", user_name)
        print("here in bard route")
        # Retrieve user data by user_name
        user_data = collection.find_one({'user_name': user_name})
        if user_data:
            # Convert ObjectId to string for JSON serialization
            user_data['_id'] = str(user_data['_id'])

            predefined_questions = ["Just provide the percentage of match between resume and job description", "provide the matching keywords with job discription", "provide the missing keywords that i can add to my resume which are missing from job description which are important"]

            # Ensure 'questions' field is included and is an array
            questions = user_data.get('questions', [])
            print("questions is", questions)
            result = ''
            presult = ''
            cleaned_text = "Use this resume to fetch the Name and skills" + clean_text(resume) + "This is the job description" + clean_text(job)

            info = []
            importinfo = ["From this return the integer value of percentage of match between resume and job description","From this return the list of matching keywords with resume the list should have only list of keywords nothing else", "From this return the list of missing keywords the list should have only list of keywords nothing else"]
            
            for question in predefined_questions:
                print("here")
                response = model.generate_content(cleaned_text + question)
                presult += response.text 
            # response = model.generate_content(peresult + "summarize this information and extract core information from this and provide. It should be short but informative")
            

            for question in importinfo:
                info.append(model.generate_content(presult + question).text)

            match_percentage, strong_keywords, moderate_keywords, missing_keywords = extract_info(info[0],info[1],info[2])

            print("matching",match_percentage)
            print("strong",strong_keywords)
            print("moderate",moderate_keywords)
            print("missing",missing_keywords)

            print("info is",info)
            pretext = markdown2.markdown(presult)
            
            for question in questions:
                response = model.generate_content(cleaned_text + question)
                result += response.text
            text = markdown2.markdown(result)

            print("Text",text)              
            response_data = {
                '_id': user_data['_id'],
                'user_name': user_name,
                'result': text, 
                'presult':pretext,
                'match':match_percentage,
                'strongmatch':strong_keywords,
                'moderatematch':moderate_keywords,
                'missing':missing_keywords
            }
            return jsonify(response_data)
        else:
            print("invalid cred")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)