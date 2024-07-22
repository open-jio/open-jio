from flask import Flask,jsonify,request
import numpy as np
import pandas as pd
import tensorflow as tf
import psycopg2 
import numpy as np 
import time
from threading import Thread
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os

app = Flask(__name__)

num_events = 0
df_columns = ["Id", "Created_at", "Updated_at", "Deleted_at", "Title", "Description", "Datetime", "Venue", "User_id", "Number_of_likes"]
event_id_cache = None
similarity_cache = None

    

def load_events() :
    global event_id_cache
    global similarity_cache
    global num_events
    conn = psycopg2.connect( 
        dbname=app.config['DB_NAME'], 
        user=app.config['DB_USER'], 
        password=app.config['DB_PASSWORD'], 
        host=app.config['DB_HOST'], 
        port=app.config['DB_PORT']
    ) 
    cur = conn.cursor() 
    cur.execute("SELECT * FROM events") 
    rows = cur.fetchall() 
    data = np.array(rows) 
    cur.close() 
    conn.close() 
    num_events = len(data)
    event_id_cache, similarity_cache = preprocess_data(data) #data[:, 4] is title, [:, 5] is description, [:, 7] is venue
    
    
def preprocess_data(data):
    df = pd.DataFrame(data = data, columns = df_columns)
    df_cleaned = df[df["Deleted_at"].isna()]
    tfidf = TfidfVectorizer(max_features=5000)
    df_cleaned["tags"] = df_cleaned["Title"] + df_cleaned["Description"] + df_cleaned["Venue"]
    # Transform the data
    vectorized_data = tfidf.fit_transform(df_cleaned["tags"].values)
    vectorized_dataframe = pd.DataFrame(vectorized_data.toarray(), index=df_cleaned['tags'].index.tolist())
    
    #truncate
    svd = TruncatedSVD(n_components=vectorized_dataframe.shape[1] * 0.7)
    reduced_data = svd.fit_transform(vectorized_dataframe)
    similarity = cosine_similarity(reduced_data)

    return df["Id"], similarity




def refresh_cache():
    while True:
        load_events()
        time.sleep(3600)  # Refresh every hour
        
@app.route("/")
def home():
    return jsonify({
        "Message": "app up and running successfully"
    })


@app.route("/recommender/<int:id>",methods=["GET"])
def recommender(id):
    #id_of_movie = df[df['Title'].str.contains(movie_title,case=False)].index[0]
    recommender_list = []
    assert id < num_events
    distances = similarity_cache[id]

    event_list = sorted(list(zip(event_id_cache.index.to_numpy(), distances)), reverse=True, key=lambda x:x[1])[1:20]
    

    for i in event_list:
      recommender_list.append(event_id_cache[i[0]])

    return recommender_list


if __name__=="__main__":
    app.run(debug=True,host=app.config['FLASK_HOST'],port=app.config['FLASK_PORT'])
    
    
#at the start
load_events()
Thread(target=refresh_cache).start()

load_dotenv()
app.config['DB_NAME'] = os.getenv('DB_NAME')
app.config['DB_USER'] = os.getenv('DB_USER')
app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['DB_PORT'] = os.getenv('DB_PORT')
app.config['DB_HOST'] = os.getenv('DB_HOST')
app.config['FLASK_PORT'] = os.getenv('FLASK_PORT')
app.config['FLASK_HOST'] = os.getenv('FLASK_HOST')