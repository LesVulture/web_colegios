export type WeaveType = 'Plano' | 'Punto';

export type PrintRoute =
  | 'Unicolor'
  | 'Rotativa'
  | 'Davos'
  | 'Sublimacion';

export interface Technology {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
}

export interface Fabric {
  readonly id: string;
  readonly name: string;
  readonly base: string;
  readonly composition: string;
  readonly weave: WeaveType;
  readonly weight: string;
  readonly width: string;
  readonly technologies: readonly string[];
  readonly printRoutes: readonly PrintRoute[];
  readonly image: string;
  readonly isNew?: boolean;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly foregroundColor: string;
  readonly fabricIds: readonly string[];
  readonly description?: string;
}
