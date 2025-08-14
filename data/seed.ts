export type Person = { id: string; name: string; avatar?: string };
export type Post = { id: string; personId: string };

export const people: Person[] = [
  { id: "u1", name: "Ava" },
  { id: "u2", name: "Malik" },
  { id: "u3", name: "Noah" },
  { id: "u4", name: "Sofia" },
  { id: "u5", name: "Leo" }
];

// each person has a few placeholder posts
export const postsByPerson: Record<string, Post[]> = Object.fromEntries(
  people.map((p) => [
    p.id,
    Array.from({ length: 6 }).map((_, i) => ({ id: `${p.id}-p${i}`, personId: p.id }))
  ])
);

// timeline sections: one section per person (dot)
export const timelineSections = people.map((p) => ({
  key: p.id,
  title: p.name,
  data: postsByPerson[p.id]
}));
