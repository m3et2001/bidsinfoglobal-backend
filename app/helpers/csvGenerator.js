import { appendFileSync } from 'fs';


const saveAsCSV = (data, filename, json = false) => {
    // const csv = `${this.name},${this.phone},${this.email}\n`;
    let csv = data;
    if (json) {
        csv = csv.map(function (row, key) {
            console.log(row, 'row')
            console.log(key, 'key');
        })
    }
    try {
        // appendFileSync(filename, data);
    } catch (err) {
        console.error(err);
    }
}

export default saveAsCSV;