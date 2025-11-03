# setup_local_ssl.py

import sys
from pathlib import Path
import datetime
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import Encoding, PrivateFormat, NoEncryption

# --- Configuration ---
DOMAIN = "onelastmove.com"
WWW_DOMAIN = "www.onelastmove.com"
CERT_DIR = Path("local-certs")
CERT_PATH = CERT_DIR / "live" / DOMAIN
KEY_FILE = CERT_PATH / "privkey.pem"
CERT_FILE = CERT_PATH / "fullchain.pem"
ENV_FILE = Path(".env")
DAYS_VALID = 3650

def generate_self_signed_cert():
    """Generates a self-signed certificate and private key."""
    
    print("Generating self-signed certificate...")
    
    # 1. Create directories
    CERT_PATH.mkdir(parents=True, exist_ok=True)

    # 2. Generate Private Key
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # 3. Write Private Key to file
    with open(KEY_FILE, "wb") as f:
        f.write(key.private_bytes(
            encoding=Encoding.PEM,
            format=PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=NoEncryption()
        ))

    # 4. Generate Certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, DOMAIN)
    ])

    # Build the Subject Alternative Name (SAN) extension
    # This is crucial for browsers to accept the cert for all domains
    sans = [
        x509.DNSName(DOMAIN),
        x509.DNSName(WWW_DOMAIN),
        x509.DNSName("localhost"),
    ]

    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1))
        .not_valid_after(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=DAYS_VALID))
        .add_extension(x509.SubjectAlternativeName(sans), critical=False)
        .sign(key, hashes.SHA256(), default_backend())
    )

    # 5. Write Certificate to file
    with open(CERT_FILE, "wb") as f:
        f.write(cert.public_bytes(Encoding.PEM))

    print(f"Successfully generated certificate and key in {CERT_PATH}")

def create_env_file():
    """Creates the .env file if it doesn't exist."""
    if ENV_FILE.exists():
        print(f"{ENV_FILE} already exists.")
    else:
        # Use as_posix() to ensure forward slashes, which Docker Compose prefers
        env_path = f"./{CERT_DIR.as_posix()}"
        env_content = f"SSL_CERT_PATH={env_path}\n"
        ENV_FILE.write_text(env_content)
        print(f"Successfully created {ENV_FILE}") 

def main():
    # Check for library
    try:
        from cryptography import x509
    except ImportError:
        print("Error: The 'cryptography' library is not found.", file=sys.stderr)
        print("Please install it by running: pip install cryptography", file=sys.stderr)
        sys.exit(1)

    # 1. Create .env file
    create_env_file()

    # 2. Check if certs exist
    if KEY_FILE.exists() and CERT_FILE.exists():
        print(f"Certificates already exist in {CERT_PATH}. Skipping generation.")
    else:
        generate_self_signed_cert()
    
    print("\nLocal SSL setup is complete.")
    print("Remember to add 'local-certs/' and '.env' to your .gitignore file.")

if __name__ == "__main__":
    main()