import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
Object.defineProperty(HTMLDialogElement.prototype,"showModal",{configurable:true,value:function(){this.setAttribute("open","");}});
Object.defineProperty(HTMLDialogElement.prototype,"close",{configurable:true,value:function(){this.removeAttribute("open");this.dispatchEvent(new Event("close"));}});
Object.defineProperty(globalThis,"crypto",{configurable:true,value:{randomUUID:vi.fn(()=>"00000000-0000-4000-8000-000000000001")}});
