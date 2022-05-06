const { getPalette, getColor } = require("colorthief"),
    FastAverageColor = require("fast-average-color");
// Export
module.exports = async ({ body: { URL } }, res) => {
    try {
        let palette = await getPalette(URL),
            dominant = await getColor(URL);
        // adjust to fit
        let adjPalette = palette.slice(0);
        adjPalette.map((p) => (p[3] = 255));
        adjPalette = adjPalette.flat();
        // Fast Average Color
        const fac = new FastAverageColor();
        const average = await fac.getColorFromArray4(adjPalette, {
            ignoredColor: [
                [255, 255, 255, 255], // white
                [0, 0, 0, 255], // black
            ],
        });
        // check darkness
        const isDark = (color = [0, 0, 0]) => {
            const checkingValue =
                0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
            return checkingValue < 40;
        };
        // response
        res.json({
            isAverageDark: isDark(average),
            isDominantDark: isDark(dominant),
            average,
            dominant,
            palette,
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
};
