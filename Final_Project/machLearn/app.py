# Example adapted from http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
# @NOTE: The code below is for educational purposes only.
# Consider using the more secure version at the link above for production apps
import os
from flask import Flask, request, render_template, send_from_directory, jsonify

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


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
    print('in app linear loop#', filename)

############################
    df = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))
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
@app.route("/R2")
def R2():
    """process LSD."""
   
    filename = 'census_crime_data_cleaned.csv'
    print('in app r2', filename)

############################
    census = pd.read_csv(os.path.join(app.config['DATA_FOLDER'], filename))

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



@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
            'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)

