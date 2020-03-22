


    ;_BAS_HIDE(diff_match_patch) = function(){this.Diff_Timeout=1.0;this.Diff_EditCost=4;this.Diff_DualThreshold=32;this.Match_Balance=0.5;this.Match_Threshold=0.5;this.Match_MinLength=100;this.Match_MaxLength=1000;this.Patch_Margin=4;function getMaxBits(){var a=0;var b=1;var c=2;while(b!=c){a++;b=c;c=c<<1}return a}this.Match_MaxBits=getMaxBits()};_BAS_HIDE(diff_match_patch).prototype.diff_main=function(a,b,c){if(a==b){return[[0,a]]}if(typeof c=='undefined'){c=true}var d=c;var e=this.diff_commonPrefix(a,b);var f=a.substring(0,e);a=a.substring(e);b=b.substring(e);e=this.diff_commonSuffix(a,b);var g=a.substring(a.length-e);a=a.substring(0,a.length-e);b=b.substring(0,b.length-e);var h=this.diff_compute(a,b,d);if(f){h.unshift([0,f])}if(g){h.push([0,g])}this.diff_cleanupMerge(h);return h};_BAS_HIDE(diff_match_patch).prototype.diff_compute=function(b,c,d){var e;if(!b){return[[1,c]]}if(!c){return[[-1,b]]}var f=b.length>c.length?b:c;var g=b.length>c.length?c:b;var i=f.indexOf(g);if(i!=-1){e=[[1,f.substring(0,i)],[0,g],[1,f.substring(i+g.length)]];if(b.length>c.length){e[0][0]=e[2][0]=-1}return e}f=g=null;var h=this.diff_halfMatch(b,c);if(h){var k=h[0];var l=h[1];var m=h[2];var n=h[3];var o=h[4];var p=this.diff_main(k,m,d);var q=this.diff_main(l,n,d);return p.concat([[0,o]],q)}if(d&&(b.length<100||c.length<100)){d=false}var r;if(d){var a=this.diff_linesToChars(b,c);b=a[0];c=a[1];r=a[2]}e=this.diff_map(b,c);if(!e){e=[[-1,b],[1,c]]}if(d){this.diff_charsToLines(e,r);this.diff_cleanupSemantic(e);e.push([0,'']);var s=0;var t=0;var u=0;var v='';var w='';while(s<e.length){switch(e[s][0]){case 1:u++;w+=e[s][1];break;case -1:t++;v+=e[s][1];break;case 0:if(t>=1&&u>=1){var a=this.diff_main(v,w,false);e.splice(s-t-u,t+u);s=s-t-u;for(var j=a.length-1;j>=0;j--){e.splice(s,0,a[j])}s=s+a.length}u=0;t=0;v='';w='';break}s++}e.pop()}return e};_BAS_HIDE(diff_match_patch).prototype.diff_linesToChars=function(g,h){var i=[];var j={};i[0]='';function diff_linesToCharsMunge(a){var b='';var c=0;var d=-1;var e=i.length;while(d<a.length-1){d=a.indexOf('\n',c);if(d==-1){d=a.length-1}var f=a.substring(c,d+1);c=d+1;if(j.hasOwnProperty?j.hasOwnProperty(f):(j[f]!==undefined)){b+=String.fromCharCode(j[f])}else{b+=String.fromCharCode(e);j[f]=e;i[e++]=f}}return b}var k=diff_linesToCharsMunge(g);var l=diff_linesToCharsMunge(h);return[k,l,i]};_BAS_HIDE(diff_match_patch).prototype.diff_charsToLines=function(a,b){for(var x=0;x<a.length;x++){var c=a[x][1];var d=[];for(var y=0;y<c.length;y++){d[y]=b[c.charCodeAt(y)]}a[x][1]=d.join('')}};_BAS_HIDE(diff_match_patch).prototype.diff_map=function(b,c){var e=(new Date()).getTime()+this.Diff_Timeout*1000;var f=b.length+c.length-1;var g=this.Diff_DualThreshold*2<f;var h=[];var i=[];var j={};var l={};j[1]=0;l[1]=0;var x,y;var m;var n={};var o=false;var hasOwnProperty=!!(n.hasOwnProperty);var p=(b.length+c.length)%2;for(var d=0;d<f;d++){if(this.Diff_Timeout>0&&(new Date()).getTime()>e){return null}h[d]={};for(var k=-d;k<=d;k+=2){if(k==-d||k!=d&&j[k-1]<j[k+1]){x=j[k+1]}else{x=j[k-1]+1}y=x-k;if(g){m=x+','+y;if(p&&(hasOwnProperty?n.hasOwnProperty(m):(n[m]!==undefined))){o=true}if(!p){n[m]=d}}while(!o&&x<b.length&&y<c.length&&b.charAt(x)==c.charAt(y)){x++;y++;if(g){m=x+','+y;if(p&&(hasOwnProperty?n.hasOwnProperty(m):(n[m]!==undefined))){o=true}if(!p){n[m]=d}}}j[k]=x;h[d][x+','+y]=true;if(x==b.length&&y==c.length){return this.diff_path1(h,b,c)}else if(o){i=i.slice(0,n[m]+1);var a=this.diff_path1(h,b.substring(0,x),c.substring(0,y));return a.concat(this.diff_path2(i,b.substring(x),c.substring(y)))}}if(g){i[d]={};for(var k=-d;k<=d;k+=2){if(k==-d||k!=d&&l[k-1]<l[k+1]){x=l[k+1]}else{x=l[k-1]+1}y=x-k;m=(b.length-x)+','+(c.length-y);if(!p&&(hasOwnProperty?n.hasOwnProperty(m):(n[m]!==undefined))){o=true}if(p){n[m]=d}while(!o&&x<b.length&&y<c.length&&b.charAt(b.length-x-1)==c.charAt(c.length-y-1)){x++;y++;m=(b.length-x)+','+(c.length-y);if(!p&&(hasOwnProperty?n.hasOwnProperty(m):(n[m]!==undefined))){o=true}if(p){n[m]=d}}l[k]=x;i[d][x+','+y]=true;if(o){h=h.slice(0,n[m]+1);var a=this.diff_path1(h,b.substring(0,b.length-x),c.substring(0,c.length-y));return a.concat(this.diff_path2(i,b.substring(b.length-x),c.substring(c.length-y)))}}}}return null};_BAS_HIDE(diff_match_patch).prototype.diff_path1=function(a,b,c){var e=[];var x=b.length;var y=c.length;var f=null;for(var d=a.length-2;d>=0;d--){while(1){if(a[d].hasOwnProperty?a[d].hasOwnProperty((x-1)+','+y):(a[d][(x-1)+','+y]!==undefined)){x--;if(f===-1){e[0][1]=b.charAt(x)+e[0][1]}else{e.unshift([-1,b.charAt(x)])}f=-1;break}else if(a[d].hasOwnProperty?a[d].hasOwnProperty(x+','+(y-1)):(a[d][x+','+(y-1)]!==undefined)){y--;if(f===1){e[0][1]=c.charAt(y)+e[0][1]}else{e.unshift([1,c.charAt(y)])}f=1;break}else{x--;y--;if(f===0){e[0][1]=b.charAt(x)+e[0][1]}else{e.unshift([0,b.charAt(x)])}f=0}}}return e};_BAS_HIDE(diff_match_patch).prototype.diff_path2=function(a,b,c){var e=[];var f=0;var x=b.length;var y=c.length;var g=null;for(var d=a.length-2;d>=0;d--){while(1){if(a[d].hasOwnProperty?a[d].hasOwnProperty((x-1)+','+y):(a[d][(x-1)+','+y]!==undefined)){x--;if(g===-1){e[f-1][1]+=b.charAt(b.length-x-1)}else{e[f++]=[-1,b.charAt(b.length-x-1)]}g=-1;break}else if(a[d].hasOwnProperty?a[d].hasOwnProperty(x+','+(y-1)):(a[d][x+','+(y-1)]!==undefined)){y--;if(g===1){e[f-1][1]+=c.charAt(c.length-y-1)}else{e[f++]=[1,c.charAt(c.length-y-1)]}g=1;break}else{x--;y--;if(g===0){e[f-1][1]+=b.charAt(b.length-x-1)}else{e[f++]=[0,b.charAt(b.length-x-1)]}g=0}}}return e};_BAS_HIDE(diff_match_patch).prototype.diff_commonPrefix=function(a,b){if(!a||!b||a.charCodeAt(0)!==b.charCodeAt(0)){return 0}var c=0;var d=Math.min(a.length,b.length);var e=d;var f=0;while(c<e){if(a.substring(f,e)==b.substring(f,e)){c=e;f=c}else{d=e}e=Math.floor((d-c)/2+c)}return e};_BAS_HIDE(diff_match_patch).prototype.diff_commonSuffix=function(a,b){if(!a||!b||a.charCodeAt(a.length-1)!==b.charCodeAt(b.length-1)){return 0}var c=0;var d=Math.min(a.length,b.length);var e=d;var f=0;while(c<e){if(a.substring(a.length-e,a.length-f)==b.substring(b.length-e,b.length-f)){c=e;f=c}else{d=e}e=Math.floor((d-c)/2+c)}return e};_BAS_HIDE(diff_match_patch).prototype.diff_halfMatch=function(h,k){var l=h.length>k.length?h:k;var m=h.length>k.length?k:h;if(l.length<10||m.length<1){return null}var n=this;function diff_halfMatchI(a,b,i){var c=a.substring(i,i+Math.floor(a.length/4));var j=-1;var d='';var e,best_longtext_b,best_shorttext_a,best_shorttext_b;while((j=b.indexOf(c,j+1))!=-1){var f=n.diff_commonPrefix(a.substring(i),b.substring(j));var g=n.diff_commonSuffix(a.substring(0,i),b.substring(0,j));if(d.length<g+f){d=b.substring(j-g,j)+b.substring(j,j+f);e=a.substring(0,i-g);best_longtext_b=a.substring(i+f);best_shorttext_a=b.substring(0,j-g);best_shorttext_b=b.substring(j+f)}}if(d.length>=a.length/2){return[e,best_longtext_b,best_shorttext_a,best_shorttext_b,d]}else{return null}}var o=diff_halfMatchI(l,m,Math.ceil(l.length/4));var p=diff_halfMatchI(l,m,Math.ceil(l.length/2));var q;if(!o&&!p){return null}else if(!p){q=o}else if(!o){q=p}else{q=o[4].length>p[4].length?o:p}var r,text1_b,text2_a,text2_b;if(h.length>k.length){r=q[0];text1_b=q[1];text2_a=q[2];text2_b=q[3]}else{text2_a=q[0];text2_b=q[1];r=q[2];text1_b=q[3]}var s=q[4];return[r,text1_b,text2_a,text2_b,s]};_BAS_HIDE(diff_match_patch).prototype.diff_cleanupSemantic=function(a){var b=false;var c=[];var d=0;var e=null;var f=0;var g=0;var h=0;while(f<a.length){if(a[f][0]==0){c[d++]=f;g=h;h=0;e=a[f][1]}else{h+=a[f][1].length;if(e!==null&&(e.length<=g)&&(e.length<=h)){a.splice(c[d-1],0,[-1,e]);a[c[d-1]+1][0]=1;d--;d--;f=d>0?c[d-1]:-1;g=0;h=0;e=null;b=true}}f++}if(b){this.diff_cleanupMerge(a)}this.diff_cleanupSemanticLossless(a)};_BAS_HIDE(diff_match_patch).prototype.diff_cleanupSemanticLossless=function(d){var e=/[^a-zA-Z0-9]/;var f=/\s/;var g=/[\r\n]/;var h=/\n\r?\n$/;var i=/^\r?\n\r?\n/;function diff_cleanupSemanticScore(a,b){if(!a||!b){return 5}var c=0;if(a.charAt(a.length-1).match(e)||b.charAt(0).match(e)){c++;if(a.charAt(a.length-1).match(f)||b.charAt(0).match(f)){c++;if(a.charAt(a.length-1).match(g)||b.charAt(0).match(g)){c++;if(a.match(h)||b.match(i)){c++}}}}return c}var j=1;while(j<d.length-1){if(d[j-1][0]==0&&d[j+1][0]==0){var k=d[j-1][1];var l=d[j][1];var m=d[j+1][1];var n=this.diff_commonSuffix(k,l);if(n){var o=l.substring(l.length-n);k=k.substring(0,k.length-n);l=o+l.substring(0,l.length-n);m=o+m}var p=k;var q=l;var r=m;var s=diff_cleanupSemanticScore(k,l)+diff_cleanupSemanticScore(l,m);while(l.charAt(0)===m.charAt(0)){k+=l.charAt(0);l=l.substring(1)+m.charAt(0);m=m.substring(1);var t=diff_cleanupSemanticScore(k,l)+diff_cleanupSemanticScore(l,m);if(t>=s){s=t;p=k;q=l;r=m}}if(d[j-1][1]!=p){if(p){d[j-1][1]=p}else{d.splice(j-1,1);j--}d[j][1]=q;if(r){d[j+1][1]=r}else{d.splice(j+1,1);j--}}}j++}};_BAS_HIDE(diff_match_patch).prototype.diff_cleanupEfficiency=function(a){var b=false;var c=[];var d=0;var e='';var f=0;var g=false;var h=false;var i=false;var j=false;while(f<a.length){if(a[f][0]==0){if(a[f][1].length<this.Diff_EditCost&&(i||j)){c[d++]=f;g=i;h=j;e=a[f][1]}else{d=0;e=''}i=j=false}else{if(a[f][0]==-1){j=true}else{i=true}if(e&&((g&&h&&i&&j)||((e.length<this.Diff_EditCost/2)&&(g+h+i+j)==3))){a.splice(c[d-1],0,[-1,e]);a[c[d-1]+1][0]=1;d--;e='';if(g&&h){i=j=true;d=0}else{d--;f=d>0?c[d-1]:-1;i=j=false}b=true}}f++}if(b){this.diff_cleanupMerge(a)}};_BAS_HIDE(diff_match_patch).prototype.diff_cleanupMerge=function(a){a.push([0,'']);var b=0;var c=0;var d=0;var e='';var f='';var g;while(b<a.length){switch(a[b][0]){case 1:d++;f+=a[b][1];b++;break;case -1:c++;e+=a[b][1];b++;break;case 0:if(c!==0||d!==0){if(c!==0&&d!==0){g=this.diff_commonPrefix(f,e);if(g!==0){if((b-c-d)>0&&a[b-c-d-1][0]==0){a[b-c-d-1][1]+=f.substring(0,g)}else{a.splice(0,0,[0,f.substring(0,g)]);b++}f=f.substring(g);e=e.substring(g)}g=this.diff_commonSuffix(f,e);if(g!==0){a[b][1]=f.substring(f.length-g)+a[b][1];f=f.substring(0,f.length-g);e=e.substring(0,e.length-g)}}if(c===0){a.splice(b-c-d,c+d,[1,f])}else if(d===0){a.splice(b-c-d,c+d,[-1,e])}else{a.splice(b-c-d,c+d,[-1,e],[1,f])}b=b-c-d+(c?1:0)+(d?1:0)+1}else if(b!==0&&a[b-1][0]==0){a[b-1][1]+=a[b][1];a.splice(b,1)}else{b++}d=0;c=0;e='';f='';break}}if(a[a.length-1][1]===''){a.pop()}var h=false;b=1;while(b<a.length-1){if(a[b-1][0]==0&&a[b+1][0]==0){if(a[b][1].substring(a[b][1].length-a[b-1][1].length)==a[b-1][1]){a[b][1]=a[b-1][1]+a[b][1].substring(0,a[b][1].length-a[b-1][1].length);a[b+1][1]=a[b-1][1]+a[b+1][1];a.splice(b-1,1);h=true}else if(a[b][1].substring(0,a[b+1][1].length)==a[b+1][1]){a[b-1][1]+=a[b+1][1];a[b][1]=a[b][1].substring(a[b+1][1].length)+a[b+1][1];a.splice(b+1,1);h=true}}b++}if(h){this.diff_cleanupMerge(a)}};_BAS_HIDE(diff_match_patch).prototype.diff_xIndex=function(a,b){var c=0;var d=0;var e=0;var f=0;var x;for(x=0;x<a.length;x++){if(a[x][0]!==1){c+=a[x][1].length}if(a[x][0]!==-1){d+=a[x][1].length}if(c>b){break}e=c;f=d}if(a.length!=x&&a[x][0]===-1){return f}return f+(b-e)};_BAS_HIDE(diff_match_patch).prototype.diff_prettyHtml=function(a){var b=[];var i=0;for(var x=0;x<a.length;x++){var c=a[x][0];var d=a[x][1];var e=d.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'&para;<BR>');switch(c){case 1:b[x]='<INS STYLE="background:#E6FFE6;" TITLE="i='+i+'">'+e+'</INS>';break;case -1:b[x]='<DEL STYLE="background:#FFE6E6;" TITLE="i='+i+'">'+e+'</DEL>';break;case 0:b[x]='<SPAN TITLE="i='+i+'">'+e+'</SPAN>';break}if(c!==-1){i+=d.length}}return b.join('')};_BAS_HIDE(diff_match_patch).prototype.diff_text1=function(a){var b=[];for(var x=0;x<a.length;x++){if(a[x][0]!==1){b[x]=a[x][1]}}return b.join('')};_BAS_HIDE(diff_match_patch).prototype.diff_text2=function(a){var b=[];for(var x=0;x<a.length;x++){if(a[x][0]!==-1){b[x]=a[x][1]}}return b.join('')};_BAS_HIDE(diff_match_patch).prototype.diff_toDelta=function(a){var b=[];for(var x=0;x<a.length;x++){switch(a[x][0]){case 1:b[x]='+'+encodeURI(a[x][1]);break;case -1:b[x]='-'+a[x][1].length;break;case 0:b[x]='='+a[x][1].length;break}}return b.join('\t').replace(/\0/g,'%00').replace(/%20/g,' ')};_BAS_HIDE(diff_match_patch).prototype.diff_fromDelta=function(a,b){var c=[];var d=0;var e=0;b=b.replace(/%00/g,'\0');var f=b.split(/\t/g);for(var x=0;x<f.length;x++){var g=f[x].substring(1);switch(f[x].charAt(0)){case'+':try{c[d++]=[1,decodeURI(g)]}catch(ex){throw new Error('Illegal escape in diff_fromDelta: '+g);}break;case'-':case'=':var n=parseInt(g,10);if(isNaN(n)||n<0){throw new Error('Invalid number in diff_fromDelta: '+g);}var h=a.substring(e,e+=n);if(f[x].charAt(0)=='='){c[d++]=[0,h]}else{c[d++]=[-1,h]}break;default:if(f[x]){throw new Error('Invalid diff operation in diff_fromDelta: '+f[x]);}}}if(e!=a.length){throw new Error('Delta length ('+e+') does not equal source text length ('+a.length+').');}return c};_BAS_HIDE(diff_match_patch).prototype.match_main=function(a,b,c){c=Math.max(0,Math.min(c,a.length-b.length));if(a==b){return 0}else if(a.length===0){return null}else if(a.substring(c,c+b.length)==b){return c}else{return this.match_bitap(a,b,c)}};_BAS_HIDE(diff_match_patch).prototype.match_bitap=function(a,b,c){if(b.length>this.Match_MaxBits){throw new Error('Pattern too long for this browser.');}var s=this.match_alphabet(b);var f=a.length;f=Math.max(f,this.Match_MinLength);f=Math.min(f,this.Match_MaxLength);var g=this;function match_bitapScore(e,x){var d=Math.abs(c-x);return(e/b.length/g.Match_Balance)+(d/f/(1.0-g.Match_Balance))}var h=this.Match_Threshold;var i=a.indexOf(b,c);if(i!=-1){h=Math.min(match_bitapScore(0,i),h)}i=a.lastIndexOf(b,c+b.length);if(i!=-1){h=Math.min(match_bitapScore(0,i),h)}var k=1<<(b.length-1);i=null;var l,bin_mid;var m=Math.max(c+c,a.length);var n;for(var d=0;d<b.length;d++){var o=Array(a.length);l=c;bin_mid=m;while(l<bin_mid){if(match_bitapScore(d,bin_mid)<h){l=bin_mid}else{m=bin_mid}bin_mid=Math.floor((m-l)/2+l)}m=bin_mid;var p=Math.max(0,c-(bin_mid-c)-1);var q=Math.min(a.length-1,b.length+bin_mid);if(a.charAt(q)==b.charAt(b.length-1)){o[q]=(1<<(d+1))-1}else{o[q]=(1<<d)-1}for(var j=q-1;j>=p;j--){if(d===0){o[j]=((o[j+1]<<1)|1)&s[a.charAt(j)]}else{o[j]=((o[j+1]<<1)|1)&s[a.charAt(j)]|((n[j+1]<<1)|1)|((n[j]<<1)|1)|n[j+1]}if(o[j]&k){var r=match_bitapScore(d,j);if(r<=h){h=r;i=j;if(j>c){p=Math.max(0,c-(j-c))}else{break}}}}if(match_bitapScore(d+1,c)>h){break}n=o}return i};_BAS_HIDE(diff_match_patch).prototype.match_alphabet=function(a){var s={};for(var i=0;i<a.length;i++){s[a.charAt(i)]=0}for(var i=0;i<a.length;i++){s[a.charAt(i)]|=1<<(a.length-i-1)}return s};_BAS_HIDE(diff_match_patch).prototype.patch_addContext=function(a,b){var c=b.substring(a.start2,a.start2+a.length1);var d=0;while(b.indexOf(c)!=b.lastIndexOf(c)&&c.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin){d+=this.Patch_Margin;c=b.substring(a.start2-d,a.start2+a.length1+d)}d+=this.Patch_Margin;var e=b.substring(a.start2-d,a.start2);if(e!==''){a.diffs.unshift([0,e])}var f=b.substring(a.start2+a.length1,a.start2+a.length1+d);if(f!==''){a.diffs.push([0,f])}a.start1-=e.length;a.start2-=e.length;a.length1+=e.length+f.length;a.length2+=e.length+f.length};_BAS_HIDE(diff_match_patch).prototype.patch_make=function(a,b,c){var d,text2,diffs;if(typeof b=='undefined'){diffs=a;d=this.diff_text1(diffs);text2=''}else{d=a;text2=b;if(typeof c!='undefined'){diffs=c}else{diffs=this.diff_main(d,text2,true);if(diffs.length>2){this.diff_cleanupSemantic(diffs);this.diff_cleanupEfficiency(diffs)}}}if(diffs.length===0){return[]}var e=[];var f=new patch_obj();var g=0;var h=0;var i=0;var j=d;var k=d;for(var x=0;x<diffs.length;x++){var l=diffs[x][0];var m=diffs[x][1];if(!g&&l!==0){f.start1=h;f.start2=i}switch(l){case 1:f.diffs[g++]=diffs[x];f.length2+=m.length;k=k.substring(0,i)+m+k.substring(i);break;case -1:f.length1+=m.length;f.diffs[g++]=diffs[x];k=k.substring(0,i)+k.substring(i+m.length);break;case 0:if(m.length<=2*this.Patch_Margin&&g&&diffs.length!=x+1){f.diffs[g++]=diffs[x];f.length1+=m.length;f.length2+=m.length}else if(m.length>=2*this.Patch_Margin){if(g){this.patch_addContext(f,j);e.push(f);f=new patch_obj();g=0;j=k}}break}if(l!==1){h+=m.length}if(l!==-1){i+=m.length}}if(g){this.patch_addContext(f,j);e.push(f)}return e};_BAS_HIDE(diff_match_patch).prototype.patch_apply=function(a,b){if(a.length==0){return[b,[]]}var c=[];for(var x=0;x<a.length;x++){var d=a[x];var e=new patch_obj();e.diffs=d.diffs.slice();e.start1=d.start1;e.start2=d.start2;e.length1=d.length1;e.length2=d.length2;c[x]=e}a=c;var f=this.patch_addPadding(a);b=f+b+f;this.patch_splitMax(a);var g=0;var h=[];for(var x=0;x<a.length;x++){var i=a[x].start2+g;var j=this.diff_text1(a[x].diffs);var k=this.match_main(b,j,i);if(k===null){h[x]=false}else{h[x]=true;g=k-i;var l=b.substring(k,k+j.length);if(j==l){b=b.substring(0,k)+this.diff_text2(a[x].diffs)+b.substring(k+j.length)}else{var m=this.diff_main(j,l,false);this.diff_cleanupSemanticLossless(m);var n=0;var o;for(var y=0;y<a[x].diffs.length;y++){var p=a[x].diffs[y];if(p[0]!==0){o=this.diff_xIndex(m,n)}if(p[0]===1){b=b.substring(0,k+o)+p[1]+b.substring(k+o)}else if(p[0]===-1){b=b.substring(0,k+o)+b.substring(k+this.diff_xIndex(m,n+p[1].length))}if(p[0]!==-1){n+=p[1].length}}}}}b=b.substring(f.length,b.length-f.length);return[b,h]};_BAS_HIDE(diff_match_patch).prototype.patch_addPadding=function(a){var b='';for(var x=0;x<this.Patch_Margin;x++){b+=String.fromCharCode(x)}for(var x=0;x<a.length;x++){a[x].start1+=b.length;a[x].start2+=b.length}var c=a[0];var d=c.diffs;if(d.length==0||d[0][0]!=0){d.unshift([0,b]);c.start1-=b.length;c.start2-=b.length;c.length1+=b.length;c.length2+=b.length}else if(b.length>d[0][1].length){var e=b.length-d[0][1].length;d[0][1]=b.substring(d[0][1].length)+d[0][1];c.start1-=e;c.start2-=e;c.length1+=e;c.length2+=e}c=a[a.length-1];d=c.diffs;if(d.length==0||d[d.length-1][0]!=0){d.push([0,b]);c.length1+=b.length;c.length2+=b.length}else if(b.length>d[d.length-1][1].length){var e=b.length-d[d.length-1][1].length;d[d.length-1][1]+=b.substring(0,e);c.length1+=e;c.length2+=e}return b};_BAS_HIDE(diff_match_patch).prototype.patch_splitMax=function(a){for(var x=0;x<a.length;x++){if(a[x].length1>this.Match_MaxBits){var b=a[x];a.splice(x,1);var c=this.Match_MaxBits;var d=b.start1;var e=b.start2;var f='';while(b.diffs.length!==0){var g=new patch_obj();var h=true;g.start1=d-f.length;g.start2=e-f.length;if(f!==''){g.length1=g.length2=f.length;g.diffs.push([0,f])}while(b.diffs.length!==0&&g.length1<c-this.Patch_Margin){var i=b.diffs[0][0];var j=b.diffs[0][1];if(i===1){g.length2+=j.length;e+=j.length;g.diffs.push(b.diffs.shift());h=false}else{j=j.substring(0,c-g.length1-this.Patch_Margin);g.length1+=j.length;d+=j.length;if(i===0){g.length2+=j.length;e+=j.length}else{h=false}g.diffs.push([i,j]);if(j==b.diffs[0][1]){b.diffs.shift()}else{b.diffs[0][1]=b.diffs[0][1].substring(j.length)}}}f=this.diff_text2(g.diffs);f=f.substring(f.length-this.Patch_Margin);var k=this.diff_text1(b.diffs).substring(0,this.Patch_Margin);if(k!==''){g.length1+=k.length;g.length2+=k.length;if(g.diffs.length!==0&&g.diffs[g.diffs.length-1][0]===0){g.diffs[g.diffs.length-1][1]+=k}else{g.diffs.push([0,k])}}if(!h){a.splice(x++,0,g)}}}}};_BAS_HIDE(diff_match_patch).prototype.patch_toText=function(a){var b=[];for(var x=0;x<a.length;x++){b[x]=a[x]}return b.join('')};_BAS_HIDE(diff_match_patch).prototype.patch_fromText=function(a){var b=[];if(!a){return b}a=a.replace(/%00/g,'\0');var c=a.split('\n');var d=0;while(d<c.length){var m=c[d].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);if(!m){throw new Error('Invalid patch string: '+c[d]);}var e=new patch_obj();b.push(e);e.start1=parseInt(m[1],10);if(m[2]===''){e.start1--;e.length1=1}else if(m[2]=='0'){e.length1=0}else{e.start1--;e.length1=parseInt(m[2],10)}e.start2=parseInt(m[3],10);if(m[4]===''){e.start2--;e.length2=1}else if(m[4]=='0'){e.length2=0}else{e.start2--;e.length2=parseInt(m[4],10)}d++;while(d<c.length){var f=c[d].charAt(0);try{var g=decodeURI(c[d].substring(1))}catch(ex){throw new Error('Illegal escape in patch_fromText: '+g);}if(f=='-'){e.diffs.push([-1,g])}else if(f=='+'){e.diffs.push([1,g])}else if(f==' '){e.diffs.push([0,g])}else if(f=='@'){break}else if(f===''){}else{throw new Error('Invalid patch mode "'+f+'" in: '+g);}d++}}return b};function patch_obj(){this.diffs=[];this.start1=null;this.start2=null;this.length1=0;this.length2=0}patch_obj.prototype.toString=function(){var a,coords2;if(this.length1===0){a=this.start1+',0'}else if(this.length1==1){a=this.start1+1}else{a=(this.start1+1)+','+this.length1}if(this.length2===0){coords2=this.start2+',0'}else if(this.length2==1){coords2=this.start2+1}else{coords2=(this.start2+1)+','+this.length2}var b=['@@ -'+a+' +'+coords2+' @@\n'];var c;for(var x=0;x<this.diffs.length;x++){switch(this.diffs[x][0]){case 1:c='+';break;case -1:c='-';break;case 0:c=' ';break}b[x+1]=c+encodeURI(this.diffs[x][1])+'\n'}return b.join('').replace(/\0/g,'%00').replace(/%20/g,' ')};

  
    ;_BAS_HIDE(DomPredictionHelper) = function(_bas_use_css, _bas_use_ids, _bas_check_density) {
  
      this.recursiveNodes = function(e) {
        var n;
        if (e.nodeName && e.parentNode && e !== document.body) {
          n = this.recursiveNodes(e.parentNode);
        } else {
          n = new Array();
        }
        n.push(e);
        return n;
      };
  
      this.escapeCssNames = function(name) {
        if (name) {
          try {
            return name.replace(/\bselectorgadget_\w+\b/g, '').replace(/\\/g, '\\\\').replace(/[\#\;\&\,\.\+\*\~\'\:\"\!\^\$\[\]\(\)\=\>\|\/]/g, function(e) {
              return '\\' + e;
            }).replace(/\s+/, '');
          } catch (e) {
            return '';
          }
        } else {
          return '';
        }
      };
  
      this.childElemNumber = function(elem) {
        var count;
        count = 0;
        while (elem.previousSibling && (elem = elem.previousSibling)) {
          if (elem.nodeType === 1) {
            count++;
          }
        }
        return count;
      };
  
      this.siblingsWithoutTextNodes = function(e) {
        var filtered_nodes, node, nodes, _i, _len;
        nodes = e.parentNode.childNodes;
        filtered_nodes = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          if (node.nodeName.substring(0, 1) === "#") {
            continue;
          }
          if (node === e) {
            break;
          }
          filtered_nodes.push(node);
        }
        return filtered_nodes;
      };
  
      this.pathOf = function(elem) {
        var e, j, path, siblings, _i, _len, _ref;
        path = "";
        _ref = this.recursiveNodes(elem);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          if (e) {
            siblings = this.siblingsWithoutTextNodes(e);
            if (e.nodeName.toLowerCase() !== "body") {
              j = siblings.length - 2 < 0 ? 0 : siblings.length - 2;
              while (j < siblings.length) {
                if (siblings[j] === e) {
                  break;
                }
                if (!siblings[j].nodeName.match(/^(script|#.*?)$/i)) {
                  path += this.cssDescriptor(siblings[j]) + (j + 1 === siblings.length ? "+ " : "~ ");
                }
                j++;
              }
            }
            path += this.cssDescriptor(e) + " > ";
          }
        }
        return this.cleanCss(path);
      };
  
      this.cssDescriptor = function(node) {
        var cssName, escaped, path, _i, _len, _ref;
        path = node.nodeName.toLowerCase();
        escaped = node.id && this.escapeCssNames(new String(node.id));
        if(_bas_use_ids)
        {
            if (escaped && escaped.length > 0)
            {
                path += '#' + escaped;
            }
        }
        if(_bas_use_css)
        {
            if (node.className) {
            _ref = node.className.split(" ");
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    cssName = _ref[_i];
                    escaped = this.escapeCssNames(cssName);
                    if (cssName && escaped.length > 0) {
                    path += '.' + escaped;
                    }
                }
            }
        }
        if (node.nodeName.toLowerCase() !== "body") {
          path += ':nth-child(' + (this.childElemNumber(node) + 1) + ')';
        }
        return path;
      };
  
      this.cssDiff = function(array) {
        var collective_common, cssElem, diff, dmp, encoded_css_array, existing_tokens, part, _i, _j, _len, _len1;
        try {
          dmp = new _BAS_HIDE(diff_match_patch)();
        } catch (e) {
          throw "Please include the diff_match_patch library.";
        }
        if (typeof array === 'undefined' || array.length === 0) {
          return '';
        }
        existing_tokens = {};
        encoded_css_array = this.encodeCssForDiff(array, existing_tokens);
        collective_common = encoded_css_array.pop();
        for (_i = 0, _len = encoded_css_array.length; _i < _len; _i++) {
          cssElem = encoded_css_array[_i];
          diff = dmp.diff_main(collective_common, cssElem);
          collective_common = '';
          for (_j = 0, _len1 = diff.length; _j < _len1; _j++) {
            part = diff[_j];
            if (part[0] === 0) {
              collective_common += part[1];
            }
          }
        }
        return this.decodeCss(collective_common, existing_tokens);
      };
  
      this.tokenizeCss = function(css_string) {
        var char, skip, tokens, word, _i, _len, _ref;
        skip = false;
        word = '';
        tokens = [];
        _ref = this.cleanCss(css_string);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          char = _ref[_i];
          if (skip) {
            skip = false;
          } else if (char === '\\') {
            skip = true;
          } else if (char === '.' || char === ' ' || char === '#' || char === '>' || char === ':' || char === ',' || char === '+' || char === '~') {
            if (word.length > 0) {
              tokens.push(word);
            }
            word = '';
          }
          word += char;
          if (char === ' ' || char === ',') {
            tokens.push(word);
            word = '';
          }
        }
        if (word.length > 0) {
          tokens.push(word);
        }
        return tokens;
      };
  
      this.tokenizeCssForDiff = function(css_string) {
        var block, combined_tokens, token, _i, _len, _ref;
        combined_tokens = [];
        block = [];
        _ref = this.tokenizeCss(css_string);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          block.push(token);
          if (token === ' ' && block.length > 0) {
            combined_tokens = combined_tokens.concat(block);
            block = [];
          } else if (token === '+' || token === '~') {
            block = [block.join('')];
          }
        }
        if (block.length > 0) {
          return combined_tokens.concat(block);
        } else {
          return combined_tokens;
        }
      };
  
      this.decodeCss = function(string, existing_tokens) {
        var character, inverted, out, _i, _len, _ref;
        inverted = this.invertObject(existing_tokens);
        out = '';
        _ref = string.split('');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          character = _ref[_i];
          out += inverted[character];
        }
        return this.cleanCss(out);
      };
  
      this.encodeCssForDiff = function(strings, existing_tokens) {
        var codepoint, out, string, strings_out, token, _i, _j, _len, _len1, _ref;
        codepoint = 50;
        strings_out = [];
        for (_i = 0, _len = strings.length; _i < _len; _i++) {
          string = strings[_i];
          out = new String();
          _ref = this.tokenizeCssForDiff(string);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            token = _ref[_j];
            if (!existing_tokens[token]) {
              existing_tokens[token] = String.fromCharCode(codepoint++);
            }
            out += existing_tokens[token];
          }
          strings_out.push(out);
        }
        return strings_out;
      };
  
      this.tokenPriorities = function(tokens) {
        var epsilon, first, i, priorities, second, token, _i, _len;
        epsilon = 0.001;
        priorities = new Array();
        i = 0;
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          first = token.substring(0, 1);
          second = token.substring(1, 2);
          if (first === ':' && second === 'n') {
            priorities[i] = 0;
          } else if (first === '>') {
            priorities[i] = 2;
          } else if (first === '+' || first === '~') {
            priorities[i] = 3;
          } else if (first !== ':' && first !== '.' && first !== '#' && first !== ' ' && first !== '>' && first !== '+' && first !== '~') {
            priorities[i] = 4;
          } else if (first === '.') {
            priorities[i] = 5;
          } else if (first = '#') {
            priorities[i] = 6;
            if (token.match(/\d{3,}/)) {
              priorities[i] = 2.5;
            }
          } else {
            priorities[i] = 0;
          }
          priorities[i] += i * epsilon;
          i++;
        }
        return priorities;
      };
  
      this.orderFromPriorities = function(priorities) {
        var i, ordering, tmp, _i, _j, _ref, _ref1;
        tmp = new Array();
        ordering = new Array();
        for (i = _i = 0, _ref = priorities.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          tmp[i] = {
            value: priorities[i],
            original: i
          };
        }
        tmp.sort(function(a, b) {
          return a.value - b.value;
        });
        for (i = _j = 0, _ref1 = priorities.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          ordering[i] = tmp[i].original;
        }
        return ordering;
      };
  
      this.simplifyCss = function(css, selected, rejected) {
        var self = this
        var best_so_far, first, got_shorter, i, look_back_index, ordering, part, parts, priorities, second, selector, _i, _ref,
          _this = this;
        parts = this.tokenizeCss(css);
        priorities = this.tokenPriorities(parts);
        ordering = this.orderFromPriorities(priorities);
        selector = this.cleanCss(css);
        look_back_index = -1;
        best_so_far = "";
        if (this.selectorGets('all', selected, selector) && this.selectorGets('none', rejected, selector)) {
          best_so_far = selector;
        }
        got_shorter = true;
        while (got_shorter) {
          got_shorter = false;
          for (i = _i = 0, _ref = parts.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            part = ordering[i];
            if (parts[part].length === 0) {
              continue;
            }
            first = parts[part].substring(0, 1);
            second = parts[part].substring(1, 2);
            if (first === ' ') {
              continue;
            }
            if (this.wouldLeaveFreeFloatingNthChild(parts, part)) {
              continue;
            }
            this._removeElements(part, parts, first, function(selector) {
              if (_this.selectorGets('all', selected, selector) && _this.selectorGets('none', rejected, selector) && (selector.length < best_so_far.length || best_so_far.length === 0)) {
                if(_bas_check_density && self.getQueryDensity(selector) > 5)
                {
                  return false
                }
                best_so_far = selector;
                got_shorter = true;
                return true;
              } else {
                return false;
              }
            });
          }
        }
        return this.cleanCss(best_so_far);
      };
  
      this._removeElements = function(part, parts, firstChar, callback) {
        var j, look_back_index, selector, tmp, _i, _j;
        if (firstChar === '+' || firstChar === '~') {
          look_back_index = this.positionOfSpaceBeforeIndexOrLineStart(part, parts);
        } else {
          look_back_index = part;
        }
        tmp = parts.slice(look_back_index, part + 1);
        for (j = _i = look_back_index; look_back_index <= part ? _i <= part : _i >= part; j = look_back_index <= part ? ++_i : --_i) {
          parts[j] = '';
        }
        selector = this.cleanCss(parts.join(''));
        if (selector === '' || !callback(selector)) {
          for (j = _j = look_back_index; look_back_index <= part ? _j <= part : _j >= part; j = look_back_index <= part ? ++_j : --_j) {
            parts[j] = tmp[j - look_back_index];
          }
        }
        return parts;
      };
  
      this.positionOfSpaceBeforeIndexOrLineStart = function(part, parts) {
        var i;
        i = part;
        while (i >= 0 && parts[i] !== ' ') {
          i--;
        }
        if (i < 0) {
          i = 0;
        }
        return i;
      };
  
      this.wouldLeaveFreeFloatingNthChild = function(parts, part) {
        var i, nth_child_is_on_right, space_is_on_left;
        space_is_on_left = nth_child_is_on_right = false;
        i = part + 1;
        while (i < parts.length && parts[i].length === 0) {
          i++;
        }
        if (i < parts.length && parts[i].substring(0, 2) === ':n') {
          nth_child_is_on_right = true;
        }
        i = part - 1;
        while (i > -1 && parts[i].length === 0) {
          i--;
        }
        if (i < 0 || parts[i] === ' ') {
          space_is_on_left = true;
        }
        return space_is_on_left && nth_child_is_on_right;
      };
  
      this.cleanCss = function(css) {
        var cleaned_css, last_cleaned_css;
        cleaned_css = css;
        last_cleaned_css = null;
        while (last_cleaned_css !== cleaned_css) {
          last_cleaned_css = cleaned_css;
          cleaned_css = cleaned_css.replace(/(^|\s+)(\+|\~)/, '').replace(/(\+|\~)\s*$/, '').replace(/>/g, ' > ').replace(/\s*(>\s*)+/g, ' > ').replace(/,/g, ' , ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/\s*,$/g, '').replace(/^\s*,\s*/g, '').replace(/\s*>$/g, '').replace(/^>\s*/g, '').replace(/[\+\~\>]\s*,/g, ',').replace(/[\+\~]\s*>/g, '>').replace(/\s*(,\s*)+/g, ' , ');
        }
        return cleaned_css;
      };
  
      this.getPathsFor = function(nodeset) {
        var node, out, _i, _len;
        out = [];
        for (_i = 0, _len = nodeset.length; _i < _len; _i++) {
          node = nodeset[_i];
          if (node && node.nodeName) {
            out.push(this.pathOf(node));
          }
        }
        return out;
      };
  
      this.predictCss = function(s, r) {
        var css, selected, selected_paths, simplest, union, _i, _len;
        if (s.length === 0) {
          return '';
        }
        selected_paths = this.getPathsFor(s);
        css = this.cssDiff(selected_paths);
        simplest = this.simplifyCss(css, s, r);
        if (simplest.length > 0) {
          return simplest;
        }
        union = '';
        for (_i = 0, _len = s.length; _i < _len; _i++) {
          selected = s[_i];
          union = this.pathOf(selected) + ", " + union;
        }
        union = this.cleanCss(union);
        return this.simplifyCss(union, s, r);
      };
  
      this.selectorGets = function(type, list, the_selector) {
        if (list.length === 0 && type === 'all') {
          return false;
        }
        if (list.length === 0 && type === 'none') {
          return true;
        }
        try {
          if (type === 'all') {
            //return list.not(the_selector).length === 0;
            var all_matches = true;
            for(var i = 0;i<list.length;i++)
            {
                var el = list[i]
                var matches = false;
                try
                {
                  matches = el.matches(the_selector)
                }catch(e)
                {
                  matches = false
                }
                if(!matches)
                {
                    all_matches = false;
                    break;
                }
            }
            return all_matches;
          } else {
            //return !(list.is(the_selector));
            var at_least_one_match = false;
            for(var i = 0;i<list.length;i++)
            {
                var el = list[i]
                var matches = false;
                try
                {
                  matches = el.matches(the_selector)
                }catch(e)
                {
                  matches = false
                }
                if(matches)
                {
                    at_least_one_match = true;
                    break;
                }
            }
            return !at_least_one_match;
          }
        } catch (e) {
          throw e;
        }
      };
  
      this.invertObject = function(object) {
        var key, new_object, value;
        new_object = {};
        for (key in object) {
          value = object[key];
          new_object[value] = key;
        }
        return new_object;
      };
  
      this.cssToXPath = function(css_string) {
        var css_block, out, token, tokens, _i, _len;
        tokens = this.tokenizeCss(css_string);
        if (tokens[0] && tokens[0] === ' ') {
          tokens.splice(0, 1);
        }
        if (tokens[tokens.length - 1] && tokens[tokens.length - 1] === ' ') {
          tokens.splice(tokens.length - 1, 1);
        }
        css_block = [];
        out = "";
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          if (token === ' ') {
            out += this.cssToXPathBlockHelper(css_block);
            css_block = [];
          } else {
            css_block.push(token);
          }
        }
        return out + this.cssToXPathBlockHelper(css_block);
      };
  
      this.cssToXPathBlockHelper = function(css_block) {
        var current, expressions, first, i, out, re, rest, _i, _j, _len, _ref;
        if (css_block.length === 0) {
          return '//';
        }
        out = '//';
        first = css_block[0].substring(0, 1);
        if (first === ',') {
          return " | ";
        }
        if (first === ':' || first === '#' || first === '.') {
          out += '*';
        }
        expressions = [];
        re = null;
        for (_i = 0, _len = css_block.length; _i < _len; _i++) {
          current = css_block[_i];
          first = current.substring(0, 1);
          rest = current.substring(1);
          if (first === ':') {
            if (re = rest.match(/^nth-child\((\d+)\)$/)) {
              expressions.push('(((count(preceding-sibling::*) + 1) = ' + re[1] + ') and parent::*)');
            }
          } else if (first === '.') {
            expressions.push('contains(concat( " ", @class, " " ), concat( " ", "' + rest + '", " " ))');
          } else if (first === '#') {
            expressions.push('(@id = "' + rest + '")');
          } else if (first === ',') {
  
          } else {
            out += current;
          }
        }
        if (expressions.length > 0) {
          out += '[';
        }
        for (i = _j = 0, _ref = expressions.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
          out += expressions[i];
          if (i < expressions.length - 1) {
            out += ' and ';
          }
        }
        if (expressions.length > 0) {
          out += ']';
        }
        return out;
      };

      this.getAllRectangles = function(elements)
      {
        var len = elements.length
        var res = []
        for(var i = 0;i<len;i++)
        {
          var element = elements[i]
          if(element && window.getComputedStyle(element)['display'] != 'none' && window.getComputedStyle(element)['visibility'] != 'hidden')
          {
            var rect = _BAS_HIDE(BrowserAutomationStudio_GetInternalBoundingRect)(element);
            if(rect.width > 0 && rect.height > 0)
              res.push(rect)
          }
        }
        return res;
      }

      this.getRandomBetween = function(min, max)
      {
        return Math.floor(Math.random() * (max + 1 - min) + min);
      }

      this.getRandomPoint = function(rectangle)
      {
        return {x:this.getRandomBetween(rectangle.left,rectangle.right),y:this.getRandomBetween(rectangle.top,rectangle.bottom)}
      }

      this.isPointInsideRectangle = function(point, rectangle)
      {
        return point.x >= rectangle.left && point.x <= rectangle.right
               && point.y >= rectangle.top && point.y <= rectangle.bottom
      }

      this.CacheElements = []
      this.CacheDensity = 0

      this.getQueryDensity = function(query)
      {
        var total = 0;
        var precision = 1;

        var elements = []
        
        try
        {
          elements = document.querySelectorAll(query)
        }catch(e)
        {
          elements = []
        }

        if(elements.length == this.CacheElements.length)
        {
          var IsSame = true
          for(var i = 0;i<elements.length;i++)
          {
            if(elements[i] != this.CacheElements[i])
            {
              IsSame = false
              break
            }
          }
          if(IsSame)
          {
            return this.CacheDensity
          }
        }
        var rectangles = this.getAllRectangles(elements)
        var len = rectangles.length

        for(var i = 0;i<len;i++)
        {
          var rectangle_outter = rectangles[i]
          for(var p = 0;p<precision;p++)
          {
            var point = this.getRandomPoint(rectangle_outter)
            for(var j = 0;j<len;j++)
            {
              var rectangle_inner = rectangles[j]
              if(this.isPointInsideRectangle(point,rectangle_inner))
                total ++
            }
          }
        }
        
        if(len == 0)
          return 0.0

        var res = total / (len * precision)
        this.CacheElements = elements
        this.CacheDensity = res
        return res
      }


      this.css2xpath = (function () {
        var xpath_to_lower         = function (s) {
              return 'translate(' +
                      (s || 'normalize-space()') +
                      ', \'ABCDEFGHJIKLMNOPQRSTUVWXYZ\'' +
                      ', \'abcdefghjiklmnopqrstuvwxyz\')';
            },
            xpath_ends_with        = function (s1, s2) {
              return 'substring(' + s1 + ',' +
                      'string-length(' + s1 + ')-string-length(' + s2 + ')+1)=' + s2;
            },
            xpath_url              = function (s) {
              return 'substring-before(concat(substring-after(' +
                      (s || xpath_url_attrs) + ',"://"),"?"),"?")';
            },
            xpath_url_path         = function (s) {
              return 'substring-after(' + (s || xpath_url_attrs) + ',"/")';
            },
            xpath_url_domain       = function (s) {
              return 'substring-before(concat(substring-after(' +
                     (s || xpath_url_attrs) + ',"://"),"/"),"/")';
            },
            xpath_url_attrs        = '@href|@src',
            xpath_lower_case       = xpath_to_lower(),
            xpath_ns_uri           = 'ancestor-or-self::*[last()]/@url',
            xpath_ns_path          = xpath_url_path(xpath_url(xpath_ns_uri)),
            xpath_has_protocal     = '(starts-with(' + xpath_url_attrs + ',"http://") or starts-with(' + xpath_url_attrs + ',"https://"))',
            xpath_is_internal      = 'starts-with(' + xpath_url() + ',' + xpath_url_domain(xpath_ns_uri) + ') or ' + xpath_ends_with(xpath_url_domain(), xpath_url_domain(xpath_ns_uri)),
            xpath_is_local         = '(' + xpath_has_protocal + ' and starts-with(' + xpath_url() + ',' + xpath_url(xpath_ns_uri) + '))',
            xpath_is_path          = 'starts-with(' + xpath_url_attrs + ',"/")',
            xpath_is_local_path    = 'starts-with(' + xpath_url_path() + ',' + xpath_ns_path + ')',
            xpath_normalize_space  = 'normalize-space()',
            xpath_internal         = '[not(' + xpath_has_protocal + ') or ' + xpath_is_internal + ']',
            xpath_external         = '[' + xpath_has_protocal + ' and not(' + xpath_is_internal + ')]',
            escape_literal         = String.fromCharCode(30),
            escape_parens          = String.fromCharCode(31),
            regex_string_literal   = /("[^"\x1E]*"|'[^'\x1E]*'|=\s*[^\s\]\'\"]+)/g,
            regex_escaped_literal  = /['"]?(\x1E+)['"]?/g,
            regex_css_wrap_pseudo  = /(\x1F\)|[^\)])\:(first|limit|last|gt|lt|eq|nth)([^\-]|$)/,
            regex_specal_chars     = /[\x1C-\x1F]+/g,
            regex_first_axis       = /^([\s\(\x1F]*)(\.?[^\.\/\(]{1,2}[a-z]*:*)/,
            regex_filter_prefix    = /(^|\/|\:)\[/g,
            regex_attr_prefix      = /([^\(\[\/\|\s\x1F])\@/g,
            regex_nth_equation     = /^([-0-9]*)n.*?([0-9]*)$/,
            css_combinators_regex  = /\s*(!?[+>~,^ ])\s*(\.?\/+|[a-z\-]+::)?([a-z\-]+\()?((and\s*|or\s*|mod\s*)?[^+>~,\s'"\]\|\^\$\!\<\=\x1C-\x1F]+)?/g,
            css_combinators_callback = function (match, operator, axis, func, literal, exclude, offset, orig) {
              var prefix = ''; // If we can, we'll prefix a '.'
      
              // XPath operators can look like node-name selectors
              // Detect false positive for " and", " or", " mod"
              if (operator === ' ' && exclude !== undefined) {
                return match;
              }
      
              if (axis === undefined) {
                // Only allow node-selecting XPath functions
                // Detect false positive for " + count(...)", " count(...)", " > position()", etc.
                if (func !== undefined && (func !== 'node(' && func !== 'text(' && func !== 'comment('))                {
                  return;
                } else if (literal === undefined) {
                  literal = func;
                } // Handle case " + text()", " > comment()", etc. where "func" is our "literal"
      
                  // XPath math operators match some CSS combinators
                  // Detect false positive for " + 1", " > 1", etc.
                if (isNumeric(literal)) {
                  return match;
                }
      
                var prevChar = orig.charAt(offset - 1);
      
                if (prevChar.length === 0 ||
                      prevChar === '(' ||
                      prevChar === '|' ||
                      prevChar === ':') {
                  prefix = '.';
                }
              }
      
              // Return if we don't have a selector to follow the axis
              if (literal === undefined) {
                if (offset + match.length === orig.length) {
                  literal = '*';
                } else {
                  return match;
                }
              }
      
      
              switch (operator) {
              case ' ':
                return '//' + literal;
              case '>':
                return '/' + literal;
              case '+':
                return prefix + '/following-sibling::*[1]/self::' + literal;
              case '~':
                return prefix + '/following-sibling::' + literal;
              case ',':
                if (axis === undefined) {
      
                }
                axis = './/';
                return '|' + axis + literal;
              case '^': // first child
                return '/child::*[1]/self::' + literal;
              case '!^': // last child
                return '/child::*[last()]/self::' + literal;
              case '! ': // ancestor-or-self
                return '/ancestor-or-self::' + literal;
              case '!>': // direct parent
                return '/parent::' + literal;
              case '!+': // adjacent preceding sibling
                return '/preceding-sibling::*[1]/self::' + literal;
              case '!~': // preceding sibling
                return '/preceding-sibling::' + literal;
                  // case '~~'
                  // return '/following-sibling::*/self::|'+selectorStart(orig, offset)+'/preceding-sibling::*/self::'+literal;
              }
            },
      
            css_attributes_regex = /\[([^\@\|\*\=\^\~\$\!\(\/\s\x1C-\x1F]+)\s*(([\|\*\~\^\$\!]?)=?\s*(\x1E+))?\]/g,
            css_attributes_callback = function (str, attr, comp, op, val, offset, orig) {
              var axis = '';
              var prevChar = orig.charAt(offset - 1);
      
              /*
              if (prevChar === '/' || // found after an axis shortcut ("/", "//", etc.)
                  prevChar === ':')   // found after an axis ("self::", "parent::", etc.)
                  axis = '*';*/
      
              switch (op) {
              case '!':
                return axis + '[not(@' + attr + ') or @' + attr + '!="' + val + '"]';
              case '$':
                return axis + '[substring(@' + attr + ',string-length(@' + attr + ')-(string-length("' + val + '")-1))="' + val + '"]';
              case '^':
                return axis + '[starts-with(@' + attr + ',"' + val + '")]';
              case '~':
                return axis + '[contains(concat(" ",normalize-space(@' + attr + ')," "),concat(" ","' + val + '"," "))]';
              case '*':
                return axis + '[contains(@' + attr + ',"' + val + '")]';
              case '|':
                return axis + '[@' + attr + '="' + val + '" or starts-with(@' + attr + ',concat("' + val + '","-"))]';
              default:
                if (comp === undefined) {
                  if (attr.charAt(attr.length - 1) === '(' || attr.search(/^[0-9]+$/) !== -1 || attr.indexOf(':') !== -1)                        {
                    return str;
                  }
                  return axis + '[@' + attr + ']';
                } else {
                  return axis + '[@' + attr + '="' + val + '"]';
                }
              }
            },
      
            css_pseudo_classes_regex = /:([a-z\-]+)(\((\x1F+)(([^\x1F]+(\3\x1F+)?)*)(\3\)))?/g,
            css_pseudo_classes_callback = function (match, name, g1, g2, arg, g3, g4, g5, offset, orig) {
              if (orig.charAt(offset - 1) === ':' && orig.charAt(offset - 2) !== ':') {
                  // XPath "axis::node-name" will match
                  // Detect false positive ":node-name"
                return match;
              }
      
              if (name === 'odd' || name === 'even') {
                arg  = name;
                name = 'nth-of-type';
              }
      
              switch (name) { // name.toLowerCase()?
              case 'after':
                return '[count(' + css2xpath('preceding::' + arg, true) + ') > 0]';
              case 'after-sibling':
                return '[count(' + css2xpath('preceding-sibling::' + arg, true) + ') > 0]';
              case 'before':
                return '[count(' + css2xpath('following::' + arg, true) + ') > 0]';
              case 'before-sibling':
                return '[count(' + css2xpath('following-sibling::' + arg, true) + ') > 0]';
              case 'checked':
                return '[@selected or @checked]';
              case 'contains':
                return '[contains(' + xpath_normalize_space + ',' + arg + ')]';
              case 'icontains':
                return '[contains(' + xpath_lower_case + ',' + xpath_to_lower(arg) + ')]';
              case 'empty':
                return '[not(*) and not(normalize-space())]';
              case 'enabled':
              case 'disabled':
                return '[@' + name + ']';
              case 'first-child':
                return '[not(preceding-sibling::*)]';
              case 'first':
              case 'limit':
              case 'first-of-type':
                if (arg !== undefined)                    {
                  return '[position()<=' + arg + ']';
                }
                return '[1]';
              case 'gt':
                      // Position starts at 0 for consistency with Sizzle selectors
                return '[position()>' + (parseInt(arg, 10) + 1) + ']';
              case 'lt':
                      // Position starts at 0 for consistency with Sizzle selectors
                return '[position()<' + (parseInt(arg, 10) + 1) + ']';
              case 'last-child':
                return '[not(following-sibling::*)]';
              case 'only-child':
                return '[not(preceding-sibling::*) and not(following-sibling::*)]';
              case 'only-of-type':
                return '[not(preceding-sibling::*[name()=name(self::node())]) and not(following-sibling::*[name()=name(self::node())])]';
              case 'nth-child':
                if (isNumeric(arg))                    {
                  return '[(count(preceding-sibling::*)+1) = ' + arg + ']';
                }
                switch (arg) {
                case 'even':
                  return '[(count(preceding-sibling::*)+1) mod 2=0]';
                case 'odd':
                  return '[(count(preceding-sibling::*)+1) mod 2=1]';
                default:
                  var a = (arg || '0').replace(regex_nth_equation, '$1+$2').split('+');
      
                  a[0] = a[0] || '1';
                  a[1] = a[1] || '0';
                  return '[(count(preceding-sibling::*)+1)>=' + a[1] + ' and ((count(preceding-sibling::*)+1)-' + a[1] + ') mod ' + a[0] + '=0]';
                }
              case 'nth-of-type':
                if (isNumeric(arg))                    {
                  return '[' + arg + ']';
                }
                switch (arg) {
                case 'odd':
                  return '[position() mod 2=1]';
                case 'even':
                  return '[position() mod 2=0 and position()>=0]';
                default:
                  var a = (arg || '0').replace(regex_nth_equation, '$1+$2').split('+');
      
                  a[0] = a[0] || '1';
                  a[1] = a[1] || '0';
                  return '[position()>=' + a[1] + ' and (position()-' + a[1] + ') mod ' + a[0] + '=0]';
                }
              case 'eq':
              case 'nth':
                // Position starts at 0 for consistency with Sizzle selectors
                if (isNumeric(arg)) {
                  return '[' + (parseInt(arg, 10) + 1) + ']';
                }
      
                return '[1]';
              case 'text':
                return '[@type="text"]';
              case 'istarts-with':
                return '[starts-with(' + xpath_lower_case + ',' + xpath_to_lower(arg) + ')]';
              case 'starts-with':
                return '[starts-with(' + xpath_normalize_space + ',' + arg + ')]';
              case 'iends-with':
                return '[' + xpath_ends_with(xpath_lower_case, xpath_to_lower(arg)) + ']';
              case 'ends-with':
                return '[' + xpath_ends_with(xpath_normalize_space, arg) + ']';
              case 'has':
                var xpath = prependAxis(css2xpath(arg, true), './/');
      
                return '[count(' + xpath + ') > 0]';
              case 'has-sibling':
                var xpath = css2xpath('preceding-sibling::' + arg, true);
      
                return '[count(' + xpath + ') > 0 or count(following-sibling::' + xpath.substr(19) + ') > 0]';
              case 'has-parent':
                return '[count(' + css2xpath('parent::' + arg, true) + ') > 0]';
              case 'has-ancestor':
                return '[count(' + css2xpath('ancestor::' + arg, true) + ') > 0]';
              case 'last':
              case 'last-of-type':
                if (arg !== undefined)                    {
                  return '[position()>last()-' + arg + ']';
                }
                return '[last()]';
              case 'selected': // Sizzle: "(option) elements that are currently selected"
                return '[local-name()="option" and @selected]';
              case 'skip':
              case 'skip-first':
                return '[position()>' + arg + ']';
              case 'skip-last':
                if (arg !== undefined)                    {
                  return '[last()-position()>=' + arg + ']';
                }
                return '[position()<last()]';
              case 'root':
                return '/ancestor::[last()]';
              case 'range':
                var arr = arg.split(',');
      
                return '[' + arr[0] + '<=position() and position()<=' + arr[1] + ']';
              case 'input': // Sizzle: "input, button, select, and textarea are all considered to be input elements."
                return '[local-name()="input" or local-name()="button" or local-name()="select" or local-name()="textarea"]';
              case 'internal':
                return xpath_internal;
              case 'external':
                return xpath_external;
              case 'http':
              case 'https':
              case 'mailto':
              case 'javascript':
                return '[starts-with(@href,concat("' + name + '",":"))]';
              case 'domain':
                return '[(string-length(' + xpath_url_domain() + ')=0 and contains(' + xpath_url_domain(xpath_ns_uri) + ',' + arg + ')) or contains(' + xpath_url_domain() + ',' + arg + ')]';
              case 'path':
                return '[starts-with(' + xpath_url_path() + ',substring-after("' + arg + '","/"))]'
              case 'not':
                var xpath = css2xpath(arg, true);
      
                if (xpath.charAt(0) === '[')                    {
                  xpath = 'self::node()' + xpath;
                }
                return '[not(' + xpath + ')]';
              case 'target':
                return '[starts-with(@href, "#")]';
              case 'root':
                return 'ancestor-or-self::*[last()]';
                  /* case 'active':
                  case 'focus':
                  case 'hover':
                  case 'link':
                  case 'visited':
                      return '';*/
              case 'lang':
                return '[@lang="' + arg + '"]';
              case 'read-only':
              case 'read-write':
                return '[@' + name.replace('-', '') + ']';
              case 'valid':
              case 'required':
              case 'in-range':
              case 'out-of-range':
                return '[@' + name + ']';
              default:
                return match;
              }
            },
      
            css_ids_classes_regex = /(#|\.)([^\#\@\.\/\(\[\)\]\|\:\s\+\>\<\'\"\x1D-\x1F]+)/g,
            css_ids_classes_callback = function (str, op, val, offset, orig) {
              var axis = '';
              /* var prevChar = orig.charAt(offset-1);
              if (prevChar.length === 0 ||
                  prevChar === '/' ||
                  prevChar === '(')
                  axis = '*';
              else if (prevChar === ':')
                  axis = 'node()';*/
              if (op === '#')            {
                return axis + '[@id="' + val + '"]';
              }
              return axis + '[contains(concat(" ",normalize-space(@class)," ")," ' + val + ' ")]';
            };
      
          // Prepend descendant-or-self if no other axis is specified
        function prependAxis(s, axis) {
          return s.replace(regex_first_axis, function (match, start, literal) {
            if (literal.substr(literal.length - 2) === '::') // Already has axis::
                  {
              return match;
            }
      
            if (literal.charAt(0) === '[')            {
              axis += '*';
            }
              // else if (axis.charAt(axis.length-1) === ')')
              //    axis += '/';
            return start + axis + literal;
          });
        }
      
          // Find the begining of the selector, starting at i and working backwards
        function selectorStart(s, i) {
          var depth = 0;
          var offset = 0;
      
          while (i--) {
            switch (s.charAt(i)) {
            case ' ':
            case escape_parens:
              offset++;
              break;
            case '[':
            case '(':
              depth--;
      
              if (depth < 0)                    {
                return ++i + offset;
              }
              break;
            case ']':
            case ')':
              depth++;
              break;
            case ',':
            case '|':
              if (depth === 0)                    {
                return ++i + offset;
              }
            default:
              offset = 0;
            }
          }
      
          return 0;
        }
      
          // Check if string is numeric
        function isNumeric(s) {
          var num = parseInt(s, 10);
      
          return (!isNaN(num) && '' + num === s);
        }
      
          // Append escape "char" to "open" or "close"
        function escapeChar(s, open, close, char) {
          var depth = 0;
      
          return s.replace(new RegExp('[\\' + open + '\\' + close + ']', 'g'), function (a) {
            if (a === open)            {
              depth++;
            }
      
            if (a === open) {
              return a + repeat(char, depth);
            } else {
              return repeat(char, depth--) + a;
            }
          })
        }
      
        function repeat(str, num) {
          num = Number(num);
          var result = '';
      
          while (true) {
            if (num & 1)            {
              result += str;
            }
            num >>>= 1;
      
            if (num <= 0) {
              break;
            }
            str += str;
          }
      
          return result;
        }
      
        function css2xpath(s, nested) {
          // s = s.trim();
      
          if (nested === true) {
              // Replace :pseudo-classes
            s = s.replace(css_pseudo_classes_regex, css_pseudo_classes_callback);
      
              // Replace #ids and .classes
            s = s.replace(css_ids_classes_regex, css_ids_classes_callback);
      
            return s;
          }
      
          // Tag open and close parenthesis pairs (for RegExp searches)
          s = escapeChar(s, '(', ')', escape_parens);
      
          // Remove and save any string literals
          var literals = [];
      
          s = s.replace(regex_string_literal, function (s, a) {
            if (a.charAt(0) === '=') {
              a = a.substr(1).trim();
      
              if (isNumeric(a))                {
                return s;
              }
            } else {
              a = a.substr(1, a.length - 2);
            }
      
            return repeat(escape_literal, literals.push(a));
          });
      
          // Replace CSS combinators (" ", "+", ">", "~", ",") and reverse combinators ("!", "!+", "!>", "!~")
          s = s.replace(css_combinators_regex, css_combinators_callback);
      
          // Replace CSS attribute filters
          s = s.replace(css_attributes_regex, css_attributes_callback);
      
          // Wrap certain :pseudo-classes in parens (to collect node-sets)
          while (true) {
            var index = s.search(regex_css_wrap_pseudo);
      
            if (index === -1) {
              break;
            }
            index = s.indexOf(':', index);
            var start = selectorStart(s, index);
      
            s = s.substr(0, start) +
                  '(' + s.substring(start, index) + ')' +
                  s.substr(index);
          }
      
          // Replace :pseudo-classes
          s = s.replace(css_pseudo_classes_regex, css_pseudo_classes_callback);
      
          // Replace #ids and .classes
          s = s.replace(css_ids_classes_regex, css_ids_classes_callback);
      
          // Restore the saved string literals
          s = s.replace(regex_escaped_literal, function (s, a) {
            var str = literals[a.length - 1];
      
            return '"' + str + '"';
          })
      
          // Remove any special characters
          s = s.replace(regex_specal_chars, '');
      
          // add * to stand-alone filters
          s = s.replace(regex_filter_prefix, '$1*[');
      
          // add "/" between @attribute selectors
          s = s.replace(regex_attr_prefix, '$1/@');
      
          /*
          Combine multiple filters?
          s = escapeChar(s, '[', ']', filter_char);
          s = s.replace(/(\x1D+)\]\[\1(.+?[^\x1D])\1\]/g, ' and ($2)$1]')
          */
      
          s = prependAxis(s, './/'); // prepend ".//" axis to begining of CSS selector
          return s;
        }
      
      
        return css2xpath;
      
      })();
      
  
    };
  
_BAS_HIDE(BrowserAutomationStudio_GenerateMultiSelectors) = function(include,exclude,selector_prefix) {

    var CssResultsRaw = []
    var CssResults = []
    var XpathResults = []

    var SelectInputs = [
      [false,true],
      [false,false],
      [true,true]
    ]
    for(var i = 0;i<SelectInputs.length;i++)
    {
      var Input = SelectInputs[i]
      var Helper = new _BAS_HIDE(DomPredictionHelper)(Input[0], Input[1], false)
      var Selector = Helper.predictCss(include,exclude)
      var Density = Helper.getQueryDensity(Selector)
      if(Density > 5)
      {
        Helper = new _BAS_HIDE(DomPredictionHelper)(Input[0], Input[1], true)
        Selector = Helper.predictCss(include,exclude)
      }
      CssResultsRaw.push(Selector)
    }
    
    for(var i = 0;i<CssResultsRaw.length;i++)
    {
        var Result = CssResultsRaw[i]
        var ToAdd = selector_prefix + ">CSS>" + Result
        if(Result && CssResults.indexOf(ToAdd) < 0)
          CssResults.push(ToAdd)

        if(Result && XpathResults.length == 0)
        {
          var ResultXpath = "";

          try
          {
            ResultXpath = new _BAS_HIDE(DomPredictionHelper)(false, true).css2xpath(Result);
          }catch(e)
          {
            ResultXpath = ""
          }

          if(!ResultXpath)
          {
            try
            {
              ResultXpath = new _BAS_HIDE(DomPredictionHelper)(false, true).cssToXPath(Result);
            }catch(e)
            {
              ResultXpath = ""
            }
          }
          
          if(ResultXpath)
            XpathResults.push(selector_prefix + ">XPATH>" + ResultXpath)
        }
        
    }
    
    return {
        css: CssResults,
        xpath: XpathResults
    }

};