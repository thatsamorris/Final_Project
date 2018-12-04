import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

from flask import Flask, request, render_template, send_from_directory, jsonify
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from sqlalchemy.ext.declarative import declarative_base
Base1 = declarative_base()

from sqlalchemy import Column, Integer, String, Float

###

import json


app = Flask(__name__)

###djs 
#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/Project2.db"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/crime_data.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)


Crime_data = Base.classes.Crime_rate_zip
City_zip = Base.classes.census_data1



app.config['UPLOAD_FOLDER'] = 'Uploads'
app.config['DATA_FOLDER'] = 'data'



def procLSD(filename):
    print('we here!!')
    df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))
    print(df)

    X = df['HouseholdIncome'].values.reshape(-1, 1)
    y = df['crime_rate'].values.reshape(-1, 1)

    print("Shape: ", X.shape, y.shape)

    from sklearn.linear_model import LinearRegression

    model = LinearRegression()

    # Fit the model to the data. 
    # Note: This is the training step where you fit the line to the data.

    model.fit(X, y)

    print('Weight coefficients: ', model.coef_)
    print('y-axis intercept: ', model.intercept_)

    x_min = np.array([[X.min()]])
    x_max = np.array([[X.max()]])

    y_min = model.predict(x_min)
    y_max = model.predict(x_max)
    print('y_min:', y_min, '  y_max', y_max)

    # Plot X and y using plt.scatter
    # Plot the model fit line using [x_min[0], x_max[0]], [y_min[0], y_max[0]]

    plt.scatter(X, y, c='blue')
    plt.plot([x_min[0], x_max[0]], [y_min[0], y_max[0]], c='red')

    plt.savefig(os.path.join(app.config['UPLOAD_FOLDER'], 'lsd_plot.png'))

    return 99


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        print(request)

        if request.files.get('file'):
            # read the file
            file = request.files['file']

            # read the filename
            filename = file.filename

            # Save the file to the uploads folder
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if filename == 'lsd.csv':
                y_intercept = procLSD(filename)


           
            return "Image Saved!" + filename

       
    return render_template("index.html") 

@app.route("/linear/<field>")
def linear(field):
    """process LSD."""
    print('field', field)


###djs
    # filename = 'austin_census_crime_data_cleaned.csv'        
    #print('in app linear loop#', filename)

###djs DB#########################
    # if field < '4':
    #     df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))
    # else:
    #     stmt = db.session.query(Crime_data).statement
    #     df = pd.read_sql_query(stmt, db.session.bind)
###
    stmt = db.session.query(Crime_data).statement
    df = pd.read_sql_query(stmt, db.session.bind)



    print(df)
    if (field == '0' or field == '4' ):
        X = df['HouseholdIncome'].values.reshape(-1, 1)
        chartName = 'HouseholdIncome'
    elif (field == '1' or field == '5'):
        X = df['MedianAge'].values.reshape(-1, 1)
        chartName = 'MedianAge'
    elif (field == '2' or field == '6'):
        X = df['PovertyRate'].values.reshape(-1, 1)
        chartName = 'PovertyRate'
    else:
        X = df['PerCapitaIncome'].values.reshape(-1, 1)
        chartName = 'PerCapitaIncome'
    
    y = df['crime_rate'].values.reshape(-1, 1)

    print("Shape: ", X.shape, y.shape)

    from sklearn.linear_model import LinearRegression

    model = LinearRegression()

    # Fit the model to the data. 
    # Note: This is the training step where you fit the line to the data.

    model.fit(X, y)

    print('Weight coefficients: ', model.coef_)
    print('y-axis intercept: ', model.intercept_)

    x_min = np.array([[X.min()]])
    x_max = np.array([[X.max()]])

    y_min = model.predict(x_min)
    y_max = model.predict(x_max)
    print('y_min:', y_min, '  y_max', y_max)

    # Plot X and y using plt.scatter
    # Plot the model fit line using [x_min[0], x_max[0]], [y_min[0], y_max[0]]

    plt.scatter(X, y, c='blue')
    plt.plot([x_min[0], x_max[0]], [y_min[0], y_max[0]], c='red')

    plt.savefig(os.path.join(app.config['UPLOAD_FOLDER'], chartName + '.png'))

    
  
###########################
    data = {
        "X": X.tolist(),
        "y": y.tolist(),
        "xMin": x_min.tolist(),
        "xMax": x_max.tolist(),
        "yMin": y_min.tolist(),
        "yMax": y_max.tolist()
    }
    
    return jsonify(data)

##################################
@app.route("/linearR2")
def linearR2():
    """process LSD."""
   
   # filename = 'census_crime_data_cleaned.csv'
    # filename = 'austin_census_crime_data_cleaned.csv'
#    filename = 'combined_cities_census.csv' 

## djs DB  census = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))

    stmt = db.session.query(Crime_data).statement
    census = pd.read_sql_query(stmt, db.session.bind)

    array = ["Population", "MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyCount", "PovertyRate"]

    from sklearn.linear_model import LinearRegression
    model = LinearRegression()

    score = []
    for variable in array:
        X = census[variable].values.reshape(-1, 1)
        y = census["crime_rate"].values.reshape(-1, 1)

    # Fitting our model with all of our features in X
        model.fit(X, y)

        score.append(model.score(X, y))
        

    X = census[["MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyRate"]]
    y = census["crime_rate"]

    # Fitting our model with all of our features in X
    model.fit(X, y)

    overall_score = model.score(X, y)
    print(f"R2 overall Score: {score}")

   #splitting into train and test data
    from sklearn.model_selection import train_test_split

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
    #retraining model with train data
    model.fit(X_train, y_train)

    print(f"Training Data Score: {model.score(X_train, y_train)}")
    print(f"Testing Data Score: {model.score(X_test, y_test)}")

    training_score = model.score(X_train, y_train)
    testing_score = model.score(X_test, y_test)
    
  
###########################
    data = {
        "fieldArray": array,
        "field_score": score,
        "overall_score": overall_score,
        "training_score": training_score,
        "testing_score": testing_score
    }
    
    return jsonify(data)

####classifier#######################################
@app.route("/classifer")
def classifer():
    """process LSD."""
   
    # filename = 'austin_census_crime_data_cleaned.csv'

 ###djs DB  
    # filename = 'combined_cities_census.csv'         
    # print('in app clssifier loop#', filename)

    # df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))
    stmt = db.session.query(Crime_data).statement
    df = pd.read_sql_query(stmt, db.session.bind)



    # X = df.drop(["crime_rating", "crime_rate", "Population", "PovertyCount"], axis=1)
    X = df[["MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyRate"]]
    y = df["crime_rating"]
    print(X.shape, y.shape)
 
    from sklearn.model_selection import train_test_split

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1, stratify=y)

    from sklearn.linear_model import LogisticRegression
    classifier = LogisticRegression()
    #classifier

    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.svm import SVC
    pipe_lr = Pipeline([('scl', StandardScaler(copy=True, with_mean=True, with_std=True)),
                    ('pca', PCA(copy=True, iterated_power='auto', n_components=4, random_state=None,
                    svd_solver='auto', tol=0.0, whiten=False)),
                    ('clf', SVC(C=0.8999999999999999, cache_size=200, class_weight=None, coef0=0.0,
                    decision_function_shape='ovr', degree=3, gamma='auto_deprecated',
                    kernel='rbf', max_iter=-1, probability=False, random_state=None,
                    shrinking=True, tol=0.001, verbose=False))])

    pipe_lr.fit(X_train, y_train)

    classifier.fit(X_train, y_train)

    print(f"Training Data Score: {pipe_lr.score(X_train, y_train)}")
    print(f"Testing Data Score: {pipe_lr.score(X_test, y_test)}")

    training_score = pipe_lr.score(X_train, y_train)
    testing_score = pipe_lr.score(X_test, y_test)

    predictions = pipe_lr.predict(X_test)

    print(f"First 10 Predictions:   {predictions[:10]}")
    print(f"First 10 Actual labels: {y_test[:10].tolist()}")

    
    from joblib import dump, load
    dump(pipe_lr, 'classifier.joblib')
 
  
###########################
    data = {
        "training_score": training_score ,
        "testing_score": testing_score,
         "predictions": predictions.tolist(),
         "actuals": y_test.tolist()
     
    }
    
    return jsonify(data)

##################################

###neural######################
@app.route("/neural")
def neural():
    """process neural."""
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd

    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    from keras.models import Sequential
    from keras.layers import Dense
    from keras.utils import to_categorical

    print('in app neural loop#')

    # filename = 'census_crime_data_cleaned.csv'        
    # filename = 'crime and census/combined_cleaned_encode.csv' 
    # print('in app neural loop#', filename)

    # census = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))

    stmt = db.session.query(Crime_data).statement
    census = pd.read_sql_query(stmt, db.session.bind)


    # max_num = census['crime_rate'].max()
    # min_num = census['crime_rate'].min()
    # print(max_num)
    # print(min_num)

    # for index, row in census.iterrows():
    #     if(row['crime_rating'] == "High"):
    #         blah = 2
    #     elif(row['crime_rating'] == 'Medium'):
    #         blah = 1
    #     else:
    #         blah = 0
    #     census.at[index, 'encode'] = blah

    X = census[["MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyRate"]]
    y = census["crime_encode"].values.reshape(-1, 1)
    # print(X.shape)
    # print(y.shape)

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=4, stratify=y)

    X_scaler = StandardScaler().fit(X_train)

    X_train_scaled = X_scaler.transform(X_train)
    X_test_scaled = X_scaler.transform(X_test)
    
    # One-hot encoding
    y_train_categorical = to_categorical(y_train)
    y_test_categorical = to_categorical(y_test)

    
    # start Keras modeling
    model = Sequential()
    number_inputs = 4
    number_hidden_nodes = 100
    number_classes = 3

    model.add(Dense(units=number_hidden_nodes,
                    activation='relu', input_dim=number_inputs))
    model.add(Dense(units=number_classes, activation='softmax'))                   

    model.compile(optimizer='adam',
              loss='mean_squared_error',
              metrics=['accuracy'])

    # Fit (train) the model
    model.fit(
        X_train_scaled,
        y_train_categorical,
        epochs=750,
        shuffle=True,
        verbose=2
    )


    # Evaluate the model using the testing data
    model_loss, model_accuracy = model.evaluate(
        X_test_scaled, y_test_categorical, verbose=2)
    print(f"Loss: {model_loss}, Accuracy: {model_accuracy}")

    model.save("neural.h5")

    ################################################################################

   
###########################
    data = {
        "model_loss": model_loss,
        "model_accuracy": model_accuracy
    }
    
    return jsonify(data)


@app.route("/SVM")
def SVM():
    stmt = db.session.query(Crime_data).statement
    census = pd.read_sql_query(stmt, db.session.bind)

    for index, row in census.iterrows():
        if(row['crime_rating'] == "high"):
            blah = 1
        elif(row['crime_rating'] == 'medium'):
            blah = 0
        else:
            blah = -1
        census.at[index, 'encode'] = blah

    target = census["encode"]
    target_names = ["Low","Medium", "High"]

    data = census[["MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyRate"]]

    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(data, target, random_state=42)

    from sklearn.preprocessing import StandardScaler

    # Create a StandardScater model and fit it to the training data
    X_scaler = StandardScaler().fit(X_train)
    X_train_scaled = X_scaler.transform(X_train)
    X_test_scaled = X_scaler.transform(X_test)

    from keras.utils import to_categorical

    y_train_categorical = to_categorical(y_train)
    y_test_categorical = to_categorical(y_test)

    from sklearn.svm import SVC 
    model = SVC(kernel='linear')
    model.fit(X_train_scaled, y_train)

    SVMscore = model.score(X_test_scaled, y_test)

    print('Test Acc: %.3f' % SVMscore)

    from sklearn.model_selection import GridSearchCV
    param_grid = {'C': [1, 5, 10, 50],
                  'gamma': [0.0001, 0.0005, 0.001, 0.005]}
    grid = GridSearchCV(model, param_grid, verbose=3)

    grid.fit(X_train_scaled, y_train)

    predictions = grid.predict(X_test_scaled)

    print(grid.best_params_)
    print(grid.best_score_)

    Xplot = np.array(data)
    yplot = np.array(census["encode"])

    print(Xplot)
    print(yplot)

    data = {
        "SVM_score": SVMscore, 
        "Best_Grid_Params": grid.best_params_,
        "Best_Grid_Score": grid.best_score_,
        "PlotX": Xplot.tolist(),
        "PlotY": yplot.tolist()
    }
    return jsonify(data)


@app.route('/citystate/<field>')
def citystate(field):

    stmt = db.session.query(City_zip).statement
    df_census = pd.read_sql_query(stmt, db.session.bind)

    from keras.models import load_model
    from uszipcode import SearchEngine
    search = SearchEngine(simple_zipcode=True)
    print(field)
    city = field.split('-')[0]
    state = field.split('-')[1]
    res = search.by_city_and_state(city,state, returns = 30)
    total = len(res)
    lat = res[0].lat
    lng = res[0].lng

    # print(lat)
    print(total)

    import random

    if total <= 10:
        count =[]
        for x in range(total):
            count.append(int(x))
    else:
        count = random.sample(range(0, total), (total-1))
        # count = 5

    print(count)

    zipArry = []
    ziplat = []
    ziplng = []

    for x in count:
        print(x)
        item = res[x]
        print(item)
        if (item.lat == None):
            continue
        else:
            zipArry.append(item.zipcode)
            ziplat.append(float(item.lat))
            ziplng.append(float(item.lng))

    df_test = pd.DataFrame({'Zipcode': zipArry, 'Latitude': ziplat, 'Longitude': ziplng})

    print(df_test)

    merge_table = pd.merge(df_census, df_test, on="Zipcode", how='inner')
    merge_table = merge_table[(merge_table != 0).all(1)]
    merge_table = merge_table[(merge_table != '').all(1)]
    merge_table = merge_table.dropna()
    
    print(merge_table)

    #["MedianAge", "HouseholdIncome", "PerCapitaIncome", "PovertyRate"]

    from joblib import dump, load
    loaded_model = load('classifier.joblib') 

    # print("loading neural model")
    # loaded_model = load_model("neural.h5")
    # print("model loaded")
    merge_table['prediction'] = ""

    print("starting for loop")
    for index,row in merge_table.iterrows():
        #for logistic regression
        input_data = [float(row['MedianAge']), float(row['HouseholdIncome']),\
            float(row['PerCapitaIncome']), float(row['PovertyRate'])]
        #for neural network
        a = np.array([input_data])
        print(a)
        # for logistic regression
        result = loaded_model.predict([input_data])[0]
        merge_table.at[index, 'prediction'] = result
        # for neural network model
        # result = loaded_model.predict_classes(a)
        # if result[0] == 2:
        #     final = 'high'
        # elif result[0] == 1:
        #     final = 'medium'
        # else:
        #     final = 'low'
        # merge_table.at[index, 'prediction'] = final

    print(merge_table)

    ###########################
    data = {
        "total_results": len(count),
        "latitude": merge_table.Latitude.tolist(),
        "longitude": merge_table.Longitude.tolist(),
        "zipcode": merge_table.Zipcode.tolist(),
        "MedianAge": merge_table.MedianAge.tolist(),
        "HouseholdIncome": merge_table.HouseholdIncome.tolist(),
        "PerCapitaIncome": merge_table.PerCapitaIncome.tolist(),
        "PovertyRate": merge_table.PovertyRate.tolist(),
        "Predictions": merge_table.prediction.tolist()
        # "zipcode": zipArry

    }

    return jsonify(data)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
            'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)


