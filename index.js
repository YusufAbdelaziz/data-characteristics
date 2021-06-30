const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const model = require("./data_characteristics");

fs.readFile("./actor_vs_actress.csv", (e, data) => {
  const records = parse(data, { columns: true, skip_empty_lines: true });
  const actorsData = records.map((record) => record["Best Actors"]);
  const actressesData = records.map((record) => record["Best Actresses"]);
  const actorsDataCharacteristics = new model.DataCharacteristics(actorsData);
  const actressesDataCharacteristics = new model.DataCharacteristics(
    actressesData
  );
  console.log("Best Actors");
  console.table(actorsDataCharacteristics.createProxyObject());
  console.log("Best Actresses");
  console.table(actressesDataCharacteristics.createProxyObject());
});
