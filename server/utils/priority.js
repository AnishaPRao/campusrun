function calculatePriority(request, agingRate = 0.02) {
  const now = new Date();
  const waitingMinutes = (now - new Date(request.createdAt)) / (1000 * 60);
  return request.urgency + (waitingMinutes * agingRate);
}

module.exports = { calculatePriority };