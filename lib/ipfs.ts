const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

async function getPinataHeaders() {
  return {
    'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    'Content-Type': 'application/json',
  };
}

export async function uploadMetadata(
  metadata: Record<string, unknown>,
  name: string
): Promise<{ cid: string; uri: string }> {
  const headers = await getPinataHeaders();

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `${name}.json` },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    cid: result.IpfsHash,
    uri: `${GATEWAY}/ipfs/${result.IpfsHash}`,
  };
}

export async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<{ cid: string; url: string }> {
  const imageResponse = await fetch(imageUrl);
  const blob = await imageResponse.blob();

  const formData = new FormData();
  formData.append('file', blob, filename);
  formData.append('pinataMetadata', JSON.stringify({ name: filename }));

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    cid: result.IpfsHash,
    url: `${GATEWAY}/ipfs/${result.IpfsHash}`,
  };
}

export function buildCharacterMetadata(
  character: {
    name: string;
    description: string;
    backstory: string;
    imageUrl: string;
    traits: Record<string, string | number>;
    rarity: string;
  },
  ownerWallet: string
): Record<string, unknown> {
  return {
    name: character.name,
    description: `${character.description}\n\n${character.backstory}`,
    image: character.imageUrl,
    external_url: `${process.env.NEXT_PUBLIC_APP_URL}/character/${ownerWallet}`,
    attributes: [
      { trait_type: 'Rarity',   value: character.rarity },
      { trait_type: 'Element',  value: character.traits.element },
      { trait_type: 'Weapon',   value: character.traits.weapon },
      { trait_type: 'Class',    value: character.traits.class },
      { trait_type: 'Power',    value: character.traits.power },
      { trait_type: 'Speed',    value: character.traits.speed },
      { trait_type: 'Luck',     value: character.traits.luck },
      { trait_type: 'Platform', value: 'Lumina Arcade' },
    ],
    properties: {
      platform: 'Lumina Arcade',
      owner: ownerWallet,
      version: '1.0',
    },
  };
}
