import type { Preview } from "@storybook/react-vite";
import "../packages/design-tokens/generated/tokens.css";
import "../packages/design-system/src/design-system.css";
import "../app/globals.css";
const preview:Preview={parameters:{layout:"centered",controls:{expanded:true},a11y:{test:"error"},backgrounds:{options:{paper:{name:"Paper",value:"#F4F1E9"},ink:{name:"Ink",value:"#10110F"}}}},decorators:[(Story)=><div data-theme="light" style={{minWidth:320,maxWidth:920,padding:24}}><Story/></div>]};
export default preview;
