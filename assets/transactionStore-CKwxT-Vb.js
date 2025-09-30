import{m as l,D as m,E as h,h as w}from"./index-BTVEsdd2.js";/**
 * @license lucide-vue-next v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=l("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),x=["Income","Outcome"],I=m("transaksi",()=>{const o=h(),r=w([]);return{transactions:r,fetchAll:async()=>{const t=(await o.getStore("transactions","readonly")).getAll();return new Promise((e,c)=>{t.onsuccess=()=>{r.value=t.result,e(t.result)},t.onerror=()=>c(t.error)})},add:async s=>{const t=await o.getStore("transactions","readwrite"),e={...s,id:crypto.randomUUID()};t.add(e),r.value.push(e)},update:async(s,t)=>{const e=await o.getStore("transactions","readwrite"),i={...await new Promise((n,u)=>{const a=e.get(s);a.onsuccess=()=>n(a.result),a.onerror=()=>u(a.error)}),...t};e.put(i);const d=r.value.findIndex(n=>n.id===s);d!==-1&&(r.value[d]=i)},remove:async s=>{(await o.getStore("transactions","readwrite")).delete(s),r.value=r.value.filter(e=>e.id!==s)}}});export{S as C,x as t,I as u};
