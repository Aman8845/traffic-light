# run.ps1 - Start the entire Traffic Light Smart Controller project

Write-Host "Starting Backend FastAPI Server on Port 8000..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd 'd:\Project\traffic-light\backend'; .\venv\Scripts\Activate.ps1; uvicorn main:app --port 8000`""

Write-Host "Starting Frontend React Server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd 'd:\Project\traffic-light\frontend'; npm run dev`""

Write-Host "Servers are starting up! Please check the new terminal windows." -ForegroundColor Green
Write-Host "FastAPI API: http://127.0.0.1:8000"
Write-Host "React Dashboard: http://localhost:5173"
