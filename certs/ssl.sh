#! /bin/bash

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]
then
  echo "Error: No domain name / operating system argument provided"
  echo "Usage: Provide a domain name and operating system as an argument e.g. './ssl.sh localhost windows|osx'"
  exit 1
fi

DOMAIN=$1
OS=$2
ALTDOMAIN=$3

echo "Generating SSL cert for '${DOMAIN}' running on '${OS}'..."
if [ -n "$ALTDOMAIN" ]; then
  echo "Including alternate domain '${ALTDOMAIN}' in the certificate..."
fi

# Create root CA & Private key
cd certs
openssl req -x509 \
            -sha256 -days 356 \
            -nodes \
            -newkey rsa:2048 \
            -subj "//SKIP=skip/CN=${DOMAIN}/C=NZ/L=Auckland" \
            -keyout rootCA.key -out rootCA.crt

# Generate Private key 

openssl genrsa -out ${DOMAIN}.key 2048

# Create csf conf

cat > csr.conf <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[ dn ]
C = NZ
ST = Auckland
L = Auckland
O = Nexus Solutions NZ Limited
OU = Comp World
CN = ${DOMAIN}

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = ${DOMAIN}
DNS.2 = ${DOMAIN}
IP.1 = 127.0.0.1 
IP.2 = 127.0.0.1

EOF

if [ -n "$ALTDOMAIN" ]; then
  echo "DNS.3 = ${ALTDOMAIN}" >> csr.conf
fi

# create CSR request using private key

openssl req -new -key ${DOMAIN}.key -out ${DOMAIN}.csr -config csr.conf

# Create a external config file for the certificate

cat > cert.conf <<EOF

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}

EOF

if [ -n "$ALTDOMAIN" ]; then
  echo "DNS.2 = ${ALTDOMAIN}" >> cert.conf
else
  echo "DNS.2 = ${DOMAIN}" >> cert.conf
fi

# Create SSl with self signed CA

openssl x509 -req \
    -in ${DOMAIN}.csr \
    -CA rootCA.crt -CAkey rootCA.key \
    -CAcreateserial -out ${DOMAIN}.crt \
    -days 365 \
    -sha256 -extfile cert.conf

if [ "${OS}" = "windows" ]
then
  echo "Adding certificate to Root store..."
  certutil -addstore "Root" rootCA.crt
elif [ "${OS}" = "osx" ]
then
  echo "Adding certificate to System Keychain..."
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain rootCA.crt
else
  echo "The provided operating system argument '${OS}' is not valid. Please specify 'windows' or 'osx'!"
fi
