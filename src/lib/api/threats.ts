export interface CveItem {
  id: string;
  description: string;
  published: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
}

export async function fetchRecentCves(limit: number = 20): Promise<CveItem[]> {
  try {
    const res = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=${limit}`,
      { next: { revalidate: 120 } }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return (data.vulnerabilities || []).map((v: Record<string, unknown>) => {
      const cve = v.cve as Record<string, unknown>;
      const descriptions = cve.descriptions as { lang: string; value: string }[];
      const metrics = cve.metrics as Record<string, unknown>;
      const desc = descriptions?.find((d) => d.lang === 'en')?.value || '';

      let severity: CveItem['severity'] = 'MEDIUM';
      let score = 5.0;

      // Try CVSS v3.1
      const cvssV31 = metrics?.cvssMetricV31 as Array<{ cvssData: { baseScore: number; baseSeverity: string } }>;
      if (cvssV31?.[0]) {
        score = cvssV31[0].cvssData.baseScore;
        severity = cvssV31[0].cvssData.baseSeverity as CveItem['severity'];
      }

      return {
        id: cve.id as string,
        description: desc.slice(0, 200),
        published: cve.published as string,
        severity,
        score,
      };
    });
  } catch {
    return [];
  }
}

export interface ThreatEvent {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'ransomware' | 'apt' | 'exploit';
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  source: string;
}

// Generate realistic-looking threat events for the world map
export function generateThreatEvents(count: number = 40): ThreatEvent[] {
  const types: ThreatEvent['type'][] = ['malware', 'phishing', 'ddos', 'ransomware', 'apt', 'exploit'];
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
  const sources = ['OTX', 'NVD', 'AbuseIPDB', 'GDELT', 'VirusTotal', 'Shodan'];

  // Hot zones - areas with higher density of cyber incidents
  const hotZones = [
    { lat: 37.7749, lng: -122.4194, spread: 5 },   // SF/Silicon Valley
    { lat: 40.7128, lng: -74.006, spread: 3 },      // NYC
    { lat: 51.5074, lng: -0.1278, spread: 4 },      // London
    { lat: 52.52, lng: 13.405, spread: 3 },          // Berlin
    { lat: 55.7558, lng: 37.6173, spread: 5 },       // Moscow
    { lat: 39.9042, lng: 116.4074, spread: 5 },      // Beijing
    { lat: 35.6762, lng: 139.6503, spread: 3 },      // Tokyo
    { lat: 1.3521, lng: 103.8198, spread: 2 },       // Singapore
    { lat: -23.5505, lng: -46.6333, spread: 3 },     // São Paulo
    { lat: 25.2048, lng: 55.2708, spread: 2 },       // Dubai
  ];

  return Array.from({ length: count }, (_, i) => {
    const zone = hotZones[Math.floor(Math.random() * hotZones.length)];
    return {
      id: `threat-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      lat: zone.lat + (Math.random() - 0.5) * zone.spread * 2,
      lng: zone.lng + (Math.random() - 0.5) * zone.spread * 2,
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `Detected ${types[Math.floor(Math.random() * types.length)]} activity`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
    };
  });
}
