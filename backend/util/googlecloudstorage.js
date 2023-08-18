const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    type: process.env.GCS_TYPE,
    project_id: process.env.GCS_PROJECT_ID,
    private_key_id: process.env.GCS_PRIVATE_KEY_ID,
    private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GCS_CLIENT_EMAIL,
    client_id: process.env.GCS_CLIENT_ID,
    auth_uri: process.env.GCS_AUTH_URI,
    token_uri: process.env.GCS_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCS_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GCS_CLIENT_X509_CERT_URL,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

module.exports = { bucket };
