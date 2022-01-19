function AEQ(a, b, errorTolerance = 0.000001) {
  return Math.abs(a - b) < errorTolerance;
}