import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async addCategory(name: string) {
    const category = new Category();
    const hasCategory = await this.categoryRepository.findOneBy({ name });
    if (hasCategory) {
      return { code: 0, message: '该名称已经存在' };
    }
    category.name = name;
    await this.categoryRepository.save(category);
    return { message: '添加成功' };
  }

  async updateCategory(id: number, name: string) {
    const category = new Category();
    const hasCategory = await this.categoryRepository.findOneBy({ id });
    if (!hasCategory) {
      return { code: 0, message: '未查询到该名称' };
    }
    category.id = hasCategory.id;
    category.name = name;
    await this.categoryRepository.update(hasCategory, category);
    return { message: '修改成功' };
  }

  async deleteCategory(id: number) {
    const hasCategory = await this.categoryRepository.findOneBy({ id });
    if (!hasCategory) {
      return { code: 0, message: '未查询到该名称' };
    }
    const deleteRes = await this.categoryRepository.delete(hasCategory);
    if (deleteRes?.affected > 0) {
      return { message: '删除成功' };
    }
    return { message: '删除失败' };
  }
}
