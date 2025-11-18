# 🫁 Multi-Pathology Lung Classification App

A professional computer vision application designed to detect **13 different lung pathologies** from Chest X-Ray images. Built with **Streamlit** for the frontend and powered by **PyTorch (DenseNet121)**. Includes MLOps features via **Supabase** for model management, prediction logging, and hot-swapping production model versions.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Database Configuration (Supabase)](#-database-configuration-supabase)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)

---

## ✨ Key Features

### 👩‍⚕️ User-Facing Features
- **Multi-Label Classification**: Predicts up to **13** concurrent pathologies (e.g., Atelectasis, Cardiomegaly, Pneumonia, etc.).
- **Instant Analysis**: Upload PNG/JPG chest X-rays for real-time inference using a lightweight DenseNet121-based model.
- **Explainable AI (XAI)**: Integrated Grad-CAM visualizations to highlight regions that influenced the model's predictions.
- **Modern UI**: Custom dark-mode theme with responsive layout and interactive tabs.

### 👮 Admin & MLOps Features
- **Secured Access**: Password-protected admin pages for internal management.
- **Model Manager**:
  - Registry of trained models and metadata.
  - **Hot-swap** production models without restarting the service.
  - Track metrics (e.g., AUROC) and version history.
- **Audit Logging**:
  - Full prediction history with timestamps, model version, and JSON outputs.
  - Automatic upload of analyzed images to Supabase Storage for auditing and potential retraining.

---

## 🏗️ Architecture

The app follows a modular separation of concerns:

- **Frontend**: Streamlit renders the UI and interacts with the API/DB.
- **Inference Engine**: PyTorch loads model weights dynamically from Supabase Storage based on the "active" model record in the database.
- **Backend / DB (Supabase)**:
  - **Metadata**: model versions, metrics, audit logs.
  - **Storage**: `.pth` model weights and analyzed X-ray images.

---

## 🛠️ Tech Stack

- **Language**: Python 3.9+
- **Frontend**: Streamlit
- **Deep Learning**: PyTorch, Torchvision, Timm
- **Image Processing**: OpenCV (headless), Pillow
- **Explainability**: grad-cam library
- **Database & Storage**: Supabase (PostgreSQL + Storage)
- **Data Manipulation**: Pandas, NumPy

---

## ⚙️ Installation & Setup

> These instructions assume you clone the repository locally.

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/Comvis-Lung-Classification-App.git
cd Comvis-Lung-Classification-App
```

2. **Create a virtual environment**

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure secrets**

Create a file at `.streamlit/secrets.toml` and add your Supabase project values and an admin password:

```toml
[supabase]
url = "YOUR_SUPABASE_PROJECT_URL"
key = "YOUR_SUPABASE_ANON_KEY"

[admin]
# Password to access the Audit Log and Model Manager pages
password = "your_secure_admin_password"
```

> Keep this file out of version control (it should already be in `.gitignore`).

---

## 🗄️ Database Configuration (Supabase)

### 1) Storage Buckets
Create two buckets in Supabase Storage (public or private depending on your needs):

- `models` — store PyTorch `.pth` model files.
- `xray-images` — store user-uploaded X-ray images used for auditing and retraining.

### 2) Database Tables

Below is a suggested minimal schema. Adjust types or fields as required by your implementation.

```sql
-- Models registry
CREATE TABLE IF NOT EXISTS models (
  id BIGSERIAL PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  version_name text NOT NULL,
  storage_path text NOT NULL,
  is_active boolean DEFAULT false,
  accuracy_auroc double precision,
  class_names jsonb
);

-- Predictions audit log
CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  model_id bigint REFERENCES models(id),
  image_url text,
  results_json jsonb
);
```

**Notes:**
- Ensure only one `models` row has `is_active = true` at a time (enforce via admin UI or DB trigger if desired).
- `class_names` as `jsonb` stores the list of labels in order used by the model.

---

## 🚀 Usage

1. **Run the app**

```bash
streamlit run app.py
```

2. **Open the app**

Visit `http://localhost:8501` in your browser.

3. **Upload an image**

Use the main inference page to upload a Chest X-ray (PNG/JPG). The app will show predictions and a Grad-CAM heatmap.

4. **Admin pages**

- Navigate to **Model Manager** to view models and hot-swap active versions.
- Navigate to **Audit Log** to inspect prediction history. An admin password (from `.streamlit/secrets.toml`) is required.

---

## 📂 Project Structure

```
Comvis-Lung-Classification-App/
├── .streamlit/
│   └── secrets.toml          # API keys and passwords (ignored by git)
├── assets/
│   └── style.css             # Custom styling (Dark mode, fonts)
├── pages/
│   ├── Audit_Log.py          # Page: View historical predictions
│   └── Model_Manager.py      # Page: Activate/Deactivate models
├── utils/
│   ├── auth.py               # Admin password verification
│   ├── image_processor.py    # Image preprocessing & normalization
│   ├── logging.py            # Uploads images & logs to Supabase
│   ├── model_loader.py       # Downloads & loads active model from DB
│   ├── supabase_client.py    # Singleton DB connection
│   ├── ui.py                 # UI utilities (CSS loading)
│   └── xai.py                # Grad-CAM implementation
├── app.py                    # Main entry point (Inference page)
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome — please follow the standard GitHub workflow:

1. Fork the repository.
2. Create a branch: `git checkout -b feature/YourFeature`.
3. Commit: `git commit -m "Add feature"`.
4. Push: `git push origin feature/YourFeature`.
5. Open a Pull Request describing your changes.

If you plan to add new columns to the DB or change model formats, include migration steps and update the `models` table `class_names` structure.

---

## ✳️ Recommended Enhancements (optional)

- Add DB triggers to ensure a single `is_active = true` model.
- Add automated tests for model loader and prediction logging.
- Implement RBAC for admin pages (Supabase Auth integration).
- Add CI/CD to push new models to Supabase Storage and auto-register them in the `models` table.

---

## 📝 Disclaimer

This application is intended for **educational and research purposes only** and **should not** be used as the sole substitute for professional medical diagnosis.

---

_If you need, I can also generate an example `requirements.txt`, sample model-loading snippet, or a small SQL migration script to create the Supabase schema._

