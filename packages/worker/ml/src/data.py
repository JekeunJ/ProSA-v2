from google.cloud.sql.connector import connector
import pandas as pd
import os

# Relevant data
COLUMNS = [
  'client.age',
  'client.sex',
  'injury.joint',
  'days_since_injury',
  'rom.forward_flexion',
  'rom.abduction',
  'rom.external_rotation',
  'rom.internal_rotation',
  'strength.supraspinatus',
  'strength.adduction',
  'strength.external_rotation',
  'strength.internal_rotation',
  'strength.liftoff',
]
OUTPUT = 'injury.diagnosis.tear'

def get_connection():
  instance_connection_name = os.environ['GOOGLE_SQL_INSTANCE_CONNECTION_NAME'] # project_id:region:instance_name
  db_user = os.environ['GOOGLE_SQL_DB_USER']
  db_pass = os.environ['GOOGLE_SQL_DB_PASSWORD']
  db_name = os.environ['GOOGLE_SQL_DB_NAME']

  # Create the connection engine
  conn = connector.connect(
    instance_connection_name,
    "pymysql",
    user=db_user,
    password=db_pass,
    db=db_name
  )

  return conn

def run_query(query):
  with get_connection() as conn:
    return pd.read_sql(query, conn)

def get_data(**kwargs):
  query = f'SELECT {', '.join([*COLUMNS, OUTPUT])} FROM {os.environ['GOOGLE_SQL_DB_TABLE_NAME']}'

  # Optionally filter by joint
  if kwargs.get('joint', False):
    query = f'{query} WHERE injury.joint={kwargs.get('joint')}'

  dataframe = run_query(query).apply(pd.to_numeric, errors="coerce")

  # Optionally normalize every column
  if kwargs.get('normalize', False):
    for column in dataframe:
      dataframe[column] = (dataframe[column] - dataframe[column].min()) / (dataframe[column].max() - dataframe[column].min())

  output_column = dataframe[OUTPUT]
  return dataframe.drop(OUTPUT, axis = 1), output_column
