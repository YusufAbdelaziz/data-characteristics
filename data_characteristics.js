const math = require("mathjs");

class DataCharacteristics {
  constructor(data) {
    this._data = data.map((entity) => Number(entity));
    this.numOfValues = this.countNumOfValues();
    this.arithmeticMean = this.findMean(this._data);
    this.maxVal = this.findMaxVal();
    this.minVal = this.findMinVal();
    this.median = this.findMedian();
    this.trimmedMean10Percent = this.findTrimmedMean(10);
    this.trimmedMean20Percent = this.findTrimmedMean(20);
    this.geometricMean = this.findGeometricMean();
    this.harmonicMean = this.findHarmonicMean();
    this.midRange = this.findMidrange();
    this.mode = this.findMode();
  }

  countNumOfValues() {
    return this._data.length;
  }

  findMean(data) {
    const sum = data.reduce(
      (accumulator, currentVal) => accumulator + currentVal
    );

    return math.round(sum / this.countNumOfValues(), 4);
  }

  findMaxVal() {
    let max = 0;
    this._data.forEach((entity) => {
      if (max < entity) {
        max = entity;
      }
    });
    return max;
  }

  findMinVal() {
    let min = this._data[0];
    this._data.forEach((entity) => {
      if (min > entity) {
        min = entity;
      }
    });
    return min;
  }

  findMedian() {
    const sortedData = this._data.sort((a, b) => a - b);
    const length = this._data.length;
    let median = 0;
    if (length % 2 == 0) {
      const middleIndex = length / 2;
      median = this.findMean([
        sortedData[middleIndex],
        sortedData[middleIndex - 1],
      ]);
    } else {
      const middleIndex = math.floor((length - 1) / 2);
      median = sortedData[middleIndex];
    }

    return median;
  }

  findTrimmedMean(percentage) {
    const dataLength = this._data.length;
    const numOfTrimmedValues = math.round((percentage / 100) * dataLength);
    const trimmedData = this._data
      .slice(numOfTrimmedValues)
      .slice(0, dataLength - numOfTrimmedValues);
    return this.findMean(trimmedData);
  }

  findGeometricMean() {
    const multipliedValues = this._data.reduce(
      (acc, currentValue) => acc * currentValue,
      1
    );
    return math.round(math.nthRoot(multipliedValues, this._data.length), 4);
  }

  findHarmonicMean() {
    const sumOfInvertedValues = this._data.reduce(
      (acc, currentValue) => acc + 1 / currentValue
    );

    return math.round(this._data.length / sumOfInvertedValues, 4);
  }

  findMidrange() {
    return (this.findMaxVal() + this.findMinVal()) / 2;
  }

  findMode() {
    const valuesOccurrences = {};
    let modeNum = 0;
    let occurredNumbers = {};
    // First, find the number of occurrences for each number in the data set.
    this._data.forEach((value) => {
      if (valuesOccurrences[value] == undefined) {
        valuesOccurrences[value] = 1;
      } else {
        valuesOccurrences[value] += 1;
      }
    });
    // Second, find the [maxEntry] which has the number as a key and the number of occurrences as a paired value.
    const valuesOccurrencesEntries = Object.entries(valuesOccurrences);
    let [currentMaxVal, currentMaxOccurrence] = valuesOccurrencesEntries[0];
    let maxEntry = {};
    maxEntry[currentMaxVal] = currentMaxOccurrence;
    valuesOccurrencesEntries.forEach(([number, occurrenceNum]) => {
      if (maxEntry[currentMaxVal] < occurrenceNum) {
        maxEntry = {};
        currentMaxVal = number;
        maxEntry[number] = occurrenceNum;
        occurredNumbers = {};
        occurredNumbers[number] = occurrenceNum;
      }
    });
    // If the [maxEntry] has only occurred once, then don't bother finding other numbers with same
    // number of occurrences.
    // Otherwise, find number with the same number of occurrences as our [maxEntry], also store the numbers and
    // their occurrences number in [occurredNumbers] object.
    if (maxEntry[currentMaxVal] > 1) {
      valuesOccurrencesEntries.forEach(([number, occurrenceNum]) => {
        if (maxEntry[currentMaxVal] == occurrenceNum) {
          modeNum++;
          occurredNumbers[number] = occurrenceNum;
        }
      });
    }
    const occurredNumbersJson = JSON.stringify(occurredNumbers);
    if (modeNum == 0) {
      return `The data set has no modes.`;
    } else if (modeNum == 1) {
      return `The data set has only one mode which is ${occurredNumbersJson}`;
    } else if (modeNum == 2) {
      return `The data set has two modes which are ${occurredNumbersJson}`;
    } else {
      return `The data set has multi modes which are ${occurredNumbersJson}`;
    }
  }

  createProxyObject() {
    return {
      Mean: this.arithmeticMean,
      "Number of values": this.numOfValues,
      "Maximum value": this.maxVal,
      "Minimum value": this.minVal,
      Median: this.median,
      "Trimmed Mean by 10%": this.trimmedMean10Percent,
      "Trimmed Mean by 20%": this.trimmedMean20Percent,
      "Geometric mean": this.geometricMean,
      "Harmonic mean": this.harmonicMean,
      Midrange: this.midRange,
      Mode: this.mode,
    };
  }
}
module.exports = { DataCharacteristics };
