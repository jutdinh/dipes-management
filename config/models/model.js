const Table = require("./table");
const {
  Field,
  Number,
  String,
  Datetime,
  Int,
  Bool,
  Enum,
  List,
  Serialized,
} = require("./fields");
const {
  successLog,
  errorLog,
  warningLog,
  infoLog,
  log,
} = require("../../functions/loggers");
class Model {
  static types = {
    number: Number,
    int: Int,
    string: String,
    datetime: Datetime,
    bool: Bool,
    enum: Enum,
    array: List,
    unknown: Field,
    model: Model,
    json: Serialized,
  };
  #__props = [];
  #__primaryKey = [];
  #__database = undefined;
  #__data = undefined;
  #__paths = [];
  #__indexings = [];

  static getType = () => {
    return "model";
  };

  constructor(modelName = undefined) {
    this.__datatype = "model";
    this.__fieldName = "";
    this.__modelName = modelName;

    if (modelName) {
      this.__addProperty__("id", Model.types.int, {
        required: false,
        auto: true,
      });
    }
  }

  getType = () => {
    return this.__datatype;
  };

  getFormatedData = () => {
    return this.__getDataRecursive__(this, this.#__data);
  };

  getData = () => {
    return this.#__data;
  };

  getPaths = () => {
    return this.#__paths;
  };

  getModel = () => {
    if (!this.#__database) {
      this.__initDatabase__();
    }
    return this.#__database;
  };

  setDefaultValue = (data) => {
    const serializedData = this.__recursiveTreeWithData__(this, data);
    this.#__data = serializedData;

    const paths = this.__listAllPath__(this.#__data);
    this.#__paths = paths;
  };

  setData = (newData) => {
    const parsedData = this.__recursiveTreeWithData__(this, newData);
    this.#__data = parsedData;
    this.#__paths = this.__listAllPath__(this.#__data);
  };

  save = async () => {
    if (this.__modelName != undefined) {
      const fulfilledData = this.__recursiveTreeToFulfillData__(
        this,
        this.#__data
      );
      this.#__data = fulfilledData;
      const { id } = fulfilledData;
      if (!this.#__database) {
        this.__initDatabase__();
      }

      if (id != undefined) {
        const updateValues = this.__listAllPathAndValue__();
        await this.#__database.__updateObject__(updateValues);
        successLog("Cập nhật dữ liệu thành công");
      } else {
        const filledData = await this.__fillDataFromProperties__();
        this.#__data = filledData;
        await this.#__database.__insertRawObject__(filledData);

        successLog("Chèn dữ liệu thành công");
      }
    } else {
      errorLog("Không thể lưu thuộc tính thuộc một model khác");
    }
  };

  formatQuery = (query) => {
    const stringify = JSON.stringify(query);
    return JSON.parse(stringify.replaceAll(".", "[__dot__]"));
  };

  find = async (rawQuery = undefined, formatQuery = true) => {
    let query = rawQuery;
    if (formatQuery) {
      query = this.formatQuery(rawQuery);
    }
    log(query, "FORMATED QUERY");
    if (!this.#__database) {
      this.__initDatabase__();
    }
    const type = typeof query;

    switch (type) {
      case "number":
      case "undefined":
        return this.#__database.__find__(query);
      default:
        return this.#__database.__findCriteria__(query);
    }
  };

  findAll = async (rawQuery = {}, formatQuery = true) => {
    let query = rawQuery;
    if (formatQuery) {
      query = this.formatQuery(rawQuery);
    }
    log(query, "FORMATED QUERY");
    if (!this.#__database) {
      this.__initDatabase__();
    }
    return this.#__database.__findAll__(query);
  };

  remove = async () => {
    if (!this.#__database) {
      this.__initDatabase__();
    }
    return this.#__database.__deleteObject__({ id: this.getData().id });
  };

  __initDatabase__ = () => {
    this.#__database = new Table(this.__modelName);
  };

  __addPrimaryKey__ = (fieldNames) => {
    const fields = [];
    if (typeof fieldNames == "string") {
      fields.push(fieldNames);
    } else {
      if (Array.isArray(fieldNames)) {
        fields.push(...fieldNames);
      } else {
        errorLog(
          "Thêm khóa chính thất bại: Kiểu dữ liệu không hợp lệ, khóa chính phải có kiểu <String> || <String>[]"
        );
      }
    }
    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const oldPrimaryKey = [...this.#__primaryKey];
        if (this.__doesPropertyExist__(field)) {
          if (!this.__isFieldPrimary__(field)) {
            this.#__primaryKey.push(field);
            infoLog(
              `Thêm khóa chính thành công: ${this.__getName__()}(${oldPrimaryKey.join(
                ", "
              )}) => ${this.__getName__()}(${this.#__primaryKey.join(", ")})`
            );
          } else {
            warningLog(
              `Thêm khóa chính thất bại: Trường ${field} đã là khóa chính`
            );
          }
        } else {
          errorLog(`Thêm khóa chính thất bại: Trường ${field} không tồn tại`);
        }
      }
    }
  };

  __getPrimaryKey__ = () => {
    return this.#__primaryKey;
  };

  __addIndexing__ = (fields = []) => {
    const indexing = {};
    for (let i = 0; i < fields.length; i++) {
      indexing[fields[i]] = 1;
    }

    this.#__indexings.push(indexing);
  };

  __applyIndexings__ = async () => {
    for (let i = 0; i < this.#__indexings.length; i++) {
      await Database.createIndex(this.__modelName, this.#__indexings[i]);
    }
  };

  __doesPropertyExist__ = (propertyName) => {
    if (this[propertyName] != undefined) {
      return true;
    }
    return false;
  };

  __isFieldPrimary__ = (field) => {
    return this.#__primaryKey.indexOf(field) != -1 ? true : false;
  };

  __getName__ = () => {
    return this.__getNameRecursive__(this);
  };

  __addPath__ = (path) => {
    if (this.#__paths.indexOf(path) == -1) {
      this.#__paths.push(path);
    }
  };

  __dotEncode__ = (value) => {
    if (value != undefined && typeof value == "string") {
      return value.replaceAll(".", "[__dot__]");
    }
    return value;
  };

  __dotDecode__ = (value) => {
    if (value != undefined && typeof value == "string") {
      return value.replaceAll("[__dot__]", ".");
    }
    return value;
  };

  __getDataRecursive__ = (rawTree, data) => {
    const tree = { ...rawTree, __parent: undefined };
    const keys = Object.keys(tree);

    const properties = {};
    for (let i = 0; i < keys.length; i++) {
      const Property = tree[keys[i]];
      const datatype = Property?.__datatype;

      if (datatype) {
        if (datatype == "model") {
          const childrenData = data[Property.__fieldName];
          const children = Object.keys(childrenData ? childrenData : {});
          properties[Property.__fieldName] = {};
          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            properties[Property.__fieldName][child] = this.__getDataRecursive__(
              Property,
              data[Property.__fieldName][child],
              child
            );
          }
        } else {
          if (datatype == "json") {
            const childrenData = data[Property.__fieldName];
            const children = Object.keys(childrenData ? childrenData : {});
            properties[Property.__fieldName] = this.__getDataRecursive__(
              Property,
              data[Property.__fieldName]
            );
          } else {
            Property.value(data[Property.__fieldName]); /* Auto validation */
            if (Property.__datatype == "datetime") {
              properties[Property.__fieldName] = data[Property.__fieldName]
                ? Property.getFormatedValue()
                : Property.__default;
            } else {
              properties[Property.__fieldName] =
                data[Property.__fieldName] != undefined
                  ? this.__dotDecode__(Property.value())
                  : Property.__default;
            }
          }
        }
      }
    }
    return properties;
  };

  __getNameRecursive__ = (thisObject) => {
    if (thisObject.__parent != undefined) {
      if (thisObject.__parent.__datatype == "model") {
        return (
          this.__getNameRecursive__(thisObject.__parent) +
          `.${
            thisObject.__modelName
              ? thisObject.__modelName
              : thisObject.__fieldName
          }`
        );
      } else {
        return (
          this.__getNameRecursive__(thisObject.__parent) +
          `.${thisObject.__fieldName}`
        );
      }
    } else {
      return thisObject.__fieldName
        ? thisObject.__fieldName
        : thisObject.__modelName;
    }
  };

  __addProperty__ = (
    propertyName,
    dataTypeObject,
    dataTypeProperties = undefined
  ) => {
    const type = dataTypeObject.getType();

    if (!this.__doesPropertyExist__(propertyName)) {
      if (type == "model") {
        this[`${propertyName}`] = new dataTypeObject();
        this[`${propertyName}`].__fieldName = propertyName;
        infoLog(
          `${this.__getName__()} => { ...${this.__getName__()}, ${propertyName}: <MODEL> }`
        );
      } else {
        const fieldObject = new dataTypeObject(
          propertyName,
          undefined,
          dataTypeProperties
        );
        this[`${propertyName}`] = fieldObject;
        infoLog(
          `${this.__getName__()} => { ...${this.__getName__()}, ${propertyName}: <${
            fieldObject.__datatype
          }> }`
        );
      }
      const parent = { ...this };
      this[`${propertyName}`].__parent = parent;
    } else {
      warningLog(`${propertyName} không được thêm vì nó đã tồn tại`);
    }
  };

  __recursiveTree__ = (rawTree) => {
    const tree = { ...rawTree, __parent: undefined };
    const keys = Object.keys(tree);

    const properties = {};
    for (let i = 0; i < keys.length; i++) {
      const Property = tree[keys[i]];
      const datatype = Property?.__datatype;
      if (datatype) {
        if (datatype == "model") {
          properties[Property.__fieldName] = this.__recursiveTree__(Property);
        } else {
          if (datatype == "json") {
            properties[Property.__fieldName] = this.__recursiveTree__(Property);
          } else {
            properties[Property.__fieldName] = `<${Property.__datatype}>`;
          }
        }
      }
    }
    return properties;
  };

  __recursiveTreeWithData__ = (rawTree, data = {}, childAt = undefined) => {
    const tree = { ...rawTree, __parent: undefined };
    const keys = Object.keys(tree);

    const properties = {};
    for (let i = 0; i < keys.length; i++) {
      const Property = tree[keys[i]];
      const datatype = Property?.__datatype;

      if (datatype) {
        if (datatype == "model") {
          const childrenData = data[Property.__fieldName];
          const children = Object.keys(childrenData ? childrenData : {});
          properties[Property.__fieldName] = {};
          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            properties[Property.__fieldName][child] =
              this.__recursiveTreeWithData__(
                Property,
                data[Property.__fieldName][child],
                child
              );
          }
        } else {
          if (datatype == "json") {
            const childrenData = data[Property.__fieldName];
            properties[Property.__fieldName] = this.__recursiveTreeWithData__(
              Property,
              data[Property.__fieldName]
            );
          } else {
            Property.value(data[Property.__fieldName]); /* Auto validation */
            properties[Property.__fieldName] =
              data[Property.__fieldName] != undefined
                ? this.__dotDecode__(data[Property.__fieldName])
                : Property.__default;
            // properties[ Property.__fieldName ] = Property.value()
          }
        }
      }
    }
    return properties;
  };

  __traversal__ = () => {
    const start = new Date();
    const tree = this.__recursiveTree__(this);
    this.texture = tree;
    // log(tree, 322)
  };

  __recursiveTreeToFulfillData__ = (rawTree, data = {}) => {
    const tree = { ...rawTree, __parent: undefined };
    const keys = Object.keys(tree);

    const properties = {};
    for (let i = 0; i < keys.length; i++) {
      const Property = tree[keys[i]];
      const datatype = Property?.__datatype;

      if (datatype) {
        if (datatype == "model") {
          const childrenData = data[Property.__fieldName];
          const children = Object.keys(childrenData ? childrenData : {});
          properties[Property.__fieldName] = {};

          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            properties[Property.__fieldName][child] =
              this.__recursiveTreeToFulfillData__(
                Property,
                data[Property.__fieldName][child]
              );
          }
        } else {
          if (datatype == "json") {
            properties[Property.__fieldName] =
              this.__recursiveTreeToFulfillData__(
                Property,
                data[Property.__fieldName]
              );
          } else {
            properties[Property.__fieldName] = this.__dotEncode__(
              data[Property.__fieldName]
            );
          }
        }
      }
    }
    return properties;
  };

  __modifyChildrenRecursive__ = (parent, paths, data) => {
    if (paths.length > 1) {
      if (parent[paths[0]] != undefined) {
        parent[paths[0]] = this.__modifyChildrenRecursive__(
          parent[paths[0]],
          paths.splice(1),
          data
        );
      }
    } else {
      parent[paths[0]] = data;
    }
    return parent;
  };

  __modifyChildren__ = (path, value, force = false) => {
    if (force) {
      const splittedPath = path.split(".");
      const data = this.getData();
      const newData = this.__modifyChildrenRecursive__(
        { ...data },
        splittedPath,
        value
      );
      this.__recursiveTreeWithData__(newData);
      this.#__data = newData;
    } else {
      if (value != undefined) {
        const splittedPath = path.split(".");
        const data = this.getData();
        const newData = this.__modifyChildrenRecursive__(
          { ...data },
          splittedPath,
          value
        );
        this.__recursiveTreeWithData__(newData);
        this.#__data = newData;
      }
    }
  };

  __modifyAndSaveChange__ = async (path, value) => {
    if (!this.#__database) {
      this.__initDatabase__();
    }
    const data = this.getData();
    if (data.id != undefined) {
      const newValues = { id: data.id };
      newValues[path] = value;
      await this.#__database.__updateObject__(newValues);
    } else {
      errorLog(
        "Không thể cập nhật vì đối tượng không tồn tại trong cơ sở dữ liệu"
      );
    }
  };

  __listAllPathAndValue__ = () => {
    const data = this.getData();
    const paths = this.getPaths();
    const dataInPair = {};
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      const splittedPath = path.split(".");
      let pathData = data;
      for (let j = 0; j < splittedPath.length; j++) {
        if (pathData != undefined) {
          pathData = pathData[splittedPath[j]];
        }
      }
      dataInPair[path] = pathData;
    }
    log(dataInPair, 268);
    return dataInPair;
  };

  __listAllPath__ = (data, parentPath = "") => {
    const keys = Object.keys(data);
    const paths = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = data[key];
      if (typeof child == "object") {
        if (child instanceof Date) {
          if (parentPath.length > 0) {
            paths.push(`${parentPath}.${key}`);
          } else {
            paths.push(`${key}`);
          }
        } else {
          if (!Array.isArray(child)) {
            if (parentPath.length > 0) {
              paths.push(
                ...this.__listAllPath__(child, `${parentPath}.${key}`)
              );
            } else {
              paths.push(...this.__listAllPath__(child, `${key}`));
            }
          } else {
            if (parentPath.length > 0) {
              paths.push(`${parentPath}.${key}`);
            } else {
              paths.push(`${key}`);
            }
          }
        }
      } else {
        if (parentPath.length > 0) {
          paths.push(`${parentPath}.${key}`);
        } else {
          paths.push(`${key}`);
        }
      }
    }
    return paths;
  };

  __fillDataFromPropertiesRecursive__ = async (rawTree, data) => {
    const tree = { ...rawTree, __parent: undefined };
    const keys = Object.keys(tree);

    if (!this.#__database) {
      this.__initDatabase__();
    }

    const properties = {};
    for (let i = 0; i < keys.length; i++) {
      const Property = tree[keys[i]];
      const datatype = Property?.__datatype;

      if (datatype) {
        if (datatype == "model") {
          const childrenData = data[Property.__fieldName];
          const children = Object.keys(childrenData ? childrenData : {});
          properties[Property.__fieldName] = {};

          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            properties[Property.__fieldName][child] =
              await this.__fillDataFromPropertiesRecursive__(
                Property,
                data[Property.__fieldName][child]
              );
          }
        } else {
          if (datatype == "json") {
            properties[Property.__fieldName] =
              await this.__fillDataFromPropertiesRecursive__(
                Property,
                data[Property.__fieldName]
              );
          } else {
            if (Property.__auto) {
              if (data[Property.__fieldName] == undefined) {
                properties[Property.__fieldName] =
                  await this.#__database.__getNewId__();
              } else {
                properties[Property.__fieldName] = data[Property.__fieldName];
              }
            } else {
              properties[Property.__fieldName] = this.__dotEncode__(
                data[Property.__fieldName]
              );
            }

            if (
              Property.__required &&
              data[Property.__fieldName] == undefined
            ) {
              const message = `Trường ${Property.__fieldName} không thể bị rỗng!`;
              throw Error(message);
            }
          }
        }
      }
    }
    return properties;
  };

  __fillDataFromProperties__ = async () => {
    const data = { ...this.getData() };
    const newData = this.__fillDataFromPropertiesRecursive__(this, data);
    return newData;
  };
}

module.exports = Model;
