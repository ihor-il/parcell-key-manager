import {
    checkDiscriminator,
    InterfaceWithDiscriminator,
} from './interface.helpers';

export interface PageWithActions extends InterfaceWithDiscriminator {
    discriminator: 'PageWithActions';
    getActions(): PageAction[];
}

export interface PageAction {
    icon: string;
    tooltip?: string;
    callback: () => void;
}

export function instanceOfPageWithActions(obj: any) {
    return checkDiscriminator(obj, 'PageWithActions');
}
