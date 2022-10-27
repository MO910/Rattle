export const extractISODate = ({ date = new Date(), fullDate, time } = {}) => {
    if (+date) date = +date;
    date = new Date(date);
    if (time) return date.getTime();
    const iso = date.toISOString();
    return fullDate ? iso : iso.slice(0, 10);
};
