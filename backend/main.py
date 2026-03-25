from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fuzzy_logic import calculate_green_duration

app = FastAPI(title="Traffic Light Fuzzy Logic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrafficData(BaseModel):
    queue_length: int
    approach_density: int

class DurationResponse(BaseModel):
    green_duration: float

@app.post("/calculate", response_model=DurationResponse)
def calculate_duration(data: TrafficData):
    try:
        duration = calculate_green_duration(data.queue_length, data.approach_density)
        return {"green_duration": duration}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}
