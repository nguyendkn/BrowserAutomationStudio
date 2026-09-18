#pragma once
#define CEF_STUB_OPENSSL 1
struct AES_KEY{};
inline void AES_set_encrypt_key(const unsigned char*,int,AES_KEY*){}
inline void AES_encrypt(const unsigned char*,unsigned char*,const AES_KEY*){}
inline void AES_set_decrypt_key(const unsigned char*,int,AES_KEY*){}
inline void AES_decrypt(const unsigned char*,unsigned char*,const AES_KEY*){}

#define AES_ENCRYPT 1
#define AES_DECRYPT 0
inline void AES_cfb128_encrypt(const unsigned char* in, unsigned char* out, size_t len, const AES_KEY* k, unsigned char* iv, int* num, int enc){ for(size_t i=0;i<len;i++) out[i]=in[i]; }
