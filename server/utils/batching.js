const haversineDistance = require('./distance');

function calculateSeparateDistance(runnerLoc, reqA, reqB) {
  const distA = haversineDistance(runnerLoc, reqA.pickup.coordinates) +
                haversineDistance(reqA.pickup.coordinates, reqA.drop.coordinates) +
                haversineDistance(reqA.drop.coordinates, runnerLoc);

  const distB = haversineDistance(runnerLoc, reqB.pickup.coordinates) +
                haversineDistance(reqB.pickup.coordinates, reqB.drop.coordinates) +
                haversineDistance(reqB.drop.coordinates, runnerLoc);

  return distA + distB;
}

function calculateBestCombinedDistance(runnerLoc, reqA, reqB) {
  const P1 = reqA.pickup.coordinates;
  const D1 = reqA.drop.coordinates;
  const P2 = reqB.pickup.coordinates;
  const D2 = reqB.drop.coordinates;

  const validOrders = [
    [P1, D1, P2, D2],
    [P1, P2, D1, D2],
    [P1, P2, D2, D1],
    [P2, D2, P1, D1],
    [P2, P1, D2, D1],
    [P2, P1, D1, D2],
  ];

  let minDistance = Infinity;

  for (const order of validOrders) {
    let distance = haversineDistance(runnerLoc, order[0]);
    for (let i = 0; i < order.length - 1; i++) {
      distance += haversineDistance(order[i], order[i + 1]);
    }
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
}

function shouldBatch(runnerLoc, reqA, reqB, threshold = 0.85) {
  const separate = calculateSeparateDistance(runnerLoc, reqA, reqB);
  const combined = calculateBestCombinedDistance(runnerLoc, reqA, reqB);

  return {
    batch: combined < separate * threshold,
    separateDistance: separate,
    combinedDistance: combined
  };
}

module.exports = { shouldBatch };
