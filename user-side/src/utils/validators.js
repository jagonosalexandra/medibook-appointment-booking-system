export const validateForm = (data) => {
    const errors = {};

    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
    if (!data.name || !nameRegex.test(data.name.trim())) {
        errors.name = "Please enter a valid full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^\+?[\d\s-]{7,}$/;
    const digitCount = (data.phone.match(/\d/g) || []).length;
    if (!data.phone || !phoneRegex.test(data.phone) || digitCount < 7) {
        errors.phone = "Please enter a valid phone number.";
    }

    if (!data.appointment_type) {
        errors.appointment_type = "Please select an appointment type.";
    }

    return errors;
};