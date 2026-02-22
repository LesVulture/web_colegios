export type WeaveType = 'Plano' | 'Punto';

export type PrintRoute =
  | 'Unicolor'
  | 'Rotativa'
  | 'Davos'
  | 'Sublimación';

export interface Technology {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly expandedDescription?: string;
}

export interface PersonalizationOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
}

export interface CollarColor {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
  readonly productCode: string;
}

export interface CollarSize {
  readonly size: string;
  readonly collarMeasure: string;
  readonly cuffMeasure: string;
}

export interface CollarData {
  readonly material: string;
  readonly guarantee: string;
  readonly technologies: readonly string[];
  readonly colors: readonly CollarColor[];
  readonly sizes: {
    readonly children: readonly CollarSize[];
    readonly adolescentsAdults: readonly CollarSize[];
  };
  readonly commercialNotes: readonly string[];
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
  readonly image: string;
  readonly imagePosition?: string;
}
