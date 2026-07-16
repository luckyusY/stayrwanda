/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext,useContext,useEffect,useMemo,useState } from "react";
type Currency="RWF"|"USD";type Value={currency:Currency;toggle:()=>void;format:(rwf:number)=>string};
const Context=createContext<Value>({currency:"RWF",toggle:()=>{},format:(value)=>`RWF ${value.toLocaleString()}`});
export function CurrencyProvider({children}:{children:React.ReactNode}){const[currency,setCurrency]=useState<Currency>("RWF");const[rate,setRate]=useState(1400);useEffect(()=>{const saved=localStorage.getItem("stayrwanda-currency");if(saved==="USD")setCurrency("USD");fetch("/api/exchange-rates").then(r=>r.json()).then(data=>data.rwfPerUsd&&setRate(data.rwfPerUsd)).catch(()=>{})},[]);const value=useMemo<Value>(()=>({currency,toggle:()=>setCurrency(current=>{const next=current==="RWF"?"USD":"RWF";localStorage.setItem("stayrwanda-currency",next);return next}),format:(rwf)=>currency==="RWF"?new Intl.NumberFormat("en-RW",{style:"currency",currency:"RWF",maximumFractionDigits:0}).format(rwf):new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(rwf/rate)}),[currency,rate]);return <Context.Provider value={value}>{children}</Context.Provider>}
export const useCurrency=()=>useContext(Context);
export function CurrencyControl({light=false}:{light?:boolean}){const{currency,toggle}=useCurrency();return <button onClick={toggle} title="Switch display currency" className={light?"text-white":"text-[var(--ink)]"}>{currency}</button>}
