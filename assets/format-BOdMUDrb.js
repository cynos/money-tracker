import{m as u}from"./index-BTVEsdd2.js";/**
 * @license lucide-vue-next v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=u("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);function g(r){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(r)}function d(r){const t=new Date(r);return new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"2-digit"}).format(t)}function l(r){const t=new Date(r),o=t.getHours(),a=String(t.getMinutes()).padStart(2,"0"),s=o>=12?"PM":"AM",i=o%12||12,c=t.getFullYear(),n=t.getMonth()+1,e=t.getDate();return`${i}:${a} ${s} ${c}/${n}/${e}`}function D(r,t=!0){if(!r)return"";const o=r.trim();if(!o)return"";const a=o.charAt(0);return t?a.toUpperCase():a}function p(r){const t=new FormData(r),o={};return t.forEach((a,s)=>{const i=s.endsWith("[]"),c=i?s.slice(0,-2).split("."):s.split(".");let n=o;c.forEach((e,m)=>{m===c.length-1?i?(Array.isArray(n[e])||(n[e]=[]),n[e].push(a.toString())):n[e]=a.toString():(n[e]=n[e]||{},n=n[e])})}),o}export{h as C,l as a,p as b,d as c,g as f,D as g};
