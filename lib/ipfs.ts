import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt:     process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

export async function uploadMetadata(
  metadata: Record<string, unknown>,
  name: string
): Promise<{ cid: string; uri: string }> {
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const file = new File([blob], `${name}.json`, { type: 'application/json' });

  const result = await pinata.upload.public.file(file);
  return {
    cid: result.cid,
    uri: `${GATEWAY}/ipfs/${result.cid}`,
  };
}

export async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<{ cid: string; url: string }> {
  const response = await fetch(imageUrl);
  const blob     = await response.blob();
  const file     = new File([blob], filename, { type: blob.type });

  const result = await pinata.upload.public.file(file);
  return {
    cid: result.cid,
    url: `${GATEWAY}/ipfs/${result.cid}`,
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
    name:        character.name,
    description: `${character.description}\n\n${character.backstory}`,
    image:       character.imageUrl,
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
      owner:    ownerWallet,
      version:  '1.0',
    },
  };
}
