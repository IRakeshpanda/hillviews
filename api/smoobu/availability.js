export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.SMOOBU_API_KEY || process.env.textSMOOBU_API_KEY || '';
  const apartmentId = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '';

  if (!apiKey || !apartmentId) {
    return res.status(500).json({
      bookedDates: [],
      error: 'Smoobu availability is not configured. Set SMOOBU_API_KEY and SMOOBU_HILL_VIEW_APARTMENT_ID in Vercel.'
    });
  }

  const { startDate, endDate } = req.query || {};
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing startDate or endDate query params.' });
  }

  try {
    const availabilityUrl = new URL('https://login.smoobu.com/api/rates');
    availabilityUrl.searchParams.set('apartments[]', apartmentId);
    availabilityUrl.searchParams.set('start_date', String(startDate));
    availabilityUrl.searchParams.set('end_date', String(endDate));

    const response = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Smoobu availability call failed', { status: response.status, detail });
      return res.status(502).json({
        bookedDates: [],
        error: 'Unable to fetch live availability from Smoobu.'
      });
    }

    const data = await response.json();
    const apartmentData = data?.data?.[apartmentId] ?? data?.[apartmentId] ?? {};
    const bookedDates = Object.entries(apartmentData)
      .filter(([, details]) => details?.available === 0 || details?.available === false)
      .map(([date]) => date);

    return res.status(200).json({ bookedDates, notice: 'Live availability synced for Hill View Stone Cottage.' });
  } catch (error) {
    console.error('Smoobu availability API error:', error);
    return res.status(500).json({
      bookedDates: [],
      error: 'Failed to fetch live availability.'
    });
  }
}
