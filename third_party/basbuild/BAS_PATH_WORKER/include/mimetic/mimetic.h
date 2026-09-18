#pragma once
#include <string>
#include <list>
#include <sstream>
#include <istream>
namespace mimetic {
  namespace QP { struct Decoder {}; }
  namespace Base64 { struct Decoder {}; }
  struct Field{ std::string name() const {return"";} std::string value() const {return"";} };
  struct ContentTransferEncoding{ enum Mechanism{ quoted_printable, base64, sevenbit, eightbit, binary }; Mechanism mechanism() const {return sevenbit;} };
  struct ContentDisposition{
    ContentDisposition(const std::string& = ""){}
    std::string param(const std::string&) const {return"";}
  };
  struct Header : public std::list<Field> {
    bool hasField(const std::string&) const {return false;}
    std::string from() const {return"";} std::string to() const {return"";} std::string subject() const {return"";}
    ContentTransferEncoding contentTransferEncoding() const {return ContentTransferEncoding();}
  };
  class MimeEntity;
  struct Body{
    size_t length() const {return 0;}
    void code(const QP::Decoder&){} void code(const Base64::Decoder&){}
    std::string str() const {return"";}
    std::list<MimeEntity*>& parts(){static std::list<MimeEntity*> p; return p;}
    const std::list<MimeEntity*>& parts() const {static std::list<MimeEntity*> p; return p;}
  };
  inline std::ostream& operator<<(std::ostream& os, const Body&){return os;}
  struct MimeEntity{
    MimeEntity(){}
    explicit MimeEntity(std::istream&){}
    explicit MimeEntity(const std::string&){}
    Header& header(){static Header h; return h;}
    const Header& header() const{static Header h; return h;}
    Body& body(){static Body b; return b;}
    const Body& body() const{static Body b; return b;}
  };
  struct MimeEntityList : public std::list<MimeEntity*>{};
  template<typename InIt, typename Dec, typename OutIt> void code(InIt,InIt,Dec,OutIt){}
}
