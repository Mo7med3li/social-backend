import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  //   Create a new document
  async createNewDocument(document: Partial<T>): Promise<T> {
    return await this.model.create(document);
  }

  //   Find one document
  async findOneDocument(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.model.findOne(filter, projection, options);
  }

  //   Find all documents
  async findAllDocuments(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return await this.model.find(filter, projection, options);
  }

  //   Find document by id
  async findDocumentById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  //   Update one document
  async updateOneDocument(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });
  }

  //   Update many documents
  async updateManyDocuments() {}

  //   Delete one document
  async deleteOneDocument() {}

  //   Delete many documents
  async deleteManyDocuments() {}

  //   Find document and update
  async findDOcumentAndUpdate() {}

  //   Find document and delete
  async findDocumentAndDelete() {}
}
