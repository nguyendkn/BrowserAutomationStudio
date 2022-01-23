#include "moduledll.h"
#include <QJsonObject>
#include <QMap>
#include <QJsonDocument>
#include <QByteArray>
#include <QVariant>
#include <QJsonArray>
#include <QTextCodec>
#include "curl/curl.h"

extern "C" {
	
	struct CurlData
    {
		CURL *handler = NULL;
		Timer timer;
		int timeout = 5 * 60 * 1000;
    }

    void *StartDll()
    {
		return 0;
    }
	
	void EndDll(void *DllData)
    {

    }
	
	void *StartThread()
    {
		CurlData *data = new CurlData();
        return data;
    }
	
	void CurlCleanup(CurlData *data)
	{
		if(data->handler)
		{
			curl_easy_cleanup(data->handler);
			data->handler = NULL;
		}
		
		data->timer.stop();
	}
	
	void EndThread(void *ThreadData)
    {
		CurlCleanup((CurlData*)ThreadData);
    }

    const char *StringifyReturnCode(int key)
    {
        if(key == 0)return "OK";
        if(key == 1)return "UNSUPPORTED_PROTOCOL";
        if(key == 2)return "FAILED_INIT";
        if(key == 3)return "URL_MALFORMAT";
        if(key == 4)return "NOT_BUILT_IN";
        if(key == 5)return "COULDNT_RESOLVE_PROXY";
        if(key == 6)return "COULDNT_RESOLVE_HOST";
        if(key == 7)return "COULDNT_CONNECT";
        if(key == 8)return "FTP_WEIRD_SERVER_REPLY";
        if(key == 9)return "REMOTE_ACCESS_DENIED";
        if(key == 10)return "FTP_ACCEPT_FAILED";
        if(key == 11)return "FTP_WEIRD_PASS_REPLY";
        if(key == 12)return "FTP_ACCEPT_TIMEOUT";
        if(key == 13)return "FTP_WEIRD_PASV_REPLY";
        if(key == 14)return "FTP_WEIRD_227_FORMAT";
        if(key == 15)return "FTP_CANT_GET_HOST";
        if(key == 16)return "HTTP2";
        if(key == 17)return "FTP_COULDNT_SET_TYPE";
        if(key == 18)return "PARTIAL_FILE";
        if(key == 19)return "FTP_COULDNT_RETR_FILE";
        if(key == 21)return "QUOTE_ERROR";
        if(key == 22)return "HTTP_RETURNED_ERROR";
        if(key == 23)return "WRITE_ERROR";
        if(key == 25)return "UPLOAD_FAILED";
        if(key == 26)return "READ_ERROR";
        if(key == 27)return "OUT_OF_MEMORY";
        if(key == 28)return "OPERATION_TIMEDOUT";
        if(key == 30)return "FTP_PORT_FAILED";
        if(key == 31)return "FTP_COULDNT_USE_REST";
        if(key == 33)return "RANGE_ERROR";
        if(key == 34)return "HTTP_POST_ERROR";
        if(key == 35)return "SSL_CONNECT_ERROR";
        if(key == 36)return "BAD_DOWNLOAD_RESUME";
        if(key == 37)return "FILE_COULDNT_READ_FILE";
        if(key == 38)return "LDAP_CANNOT_BIND";
        if(key == 39)return "LDAP_SEARCH_FAILED";
        if(key == 41)return "FUNCTION_NOT_FOUND";
        if(key == 42)return "ABORTED_BY_CALLBACK";
        if(key == 43)return "BAD_FUNCTION_ARGUMENT";
        if(key == 45)return "INTERFACE_FAILED";
        if(key == 47)return "TOO_MANY_REDIRECTS ";
        if(key == 48)return "UNKNOWN_OPTION";
        if(key == 49)return "TELNET_OPTION_SYNTAX ";
        if(key == 51)return "PEER_FAILED_VERIFICATION";
        if(key == 52)return "GOT_NOTHING";
        if(key == 53)return "SSL_ENGINE_NOTFOUND";
        if(key == 54)return "SSL_ENGINE_SETFAILED";
        if(key == 55)return "SEND_ERROR";
        if(key == 56)return "RECV_ERROR";
        if(key == 58)return "SSL_CERTPROBLEM";
        if(key == 59)return "SSL_CIPHER";
        if(key == 60)return "SSL_CACERT";
        if(key == 61)return "BAD_CONTENT_ENCODING";
        if(key == 62)return "LDAP_INVALID_URL";
        if(key == 63)return "FILESIZE_EXCEEDED";
        if(key == 64)return "USE_SSL_FAILED";
        if(key == 65)return "SEND_FAIL_REWIND";
        if(key == 66)return "SSL_ENGINE_INITFAILED";
        if(key == 67)return "LOGIN_DENIED";
        if(key == 68)return "TFTP_NOTFOUND";
        if(key == 69)return "TFTP_PERM";
        if(key == 70)return "REMOTE_DISK_FULL";
        if(key == 71)return "TFTP_ILLEGAL";
        if(key == 72)return "TFTP_UNKNOWNID";
        if(key == 73)return "REMOTE_FILE_EXISTS";
        if(key == 74)return "TFTP_NOSUCHUSER";
        if(key == 75)return "CONV_FAILED";
        if(key == 76)return "CONV_REQD";
        if(key == 77)return "SSL_CACERT_BADFILE";
        if(key == 78)return "REMOTE_FILE_NOT_FOUND";
        if(key == 79)return "SSH";
        if(key == 80)return "SSL_SHUTDOWN_FAILED";
        if(key == 81)return "AGAIN";
        if(key == 82)return "SSL_CRL_BADFILE";
        if(key == 83)return "SSL_ISSUER_ERROR";
        if(key == 84)return "FTP_PRET_FAILED";
        if(key == 85)return "RTSP_CSEQ_ERROR";
        if(key == 86)return "RTSP_SESSION_ERROR";
        if(key == 87)return "FTP_BAD_FILE_LIST";
        if(key == 88)return "CHUNK_FAILED";
        if(key == 89)return "NO_CONNECTION_AVAILABLE";
        if(key == 90)return "SSL_PINNEDPUBKEYNOTMATCH";
		if(key == 91)return "SSL_INVALIDCERTSTATUS";
		if(key == 92)return "HTTP2_STREAM";
		if(key == 93)return "RECURSIVE_API_CALL";
		if(key == 94)return "AUTH_ERROR";
		if(key == 95)return "HTTP3";
		if(key == 96)return "QUIC_CONNECT_ERROR";
		if(key == 98)return "SSL_CLIENTCERT";
        return "UNKNOWN";
    }
	
	int ParseKey(QString key)
    {
		key = key.toUpper();
		if(key.startsWith("CURLOPT_"))
		{
			key.remove(0, 8);
		}
        if(key == "WRITEDATA") return 10000 + 1;
		if(key == "FILE") return 10000 + 1;
		if(key == "URL") return 10000 + 2;
		if(key == "PORT") return 3;
		if(key == "PROXY") return 10000 + 4;
		if(key == "USERPWD") return 10000 + 5;
		if(key == "PROXYUSERPWD") return 10000 + 6;
		if(key == "RANGE") return 10000 + 7;
		if(key == "READDATA") return 10000 + 9;
		if(key == "INFILE") return 10000 + 9;
		if(key == "ERRORBUFFER") return 10000 + 10;
		if(key == "WRITEFUNCTION") return 20000 + 11;
		if(key == "READFUNCTION") return 20000 + 12;
		if(key == "TIMEOUT") return 13;
		if(key == "INFILESIZE") return 14;
		if(key == "POSTFIELDS") return 10000 + 15;
		if(key == "REFERER") return 10000 + 16;
		if(key == "FTPPORT") return 10000 + 17;
		if(key == "USERAGENT") return 10000 + 18;
		if(key == "LOW_SPEED_LIMIT") return 19;
		if(key == "LOW_SPEED_TIME") return 20;
		if(key == "RESUME_FROM") return 21;
		if(key == "COOKIE") return 10000 + 22;
		if(key == "HTTPHEADER") return 10000 + 23;
		if(key == "RTSPHEADER") return 10000 + 23;
		if(key == "HTTPPOST") return 10000 + 24;
		if(key == "SSLCERT") return 10000 + 25;
		if(key == "KEYPASSWD") return 10000 + 26;
		if(key == "SSLKEYPASSWD") return 10000 + 26;
		if(key == "SSLCERTPASSWD") return 10000 + 26;
		if(key == "CRLF") return 27;
		if(key == "QUOTE") return 10000 + 28;
		if(key == "HEADERDATA") return 10000 + 29;
		if(key == "WRITEHEADER") return 10000 + 29;
		if(key == "COOKIEFILE") return 10000 + 31;
		if(key == "SSLVERSION") return 32;
		if(key == "TIMECONDITION") return 33;
		if(key == "TIMEVALUE") return 34;
		if(key == "CUSTOMREQUEST") return 10000 + 36;
		if(key == "STDERR") return 10000 + 37;
		if(key == "POSTQUOTE") return 10000 + 39;
		if(key == "WRITEINFO") return 10000 + 40;
		if(key == "VERBOSE") return 41;
		if(key == "HEADER") return 42;
		if(key == "NOPROGRESS") return 43;
		if(key == "NOBODY") return 44;
		if(key == "FAILONERROR") return 45;
		if(key == "UPLOAD") return 46;
		if(key == "POST") return 47;
		if(key == "DIRLISTONLY") return 48;
		if(key == "FTPLISTONLY") return 48;
		if(key == "APPEND") return 50;
		if(key == "FTPAPPEND") return 50;
		if(key == "NETRC") return 51;
		if(key == "FOLLOWLOCATION") return 52;
		if(key == "TRANSFERTEXT") return 53;
		if(key == "PUT") return 54;
		if(key == "PROGRESSFUNCTION") return 20000 + 56;
		if(key == "PROGRESSDATA") return 10000 + 57;
		if(key == "XFERINFODATA") return 10000 + 57;
		if(key == "AUTOREFERER") return 58;
		if(key == "PROXYPORT") return 59;
		if(key == "POSTFIELDSIZE") return 60;
		if(key == "HTTPPROXYTUNNEL") return 61;
		if(key == "INTERFACE") return 10000 + 62;
		if(key == "KRBLEVEL") return 10000 + 63;
		if(key == "KRB4LEVEL") return 10000 + 63;
		if(key == "SSL_VERIFYPEER") return 64;
		if(key == "CAINFO") return 10000 + 65;
		if(key == "MAXREDIRS") return 68;
		if(key == "FILETIME") return 69;
		if(key == "TELNETOPTIONS") return 10000 + 70;
		if(key == "MAXCONNECTS") return 71;
		if(key == "CLOSEPOLICY") return 72;
		if(key == "FRESH_CONNECT") return 74;
		if(key == "FORBID_REUSE") return 75;
		if(key == "RANDOM_FILE") return 10000 + 76;
		if(key == "EGDSOCKET") return 10000 + 77;
		if(key == "CONNECTTIMEOUT") return 78;
		if(key == "HEADERFUNCTION") return 20000 + 79;
		if(key == "HTTPGET") return 80;
		if(key == "SSL_VERIFYHOST") return 81;
		if(key == "COOKIEJAR") return 10000 + 82;
		if(key == "SSL_CIPHER_LIST") return 10000 + 83;
		if(key == "HTTP_VERSION") return 84;
		if(key == "FTP_USE_EPSV") return 85;
		if(key == "SSLCERTTYPE") return 10000 + 86;
		if(key == "SSLKEY") return 10000 + 87;
		if(key == "SSLKEYTYPE") return 10000 + 88;
		if(key == "SSLENGINE") return 10000 + 89;
		if(key == "SSLENGINE_DEFAULT") return 90;
		if(key == "DNS_USE_GLOBAL_CACHE") return 91;
		if(key == "DNS_CACHE_TIMEOUT") return 92;
		if(key == "PREQUOTE") return 10000 + 93;
		if(key == "DEBUGFUNCTION") return 20000 + 94;
		if(key == "DEBUGDATA") return 10000 + 95;
		if(key == "COOKIESESSION") return 96;
		if(key == "CAPATH") return 10000 + 97;
		if(key == "BUFFERSIZE") return 98;
		if(key == "NOSIGNAL") return 99;
		if(key == "SHARE") return 10000 + 100;
		if(key == "PROXYTYPE") return 101;
		if(key == "ACCEPT_ENCODING") return 10000 + 102;
		if(key == "ENCODING") return 10000 + 102;
		if(key == "PRIVATE") return 10000 + 103;
		if(key == "HTTP200ALIASES") return 10000 + 104;
		if(key == "UNRESTRICTED_AUTH") return 105;
		if(key == "FTP_USE_EPRT") return 106;
		if(key == "HTTPAUTH") return 107;
		if(key == "SSL_CTX_FUNCTION") return 20000 + 108;
		if(key == "SSL_CTX_DATA") return 10000 + 109;
		if(key == "FTP_CREATE_MISSING_DIRS") return 110;
		if(key == "PROXYAUTH") return 111;
		if(key == "FTP_RESPONSE_TIMEOUT") return 112;
		if(key == "SERVER_RESPONSE_TIMEOUT") return 112;
		if(key == "IPRESOLVE") return 113;
		if(key == "MAXFILESIZE") return 114;
		if(key == "INFILESIZE_LARGE") return 30000 + 115;
		if(key == "RESUME_FROM_LARGE") return 30000 + 116;
		if(key == "MAXFILESIZE_LARGE") return 30000 + 117;
		if(key == "NETRC_FILE") return 10000 + 118;
		if(key == "USE_SSL") return 119;
		if(key == "FTP_SSL") return 119;
		if(key == "POSTFIELDSIZE_LARGE") return 30000 + 120;
		if(key == "TCP_NODELAY") return 121;
		if(key == "FTPSSLAUTH") return 129;
		if(key == "IOCTLFUNCTION") return 20000 + 130;
		if(key == "IOCTLDATA") return 10000 + 131;
		if(key == "FTP_ACCOUNT") return 10000 + 134;
		if(key == "COOKIELIST") return 10000 + 135;
		if(key == "IGNORE_CONTENT_LENGTH") return 136;
		if(key == "FTP_SKIP_PASV_IP") return 137;
		if(key == "FTP_FILEMETHOD") return 138;
		if(key == "LOCALPORT") return 139;
		if(key == "LOCALPORTRANGE") return 140;
		if(key == "CONNECT_ONLY") return 141;
		if(key == "CONV_FROM_NETWORK_FUNCTION") return 20000 + 142;
		if(key == "CONV_TO_NETWORK_FUNCTION") return 20000 + 143;
		if(key == "CONV_FROM_UTF8_FUNCTION") return 20000 + 144;
		if(key == "MAX_SEND_SPEED_LARGE") return 30000 + 145;
		if(key == "MAX_RECV_SPEED_LARGE") return 30000 + 146;
		if(key == "FTP_ALTERNATIVE_TO_USER") return 10000 + 147;
		if(key == "SOCKOPTFUNCTION") return 20000 + 148;
		if(key == "SOCKOPTDATA") return 10000 + 149;
		if(key == "SSL_SESSIONID_CACHE") return 150;
		if(key == "SSH_AUTH_TYPES") return 151;
		if(key == "SSH_PUBLIC_KEYFILE") return 10000 + 152;
		if(key == "SSH_PRIVATE_KEYFILE") return 10000 + 153;
		if(key == "FTP_SSL_CCC") return 154;
		if(key == "TIMEOUT_MS") return 155;
		if(key == "CONNECTTIMEOUT_MS") return 156;
		if(key == "HTTP_TRANSFER_DECODING") return 157;
		if(key == "HTTP_CONTENT_DECODING") return 158;
		if(key == "NEW_FILE_PERMS") return 159;
		if(key == "NEW_DIRECTORY_PERMS") return 160;
		if(key == "POSTREDIR") return 161;
		if(key == "POST301") return 161;
		if(key == "SSH_HOST_PUBLIC_KEY_MD5") return 10000 + 162;
		if(key == "OPENSOCKETFUNCTION") return 20000 + 163;
		if(key == "OPENSOCKETDATA") return 10000 + 164;
		if(key == "COPYPOSTFIELDS") return 10000 + 165;
		if(key == "PROXY_TRANSFER_MODE") return 166;
		if(key == "SEEKFUNCTION") return 20000 + 167;
		if(key == "SEEKDATA") return 10000 + 168;
		if(key == "CRLFILE") return 10000 + 169;
		if(key == "ISSUERCERT") return 10000 + 170;
		if(key == "ADDRESS_SCOPE") return 171;
		if(key == "CERTINFO") return 172;
		if(key == "USERNAME") return 10000 + 173;
		if(key == "PASSWORD") return 10000 + 174;
		if(key == "PROXYUSERNAME") return 10000 + 175;
		if(key == "PROXYPASSWORD") return 10000 + 176;
		if(key == "NOPROXY") return 10000 + 177;
		if(key == "TFTP_BLKSIZE") return 178;
		if(key == "SOCKS5_GSSAPI_SERVICE") return 10000 + 179;
		if(key == "SOCKS5_GSSAPI_NEC") return 180;
		if(key == "PROTOCOLS") return 181;
		if(key == "REDIR_PROTOCOLS") return 182;
		if(key == "SSH_KNOWNHOSTS") return 10000 + 183;
		if(key == "SSH_KEYFUNCTION") return 20000 + 184;
		if(key == "SSH_KEYDATA") return 10000 + 185;
		if(key == "MAIL_FROM") return 10000 + 186;
		if(key == "MAIL_RCPT") return 10000 + 187;
		if(key == "FTP_USE_PRET") return 188;
		if(key == "RTSP_REQUEST") return 189;
		if(key == "RTSP_SESSION_ID") return 10000 + 190;
		if(key == "RTSP_STREAM_URI") return 10000 + 191;
		if(key == "RTSP_TRANSPORT") return 10000 + 192;
		if(key == "RTSP_CLIENT_CSEQ") return 193;
		if(key == "RTSP_SERVER_CSEQ") return 194;
		if(key == "INTERLEAVEDATA") return 10000 + 195;
		if(key == "INTERLEAVEFUNCTION") return 20000 + 196;
		if(key == "WILDCARDMATCH") return 197;
		if(key == "CHUNK_BGN_FUNCTION") return 20000 + 198;
		if(key == "CHUNK_END_FUNCTION") return 20000 + 199;
		if(key == "FNMATCH_FUNCTION") return 20000 + 200;
		if(key == "CHUNK_DATA") return 10000 + 201;
		if(key == "FNMATCH_DATA") return 10000 + 202;
		if(key == "RESOLVE") return 10000 + 203;
		if(key == "TLSAUTH_USERNAME") return 10000 + 204;
		if(key == "TLSAUTH_PASSWORD") return 10000 + 205;
		if(key == "TLSAUTH_TYPE") return 10000 + 206;
		if(key == "TRANSFER_ENCODING") return 207;
		if(key == "CLOSESOCKETFUNCTION") return 20000 + 208;
		if(key == "CLOSESOCKETDATA") return 10000 + 209;
		if(key == "GSSAPI_DELEGATION") return 210;
		if(key == "DNS_SERVERS") return 10000 + 211;
		if(key == "ACCEPTTIMEOUT_MS") return 212;
		if(key == "TCP_KEEPALIVE") return 213;
		if(key == "TCP_KEEPIDLE") return 214;
		if(key == "TCP_KEEPINTVL") return 215;
		if(key == "SSL_OPTIONS") return 216;
		if(key == "MAIL_AUTH") return 10000 + 217;
		if(key == "SASL_IR") return 218;
		if(key == "XFERINFOFUNCTION") return 20000 + 219;
		if(key == "XOAUTH2_BEARER") return 10000 + 220;
		if(key == "DNS_INTERFACE") return 10000 + 221;
		if(key == "DNS_LOCAL_IP4") return 10000 + 222;
		if(key == "DNS_LOCAL_IP6") return 10000 + 223;
		if(key == "LOGIN_OPTIONS") return 10000 + 224;
		if(key == "SSL_ENABLE_NPN") return 225;
		if(key == "SSL_ENABLE_ALPN") return 226;
		if(key == "EXPECT_100_TIMEOUT_MS") return 227;
		if(key == "PROXYHEADER") return 10000 + 228;
		if(key == "HEADEROPT") return 229;
		if(key == "PINNEDPUBLICKEY") return 10000 + 230;
		if(key == "UNIX_SOCKET_PATH") return 10000 + 231;
		if(key == "SSL_VERIFYSTATUS") return 232;
		if(key == "SSL_FALSESTART") return 233;
		if(key == "PATH_AS_IS") return 234;
		if(key == "PROXY_SERVICE_NAME") return 10000 + 235;
		if(key == "SERVICE_NAME") return 10000 + 236;
		if(key == "PIPEWAIT") return 237;
		if(key == "DEFAULT_PROTOCOL") return 10000 + 238;
		if(key == "STREAM_WEIGHT") return 239;
		if(key == "STREAM_DEPENDS") return 10000 + 240;
		if(key == "STREAM_DEPENDS_E") return 10000 + 241;
		if(key == "TFTP_NO_OPTIONS") return 242;
		if(key == "CONNECT_TO") return 10000 + 243;
		if(key == "TCP_FASTOPEN") return 244;
		if(key == "KEEP_SENDING_ON_ERROR") return 245;
		if(key == "PROXY_CAINFO") return 10000 + 246;
		if(key == "PROXY_CAPATH") return 10000 + 247;
		if(key == "PROXY_SSL_VERIFYPEER") return 248;
		if(key == "PROXY_SSL_VERIFYHOST") return 249;
		if(key == "PROXY_SSLVERSION") return 250;
		if(key == "PROXY_TLSAUTH_USERNAME") return 10000 + 251;
		if(key == "PROXY_TLSAUTH_PASSWORD") return 10000 + 252;
		if(key == "PROXY_TLSAUTH_TYPE") return 10000 + 253;
		if(key == "PROXY_SSLCERT") return 10000 + 254;
		if(key == "PROXY_SSLCERTTYPE") return 10000 + 255;
		if(key == "PROXY_SSLKEY") return 10000 + 256;
		if(key == "PROXY_SSLKEYTYPE") return 10000 + 257;
		if(key == "PROXY_KEYPASSWD") return 10000 + 258;
		if(key == "PROXY_SSL_CIPHER_LIST") return 10000 + 259;
		if(key == "PROXY_CRLFILE") return 10000 + 260;
		if(key == "PROXY_SSL_OPTIONS") return 261;
		if(key == "PRE_PROXY") return 10000 + 262;
		if(key == "PROXY_PINNEDPUBLICKEY") return 10000 + 263;
		if(key == "ABSTRACT_UNIX_SOCKET") return 10000 + 264;
		if(key == "SUPPRESS_CONNECT_HEADERS") return 265;
		if(key == "REQUEST_TARGET") return 10000 + 266;
		if(key == "SOCKS5_AUTH") return 267;
		if(key == "SSH_COMPRESSION") return 268;
		if(key == "MIMEPOST") return 10000 + 269;
		if(key == "TIMEVALUE_LARGE") return 30000 + 270;
		if(key == "HAPPY_EYEBALLS_TIMEOUT_MS") return 271;
		if(key == "RESOLVER_START_FUNCTION") return 20000 + 272;
		if(key == "RESOLVER_START_DATA") return 10000 + 273;
		if(key == "HAPROXYPROTOCOL") return 274;
		if(key == "DNS_SHUFFLE_ADDRESSES") return 275;
		if(key == "TLS13_CIPHERS") return 10000 + 276;
		if(key == "PROXY_TLS13_CIPHERS") return 10000 + 277;
		if(key == "DISALLOW_USERNAME_IN_URL") return 278;
		if(key == "DOH_URL") return 10000 + 279;
		if(key == "UPLOAD_BUFFERSIZE") return 280;
		if(key == "UPKEEP_INTERVAL_MS") return 281;
		if(key == "CURLU") return 10000 + 282;
		if(key == "TRAILERFUNCTION") return 20000 + 283;
		if(key == "TRAILERDATA") return 10000 + 284;
		if(key == "HTTP09_ALLOWED") return 285;
		if(key == "ALTSVC_CTRL") return 286;
		if(key == "ALTSVC") return 10000 + 287;
		if(key == "MAXAGE_CONN") return 288;
		if(key == "SASL_AUTHZID") return 10000 + 289;
		if(key == "MAIL_RCPT_ALLLOWFAILS") return 290;
		if(key == "SSLCERT_BLOB") return 40000 + 291;
		if(key == "SSLKEY_BLOB") return 40000 + 292;
		if(key == "PROXY_SSLCERT_BLOB") return 40000 + 293;
		if(key == "PROXY_SSLKEY_BLOB") return 40000 + 294;
		if(key == "ISSUERCERT_BLOB") return 40000 + 295;
		if(key == "PROXY_ISSUERCERT") return 10000 + 296;
		if(key == "PROXY_ISSUERCERT_BLOB") return 40000 + 297;
		if(key == "SSL_EC_CURVES") return 10000 + 298;
		if(key == "HSTS_CTRL") return 299;
		if(key == "HSTS") return 10000 + 300;
		if(key == "HSTSREADFUNCTION") return 20000 + 301;
		if(key == "HSTSREADDATA") return 10000 + 302;
		if(key == "HSTSWRITEFUNCTION") return 20000 + 303;
		if(key == "HSTSWRITEDATA") return 10000 + 304;
		if(key == "AWS_SIG4") return 10000 + 305;
		if(key == "DOH_SSL_VERIFYPEER") return 306;
		if(key == "DOH_SSL_VERIFYHOST") return 307;
		if(key == "DOH_SSL_VERIFYSTATUS") return 308;
		if(key == "CAINFO_BLOB") return 40000 + 309;
		if(key == "PROXY_CAINFO_BLOB") return 40000 + 310;
		if(key == "MAXLIFETIME_CONN") return 314;
		if(key == "MIME_OPTIONS") return 315;
        return -1;
    }
	
	int WriteFunction(char* data, size_t size, size_t nmemb, QByteArray *writedata)
    {
        size_t realsize = size * nmemb;;
        
		writedata->append(data, realsize);
		
        return realsize;
    }
	
	struct DebugClass
    {
		bool isFetсh = false;
		bool isFetсhData = false;
		QByteArray Data;
		QByteArray FetсhData;
		QStringList FetсhList;
    };
	
	int DebugFunction(CURL *handle, curl_infotype type, char *data, size_t size, DebugClass *DebugData)
    {
		if(type != CURLINFO_SSL_DATA_OUT && type != CURLINFO_SSL_DATA_IN && type != CURLINFO_TEXT)
		{
			DebugData->Data.append(data, size);
			if(type == CURLINFO_HEADER_IN && DebugData->isFetсh)
			{
				QString start;
				for(int i = 0, len = size < 23 ? size : 23; i < len; i++)
				{
					start[i] = data[i];
				}
				if(start.contains(QRegExp("^\\* \\d+ FETCH")))
				{
					if(DebugData->isFetсhData)
					{
						DebugData->FetсhList.append(QString::fromUtf8(DebugData->FetсhData));
						DebugData->FetсhData.clear();
					}else
					{
						DebugData->isFetсhData = true;
					}
				}else if(DebugData->isFetсhData && start.contains(QRegExp("^[A-Z]\\d+ OK")))
				{
					DebugData->isFetсhData = false;
					DebugData->FetсhList.append(QString::fromUtf8(DebugData->FetсhData));
					DebugData->FetсhData.clear();
				}
				if(DebugData->isFetсhData)
				{
					DebugData->FetсhData.append(data, size);
				}
			}
		}
        return 0;
    }
	
	int ProgressFunction(void *clientp, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow)
    {
        if(*((bool *)clientp))
		{
			return 1;
        }else
		{
			return 0;
		}
    }
	
	void SetResult(QByteArray *ResArray, ResizeFunction AllocateSpace, void *AllocateData)
	{
		char *ResMemory = AllocateSpace(ResArray->size(), AllocateData);
		
		memcpy(ResMemory, ResArray->data(), ResArray->size());
	}
	
	void SetError(QString err, ResizeFunction AllocateSpace, void *AllocateData)
    {
        QVariantMap res;

        res.insert("success", false);

        res.insert("error", err);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        QByteArray ResArray = document.toJson();
		
		SetResult(&ResArray, AllocateSpace, AllocateData);
    }
	
	void CurlSetOpts(CURL *curl, QJsonObject Options)
	{
		for(QString key:Options.keys())
		{
			int keyint = ParseKey(key);
			if(keyint >= 0)
			{
				QVariant v = Options[key].toVariant();

				switch(v.type())
				{
					case QVariant::String:
					{
						curl_easy_setopt(curl, (CURLoption)keyint, v.toString().toUtf8().data());
						break;
					}
					case QVariant::Int:
					{
						curl_easy_setopt(curl, (CURLoption)keyint, (long)v.toInt());
						break;
					}
					case QVariant::Bool:
					{
						curl_easy_setopt(curl, (CURLoption)keyint, v.toBool());
						break;
					}
					case QVariant::Double:
					{
						curl_easy_setopt(curl, (CURLoption)keyint, (long)v.toDouble());
						break;
					}
				}
			}
		}
	}
	
	void InMail_CurlInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
	{
		CurlData *data = (CurlData*)ThreadData;
		if(data->handler)
		{
			curl_easy_reset(data->handler);
		}else
		{
			data->handler = curl_easy_init();
		}
	}
	
	void InMail_CurlIsInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
	{
		CurlData *data = (CurlData*)ThreadData;
		QByteArray ResArray;
		
		if(data->handler)
		{
			ResArray = QByteArray("true");
		}else
		{
			ResArray = QByteArray("false");
		}

        SetResult(&ResArray, AllocateSpace, AllocateData);
	}
	
	void InMail_CurlSetOpts(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
	{
		CurlData *data = (CurlData*)ThreadData;
		CURL *curl = (CURL*)data->handler;
		
		if(!curl)
		{
			return SetError("Handler is not initialized", AllocateSpace, AllocateData);
		}
		
		QJsonDocument InputDocument;
		QJsonParseError err;
		InputDocument = QJsonDocument::fromJson(QByteArray(InputJson), &err);
		if(err.error)
		{
			return SetError("Failed to parse json", AllocateSpace, AllocateData);
		}
		
		CurlSetOpts(curl, InputDocument.object());
		
		QVariantMap res;
		
		res.insert("success", true);
		
        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        QByteArray ResArray = document.toJson();

        SetResult(&ResArray, AllocateSpace, AllocateData);
	}
	
	void SetTimeout(CurlData *data)
    {
		data->timer.setTimeout([=]() {
			if(data->handler)
			{
				curl_easy_cleanup(data->handler);
				data->handler = NULL;
			}
		}, data->timeout);
    }
	
	void InMail_ClearTimeout(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
    {
		CurlData *data = (CurlData*)ThreadData;
		
		data->timer.stop();
    }
	
	void InMail_CurlRequest(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
    {
		CurlData *data = (CurlData*)ThreadData;
		CURL *curl = (CURL*)data->handler;
		
		if(!curl)
		{
			SetError("Handler is not initialized", AllocateSpace, AllocateData);
			return SetTimeout(data);
		}
		
		CURLcode code;
		QByteArray WriteData;
		DebugClass DebugData;
		bool isFetсh = false;
		
		QJsonDocument InputDocument;
		QJsonParseError err;
		InputDocument = QJsonDocument::fromJson(QByteArray(InputJson), &err);
		if(err.error)
		{
			SetError("Failed to parse json", AllocateSpace, AllocateData);
			return SetTimeout(data);
		}
		QJsonObject InputObject = InputDocument.object();
		
		if(InputObject.contains("isFetсh"))
		{
			isFetсh = InputObject["isFetсh"].toBool();
			DebugData.isFetсh = isFetсh;
		}

		if(InputObject.contains("options"))
		{
			CurlSetOpts(curl, InputObject["options"].toObject());
		}
		
		if(InputObject.contains("timeout"))
		{
			data->timeout = InputObject["timeout"].toInt();
		}
		
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, &WriteFunction);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &WriteData);
		curl_easy_setopt(curl, CURLOPT_VERBOSE, 1);
		
		curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, &DebugFunction);
		curl_easy_setopt(curl, CURLOPT_DEBUGDATA, &DebugData);
		
        curl_easy_setopt(curl, CURLOPT_PROGRESSFUNCTION, &ProgressFunction);
        curl_easy_setopt(curl, CURLOPT_PROGRESSDATA, NeedToStop);
        curl_easy_setopt(curl, CURLOPT_NOPROGRESS, 0L);
		
		code = curl_easy_perform(curl);
		
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, NULL);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, NULL);
		curl_easy_setopt(curl, CURLOPT_VERBOSE, 0);
		
		curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, NULL);
		curl_easy_setopt(curl, CURLOPT_DEBUGDATA, NULL);
		
		curl_easy_setopt(curl, CURLOPT_PROGRESSFUNCTION, NULL);
		curl_easy_setopt(curl, CURLOPT_PROGRESSDATA, NULL);
		curl_easy_setopt(curl, CURLOPT_NOPROGRESS, 1L);
		
		QVariantMap res;

        res.insert("code", StringifyReturnCode((int)code));
		
		if(code == CURLE_OK)
        {
			res.insert("success", true);
			res.insert("error", "");
        }else
        {
			res.insert("success", false);
            res.insert("error", curl_easy_strerror(code));
        }
		
		res.insert("result", QString::fromUtf8(WriteData));
		
		res.insert("debug", QString::fromUtf8(DebugData.Data));
		
		if(isFetсh)
		{
			res.insert("fetсhlist", DebugData.FetсhList);
		}
		
        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        QByteArray ResArray = document.toJson();
		
        SetResult(&ResArray, AllocateSpace, AllocateData);
		
		SetTimeout(data);
    }
	
	void InMail_CurlCleanup(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
    {
		CurlCleanup((CurlData*)ThreadData);
	}
	
	void InMail_Decoder(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
    {
		QJsonDocument InputDocument;
		QJsonParseError err;
		InputDocument = QJsonDocument::fromJson(QByteArray(InputJson), &err);
		if(err.error)
		{
			return SetError("Failed to parse json", AllocateSpace, AllocateData);
		}
		QJsonObject InputObject = InputDocument.object();
		
		QByteArray Charset = InputObject["charset"].toString().toUtf8();
		QString Encoding = InputObject["encoding"].toString();
		QByteArray Data = InputObject["data"].toVariant().toByteArray();
		QByteArray DecodedData;
		QString Result;
		
		if(Encoding == "q")
		{
			for(int i = 0; i < Data.length(); ++i)
			{
				if(Data.at(i) == '=' && i+2<Data.length())
				{
					QString strValue = Data.mid((++i)++, 2);
					bool converted;
					char character = strValue.toUInt(&converted, 16);
					if(converted)
					{
						DecodedData.append(character);
					}else
					{
						DecodedData.append("=" + strValue);
					}
				}else if(Data.at(i) == '_')
				{
					DecodedData.append(' ');
				}else
				{
					DecodedData.append(Data.at(i));
				}
			}
		}else if(Encoding == "b")
		{
			DecodedData = QByteArray::fromBase64(Data);
		}else
		{
			DecodedData = Data;
		}
		
		QTextCodec *Codec = QTextCodec::codecForName(Charset);
		if(Codec)
		{
			Result = Codec->toUnicode(DecodedData);
		}else
		{
			Result = QString::fromUtf8(DecodedData);
		}

        QVariantMap res;
		
		res.insert("success", true);
		
		res.insert("result", Result);
		
        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        QByteArray ResArray = document.toJson();

        SetResult(&ResArray, AllocateSpace, AllocateData);
	}
	
	void InMail_MultipleBase64ToOne(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError)
    {
		QString Str(InputJson);
		QStringList List = Str.split("\r\n");
		
		QByteArray Result;
		
		for(QString Base64:List)
		{
			Result.append(QByteArray::fromBase64(Base64.toLatin1()));
		}
		
		QByteArray ResArray = Result.toBase64();

        SetResult(&ResArray, AllocateSpace, AllocateData);
	}
}