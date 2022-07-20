import pandas as pd
import json

df = pd.read_csv('data/overall_expenditures.csv')

df_json = json.loads(df.to_json(orient='table'))

final_json = { 'name': 'budget', 'pct': [], 'total': [] }

for record in df_json['data']:
    for year in list(record.keys())[2:]:
        dict_entry = {}
        dict_entry['department'] = record['Department']
        dict_entry['year'] = year
        dict_entry['size'] = record[year]

        if record['index'] < 5:
            final_json['pct'].append(dict_entry)
        else:
            final_json['total'].append(dict_entry)

        
with open('data/budget.json', 'w') as f:
    json.dump(final_json, f)

df = pd.read_csv('data/human_resources_breakdown.csv')

df_json = json.loads(df.to_json(orient='table'))

final_json = { 'name': 'human_resources', 'total': [], 'pct': [] }

for record in df_json['data']:
    for year in list(record.keys())[2:]:
        dict_entry = {}
        dict_entry['department'] = record['Department']
        dict_entry['year'] = year
        dict_entry['size'] = record[year]

        final_json['total'].append(dict_entry)

with open('data/human_resources.json', 'w') as f:
    json.dump(final_json, f)

df = pd.read_csv('data/physical_resources.csv')

df_json = json.loads(df.to_json(orient='table'))

final_json = { 'name': 'physical_resources', 'total': [], 'pct': [] }

for record in df_json['data']:
    for year in list(record.keys())[2:]:
        dict_entry = {}
        dict_entry['department'] = record['Department']
        dict_entry['year'] = year
        dict_entry['size'] = record[year]

        final_json['total'].append(dict_entry)

with open('data/physical_resources.json', 'w') as f:
    json.dump(final_json, f)

df = pd.read_csv('data/other_functions.csv')

df_json = json.loads(df.to_json(orient='table'))

final_json = { 'name': 'other_functions', 'total': [], 'pct': [] }

for record in df_json['data']:
    for year in list(record.keys())[2:]:
        dict_entry = {}
        dict_entry['department'] = record['Department']
        dict_entry['year'] = year
        dict_entry['size'] = record[year]

        final_json['total'].append(dict_entry)

with open('data/other_functions.json', 'w') as f:
    json.dump(final_json, f)