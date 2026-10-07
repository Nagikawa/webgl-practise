export type PracticeKind = "2d" | "3d";

export type PracticeMeta = {
  slug: string;
  title: string;
  description: string;
  kind: PracticeKind;
  group: string;
};

/**
 * Route metadata only.
 * Do not import Three, R3F, shaders, loaders or postprocessing here.
 */
export const practices: PracticeMeta[] = [
  {
    slug: "00-r3f-2d-sandbox",
    title: "R3F 2D Shader Sandbox",
    description: "Orthographic camera + full-screen shader plane.",
    kind: "2d",
    group: "2D",
  },
  {
    slug: "01-wobbly-liquid",
    title: "Wobbly Liquid Bottle",
    description: "Custom GLSL liquid + glass transmission + interaction.",
    kind: "3d",
    group: "3D",
  },
  {
    slug: "02-piet-mondrian",
    title: "Piet Mondrian",
    description: "Rectangle masks + asymmetric grid + square 2D composition.",
    kind: "2d",
    group: "2D",
  },
];
