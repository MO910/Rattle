// export
export default (count = 10) => {
    const letter =
        "(){}[]~-_=+,.!@#$%^&*0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < count; i++) {
        const randomStringNumber = Math.floor(
            1 + Math.random() * (letter.length - 1)
        );
        randomString += letter.charAt(randomStringNumber);
    }
    return randomString;
};
