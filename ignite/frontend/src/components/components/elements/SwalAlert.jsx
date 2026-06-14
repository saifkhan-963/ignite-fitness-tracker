import Swal from 'sweetalert2'

const defaultColors = {
    confirm: {
        light: '#3B82F6', // blue-500
        dark: '#60A5FA'  // blue-400
    },
    cancel: {
        light: '#EF4444', // red-500
        dark: '#F87171'  // red-400
    }
};

const getThemeColors = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
        confirmButtonColor: isDark ? defaultColors.confirm.dark : defaultColors.confirm.light,
        cancelButtonColor: isDark ? defaultColors.cancel.dark : defaultColors.cancel.light
    };
};

export const SwalAlert = ({
    title,
    text,
    icon = 'info',
    timer,
    timerProgressBar = true,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel
}) => {
    const colors = getThemeColors();
    
    const baseConfig = {
        title,
        text,
        icon,
        ...colors,
        showConfirmButton: !!confirmButtonText,
        showCancelButton: !!cancelButtonText,
        timerProgressBar,
        timer: timer || undefined
    };

    if (confirmButtonText) {
        baseConfig.confirmButtonText = confirmButtonText;
    }
    
    if (cancelButtonText) {
        baseConfig.cancelButtonText = cancelButtonText;
    }

    Swal.fire(baseConfig).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        } else if (result.isDismissed && onCancel) {
            onCancel();
        }
    });
};

// Helper functions for common use cases
export const showSuccess = (message, timer = 2000) => 
    SwalAlert({
        title: 'Success',
        text: message,
        icon: 'success',
        timer
    });

export const showError = (message, timer = 3000) => 
    SwalAlert({
        title: 'Error',
        text: message,
        icon: 'error',
        timer
    });

export const showConfirm = (message, onConfirm, onCancel) => 
    SwalAlert({
        title: 'Confirm',
        text: message,
        icon: 'question',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        onConfirm,
        onCancel
    });
