import { Step } from "react-joyride";

export const editorOnboardingSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        disableBeacon: true,
        title: "Welcome to Designr!👋",
        content: 'Let’s walk through the main features so you can get started quickly.',
    },
    {
        target: '#editor__navbar__shape-menu',
        title: "Shapes & Lines",
        content: 'Use this to create basic shapes like rectangles, circles, and more.',
        hideBackButton: true,
        hideCloseButton: true,
        spotlightClicks: true,
        placement: 'right',
        disableBeacon: true,
        //disableBeacon: false,
        disableOverlayClose: true
    },
    {
        target: '#editor__navbar__text-menu-button',
        title: "Text Tool",
        content: 'Click here to add and customize text in your design.',
        placement: 'right',
        //disableBeacon: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true
    },
    {
        target: '#editor__navbar__asset-button',
        title: "Assets & Icons",
        content: 'This is where you upload images or browse previously uploaded assets.',
        placement: 'right',
        //disableBeacon: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true
    },
    {
        target: '#editor__settings-panel',
        title: "Settings Panel",
        content: 'Tweak the properties of selected objects — size, position, colors, and more — right here.',
        placement: 'right',
        disableBeacon: true,
    },
    {
        target: '#editor__zoom-controls',
        title: "Zoom Controls",
        disableBeacon: true,
        content: 'Use these buttons to zoom in or out of the canvas for better control.',
        placement: 'top'
    },
    {
        title: "Keyboard Shortcuts",
        target: '#editor__navbar-keyboard-shortcuts-button',
        disableBeacon: true,
        content: 'Click here to see all the available keyboard shortcuts to speed up your workflow.',
    },
    {
        title: "Share and Export",
        target: '#editor__navbar-share-button',
        disableBeacon: true,
        content: 'Once you’re done designing, use this button to export your project in multiple formats.',
    },
    {
        title: "Layers Panel",
        target: '#editor__layers-panel',
        disableBeacon: true,
        content: 'This panel helps you manage your objects — reorder, lock, or hide them easily.',
    },
    {
        title: "Ai Tools",
        target: '#editor__ai-panel',
        disableBeacon: true,
        content: 'Try out AI tools like text to design or image generation to power up your designs.',
    },
    {
        title: "Thank You! 🎉",
        target: 'body',
        content: 'You’re all set to start creating amazing designs! If you need help, check out our documentation or community forums.',
        spotlightClicks: false,
        disableBeacon: true,
        placement: 'center',
        hideBackButton: true,
    }
];
