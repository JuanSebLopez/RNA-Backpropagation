#import pandas as pd
#
#datos = pd.read_csv("data/e.csv")
#
#print(datos)
#
#datos_onehot = pd.get_dummies(datos, columns=["cuantia", "vivienda", "trabajo", "credito"])
#
#datos_completos = pd.concat([datos, datos_onehot], axis = 1)
#
#print(datos_onehot)
#
## Convert all categorical features to 1/0 numerical representations
#datos_completos = datos_completos.astype(dtype={"credito": {1: 1, 0: 0}, "cuantia_alta": int, "cuantia_baja": int, "cuantia_media": int, "vivienda_alquiler": int, "vivienda_propiedad": int, "trabajo_no": int, "trabajo_si": int})
#
## Print the updated DataFrame
#print(datos_completos)
#