// Тут все вообще не оптимизировано по быстродействию, массивы проходятся кучу раз, можно переписать.

export type IndexObject = {
  index: number;
  id: number;
};

export type StructuredIndexObjects = {
  toCreate: IndexObject[];
  toUpdate: IndexObject[];
  toDelete: IndexObject[];
};

const createStructure = (
  newObjects: IndexObject[],
  oldObjects: IndexObject[],
): StructuredIndexObjects => {
  const ret: StructuredIndexObjects = {
    toCreate: [],
    toUpdate: [],
    toDelete: [],
  };

  for (const old of oldObjects) {
    const updated = newObjects.find(({ id }) => id === old.id);
    if (!updated) {
      ret.toDelete.push(old);
    } else {
      ret.toUpdate.push(updated);
    }
  }

  ret.toCreate.push(...newObjects.filter(({ id }) => !oldObjects.find((old) => old.id === id)));

  return ret;
};

const processIndexed = (
  newObjects: IndexObject[],
  oldObjects: IndexObject[],
): StructuredIndexObjects | null => {
  const sorted = newObjects.sort((a, b) => a.index - b.index);
  if (!sorted.length) {
    return null;
  }

  for (const [i, { index }] of sorted.entries()) {
    if (i === 0) {
      continue;
    }

    if (!sorted[i - 1]?.index || index !== sorted[i - 1]!.index + 1) {
      return null;
    }
  }

  return createStructure(sorted, oldObjects);
};

/**
 * Reindex objects. If index === 0, adds element to the end
 */
export const indexObjects = (
  type: 'create' | 'edit' | 'delete',
  { id, index }: IndexObject,
  _objects: IndexObject[],
  oldIndex?: number, // for edit
): StructuredIndexObjects | null => {
  const objects = Array.from(_objects);
  const sorted = objects.sort((a, b) => a.index - b.index);
  const oldObjects = Array.from(sorted);
  const maxIndex = sorted.at(-1)?.index || 0;

  if (type === 'delete') {
    const objI = sorted.findIndex((obj) => obj.index === index);
    if (objI === -1) {
      return null;
    }

    delete sorted[objI];

    return processIndexed(
      sorted.flat(0).map((obj) => (obj.index > index ? { id: obj.id, index: obj.index - 1 } : obj)),
      oldObjects,
    );
  }

  if (type === 'create') {
    if (index < 1 || index > maxIndex) {
      sorted.push({ id, index: maxIndex ? maxIndex + 1 : 1 });
      return processIndexed(sorted, oldObjects);
    }

    return processIndexed(
      [
        ...sorted.map((obj) => (obj.index >= index ? { id: obj.id, index: obj.index + 1 } : obj)),
        { id, index },
      ],
      oldObjects,
    );
  }

  const oldObjI = sorted.findIndex((obj) => obj.index === oldIndex);
  if (oldObjI === -1) {
    return null;
  }

  const oldObj = sorted[oldObjI]!;

  if (index === oldObj.index) {
    oldObj.id = id;
    return createStructure(sorted, oldObjects);
  }

  if (index < 1 || index >= maxIndex) {
    const newSorted = sorted.map((obj) =>
      obj.index > oldObj.index ? { id: obj.id, index: obj.index - 1 } : obj,
    );
    oldObj.index = maxIndex;
    oldObj.id = id;
    return processIndexed(newSorted, oldObjects);
  }

  if (index > oldObj.index) {
    const newSorted = sorted.map((obj) =>
      obj.index > oldObj.index && obj.index <= index ? { id: obj.id, index: obj.index - 1 } : obj,
    );
    oldObj.index = index;
    oldObj.id = id;
    return processIndexed(newSorted, oldObjects);
  }

  const newSorted = sorted.map((obj) =>
    obj.index < oldObj.index && obj.index >= index ? { id: obj.id, index: obj.index + 1 } : obj,
  );
  oldObj.index = index;
  oldObj.id = id;
  return processIndexed(newSorted, oldObjects);
};
