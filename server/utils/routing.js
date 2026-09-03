const haversineDistance = require('./distance');

function buildOptimizedRoute(runnerLoc, requests) {
  const stops = [];
  requests.forEach((r, index) => {
    stops.push({ point: r.pickup.coordinates, type: 'pickup', requestIndex: index });
    stops.push({ point: r.drop.coordinates, type: 'drop', requestIndex: index });
  });

  const visited = [];
  const pickedUp = new Set();
  let currentLoc = runnerLoc;
  const remaining = [...stops];

  while (remaining.length > 0) {
    const validStops = remaining.filter(stop =>
      stop.type === 'pickup' || pickedUp.has(stop.requestIndex)
    );

    let nearest = null;
    let nearestDist = Infinity;
    for (const stop of validStops) {
      const dist = haversineDistance(currentLoc, stop.point);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = stop;
      }
    }

    visited.push(nearest);
    if (nearest.type === 'pickup') {
      pickedUp.add(nearest.requestIndex);
    }
    currentLoc = nearest.point;

    const removeIndex = remaining.indexOf(nearest);
    remaining.splice(removeIndex, 1);
  }

  return visited;
}

module.exports = { buildOptimizedRoute };
