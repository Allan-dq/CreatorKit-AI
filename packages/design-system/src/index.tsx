"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import {
  forwardRef, useEffect, useId, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes,
  type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown, X } from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant="primary", size="md", loading=false, disabled, className, children, ...props }, ref) {
  return <button ref={ref} className={cx("ck-button", `ck-button--${variant}`, `ck-button--${size}`, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <span className="ck-spinner" aria-hidden="true" />}{children}</button>;
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { label:string; variant?:"default"|"ghost"|"danger"; size?:"sm"|"md"; pressed?:boolean; }
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, variant="default", size="md", pressed, className, children, ...props }, ref) {
  return <button ref={ref} className={cx("ck-icon-button", `ck-icon-button--${variant}`, `ck-icon-button--${size}`, className)} aria-label={label} aria-pressed={pressed} {...props}>{children}</button>;
});

type FieldProps = { label:string; hint?:string; error?:string; };
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(function Input({ label, hint, error, id, className, ...props }, ref) {
  const autoId=useId(); const controlId=id ?? autoId; const helpId=`${controlId}-help`;
  return <div className={cx("ck-field", className)}><label className="ck-label" htmlFor={controlId}>{label}</label><input ref={ref} id={controlId} className={cx("ck-control", error && "is-error")} aria-invalid={!!error} aria-describedby={(hint||error)?helpId:undefined} {...props}/>{(hint||error)&&<span id={helpId} className={cx("ck-help", error&&"is-error")}>{error??hint}</span>}</div>;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(function Textarea({ label, hint, error, id, className, ...props }, ref) {
  const autoId=useId(); const controlId=id ?? autoId; const helpId=`${controlId}-help`;
  return <div className={cx("ck-field", className)}><label className="ck-label" htmlFor={controlId}>{label}</label><textarea ref={ref} id={controlId} className={cx("ck-control ck-textarea", error&&"is-error")} aria-invalid={!!error} aria-describedby={(hint||error)?helpId:undefined} {...props}/>{(hint||error)&&<span id={helpId} className={cx("ck-help", error&&"is-error")}>{error??hint}</span>}</div>;
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldProps { options:Array<{label:string;value:string}>; }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, hint, error, options, id, className, ...props }, ref) {
  const autoId=useId(); const controlId=id ?? autoId; const helpId=`${controlId}-help`;
  return <div className={cx("ck-field", className)}><label className="ck-label" htmlFor={controlId}>{label}</label><span className="ck-select-wrap"><select ref={ref} id={controlId} className={cx("ck-control ck-select", error&&"is-error")} aria-invalid={!!error} aria-describedby={(hint||error)?helpId:undefined} {...props}>{options.map((option)=><option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span>{(hint||error)&&<span id={helpId} className={cx("ck-help", error&&"is-error")}>{error??hint}</span>}</div>;
});

export interface TabItem { value:string; label:string; content:ReactNode; }
export function Tabs({ items, value, onValueChange, label="Views", variant="line" }:{items:TabItem[];value:string;onValueChange:(value:string)=>void;label?:string;variant?:"line"|"pill"}) {
  const base=useId();
  const onKey=(event:React.KeyboardEvent<HTMLButtonElement>, index:number)=>{ if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return; event.preventDefault(); let next=index; if(event.key==="ArrowRight") next=(index+1)%items.length; if(event.key==="ArrowLeft") next=(index-1+items.length)%items.length; if(event.key==="Home") next=0; if(event.key==="End") next=items.length-1; onValueChange(items[next].value); document.getElementById(`${base}-tab-${next}`)?.focus(); };
  const active=items.find((item)=>item.value===value)??items[0];
  return <div className={cx("ck-tabs",`ck-tabs--${variant}`)}><div role="tablist" aria-label={label} className="ck-tab-list">{items.map((item,index)=><button key={item.value} id={`${base}-tab-${index}`} role="tab" aria-selected={item.value===active.value} aria-controls={`${base}-panel-${index}`} tabIndex={item.value===active.value?0:-1} onClick={()=>onValueChange(item.value)} onKeyDown={(event)=>onKey(event,index)}>{item.label}</button>)}</div>{items.map((item,index)=><div key={item.value} id={`${base}-panel-${index}`} role="tabpanel" aria-labelledby={`${base}-tab-${index}`} hidden={item.value!==active.value} tabIndex={0} className="ck-tab-panel">{item.content}</div>)}</div>;
}

export function Card({ title, eyebrow, actions, variant="surface", className, children, ...props }:HTMLAttributes<HTMLElement> & {title?:string;eyebrow?:string;actions?:ReactNode;variant?:"surface"|"outline"|"ink"|"accent"}) {
  return <section className={cx("ck-card",`ck-card--${variant}`,className)} {...props}>{(title||eyebrow||actions)&&<header className="ck-card-header"><div>{eyebrow&&<span className="ck-eyebrow">{eyebrow}</span>}{title&&<h2>{title}</h2>}</div>{actions}</header>}<div className="ck-card-body">{children}</div></section>;
}

export function Badge({ variant="neutral", dot=false, className, children, ...props }:HTMLAttributes<HTMLSpanElement> & {variant?:"neutral"|"success"|"warning"|"danger"|"accent";dot?:boolean}) { return <span className={cx("ck-badge",`ck-badge--${variant}`,className)} {...props}>{dot&&<i aria-hidden="true"/>}{children}</span>; }

export function Dialog({ open, onClose, title, description, footer, variant="default", children }:{open:boolean;onClose:()=>void;title:string;description?:string;footer?:ReactNode;variant?:"default"|"wide";children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null); const titleId=useId(); const descId=useId();
  useEffect(()=>{const node=ref.current;if(!node)return;if(open&&!node.open)node.showModal();if(!open&&node.open)node.close();},[open]);
  return <dialog ref={ref} className={cx("ck-dialog",`ck-dialog--${variant}`)} aria-labelledby={titleId} aria-describedby={description?descId:undefined} onCancel={(event)=>{event.preventDefault();onClose();}} onClose={onClose}><header><div><h2 id={titleId}>{title}</h2>{description&&<p id={descId}>{description}</p>}</div><IconButton label="Close dialog" variant="ghost" onClick={onClose}><X size={18}/></IconButton></header><div className="ck-dialog-body">{children}</div>{footer&&<footer>{footer}</footer>}</dialog>;
}

export function Tooltip({ content, children }:{content:string;children:ReactNode;placement?:"top"|"bottom"}) { const id=useId(); return <span className="ck-tooltip-wrap" aria-describedby={id}>{children}<span id={id} role="tooltip" className="ck-tooltip">{content}</span></span>; }

export function Toast({ title, message, variant="info", onDismiss }:{title?:string;message:string;variant?:"success"|"info"|"warning"|"error";onDismiss?:()=>void}) { return <div className={cx("ck-toast",`ck-toast--${variant}`)} role={variant==="error"?"alert":"status"} aria-live={variant==="error"?"assertive":"polite"}><span className="ck-toast-icon" aria-hidden="true">{variant==="success"?<Check size={15}/>:"·"}</span><div>{title&&<strong>{title}</strong>}<p>{message}</p></div>{onDismiss&&<IconButton label="Dismiss notification" variant="ghost" size="sm" onClick={onDismiss}><X size={14}/></IconButton>}</div>; }

export interface SidebarItem { href:string;label:string;icon:ReactNode; }
export function Sidebar({ items, activePath, label="Product navigation", footer, compact=false }:{items:SidebarItem[];activePath:string;label?:string;footer?:ReactNode;compact?:boolean}) { return <aside className={cx("ck-sidebar",compact&&"is-compact")} aria-label={`${label} sidebar`}><a className="ck-sidebar-brand" href="/" aria-label="CreatorKit AI home"><span>C</span><b>CreatorKit</b></a><nav aria-label={label}>{items.map((item)=><a key={item.href} href={item.href} aria-current={activePath===item.href?"page":undefined} title={compact?item.label:undefined}>{item.icon}<span>{item.label}</span></a>)}</nav>{footer&&<div className="ck-sidebar-footer">{footer}</div>}</aside>; }

export function AssetCard({ title, status, meta, selected=false, onSelect, actions, children, className }:{title:string;status:"ready"|"selected"|"approved"|"rejected";meta?:string;selected?:boolean;onSelect?:()=>void;actions?:ReactNode;children:ReactNode;className?:string}) { return <article className={cx("ck-asset-card",selected&&"is-selected",`is-${status}`,className)}><div className="ck-asset-preview">{children}{selected&&<span className="ck-selected-mark"><Check size={13}/> Selected</span>}</div><div className="ck-asset-info"><div><h3>{title}</h3>{meta&&<p>{meta}</p>}</div><Badge variant={status==="approved"?"success":status==="rejected"?"danger":"neutral"}>{status}</Badge></div>{(onSelect||actions)&&<div className="ck-asset-actions">{onSelect&&<Button variant={selected?"primary":"secondary"} size="sm" onClick={onSelect} aria-pressed={selected}>{selected?"Selected":"Choose variant"}</Button>}{actions}</div>}</article>; }

export function PrototypeFrame({ label, width=375, height=690, checks, className, children }:{label:string;width?:number;height?:number;checks?:number;className?:string;children:ReactNode}) { return <figure className={cx("ck-prototype",className)} aria-label={label}><figcaption><span><i/> LIVE PROTOTYPE</span><code>{width} × {height}</code></figcaption><div className="ck-prototype-device" style={{"--frame-ratio":`${width}/${height}`} as React.CSSProperties}>{children}</div><footer><span>{label}</span>{checks!==undefined&&<b><Check size={12}/>{checks} checks</b>}</footer></figure>; }

export function useToast() { const [toast,setToast]=useState<{title?:string;message:string;variant?:"success"|"info"|"warning"|"error"}|null>(null); useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(null),5200);return()=>clearTimeout(id);},[toast]); return {toast,showToast:setToast,dismiss:()=>setToast(null)}; }
