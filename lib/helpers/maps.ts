export function googleMapsUrl(
    pickup: string,
    destination: string
  ) {
    const origin = encodeURIComponent(pickup);
    const dest = encodeURIComponent(destination);
  
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
  }