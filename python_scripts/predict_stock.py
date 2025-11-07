import sys, json, pandas as pd
from prophet import Prophet

# 1️⃣ Lire le fichier JSON passé en argument
if len(sys.argv) < 2:
    print(json.dumps([]))
    sys.exit()

file_path = sys.argv[1]

try:
    with open(file_path, 'r') as f:
        raw_data = json.load(f)
except Exception as e:
    print(json.dumps([]))
    sys.exit()

df = pd.DataFrame(raw_data)

# 2️⃣ Vérifier qu'il y a au moins 2 lignes
if df.shape[0] < 2:
    print(json.dumps([]))
    sys.exit()

# 3️⃣ Préparer les colonnes pour Prophet
df['ds'] = pd.to_datetime(df['ds'])
df['y'] = df['y'].astype(float)

# 4️⃣ Créer et entraîner le modèle
model = Prophet()
model.fit(df)

# 5️⃣ Créer les dates futures et prédire
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

# 6️⃣ Extraire les 30 prochains jours et stock_id
# 6️⃣ Extraire les 30 prochains jours et stock_id
result = []
for i, row in forecast.tail(30).iterrows():
    stock_id = int(df['stock_id'].iloc[0])  # convertir en int natif
    result.append({
        'ds': str(row['ds'].date()),        # string, ok
        'yhat': float(row['yhat']),         # convertir en float natif
        'stock_id': stock_id
    })

# 7️⃣ Retourner le JSON
print(json.dumps(result))

