import { buildAvailabilityResponse, validateAvailabilityRequest } from '../_lib/availability.js';
import { resolvePropertyConfig } from '../_lib/properties.js';
import { fetchPropertyAvailability } from '../_lib/smoobuClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      propertySlug: null,
      isAvailable: false,
      blockedRanges: [],
      message: 'Method not allowed.',
    });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return res.status(400).json(buildAvailabilityResponse(null, false, [], 'Invalid request body.'));
  }

  const propertySlug = body.propertySlug;
  const checkIn = body.checkIn;
  const checkOut = body.checkOut;

  try {
    const parsed = validateAvailabilityRequest(propertySlug, checkIn, checkOut);
    const config = resolvePropertyConfig(parsed.propertySlug);

    if (!config.ok || !config.apartmentId) {
      return res.status(500).json(buildAvailabilityResponse(parsed.propertySlug, false, [], config.error || 'Availability is not configured on this server.'));
    }

    const response = await fetchPropertyAvailability(parsed.propertySlug, parsed.checkIn, parsed.checkOut);
    return res.status(200).json(buildAvailabilityResponse(
      response.propertySlug,
      response.isAvailable,
      response.blockedRanges,
      response.message,
    ));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to verify availability.';
    const status = message.toLowerCase().includes('propertyslug') || message.toLowerCase().includes('valid iso date') || message.toLowerCase().includes('before') ? 400 : 500;
    return res.status(status).json(buildAvailabilityResponse(propertySlug || null, false, [], message));
  }
}