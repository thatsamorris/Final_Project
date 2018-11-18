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

def procLSD(filename):
    print('we here!!')
    lsd = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    print(lsd)

    X = lsd.tc.values.reshape(-1, 1)
    y = lsd.score.values.reshape(-1, 1)

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

@app.route("/lsd/<filename>")
def lsd(filename):
    """process LSD."""
    print('in app lsd', filename)

############################
    lsd = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    print(lsd)

    X = lsd.tc.values.reshape(-1, 1)
    y = lsd.score.values.reshape(-1, 1)

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
  
###########################
    data = {
        "X": X.tolist(),
        "y": y.tolist()
    }
    
    return jsonify(data)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
            'favicon.ico',mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)


