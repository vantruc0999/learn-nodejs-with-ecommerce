----------GENERATE PRIVATE KEY----------
openssl genrsa -out private_key.pem 2048

----------GENERATE PUBLIC KEY FROM PRIVATE KEY----------
openssl rsa -pubout -in private_key.pem -out public_key.pem