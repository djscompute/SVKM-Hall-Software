export const isValidMobile = (mobileNumber: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/; // Assumes a 10-digit mobile number format
    return mobileRegex.test(mobileNumber);
}