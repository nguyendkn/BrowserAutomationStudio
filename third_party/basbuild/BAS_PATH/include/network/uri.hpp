#pragma once
#include <string>
namespace network {
struct uri_builder;
struct uri {
  std::string _raw;
  uri(const std::string& s=""): _raw(s) {}
  std::string string() const { return _raw; }
  static uri parse(const std::string& s){ return uri(s); }
  struct comp { std::string v; std::string to_string() const { return v; } };
  comp scheme() const { auto p=_raw.find("://"); if(p==std::string::npos) return {""}; return {_raw.substr(0,p)}; }
  comp host() const { auto p=_raw.find("://"); std::string s=p==std::string::npos?_raw:_raw.substr(p+3); auto e=s.find("/"); if(e!=std::string::npos) s=s.substr(0,e); auto c=s.find(":"); if(c!=std::string::npos) s=s.substr(0,c); return {s}; }
  comp path() const { auto p=_raw.find("://"); std::string s=p==std::string::npos?_raw:_raw.substr(p+3); auto e=s.find("/"); if(e==std::string::npos) return {""}; s=s.substr(e); auto q=s.find("?"); if(q!=std::string::npos) s=s.substr(0,q); auto h=s.find("#"); if(h!=std::string::npos) s=s.substr(0,h); return {s}; }
  bool has_fragment() const { return _raw.find("#")!=std::string::npos; }
  bool has_query() const { return _raw.find("?")!=std::string::npos; }
  bool has_path() const { auto c=path(); return !c.v.empty() && c.v!="/"; }
  std::string normalize(int) const { return _raw; }
};
enum uri_comparison_level { syntax_based };
struct uri_builder {
  std::string _raw;
  uri_builder(const uri& u): _raw(u._raw) {}
  void clear_fragment(){ auto p=_raw.find("#"); if(p!=std::string::npos) _raw=_raw.substr(0,p); }
  void clear_query(){ auto p=_raw.find("?"); auto h=_raw.find("#"); if(p!=std::string::npos){ if(h!=std::string::npos && h>p) _raw=_raw.substr(0,p)+_raw.substr(h); else _raw=_raw.substr(0,p);} }
  void clear_path(){ auto p=_raw.find("://"); std::string pre=p==std::string::npos?"":_raw.substr(0,p+3); std::string rest=p==std::string::npos?_raw:_raw.substr(p+3); auto s=rest.find("/"); if(s==std::string::npos) return; rest=rest.substr(0,s)+"/"; auto q=rest.find("?"); auto h=rest.find("#"); // keep query/fragment
    _raw=pre+rest; }
  network::uri to_uri() const { return network::uri(_raw); }
  network::uri uri() const { return to_uri(); }
  std::string string() const { return _raw; }
};
}
