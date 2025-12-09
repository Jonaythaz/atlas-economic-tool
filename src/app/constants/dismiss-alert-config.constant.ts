import { AlertConfig } from "@kirbydesign/designsystem";

export const DISMISS_ALERT_CONFIG: AlertConfig = {
    title: 'Discard changes?',
    message: 'You have unsaved changes. Are you sure you want to discard them?',
    okBtn: 'Discard',
    cancelBtn: 'Keep editing',
    icon: {
        name: 'warning',
        themeColor: 'warning',
    },
};