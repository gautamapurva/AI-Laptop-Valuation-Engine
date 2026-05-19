from flask import Flask, render_template, request, jsonify # <-- Add jsonify here
import pickle
import pandas as pd
import time # Just to simulate a slight AI "thinking" delay

# ... (Keep your model loading and home route the same) ...

@app.route('/predict', methods=['POST'])
def predict():
    # Grab data from the AJAX request
    brand = request.form.get('brand')
    ram = int(request.form.get('ram'))
    rom = int(request.form.get('rom'))
    cpu = request.form.get('cpu')
    gpu = request.form.get('gpu')
    ppi = float(request.form.get('ppi'))

    # Format into DataFrame and One-Hot Encode
    user_input = pd.DataFrame([[brand, ram, rom, cpu, gpu, ppi]], 
                              columns=['brand', 'Ram', 'ROM', 'Cpu_brand', 'Gpu_brand', 'ppi'])
    input_encoded = pd.get_dummies(user_input)
    model_columns = df_final.drop(columns=['price']).columns
    final_input = input_encoded.reindex(columns=model_columns, fill_value=0)
    
    # Predict
    time.sleep(0.8) # Adds a realistic 0.8-second delay for the loading animation!
    prediction = model.predict(final_input)[0]
    
    # Return JSON data instead of a new HTML page
    return jsonify({
        'status': 'success',
        'price': f"₹ {int(prediction):,}"
    })

if __name__ == "__main__":
    app.run(debug=True)