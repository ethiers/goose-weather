import sys

separator = "="
keys = {}

with open('.env', 'r') as file :
  for line in file:
    if separator in line:
      # Find the name and value by splitting the string
      name, value = line.split(separator, 1)

      keys[name.strip()] = value.strip()

# environment.ts
with open('src/environments/environment.ts', 'r') as file :
  filedata = file.read()

filedata = filedata.replace('OPEN_WEATHER_MAP_API_KEY', keys['openweatherapikey'])

with open('src/environments/environment.ts', 'w') as file:
  file.write(filedata)

# environment.prod.ts
with open('src/environments/environment.prod.ts', 'r') as file :
  filedata = file.read()

filedata = filedata.replace('OPEN_WEATHER_MAP_API_KEY', keys['openweatherapikey'])

with open('src/environments/environment.prod.ts', 'w') as file:
  file.write(filedata)
