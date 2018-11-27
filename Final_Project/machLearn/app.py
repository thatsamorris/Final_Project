# Example adapted from http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
# @NOTE: The code below is for educational purposes only.
# Consider using the more secure version at the link above for production apps
import os
from flask import Flask, request, render_template, send_from_directory, jsonify

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# CKR - for database stuff
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask_sqlalchemy import SQLAlchemy

import json


app = Flask(__name__)
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
    if field < '4':
        filename = 'census_crime_data.csv'
    else:
        filename = 'census_crime_data_cleaned.csv'

    filename = 'combined_cities_census.csv'        
    print('in app linear loop#', filename)

############################
    df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))
    print(df)
    if (field == '0' or field == '4' ):
        X = df['Household Income'].values.reshape(-1, 1)
        chartName = 'Household Income'
    elif (field == '1' or field == '5'):
        X = df['Median Age'].values.reshape(-1, 1)
        chartName = 'Median Age'
    elif (field == '2' or field == '6'):
        X = df['Poverty Rate'].values.reshape(-1, 1)
        chartName = 'Poverty Rate'
    else:
        X = df['Per Capita Income'].values.reshape(-1, 1)
        chartName = 'Per Capita Income'
    
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
@app.route("/R2")
def R2():
    """process LSD."""
   
   # filename = 'census_crime_data_cleaned.csv'
    # filename = 'austin_census_crime_data_cleaned.csv'
    filename = 'combined_cities_census.csv' 
    print('in app r2', filename)

############################
    census = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))

    array = ["Population", "Median Age", "Household Income", "Per Capita Income", "Poverty Count", "Poverty Rate"]

    from sklearn.linear_model import LinearRegression
    model = LinearRegression()

    score = []
    for variable in array:
        X = census[variable].values.reshape(-1, 1)
        y = census["crime_rate"].values.reshape(-1, 1)

    # Fitting our model with all of our features in X
        model.fit(X, y)

        score.append(model.score(X, y))
        

    X = census[["Median Age", "Household Income", "Per Capita Income", "Poverty Rate"]]
    y = census["crime_rate"].values.reshape(-1, 1)

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
    filename = 'combined_cities_census.csv'         
    print('in app clssifier loop#', filename)

    df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))

    X = df.drop(["crime_rating", "crime_rate", "Population", "PovertyCount"], axis=1)
    y = df["crime_rating"]
    print(X.shape, y.shape)
 
    from sklearn.model_selection import train_test_split

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1, stratify=y)

    from sklearn.linear_model import LogisticRegression
    classifier = LogisticRegression()
    #classifier

    classifier.fit(X_train, y_train)

    print(f"Training Data Score: {classifier.score(X_train, y_train)}")
    print(f"Testing Data Score: {classifier.score(X_test, y_test)}")

    
   
    
    training_score = classifier.score(X_train, y_train)
    testing_score = classifier.score(X_test, y_test)

    predictions = classifier.predict(X_test)

    print(f"First 10 Predictions:   {predictions[:10]}")
    print(f"First 10 Actual labels: {y_test[:10].tolist()}")

 
  
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
    filename = 'combined_cities_census.csv' 
    print('in app neural loop#', filename)

    census = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))


    # max_num = census['crime_rate'].max()
    # min_num = census['crime_rate'].min()
    # print(max_num)
    # print(min_num)

    for index, row in census.iterrows():
        if(row['crime_rating'] == "High"):
            blah = 2
        elif(row['crime_rating'] == 'Medium'):
            blah = 1
        else:
            blah = 0
        census.at[index, 'encode'] = blah

    X = census[["Median Age", "Household Income", "Per Capita Income", "Poverty Rate"]]
    y = census["encode"].values.reshape(-1, 1)
    # print(X.shape)
    # print(y.shape)

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=4)

    X_scaler = StandardScaler().fit(X_train)

    X_train_scaled = X_scaler.transform(X_train)
    X_test_scaled = X_scaler.transform(X_test)
    
    # One-hot encoding
    y_train_categorical = to_categorical(y_train)
    y_test_categorical = to_categorical(y_test)

    
    # start Keras modeling
    model = Sequential()
    number_inputs = 4
    number_hidden_nodes = 8
    model.add(Dense(units=number_hidden_nodes,
                    activation='relu', input_dim=number_inputs))

    number_classes = 3
    model.add(Dense(units=number_classes, activation='softmax'))                   

    model.compile(optimizer='adam',
              loss='mean_squared_error',
              metrics=['accuracy'])

    # Fit (train) the model
    model.fit(
        X_train_scaled,
        y_train_categorical,
        epochs=1000,
        shuffle=True,
        verbose=2
    )

    # Evaluate the model using the testing data
    model_loss, model_accuracy = model.evaluate(
        X_test_scaled, y_test_categorical, verbose=2)
    print(f"Loss: {model_loss}, Accuracy: {model_accuracy}")

    ################################################################################

   
###########################
    data = {
        "model_loss": model_loss,
        "model_accuracy": model_accuracy
    }
    
    return jsonify(data)




@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
            'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)


