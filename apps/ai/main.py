"""
PriceLens Nigeria — AI Service
FastAPI-based microservice for basket optimization, price prediction, 
receipt scanning, and Nigeria Price Index calculations.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PriceLens Nigeria AI Service",
    description="AI-powered price intelligence, basket optimization, and receipt scanning",
    version="1.0.0",
    docs_url="/ai/docs",
    redoc_url="/ai/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ai/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "pricelens-ai",
    }


@app.post("/ai/optimize-basket")
async def optimize_basket():
    """Optimize a shopping basket to find cheapest store combinations"""
    # TODO: Implement in Phase 3
    return {"message": "Basket optimizer — coming soon"}


@app.post("/ai/predict-price")
async def predict_price():
    """Predict future price of a product based on historical data"""
    # TODO: Implement in Phase 3
    return {"message": "Price prediction — coming soon"}


@app.post("/ai/smart-suggestions")
async def smart_suggestions():
    """Suggest cheaper alternatives for products"""
    # TODO: Implement in Phase 3
    return {"message": "Smart suggestions — coming soon"}


@app.get("/ai/price-index")
async def price_index():
    """Calculate aggregate price index per state/city/region"""
    # TODO: Implement in Phase 3
    return {"message": "Nigeria Price Index — coming soon"}


@app.post("/ai/scan-receipt")
async def scan_receipt():
    """OCR scan a receipt image, extract items and prices"""
    # TODO: Implement in Phase 3
    return {"message": "Receipt scanner — coming soon"}


@app.post("/ai/categorize-product")
async def categorize_product():
    """Auto-categorize a product using AI"""
    # TODO: Implement in Phase 3
    return {"message": "Product categorization — coming soon"}
