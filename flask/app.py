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
#at the start
load_dotenv()

app.config['DB_NAME'] = os.getenv('DB_NAME')
app.config['DB_USER'] = os.getenv('DB_USER')
app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['DB_PORT'] = os.getenv('DB_PORT')
app.config['DB_HOST'] = os.getenv('DB_HOST')
app.config['FLASK_PORT'] = os.getenv('FLASK_PORT')
app.config['FLASK_HOST'] = os.getenv('FLASK_HOST')



def preprocess_data(data):
    df = pd.DataFrame(data = data, columns = df_columns)
    df = df[df["Deleted_at"].isna()]
    df = df.sort_values("Id").reset_index(drop=True)
    tfidf = TfidfVectorizer(max_features=5000)
    df_cleaned2 = df[['Title', 'Description', 'Venue']].copy()
    df_cleaned2.loc[:, "tags"] = df_cleaned2["Title"] + df_cleaned2["Description"] + df_cleaned2["Venue"]
    # Transform the data
    vectorized_data = tfidf.fit_transform(df_cleaned2["tags"].values)
    vectorized_dataframe = pd.DataFrame(vectorized_data.toarray(), index=df_cleaned2['tags'].index.tolist())
    
    #truncate
    svd = TruncatedSVD(n_components=int(vectorized_dataframe.shape[1] * 0.7))
    reduced_data = svd.fit_transform(vectorized_dataframe)
    similarity = cosine_similarity(reduced_data)

    return df["Id"], similarity

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
    data = None
    with conn.cursor() as curs:
        try:
        # simple single row system query
            curs.execute("SELECT * FROM events")
            rows = curs.fetchall()
            data = np.array(rows) 
       
        # a more robust way of handling errors
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    #cur.close()
    conn.close() 
    num_events = len(data)
    event_id_cache, similarity_cache = preprocess_data(data) #data[:, 4] is title, [:, 5] is description, [:, 7] is venue
    
def refresh_cache():
    while True:
        load_events()
        time.sleep(3600)  # Refresh every hour
    
#load events at the start
load_events()







        
@app.route("/")
def home():
    return jsonify({
        "Message": "app up and running successfully"
    })




@app.route("/recommender/<int:id>",methods=["GET"])
def recommender(id):
    #id_of_movie = df[df['Title'].str.contains(movie_title,case=False)].index[0]
    recommender_list = []
    #find the index

    index = event_id_cache.index[event_id_cache == id][0]
    
    distances = similarity_cache[index]

    event_list = sorted(list(zip(event_id_cache.index.to_numpy(), distances)), reverse=True, key=lambda x:x[1])[1:20]

    for i in event_list:
        recommender_list.append(event_id_cache.iloc[i[0]])

    return recommender_list


if __name__=="__main__":
    app.run(debug=False,host=app.config['FLASK_HOST'],port=app.config['FLASK_PORT'])
    
    
