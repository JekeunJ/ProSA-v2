from google.cloud import storage
from datetime import datetime
import tensorflow as tf
import io
import os

def save_model(model, accuracy):
  buffer = io.BytesIO()
  tf.saved_model.save(model, buffer)
  buffer.seek(0)  # Rewind the buffer to the beginning so it's ready for reading

  blob_name = f'model_{datetime.now().strftime("%m_%d_%Y_%H-%M-%S")}'

  client = storage.Client()
  bucket = client.bucket(os.environ["GOOGLE_STORAGE_BUCKET"])
  blob = bucket.blob(blob_name)

  blob.metadata = { 'accuracy': accuracy }

  # Check existing models and delete those less accurate
  for b in client.list_blobs(os.environ["GOOGLE_STORAGE_BUCKET"]):
    if b.metadata and 'accuracy' in b.metadata:
      existing_accuracy = float(b.metadata['accuracy'])
      if existing_accuracy < accuracy:
        print(f"Deleting less accurate model: {b.name} with accuracy {existing_accuracy}")
        blob.delete()

  blob.upload_from_file(buffer, content_type='application/octet-stream')

def load_model(best=True):
  client = storage.Client()

  best_accuracy = 0
  most_recent_model = None
  best_model = None

  for blob in client.list_blobs(os.environ["GOOGLE_STORAGE_BUCKET"]):
      if blob.metadata and 'accuracy' in blob.metadata:
          accuracy = float(blob.metadata['accuracy'])
          if best and accuracy > best_accuracy:
              best_accuracy = accuracy
              best_model = blob
          if not best and (most_recent_model is None or blob.time_created > most_recent_model.time_created):
              most_recent_model = blob

  model_blob = best_model if best else most_recent_model
  model_url = model_blob.generate_signed_url(expiration=3600)

  return tf.keras.models.load_model(model_url)
