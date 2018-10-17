<template>
    <div class="v-datetime">
        <v-input icon="calendar-alt" ref="input" :placeholder="placeholder" v-model="time"
            @blur="handleBlur" @click.native="activate" @input="$emit('input', time)"></v-input>
        <v-dropdown v-if="active">
            <table class="calendar" @mousedown.prevent>
                <thead class="header">
                    <tr>
                        <th>
                            <v-icon icon="arrow-left" @click.native="add(-1 * delta.count, delta.unit)"></v-icon>
                        </th>
                        <th class="title" :colspan="title.span" @click="title.nextPane && switchPane(title.nextPane)">
                            {{ title.value }}
                        </th>
                        <th>
                            <v-icon icon="arrow-right" @click.native="add(delta.count, delta.unit)"></v-icon>
                        </th>
                    </tr>
                    <tr v-if="pane == 'day'">
                        <th class="cell" :key="day" v-for="day in weekdays">{{ day }}</th>
                    </tr>
                </thead>
                <tbody class="body">
                    <tr :key="idx" v-for="(row, idx) in rows">
                        <td class="cell" :class="{current: cell.current, future: cell.future, past: cell.past}"
                                :key="idx" @click="select(cell.time)" v-for="(cell, idx) in row">
                            <span>{{ cell.value }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </v-dropdown>
    </div>
</template>

<script>
import moment from "moment";

moment.suppressDeprecationWarnings = true;

export default {
    name: "v-datetime",
    props: {
        format: {
            default: "YYYY-MM-DD HH:mm:ss",
            type: String,
        },
        placeholder: {
            type: String,
        },
        value: {
            type: String,
        },
    },
    data() {
        return {
            active: false,
            delta: {},
            pane: "day",
            refTime: null,
            rows: [],
            time: null,
            title: {},
        };
    },
    computed: {
        weekdays() {
            return moment.weekdaysShort(true);
        },
    },
    methods: {
        add(count, unit) {
            this.refTime.add(count, unit);
            this.update();
        },
        activate() {
            if (this.active) {
                return;
            }

            this.active = true;
        },
        handleBlur() {
            this.active = false;
        },
        select(time) {
            switch (this.pane) {
            case "day":
                Object.assign(this, {pane: "hour", refTime: time});
                break;

            case "hour":
                Object.assign(this, {pane: "minute", refTime: time});
                break;

            case "minute":
                Object.assign(this, {pane: "day", refTime: time});
                this.time = time.format(this.format);
                this.$emit("input", this.time);
                this.active = false;
                break;

            case "month":
                Object.assign(this, {pane: "day", refTime: time});
                break;

            case "year":
                Object.assign(this, {pane: "month", refTime: time});
                break;
            }

            this.update();
        },
        switchPane(name) {
            this.pane = name;
            this.update();
        },
        update() {
            let current = this.time ? moment(this.time) : null,
                delta = {},
                title = {},
                rows = [];

            switch (this.pane) {
            case "day": {
                let month = moment(this.refTime).month(),
                    day = moment(this.refTime).startOf("month").startOf("week"),
                    end = moment(this.refTime).endOf("month").endOf("week"),
                    days = [];

                delta = {count: 1, unit: "month"};
                title = {nextPane: "month", span: 5, value: this.refTime.format("MMMM YYYY")};

                while (day.isBefore(end)) {
                    days.push({
                        current: current && day.isSame(current, "day"),
                        future: day.month() > month,
                        past: day.month() < month,
                        time: moment(day),
                        value: day.format("D"),
                    });

                    day.add(1, "day");
                }

                rows = chunkArray(days, 7);

                break; }

            case "hour": {
                let hour = moment(this.refTime).startOf("day"),
                    end = moment(this.refTime).endOf("day"),
                    hours = [];

                delta = {count: 1, unit: "day"};
                title = {nextPane: null, span: 2, value: this.refTime.format("MMMM D, YYYY")};

                while (hour.isBefore(end)) {
                    hours.push({
                        current: current && hour.isSame(current, "hour"),
                        time: moment(hour),
                        value: hour.format("HH:mm"),
                    });

                    hour.add(1, "hour");
                }

                rows = chunkArray(hours, 4);

                break; }

            case "minute": {
                let minute = moment(this.refTime).startOf("hour"),
                    end = moment(this.refTime).endOf("hour"),
                    minutes = [];

                delta = {count: 1, unit: "hour"};
                title = {nextPane: null, span: 2, value: this.refTime.format("MMMM D, YYYY HH:mm")};

                while (minute.isBefore(end)) {
                    minutes.push({
                        current: current && minute.isSame(current, "minute"),
                        time: moment(minute),
                        value: minute.format("HH:mm"),
                    });

                    minute.add(5, "minute");
                }

                rows = chunkArray(minutes, 4);

                break; }


            case "month": {
                let month = moment(this.refTime).startOf("year"),
                    end = moment(this.refTime).endOf("year"),
                    months = [];

                delta = {count: 1, unit: "year"};
                title = {nextPane: "year", span: 2, value: this.refTime.format("YYYY")};

                while (month.isBefore(end)) {
                    months.push({
                        current: current && month.isSame(current, "month"),
                        time: moment(month),
                        value: month.format("MMM"),
                    });

                    month.add(1, "month");
                }

                rows = chunkArray(months, 4);

                break; }

            case "year": {
                let year = moment().year(parseInt(moment(this.refTime).year() / 10, 10) * 10 - 1).startOf("year"),
                    end = moment(year).add(11, "year").endOf("year"),
                    years = [];

                delta = {count: 12, unit: "year"};
                title = {nextPane: null, span: 2, value: `${moment(year).add(1, "year").format("YYYY")}-${
                    moment(end).add(-1, "year").format("YYYY")}`};

                while (year.isBefore(end)) {
                    years.push({
                        current: current && year.isSame(current, "year"),
                        future: years.length == 11,
                        past: years.length === 0,
                        time: moment(year),
                        value: year.format("YYYY"),
                    });

                    year.add(1, "year");
                }

                rows = chunkArray(years, 4);

                break; }
            }

            Object.assign(this, {
                delta: delta,
                title: title,
                rows: rows,
            });
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(to) {
                let time;

                if (to) {
                    time = moment(to, this.format, true);
                }
                if (!time || !time.isValid()) {
                    time = moment();
                }

                this.refTime = time.startOf("day");
                this.time = to;
                this.update();
            },
        },
    },
};

function chunkArray(input, size) {
    let output = [];
    while (input.length) {
        output.push(input.splice(0, size));
    }
    return output;
}
</script>

<style lang="scss" scoped>
.v-datetime {
    position: relative;
    min-width: 18rem;

    .v-dropdown {
        background-color: var(--datetime-calendar-background-color);
        color: var(--datetime-calendar-color);
        padding: 0.25rem;

        .calendar {
            border-spacing: 0.125rem;
            table-layout: fixed;
            width: 100%;

            .header .title,
            .header .v-icon,
            .body .cell {
                cursor: pointer;
            }

            .header .title {
                white-space: nowrap;
            }

            .cell {
                border-radius: 0.15rem;
                position: relative;
                text-align: center;

                &.current {
                    background-color: var(--datetime-calendar-active-background-color);
                }

                &.future span,
                &.past span {
                    opacity: 0.35;
                }
            }

            .body .cell {
                &:active,
                &:focus,
                &:hover {
                    background-color: var(--datetime-calendar-focus-background-color);
                    color: var(--datetime-calendar-focus-color);
                }
            }

            .header {
                .date,
                .cell {
                    font-weight: normal;
                }

                .date {
                    cursor: pointer;
                }

                .v-icon {
                    font-size: 1rem;
                }
            }
        }
    }

    .v-input {
        width: 100%;
    }
}
</style>
