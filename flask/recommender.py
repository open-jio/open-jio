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
        dbname="postgres", 
        user="postgres.zeclakssximxocelanqe", 
        password="Openjio123!", 
        host="aws-0-ap-southeast-1.pooler.supabase.com", 
        port="5432" 
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


@app.before_first_request
def initialize():
    load_events()
    Thread(target=refresh_cache).start()


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
    app.run(debug=True,host="0.0.0.0",port=8080)