export interface InterfaceWithDiscriminator {
    discriminator: string;
}

export function checkDiscriminator(object: InterfaceWithDiscriminator, discriminator: string) {
    return object.discriminator === discriminator;
}
