let cons = { lang: {} };
// day to string
const stringify = ({
    courseTitle,
    title,
    day,
    details,
    versesPerPage,
    surahAdj,
    $vuetify,
    showDate,
}) => {
    cons.lang.isEn = $vuetify.lang.current == "en";
    // if there is nothing
    if (!title || !day) return;
    // translations
    cons.versesPerPage = versesPerPage;
    cons.surahAdj = surahAdj;
    cons.$vuetify = $vuetify;
    cons.lang.from = $vuetify.lang.t("$vuetify.from");
    cons.lang.to = $vuetify.lang.t("$vuetify.to");
    cons.lang.ayah = $vuetify.lang.t("$vuetify.ayah");
    cons.lang.rabt = $vuetify.lang.t("$vuetify.rabt");
    title = $vuetify.lang.t(`$vuetify.${title}`);
    // if the course is quran
    if (courseTitle.toLowerCase() === "quran") {
        let str = pageToVerse(day);
        if (details) str = `${title}: ${str}`;
        if (showDate) {
            let lang = cons.lang.isEn ? "en-GB" : "ar-EG",
                spread = cons.lang.isEn ? "," : "،",
                date = new Intl.DateTimeFormat(lang, { dateStyle: "full" })
                    .format(day.date)
                    .split(spread)[1];
            str = `<p>${date}</p> ${str}`;
        }
        return str;
    } // normal book
    else {
        let de = [];
        let str = `${title}: from page ${day.from} to ${day.to}\n`;
        // details
        if (!details) str = `${title}: ${str}`;
        else de.push({ title: title, str });
        // rabt
        if (day.rabt_from) {
            if (!details) str = `${title} ${cons.lang.rabt}: `;
            str += `from page ${day.rabt_from} to ${Math.max(day.from - 1, 1)}`;
            if (details) de.push({ title: `${title} ${cons.lang.rabt}`, str });
        }
        return details ? de : str;
    }
};
// get verses from pages
const pageToVerse = ({ from, to }) => {
    if (
        !cons.versesPerPage.pages[from - 1] ||
        !cons.versesPerPage.pages[to - 1]
    )
        return;
    let fromVerse = cons.versesPerPage.pages[from - 1][0].verse_key,
        toVerse = cons.versesPerPage.pages[to - 1].at(-1).verse_key;
    fromVerse = verseKeyToName(fromVerse);
    toVerse = verseKeyToName(toVerse);
    return `${cons.lang.from} ${fromVerse} ${cons.lang.to} ${toVerse}`;
};
const verseKeyToName = (verse_key) => {
    // console.log(verse_key);
    const [surah, ayah] = verse_key.split(":"),
        lang = cons.$vuetify.lang.current,
        nameLang = lang == "en" ? "name_simple" : "name_arabic";
    return `${cons.surahAdj.chapters[+surah - 1][nameLang]} ${
        cons.lang.ayah
    } ${ayah}`;
};
// export
export { stringify, verseKeyToName };
