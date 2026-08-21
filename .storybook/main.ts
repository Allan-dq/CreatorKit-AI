import type { StorybookConfig } from "@storybook/react-vite";
const config:StorybookConfig={stories:["../packages/design-system/src/**/*.stories.@(ts|tsx)"],addons:["@storybook/addon-docs","@storybook/addon-a11y"],framework:{name:"@storybook/react-vite",options:{}},staticDirs:["../public"],docs:{defaultName:"Documentation"}};
export default config;
