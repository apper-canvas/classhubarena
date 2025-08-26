import classesData from "@/services/mockData/classes.json";

const classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === id);
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay(400);
    const newClass = {
      Id: Math.max(...classes.map(c => c.Id)) + 1,
      ...classData
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(350);
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    const deleted = classes.splice(index, 1)[0];
    return { ...deleted };
  }
};