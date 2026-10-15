interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}

/** "Salt Lake City, UT 84116". One place, so templates never lose the spaces. */
export function cityLine(address: Address): string {
  return `${address.city}, ${address.region} ${address.postalCode}`;
}

/** "1359 N General Dr, Salt Lake City, UT 84116". */
export function oneLineAddress(address: Address): string {
  return `${address.street}, ${cityLine(address)}`;
}
