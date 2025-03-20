import { toast } from "sonner-native";

const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        return false;
    } else {
        return true;
    }
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    } else {
        return true;
    }
};

const validatePassword = (password: string): boolean => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return false;
    } else {
        return true;
    }
};

const validateAuthInputs = ({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name: string;
}) => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
        if (checkAtLeastTwoFalse(isNameValid, isEmailValid, isPasswordValid)) {
            toast.error("Please enter all details.");
            return false;
        }
        if (!isNameValid) {
            toast.error("Please enter a valid name.");
        }
        if (!isEmailValid) {
            toast.error("Please enter a valid email.");
        }
        if (!isPasswordValid) {
            toast.error(
                "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character."
            );
        }
        return false;
    } else {
        return true;
    }
};

const checkAtLeastTwoFalse = (
    arg1: boolean,
    arg2: boolean,
    arg3: boolean
): boolean => {
    const falseCount = [arg1, arg2, arg3].filter((value) => !value).length;
    return falseCount >= 2;
};

export { validateAuthInputs };
