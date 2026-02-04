export function buildWhere(
  filters: Record<string, any> = {},
  options?: {
    stringFields?: string[];
    exactFields?: string[];
    baseWhere?: Record<string, any>;
  },
) {
  const where: Record<string, any> = {
    ...(options?.baseWhere ?? {}),
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;

    if (options?.stringFields?.includes(key)) {
      where[key] = { contains: value };
    } else if (options?.exactFields?.includes(key)) {
      where[key] = value;
    }
  }

  return where;
}
