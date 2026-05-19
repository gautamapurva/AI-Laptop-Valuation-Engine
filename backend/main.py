import time
import pickle
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model and reference data...")
with open('laptop_price_model.pkl', 'rb') as f:
    model = pickle.load(f)

df_final = pd.read_pickle('laptop_data.pkl')
# The model expects 66 features, which corresponds to dropping 'price' from the dataset
model_columns = df_final.drop(columns=['price']).columns
print("Model ready!")

class LaptopFeatures(BaseModel):
    brand: str
    ram: int
    rom: int
    cpu: str
    gpu: str
    ppi: float

@app.post("/predict")
def predict_price(features: LaptopFeatures):
    # Format into DataFrame and One-Hot Encode
    user_input = pd.DataFrame([[features.brand, features.ram, features.rom, features.cpu, features.gpu, features.ppi]], 
                              columns=['brand', 'Ram', 'ROM', 'Cpu_brand', 'Gpu_brand', 'ppi'])
    
    input_encoded = pd.get_dummies(user_input)
    
    # flawlessly align the input data to the 66 columns the model expects
    final_input = input_encoded.reindex(columns=model_columns, fill_value=0)
    
    # Predict
    time.sleep(0.8) # Adds a realistic 0.8-second delay for the loading animation!
    prediction = model.predict(final_input)[0]
    
    return {
        "status": "success",
        "price": f"₹ {int(prediction):,}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
