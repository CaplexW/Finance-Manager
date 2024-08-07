import { parse } from "csv-parse";
import { createReadStream } from "fs";
import iconv from 'iconv-lite';

export default async function extractDataFromCSV(file: Express.Multer.File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const records: string[][] = [];
    createReadStream(file.path)
    .pipe(iconv.decodeStream('win1251'))
    .pipe(parse({ delimiter: ";" }))
    .on('data', (record) => records.push(record))
    .on('end', () => resolve(records))
    .on('error', (err) => reject(err));
  });
}