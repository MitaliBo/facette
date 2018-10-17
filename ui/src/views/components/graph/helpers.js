const sizeUnits = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

export const formatSize = (value) => {
    if (value === 0) {
        return "0";
    }

    var index = parseInt(Math.log(Math.abs(value)) / Math.log(1024), 10);
    value /= Math.pow(1024, index);
    return (Math.round(value * 100) / 100) + (index > 0 ? sizeUnits[index] : "");
};
