"""
FastAPI ML Service — Prediksi Tier Kesegaran
=============================================
Satu-satunya job service ini: terima data produk, balikin prediksi tier.
Dipanggil oleh Express backend, bukan langsung dari frontend.

Jalankan:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import date
import joblib
import pandas as pd
import os

app = FastAPI(title="Taniku ML Service", version="1.0.0")

# Izinkan request dari Express (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Load model saat startup ────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model    = joblib.load(os.path.join(BASE_DIR, "model_tier_kesegaran.joblib"))
encoders = joblib.load(os.path.join(BASE_DIR, "encoders.joblib"))


# ── Schema request ─────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    product: str          = Field(..., example="tomat")
    storage_method: str   = Field(..., example="kulkas")   # suhu_ruang | kulkas | vakum
    harvest_date: date    = Field(..., example="2026-07-14")
    hygienic: bool        = Field(..., example=True)


# ── Schema response ────────────────────────────────────────────────────────────
class PredictResponse(BaseModel):
    tier: str                          # Fresh | Standard | Rescue
    confidence: dict[str, float] | None
    days_since_harvest: float
    warning: str | None = None


# ── Endpoint ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # Hitung hari sejak panen dari tanggal panen yang dikirim
    today = date.today()
    days_since_harvest = (today - req.harvest_date).days

    if days_since_harvest < 0:
        raise HTTPException(status_code=400, detail="harvest_date tidak boleh di masa depan")

    # Encode product
    try:
        product_enc = encoders["product"].transform([req.product.lower()])[0]
        warning = None
    except ValueError:
        # Produk belum dikenal model → fallback "Standard"
        return PredictResponse(
            tier="Standard",
            confidence=None,
            days_since_harvest=float(days_since_harvest),
            warning=f"Produk '{req.product}' belum dikenal model, menggunakan fallback Standard",
        )

    # Encode storage
    try:
        storage_enc = encoders["storage"].transform([req.storage_method])[0]
    except ValueError:
        storage_enc = encoders["storage"].transform(["suhu_ruang"])[0]

    X = pd.DataFrame([{
        "product_enc":        product_enc,
        "storage_enc":        storage_enc,
        "days_since_harvest": float(days_since_harvest),
        "hygienic":           int(req.hygienic),
    }])

    tier       = model.predict(X)[0]
    proba      = model.predict_proba(X)[0]
    confidence = {cls: round(float(p), 3) for cls, p in zip(model.classes_, proba)}

    return PredictResponse(
        tier=tier,
        confidence=confidence,
        days_since_harvest=float(days_since_harvest),
        warning=warning,
    )
