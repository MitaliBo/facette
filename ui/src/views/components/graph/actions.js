import html2canvas from "html2canvas";
import moment from "moment";
import pickBy from "lodash/pickBy";
import slugify from "slugify";

import {dateFormatFilename, dateFormatRFC3339} from ".";

export default {
    applyRange(options) {
        this.applyRange(options);
    },

    basket(append = true) {
        let basket = this.$store.getters.basket || [];

        if (append) {
            basket.push({
                attributes: this.attributes,
                graph: this.graph,
                options: {
                    title: this.chart.config.titles.main.text,
                    start_time: moment(this.data.start).format(dateFormatRFC3339),
                    end_time: moment(this.data.end).format(dateFormatRFC3339),
                },
            });
        } else {
            basket.splice(this.index, 1);
        }

        this.$store.commit("basket", basket);
    },

    export(e, type) {
        let linkEl = document.createElement("a");

        let baseName =  `${slugify(this.chart.config.titles.main.text || "unnamed")}_${moment(this.data.start)
            .format(dateFormatFilename)}_${moment(this.data.end).format(dateFormatFilename)}`;

        switch (type) {
        case "png": {
            html2canvas(this.chart.canvas.parentNode, {
                logging: false,
            }).then((canvas) => {
                let png = canvas.toDataURL("image/png");

                Object.assign(linkEl, {
                    download: `${baseName}.png`,
                    href: png.replace("image/png", "image/octet-stream"),
                });

                document.body.appendChild(linkEl);
                linkEl.click();
                document.body.removeChild(linkEl);

                URL.revokeObjectURL(png);
            });

            break;
        }

        case "summary_csv":
        case "summary_json": {
            let data;

            if (type == "summary_csv") {
                let summary = "";

                this.data.series.forEach((series, idx) => {
                    let keys = Object.keys(series.summary);

                    if (idx === 0) {
                        summary += `name,${keys.join(",")}\n`;
                    }

                    summary += `"${series.name}",${keys.map(a => series.summary[a]).join(",")}\n`;
                });

                data = "data:text/csv;charset=utf-8," + encodeURIComponent(summary);
            } else {
                let summary = {};

                this.data.series.map(a => summary[a.name] = a.summary);

                data = "data:application/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(summary, null, "\t"));
            }

            Object.assign(linkEl, {
                download: `${baseName}_${type.replace("_", ".")}`,
                href: data,
            });

            document.body.appendChild(linkEl);
            linkEl.click();
            document.body.removeChild(linkEl);

            break;
        }

        default:
            console.warn(`Unknown "${type}" export type`);
        }
    },

    move(forward = false) {
        let start = moment(this.data.start),
            end = moment(this.data.end),
            delta = end.diff(start) * 0.25;

        if (forward) {
            this.applyRange({
                start_time: start.add(delta).format(dateFormatRFC3339),
                end_time: end.add(delta).format(dateFormatRFC3339),
            });
        } else {
            this.applyRange({
                start_time: start.add(-delta).format(dateFormatRFC3339),
                end_time: end.add(-delta).format(dateFormatRFC3339),
            });
        }
    },

    propagate() {
        this.$events.$emit("graph-action", "applyRange", pickRange(this.options));
    },

    resetRange() {
        this.applyRange(Object.assign({}, pickRange(this.originalOptions), pickRange(this.$route.query)));
    },

    toggleFold(state) {
        this.state = Object.assign(this.state, {folded: state});
        if (!state) {
            this.$nextTick(() => { this.update(); });
        }
    },

    toggleLegend(state) {
        this.state = Object.assign(this.state, {legend: state});

        if (state) {
            this.$nextTick(() => this.$refs.legend.update());
        }
    },

    unfold(idx) {
        if (idx === this.index) {
            this.exec("toggleFold", false);
        }
    },

    update() {
        this.update();
    },

    zoom(zoomIn = false) {
        let start = moment(this.data.start),
            end = moment(this.data.end),
            delta = end.diff(start);

        if (zoomIn) {
            delta *= 0.25;

            this.applyRange({
                start_time: start.add(delta).format(dateFormatRFC3339),
                end_time: end.add(-delta).format(dateFormatRFC3339),
            });
        } else {
            delta *= 0.5;

            this.applyRange({
                start_time: start.add(-delta).format(dateFormatRFC3339),
                end_time: end.add(delta).format(dateFormatRFC3339),
            });
        }
    },
};

function pickRange(options) {
    return pickBy(options, (value, key) => ["time", "range", "start_time", "end_time"].indexOf(key) != -1);
}
